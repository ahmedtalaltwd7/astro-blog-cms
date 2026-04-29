import { e as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_z5fA6ZdE.mjs';
import 'piccolore';
import 'clsx';

const html = () => "<h3 id=\"my-amazing-blog-post\">My Amazing Blog Post</h3>\n<p>Start writing your blog post here using <strong>markdown</strong> syntax.</p>\n<h2 id=\"features\">Features</h2>\n<ul>\n<li>\n<ul>\n<li>Easy to write</li>\n</ul>\n</li>\n<li>\n<ul>\n<li>Supports code blocks</li>\n</ul>\n</li>\n<li>Rendered beautifully by Astro</li>\n</ul>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">console.</span><span style=\"color:#B392F0\">log</span><span style=\"color:#E1E4E8\">(</span><span style=\"color:#9ECBFF\">\"Hello, world!\"</span><span style=\"color:#E1E4E8\">);</span></span></code></pre>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">Enjoy writing</span><span style=\"color:#F97583\">!</span></span></code></pre>\n<p><a href=\"https://eeee.com\">twd</a></p>";

				const frontmatter = {"title":"444444444444444441111111110000","pubDate":"2026-04-29T00:00:00.000Z","description":"A blog post about 444444444444444441111111110000","author":"Blog Author","tags":["blog","astro"],"image":"/blog-images/Ahmed-Talal-Mohsen-Mohammed-upscayl-4x-realesrgan-x4plus-1777434584561-i15r5z.png"};
				const file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/content/blog/444444444444444441111111110000.md";
				const url = undefined;
				function rawContent() {
					return "   \n                                       \n                   \n                                                               \n                     \n                       \n                                                                                                       \n   \n\n### My Amazing Blog Post\n\nStart writing your blog post here using **markdown** syntax.\n\n## Features\n\n- - Easy to write\n- - Supports code blocks\n- Rendered beautifully by Astro\n\n```javascript\nconsole.log(\"Hello, world!\");\n```\n\n\n```javascript\nEnjoy writing!\n```\n[twd](https://eeee.com)";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":3,"slug":"my-amazing-blog-post","text":"My Amazing Blog Post"},{"depth":2,"slug":"features","text":"Features"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html())}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
