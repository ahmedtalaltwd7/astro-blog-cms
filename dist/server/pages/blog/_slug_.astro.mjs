/* empty css                                    */
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute, u as unescapeHTML } from '../../chunks/astro/server_CPVj0fOm.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_Cu0GZ52K.mjs';
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
  const postModules = /* #__PURE__ */ Object.assign({"../../content/blog/123456789.md": () => import('../../chunks/123456789_C9V8Ef8b.mjs'),"../../content/blog/444444444444444441111111110000.md": () => import('../../chunks/444444444444444441111111110000_DL6EyONW.mjs'),"../../content/blog/all.md": () => import('../../chunks/all_y2oDv1O1.mjs'),"../../content/blog/arabic-now.md": () => import('../../chunks/arabic-now_CitV0wLZ.mjs'),"../../content/blog/beeeeeeeeeeeeeeeer.md": () => import('../../chunks/beeeeeeeeeeeeeeeer_C649djqc.mjs'),"../../content/blog/bnhgyt.md": () => import('../../chunks/bnhgyt_C-jYI7IO.mjs'),"../../content/blog/cc-vb.md": () => import('../../chunks/cc-vb_DuHuwIJl.mjs'),"../../content/blog/cxvf-ddsd.md": () => import('../../chunks/cxvf-ddsd_D8pujrTu.mjs'),"../../content/blog/gggggggggg-gggggggg.md": () => import('../../chunks/gggggggggg-gggggggg_C2aOsKBC.mjs'),"../../content/blog/gghhbfsg-bdsf.md": () => import('../../chunks/gghhbfsg-bdsf_C2p-k3uy.mjs'),"../../content/blog/hp.md": () => import('../../chunks/hp_Ct-uw5cw.mjs'),"../../content/blog/last.md": () => import('../../chunks/last_DTIA5k7O.mjs'),"../../content/blog/last2.md": () => import('../../chunks/last2_BxoCEnUm.mjs'),"../../content/blog/last3.md": () => import('../../chunks/last3_D2nx5aYf.mjs'),"../../content/blog/lll333.md": () => import('../../chunks/lll333_BqXl3qvS.mjs'),"../../content/blog/me-alone.md": () => import('../../chunks/me-alone_BS5Ei-ak.mjs'),"../../content/blog/my-ama-zing-blog-post.md": () => import('../../chunks/my-ama-zing-blog-post_B_WWUuHh.mjs'),"../../content/blog/my-amaz-ssding-blog-post.md": () => import('../../chunks/my-amaz-ssding-blog-post_Dc5Zhrzk.mjs'),"../../content/blog/my-amazgggggggggging-blog-post.md": () => import('../../chunks/my-amazgggggggggging-blog-post_CPicoLxx.mjs'),"../../content/blog/my-amaziccdfdfng-blog-post.md": () => import('../../chunks/my-amaziccdfdfng-blog-post_CnClKQr6.mjs'),"../../content/blog/my-amazidddng-blog-post.md": () => import('../../chunks/my-amazidddng-blog-post_BGlWxJl5.mjs'),"../../content/blog/my-amazing-blccvfog-post.md": () => import('../../chunks/my-amazing-blccvfog-post_BfWzpMrj.mjs'),"../../content/blog/my-amazing-blodfffg-post.md": () => import('../../chunks/my-amazing-blodfffg-post_DldUzBig.mjs'),"../../content/blog/my-amazing-bloffffffg-post.md": () => import('../../chunks/my-amazing-bloffffffg-post_C17iiBno.mjs'),"../../content/blog/my-amazing-bloffffg-post.md": () => import('../../chunks/my-amazing-bloffffg-post_CtZ_NDDX.mjs'),"../../content/blog/my-amazing-blog-post-ahmed.md": () => import('../../chunks/my-amazing-blog-post-ahmed_DOUk5JB8.mjs'),"../../content/blog/my-amazing-blog-post.md": () => import('../../chunks/my-amazing-blog-post_C2eVZOg_.mjs'),"../../content/blog/my-amazing-blog-pvvvost.md": () => import('../../chunks/my-amazing-blog-pvvvost_BwvMPEkg.mjs'),"../../content/blog/my-amazing-blxsog-post.md": () => import('../../chunks/my-amazing-blxsog-post_y6scMEh1.mjs'),"../../content/blog/my-amggazing-blog-post.md": () => import('../../chunks/my-amggazing-blog-post_Bcd-rVUx.mjs'),"../../content/blog/new-ahmed.md": () => import('../../chunks/new-ahmed_W98CrmUp.mjs'),"../../content/blog/new-hash.md": () => import('../../chunks/new-hash_B1p_BJV2.mjs'),"../../content/blog/new-pgggggost.md": () => import('../../chunks/new-pgggggost_Dktw25jq.mjs'),"../../content/blog/new-phhost.md": () => import('../../chunks/new-phhost_CHV7eT4M.mjs'),"../../content/blog/new-poccst.md": () => import('../../chunks/new-poccst_PHCJy6Bp.mjs'),"../../content/blog/new-poggggst.md": () => import('../../chunks/new-poggggst_C_BZxbmn.mjs'),"../../content/blog/new-pogggst.md": () => import('../../chunks/new-pogggst_jY5ykGoA.mjs'),"../../content/blog/new-pohhhhhhhhhhhhst.md": () => import('../../chunks/new-pohhhhhhhhhhhhst_DIVHgrih.mjs'),"../../content/blog/new-pohhhhhst.md": () => import('../../chunks/new-pohhhhhst_CKskSO-L.mjs'),"../../content/blog/new-pohhst.md": () => import('../../chunks/new-pohhst_BjTg-YUb.mjs'),"../../content/blog/new-pos1111111t.md": () => import('../../chunks/new-pos1111111t_Dx7yOCkl.mjs'),"../../content/blog/new-pos11t.md": () => import('../../chunks/new-pos11t_BOFxqeOO.mjs'),"../../content/blog/new-posgggt.md": () => import('../../chunks/new-posgggt_B1LH9AuP.mjs'),"../../content/blog/new-posjjjt.md": () => import('../../chunks/new-posjjjt_DqCjrtcR.mjs'),"../../content/blog/new-post.md": () => import('../../chunks/new-post_BzEHV845.mjs'),"../../content/blog/new-post1.md": () => import('../../chunks/new-post1_DXklkkoU.mjs'),"../../content/blog/new-post111.md": () => import('../../chunks/new-post111_Dbz9xXW3.mjs'),"../../content/blog/new-post222.md": () => import('../../chunks/new-post222_CfGhAH4U.mjs'),"../../content/blog/new-psssssost.md": () => import('../../chunks/new-psssssost_DwzCMV_7.mjs'),"../../content/blog/new-zzpost.md": () => import('../../chunks/new-zzpost_Cx8tQlJW.mjs'),"../../content/blog/new-zzzpost.md": () => import('../../chunks/new-zzzpost_Chl6ENB-.mjs'),"../../content/blog/newbbb-post.md": () => import('../../chunks/newbbb-post_CxF8jIp3.mjs'),"../../content/blog/order.md": () => import('../../chunks/order_B5hzrtnC.mjs'),"../../content/blog/the-man-is-hero.md": () => import('../../chunks/the-man-is-hero_CScWCitU.mjs'),"../../content/blog/thumb.md": () => import('../../chunks/thumb_DxeIL6Bx.mjs'),"../../content/blog/twd.md": () => import('../../chunks/twd_BzLfPhCY.mjs'),"../../content/blog/vvv.md": () => import('../../chunks/vvv_DNyYNkTK.mjs'),"../../content/blog/vvvv.md": () => import('../../chunks/vvvv_DG6IgC7l.mjs'),"../../content/blog/xxrrtt.md": () => import('../../chunks/xxrrtt_Cgh8rAu-.mjs')});
  let frontmatter = {};
  let Content = null;
  let htmlContent = "";
  const markdownContentClass = [
    "max-w-none text-gray-800",
    "[&_a]:text-blue-700 [&_a]:underline",
    "[&_blockquote]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-200 [&_blockquote]:bg-blue-50 [&_blockquote]:px-4 [&_blockquote]:py-2",
    "[&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1",
    "[&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold",
    "[&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold",
    "[&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold",
    "[&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg",
    "[&_li]:ml-5",
    "[&_ol]:mb-4 [&_ol]:list-decimal",
    "[&_p]:mb-4",
    "[&_pre]:mb-4 [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:bg-gray-900 [&_pre]:p-4",
    "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-gray-100",
    "[&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse",
    "[&_td]:border [&_td]:border-gray-200 [&_td]:p-2",
    "[&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:p-2",
    "[&_ul]:mb-4 [&_ul]:list-disc"
  ].join(" ");
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
  const runtimeFilePath = path.join(
    process.cwd(),
    "src",
    "content",
    "blog",
    `${safeSlug}.md`
  );
  let shouldUseRuntimeMarkdown = false;
  try {
    await fs.access(runtimeFilePath);
    shouldUseRuntimeMarkdown = true;
    Content = null;
  } catch {
  }
  if (shouldUseRuntimeMarkdown || !Content) {
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
  const pageTitle = frontmatter.title || "Blog Post";
  const postTags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
  const postHashtags = postTags.map((tag) => String(tag).trim().replace(/^#+/, "")).filter(Boolean).map((tag) => `#${tag}`);
  const metaDescription = [pageTitle, ...postHashtags].join(" ");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": metaDescription }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-50 py-12"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> <article class="bg-white shadow-lg rounded-xl overflow-hidden">  ${frontmatter.image ? renderTemplate`<div class="h-64 relative overflow-hidden"> <img${addAttribute(frontmatter.image, "src")}${addAttribute(frontmatter.title, "alt")} class="w-full h-full object-cover"> <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"> <h1 class="text-4xl md:text-5xl font-bold text-white text-center px-4"> ${frontmatter.title} </h1> </div> </div>` : renderTemplate`<div class="h-64 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"> <h1 class="text-4xl md:text-5xl font-bold text-white text-center px-4"> ${frontmatter.title} </h1> </div>`} <div class="p-8 md:p-12">  <div class="flex flex-wrap items-center gap-4 mb-8 text-gray-600"> ${frontmatter.pubDate && renderTemplate`<div class="flex items-center"> <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path> </svg> <time${addAttribute(frontmatter.pubDate, "datetime")}> ${frontmatter.pubDate} </time> </div>`} ${frontmatter.author && renderTemplate`<div class="flex items-center"> <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path> </svg> <span>${frontmatter.author}</span> </div>`} ${frontmatter.tags && Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2"> ${frontmatter.tags.map((tag) => renderTemplate`<a${addAttribute(`/tags/${encodeURIComponent(tag.replace(/^#+/, ""))}`, "href")} class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-200">
#${tag.replace(/^#+/, "")} </a>`)} </div>`} </div>  ${frontmatter.description && renderTemplate`<p class="text-xl text-gray-700 mb-8 italic border-l-4 border-blue-500 pl-4"> ${frontmatter.description} </p>`}  ${Content ? renderTemplate`<div${addAttribute(markdownContentClass, "class")}> ${renderComponent($$result2, "Content", Content, {})} </div>` : renderTemplate`<div${addAttribute(markdownContentClass, "class")}>${unescapeHTML(htmlContent)}</div>`}  <div class="mt-12 pt-8 border-t border-gray-200"> <a href="/admin" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path> </svg>
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
