import fs from "node:fs/promises";
import path from "node:path";
import { deleteBlobEntry } from "../../lib/runtime-storage.js";

export const prerender = false;

const IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
]);

const LOCAL_UPLOAD_FOLDERS = [
  ["public", "blog-images"],
  ["public", "blog-thumbs"],
  ["public", "markdown-images"],
  ["public", "gallery-images"],
  ["public", "page-images"],
  ["public", "hero-images"],
  ["public", "home-section-assets"],
  ["public", "how-it-works-assets"],
  ["public", "site-assets"],
  ["client", "markdown-images"],
];

const BLOB_PREFIXES = new Set([
  "blog-images",
  "blog-thumbs",
  "markdown-images",
  "gallery-images",
  "page-images",
  "hero-images",
  "home-section-assets",
  "how-it-works-assets",
  "site-assets",
]);

function isImageFile(filePath) {
  return IMAGE_EXTENSIONS.has(path.extname(String(filePath || "")).toLowerCase());
}

function normalizeRequestPath(value) {
  return String(value || "").replace(/\\/g, "/").replace(/^\/+/, "").trim();
}

function isSafeRelativePath(value) {
  const normalized = normalizeRequestPath(value);
  return (
    normalized &&
    !path.isAbsolute(normalized) &&
    !normalized.split("/").includes("..") &&
    isImageFile(normalized)
  );
}

async function deleteLocalImage(requestPath) {
  const normalized = normalizeRequestPath(requestPath);
  if (!isSafeRelativePath(normalized)) {
    throw new Error("Invalid image path.");
  }

  for (const [root, folder] of LOCAL_UPLOAD_FOLDERS) {
    const allowedPrefix = `${root}/${folder}/`;
    if (!normalized.startsWith(allowedPrefix)) continue;

    const baseDir = path.resolve(process.cwd(), root, folder);
    const targetPath = path.resolve(process.cwd(), normalized);
    const relativeToBase = path.relative(baseDir, targetPath);

    if (
      relativeToBase.startsWith("..") ||
      path.isAbsolute(relativeToBase) ||
      !isImageFile(targetPath)
    ) {
      throw new Error("Image path is outside the upload folder.");
    }

    await fs.unlink(targetPath);
    return { deletedPath: normalized, storage: "filesystem" };
  }

  throw new Error("Image path is not in a known upload folder.");
}

async function deleteBlobImage(requestPath) {
  const normalized = normalizeRequestPath(requestPath);
  if (!isSafeRelativePath(normalized)) {
    throw new Error("Invalid blob image path.");
  }

  const [prefix] = normalized.split("/");
  if (!BLOB_PREFIXES.has(prefix)) {
    throw new Error("Blob image path is not in a known upload folder.");
  }

  await deleteBlobEntry(normalized);
  return { deletedPath: normalized, storage: "vercel-blob" };
}

export async function DELETE({ request }) {
  try {
    const data = await request.json();
    const storage = String(data.storage || "");
    const imagePath = data.path;
    const result =
      storage === "vercel-blob"
        ? await deleteBlobImage(imagePath)
        : await deleteLocalImage(imagePath);

    return new Response(JSON.stringify({ success: true, ...result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Could not delete image.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export async function POST(context) {
  return DELETE(context);
}
