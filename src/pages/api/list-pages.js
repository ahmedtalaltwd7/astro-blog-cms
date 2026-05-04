import { listPageFiles } from "../../lib/static-pages.js";

export const prerender = false;

export async function GET() {
  try {
    const pages = await listPageFiles();
    return new Response(JSON.stringify({ pages }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error listing standalone pages:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
