import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import {
  normalizeSiteConfig,
  readSiteConfig,
  writeSiteConfig,
} from "../../lib/site-config.js";
import { isReadonlyRuntime, saveWebpAsset } from "../../lib/runtime-storage.js";

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

function generateSiteAssetFilename() {
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

async function pruneSiteAssets(keepUrls = []) {
  if (isReadonlyRuntime()) return;

  const keepFilenames = new Set(
    [keepUrls].flat().map(getSiteAssetFilename).filter(Boolean),
  );
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
        .filter((entry) => entry.isFile() && !keepFilenames.has(entry.name))
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

async function optimizeSiteAsset(buffer) {
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

async function saveSiteImage(imageBase64, label = "Image") {
  const matches = String(imageBase64 || "").match(/^data:(image\/[^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error(`${label} must be a valid image file.`);
  }

  const buffer = Buffer.from(matches[2], "base64");
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error(`${label} must be smaller than 5MB.`);
  }

  const optimized = await optimizeSiteAsset(buffer);
  const filename = generateSiteAssetFilename();
  const savedAsset = await saveWebpAsset({
    directory: SITE_ASSET_DIR,
    filename,
    buffer: optimized.buffer,
    localDirs: await getSiteAssetDirs(),
  });

  return {
    url: savedAsset.url,
    optimization: {
      originalSize: optimized.originalSize,
      savedSize: optimized.savedSize,
      inputFormat: optimized.inputFormat,
      format: "webp",
      storage: savedAsset.storage,
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
    let iconUrl = data.iconUrl || current.iconUrl;
    let logoOptimization = null;
    let iconOptimization = null;

    if (data.logoBase64) {
      const savedLogo = await saveSiteImage(data.logoBase64, "Logo");
      logoUrl = savedLogo.url;
      logoOptimization = savedLogo.optimization;
    }

    if (data.iconBase64) {
      const savedIcon = await saveSiteImage(data.iconBase64, "Site icon");
      iconUrl = savedIcon.url;
      iconOptimization = savedIcon.optimization;
    }

    if (data.removeLogo) {
      logoUrl = "";
    }

    if (data.removeIcon) {
      iconUrl = "";
    }

    await pruneSiteAssets([logoUrl, iconUrl]);

    const config = await writeSiteConfig(
      normalizeSiteConfig({
        ...current,
        ...data,
        logoUrl,
        iconUrl,
      }),
    );

    return jsonResponse({ success: true, config, logoOptimization, iconOptimization });
  } catch (error) {
    console.error("Error saving site settings:", error);
    return jsonResponse(
      { error: error.message || "Failed to save site settings." },
      500,
    );
  }
}
