import fs from "fs/promises";
import path from "path";
import {
  isReadonlyRuntime,
  readJsonBlob,
  requireWritableStorage,
  writeJsonBlob,
} from "./runtime-storage.js";

export const DEFAULT_SITE_CONFIG = {
  brandName: "Astro Blog",
  logoUrl: "/favicon.svg",
  iconUrl: "/favicon.svg",
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Hero", href: "/admin/hero" },
  ],
  footerLinks: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Admin", href: "/admin" },
  ],
  headerBackgroundColor: "#ffffff",
  headerTextColor: "#111827",
  headerBrandTextColor: "#111827",
  headerLinkColor: "#374151",
  headerLinkHoverColor: "#2563eb",
  headerBorderColor: "#e5e7eb",
  headerLinkStyle: "pills",
  footerBackgroundColor: "#ffffff",
  footerTextColor: "#6b7280",
  footerBorderColor: "#e5e7eb",
  footerLinkColor: "#2563eb",
  footerText: "Built with Astro, Tailwind CSS, and love",
  footerSubtext: "Dynamic blog pages with markdown editor",
  footerShowLogo: true,
};

export function getSiteConfigPath() {
  return path.join(process.cwd(), "src", "data", "site.json");
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

function normalizeText(value, fallback) {
  const text = String(value || "").trim();
  return text || fallback;
}

function normalizeLinks(value, fallback = DEFAULT_SITE_CONFIG.navLinks, maxLinks = 6) {
  const links = Array.isArray(value) ? value : fallback;
  const normalized = links
    .map((link) => ({
      label: String(link?.label || "").trim(),
      href: normalizeUrl(link?.href),
    }))
    .filter((link) => link.label && link.href)
    .slice(0, maxLinks);

  return normalized.length > 0 ? normalized : fallback;
}

export function normalizeSiteConfig(value = {}) {
  const config = { ...DEFAULT_SITE_CONFIG, ...value };
  const linkStyles = new Set(["pills", "plain", "underline"]);

  return {
    brandName: normalizeText(config.brandName, DEFAULT_SITE_CONFIG.brandName),
    logoUrl: normalizeUrl(config.logoUrl, DEFAULT_SITE_CONFIG.logoUrl),
    iconUrl: normalizeUrl(config.iconUrl, DEFAULT_SITE_CONFIG.iconUrl),
    navLinks: normalizeLinks(config.navLinks),
    footerLinks: normalizeLinks(
      config.footerLinks,
      Array.isArray(value.navLinks) ? normalizeLinks(value.navLinks) : DEFAULT_SITE_CONFIG.footerLinks,
      8,
    ),
    headerBackgroundColor: normalizeHexColor(
      config.headerBackgroundColor,
      DEFAULT_SITE_CONFIG.headerBackgroundColor,
    ),
    headerTextColor: normalizeHexColor(
      config.headerTextColor,
      DEFAULT_SITE_CONFIG.headerTextColor,
    ),
    headerBrandTextColor: normalizeHexColor(
      config.headerBrandTextColor ?? config.headerTextColor,
      DEFAULT_SITE_CONFIG.headerBrandTextColor,
    ),
    headerLinkColor: normalizeHexColor(
      config.headerLinkColor,
      DEFAULT_SITE_CONFIG.headerLinkColor,
    ),
    headerLinkHoverColor: normalizeHexColor(
      config.headerLinkHoverColor,
      DEFAULT_SITE_CONFIG.headerLinkHoverColor,
    ),
    headerBorderColor: normalizeHexColor(
      config.headerBorderColor,
      DEFAULT_SITE_CONFIG.headerBorderColor,
    ),
    headerLinkStyle: linkStyles.has(config.headerLinkStyle)
      ? config.headerLinkStyle
      : DEFAULT_SITE_CONFIG.headerLinkStyle,
    footerBackgroundColor: normalizeHexColor(
      config.footerBackgroundColor,
      DEFAULT_SITE_CONFIG.footerBackgroundColor,
    ),
    footerTextColor: normalizeHexColor(
      config.footerTextColor,
      DEFAULT_SITE_CONFIG.footerTextColor,
    ),
    footerBorderColor: normalizeHexColor(
      config.footerBorderColor,
      DEFAULT_SITE_CONFIG.footerBorderColor,
    ),
    footerLinkColor: normalizeHexColor(
      config.footerLinkColor,
      DEFAULT_SITE_CONFIG.footerLinkColor,
    ),
    footerText: normalizeText(config.footerText, DEFAULT_SITE_CONFIG.footerText),
    footerSubtext: normalizeText(
      config.footerSubtext,
      DEFAULT_SITE_CONFIG.footerSubtext,
    ),
    footerShowLogo: Boolean(config.footerShowLogo),
  };
}

export async function readSiteConfig() {
  const blobConfig = await readJsonBlob("admin-data/site.json");
  if (blobConfig) return normalizeSiteConfig(blobConfig);

  try {
    const raw = await fs.readFile(getSiteConfigPath(), "utf-8");
    return normalizeSiteConfig(JSON.parse(raw));
  } catch {
    return normalizeSiteConfig();
  }
}

export async function writeSiteConfig(config) {
  const normalized = normalizeSiteConfig(config);
  if (isReadonlyRuntime()) {
    requireWritableStorage("save header and footer settings");
    return writeJsonBlob("admin-data/site.json", normalized);
  }

  const filePath = getSiteConfigPath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(normalized, null, 2)}\n`, "utf-8");
  return normalized;
}
