/* empty css                                 */
import { e as createComponent, r as renderTemplate, k as renderComponent, m as maybeRenderHead, g as addAttribute, n as Fragment } from '../chunks/astro/server_RHxhWfPN.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DyeyJaqy.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { r as readHeroConfig } from '../chunks/hero-config_BMBZyFvS.mjs';
import { r as readHomeSections } from '../chunks/home-sections_CbcuMHpY.mjs';
import { r as readHowItWorks } from '../chunks/how-it-works_GZEYexVh.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  function parseFrontmatter(content) {
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    const frontmatter = {};
    if (!frontmatterMatch) return frontmatter;
    for (const line of frontmatterMatch[1].split("\n")) {
      const match = line.match(/^(\w+):\s*(.*)$/);
      if (!match) continue;
      const [, key, rawValue] = match;
      frontmatter[key] = rawValue.trim().replace(/^["']|["']$/g, "");
    }
    return frontmatter;
  }
  const blogDir = path.join(process.cwd(), "src", "content", "blog");
  const files = await fs.readdir(blogDir);
  const posts = await Promise.all(
    files.filter((filename) => filename.endsWith(".md")).map(async (filename) => {
      const filePath = path.join(blogDir, filename);
      const [content, fileStats] = await Promise.all([
        fs.readFile(filePath, "utf-8"),
        fs.stat(filePath)
      ]);
      const frontmatter = parseFrontmatter(content);
      const slug = frontmatter.slug || filename.replace(".md", "");
      return {
        slug,
        createdAtMs: fileStats.birthtimeMs,
        frontmatter: {
          title: frontmatter.title || filename.replace(".md", ""),
          description: frontmatter.description,
          pubDate: frontmatter.pubDate,
          image: frontmatter.image,
          thumbnail: frontmatter.thumbnail
        }
      };
    })
  );
  const latestPosts = posts.sort((a, b) => b.createdAtMs - a.createdAtMs).slice(0, 3);
  const heroConfig = await readHeroConfig();
  const homeSections = await readHomeSections();
  const howItWorks = await readHowItWorks();
  function hexToRgbString(hex) {
    const value = Number.parseInt(hex.replace("#", ""), 16);
    return `${value >> 16 & 255}, ${value >> 8 & 255}, ${value & 255}`;
  }
  function escapeCssUrl(url) {
    return String(url).replace(/["\\]/g, "\\$&");
  }
  function getHeroStyle(config) {
    const textColor = `color: ${config.textColor};`;
    if (config.backgroundType === "solid") {
      return `background: ${config.backgroundColor}; ${textColor}`;
    }
    if (config.backgroundType === "image" && config.imageUrl) {
      const overlayRgb = hexToRgbString(config.overlayColor);
      const overlayAlpha = Number(config.overlayOpacity) / 100;
      return [
        `background-image: linear-gradient(rgba(${overlayRgb}, ${overlayAlpha}), rgba(${overlayRgb}, ${overlayAlpha})), url("${escapeCssUrl(config.imageUrl)}");`,
        "background-size: cover;",
        "background-position: center;",
        textColor
      ].join(" ");
    }
    return `background: linear-gradient(90deg, ${config.gradientFrom}, ${config.gradientTo}); ${textColor}`;
  }
  const heroStyle = getHeroStyle(heroConfig);
  function getHomeSectionClass(style) {
    if (style === "wavy") {
      return "home-managed-section home-section-wavy";
    }
    if (style === "imageZoom") {
      return "home-managed-section home-section-image-zoom";
    }
    if (style === "verticalSlider") {
      return "home-managed-section home-section-vertical-slider";
    }
    return "home-managed-section home-section-normal";
  }
  function getWavePositionClass(position) {
    return position === "bottom" ? "home-section-wave-bottom" : "home-section-wave-top";
  }
  function getHomeSectionStyle(section) {
    return [
      `--home-section-bg: ${section.backgroundColor};`,
      `--home-section-bg-to: ${section.backgroundColorTo};`,
      `--home-section-wave: ${section.waveColor};`,
      `--home-section-heading: ${section.textColor};`,
      `--home-section-body: ${section.bodyTextColor};`
    ].join(" ");
  }
  const howItWorksIcons = {
    edit: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    file: "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2",
    check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    star: "M11.48 3.499a.562.562 0 011.04 0l2.13 5.18a.563.563 0 00.475.345l5.59.43c.527.04.74.697.338 1.04l-4.262 3.652a.563.563 0 00-.182.557l1.302 5.46a.562.562 0 01-.84.61l-4.793-2.927a.563.563 0 00-.586 0L6.9 20.773a.562.562 0 01-.84-.61l1.302-5.46a.563.563 0 00-.182-.557l-4.262-3.651a.562.562 0 01.338-1.041l5.59-.43a.563.563 0 00.475-.345l2.13-5.18z",
    image: "M3 16.5l4.5-4.5 3 3 4.5-6 6 7.5M4.5 19.5h15A1.5 1.5 0 0021 18V6a1.5 1.5 0 00-1.5-1.5h-15A1.5 1.5 0 003 6v12a1.5 1.5 0 001.5 1.5z",
    rocket: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96A14.98 14.98 0 019.63 8.41m0 0a6 6 0 00-7.38 5.84h4.8m2.58-5.84a6 6 0 017.38 5.84m-7.38-5.84L3 21l12.59-6.63"
  };
  function getHowItWorksIconPath(iconKey) {
    return howItWorksIcons[iconKey] || howItWorksIcons.edit;
  }
  function getHowItWorksCardStyle(card) {
    const styles = [
      `background-color: ${card.cardBackgroundColor};`,
      `color: ${card.bodyTextColor};`
    ];
    if (card.backgroundImageUrl && card.cardStyle !== "imageZoom") {
      const overlayRgb = hexToRgbString(card.overlayColor);
      const overlayAlpha = Number(card.overlayOpacity) / 100;
      styles.push(
        `background-image: linear-gradient(rgba(${overlayRgb}, ${overlayAlpha}), rgba(${overlayRgb}, ${overlayAlpha})), url("${escapeCssUrl(card.backgroundImageUrl)}");`,
        "background-size: cover;",
        "background-position: center;"
      );
    }
    return styles.join(" ");
  }
  return renderTemplate(_a || (_a = __template(["", '  <script>\n  (() => {\n    const sliders = document.querySelectorAll("[data-vertical-slider][data-auto-slide=\'true\']");\n\n    sliders.forEach((slider) => {\n      const track = slider.querySelector("[data-vertical-slider-track]");\n      const slides = slider.querySelectorAll(".home-vertical-slide");\n\n      if (!track || slides.length < 2) return;\n\n      let index = 0;\n      window.setInterval(() => {\n        const orientation = slider.dataset.sliderOrientation || "vertical";\n        index = (index + 1) % slides.length;\n        const distance = orientation === "horizontal" ? slider.clientWidth : slider.clientHeight;\n        const axis = orientation === "horizontal" ? "X" : "Y";\n        track.style.transform = `translate${axis}(-${index * distance}px)`;\n      }, 3500);\n\n      window.addEventListener("resize", () => {\n        const orientation = slider.dataset.sliderOrientation || "vertical";\n        const distance = orientation === "horizontal" ? slider.clientWidth : slider.clientHeight;\n        const axis = orientation === "horizontal" ? "X" : "Y";\n        track.style.transform = `translate${axis}(-${index * distance}px)`;\n      });\n    });\n  })();\n<\/script>'], ["", '  <script>\n  (() => {\n    const sliders = document.querySelectorAll("[data-vertical-slider][data-auto-slide=\'true\']");\n\n    sliders.forEach((slider) => {\n      const track = slider.querySelector("[data-vertical-slider-track]");\n      const slides = slider.querySelectorAll(".home-vertical-slide");\n\n      if (!track || slides.length < 2) return;\n\n      let index = 0;\n      window.setInterval(() => {\n        const orientation = slider.dataset.sliderOrientation || "vertical";\n        index = (index + 1) % slides.length;\n        const distance = orientation === "horizontal" ? slider.clientWidth : slider.clientHeight;\n        const axis = orientation === "horizontal" ? "X" : "Y";\n        track.style.transform = \\`translate\\${axis}(-\\${index * distance}px)\\`;\n      }, 3500);\n\n      window.addEventListener("resize", () => {\n        const orientation = slider.dataset.sliderOrientation || "vertical";\n        const distance = orientation === "horizontal" ? slider.clientWidth : slider.clientHeight;\n        const axis = orientation === "horizontal" ? "X" : "Y";\n        track.style.transform = \\`translate\\${axis}(-\\${index * distance}px)\\`;\n      });\n    });\n  })();\n<\/script>'])), renderComponent($$result, "Layout", $$Layout, { "title": heroConfig.pageTitle, "description": heroConfig.metaDescription, "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen" data-astro-cid-j7pv25f6> <!-- Hero Section --> <section class="py-20"${addAttribute(heroStyle, "style")} data-astro-cid-j7pv25f6> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-astro-cid-j7pv25f6> <h1 class="text-5xl md:text-6xl font-bold mb-6" data-astro-cid-j7pv25f6> ${heroConfig.title} </h1> <p class="text-xl md:text-2xl mb-10 max-w-3xl mx-auto" data-astro-cid-j7pv25f6> ${heroConfig.subtitle} </p> <div class="flex flex-col sm:flex-row gap-4 justify-center" data-astro-cid-j7pv25f6> <a${addAttribute(heroConfig.primaryButtonHref, "href")} class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-blue-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white" data-astro-cid-j7pv25f6> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" data-astro-cid-j7pv25f6></path> </svg> ${heroConfig.primaryButtonText} </a> <a${addAttribute(heroConfig.secondaryButtonHref, "href")} class="inline-flex items-center justify-center px-8 py-3 border border-current text-lg font-medium rounded-md hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white" data-astro-cid-j7pv25f6> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" data-astro-cid-j7pv25f6></path> </svg> ${heroConfig.secondaryButtonText} </a> </div> </div> </section> ${homeSections.length > 0 && renderTemplate`<div class="home-managed-sections" data-astro-cid-j7pv25f6> ${homeSections.map((section) => renderTemplate`<section${addAttribute(`${getHomeSectionClass(section.style)} ${section.style === "wavy" ? getWavePositionClass(section.wavePosition) : ""}`, "class")}${addAttribute(getHomeSectionStyle(section), "style")} data-astro-cid-j7pv25f6> ${section.style === "wavy" && section.wavePosition !== "bottom" && renderTemplate`<div class="home-wave-divider home-wave-divider-top" aria-hidden="true" data-astro-cid-j7pv25f6> <svg viewBox="0 0 1440 150" preserveAspectRatio="none" focusable="false" data-astro-cid-j7pv25f6> <path d="M0,66 C160,18 302,16 455,54 C626,97 777,111 940,67 C1110,20 1288,26 1440,72 L1440,0 L0,0 Z" data-astro-cid-j7pv25f6></path> </svg> </div>`} <div class="home-managed-inner" data-astro-cid-j7pv25f6> ${section.style === "verticalSlider" ? renderTemplate`<div class="home-vertical-slider-layout" data-astro-cid-j7pv25f6> <div class="home-section-copy home-vertical-slider-copy" data-astro-cid-j7pv25f6> <h2 data-astro-cid-j7pv25f6>${section.title}</h2> ${section.body && renderTemplate`<p data-astro-cid-j7pv25f6>${section.body}</p>`} </div> <div${addAttribute(`home-vertical-slider ${section.sliderOrientation === "horizontal" ? "home-horizontal-slider" : ""}`, "class")} data-vertical-slider${addAttribute(String(Boolean(section.autoSlide)), "data-auto-slide")}${addAttribute(section.sliderOrientation || "vertical", "data-slider-orientation")} data-astro-cid-j7pv25f6> <div class="home-vertical-slider-track" data-vertical-slider-track data-astro-cid-j7pv25f6> ${section.sliderImages.length > 0 ? section.sliderImages.map((image) => renderTemplate`<div class="home-vertical-slide" data-astro-cid-j7pv25f6> ${image.href ? renderTemplate`<a${addAttribute(image.href, "href")} data-astro-cid-j7pv25f6> <img${addAttribute(image.imageUrl, "src")}${addAttribute(image.imageAlt || section.title, "alt")} data-astro-cid-j7pv25f6> </a>` : renderTemplate`<img${addAttribute(image.imageUrl, "src")}${addAttribute(image.imageAlt || section.title, "alt")} data-astro-cid-j7pv25f6>`} </div>`) : renderTemplate`<div class="home-vertical-slide home-image-placeholder" data-astro-cid-j7pv25f6></div>`} </div> </div> </div>` : section.style === "imageZoom" ? renderTemplate`<div class="home-image-zoom-layout" data-astro-cid-j7pv25f6> <div class="home-image-zoom-copy" data-astro-cid-j7pv25f6> <h2 data-astro-cid-j7pv25f6>${section.title}</h2> ${section.body && renderTemplate`<p data-astro-cid-j7pv25f6>${section.body}</p>`} </div> <div class="home-image-zoom-frame" data-astro-cid-j7pv25f6> ${section.imageUrl ? renderTemplate`<img${addAttribute(section.imageUrl, "src")}${addAttribute(section.imageAlt || section.title, "alt")} data-astro-cid-j7pv25f6>` : renderTemplate`<div class="home-image-placeholder" data-astro-cid-j7pv25f6></div>`} </div> </div>` : renderTemplate`<div class="home-section-copy" data-astro-cid-j7pv25f6> <h2 data-astro-cid-j7pv25f6>${section.title}</h2> ${section.body && renderTemplate`<p data-astro-cid-j7pv25f6>${section.body}</p>`} ${section.imageUrl && renderTemplate`<img${addAttribute(section.imageUrl, "src")}${addAttribute(section.imageAlt || section.title, "alt")} data-astro-cid-j7pv25f6>`} </div>`} </div> ${section.style === "wavy" && section.wavePosition === "bottom" && renderTemplate`<div class="home-wave-divider home-wave-divider-bottom" aria-hidden="true" data-astro-cid-j7pv25f6> <svg viewBox="0 0 1440 150" preserveAspectRatio="none" focusable="false" data-astro-cid-j7pv25f6> <path d="M0,66 C160,18 302,16 455,54 C626,97 777,111 940,67 C1110,20 1288,26 1440,72 L1440,0 L0,0 Z" data-astro-cid-j7pv25f6></path> </svg> </div>`} </section>`)} </div>`} <!-- Features Section --> <section class="py-16 bg-white" data-astro-cid-j7pv25f6> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-astro-cid-j7pv25f6> <h2 class="text-3xl font-bold text-center text-gray-900 mb-12" data-astro-cid-j7pv25f6> ${howItWorks.heading} </h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-8" data-astro-cid-j7pv25f6> ${howItWorks.cards.map((card, index) => renderTemplate`<div class="group relative overflow-hidden p-8 rounded-xl shadow-sm"${addAttribute(getHowItWorksCardStyle(card), "style")} data-astro-cid-j7pv25f6> ${card.cardStyle === "imageZoom" && card.backgroundImageUrl && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-j7pv25f6": true }, { "default": async ($$result3) => renderTemplate` <img${addAttribute(card.backgroundImageUrl, "src")} alt="" class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" data-astro-cid-j7pv25f6> <div class="absolute inset-0"${addAttribute(`background-color: rgba(${hexToRgbString(card.overlayColor)}, ${Number(card.overlayOpacity) / 100});`, "style")} data-astro-cid-j7pv25f6></div> ` })}`} <div class="relative z-10" data-astro-cid-j7pv25f6> <div class="w-12 h-12 rounded-lg flex items-center justify-center mb-6"${addAttribute(`background-color: ${card.accentBackgroundColor}; color: ${card.accentColor};`, "style")} data-astro-cid-j7pv25f6> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${addAttribute(getHowItWorksIconPath(card.iconKey), "d")} data-astro-cid-j7pv25f6></path> </svg> </div> <h3 class="text-xl font-bold mb-3"${addAttribute(`color: ${card.titleColor};`, "style")} data-astro-cid-j7pv25f6> ${card.title} </h3> <p${addAttribute(`color: ${card.bodyTextColor};`, "style")} data-astro-cid-j7pv25f6>${card.body}</p> </div> </div>`)} </div> </div> </section> <!-- Latest Posts Preview --> <section class="py-16 bg-gray-50" data-astro-cid-j7pv25f6> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-astro-cid-j7pv25f6> <div class="flex justify-between items-center mb-10" data-astro-cid-j7pv25f6> <h2 class="text-3xl font-bold text-gray-900" data-astro-cid-j7pv25f6>Latest Blog Posts</h2> <a href="/blog" class="text-blue-600 hover:text-blue-800 font-medium flex items-center" data-astro-cid-j7pv25f6>
View all posts
<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" data-astro-cid-j7pv25f6></path> </svg> </a> </div> ${latestPosts.length > 0 ? renderTemplate`<div class="grid grid-cols-1 md:grid-cols-3 gap-8" data-astro-cid-j7pv25f6> ${latestPosts.map((post) => renderTemplate`<article class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300" data-astro-cid-j7pv25f6> ${post.frontmatter.thumbnail || post.frontmatter.image ? renderTemplate`<img${addAttribute(post.frontmatter.thumbnail || post.frontmatter.image, "src")}${addAttribute(post.frontmatter.title, "alt")} class="w-full h-48 object-cover" data-astro-cid-j7pv25f6>` : renderTemplate`<div class="h-48 bg-gradient-to-r from-blue-400 to-purple-500" data-astro-cid-j7pv25f6></div>`} <div class="p-6" data-astro-cid-j7pv25f6> <div class="text-sm text-gray-500 mb-3" data-astro-cid-j7pv25f6> <time${addAttribute(post.frontmatter.pubDate, "datetime")} data-astro-cid-j7pv25f6> ${post.frontmatter.pubDate} </time> </div> <h3 class="text-xl font-bold text-gray-900 mb-3" data-astro-cid-j7pv25f6> <a${addAttribute(`/blog/${post.slug}`, "href")} class="hover:text-blue-600" data-astro-cid-j7pv25f6> ${post.frontmatter.title} </a> </h3> <p class="text-gray-600 mb-4" data-astro-cid-j7pv25f6> ${post.frontmatter.description || "No description provided."} </p> <a${addAttribute(`/blog/${post.slug}`, "href")} class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium" data-astro-cid-j7pv25f6>
Read more
<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" data-astro-cid-j7pv25f6></path> </svg> </a> </div> </article>`)} </div>` : renderTemplate`<div class="text-center py-12 bg-white rounded-xl shadow-sm" data-astro-cid-j7pv25f6> <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-astro-cid-j7pv25f6></path> </svg> <h3 class="mt-4 text-xl font-medium text-gray-900" data-astro-cid-j7pv25f6>
No blog posts yet
</h3> <p class="mt-2 text-gray-500 max-w-md mx-auto" data-astro-cid-j7pv25f6>
Create your first blog post using the admin editor.
</p> <div class="mt-6" data-astro-cid-j7pv25f6> <a href="/admin" class="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-astro-cid-j7pv25f6>
Create First Post
</a> </div> </div>`} </div> </section> <!-- Call to Action --> <section class="py-16 bg-white" data-astro-cid-j7pv25f6> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-astro-cid-j7pv25f6> <h2 class="text-3xl font-bold text-gray-900 mb-6" data-astro-cid-j7pv25f6>
Ready to start blogging?
</h2> <p class="text-xl text-gray-600 mb-10" data-astro-cid-j7pv25f6>
The admin panel gives you full control to create, edit, and manage
          your blog posts with ease.
</p> <a href="/admin" class="inline-flex items-center justify-center px-10 py-4 border border-transparent text-xl font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-astro-cid-j7pv25f6> <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" data-astro-cid-j7pv25f6></path> </svg>
Launch Admin Editor
</a> </div> </section> </div> ` }));
}, "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/index.astro", void 0);

const $$file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
