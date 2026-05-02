import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import {
  readHomeSections,
  writeHomeSections,
} from "../../lib/home-sections.js";
import { saveWebpAsset } from "../../lib/runtime-storage.js";

export const prerender = false;

const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;
const MAX_IMAGE_WIDTH = 1600;
const HOME_SECTION_ASSET_DIR = "home-section-assets";
const IMAGE_WEBP_OPTIONS = {
  quality: 86,
  lossless: false,
  nearLossless: false,
  effort: 5,
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

async function getHomeSectionAssetDirs() {
  const cwd = process.cwd();
  const dirs = [path.join(cwd, "public", HOME_SECTION_ASSET_DIR)];

  try {
    await fs.access(path.join(cwd, "dist", "client"));
    dirs.push(path.join(cwd, "dist", "client", HOME_SECTION_ASSET_DIR));
  } catch {
    // Dev mode reads public assets directly.
  }

  return dirs;
}

async function saveSectionImage(imageBase64) {
  const matches = String(imageBase64 || "").match(/^data:(image\/[^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Section image must be a valid image file.");
  }

  const buffer = Buffer.from(matches[2], "base64");
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error("Section image must be smaller than 6MB.");
  }

  const image = sharp(buffer, { failOn: "none" }).rotate();
  const optimizedBuffer = await image
    .resize({
      width: MAX_IMAGE_WIDTH,
      withoutEnlargement: true,
    })
    .webp(IMAGE_WEBP_OPTIONS)
    .toBuffer();
  const filename = generateImageFilename();
  const savedAsset = await saveWebpAsset({
    directory: HOME_SECTION_ASSET_DIR,
    filename,
    buffer: optimizedBuffer,
    localDirs: await getHomeSectionAssetDirs(),
  });

  return savedAsset.url;
}

async function prepareSectionsForSave(sections = []) {
  if (!Array.isArray(sections)) return [];

  return Promise.all(
    sections.map(async (section) => {
      const nextSection = { ...section };

      if (nextSection.imageBase64) {
        nextSection.imageUrl = await saveSectionImage(nextSection.imageBase64);
      }

      if (Array.isArray(nextSection.sliderImages)) {
        nextSection.sliderImages = await Promise.all(
          nextSection.sliderImages.map(async (image) => {
            const nextImage = { ...image };

            if (nextImage.imageBase64) {
              nextImage.imageUrl = await saveSectionImage(nextImage.imageBase64);
            }

            delete nextImage.imageBase64;
            delete nextImage.imagePreviewUrl;
            delete nextImage.imageFilename;
            return nextImage;
          }),
        );
      }

      delete nextSection.imageBase64;
      delete nextSection.imagePreviewUrl;
      delete nextSection.imageFilename;
      return nextSection;
    }),
  );
}

export async function GET() {
  const sections = await readHomeSections();
  return jsonResponse({ sections });
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    const preparedSections = await prepareSectionsForSave(data.sections);
    const sections = await writeHomeSections(preparedSections);
    return jsonResponse({ success: true, sections });
  } catch (error) {
    console.error("Error saving home sections:", error);
    return jsonResponse(
      { error: error.message || "Failed to save home sections." },
      500,
    );
  }
}
