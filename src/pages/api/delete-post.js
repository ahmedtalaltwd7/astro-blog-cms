import fs from "node:fs/promises";
import path from "node:path";
import {
  deleteBlobEntry,
  isReadonlyRuntime,
  readTextBlob,
} from "../../lib/runtime-storage.js";

export const prerender = false;

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { filename } = data;

    if (!filename || typeof filename !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid filename" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Ensure filename ends with .md
    const safeFilename = filename.endsWith(".md") ? filename : `${filename}.md`;
    const blogDir = path.join(process.cwd(), "src", "content", "blog");
    const filePath = path.join(blogDir, safeFilename);

    const blobPath = `blog-posts/${safeFilename}`;
    const blobContent = await readTextBlob(blobPath);

    if (blobContent) {
      await deleteBlobEntry(blobPath);
    } else {
      if (isReadonlyRuntime()) {
        return new Response(JSON.stringify({ error: "File not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        return new Response(JSON.stringify({ error: "File not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Delete the file
      await fs.unlink(filePath);
    }

    console.log(`Deleted blog post: ${safeFilename}`);

    return new Response(
      JSON.stringify({ success: true, message: `Deleted ${safeFilename}` }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
