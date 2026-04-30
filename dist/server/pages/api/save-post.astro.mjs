import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
export { renderers } from '../../renderers.mjs';

const prerender = false;

// Helper to add CORS headers to a response
function addCorsHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// Helper to strip existing frontmatter from content
function stripFrontmatter(content) {
  // If content starts with "---" and has a second "---" within first 20 lines, remove that block
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
      // Remove lines from start to endIndex inclusive
      return lines.slice(endIndex + 1).join("\n");
    }
  }
  return content;
}
function getFrontmatterValue(content, key) {
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return "";
  const line = frontmatterMatch[1].split("\n").find(frontmatterLine => frontmatterLine.startsWith(`${key}:`));
  return line ? line.replace(`${key}:`, "").trim() : "";
}
function normalizeTags(value) {
  const input = Array.isArray(value) ? value.join(",") : String(value || "");
  const seen = new Set();
  return input.split(/[,\n]/).map(tag => tag.trim().replace(/^#+/, "").trim()).filter(Boolean).filter(tag => {
    const key = tag.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
async function OPTIONS({
  request
}) {
  console.error(`[${new Date().toISOString()}] OPTIONS handler called`);
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
const MAX_IMAGE_DIMENSION = 1920;

// Helper to generate a safe filename for uploaded image
function generateImageFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase();
  const base = path.basename(originalName, ext).replace(/[^a-zA-Z0-9]/g, "-");
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${base}-${timestamp}-${random}${ext}`;
}

// Helper to get all directories where images should be saved.
// In production (standalone Node build), static assets are served from
// dist/client/ — so we write there too so images appear without a rebuild.
async function getImageDirs() {
  const cwd = process.cwd();
  const publicDir = path.join(cwd, "public", "blog-images");
  const distClientDir = path.join(cwd, "dist", "client", "blog-images");
  const dirs = [publicDir];
  // Only add dist/client if it exists (i.e. a build has been run)
  try {
    await fs.access(path.join(cwd, "dist", "client"));
    dirs.push(distClientDir);
  } catch {
    // dist/client doesn't exist yet — dev mode, skip it
  }
  return dirs;
}
async function optimizeImageBuffer(buffer) {
  try {
    const image = sharp(buffer, {
      failOn: "none"
    }).rotate();
    const metadata = await image.metadata();
    const format = metadata.format;
    let optimizedImage = image.resize({
      width: MAX_IMAGE_DIMENSION,
      height: MAX_IMAGE_DIMENSION,
      fit: "inside",
      withoutEnlargement: true
    });
    if (format === "jpeg" || format === "jpg") {
      optimizedImage = optimizedImage.jpeg({
        quality: 84,
        mozjpeg: true
      });
    } else if (format === "png") {
      optimizedImage = optimizedImage.png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        effort: 10
      });
    } else if (format === "webp") {
      optimizedImage = optimizedImage.webp({
        quality: 84,
        effort: 5
      });
    } else {
      return {
        buffer,
        optimized: false,
        originalSize: buffer.length,
        savedSize: buffer.length,
        format: format || "unknown"
      };
    }
    const optimizedBuffer = await optimizedImage.toBuffer();
    const isSmaller = optimizedBuffer.length < buffer.length;
    return {
      buffer: isSmaller ? optimizedBuffer : buffer,
      optimized: isSmaller,
      originalSize: buffer.length,
      savedSize: isSmaller ? optimizedBuffer.length : buffer.length,
      format
    };
  } catch (error) {
    console.error("Image optimization skipped:", error);
    return {
      buffer,
      optimized: false,
      originalSize: buffer.length,
      savedSize: buffer.length,
      format: "unknown"
    };
  }
}
async function saveUploadedImage(buffer, originalName, timestamp) {
  const imageDirs = await getImageDirs();
  const imageFilename = generateImageFilename(originalName);
  const optimization = await optimizeImageBuffer(buffer);
  for (const imageDir of imageDirs) {
    await fs.mkdir(imageDir, {
      recursive: true
    });
    await fs.writeFile(path.join(imageDir, imageFilename), optimization.buffer);
  }
  const imageUrl = `/blog-images/${imageFilename}`;
  const savedKb = Math.round(optimization.savedSize / 1024);
  const originalKb = Math.round(optimization.originalSize / 1024);
  console.error(`[${timestamp}] Image saved: ${imageUrl} (${savedKb}KB, was ${originalKb}KB, optimized: ${optimization.optimized})`);
  return {
    imageUrl,
    imageOptimization: {
      optimized: optimization.optimized,
      originalSize: optimization.originalSize,
      savedSize: optimization.savedSize,
      format: optimization.format
    }
  };
}
async function POST({
  request
}) {
  try {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] API route called`);
    // Write debug to file
    await fs.writeFile(path.join(process.cwd(), "debug.log"), `[${timestamp}] API called\n`, {
      flag: "a"
    });
    const contentType = request.headers.get("content-type") || "";
    let filename,
      title,
      content,
      tags = ["blog", "astro"],
      imageUrl = "",
      imageOptimization = null;
    if (contentType.includes("multipart/form-data")) {
      // Handle multipart/form-data (file upload)
      const formData = await request.formData();
      filename = formData.get("filename");
      title = formData.get("title");
      content = formData.get("content");
      if (formData.has("tags")) {
        tags = normalizeTags(formData.get("tags"));
      }
      const imageFile = formData.get("image");

      // Process uploaded image if present
      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const savedImage = await saveUploadedImage(buffer, imageFile.name, timestamp);
        imageUrl = savedImage.imageUrl;
        imageOptimization = savedImage.imageOptimization;
      }
    } else {
      // Handle JSON (including base64-encoded image)
      const rawBody = await request.text();
      console.error(`[${timestamp}] Raw request body length:`, rawBody.length);
      if (rawBody.length > 0) {
        console.error(`[${timestamp}] Raw request body (first 200 chars):`, rawBody.substring(0, 200));
      }
      let data;
      try {
        data = JSON.parse(rawBody);
      } catch (parseError) {
        console.error(`[${timestamp}] JSON parse error:`, parseError);
        await fs.writeFile(path.join(process.cwd(), "debug.log"), `[${timestamp}] JSON parse error: ${parseError.message}\n`, {
          flag: "a"
        });
        return addCorsHeaders(new Response(JSON.stringify({
          error: "Invalid JSON",
          details: parseError.message
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }));
      }
      filename = data.filename;
      title = data.title;
      content = data.content;
      if (Object.prototype.hasOwnProperty.call(data, "tags")) {
        tags = normalizeTags(data.tags);
      }
      imageUrl = data.image || "";

      // Handle base64-encoded image upload
      if (data.imageBase64 && data.imageFilename) {
        try {
          // data.imageBase64 is a data URL: "data:<mime>;base64,<data>"
          const matches = data.imageBase64.match(/^data:([^;]+);base64,(.+)$/);
          if (matches) {
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, "base64");
            const savedImage = await saveUploadedImage(buffer, data.imageFilename, timestamp);
            imageUrl = savedImage.imageUrl;
            imageOptimization = savedImage.imageOptimization;
          } else {
            console.error(`[${timestamp}] Invalid base64 image data format`);
          }
        } catch (imgError) {
          console.error(`[${timestamp}] Error saving base64 image:`, imgError);
          // Continue without image rather than failing the whole request
        }
      }
    }
    console.error(`[${timestamp}] Parsed data:`, {
      filename,
      title,
      tags,
      imageUrl,
      imageOptimization,
      contentLength: content?.length
    });

    // Validate inputs
    if (!filename || !filename.endsWith(".md")) {
      return addCorsHeaders(new Response(JSON.stringify({
        error: "Filename must end with .md"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      }));
    }
    if (!title || !content) {
      return addCorsHeaders(new Response(JSON.stringify({
        error: "Title and content are required"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      }));
    }

    // Strip any existing frontmatter from content
    const strippedContent = stripFrontmatter(content);

    // Determine the blog directory path (store posts in content, not pages)
    const blogDir = path.join(process.cwd(), "src", "content", "blog");

    // Ensure the directory exists
    await fs.mkdir(blogDir, {
      recursive: true
    });
    const filePath = path.join(blogDir, filename);
    let pubDate = new Date().toISOString().split("T")[0];
    try {
      const existingContent = await fs.readFile(filePath, "utf8");
      pubDate = getFrontmatterValue(existingContent, "pubDate") || pubDate;
    } catch {
      // New post: use today's date.
    }

    // Create frontmatter
    let frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
pubDate: ${pubDate}
description: "A blog post about ${title}"
author: "Blog Author"
tags: [${tags.map(tag => JSON.stringify(tag)).join(", ")}]`;
    if (imageUrl && imageUrl.trim() !== "") {
      frontmatter += `\nimage: "${imageUrl.replace(/"/g, '\\"')}"`;
    }
    frontmatter += `\n---\n\n`;
    const fullContent = frontmatter + strippedContent;

    // Write the file
    await fs.writeFile(filePath, fullContent, "utf8");
    return addCorsHeaders(new Response(JSON.stringify({
      success: true,
      message: `Post saved as ${filename}`,
      path: filePath,
      imageUrl,
      imageOptimization
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }));
  } catch (error) {
    console.error("Error saving post:", error);
    return addCorsHeaders(new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    }));
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
