import fs from "node:fs/promises";
import path from "node:path";
import {
  PAGE_BLOB_PREFIX,
  PAGE_CONTENT_DIR,
  normalizePageFilename,
  parsePageMarkdown,
  readPageContent,
} from "../../lib/static-pages.js";
import {
  deleteBlobEntry,
  hasBlobStorage,
  isReadonlyRuntime,
  listBlobEntries,
} from "../../lib/runtime-storage.js";

export const prerender = false;

const PAGE_ASSET_DIRS = ["page-images", "markdown-images"];
const IMAGE_EXTENSION_PATTERN = /\.(avif|gif|jpe?g|png|webp)$/i;

function getPageAssetPath(assetUrl = "") {
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
  for (const directory of PAGE_ASSET_DIRS) {
    const directoryPrefix = `/${directory}/`;
    const prefixIndex = normalizedPath.indexOf(directoryPrefix);
    const hasRelativePrefix = normalizedPath.startsWith(`${directory}/`);

    if (prefixIndex === -1 && !hasRelativePrefix) continue;

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

function collectPageAssetPaths(content) {
  const paths = new Set();
  const addAssetUrl = (url) => {
    const assetPath = getPageAssetPath(url);
    if (assetPath) paths.add(assetPath);
  };
  const parsed = parsePageMarkdown(content);

  (parsed.frontmatter.galleryImages || []).forEach((image) => {
    addAssetUrl(image?.imageUrl);
  });

  const linkedAssetPattern =
    /(?:src=["']|\]\()([^"')\s<>]*(?:\/|^)(?:page-images|markdown-images)\/[^"')\s<>]+)/gi;
  let match;

  while ((match = linkedAssetPattern.exec(String(content || ""))) !== null) {
    addAssetUrl(match[1]);
  }

  return paths;
}

async function getRemainingPageAssetPaths(deletedFilename) {
  const remainingPaths = new Set();
  const addContent = (content) => {
    collectPageAssetPaths(content).forEach((assetPath) => remainingPaths.add(assetPath));
  };

  if (!isReadonlyRuntime()) {
    try {
      const files = await fs.readdir(PAGE_CONTENT_DIR);
      await Promise.all(
        files
          .filter((filename) => filename.endsWith(".md") && filename !== deletedFilename)
          .map(async (filename) => {
            addContent(await fs.readFile(path.join(PAGE_CONTENT_DIR, filename), "utf-8"));
          }),
      );
    } catch {
      // No remaining standalone pages to scan.
    }
  }

  try {
    const blobEntries = await listBlobEntries(PAGE_BLOB_PREFIX);
    await Promise.all(
      blobEntries
        .filter((entry) => path.basename(entry.pathname) !== deletedFilename)
        .map(async (entry) => {
          const response = await fetch(entry.downloadUrl || entry.url);
          if (response.ok) addContent(await response.text());
        }),
    );
  } catch (error) {
    console.error("Could not scan remaining standalone pages for image references:", error);
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
        if (error?.code !== "ENOENT") throw error;
      }
    }),
  );
}

async function deletePageAssets(assetPaths) {
  const deletedAssets = [];

  for (const assetPath of assetPaths) {
    let deleted = false;

    if (hasBlobStorage()) {
      try {
        await deleteBlobEntry(assetPath);
        deleted = true;
      } catch (error) {
        console.error(`Could not delete blob page asset ${assetPath}:`, error);
      }
    }

    if (!isReadonlyRuntime()) {
      try {
        await deleteLocalAsset(assetPath);
        deleted = true;
      } catch (error) {
        console.error(`Could not delete local page asset ${assetPath}:`, error);
      }
    }

    if (deleted) deletedAssets.push(assetPath);
  }

  return deletedAssets;
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    const filename = normalizePageFilename(data.filename);
    if (!filename) {
      return new Response(JSON.stringify({ error: "Invalid filename" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const content = await readPageContent(filename);
    if (!content) {
      return new Response(JSON.stringify({ error: "Page not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (hasBlobStorage()) {
      await deleteBlobEntry(`${PAGE_BLOB_PREFIX}${filename}`);
    }

    if (!isReadonlyRuntime()) {
      try {
        await fs.unlink(path.join(PAGE_CONTENT_DIR, filename));
      } catch (error) {
        if (error?.code !== "ENOENT") throw error;
      }
    }

    const pageAssetPaths = collectPageAssetPaths(content);
    const remainingAssetPaths = await getRemainingPageAssetPaths(filename);
    const orphanedAssetPaths = [...pageAssetPaths].filter(
      (assetPath) => !remainingAssetPaths.has(assetPath),
    );
    const deletedAssets = await deletePageAssets(orphanedAssetPaths);

    return new Response(JSON.stringify({ success: true, filename, deletedAssets }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting standalone page:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
