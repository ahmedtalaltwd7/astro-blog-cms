import { e as createComponent, g as addAttribute, r as renderTemplate, n as renderHead, o as renderSlot, h as createAstro } from './astro/server_z5fA6ZdE.mjs';
import 'piccolore';
import 'clsx';
/* empty css                         */

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title = "Astro Blog", description } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" href="/favicon.ico"><meta name="generator"${addAttribute(Astro2.generator, "content")}>${description && renderTemplate`<meta name="description"${addAttribute(description, "content")}>`}<title>${title}</title>${renderHead()}</head> <body class="bg-gray-50"> <!-- Navigation --> <nav class="bg-white shadow-md"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex justify-between h-16"> <div class="flex items-center"> <a href="/" class="flex items-center space-x-2"> <img src="/favicon.svg" alt="Logo" class="h-8 w-8"> <span class="text-xl font-bold text-gray-900">Astro Blog</span> </a> </div> <div class="flex items-center space-x-4"> <a href="/" class="text-gray-700 hover:text-blue-600 font-medium">Home</a> <a href="/blog" class="text-gray-700 hover:text-blue-600 font-medium">Blog</a> <a href="/admin/hero" class="text-gray-700 hover:text-blue-600 font-medium">Hero</a> <a href="/admin" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
Admin Editor
</a> </div> </div> </div> </nav> ${renderSlot($$result, $$slots["default"])} <!-- Footer --> <footer class="mt-16 bg-white border-t border-gray-200"> <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"> <div class="text-center text-gray-500"> <p>Built with Astro, Tailwind CSS, and ❤️</p> <p class="mt-2 text-sm">Dynamic blog pages with markdown editor</p> </div> </div> </footer> </body></html>`;
}, "C:/Users/Ahmed Talal/Desktop/astro-blog/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
