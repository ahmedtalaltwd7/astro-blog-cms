import { e as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_z5fA6ZdE.mjs';
import 'piccolore';
import 'clsx';

const html = () => "<h1 id=\"my-amazing-blog-post\">My Amazing Blog Post</h1>\n<p>Start writing your blog post here using <strong>markdown</strong> syntax.</p>\n<h2 id=\"features\">Features</h2>\n<ul>\n<li>Easy to write</li>\n<li>Supports code blocks</li>\n<li>Rendered beautifully by Astro</li>\n</ul>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">console.</span><span style=\"color:#B392F0\">log</span><span style=\"color:#E1E4E8\">(</span><span style=\"color:#9ECBFF\">\"Hello, world!\"</span><span style=\"color:#E1E4E8\">);</span></span></code></pre>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">Enjoy writing</span><span style=\"color:#F97583\">!</span></span></code></pre>\n<h2 id=\"faq\">FAQ</h2>\n<h3 id=\"question-one\">Question one?</h3>\n<p>Answer the question clearly.</p>\n<h3 id=\"question-two\">Question two?</h3>\n<p>Answer the question clearly.</p>\n<details>\n<summary>Read more</summary>\n<p>Hidden markdown-friendly details go here.</p>\n</details>\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<table><thead><tr><th>Option</th><th>Best for</th><th>Notes</th></tr></thead><tbody><tr><td>Option A</td><td>Quick starts</td><td>Add details here</td></tr><tr><td>Option B</td><td>Advanced use</td><td>Add details here</td></tr></tbody></table>";

				const frontmatter = {"title":"all bbee","pubDate":"2026-04-29T00:00:00.000Z","description":"A blog post about all bbee","author":"Blog Author","tags":["blog","astro"],"image":"/blog-images/Ahmed-Talal-Mohsen-Mohammed-upscayl-4x-realesrgan-x4plus-1777439738826-khsnu8.png"};
				const file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/content/blog/all.md";
				const url = undefined;
				function rawContent() {
					return "   \n                 \n                   \n                                         \n                     \n                       \n                                                                                                       \n   \n\n# My Amazing Blog Post\n\nStart writing your blog post here using **markdown** syntax.\n\n## Features\n\n- Easy to write\n- Supports code blocks\n- Rendered beautifully by Astro\n\n```javascript\nconsole.log(\"Hello, world!\");\n```\n\n\n```javascript\nEnjoy writing!\n```\n\n\n## FAQ\n\n### Question one?\n\nAnswer the question clearly.\n\n### Question two?\n\nAnswer the question clearly.\n\n\n\n\n<details>\n<summary>Read more</summary>\n\nHidden markdown-friendly details go here.\n\n</details>\n\n\n\n| Option | Best for | Notes |\n| --- | --- | --- |\n| Option A | Quick starts | Add details here |\n| Option B | Advanced use | Add details here |";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":1,"slug":"my-amazing-blog-post","text":"My Amazing Blog Post"},{"depth":2,"slug":"features","text":"Features"},{"depth":2,"slug":"faq","text":"FAQ"},{"depth":3,"slug":"question-one","text":"Question one?"},{"depth":3,"slug":"question-two","text":"Question two?"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html())}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
