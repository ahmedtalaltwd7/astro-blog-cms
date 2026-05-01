import fs from 'fs/promises';
import path from 'path';

const SECTION_STYLES = new Set(["normal", "wavy", "imageZoom", "verticalSlider"]);
const WAVE_POSITIONS = new Set(["top", "bottom"]);
const SLIDER_ORIENTATIONS = new Set(["vertical", "horizontal"]);
const DEFAULT_HOME_SECTIONS = [];
function getHomeSectionsPath() {
  return path.join(process.cwd(), "src", "data", "home-sections.json");
}
function normalizeText(value, fallback = "") {
  const text = String(value || "").trim();
  return text || fallback;
}
function normalizeUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  if (url.startsWith("/") || /^https?:\/\//i.test(url)) return url;
  return "";
}
function normalizeHexColor(value, fallback) {
  const color = String(value || "").trim();
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : fallback;
}
function normalizeBoolean(value, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}
function normalizeSliderImages(value = []) {
  const images = Array.isArray(value) ? value : [];
  return images.map((image, index) => ({
    id: normalizeText(image?.id, `slide-${Date.now()}-${index}`),
    imageUrl: normalizeUrl(image?.imageUrl),
    imageAlt: normalizeText(image?.imageAlt, `Slide ${index + 1}`),
    href: normalizeUrl(image?.href)
  })).filter(image => image.imageUrl).slice(0, 12);
}
function normalizeSection(section, index) {
  const title = normalizeText(section?.title, `Home Section ${index + 1}`);
  const style = SECTION_STYLES.has(section?.style) ? section.style : "normal";
  const wavePosition = WAVE_POSITIONS.has(section?.wavePosition) ? section.wavePosition : "top";
  const sliderOrientation = SLIDER_ORIENTATIONS.has(section?.sliderOrientation) ? section.sliderOrientation : "vertical";
  return {
    id: normalizeText(section?.id, `section-${Date.now()}-${index}`),
    title,
    body: normalizeText(section?.body),
    imageUrl: normalizeUrl(section?.imageUrl),
    imageAlt: normalizeText(section?.imageAlt, title),
    style,
    backgroundColor: normalizeHexColor(section?.backgroundColor, "#eff6ff"),
    backgroundColorTo: normalizeHexColor(section?.backgroundColorTo, "#dbeafe"),
    waveColor: normalizeHexColor(section?.waveColor, "#ffffff"),
    wavePosition,
    textColor: normalizeHexColor(section?.textColor, "#111827"),
    bodyTextColor: normalizeHexColor(section?.bodyTextColor, "#4b5563"),
    autoSlide: normalizeBoolean(section?.autoSlide),
    sliderOrientation,
    sliderImages: normalizeSliderImages(section?.sliderImages)
  };
}
function normalizeHomeSections(value = []) {
  const sections = Array.isArray(value) ? value : [];
  return sections.map(normalizeSection).filter(section => section.title || section.body || section.imageUrl || section.sliderImages.length).slice(0, 12);
}
async function readHomeSections() {
  try {
    const raw = await fs.readFile(getHomeSectionsPath(), "utf-8");
    return normalizeHomeSections(JSON.parse(raw));
  } catch {
    return normalizeHomeSections(DEFAULT_HOME_SECTIONS);
  }
}
async function writeHomeSections(sections) {
  const normalized = normalizeHomeSections(sections);
  const filePath = getHomeSectionsPath();
  await fs.mkdir(path.dirname(filePath), {
    recursive: true
  });
  await fs.writeFile(filePath, `${JSON.stringify(normalized, null, 2)}\n`, "utf-8");
  return normalized;
}

export { readHomeSections as r, writeHomeSections as w };
