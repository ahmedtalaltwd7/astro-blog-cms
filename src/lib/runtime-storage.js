import fs from "fs/promises";
import path from "path";
import { del, head, list, put } from "@vercel/blob";

export function isReadonlyRuntime() {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

export function hasBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function requireWritableStorage(action = "save changes") {
  if (isReadonlyRuntime() && !hasBlobStorage()) {
    throw new Error(
      `Cannot ${action} on Vercel without Blob storage. Create a Vercel Blob store for this project so BLOB_READ_WRITE_TOKEN is available.`,
    );
  }
}

export async function readJsonBlob(pathname) {
  if (!hasBlobStorage()) return null;

  try {
    const blob = await head(pathname);
    const response = await fetch(blob.downloadUrl || blob.url);
    if (!response.ok) return null;
    return JSON.parse(await response.text());
  } catch {
    return null;
  }
}

export async function writeJsonBlob(pathname, value) {
  requireWritableStorage("save settings");

  await put(pathname, `${JSON.stringify(value, null, 2)}\n`, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });

  return value;
}

export async function readTextBlob(pathname) {
  if (!hasBlobStorage()) return null;

  try {
    const blob = await head(pathname);
    const response = await fetch(blob.downloadUrl || blob.url);
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

export async function writeTextBlob(pathname, value, contentType = "text/plain") {
  requireWritableStorage("save content");

  await put(pathname, value, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType,
    cacheControlMaxAge: 60,
  });

  return value;
}

export async function listBlobEntries(prefix) {
  if (!hasBlobStorage()) return [];

  const entries = [];
  let cursor;

  do {
    const result = await list({ prefix, cursor });
    entries.push(...result.blobs);
    cursor = result.cursor;
  } while (cursor);

  return entries;
}

export async function deleteBlobEntry(pathname) {
  requireWritableStorage("delete content");
  await del(pathname);
}

export async function saveAsset({
  directory,
  filename,
  buffer,
  localDirs,
  contentType = "application/octet-stream",
  inlineMime = contentType,
}) {
  if (hasBlobStorage()) {
    const blob = await put(`${directory}/${filename}`, buffer, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType,
    });

    return {
      url: blob.url,
      storage: "vercel-blob",
    };
  }

  if (isReadonlyRuntime()) {
    return {
      url: `data:${inlineMime};base64,${buffer.toString("base64")}`,
      storage: "inline",
    };
  }

  for (const localDir of localDirs) {
    await fs.mkdir(localDir, { recursive: true });
    await fs.writeFile(path.join(localDir, filename), buffer);
  }

  return {
    url: `/${directory}/${filename}`,
    storage: "filesystem",
  };
}

export async function saveWebpAsset({ directory, filename, buffer, localDirs }) {
  return saveAsset({
    directory,
    filename,
    buffer,
    localDirs,
    contentType: "image/webp",
    inlineMime: "image/webp",
  });
}
