import { e as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_z5fA6ZdE.mjs';
import 'piccolore';
import 'clsx';

const html = () => "<h1 id=\"my-amazing-blog-post\">My Amazing Blog Post</h1>\n<ul>\n<li>Start writing your blog post here using <strong>markdown</strong> syntax.</li>\n<li></li>\n</ul>\n<h2 id=\"features\">Features</h2>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#F97583\">-</span><span style=\"color:#E1E4E8\"> Easy to write</span></span>\n<span class=\"line\"></span></code></pre>\n<blockquote>\n<ul>\n<li>Supports code blocks</li>\n<li>Rendered beautifully by Astro</li>\n</ul>\n</blockquote>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">console.</span><span style=\"color:#B392F0\">log</span><span style=\"color:#E1E4E8\">(</span><span style=\"color:#9ECBFF\">\"Hello, world!\"</span><span style=\"color:#E1E4E8\">);</span></span></code></pre>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">Enjoy writing</span><span style=\"color:#F97583\">!</span></span></code></pre>";

				const frontmatter = {"title":"My Amaziccdfdfng Blog Post","pubDate":"2026-04-29T00:00:00.000Z","description":"A blog post about My Amaziccdfdfng Blog Post","author":"Blog Author","tags":["blog","astro"],"image":"/blog-images/Ahmed-Talal-Mohsen-Mohammed-upscayl-4x-realesrgan-x4plus-1777433823998-5xw3t9.png"};
				const file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/content/blog/my-amaziccdfdfng-blog-post.md";
				const url = undefined;
				function rawContent() {
					return "   \n                                   \n                   \n                                                           \n                     \n                       \n                                                                                                       \n   \n\n# My Amazing Blog Post\n\n- Start writing your blog post here using **markdown** syntax.\n- \n## Features\n\n\n```javascript\n- Easy to write\n\n```\n> - Supports code blocks\n> - Rendered beautifully by Astro\n\n```javascript\nconsole.log(\"Hello, world!\");\n```\n\n\n```javascript\nEnjoy writing!\n```\n";
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

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html())}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
