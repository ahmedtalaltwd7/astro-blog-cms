/* empty css                                    */
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute, l as renderScript } from '../../chunks/astro/server_z5fA6ZdE.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_r9jRjh0A.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$tag = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$tag;
  const rawTag = String(Astro2.params.tag || "").replace(/^#+/, "").trim();
  const tag = decodeURIComponent(rawTag);
  if (!tag) {
    return Astro2.redirect("/blog");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `#${tag} Posts` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-50 py-12"> <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"> <div class="mb-10"> <a href="/blog" class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"> <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>
Back to all posts
</a> <h1 class="mt-4 text-4xl font-bold text-gray-900 md:text-5xl">
#${tag} </h1> <p class="mt-3 text-lg text-gray-600">
Posts tagged with this hashtag.
</p> </div> <div id="tag-posts" class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"${addAttribute(tag, "data-tag")}> <div id="loading" class="col-span-full py-12 text-center"> <div class="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div> <p class="mt-4 text-gray-600">Loading posts...</p> </div> </div> <div id="empty-state" class="hidden py-16 text-center"> <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path> </svg> <h2 class="mt-4 text-xl font-medium text-gray-900">
No posts found
</h2> <p class="mx-auto mt-2 max-w-md text-gray-500">
There are no posts using this hashtag yet.
</p> </div> </div> </div> ${renderScript($$result2, "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/tags/[tag].astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/tags/[tag].astro", void 0);

const $$file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/tags/[tag].astro";
const $$url = "/tags/[tag]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$tag,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
