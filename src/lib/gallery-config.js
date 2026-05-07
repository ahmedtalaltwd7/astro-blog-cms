import fs from "fs/promises";
import path from "path";
import {
  isReadonlyRuntime,
  readJsonBlob,
  requireWritableStorage,
  writeJsonBlob,
} from "./runtime-storage.js";

export const DEFAULT_GALLERY_CONFIG = {
  title: "Gallery",
  description: "A curated set of images from the site.",
  language: "en",
  thumbnail: {
    webpUrl: "",
    avifUrl: "",
    imageUrl: "",
    alt: "Gallery thumbnail",
  },
  images: [],
};
export const MAX_GALLERY_IMAGES = 200;

export function getGalleryConfigPath() {
  return path.join(process.cwd(), "src", "data", "gallery.json");
}

function normalizeText(value, fallback = "") {
  const text = String(value || "").trim();
  return text || fallback;
}

function normalizeUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  if (url.startsWith("/") || url.startsWith("data:image/") || /^https?:\/\//i.test(url)) {
    return url;
  }
  return "";
}

function normalizeDimension(value) {
  const dimension = Number(value);
  return Number.isFinite(dimension) && dimension > 0 ? Math.round(dimension) : null;
}

function hasArabicContent(value) {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(String(value || ""));
}

function resolveContentLanguage(value, fallbackText = "") {
  if (value === "ar" || value === "en") return value;
  return hasArabicContent(fallbackText) ? "ar" : "en";
}

function normalizeImage(value = {}, index = 0) {
  const webpUrl = normalizeUrl(value.webpUrl || value.imageUrl);
  const avifUrl = normalizeUrl(value.avifUrl);
  const title = normalizeText(value.title);

  return {
    id: normalizeText(value.id, `gallery-image-${Date.now()}-${index}`),
    title,
    alt: normalizeText(value.alt, title || `Gallery image ${index + 1}`),
    caption: normalizeText(value.caption),
    webpUrl,
    avifUrl,
    imageUrl: webpUrl,
    width: normalizeDimension(value.width),
    height: normalizeDimension(value.height),
  };
}

function normalizeThumbnail(value = {}) {
  const webpUrl = normalizeUrl(value.webpUrl || value.imageUrl);
  const avifUrl = normalizeUrl(value.avifUrl);

  return {
    webpUrl,
    avifUrl,
    imageUrl: webpUrl,
    alt: normalizeText(value.alt, DEFAULT_GALLERY_CONFIG.thumbnail.alt),
    width: normalizeDimension(value.width),
    height: normalizeDimension(value.height),
  };
}

export function normalizeGalleryConfig(value = {}) {
  const config = { ...DEFAULT_GALLERY_CONFIG, ...value };
  const images = Array.isArray(config.images) ? config.images : [];
  const explicitLanguage = Object.prototype.hasOwnProperty.call(value, "language")
    ? value.language
    : "";
  const languageFallback = [
    config.title,
    config.description,
    ...images.flatMap((image) => [image?.title, image?.alt, image?.caption]),
  ].join(" ");

  return {
    title: normalizeText(config.title, DEFAULT_GALLERY_CONFIG.title),
    description: normalizeText(config.description),
    language: resolveContentLanguage(explicitLanguage, languageFallback),
    thumbnail: normalizeThumbnail(config.thumbnail),
    images: images
      .map(normalizeImage)
      .filter((image) => image.webpUrl || image.avifUrl)
      .slice(0, MAX_GALLERY_IMAGES),
  };
}

export async function readGalleryConfig() {
  const blobConfig = await readJsonBlob("admin-data/gallery.json");
  if (blobConfig) return normalizeGalleryConfig(blobConfig);

  try {
    const raw = await fs.readFile(getGalleryConfigPath(), "utf-8");
    return normalizeGalleryConfig(JSON.parse(raw));
  } catch {
    return normalizeGalleryConfig();
  }
}

export async function writeGalleryConfig(config) {
  const normalized = normalizeGalleryConfig(config);
  if (isReadonlyRuntime()) {
    requireWritableStorage("save gallery settings");
    return writeJsonBlob("admin-data/gallery.json", normalized);
  }

  const filePath = getGalleryConfigPath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(normalized, null, 2)}\n`, "utf-8");
  return normalized;
}
