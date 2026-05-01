import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import {
  normalizeSiteConfig,
  readSiteConfig,
  writeSiteConfig,
} from "../../lib/site-config.js";

export const prerender = false;

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_LOGO_DIMENSION = 512;
const SITE_ASSET_DIR = "site-assets";
const LOGO_WEBP_OPTIONS = {
  quality: 85,
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

function generateLogoFilename() {
  return `${getFullTimeStamp()}-${getRandomSuffix()}.webp`;
}

async function getSiteAssetDirs() {
  const cwd = process.cwd();
  const dirs = [path.join(cwd, "public", SITE_ASSET_DIR)];

  try {
    await fs.access(path.join(cwd, "dist", "client"));
    dirs.push(path.join(cwd, "dist", "client", SITE_ASSET_DIR));
  } catch {
    // Dev mode does not need dist/client writes.
  }

  return dirs;
}

function getSiteAssetFilename(logoUrl) {
  const url = String(logoUrl || "").trim();
  if (!url.startsWith(`/${SITE_ASSET_DIR}/`)) return "";
  return path.basename(url);
}

async function pruneSiteAssets(keepLogoUrl = "") {
  const keepFilename = getSiteAssetFilename(keepLogoUrl);
  const assetDirs = await getSiteAssetDirs();

  for (const assetDir of assetDirs) {
    let entries = [];
    try {
      entries = await fs.readdir(assetDir, { withFileTypes: true });
    } catch {
      continue;
    }

    await Promise.all(
      entries
        .filter((entry) => entry.isFile() && entry.name !== keepFilename)
        .map(async (entry) => {
          try {
            await fs.unlink(path.join(assetDir, entry.name));
          } catch (error) {
            console.error(`Could not delete old site asset ${entry.name}:`, error);
          }
        }),
    );
  }
}

async function optimizeLogo(buffer) {
  const image = sharp(buffer, { failOn: "none" }).rotate();
  const metadata = await image.metadata();
  const optimizedBuffer = await image
    .resize({
      width: MAX_LOGO_DIMENSION,
      height: MAX_LOGO_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp(LOGO_WEBP_OPTIONS)
    .toBuffer();

  return {
    buffer: optimizedBuffer,
    inputFormat: metadata.format || "unknown",
    originalSize: buffer.length,
    savedSize: optimizedBuffer.length,
  };
}

async function saveLogo(imageBase64) {
  const matches = String(imageBase64 || "").match(/^data:(image\/[^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Logo must be a valid image file.");
  }

  const buffer = Buffer.from(matches[2], "base64");
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error("Logo must be smaller than 5MB.");
  }

  const optimized = await optimizeLogo(buffer);
  const filename = generateLogoFilename();
  const assetDirs = await getSiteAssetDirs();

  for (const assetDir of assetDirs) {
    await fs.mkdir(assetDir, { recursive: true });
    await fs.writeFile(path.join(assetDir, filename), optimized.buffer);
  }

  return {
    logoUrl: `/${SITE_ASSET_DIR}/${filename}`,
    logoOptimization: {
      originalSize: optimized.originalSize,
      savedSize: optimized.savedSize,
      inputFormat: optimized.inputFormat,
      format: "webp",
    },
  };
}

export async function GET() {
  const config = await readSiteConfig();
  return jsonResponse({ config });
}

export async function POST({ request }) {
  try {
    const current = await readSiteConfig();
    const data = await request.json();
    let logoUrl = data.logoUrl || current.logoUrl;
    let logoOptimization = null;

    if (data.logoBase64) {
      const savedLogo = await saveLogo(data.logoBase64);
      logoUrl = savedLogo.logoUrl;
      logoOptimization = savedLogo.logoOptimization;
      await pruneSiteAssets(logoUrl);
    }

    if (data.removeLogo) {
      logoUrl = "";
      await pruneSiteAssets();
    }

    const config = await writeSiteConfig(
      normalizeSiteConfig({
        ...current,
        ...data,
        logoUrl,
      }),
    );

    return jsonResponse({ success: true, config, logoOptimization });
  } catch (error) {
    console.error("Error saving site settings:", error);
    return jsonResponse(
      { error: error.message || "Failed to save site settings." },
      500,
    );
  }
}
