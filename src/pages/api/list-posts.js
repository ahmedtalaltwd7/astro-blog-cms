import fs from "node:fs/promises";
import path from "node:path";

export const prerender = false;

export async function GET({ request, url }) {
  try {
    const searchParams = new URL(url).searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const offset = (page - 1) * limit;

    const blogDir = path.join(process.cwd(), "src", "content", "blog");
    const files = await fs.readdir(blogDir);
    const markdownFiles = files.filter((file) => file.endsWith(".md"));

    const posts = await Promise.all(
      markdownFiles.map(async (filename) => {
        const filePath = path.join(blogDir, filename);
        const content = await fs.readFile(filePath, "utf-8");
        // Extract frontmatter (simple parsing)
        const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
        let title = filename.replace(".md", "");
        let pubDate = "";
        let description = "";
        let author = "";
        let tags = [];
        let image = "";

        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          const lines = frontmatter.split("\n");
          for (const line of lines) {
            if (line.startsWith("title:")) {
              title = line
                .replace("title:", "")
                .trim()
                .replace(/^["']|["']$/g, "");
            } else if (line.startsWith("pubDate:")) {
              pubDate = line.replace("pubDate:", "").trim();
            } else if (line.startsWith("description:")) {
              description = line
                .replace("description:", "")
                .trim()
                .replace(/^["']|["']$/g, "");
            } else if (line.startsWith("author:")) {
              author = line
                .replace("author:", "")
                .trim()
                .replace(/^["']|["']$/g, "");
            } else if (line.startsWith("tags:")) {
              const tagsStr = line.replace("tags:", "").trim();
              if (tagsStr.startsWith("[") && tagsStr.endsWith("]")) {
                tags = tagsStr
                  .slice(1, -1)
                  .split(",")
                  .map((t) => t.trim().replace(/^["']|["']$/g, ""));
              }
            } else if (line.startsWith("image:")) {
              image = line
                .replace("image:", "")
                .trim()
                .replace(/^["']|["']$/g, "");
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
          contentPreview:
            content.slice(0, 200) + (content.length > 200 ? "..." : ""),
          slug: filename.replace(".md", ""),
        };
      }),
    );

    // Sort by pubDate descending (newest first)
    posts.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    const total = posts.length;
    const paginatedPosts = posts.slice(offset, offset + limit);
    const totalPages = Math.ceil(total / limit);

    return new Response(
      JSON.stringify({
        posts: paginatedPosts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error listing posts:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
