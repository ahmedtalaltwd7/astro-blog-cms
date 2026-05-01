import { e as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_RHxhWfPN.mjs';
import 'piccolore';
import 'clsx';

const html = () => "<h1 id=\"my-amazing-blog-post\">My Amazing Blog Post</h1>\n<p>Start writing your blog post here using <strong>markdown</strong> syntax.</p>\n<h2 id=\"features-of-this-editor\">Features of this editor:</h2>\n<p><img src=\"/markdown-images/ocr-crop-202603081344109125b43a3d08402a-crop-1-1772948662395-1777588173935-wmu42v.jpg\" alt=\"ocr crop 202603081344109125b43a3d08402a crop 1 1772948662395\"></p>\n<ul>\n<li>Supports code blocks</li>\n<li>Rendered beautifully by Astro</li>\n</ul>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">console.</span><span style=\"color:#B392F0\">log</span><span style=\"color:#E1E4E8\">(</span><span style=\"color:#9ECBFF\">\"Hello, world!\"</span><span style=\"color:#E1E4E8\">);</span></span></code></pre>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">Enjoy writing</span><span style=\"color:#F97583\">!</span></span></code></pre>";

				const frontmatter = {"title":"the man is hero","pubDate":"2026-04-30T00:00:00.000Z","description":"A blog post about the man is hero","author":"Blog Author","tags":["hero","man"],"image":"/blog-images/Gemini-Generated-Image-imk9ofimk9ofimk9-1777588185888-s2zshd.png"};
				const file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/content/blog/the-man-is-hero.md";
				const url = undefined;
				function rawContent() {
					return "   \n                        \n                   \n                                                \n                     \n                     \n                                                                                      \n   \n\n# My Amazing Blog Post\n\nStart writing your blog post here using **markdown** syntax.\n\n## Features of this editor:\n\n\n\n![ocr crop 202603081344109125b43a3d08402a crop 1 1772948662395](/markdown-images/ocr-crop-202603081344109125b43a3d08402a-crop-1-1772948662395-1777588173935-wmu42v.jpg)\n\n\n- Supports code blocks\n- Rendered beautifully by Astro\n\n```javascript\nconsole.log(\"Hello, world!\");\n```\n\n\n```javascript\nEnjoy writing!\n```";
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
