import { e as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_RHxhWfPN.mjs';
import 'piccolore';
import 'clsx';

const html = () => "<h1 id=\"\"></h1>\n<blockquote>\n</blockquote>\n<ul>\n<li></li>\n</ul>\n<h2 id=\"features\">Features</h2>\n<ul>\n<li>Easy to <strong>write</strong></li>\n<li>Supports code blocks</li>\n<li>Rendered beautifully by Astro</li>\n</ul>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">console.</span><span style=\"color:#B392F0\">log</span><span style=\"color:#E1E4E8\">(</span><span style=\"color:#9ECBFF\">\"Hello, world!\"</span><span style=\"color:#E1E4E8\">);</span></span></code></pre>\n<p>Enjoy writing!</p>";

				const frontmatter = {"title":"777777777777777777777","pubDate":"2026-03-22T00:00:00.000Z","description":"A blog post about 777777777777777777777","author":"Blog Author","tags":["blog","astro"],"image":"/blog-images/TA-2026-03-19-02-01-53-Adramatica-3482061408-1774162467573-oxj6ne.png"};
				const file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/content/blog/new-pohhhhhst.md";
				const url = undefined;
				function rawContent() {
					return "   \n                              \n                   \n                                                      \n                     \n                       \n                                                                                           \n   \n\n# \n> \n\n- \n## Features\n\n- Easy to **write**\n- Supports code blocks\n- Rendered beautifully by Astro\n\n```javascript\nconsole.log(\"Hello, world!\");\n```\n\nEnjoy writing!";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":1,"slug":"","text":""},{"depth":2,"slug":"features","text":"Features"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html())}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
