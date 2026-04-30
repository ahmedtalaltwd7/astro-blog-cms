import fs from 'node:fs/promises';
import path from 'node:path';
export { renderers } from '../../renderers.mjs';

const prerender = false;

// Helper to parse frontmatter and body from markdown content
function parseFrontmatter(content) {
  const lines = content.split("\n");
  if (lines[0]?.trim() === "---") {
    let endIndex = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i]?.trim() === "---") {
        endIndex = i;
        break;
      }
    }
    if (endIndex !== -1) {
      const frontmatterLines = lines.slice(1, endIndex);
      const body = lines.slice(endIndex + 1).join("\n");
      // Parse frontmatter key-value pairs (simple YAML)
      const frontmatter = {};
      for (const line of frontmatterLines) {
        const match = line.match(/^(\w+):\s*(.*)$/);
        if (match) {
          const key = match[1];
          let value = match[2].trim();
          // Remove surrounding quotes if present
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1);
          }
          if (value.startsWith("[") && value.endsWith("]")) {
            value = value.slice(1, -1).split(",").map(item => item.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
          }
          frontmatter[key] = value;
        }
      }
      return {
        frontmatter,
        body
      };
    }
  }
  // No frontmatter found
  return {
    frontmatter: {},
    body: content
  };
}
async function GET({
  request,
  url
}) {
  try {
    const searchParams = new URL(url).searchParams;
    const filename = searchParams.get("filename");
    if (!filename) {
      return new Response(JSON.stringify({
        error: "Missing filename parameter"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    // Ensure filename ends with .md and doesn't contain path traversal
    if (!filename.endsWith(".md") || filename.includes("..")) {
      return new Response(JSON.stringify({
        error: "Invalid filename"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const blogDir = path.join(process.cwd(), "src", "content", "blog");
    const filePath = path.join(blogDir, filename);
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (err) {
      return new Response(JSON.stringify({
        error: "File not found"
      }), {
        status: 404,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const content = await fs.readFile(filePath, "utf-8");
    const {
      frontmatter,
      body
    } = parseFrontmatter(content);
    return new Response(JSON.stringify({
      filename,
      content,
      // raw full content for backward compatibility
      frontmatter,
      body
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error fetching post:", error);
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
