import { e as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CPVj0fOm.mjs';
import 'piccolore';
import 'clsx';

const html = () => "<h1 id=\"my-amazing-blog-post\">My Amazing Blog Post</h1>\n<p>Start writing your blog post here using <strong>markdown</strong> syntax.</p>\n<h2 id=\"features-of-this-editor\">Features of this editor:</h2>\n<ul>\n<li>Easy to write</li>\n<li>Supports code blocks</li>\n<li>Rendered beautifully by Astro</li>\n</ul>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">console.</span><span style=\"color:#B392F0\">log</span><span style=\"color:#E1E4E8\">(</span><span style=\"color:#9ECBFF\">\"Hello, world!\"</span><span style=\"color:#E1E4E8\">);</span></span></code></pre>\n<p>Enjoy writing!</p>\n<img src=\"/markdown-images/20260501030810499-16ej3.webp\" alt=\"Ahmed Talal Mohsen Mohammed upscayl 4x realesrgan x4plus\" width=\"297\" style=\"display: block; height: auto; max-width: 100%; margin-left: 10px; margin-top: 64px;\">\n<p><img src=\"/markdown-images/20260501030840735-opaxu.webp\" alt=\"image(1)\"></p>";

				const frontmatter = {"title":"My Amazing Blog Post","pubDate":"2026-03-22T00:00:00.000Z","description":"A blog post about My Amazing Blog Post","author":"Blog Author","tags":["blog","astro"],"image":"/blog-images/20260501030911859-s16ga.webp","thumbnail":"/blog-thumbs/20260501030911859-s16ga-thumb.webp"};
				const file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/content/blog/new-post.md";
				const url = undefined;
				function rawContent() {
					return "   \n                             \n                   \n                                                     \n                     \n                       \n                                                  \n                                                            \n   \n\n# My Amazing Blog Post\n\nStart writing your blog post here using **markdown** syntax.\n\n## Features of this editor:\n\n- Easy to write\n- Supports code blocks\n- Rendered beautifully by Astro\n\n```javascript\nconsole.log(\"Hello, world!\");\n```\n\nEnjoy writing!\n\n<img src=\"/markdown-images/20260501030810499-16ej3.webp\" alt=\"Ahmed Talal Mohsen Mohammed upscayl 4x realesrgan x4plus\" width=\"297\" style=\"display: block; height: auto; max-width: 100%; margin-left: 10px; margin-top: 64px;\" />\n\n![image(1)](/markdown-images/20260501030840735-opaxu.webp)";
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
