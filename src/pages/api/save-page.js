import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  buildPageMarkdown,
  normalizePageFilename,
  normalizePageType,
  readPageContent,
  writePageContent,
} from "../../lib/static-pages.js";
import { saveAsset } from "../../lib/runtime-storage.js";

export const prerender = false;

const PAGE_IMAGE_DIR = "page-images";
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2200;
const WEBP_OPTIONS = {
  quality: 76,
  lossless: false,
  nearLossless: false,
  effort: 6,
  smartSubsample: true,
};

function getFullTimeStamp() {
  const now = new Date();
  const pad = (value, size = 2) => String(value).padStart(size, "0");

  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
    pad(now.getMilliseconds(), 3),
  ].join("");
}

function getRandomSuffix() {
  return Math.random().toString(36).slice(2, 7).padEnd(5, "0");
}

async function getPageImageDirs() {
  const cwd = process.cwd();
  const dirs = [path.join(cwd, "public", PAGE_IMAGE_DIR)];

  try {
    await fs.access(path.join(cwd, "dist", "client"));
    dirs.push(path.join(cwd, "dist", "client", PAGE_IMAGE_DIR));
  } catch {
    // Dev mode reads public assets directly.
  }

  return dirs;
}

async function savePageImage(imageBase64, label) {
  const matches = String(imageBase64 || "").match(/^data:(image\/[^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error(`${label} must be a valid image file.`);
  }

  const buffer = Buffer.from(matches[2], "base64");
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error(`${label} must be smaller than 12MB.`);
  }

  const image = sharp(buffer, { failOn: "none" }).rotate();
  const metadata = await image.metadata();
  const optimizedBuffer = await image
    .resize({
      width: MAX_IMAGE_DIMENSION,
      height: MAX_IMAGE_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp(WEBP_OPTIONS)
    .toBuffer();

  const filename = `${getFullTimeStamp()}-${getRandomSuffix()}.webp`;
  const asset = await saveAsset({
    directory: PAGE_IMAGE_DIR,
    filename,
    buffer: optimizedBuffer,
    localDirs: await getPageImageDirs(),
    contentType: "image/webp",
    inlineMime: "image/webp",
  });

  return {
    imageUrl: asset.url,
    width: Number(metadata.width) || null,
    height: Number(metadata.height) || null,
    storage: asset.storage,
  };
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    const filename = normalizePageFilename(data.filename);
    if (!filename) {
      return new Response(JSON.stringify({ error: "Filename must end with .md" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const title = String(data.title || "").trim();
    if (!title) {
      return new Response(JSON.stringify({ error: "Title is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existingContent = await readPageContent(filename);
    const existingCreatedAt = existingContent
      ? existingContent.match(/^---\s*\n[\s\S]*?createdAt:\s*["']?([^"'\n]+)["']?/m)?.[1]
      : "";
    const pageType = normalizePageType(data.pageType);
    const incomingGalleryImages = Array.isArray(data.galleryImages)
      ? data.galleryImages
      : [];
    const savedGalleryImages = [];
    const imageOptimizations = [];

    for (const [index, image] of incomingGalleryImages.entries()) {
      const nextImage = { ...image };
      if (nextImage.imageBase64) {
        const savedImage = await savePageImage(
          nextImage.imageBase64,
          `Gallery image ${index + 1}`,
        );
        nextImage.imageUrl = savedImage.imageUrl;
        nextImage.width = savedImage.width;
        nextImage.height = savedImage.height;
        imageOptimizations.push({
          id: nextImage.id || `page-image-${index}`,
          storage: savedImage.storage,
        });
      }

      delete nextImage.imageBase64;
      delete nextImage.imageFilename;
      delete nextImage.imagePreviewUrl;

      if (nextImage.imageUrl) {
        savedGalleryImages.push({
          id: String(nextImage.id || `page-image-${Date.now()}-${index}`),
          title: String(nextImage.title || "").trim(),
          alt: String(nextImage.alt || nextImage.title || `Gallery image ${index + 1}`).trim(),
          caption: String(nextImage.caption || "").trim(),
          imageUrl: String(nextImage.imageUrl || "").trim(),
          width: nextImage.width || null,
          height: nextImage.height || null,
        });
      }
    }

    const fullContent = buildPageMarkdown({
      title,
      description: data.description,
      pageType,
      createdAt: existingCreatedAt,
      galleryImages: pageType === "gallery" ? savedGalleryImages.slice(0, 200) : [],
      content: data.content || "",
    });

    await writePageContent(filename, fullContent);

    return new Response(
      JSON.stringify({
        success: true,
        filename,
        slug: filename.replace(/\.md$/i, ""),
        galleryImages: pageType === "gallery" ? savedGalleryImages.slice(0, 200) : [],
        imageOptimizations,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error saving standalone page:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
