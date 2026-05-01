import { e as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_RHxhWfPN.mjs';
import 'piccolore';
import 'clsx';

const html = () => "<h1 id=\"ffffff\">ffffff</h1>\n<p>Start writing your blog post here using <strong>markdown</strong> syntax.</p>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">## Features</span></span>\n<span class=\"line\"></span></code></pre>\n<ul>\n<li>Easy to write</li>\n<li>Supports code blocks</li>\n<li>Rendered beautifully by Astro</li>\n</ul>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">console.</span><span style=\"color:#B392F0\">log</span><span style=\"color:#E1E4E8\">(</span><span style=\"color:#9ECBFF\">\"Hello, world!\"</span><span style=\"color:#E1E4E8\">);</span></span></code></pre>\n<p>Enjoy writing!</p>\n<img src=\"/markdown-images/NHCXTJQ9VAEV359FVYDJTHVQ70-1777447098287-6meqy5.jpg\" alt=\"NHCXTJQ9VAEV359FVYDJTHVQ70\" width=\"461\" style=\"display: block; height: auto; max-width: 100%; margin-left: 124px;\">\n<h1 id=\"twd\">twd</h1>\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<table><thead><tr><th>Option</th><th>Best for</th><th>Notes</th></tr></thead><tbody><tr><td>Option A</td><td>Quick starts</td><td>Add details here</td></tr><tr><td>Option B</td><td>Advanced use</td><td>Add details here</td></tr></tbody></table>";

				const frontmatter = {"title":"احمداحمداحمد","pubDate":"2026-04-29T00:00:00.000Z","description":"A blog post about احمداحمداحمد","author":"Blog Author","tags":["blog","astro"],"image":"/blog-images/2026-03-13T01-37-38-1-1777447247376-c9vgiz.jpg"};
				const file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/content/blog/new-zzpost.md";
				const url = undefined;
				function rawContent() {
					return "   \n                     \n                   \n                                             \n                     \n                       \n                                                                    \n   \n\n# ffffff\n\nStart writing your blog post here using **markdown** syntax.\n\n\n```javascript\n## Features\n\n```\n\n- Easy to write\n- Supports code blocks\n- Rendered beautifully by Astro\n\n```javascript\nconsole.log(\"Hello, world!\");\n```\n\nEnjoy writing!\n\n<img src=\"/markdown-images/NHCXTJQ9VAEV359FVYDJTHVQ70-1777447098287-6meqy5.jpg\" alt=\"NHCXTJQ9VAEV359FVYDJTHVQ70\" width=\"461\" style=\"display: block; height: auto; max-width: 100%; margin-left: 124px;\" />\n\n# twd\n\n\n\n\n\n| Option | Best for | Notes |\n| --- | --- | --- |\n| Option A | Quick starts | Add details here |\n| Option B | Advanced use | Add details here |";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":1,"slug":"ffffff","text":"ffffff"},{"depth":1,"slug":"twd","text":"twd"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html())}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
