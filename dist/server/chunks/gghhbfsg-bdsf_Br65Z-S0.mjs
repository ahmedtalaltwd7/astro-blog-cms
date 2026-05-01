import { e as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_RHxhWfPN.mjs';
import 'piccolore';
import 'clsx';

const html = () => "<h1 id=\"my-amazing-blog-post\">My Amazing Blog Post</h1>\n<p>Start writing your blog post here using <strong>markdown</strong> syntax.</p>\n<h2 id=\"features-of-this-editor\">Features of this editor:</h2>\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<table><thead><tr><th>Option</th><th>Best for</th><th>Notes</th></tr></thead><tbody><tr><td>Option A</td><td>Quick starts</td><td>Add details here</td></tr><tr><td>Option B</td><td>Advanced use</td><td>Add details here</td></tr></tbody></table>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">console.</span><span style=\"color:#B392F0\">log</span><span style=\"color:#E1E4E8\">(</span><span style=\"color:#9ECBFF\">\"Hello, world!\"</span><span style=\"color:#E1E4E8\">);</span></span></code></pre>\n<h1 id=\"enjoy-writing\">Enjoy writing!</h1>";

				const frontmatter = {"title":"gghhbfsg bdsf","pubDate":"2026-04-30T00:00:00.000Z","description":"A blog post about gghhbfsg bdsf","author":"Blog Author","tags":["twd","hash","new.hggg"],"image":"/blog-images/P31GVOUKuiH5o1-mfWCfl-1777581296281-mjvqnl.png"};
				const file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/content/blog/gghhbfsg-bdsf.md";
				const url = undefined;
				function rawContent() {
					return "   \n                      \n                   \n                                              \n                     \n                                 \n                                                                    \n   \n\n# My Amazing Blog Post\n\nStart writing your blog post here using **markdown** syntax.\n\n## Features of this editor:\n\n\n\n| Option | Best for | Notes |\n| --- | --- | --- |\n| Option A | Quick starts | Add details here |\n| Option B | Advanced use | Add details here |\n\n\n```javascript\nconsole.log(\"Hello, world!\");\n```\n\n# Enjoy writing!";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":1,"slug":"my-amazing-blog-post","text":"My Amazing Blog Post"},{"depth":2,"slug":"features-of-this-editor","text":"Features of this editor:"},{"depth":1,"slug":"enjoy-writing","text":"Enjoy writing!"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html())}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
