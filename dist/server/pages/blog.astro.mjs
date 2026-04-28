/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderScript } from '../chunks/astro/server_z5fA6ZdE.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D9CNNVYF.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Blog Posts" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-50 py-12"> <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
Blog Posts
</h1> <p class="text-xl text-gray-600 max-w-3xl mx-auto">
A collection of blog posts created with the admin editor. Each post is
          stored as a markdown file in <code class="bg-gray-100 px-2 py-1 rounded">src/pages/blog/</code>.
</p> <a href="/admin" class="inline-flex items-center mt-6 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path> </svg>
Create New Post
</a> </div> <!-- Container for posts (will be populated by JavaScript) --> <div id="posts-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> <!-- Loading indicator --> <div id="loading" class="col-span-full text-center py-12"> <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div> <p class="mt-4 text-gray-600">Loading posts...</p> </div> <!-- Posts will be inserted here --> </div> <!-- Empty state (hidden by default) --> <div id="empty-state" class="hidden text-center py-16"> <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> <h3 class="mt-4 text-xl font-medium text-gray-900">
No blog posts yet
</h3> <p class="mt-2 text-gray-500 max-w-md mx-auto">
Get started by creating your first blog post using the admin editor.
</p> <div class="mt-6"> <a href="/admin" class="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
Create First Post
</a> </div> </div> <!-- Pagination controls --> <div id="pagination" class="hidden mt-12 flex items-center justify-between"> <button id="prev-btn" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
Previous
</button> <div class="text-sm text-gray-700">
Page <span id="current-page">1</span> of <span id="total-pages">1</span> </div> <button id="next-btn" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
Next
</button> </div> </div> </div> ${renderScript($$result2, "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/blog/index.astro?astro&type=script&index=0&lang.ts")} ` })}`;
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
