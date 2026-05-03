import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import {
  normalizeGalleryConfig,
  readGalleryConfig,
  writeGalleryConfig,
} from "../../lib/gallery-config.js";
import { saveAsset } from "../../lib/runtime-storage.js";

export const prerender = false;

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2200;
const GALLERY_IMAGE_DIR = "gallery-images";
const WEBP_OPTIONS = {
  quality: 75,
  lossless: false,
  nearLossless: false,
  effort: 6,
  smartSubsample: true,
};
const AVIF_OPTIONS = {
  quality: 62,
  lossless: false,
  effort: 6,
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

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

function generateImageBasename() {
  return `${getFullTimeStamp()}-${getRandomSuffix()}`;
}

async function getGalleryImageDirs() {
  const cwd = process.cwd();
  const dirs = [path.join(cwd, "public", GALLERY_IMAGE_DIR)];

  try {
    await fs.access(path.join(cwd, "dist", "client"));
    dirs.push(path.join(cwd, "dist", "client", GALLERY_IMAGE_DIR));
  } catch {
    // Dev mode reads public assets directly.
  }

  return dirs;
}

async function optimizeImagePair(buffer) {
  const image = sharp(buffer, { failOn: "none" }).rotate();
  const metadata = await image.metadata();
  const width = Number(metadata.width) || MAX_IMAGE_DIMENSION;
  const height = Number(metadata.height) || MAX_IMAGE_DIMENSION;
  const resized = image.resize({
    width: MAX_IMAGE_DIMENSION,
    height: MAX_IMAGE_DIMENSION,
    fit: "inside",
    withoutEnlargement: true,
  });
  const webpBuffer = await resized.clone().webp(WEBP_OPTIONS).toBuffer();
  const avifBuffer = await resized.clone().avif(AVIF_OPTIONS).toBuffer();

  return {
    webpBuffer,
    avifBuffer,
    inputFormat: metadata.format || "unknown",
    originalSize: buffer.length,
    webpSize: webpBuffer.length,
    avifSize: avifBuffer.length,
    width,
    height,
  };
}

async function saveGalleryImage(imageBase64, label = "Gallery image") {
  const matches = String(imageBase64 || "").match(/^data:(image\/[^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error(`${label} must be a valid image file.`);
  }

  const buffer = Buffer.from(matches[2], "base64");
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error(`${label} must be smaller than 12MB.`);
  }

  const optimized = await optimizeImagePair(buffer);
  const basename = generateImageBasename();
  const localDirs = await getGalleryImageDirs();
  const webpAsset = await saveAsset({
    directory: GALLERY_IMAGE_DIR,
    filename: `${basename}.webp`,
    buffer: optimized.webpBuffer,
    localDirs,
    contentType: "image/webp",
    inlineMime: "image/webp",
  });
  const avifAsset = await saveAsset({
    directory: GALLERY_IMAGE_DIR,
    filename: `${basename}.avif`,
    buffer: optimized.avifBuffer,
    localDirs,
    contentType: "image/avif",
    inlineMime: "image/avif",
  });

  return {
    webpUrl: webpAsset.url,
    avifUrl: avifAsset.url,
    imageUrl: webpAsset.url,
    width: optimized.width,
    height: optimized.height,
    optimization: {
      inputFormat: optimized.inputFormat,
      originalSize: optimized.originalSize,
      webpSize: optimized.webpSize,
      avifSize: optimized.avifSize,
      storage: webpAsset.storage,
    },
  };
}

async function prepareGalleryForSave(data, current) {
  const nextConfig = normalizeGalleryConfig({
    ...current,
    ...data,
    thumbnail: {
      ...current.thumbnail,
      ...(data.thumbnail || {}),
    },
  });
  const optimizations = [];

  if (data.thumbnail?.imageBase64) {
    const savedThumbnail = await saveGalleryImage(
      data.thumbnail.imageBase64,
      "Gallery thumbnail",
    );
    nextConfig.thumbnail = {
      ...nextConfig.thumbnail,
      webpUrl: savedThumbnail.webpUrl,
      avifUrl: savedThumbnail.avifUrl,
      imageUrl: savedThumbnail.imageUrl,
      width: savedThumbnail.width,
      height: savedThumbnail.height,
    };
    optimizations.push({ id: "thumbnail", ...savedThumbnail.optimization });
  }

  const incomingImages = Array.isArray(data.images) ? data.images : [];
  nextConfig.images = await Promise.all(
    incomingImages.map(async (image, index) => {
      const nextImage = { ...image };

      if (nextImage.imageBase64) {
        const savedImage = await saveGalleryImage(
          nextImage.imageBase64,
          `Gallery image ${index + 1}`,
        );
        nextImage.webpUrl = savedImage.webpUrl;
        nextImage.avifUrl = savedImage.avifUrl;
        nextImage.imageUrl = savedImage.imageUrl;
        nextImage.width = savedImage.width;
        nextImage.height = savedImage.height;
        optimizations.push({
          id: nextImage.id || `image-${index}`,
          ...savedImage.optimization,
        });
      }

      delete nextImage.imageBase64;
      delete nextImage.imageFilename;
      delete nextImage.imagePreviewUrl;
      return nextImage;
    }),
  );

  return {
    config: normalizeGalleryConfig(nextConfig),
    optimizations,
  };
}

export async function GET() {
  const config = await readGalleryConfig();
  return jsonResponse({ config });
}

export async function POST({ request }) {
  try {
    const current = await readGalleryConfig();
    const data = await request.json();
    const prepared = await prepareGalleryForSave(data, current);
    const config = await writeGalleryConfig(prepared.config);

    return jsonResponse({
      success: true,
      config,
      imageOptimizations: prepared.optimizations,
    });
  } catch (error) {
    console.error("Error saving gallery settings:", error);
    return jsonResponse(
      { error: error.message || "Failed to save gallery settings." },
      500,
    );
  }
}
