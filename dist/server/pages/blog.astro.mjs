/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderScript } from '../chunks/astro/server_CPVj0fOm.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_BNJUcxz5.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Blog Posts" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-50 py-12"> <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
Blog Posts
</h1> <p class="text-xl text-gray-600 max-w-3xl mx-auto">
A collection of blog posts created with the admin editor. Each post is
          stored as a markdown file in <code class="bg-gray-100 px-2 py-1 rounded">src/pages/blog/</code>.
</p> <a href="/admin" class="inline-flex items-center mt-6 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path> </svg>
Create New Post
</a> </div> <div class="mb-8 max-w-xl mx-auto"> <label for="post-search" class="sr-only">Search blog posts by title</label> <div class="relative"> <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"> <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> </div> <input id="post-search" type="search" placeholder="Search blog posts by title..." class="block w-full rounded-md border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" autocomplete="off"> </div> </div> <!-- Container for posts (will be populated by JavaScript) --> <div id="posts-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> <!-- Loading indicator --> <div id="loading" class="col-span-full text-center py-12"> <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div> <p class="mt-4 text-gray-600">Loading posts...</p> </div> <!-- Posts will be inserted here --> </div> <!-- Empty state (hidden by default) --> <div id="empty-state" class="hidden text-center py-16"> <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> <h3 class="mt-4 text-xl font-medium text-gray-900"> <span id="empty-title">No blog posts yet</span> </h3> <p id="empty-message" class="mt-2 text-gray-500 max-w-md mx-auto">
Get started by creating your first blog post using the admin editor.
</p> <div class="mt-6"> <a href="/admin" class="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
Create First Post
</a> </div> </div> <!-- Load more control --> <div id="load-more-wrapper" class="hidden mt-12 text-center"> <button id="load-more-btn" class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
Load More
</button> <p id="load-more-status" class="mt-3 text-sm text-gray-500"></p> </div> </div> </div> ${renderScript($$result2, "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/blog/index.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/blog/index.astro", void 0);

const $$file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
