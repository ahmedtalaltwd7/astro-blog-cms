import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

export const prerender = false;

const IMAGE_DIR_NAME = "markdown-images";
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

function addCorsHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

function generateImageFilename(originalName, format) {
  const ext = format
    ? `.${format === "jpeg" ? "jpg" : format}`
    : path.extname(originalName).toLowerCase();
  const base = path
    .basename(originalName, path.extname(originalName))
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "image";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${base}-${timestamp}-${random}${ext}`;
}

async function getImageDirs() {
  const cwd = process.cwd();
  const routeDir = path.dirname(fileURLToPath(import.meta.url));
  const roots = [cwd, await findProjectRoot(cwd), await findProjectRoot(routeDir)]
    .filter(Boolean)
    .map((root) => path.normalize(root));
  const candidates = [];

  for (const root of [...new Set(roots)]) {
    candidates.push(path.join(root, "public", IMAGE_DIR_NAME));
    candidates.push(path.join(root, "dist", "client", IMAGE_DIR_NAME));
  }

  candidates.push(path.resolve(routeDir, "..", "..", "..", "client", IMAGE_DIR_NAME));
  const dirs = [];

  for (const candidate of candidates) {
    const normalized = path.normalize(candidate);
    if (!dirs.includes(normalized)) {
      dirs.push(normalized);
    }
  }

  return dirs;
}

async function findProjectRoot(startDir) {
  let currentDir = path.resolve(startDir);

  while (true) {
    try {
      await fs.access(path.join(currentDir, "package.json"));
      return currentDir;
    } catch {
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) return null;
      currentDir = parentDir;
    }
  }
}

async function optimizeImageBuffer(buffer) {
  const image = sharp(buffer, { failOn: "none" }).rotate();
  const metadata = await image.metadata();
  const format = metadata.format;

  if (format === "jpeg" || format === "jpg") {
    const optimizedBuffer = await image
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    return {
      buffer: optimizedBuffer.length < buffer.length ? optimizedBuffer : buffer,
      format: "jpeg",
      optimized: optimizedBuffer.length < buffer.length,
      originalSize: buffer.length,
      savedSize: Math.min(optimizedBuffer.length, buffer.length),
    };
  }

  if (format === "png") {
    const optimizedBuffer = await image
      .png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 })
      .toBuffer();
    return {
      buffer: optimizedBuffer.length < buffer.length ? optimizedBuffer : buffer,
      format,
      optimized: optimizedBuffer.length < buffer.length,
      originalSize: buffer.length,
      savedSize: Math.min(optimizedBuffer.length, buffer.length),
    };
  }

  if (format === "webp") {
    const optimizedBuffer = await image
      .webp({ quality: 82, effort: 5 })
      .toBuffer();
    return {
      buffer: optimizedBuffer.length < buffer.length ? optimizedBuffer : buffer,
      format,
      optimized: optimizedBuffer.length < buffer.length,
      originalSize: buffer.length,
      savedSize: Math.min(optimizedBuffer.length, buffer.length),
    };
  }

  return {
    buffer,
    format: format || "unknown",
    optimized: false,
    originalSize: buffer.length,
    savedSize: buffer.length,
  };
}

export async function OPTIONS() {
  return addCorsHeaders(
    new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }),
  );
}

export async function POST({ request }) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let imageName = "";
    let imageType = "";
    let altText = "";
    let buffer = null;
    let imageSize = 0;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const imageFile = formData.get("image");
      altText = formData.get("alt") || "";

      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        imageName = imageFile.name;
        imageType = imageFile.type;
        imageSize = imageFile.size;
        buffer = Buffer.from(await imageFile.arrayBuffer());
      }
    } else {
      const data = await request.json();
      altText = data.alt || "";
      imageName = data.imageFilename || "image";

      const matches = String(data.imageBase64 || "").match(
        /^data:([^;]+);base64,(.+)$/,
      );
      if (matches) {
        imageType = matches[1];
        buffer = Buffer.from(matches[2], "base64");
        imageSize = buffer.length;
      }
    }

    if (!buffer || imageSize === 0) {
      return addCorsHeaders(
        new Response(JSON.stringify({ error: "Image file is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }

    if (!imageType.startsWith("image/")) {
      return addCorsHeaders(
        new Response(JSON.stringify({ error: "Uploaded file must be an image" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }

    if (imageSize > MAX_UPLOAD_BYTES) {
      return addCorsHeaders(
        new Response(JSON.stringify({ error: "Image must be 12MB or smaller" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }

    const optimized = await optimizeImageBuffer(buffer);
    const imageFilename = generateImageFilename(imageName, optimized.format);
    const imageDirs = await getImageDirs();

    for (const imageDir of imageDirs) {
      await fs.mkdir(imageDir, { recursive: true });
      await fs.writeFile(path.join(imageDir, imageFilename), optimized.buffer);
    }

    const imageUrl = `/${IMAGE_DIR_NAME}/${imageFilename}`;

    return addCorsHeaders(
      new Response(
        JSON.stringify({
          success: true,
          imageUrl,
          markdown: `![${String(altText).replace(/]/g, "\\]")}](${imageUrl})`,
          imageOptimization: {
            optimized: optimized.optimized,
            originalSize: optimized.originalSize,
            savedSize: optimized.savedSize,
            format: optimized.format,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );
  } catch (error) {
    console.error("Error uploading editor image:", error);
    return addCorsHeaders(
      new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }
}
