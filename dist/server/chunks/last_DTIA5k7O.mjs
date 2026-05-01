import { e as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CPVj0fOm.mjs';
import 'piccolore';
import 'clsx';

const html = () => "<h1 id=\"my-amazing-blog-post\">My Amazing Blog Post</h1>\n<p>Start writing your blog post here using <strong>markdown</strong> syntax.</p>\n<h2 id=\"features\">Features</h2>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#F97583\">-</span><span style=\"color:#E1E4E8\"> Easy to write</span></span>\n<span class=\"line\"></span></code></pre>\n<ul>\n<li>Supports code blocks</li>\n<li>Rendered beautifully by Astro</li>\n</ul>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">console.</span><span style=\"color:#B392F0\">log</span><span style=\"color:#E1E4E8\">(</span><span style=\"color:#9ECBFF\">\"Hello, world!\"</span><span style=\"color:#E1E4E8\">);</span></span></code></pre>\n<ul>\n<li>fgfgg</li>\n</ul>\n<p><img src=\"/markdown-images/w3-pTwTER7o3QyEgdYUHZ-1777441032930-qp5bym.png\" alt=\"w3 pTwTER7o3QyEgdYUHZ\"></p>\n<p>Enjoy writing!</p>\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<table><thead><tr><th>Option</th><th>Best for</th><th>Notes</th></tr></thead><tbody><tr><td>Option A</td><td>Quick starts</td><td>Add details here</td></tr><tr><td>Option B</td><td>Advanced use</td><td>Add details here</td></tr></tbody></table>";

				const frontmatter = {"title":"last","pubDate":"2026-04-29T00:00:00.000Z","description":"A blog post about last","author":"Blog Author","tags":["blog","astro"],"image":"/blog-images/2026-04-09T22-14-32-1-1777441305028-7vndmh.jpg"};
				const file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/content/blog/last.md";
				const url = undefined;
				function rawContent() {
					return "   \n             \n                   \n                                     \n                     \n                       \n                                                                    \n   \n\n# My Amazing Blog Post\n\nStart writing your blog post here using **markdown** syntax.\n\n## Features\n\n\n```javascript\n- Easy to write\n\n```\n- Supports code blocks\n- Rendered beautifully by Astro\n\n```javascript\nconsole.log(\"Hello, world!\");\n```\n- fgfgg\n\n![w3 pTwTER7o3QyEgdYUHZ](/markdown-images/w3-pTwTER7o3QyEgdYUHZ-1777441032930-qp5bym.png)\n\n\nEnjoy writing!\n\n\n\n| Option | Best for | Notes |\n| --- | --- | --- |\n| Option A | Quick starts | Add details here |\n| Option B | Advanced use | Add details here |\n";
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
