import { e as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CPVj0fOm.mjs';
import 'piccolore';
import 'clsx';

const html = () => "<h1 id=\"my-amazing-blog-post\">My Amazing Blog Post</h1>\n<p>Start writing your blog post here using <strong>markdown</strong> syntax.</p>\n<h2 id=\"features\">Features</h2>\n<ul>\n<li>Easy to write</li>\n<li>Supports code blocks</li>\n<li>Rendered beautifully by Astro</li>\n</ul>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">console.</span><span style=\"color:#B392F0\">log</span><span style=\"color:#E1E4E8\">(</span><span style=\"color:#9ECBFF\">\"Hello, world!\"</span><span style=\"color:#E1E4E8\">);</span></span></code></pre>\n<p>Enjoy writing!</p>\n<img src=\"/markdown-images/2026-04-09T22-21-43-2-1777445807743-2c1sie.jpg\" alt=\"2026 04 09T22.21.43 2\" width=\"222\" style=\"display: block; height: auto; max-width: 100%; margin-left: 57px; margin-top: 173px;\">\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">fhdfhfgfjfjghkgkk</span></span></code></pre>\n<img src=\"/markdown-images/2026-04-17T00-36-31-1-1777445852896-lnzyf0.jpg\" alt=\"2026 04 17T00.36.31 1\" width=\"235\" style=\"display: block; height: auto; max-width: 100%; margin-left: 36px; margin-top: 199px;\">";

				const frontmatter = {"title":"last3","pubDate":"2026-04-29T00:00:00.000Z","description":"A blog post about last3","author":"Blog Author","tags":["blog","astro"],"image":"/blog-images/91yMZIThVE83qmKwthTHA-1777445943259-v2t69i.png"};
				const file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/content/blog/last3.md";
				const url = undefined;
				function rawContent() {
					return "   \n              \n                   \n                                      \n                     \n                       \n                                                                    \n   \n\n# My Amazing Blog Post\n\nStart writing your blog post here using **markdown** syntax.\n\n## Features\n\n- Easy to write\n- Supports code blocks\n- Rendered beautifully by Astro\n\n```javascript\nconsole.log(\"Hello, world!\");\n```\n\nEnjoy writing!\n\n<img src=\"/markdown-images/2026-04-09T22-21-43-2-1777445807743-2c1sie.jpg\" alt=\"2026 04 09T22.21.43 2\" width=\"222\" style=\"display: block; height: auto; max-width: 100%; margin-left: 57px; margin-top: 173px;\" />\n\n\n```javascript\nfhdfhfgfjfjghkgkk\n```\n\n\n<img src=\"/markdown-images/2026-04-17T00-36-31-1-1777445852896-lnzyf0.jpg\" alt=\"2026 04 17T00.36.31 1\" width=\"235\" style=\"display: block; height: auto; max-width: 100%; margin-left: 36px; margin-top: 199px;\" />";
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
