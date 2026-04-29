/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_z5fA6ZdE.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_B7-W5bmm.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const postModules = /* #__PURE__ */ Object.assign({"../content/blog/444444444444444441111111110000.md": () => import('../chunks/444444444444444441111111110000_63WGEMuR.mjs'),"../content/blog/beeeeeeeeeeeeeeeer.md": () => import('../chunks/beeeeeeeeeeeeeeeer_C-q5O0_M.mjs'),"../content/blog/my-ama-zing-blog-post.md": () => import('../chunks/my-ama-zing-blog-post_-_oR_Xnr.mjs'),"../content/blog/my-amazgggggggggging-blog-post.md": () => import('../chunks/my-amazgggggggggging-blog-post_ByHdUV2p.mjs'),"../content/blog/my-amaziccdfdfng-blog-post.md": () => import('../chunks/my-amaziccdfdfng-blog-post_B3JaALP3.mjs'),"../content/blog/my-amazing-blccvfog-post.md": () => import('../chunks/my-amazing-blccvfog-post_D_Y6eRIm.mjs'),"../content/blog/my-amazing-bloffffg-post.md": () => import('../chunks/my-amazing-bloffffg-post_iBq3gj9X.mjs'),"../content/blog/new-pgggggost.md": () => import('../chunks/new-pgggggost_CHJV18-Y.mjs'),"../content/blog/new-phhost.md": () => import('../chunks/new-phhost_D1OGd-Dt.mjs'),"../content/blog/new-poccst.md": () => import('../chunks/new-poccst_BDartbKj.mjs'),"../content/blog/new-poggggst.md": () => import('../chunks/new-poggggst_u8mLlMbu.mjs'),"../content/blog/new-pogggst.md": () => import('../chunks/new-pogggst_BoflQ6Dc.mjs'),"../content/blog/new-pohhhhhhhhhhhhst.md": () => import('../chunks/new-pohhhhhhhhhhhhst_DKZIzTeq.mjs'),"../content/blog/new-pohhhhhst.md": () => import('../chunks/new-pohhhhhst_Bwdh4DKY.mjs'),"../content/blog/new-pohhst.md": () => import('../chunks/new-pohhst_eIgijPNM.mjs'),"../content/blog/new-pos1111111t.md": () => import('../chunks/new-pos1111111t_BDX2Ej2F.mjs'),"../content/blog/new-pos11t.md": () => import('../chunks/new-pos11t_sMvGKxDf.mjs'),"../content/blog/new-posgggt.md": () => import('../chunks/new-posgggt_DNGZu_1L.mjs'),"../content/blog/new-posjjjt.md": () => import('../chunks/new-posjjjt_CyXclO1U.mjs'),"../content/blog/new-post.md": () => import('../chunks/new-post_CNOnwBDF.mjs'),"../content/blog/new-post1.md": () => import('../chunks/new-post1_Chti8ZRw.mjs'),"../content/blog/new-post111.md": () => import('../chunks/new-post111_CPJZ96Ah.mjs'),"../content/blog/new-post222.md": () => import('../chunks/new-post222_VwDS80Kd.mjs'),"../content/blog/new-psssssost.md": () => import('../chunks/new-psssssost_Cj5AUw5Y.mjs'),"../content/blog/new-zzzpost.md": () => import('../chunks/new-zzzpost_BouAbLb-.mjs'),"../content/blog/newbbb-post.md": () => import('../chunks/newbbb-post_ivGzKsVt.mjs')});
  const entries = Object.entries(postModules);
  const posts = await Promise.all(
    entries.map(async ([filePath, getModule]) => {
      const module = await getModule();
      const slug = module.frontmatter.slug || filePath.replace("../content/blog/", "").replace(".md", "").replace(/\/$/, "");
      return { ...module, slug };
    })
  );
  const latestPosts = posts.slice(0, 3);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Home - Astro Blog" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen"> <!-- Hero Section --> <section class="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h1 class="text-5xl md:text-6xl font-bold mb-6">
Create Dynamic Blog Pages with Astro
</h1> <p class="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
A fully-featured blog system with a control panel editor, Tailwind CSS
          styling, and dynamic markdown pages.
</p> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="/admin" class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-blue-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path> </svg>
Go to Editor
</a> <a href="/blog" class="inline-flex items-center justify-center px-8 py-3 border border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path> </svg>
View Blog
</a> </div> </div> </section> <!-- Features Section --> <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
How It Works
</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-8"> <div class="bg-gray-50 p-8 rounded-xl shadow-sm"> <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6"> <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path> </svg> </div> <h3 class="text-xl font-bold text-gray-900 mb-3">Edit Markdown</h3> <p class="text-gray-600">
Use the admin control panel to write blog posts in markdown with
              frontmatter. The editor provides a live preview.
</p> </div> <div class="bg-gray-50 p-8 rounded-xl shadow-sm"> <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6"> <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path> </svg> </div> <h3 class="text-xl font-bold text-gray-900 mb-3">Save to Files</h3> <p class="text-gray-600">
Posts are saved as .md files in <code class="bg-gray-200 px-1 rounded">src/pages/blog/</code>. The API handles file creation and validation.
</p> </div> <div class="bg-gray-50 p-8 rounded-xl shadow-sm"> <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6"> <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <h3 class="text-xl font-bold text-gray-900 mb-3">Dynamic Pages</h3> <p class="text-gray-600">
Astro generates static pages for each blog post using dynamic
              routing. Tailwind CSS ensures beautiful, responsive design.
</p> </div> </div> </div> </section> <!-- Latest Posts Preview --> <section class="py-16 bg-gray-50"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex justify-between items-center mb-10"> <h2 class="text-3xl font-bold text-gray-900">Latest Blog Posts</h2> <a href="/blog" class="text-blue-600 hover:text-blue-800 font-medium flex items-center">
View all posts
<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path> </svg> </a> </div> ${latestPosts.length > 0 ? renderTemplate`<div class="grid grid-cols-1 md:grid-cols-3 gap-8"> ${latestPosts.map((post) => renderTemplate`<article class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"> ${post.frontmatter.image ? renderTemplate`<img${addAttribute(post.frontmatter.image, "src")}${addAttribute(post.frontmatter.title, "alt")} class="w-full h-48 object-cover">` : renderTemplate`<div class="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>`} <div class="p-6"> <div class="text-sm text-gray-500 mb-3"> <time${addAttribute(post.frontmatter.pubDate, "datetime")}> ${post.frontmatter.pubDate} </time> </div> <h3 class="text-xl font-bold text-gray-900 mb-3"> <a${addAttribute(`/blog/${post.slug}`, "href")} class="hover:text-blue-600"> ${post.frontmatter.title} </a> </h3> <p class="text-gray-600 mb-4"> ${post.frontmatter.description || "No description provided."} </p> <a${addAttribute(`/blog/${post.slug}`, "href")} class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
Read more
<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path> </svg> </a> </div> </article>`)} </div>` : renderTemplate`<div class="text-center py-12 bg-white rounded-xl shadow-sm"> <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> <h3 class="mt-4 text-xl font-medium text-gray-900">
No blog posts yet
</h3> <p class="mt-2 text-gray-500 max-w-md mx-auto">
Create your first blog post using the admin editor.
</p> <div class="mt-6"> <a href="/admin" class="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
Create First Post
</a> </div> </div>`} </div> </section> <!-- Call to Action --> <section class="py-16 bg-white"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h2 class="text-3xl font-bold text-gray-900 mb-6">
Ready to start blogging?
</h2> <p class="text-xl text-gray-600 mb-10">
The admin panel gives you full control to create, edit, and manage
          your blog posts with ease.
</p> <a href="/admin" class="inline-flex items-center justify-center px-10 py-4 border border-transparent text-xl font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"> <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path> </svg>
Launch Admin Editor
</a> </div> </section> </div> ` })}`;
}, "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/index.astro", void 0);

const $$file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
