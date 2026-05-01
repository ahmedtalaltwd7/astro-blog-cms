import fs from "fs/promises";
import path from "path";

export const DEFAULT_HERO_CONFIG = {
  pageTitle: "Home - Astro Blog",
  metaDescription:
    "A fully-featured blog system with a control panel editor, Tailwind CSS styling, and dynamic markdown pages.",
  title: "Create Dynamic Blog Pages with Astro",
  subtitle:
    "A fully-featured blog system with a control panel editor, Tailwind CSS styling, and dynamic markdown pages.",
  primaryButtonText: "Go to Editor",
  primaryButtonHref: "/admin",
  secondaryButtonText: "View Blog",
  secondaryButtonHref: "/blog",
  backgroundType: "gradient",
  backgroundColor: "#2563eb",
  gradientFrom: "#2563eb",
  gradientTo: "#7c3aed",
  textColor: "#ffffff",
  imageUrl: "",
  overlayColor: "#000000",
  overlayOpacity: 35,
};

export function getHeroConfigPath() {
  return path.join(process.cwd(), "src", "data", "hero.json");
}

function normalizeHexColor(value, fallback) {
  const color = String(value || "").trim();
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : fallback;
}

function normalizeUrl(value, fallback = "") {
  const url = String(value || "").trim();
  if (!url) return fallback;
  if (url.startsWith("/") || /^https?:\/\//i.test(url)) return url;
  return fallback;
}

export function normalizeHeroConfig(value = {}) {
  const config = { ...DEFAULT_HERO_CONFIG, ...value };
  const backgroundTypes = new Set(["gradient", "solid", "image"]);

  return {
    pageTitle: String(config.pageTitle || DEFAULT_HERO_CONFIG.pageTitle).trim(),
    metaDescription: String(
      config.metaDescription || config.subtitle || DEFAULT_HERO_CONFIG.metaDescription,
    ).trim(),
    title: String(config.title || DEFAULT_HERO_CONFIG.title).trim(),
    subtitle: String(config.subtitle || DEFAULT_HERO_CONFIG.subtitle).trim(),
    primaryButtonText: String(
      config.primaryButtonText || DEFAULT_HERO_CONFIG.primaryButtonText,
    ).trim(),
    primaryButtonHref: normalizeUrl(
      config.primaryButtonHref,
      DEFAULT_HERO_CONFIG.primaryButtonHref,
    ),
    secondaryButtonText: String(
      config.secondaryButtonText || DEFAULT_HERO_CONFIG.secondaryButtonText,
    ).trim(),
    secondaryButtonHref: normalizeUrl(
      config.secondaryButtonHref,
      DEFAULT_HERO_CONFIG.secondaryButtonHref,
    ),
    backgroundType: backgroundTypes.has(config.backgroundType)
      ? config.backgroundType
      : DEFAULT_HERO_CONFIG.backgroundType,
    backgroundColor: normalizeHexColor(
      config.backgroundColor,
      DEFAULT_HERO_CONFIG.backgroundColor,
    ),
    gradientFrom: normalizeHexColor(
      config.gradientFrom,
      DEFAULT_HERO_CONFIG.gradientFrom,
    ),
    gradientTo: normalizeHexColor(config.gradientTo, DEFAULT_HERO_CONFIG.gradientTo),
    textColor: normalizeHexColor(config.textColor, DEFAULT_HERO_CONFIG.textColor),
    imageUrl: normalizeUrl(config.imageUrl),
    overlayColor: normalizeHexColor(
      config.overlayColor,
      DEFAULT_HERO_CONFIG.overlayColor,
    ),
    overlayOpacity: Math.min(
      90,
      Math.max(0, Number(config.overlayOpacity) || DEFAULT_HERO_CONFIG.overlayOpacity),
    ),
  };
}

export async function readHeroConfig() {
  try {
    const raw = await fs.readFile(getHeroConfigPath(), "utf-8");
    return normalizeHeroConfig(JSON.parse(raw));
  } catch {
    return normalizeHeroConfig();
  }
}

export async function writeHeroConfig(config) {
  const normalized = normalizeHeroConfig(config);
  const filePath = getHeroConfigPath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(normalized, null, 2)}\n`, "utf-8");
  return normalized;
}
