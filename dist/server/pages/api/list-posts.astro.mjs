import fs from 'node:fs/promises';
import path from 'node:path';
export { renderers } from '../../renderers.mjs';

const prerender = false;
function normalizeTag(value) {
  return String(value || "").trim().replace(/^#+/, "").toLowerCase();
}
async function GET({
  request,
  url
}) {
  try {
    const searchParams = new URL(url).searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const tag = normalizeTag(searchParams.get("tag"));
    const offset = (page - 1) * limit;
    const blogDir = path.join(process.cwd(), "src", "content", "blog");
    const files = await fs.readdir(blogDir);
    const markdownFiles = files.filter(file => file.endsWith(".md"));
    const posts = await Promise.all(markdownFiles.map(async filename => {
      const filePath = path.join(blogDir, filename);
      const [content, stats] = await Promise.all([fs.readFile(filePath, "utf-8"), fs.stat(filePath)]);
      // Extract frontmatter (simple parsing)
      const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
      let title = filename.replace(".md", "");
      let pubDate = "";
      let description = "";
      let author = "";
      let tags = [];
      let image = "";
      let thumbnail = "";
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const lines = frontmatter.split("\n");
        for (const line of lines) {
          if (line.startsWith("title:")) {
            title = line.replace("title:", "").trim().replace(/^["']|["']$/g, "");
          } else if (line.startsWith("pubDate:")) {
            pubDate = line.replace("pubDate:", "").trim();
          } else if (line.startsWith("description:")) {
            description = line.replace("description:", "").trim().replace(/^["']|["']$/g, "");
          } else if (line.startsWith("author:")) {
            author = line.replace("author:", "").trim().replace(/^["']|["']$/g, "");
          } else if (line.startsWith("tags:")) {
            const tagsStr = line.replace("tags:", "").trim();
            if (tagsStr.startsWith("[") && tagsStr.endsWith("]")) {
              tags = tagsStr.slice(1, -1).split(",").map(t => t.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
            }
          } else if (line.startsWith("image:")) {
            image = line.replace("image:", "").trim().replace(/^["']|["']$/g, "");
          } else if (line.startsWith("thumbnail:")) {
            thumbnail = line.replace("thumbnail:", "").trim().replace(/^["']|["']$/g, "");
          }
        }
      }
      return {
        filename,
        title,
        pubDate,
        description,
        author,
        tags,
        image,
        thumbnail,
        createdAt: stats.birthtime.toISOString(),
        createdAtMs: stats.birthtimeMs,
        updatedAt: stats.mtime.toISOString(),
        updatedAtMs: stats.mtimeMs,
        contentPreview: content.slice(0, 200) + (content.length > 200 ? "..." : ""),
        slug: filename.replace(".md", "")
      };
    }));
    const filteredPosts = posts.filter(post => {
      const matchesSearch = search ? post.title.toLowerCase().includes(search) : true;
      const matchesTag = tag ? (post.tags || []).some(postTag => normalizeTag(postTag) === tag) : true;
      return matchesSearch && matchesTag;
    });

    // Sort by original creation time so editing a post keeps it in place.
    filteredPosts.sort((a, b) => b.createdAtMs - a.createdAtMs);
    const total = filteredPosts.length;
    const paginatedPosts = filteredPosts.slice(offset, offset + limit);
    const totalPages = Math.ceil(total / limit);
    return new Response(JSON.stringify({
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error listing posts:", error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
