import fs from "node:fs/promises";
import path from "node:path";
import {
  isReadonlyRuntime,
  listBlobEntries,
  readTextBlob,
  writeTextBlob,
} from "./runtime-storage.js";

export const PAGE_CONTENT_DIR = path.join(process.cwd(), "src", "content", "pages");
export const PAGE_BLOB_PREFIX = "site-pages/";
export const PAGE_TYPES = new Set(["normal", "gallery"]);

export function normalizePageType(value) {
  return PAGE_TYPES.has(value) ? value : "normal";
}

export function normalizePageFilename(value) {
  const text = String(value || "").trim();
  const withExtension = text.endsWith(".md") ? text : `${text}.md`;

  if (!withExtension || withExtension === ".md") return "";
  if (/[\\/]/.test(withExtension) || withExtension.includes("..")) return "";

  return withExtension
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+(?=\.md$)/g, "");
}

export function slugFromPageFilename(filename) {
  return normalizePageFilename(filename).replace(/\.md$/i, "");
}

export function stripFrontmatter(content) {
  const lines = String(content || "").split("\n");
  if (lines[0]?.trim() !== "---") return String(content || "");

  const endIndex = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  return endIndex === -1 ? String(content || "") : lines.slice(endIndex + 1).join("\n");
}

function unquoteFrontmatterValue(value) {
  const text = String(value || "").trim();
  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))
  ) {
    return text.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
  }

  return text;
}

export function parsePageMarkdown(content) {
  const text = String(content || "");
  const match = text.match(/^---\s*\n([\s\S]*?)\n---/);
  const body = match ? text.slice(match[0].length).trimStart() : text;
  const frontmatter = {};

  if (match) {
    for (const line of match[1].split("\n")) {
      const lineMatch = line.match(/^(\w+):\s*(.*)$/);
      if (!lineMatch) continue;

      const key = lineMatch[1];
      const value = unquoteFrontmatterValue(lineMatch[2]);
      if (key === "galleryImages") {
        try {
          frontmatter[key] = JSON.parse(value);
        } catch {
          frontmatter[key] = [];
        }
      } else {
        frontmatter[key] = value;
      }
    }
  }

  return {
    frontmatter: {
      title: frontmatter.title || "Untitled Page",
      description: frontmatter.description || "",
      pageType: normalizePageType(frontmatter.pageType),
      createdAt: frontmatter.createdAt || "",
      updatedAt: frontmatter.updatedAt || "",
      galleryImages: Array.isArray(frontmatter.galleryImages)
        ? frontmatter.galleryImages
        : [],
    },
    body,
  };
}

export function buildPageMarkdown({
  title,
  description,
  pageType,
  createdAt,
  galleryImages = [],
  content,
}) {
  const now = new Date().toISOString();
  const normalizedGalleryImages = Array.isArray(galleryImages) ? galleryImages : [];
  const frontmatter = [
    "---",
    `title: ${JSON.stringify(String(title || "Untitled Page").trim() || "Untitled Page")}`,
    `description: ${JSON.stringify(String(description || "").trim())}`,
    `pageType: ${JSON.stringify(normalizePageType(pageType))}`,
    `createdAt: ${JSON.stringify(createdAt || now)}`,
    `updatedAt: ${JSON.stringify(now)}`,
    `galleryImages: ${JSON.stringify(JSON.stringify(normalizedGalleryImages))}`,
    "---",
    "",
  ].join("\n");

  return `${frontmatter}${stripFrontmatter(content).trimStart()}\n`;
}

export async function readPageContent(filename) {
  const safeFilename = normalizePageFilename(filename);
  if (!safeFilename) return null;

  const blobContent = await readTextBlob(`${PAGE_BLOB_PREFIX}${safeFilename}`);
  if (blobContent) return blobContent;

  try {
    return await fs.readFile(path.join(PAGE_CONTENT_DIR, safeFilename), "utf-8");
  } catch {
    return null;
  }
}

export async function writePageContent(filename, content) {
  const safeFilename = normalizePageFilename(filename);
  if (!safeFilename) {
    throw new Error("Invalid filename");
  }

  if (isReadonlyRuntime()) {
    return writeTextBlob(`${PAGE_BLOB_PREFIX}${safeFilename}`, content, "text/markdown");
  }

  await fs.mkdir(PAGE_CONTENT_DIR, { recursive: true });
  await fs.writeFile(path.join(PAGE_CONTENT_DIR, safeFilename), content, "utf-8");
  return content;
}

export async function listPageFiles() {
  const pagesByFilename = new Map();

  if (!isReadonlyRuntime()) {
    try {
      const files = await fs.readdir(PAGE_CONTENT_DIR);
      await Promise.all(
        files
          .filter((filename) => filename.endsWith(".md"))
          .map(async (filename) => {
            const filePath = path.join(PAGE_CONTENT_DIR, filename);
            const [content, stats] = await Promise.all([
              fs.readFile(filePath, "utf-8"),
              fs.stat(filePath),
            ]);
            pagesByFilename.set(filename, {
              filename,
              content,
              updatedAtMs: stats.mtimeMs,
            });
          }),
      );
    } catch {
      // No standalone pages yet.
    }
  }

  for (const entry of await listBlobEntries(PAGE_BLOB_PREFIX)) {
    if (!entry.pathname.endsWith(".md")) continue;

    const response = await fetch(entry.downloadUrl || entry.url);
    const content = response.ok ? await response.text() : "";
    const filename = entry.pathname.replace(PAGE_BLOB_PREFIX, "");
    pagesByFilename.set(filename, {
      filename,
      content,
      updatedAtMs: new Date(entry.uploadedAt).getTime(),
    });
  }

  return [...pagesByFilename.values()]
    .map((page) => {
      const parsed = parsePageMarkdown(page.content);
      return {
        filename: page.filename,
        slug: slugFromPageFilename(page.filename),
        title: parsed.frontmatter.title,
        description: parsed.frontmatter.description,
        pageType: parsed.frontmatter.pageType,
        galleryImageCount: parsed.frontmatter.galleryImages.length,
        updatedAt: parsed.frontmatter.updatedAt || "",
        updatedAtMs: page.updatedAtMs,
      };
    })
    .sort((a, b) => b.updatedAtMs - a.updatedAtMs || a.filename.localeCompare(b.filename));
}
