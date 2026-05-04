import {
  normalizePageFilename,
  parsePageMarkdown,
  readPageContent,
} from "../../lib/static-pages.js";

export const prerender = false;

export async function GET({ url }) {
  try {
    const filename = normalizePageFilename(new URL(url).searchParams.get("filename"));
    if (!filename) {
      return new Response(JSON.stringify({ error: "Invalid filename" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const content = await readPageContent(filename);
    if (!content) {
      return new Response(JSON.stringify({ error: "Page not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { frontmatter, body } = parsePageMarkdown(content);
    return new Response(JSON.stringify({ filename, content, frontmatter, body }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error loading standalone page:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
