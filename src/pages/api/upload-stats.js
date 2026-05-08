import fs from "node:fs/promises";
import path from "node:path";
import { listBlobEntries } from "../../lib/runtime-storage.js";

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

const UPLOAD_FOLDERS = [
  { root: "public", folder: "blog-images", label: "Blog images" },
  { root: "public", folder: "blog-thumbs", label: "Blog thumbnails" },
  { root: "public", folder: "markdown-images", label: "Markdown images" },
  { root: "public", folder: "gallery-images", label: "Gallery images" },
  { root: "public", folder: "page-images", label: "Page images" },
  { root: "public", folder: "hero-images", label: "Hero images" },
  { root: "public", folder: "home-section-assets", label: "Home section assets" },
  { root: "public", folder: "how-it-works-assets", label: "How-it-works assets" },
  { root: "public", folder: "site-assets", label: "Site assets" },
  { root: "client", folder: "markdown-images", label: "Markdown images runtime mirror" },
];

const BLOB_PREFIXES = [
  "blog-images",
  "blog-thumbs",
  "markdown-images",
  "gallery-images",
  "page-images",
  "hero-images",
  "home-section-assets",
  "how-it-works-assets",
  "site-assets",
];

function isImageFile(filename) {
  return IMAGE_EXTENSIONS.has(path.extname(filename).toLowerCase());
}

function toPublicUrl(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");
  if (normalized.startsWith("public/")) {
    return `/${normalized.replace(/^public\//, "")}`;
  }
  return "";
}

function normalizeDate(value) {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString();

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}

function sortByModifiedDesc(a, b) {
  return normalizeDate(b.modifiedAt).localeCompare(normalizeDate(a.modifiedAt));
}

async function collectFiles(baseDir, displayFolder) {
  const files = [];

  async function walk(dir) {
    let entries = [];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
          return;
        }

        if (!entry.isFile() || !isImageFile(entry.name)) return;

        const stats = await fs.stat(fullPath);
        const relativePath = path.relative(process.cwd(), fullPath);
        files.push({
          name: entry.name,
          folder: displayFolder,
          path: relativePath.replace(/\\/g, "/"),
          url: toPublicUrl(relativePath),
          size: stats.size,
          modifiedAt: normalizeDate(stats.mtime),
          storage: "filesystem",
        });
      }),
    );
  }

  await walk(baseDir);
  return files;
}

async function readLocalFolder({ root, folder, label }) {
  const displayFolder = `${root}/${folder}`;
  const baseDir = path.join(process.cwd(), root, folder);
  const files = await collectFiles(baseDir, displayFolder);
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const latestModifiedAt = files
    .map((file) => file.modifiedAt)
    .filter(Boolean)
    .map(normalizeDate)
    .sort()
    .at(-1) || "";

  return {
    label,
    folder: displayFolder,
    storage: "filesystem",
    count: files.length,
    totalSize,
    latestModifiedAt,
    files: files.sort(sortByModifiedDesc),
  };
}

async function readBlobFolder(prefix) {
  const entries = (await listBlobEntries(`${prefix}/`)).filter((entry) =>
    isImageFile(entry.pathname || ""),
  );
  const files = entries.map((entry) => ({
    name: path.basename(entry.pathname || ""),
    folder: prefix,
    path: entry.pathname || "",
    url: entry.url || "",
    size: Number(entry.size) || 0,
    modifiedAt: normalizeDate(entry.uploadedAt),
    storage: "vercel-blob",
  }));
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const latestModifiedAt = files
    .map((file) => file.modifiedAt)
    .filter(Boolean)
    .map(normalizeDate)
    .sort()
    .at(-1) || "";

  return {
    label: `${prefix} blob storage`,
    folder: prefix,
    storage: "vercel-blob",
    count: files.length,
    totalSize,
    latestModifiedAt,
    files: files.sort(sortByModifiedDesc),
  };
}

export async function GET() {
  try {
    const localFolders = await Promise.all(UPLOAD_FOLDERS.map(readLocalFolder));
    const blobFolders = await Promise.all(BLOB_PREFIXES.map(readBlobFolder));
    const folders = [...localFolders, ...blobFolders].filter(
      (folder) => folder.count > 0 || folder.storage === "filesystem",
    );
    const allFiles = folders.flatMap((folder) => folder.files);
    const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);

    return new Response(
      JSON.stringify({
        generatedAt: new Date().toISOString(),
        totalImages: allFiles.length,
        totalSize,
        folders,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error reading upload stats:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Could not read upload stats." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
