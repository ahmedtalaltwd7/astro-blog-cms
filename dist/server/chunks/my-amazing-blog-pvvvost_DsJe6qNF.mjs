import { e as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_z5fA6ZdE.mjs';
import 'piccolore';
import 'clsx';

const html = () => "<p><img src=\"/markdown-images/2025-08-29T00-52-37-1-1777592532715-tk4g3j.webp\" alt=\"2025 08 29T00.52.37 1\"></p>\n<h1 id=\"my-amazing-blog-post\">My Amazing Blog Post</h1>\n<p>Start writing your blog post here using <strong>markdown</strong> syntax.</p>\n<h2 id=\"features-of-this-editor\">Features of this editor:</h2>\n<ul>\n<li>Easy to write</li>\n<li>Supports code blocks</li>\n<li>Rendered beautifully by Astro</li>\n</ul>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">console.</span><span style=\"color:#B392F0\">log</span><span style=\"color:#E1E4E8\">(</span><span style=\"color:#9ECBFF\">\"Hello, world!\"</span><span style=\"color:#E1E4E8\">);</span></span></code></pre>\n<p>Enjoy writing!</p>\n<p><img src=\"/markdown-images/Ahmed-Talal-Mohsen-Mohammed-upscayl-4x-realesrgan-x4plus-1777592553068-l7qnrz.webp\" alt=\"Ahmed Talal Mohsen Mohammed upscayl 4x realesrgan x4plus\"></p>";

				const frontmatter = {"title":"My Amazing Blog Pvvvost","pubDate":"2026-04-30T00:00:00.000Z","description":"A blog post about My Amazing Blog Pvvvost","author":"Blog Author","tags":["blog","astro"],"image":"/blog-images/Copilot-20260308-065255-1777592567078-n0iz65.webp","thumbnail":"/blog-thumbs/Copilot-20260308-065255-1777592567078-n0iz65-thumb.webp"};
				const file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/content/blog/my-amazing-blog-pvvvost.md";
				const url = undefined;
				function rawContent() {
					return "   \n                                \n                   \n                                                        \n                     \n                       \n                                                                       \n                                                                                 \n   \n\n![2025 08 29T00.52.37 1](/markdown-images/2025-08-29T00-52-37-1-1777592532715-tk4g3j.webp)\n\n# My Amazing Blog Post\n\nStart writing your blog post here using **markdown** syntax.\n\n## Features of this editor:\n\n- Easy to write\n- Supports code blocks\n- Rendered beautifully by Astro\n\n```javascript\nconsole.log(\"Hello, world!\");\n```\n\nEnjoy writing!\n\n![Ahmed Talal Mohsen Mohammed upscayl 4x realesrgan x4plus](/markdown-images/Ahmed-Talal-Mohsen-Mohammed-upscayl-4x-realesrgan-x4plus-1777592553068-l7qnrz.webp)";
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
