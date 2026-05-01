import { e as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_z5fA6ZdE.mjs';
import 'piccolore';
import 'clsx';

const html = () => "<h1 id=\"my-amazing-blog-post\">My Amazing Blog Post</h1>\n<p>Start writing your blog post here using <strong>markdown</strong> syntax.</p>\n<h2 id=\"features-of-this-editor\">Features of this editor:</h2>\n<ul>\n<li>Easy to write</li>\n<li>Supports code blocks</li>\n<li>Rendered beautifully by Astro</li>\n</ul>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">console.</span><span style=\"color:#B392F0\">log</span><span style=\"color:#E1E4E8\">(</span><span style=\"color:#9ECBFF\">\"Hello, world!\"</span><span style=\"color:#E1E4E8\">);</span></span></code></pre>\n<p>Enjoy writing!</p>\n<p><img src=\"/markdown-images/ABNuOD9Y1MCJQ4bReFull-1777591873966-xan5nt.webp\" alt=\"ABNuOD9Y1MCJQ4bReFull\"></p>\n<p><img src=\"/markdown-images/sQS1-euqWa7TeSWIp7hPG-1777591883718-m7z4bm.webp\" alt=\"sQS1 euqWa7TeSWIp7hPG\"></p>";

				const frontmatter = {"title":"thumb","pubDate":"2026-04-30T00:00:00.000Z","description":"A blog post about thumb","author":"Blog Author","tags":["blog","thumb"],"image":"/blog-images/sQS1-euqWa7TeSWIp7hPG-1777591911350-wnifu8.webp","thumbnail":"/blog-thumbs/sQS1-euqWa7TeSWIp7hPG-1777591911350-wnifu8-thumb.webp"};
				const file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/content/blog/thumb.md";
				const url = undefined;
				function rawContent() {
					return "   \n              \n                   \n                                      \n                     \n                       \n                                                                     \n                                                                               \n   \n\n# My Amazing Blog Post\n\nStart writing your blog post here using **markdown** syntax.\n\n## Features of this editor:\n\n- Easy to write\n- Supports code blocks\n- Rendered beautifully by Astro\n\n```javascript\nconsole.log(\"Hello, world!\");\n```\n\nEnjoy writing!\n\n![ABNuOD9Y1MCJQ4bReFull](/markdown-images/ABNuOD9Y1MCJQ4bReFull-1777591873966-xan5nt.webp)\n\n![sQS1 euqWa7TeSWIp7hPG](/markdown-images/sQS1-euqWa7TeSWIp7hPG-1777591883718-m7z4bm.webp)";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":1,"slug":"my-amazing-blog-post","text":"My Amazing Blog Post"},{"depth":2,"slug":"features-of-this-editor","text":"Features of this editor:"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html())}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
