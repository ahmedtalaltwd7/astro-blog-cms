import { e as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_z5fA6ZdE.mjs';
import 'piccolore';
import 'clsx';

const html = () => "<h1 id=\"mmmmmmmmmmmmmmmmmmmm\">mmmmmmmmmmmmmmmmmmmm</h1>\n<p>Start writing your blog post here using <strong>markdown</strong> syntax.</p>\n<h2 id=\"features\">Features</h2>\n<ul>\n<li>Easy to write</li>\n<li>Supports code blocks</li>\n<li>Rendered beautifully by Astro</li>\n</ul>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">console.</span><span style=\"color:#B392F0\">log</span><span style=\"color:#E1E4E8\">(</span><span style=\"color:#9ECBFF\">\"Hello, world!\"</span><span style=\"color:#E1E4E8\">);</span></span></code></pre>\n<p>Enjoy writing!</p>";

				const frontmatter = {"title":"My Amazing Blog Post mmm","pubDate":"2026-03-22T00:00:00.000Z","description":"A blog post about My Amazing Blog Post mmm","author":"Blog Author","tags":["blog","astro"],"image":"/blog-images/2026-03-13T05-37-34-1-1774151652317-rrl0q8.jpg"};
				const file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/content/blog/new-post.md";
				const url = undefined;
				function rawContent() {
					return "   \r\n                                 \r\n                   \r\n                                                         \r\n                     \r\n                       \r\n                                                                    \r\n   \r\n\r\n# mmmmmmmmmmmmmmmmmmmm\r\n\r\nStart writing your blog post here using **markdown** syntax.\r\n\r\n## Features\r\n\r\n- Easy to write\r\n- Supports code blocks\r\n- Rendered beautifully by Astro\r\n\r\n```javascript\r\nconsole.log(\"Hello, world!\");\r\n```\r\n\r\nEnjoy writing!\r\n";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":1,"slug":"mmmmmmmmmmmmmmmmmmmm","text":"mmmmmmmmmmmmmmmmmmmm"},{"depth":2,"slug":"features","text":"Features"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html())}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
