import fs from "node:fs/promises";
import path from "node:path";
import {
  deleteBlobEntry,
  hasBlobStorage,
  isReadonlyRuntime,
  listBlobEntries,
  readTextBlob,
} from "../../lib/runtime-storage.js";

export const prerender = false;

const POST_ASSET_DIRS = ["blog-images", "blog-thumbs", "markdown-images"];
const IMAGE_EXTENSION_PATTERN = /\.(avif|gif|jpe?g|png|webp)$/i;

function getFrontmatterValue(content, key) {
  const frontmatterMatch = String(content || "").match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return "";

  const line = frontmatterMatch[1]
    .split("\n")
    .find((frontmatterLine) => frontmatterLine.startsWith(`${key}:`));

  if (!line) return "";

  const value = line.replace(`${key}:`, "").trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
  }

  return value;
}

function getPostAssetPath(assetUrl = "") {
  const value = String(assetUrl || "").trim();
  if (!value || value.startsWith("data:image/")) return "";

  let pathname = value;
  if (/^https?:\/\//i.test(value)) {
    try {
      pathname = new URL(value).pathname;
    } catch {
      return "";
    }
  }

  const normalizedPath = pathname.replace(/\\/g, "/");
  for (const directory of POST_ASSET_DIRS) {
    const directoryPrefix = `/${directory}/`;
    const prefixIndex = normalizedPath.indexOf(directoryPrefix);
    const hasRelativePrefix = normalizedPath.startsWith(`${directory}/`);

    if (prefixIndex === -1 && !hasRelativePrefix) {
      continue;
    }

    const relativePath =
      prefixIndex >= 0
        ? normalizedPath.slice(prefixIndex + 1)
        : normalizedPath.replace(/^\/+/, "");
    const filename = path.basename(relativePath);
    if (!IMAGE_EXTENSION_PATTERN.test(filename)) return "";

    return `${directory}/${filename}`;
  }

  return "";
}

function getGeneratedThumbnailPath(assetPath) {
  const directory = assetPath.split("/")[0];
  const filename = path.basename(assetPath);
  if (directory !== "blog-images" || !/\.webp$/i.test(filename)) return "";

  return `blog-thumbs/${filename.replace(/\.webp$/i, "-thumb.webp")}`;
}

function collectPostAssetPaths(content) {
  const paths = new Set();
  const addAssetUrl = (url) => {
    const assetPath = getPostAssetPath(url);
    if (!assetPath) return;

    paths.add(assetPath);
    const generatedThumbnailPath = getGeneratedThumbnailPath(assetPath);
    if (generatedThumbnailPath) paths.add(generatedThumbnailPath);
  };

  ["image", "thumbnail"].forEach((key) => addAssetUrl(getFrontmatterValue(content, key)));

  const contentText = String(content || "");
  const linkedAssetPattern =
    /(?:src=["']|\]\()([^"')\s<>]*(?:\/|^)(?:blog-images|blog-thumbs|markdown-images)\/[^"')\s<>]+)/gi;
  let match;

  while ((match = linkedAssetPattern.exec(contentText)) !== null) {
    addAssetUrl(match[1]);
  }

  return paths;
}

async function getRemainingPostAssetPaths(blogDir, deletedFilename) {
  const remainingPaths = new Set();
  const addContent = (content) => {
    collectPostAssetPaths(content).forEach((assetPath) => remainingPaths.add(assetPath));
  };

  if (!isReadonlyRuntime()) {
    try {
      const files = await fs.readdir(blogDir);
      await Promise.all(
        files
          .filter((filename) => filename.endsWith(".md") && filename !== deletedFilename)
          .map(async (filename) => {
            addContent(await fs.readFile(path.join(blogDir, filename), "utf8"));
          }),
      );
    } catch {
      // The blog directory may not exist in a fresh install.
    }
  }

  try {
    const blobEntries = await listBlobEntries("blog-posts/");
    await Promise.all(
      blobEntries
        .filter((entry) => path.basename(entry.pathname) !== deletedFilename)
        .map(async (entry) => {
          const response = await fetch(entry.downloadUrl || entry.url);
          if (response.ok) addContent(await response.text());
        }),
    );
  } catch (error) {
    console.error("Could not scan remaining blob posts for image references:", error);
  }

  return remainingPaths;
}

function getLocalAssetDirs(assetPath) {
  const directory = assetPath.split("/")[0];
  const cwd = process.cwd();
  const dirs = [
    path.join(cwd, "public", directory),
    path.join(cwd, "dist", "client", directory),
  ];

  if (directory === "markdown-images") {
    dirs.push(path.join(cwd, "client", directory));
  }

  return dirs;
}

async function deleteLocalAsset(assetPath) {
  const filename = path.basename(assetPath);

  await Promise.all(
    getLocalAssetDirs(assetPath).map(async (localDir) => {
      const resolvedDir = path.resolve(localDir);
      const filePath = path.resolve(resolvedDir, filename);
      if (!filePath.startsWith(`${resolvedDir}${path.sep}`)) return;

      try {
        await fs.unlink(filePath);
      } catch (error) {
        if (error?.code !== "ENOENT") {
          throw error;
        }
      }
    }),
  );
}

async function deletePostAssets(assetPaths) {
  const deletedAssets = [];

  for (const assetPath of assetPaths) {
    let deleted = false;

    if (hasBlobStorage()) {
      try {
        await deleteBlobEntry(assetPath);
        deleted = true;
      } catch (error) {
        console.error(`Could not delete blob post asset ${assetPath}:`, error);
      }
    }

    if (!isReadonlyRuntime()) {
      try {
        await deleteLocalAsset(assetPath);
        deleted = true;
      } catch (error) {
        console.error(`Could not delete local post asset ${assetPath}:`, error);
      }
    }

    if (deleted) deletedAssets.push(assetPath);
  }

  return deletedAssets;
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { filename } = data;

    if (!filename || typeof filename !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid filename" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Ensure the request points to a single markdown file in the blog directory.
    const safeFilename = filename.endsWith(".md") ? filename : `${filename}.md`;
    if (/[\\/]/.test(safeFilename) || safeFilename === ".md") {
      return new Response(JSON.stringify({ error: "Invalid filename" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const blogDir = path.join(process.cwd(), "src", "content", "blog");
    const filePath = path.join(blogDir, safeFilename);

    const blobPath = `blog-posts/${safeFilename}`;
    const blobContent = await readTextBlob(blobPath);
    let postContent = blobContent || "";

    if (blobContent) {
      await deleteBlobEntry(blobPath);
    } else {
      if (isReadonlyRuntime()) {
        return new Response(JSON.stringify({ error: "File not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        return new Response(JSON.stringify({ error: "File not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Delete the file
      postContent = await fs.readFile(filePath, "utf8");
      await fs.unlink(filePath);
    }

    const remainingAssetPaths = await getRemainingPostAssetPaths(blogDir, safeFilename);
    const postAssetPaths = collectPostAssetPaths(postContent);
    const orphanedAssetPaths = [...postAssetPaths].filter(
      (assetPath) => !remainingAssetPaths.has(assetPath),
    );
    const deletedAssets = await deletePostAssets(orphanedAssetPaths);

    console.log(`Deleted blog post: ${safeFilename}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Deleted ${safeFilename}`,
        deletedAssets,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
