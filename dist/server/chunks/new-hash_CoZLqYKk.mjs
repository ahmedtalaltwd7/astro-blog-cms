import { e as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_z5fA6ZdE.mjs';
import 'piccolore';
import 'clsx';

const html = () => "<h1 id=\"my-amazing-blog-post\">My Amazing Blog Post</h1>\n<p>Start writing your blog post here using <strong>markdown</strong> syntax.</p>\n<h2 id=\"features-of-this-editor\">Features of this editor:</h2>\n<ul>\n<li>Easy to write</li>\n<li>Supports code blocks</li>\n<li>Rendered beautifully by Astro</li>\n</ul>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">console.</span><span style=\"color:#B392F0\">log</span><span style=\"color:#E1E4E8\">(</span><span style=\"color:#9ECBFF\">\"Hello, world!\"</span><span style=\"color:#E1E4E8\">);</span></span></code></pre>\n<p>Enjoy</p>\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<table><thead><tr><th>Option</th><th>Best for</th><th>Notes</th></tr></thead><tbody><tr><td>Option A</td><td>Quick starts</td><td>Add details here</td></tr><tr><td>Option B</td><td>Advanced use</td><td>Add details here</td></tr></tbody></table>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"></span>\n<span class=\"line\"><span style=\"color:#F97583\">!</span><span style=\"color:#E1E4E8\">[</span><span style=\"color:#B392F0\">image</span><span style=\"color:#E1E4E8\">(</span><span style=\"color:#79B8FF\">3</span><span style=\"color:#E1E4E8\">)](</span><span style=\"color:#F97583\">/</span><span style=\"color:#E1E4E8\">markdown</span><span style=\"color:#F97583\">-</span><span style=\"color:#E1E4E8\">images</span><span style=\"color:#F97583\">/</span><span style=\"color:#E1E4E8\">image</span><span style=\"color:#F97583\">-</span><span style=\"color:#79B8FF\">3</span><span style=\"color:#F97583\">-</span><span style=\"color:#79B8FF\">1777581123965</span><span style=\"color:#F97583\">-</span><span style=\"color:#E1E4E8\">0p8ith.png)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color:#9ECBFF\">```javascript</span></span>\n<span class=\"line\"><span style=\"color:#9ECBFF\">dfsdfsgsdgsg</span></span>\n<span class=\"line\"></span></code></pre>\n<p>fafasf</p>\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<table><thead><tr><th>Option</th><th>Best for</th><th>Notes</th></tr></thead><tbody><tr><td>Option A</td><td>Quick starts</td><td>Add details here</td></tr><tr><td>Option B</td><td>Advanced use</td><td>Add details here</td></tr></tbody></table>";

				const frontmatter = {"title":"new hash","pubDate":"2026-04-30T00:00:00.000Z","description":"A blog post about new hash","author":"Blog Author","tags":["new.hggg"],"image":"/blog-images/TA-2026-02-04-01-07-16---highqual-2168316230-1777581181925-4uuux1.png"};
				const file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/content/blog/new-hash.md";
				const url = undefined;
				function rawContent() {
					return "   \n                 \n                   \n                                         \n                     \n                  \n                                                                                           \n   \n\n# My Amazing Blog Post\n\nStart writing your blog post here using **markdown** syntax.\n\n## Features of this editor:\n\n- Easy to write\n- Supports code blocks\n- Rendered beautifully by Astro\n\n```javascript\nconsole.log(\"Hello, world!\");\n```\n\nEnjoy \n\n| Option | Best for | Notes |\n| --- | --- | --- |\n| Option A | Quick starts | Add details here |\n| Option B | Advanced use | Add details here |\n\n```javascript\n\n![image(3)](/markdown-images/image-3-1777581123965-0p8ith.png)\n\n\n\n```javascript\ndfsdfsgsdgsg\n\n```\n\nfafasf\n\n\n\n\n| Option | Best for | Notes |\n| --- | --- | --- |\n| Option A | Quick starts | Add details here |\n| Option B | Advanced use | Add details here |\n";
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
