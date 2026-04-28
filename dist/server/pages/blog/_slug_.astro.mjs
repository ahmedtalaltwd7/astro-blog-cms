/* empty css                                    */
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute, u as unescapeHTML } from '../../chunks/astro/server_z5fA6ZdE.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_D9CNNVYF.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/404");
  }
  const originalSlug = String(slug);
  const normalized = originalSlug.replace(/\.md$/i, "");
  if (originalSlug.toLowerCase().endsWith(".md")) {
    return Astro2.redirect(`/blog/${normalized}`, 301);
  }
  const safeSlug = normalized.replace(/[^a-zA-Z0-9\-_]/g, "");
  const postModules = /* #__PURE__ */ Object.assign({"../../content/blog/new-pgggggost.md": () => import('../../chunks/new-pgggggost_CHJV18-Y.mjs'),"../../content/blog/new-phhost.md": () => import('../../chunks/new-phhost_D1OGd-Dt.mjs'),"../../content/blog/new-poccst.md": () => import('../../chunks/new-poccst_BDartbKj.mjs'),"../../content/blog/new-poggggst.md": () => import('../../chunks/new-poggggst_u8mLlMbu.mjs'),"../../content/blog/new-pogggst.md": () => import('../../chunks/new-pogggst_BoflQ6Dc.mjs'),"../../content/blog/new-pohhhhhhhhhhhhst.md": () => import('../../chunks/new-pohhhhhhhhhhhhst_DKZIzTeq.mjs'),"../../content/blog/new-pohhhhhst.md": () => import('../../chunks/new-pohhhhhst_Bwdh4DKY.mjs'),"../../content/blog/new-pohhst.md": () => import('../../chunks/new-pohhst_eIgijPNM.mjs'),"../../content/blog/new-posgggt.md": () => import('../../chunks/new-posgggt_DNGZu_1L.mjs'),"../../content/blog/new-posjjjt.md": () => import('../../chunks/new-posjjjt_CyXclO1U.mjs'),"../../content/blog/new-post.md": () => import('../../chunks/new-post_CNOnwBDF.mjs'),"../../content/blog/new-post1.md": () => import('../../chunks/new-post1_Chti8ZRw.mjs'),"../../content/blog/new-post111.md": () => import('../../chunks/new-post111_CPJZ96Ah.mjs'),"../../content/blog/new-psssssost.md": () => import('../../chunks/new-psssssost_Cj5AUw5Y.mjs'),"../../content/blog/new-zzzpost.md": () => import('../../chunks/new-zzzpost_BouAbLb-.mjs'),"../../content/blog/newbbb-post.md": () => import('../../chunks/newbbb-post_ivGzKsVt.mjs')});
  let frontmatter = {};
  let Content = null;
  let htmlContent = "";
  for (const [filePath, resolver] of Object.entries(postModules)) {
    if (filePath.endsWith(`${safeSlug}.md`)) {
      try {
        const mod = await resolver();
        frontmatter = mod.frontmatter || {};
        Content = mod.default;
        break;
      } catch (e) {
      }
    }
  }
  if (!Content) {
    const filePath = path.join(
      process.cwd(),
      "src",
      "content",
      "blog",
      `${safeSlug}.md`
    );
    try {
      let parseFrontmatter = function(content) {
        const lines = content.split("\n");
        if (lines[0]?.trim() === "---") {
          let endIndex = -1;
          for (let i = 1; i < lines.length; i++) {
            if (lines[i]?.trim() === "---") {
              endIndex = i;
              break;
            }
          }
          if (endIndex !== -1) {
            const frontmatterLines = lines.slice(1, endIndex);
            const body = lines.slice(endIndex + 1).join("\n").trimStart();
            const front = {};
            for (const line of frontmatterLines) {
              const match = line.match(/^(\w+):\s*(.*)$/);
              if (match) {
                const key = match[1];
                let value = match[2].trim();
                if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'")) {
                  value = value.slice(1, -1);
                }
                if (value.startsWith("[") && value.endsWith("]")) {
                  value = value.slice(1, -1).split(",").map((t) => t.trim().replace(/^['\"]|['\"]$/g, "")).filter(Boolean);
                }
                front[key] = value;
              }
            }
            return { frontmatter: front, body };
          }
        }
        return { frontmatter: {}, body: content };
      };
      const raw = await fs.readFile(filePath, "utf-8");
      const parsed = parseFrontmatter(raw);
      frontmatter = parsed.frontmatter || {};
      marked.setOptions({ gfm: true, breaks: false });
      htmlContent = await marked(parsed.body || parsed);
    } catch (err) {
      return Astro2.redirect("/404");
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": frontmatter.title || `Blog Post` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-50 py-12"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> <article class="bg-white shadow-lg rounded-xl overflow-hidden">  ${frontmatter.image ? renderTemplate`<div class="h-64 relative overflow-hidden"> <img${addAttribute(frontmatter.image, "src")}${addAttribute(frontmatter.title, "alt")} class="w-full h-full object-cover"> <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"> <h1 class="text-4xl md:text-5xl font-bold text-white text-center px-4"> ${frontmatter.title} </h1> </div> </div>` : renderTemplate`<div class="h-64 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"> <h1 class="text-4xl md:text-5xl font-bold text-white text-center px-4"> ${frontmatter.title} </h1> </div>`} <div class="p-8 md:p-12">  <div class="flex flex-wrap items-center gap-4 mb-8 text-gray-600"> ${frontmatter.pubDate && renderTemplate`<div class="flex items-center"> <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path> </svg> <time${addAttribute(frontmatter.pubDate, "datetime")}> ${frontmatter.pubDate} </time> </div>`} ${frontmatter.author && renderTemplate`<div class="flex items-center"> <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path> </svg> <span>${frontmatter.author}</span> </div>`} ${frontmatter.tags && Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2"> ${frontmatter.tags.map((tag) => renderTemplate`<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"> ${tag} </span>`)} </div>`} </div>  ${frontmatter.description && renderTemplate`<p class="text-xl text-gray-700 mb-8 italic border-l-4 border-blue-500 pl-4"> ${frontmatter.description} </p>`}  ${Content ? renderTemplate`<div class="prose prose-lg max-w-none"> ${renderComponent($$result2, "Content", Content, {})} </div>` : renderTemplate`<div class="prose prose-lg max-w-none">${unescapeHTML(htmlContent)}</div>`}  <div class="mt-12 pt-8 border-t border-gray-200"> <a href="/admin" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path> </svg>
Back to Editor
</a> <a href="/" class="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium ml-6"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path> </svg>
Home
</a> </div> </div> </article> </div> </div> ` })}`;
}, "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/blog/[slug].astro", void 0);

const $$file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/blog/[slug].astro";
const $$url = "/blog/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
