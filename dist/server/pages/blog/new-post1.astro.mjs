/* empty css                                    */
import { e as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from '../../chunks/astro/server_z5fA6ZdE.mjs';
import 'piccolore';
import 'clsx';
export { renderers } from '../../renderers.mjs';

const html = () => "<h1 id=\"my-amazing-blog-post\">My Amazing Blog Post</h1>\n<p>Start writing your blog post here using <strong>markdown</strong> syntax.</p>\n<h2 id=\"features\">Features</h2>\n<ul>\n<li>Easy to write</li>\n<li>Supports code blocks</li>\n<li>Rendered beautifully by Astro</li>\n</ul>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">console.</span><span style=\"color:#B392F0\">log</span><span style=\"color:#E1E4E8\">(</span><span style=\"color:#9ECBFF\">\"Hello, world!\"</span><span style=\"color:#E1E4E8\">);</span></span></code></pre>\n<p>Enjoy writing!</p>";

				const frontmatter = {"title":"My Amazing Blog Post","pubDate":"2026-03-22T00:00:00.000Z","description":"A blog post about My Amazing Blog Post","author":"Blog Author","tags":["blog","astro"],"image":"/blog-images/R1R5C75P7JNPA34X66QGAFRKZ0-1774141016262-mycxtk.jpeg"};
				const file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/blog/new-post1.md";
				const url = "/blog/new-post1";
				function rawContent() {
					return "   \n                             \n                   \n                                                     \n                     \n                       \n                                                                          \n   \n\n# My Amazing Blog Post\n\nStart writing your blog post here using **markdown** syntax.\n\n## Features\n\n- Easy to write\n- Supports code blocks\n- Rendered beautifully by Astro\n\n```javascript\nconsole.log(\"Hello, world!\");\n```\n\nEnjoy writing!";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":1,"slug":"my-amazing-blog-post","text":"My Amazing Blog Post"},{"depth":2,"slug":"features","text":"Features"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`<meta charset="utf-8">${maybeRenderHead()}${unescapeHTML(html())}`;
				});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	Content,
	compiledContent,
	default: Content,
	file,
	frontmatter,
	getHeadings,
	rawContent,
	url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
