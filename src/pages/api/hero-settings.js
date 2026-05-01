import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import {
  normalizeHeroConfig,
  readHeroConfig,
  writeHeroConfig,
} from "../../lib/hero-config.js";

export const prerender = false;

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2400;
const HERO_IMAGE_DIR = "hero-images";
const HERO_WEBP_OPTIONS = {
  quality: 75,
  lossless: false,
  nearLossless: false,
  effort: 6,
  smartSubsample: true,
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

function generateImageFilename() {
  return `${getFullTimeStamp()}-${getRandomSuffix()}.webp`;
}

async function getHeroImageDirs() {
  const cwd = process.cwd();
  const dirs = [path.join(cwd, "public", HERO_IMAGE_DIR)];

  try {
    await fs.access(path.join(cwd, "dist", "client"));
    dirs.push(path.join(cwd, "dist", "client", HERO_IMAGE_DIR));
  } catch {
    // Dev mode does not need dist/client writes.
  }

  return dirs;
}

function getHeroImageFilename(imageUrl) {
  const url = String(imageUrl || "").trim();
  if (!url.startsWith(`/${HERO_IMAGE_DIR}/`)) return "";
  return path.basename(url);
}

async function pruneHeroImages(keepImageUrl = "") {
  const keepFilename = getHeroImageFilename(keepImageUrl);
  const imageDirs = await getHeroImageDirs();

  for (const imageDir of imageDirs) {
    let entries = [];
    try {
      entries = await fs.readdir(imageDir, { withFileTypes: true });
    } catch {
      continue;
    }

    await Promise.all(
      entries
        .filter((entry) => entry.isFile() && entry.name !== keepFilename)
        .map(async (entry) => {
          const filePath = path.join(imageDir, entry.name);
          try {
            await fs.unlink(filePath);
          } catch (error) {
            console.error(`Could not delete old hero image ${filePath}:`, error);
          }
        }),
    );
  }
}

async function optimizeImage(buffer) {
  const image = sharp(buffer, { failOn: "none" }).rotate();
  const metadata = await image.metadata();
  const optimizedBuffer = await image
    .resize({
      width: MAX_IMAGE_DIMENSION,
      height: MAX_IMAGE_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp(HERO_WEBP_OPTIONS)
    .toBuffer();

  return {
    buffer: optimizedBuffer,
    format: "webp",
    inputFormat: metadata.format || "unknown",
    originalSize: buffer.length,
    savedSize: optimizedBuffer.length,
    optimized: optimizedBuffer.length < buffer.length,
  };
}

async function saveHeroImage(imageBase64, imageFilename) {
  const matches = String(imageBase64 || "").match(/^data:(image\/[^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Hero image must be a valid image file.");
  }

  const buffer = Buffer.from(matches[2], "base64");
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error("Hero image must be smaller than 10MB.");
  }

  const optimized = await optimizeImage(buffer);
  const filename = generateImageFilename();
  const imageDirs = await getHeroImageDirs();

  for (const imageDir of imageDirs) {
    await fs.mkdir(imageDir, { recursive: true });
    await fs.writeFile(path.join(imageDir, filename), optimized.buffer);
  }

  return {
    imageUrl: `/${HERO_IMAGE_DIR}/${filename}`,
    imageOptimization: {
      optimized: optimized.optimized,
      originalSize: optimized.originalSize,
      savedSize: optimized.savedSize,
      format: optimized.format,
      inputFormat: optimized.inputFormat,
    },
  };
}

export async function GET() {
  const config = await readHeroConfig();
  return jsonResponse({ config });
}

export async function POST({ request }) {
  try {
    const current = await readHeroConfig();
    const data = await request.json();
    let imageUrl = data.imageUrl || current.imageUrl;
    let imageOptimization = null;

    if (data.imageBase64) {
      const savedImage = await saveHeroImage(data.imageBase64, data.imageFilename);
      imageUrl = savedImage.imageUrl;
      imageOptimization = savedImage.imageOptimization;
      await pruneHeroImages(imageUrl);
    }

    if (data.removeImage) {
      imageUrl = "";
      await pruneHeroImages();
    }

    const config = await writeHeroConfig(
      normalizeHeroConfig({
        ...current,
        ...data,
        imageUrl,
      }),
    );

    return jsonResponse({ success: true, config, imageOptimization });
  } catch (error) {
    console.error("Error saving hero settings:", error);
    return jsonResponse({ error: error.message || "Failed to save hero settings." }, 500);
  }
}
