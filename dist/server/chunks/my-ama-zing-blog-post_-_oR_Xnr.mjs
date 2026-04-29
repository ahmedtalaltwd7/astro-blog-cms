import { e as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_z5fA6ZdE.mjs';
import 'piccolore';
import 'clsx';

const html = () => "<h1 id=\"احمدطلال\">احمدطلال</h1>\n<ol>\n<li>Start writing your blog post here using <strong>markdown</strong> syntax.</li>\n<li></li>\n</ol>\n<h2 id=\"features\">Features</h2>\n<h3 id=\"--easy-to-write\">- Easy to write</h3>\n<ul>\n<li>Supports code blocks</li>\n<li>Rendered beautifully by Astro</li>\n</ul>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">console.</span><span style=\"color:#B392F0\">log</span><span style=\"color:#E1E4E8\">(</span><span style=\"color:#9ECBFF\">\"Hello, world!\"</span><span style=\"color:#E1E4E8\">);</span></span></code></pre>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">Enjoy writing</span><span style=\"color:#F97583\">!</span></span></code></pre>";

				const frontmatter = {"title":"My Amaيبغغzing Blog Post","pubDate":"2026-04-29T00:00:00.000Z","description":"A blog post about My Amaيبغغzing Blog Post","author":"Blog Author","tags":["blog","astro"],"image":"/blog-images/K5Q4APkYw26Zj6-n4sIz5-1777433535399-b78zsy.png"};
				const file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/content/blog/my-ama-zing-blog-post.md";
				const url = undefined;
				function rawContent() {
					return "   \n                                 \n                   \n                                                         \n                     \n                       \n                                                                    \n   \n\n# احمدطلال\n\n1. Start writing your blog post here using **markdown** syntax.\n2. \n## Features\n\n### - Easy to write\n- Supports code blocks\n- Rendered beautifully by Astro\n\n```javascript\nconsole.log(\"Hello, world!\");\n```\n\n\n```javascript\nEnjoy writing!\n```\n";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":1,"slug":"احمدطلال","text":"احمدطلال"},{"depth":2,"slug":"features","text":"Features"},{"depth":3,"slug":"--easy-to-write","text":"- Easy to write"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html())}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
