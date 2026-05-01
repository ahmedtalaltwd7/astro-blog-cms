import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { r as readHowItWorks, w as writeHowItWorks } from '../../chunks/how-it-works_GZEYexVh.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;
const MAX_IMAGE_WIDTH = 1400;
const HOW_IT_WORKS_ASSET_DIR = "how-it-works-assets";
const IMAGE_WEBP_OPTIONS = {
  quality: 86,
  lossless: false,
  nearLossless: false,
  effort: 5,
  smartSubsample: true
};
function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
function getFullTimeStamp() {
  const now = new Date();
  const pad = (value, size = 2) => String(value).padStart(size, "0");
  return [now.getFullYear(), pad(now.getMonth() + 1), pad(now.getDate()), pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds()), pad(now.getMilliseconds(), 3)].join("");
}
function getRandomSuffix() {
  return Math.random().toString(36).slice(2, 7).padEnd(5, "0");
}
function generateImageFilename() {
  return `${getFullTimeStamp()}-${getRandomSuffix()}.webp`;
}
async function getHowItWorksAssetDirs() {
  const cwd = process.cwd();
  const dirs = [path.join(cwd, "public", HOW_IT_WORKS_ASSET_DIR)];
  try {
    await fs.access(path.join(cwd, "dist", "client"));
    dirs.push(path.join(cwd, "dist", "client", HOW_IT_WORKS_ASSET_DIR));
  } catch {
    // Dev mode reads public assets directly.
  }
  return dirs;
}
async function saveCardBackgroundImage(imageBase64) {
  const matches = String(imageBase64 || "").match(/^data:(image\/[^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Card background must be a valid image file.");
  }
  const buffer = Buffer.from(matches[2], "base64");
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error("Card background image must be smaller than 6MB.");
  }
  const optimizedBuffer = await sharp(buffer, {
    failOn: "none"
  }).rotate().resize({
    width: MAX_IMAGE_WIDTH,
    withoutEnlargement: true
  }).webp(IMAGE_WEBP_OPTIONS).toBuffer();
  const filename = generateImageFilename();
  const assetDirs = await getHowItWorksAssetDirs();
  for (const assetDir of assetDirs) {
    await fs.mkdir(assetDir, {
      recursive: true
    });
    await fs.writeFile(path.join(assetDir, filename), optimizedBuffer);
  }
  return `/${HOW_IT_WORKS_ASSET_DIR}/${filename}`;
}
async function prepareConfigForSave(config = {}) {
  const cards = Array.isArray(config.cards) ? config.cards : [];
  const preparedCards = await Promise.all(cards.map(async card => {
    const nextCard = {
      ...card
    };
    if (nextCard.backgroundImageBase64) {
      nextCard.backgroundImageUrl = await saveCardBackgroundImage(nextCard.backgroundImageBase64);
    }
    delete nextCard.backgroundImageBase64;
    delete nextCard.backgroundImagePreviewUrl;
    delete nextCard.backgroundImageFilename;
    return nextCard;
  }));
  return {
    ...config,
    cards: preparedCards
  };
}
async function GET() {
  const config = await readHowItWorks();
  return jsonResponse({
    config
  });
}
async function POST({
  request
}) {
  try {
    const data = await request.json();
    const preparedConfig = await prepareConfigForSave(data.config);
    const config = await writeHowItWorks(preparedConfig);
    return jsonResponse({
      success: true,
      config
    });
  } catch (error) {
    console.error("Error saving how it works settings:", error);
    return jsonResponse({
      error: error.message || "Failed to save how it works settings."
    }, 500);
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
