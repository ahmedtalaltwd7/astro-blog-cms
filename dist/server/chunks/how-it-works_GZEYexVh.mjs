import fs from 'fs/promises';
import path from 'path';

const CARD_STYLES = new Set(["normal", "imageZoom"]);
const CARD_ICONS = new Set(["edit", "file", "check", "star", "image", "rocket"]);
const DEFAULT_HOW_IT_WORKS = {
  heading: "How It Works",
  cards: [{
    title: "Edit Markdown",
    body: "Use the admin control panel to write blog posts in markdown with frontmatter. The editor provides a live preview.",
    accentColor: "#2563eb",
    accentBackgroundColor: "#dbeafe",
    cardBackgroundColor: "#f9fafb",
    titleColor: "#111827",
    bodyTextColor: "#4b5563",
    backgroundImageUrl: "",
    overlayColor: "#000000",
    overlayOpacity: 0,
    cardStyle: "normal",
    iconKey: "edit"
  }, {
    title: "Save to Files",
    body: "Posts are saved as .md files and the API handles file creation and validation.",
    accentColor: "#7c3aed",
    accentBackgroundColor: "#ede9fe",
    cardBackgroundColor: "#f9fafb",
    titleColor: "#111827",
    bodyTextColor: "#4b5563",
    backgroundImageUrl: "",
    overlayColor: "#000000",
    overlayOpacity: 0,
    cardStyle: "normal",
    iconKey: "file"
  }, {
    title: "Dynamic Pages",
    body: "Astro generates pages for each blog post using dynamic routing. Tailwind CSS keeps the design responsive.",
    accentColor: "#16a34a",
    accentBackgroundColor: "#dcfce7",
    cardBackgroundColor: "#f9fafb",
    titleColor: "#111827",
    bodyTextColor: "#4b5563",
    backgroundImageUrl: "",
    overlayColor: "#000000",
    overlayOpacity: 0,
    cardStyle: "normal",
    iconKey: "check"
  }]
};
function getHowItWorksPath() {
  return path.join(process.cwd(), "src", "data", "how-it-works.json");
}
function normalizeText(value, fallback = "") {
  const text = String(value || "").trim();
  return text || fallback;
}
function normalizeHexColor(value, fallback) {
  const color = String(value || "").trim();
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : fallback;
}
function normalizeUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  if (url.startsWith("/") || /^https?:\/\//i.test(url)) return url;
  return "";
}
function normalizePercent(value, fallback = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(90, Math.max(0, Math.round(number)));
}
function normalizeCard(card, index) {
  const fallback = DEFAULT_HOW_IT_WORKS.cards[index] || DEFAULT_HOW_IT_WORKS.cards[0];
  const cardStyle = CARD_STYLES.has(card?.cardStyle) ? card.cardStyle : fallback.cardStyle;
  const iconKey = CARD_ICONS.has(card?.iconKey) ? card.iconKey : fallback.iconKey;
  return {
    title: normalizeText(card?.title, fallback.title),
    body: normalizeText(card?.body, fallback.body),
    accentColor: normalizeHexColor(card?.accentColor, fallback.accentColor),
    accentBackgroundColor: normalizeHexColor(card?.accentBackgroundColor, fallback.accentBackgroundColor),
    cardBackgroundColor: normalizeHexColor(card?.cardBackgroundColor, fallback.cardBackgroundColor),
    titleColor: normalizeHexColor(card?.titleColor, fallback.titleColor),
    bodyTextColor: normalizeHexColor(card?.bodyTextColor, fallback.bodyTextColor),
    backgroundImageUrl: normalizeUrl(card?.backgroundImageUrl),
    overlayColor: normalizeHexColor(card?.overlayColor, fallback.overlayColor),
    overlayOpacity: normalizePercent(card?.overlayOpacity, fallback.overlayOpacity),
    cardStyle,
    iconKey
  };
}
function normalizeHowItWorks(value = {}) {
  const cards = Array.isArray(value.cards) ? value.cards : DEFAULT_HOW_IT_WORKS.cards;
  return {
    heading: normalizeText(value.heading, DEFAULT_HOW_IT_WORKS.heading),
    cards: cards.map((card, index) => normalizeCard(card, index)).filter(card => card.title || card.body || card.backgroundImageUrl).slice(0, 12)
  };
}
async function readHowItWorks() {
  try {
    const raw = await fs.readFile(getHowItWorksPath(), "utf-8");
    return normalizeHowItWorks(JSON.parse(raw));
  } catch {
    return normalizeHowItWorks(DEFAULT_HOW_IT_WORKS);
  }
}
async function writeHowItWorks(config) {
  const normalized = normalizeHowItWorks(config);
  const filePath = getHowItWorksPath();
  await fs.mkdir(path.dirname(filePath), {
    recursive: true
  });
  await fs.writeFile(filePath, `${JSON.stringify(normalized, null, 2)}\n`, "utf-8");
  return normalized;
}

export { readHowItWorks as r, writeHowItWorks as w };
