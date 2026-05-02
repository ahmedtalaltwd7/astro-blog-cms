/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_RHxhWfPN.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DyeyJaqy.mjs';
import { useRef, useState, useEffect, useMemo } from 'preact/hooks';
import { marked } from 'marked';
import { jsxs, jsx } from 'preact/jsx-runtime';
import { $ as $$AdminControlNav } from '../chunks/AdminControlNav_DaIsGLpQ.mjs';
export { renderers } from '../renderers.mjs';

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 360;
const normalizeRotation$1 = (degrees) => {
  const number = Number(degrees);
  if (!Number.isFinite(number)) return 0;
  return (Math.round(number) % 360 + 360) % 360;
};
const parseWidth = (width, fallbackWidth) => {
  if (!width) return fallbackWidth;
  if (String(width).endsWith("%")) {
    return Math.round(CANVAS_WIDTH * Number.parseInt(width, 10) / 100);
  }
  return Number.parseInt(width, 10) || fallbackWidth;
};
const loadImageElement = (url) => new Promise((resolve, reject) => {
  const image = new Image();
  if (!url.startsWith("/")) {
    image.crossOrigin = "anonymous";
  }
  image.onload = () => resolve(image);
  image.onerror = reject;
  image.src = url;
});
function MarkdownImageCanvas({
  selection,
  onChange
}) {
  const canvasElementRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const fabricImageRef = useRef(null);
  const fabricRef = useRef(null);
  const selectionRef = useRef(selection);
  const onChangeRef = useRef(onChange);
  const [canvasReady, setCanvasReady] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const image = selection?.image;
  useEffect(() => {
    selectionRef.current = selection;
  }, [selection]);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    let disposed = false;
    import('fabric').then(({
      Canvas,
      FabricImage
    }) => {
      if (disposed || !canvasElementRef.current) return;
      const canvas = new Canvas(canvasElementRef.current, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        backgroundColor: "#f9fafb",
        preserveObjectStacking: true
      });
      fabricRef.current = {
        FabricImage
      };
      fabricCanvasRef.current = canvas;
      canvas.on("object:scaling", ({
        target
      }) => {
        if (!target) return;
        target.set("scaleY", target.scaleX);
        canvas.requestRenderAll();
      });
      canvas.on("object:modified", ({
        target
      }) => {
        const selected = selectionRef.current;
        if (!target || !selected?.image?.url) return;
        onChangeRef.current?.({
          ...selected.image,
          width: String(Math.max(1, Math.round(target.getScaledWidth()))),
          rotation: normalizeRotation$1(target.angle),
          offsetX: Math.max(0, Math.round(target.left || 0)),
          offsetY: Math.max(0, Math.round(target.top || 0))
        });
      });
      setCanvasReady(true);
    });
    return () => {
      disposed = true;
      fabricCanvasRef.current?.dispose();
      fabricCanvasRef.current = null;
      fabricImageRef.current = null;
    };
  }, []);
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    const FabricImage = fabricRef.current?.FabricImage;
    const image2 = selection?.image;
    if (!canvas || !FabricImage) return;
    canvas.clear();
    canvas.backgroundColor = "#f9fafb";
    fabricImageRef.current = null;
    setImageLoaded(false);
    setLoadError("");
    if (!image2?.url) {
      canvas.requestRenderAll();
      return;
    }
    let cancelled = false;
    loadImageElement(image2.url).then((imageElement) => {
      if (cancelled) return;
      const fabricImage = new FabricImage(imageElement);
      const naturalWidth = fabricImage.width || 320;
      const naturalHeight = fabricImage.height || 180;
      const fallbackWidth = Math.min(naturalWidth, Math.round(CANVAS_WIDTH * 0.72));
      const displayWidth = Math.min(parseWidth(image2.width, fallbackWidth), CANVAS_WIDTH);
      const scale = displayWidth / naturalWidth;
      const displayHeight = naturalHeight * scale;
      const left = Number(image2.offsetX) > 0 ? Number(image2.offsetX) : Math.max(16, Math.round((CANVAS_WIDTH - displayWidth) / 2));
      const top = Number(image2.offsetY) > 0 ? Number(image2.offsetY) : Math.max(16, Math.round((CANVAS_HEIGHT - displayHeight) / 2));
      fabricImage.set({
        left,
        top,
        angle: normalizeRotation$1(image2.rotation),
        scaleX: scale,
        scaleY: scale,
        borderColor: "#2563eb",
        cornerColor: "#2563eb",
        cornerSize: 10,
        cornerStyle: "circle",
        lockScalingFlip: true,
        lockUniScaling: true,
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
        transparentCorners: false
      });
      fabricImage.setControlsVisibility({
        mt: false,
        mb: false,
        ml: false,
        mr: false
      });
      canvas.add(fabricImage);
      canvas.setActiveObject(fabricImage);
      canvas.requestRenderAll();
      fabricImageRef.current = fabricImage;
      setImageLoaded(true);
    }).catch(() => {
      if (!cancelled) {
        setLoadError("Image could not be loaded into the canvas.");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selection?.image?.url, selection?.image?.width, selection?.image?.rotation, selection?.image?.offsetX, selection?.image?.offsetY, canvasReady]);
  return jsxs("div", {
    class: "my-6",
    children: [jsx("div", {
      class: loadError ? "hidden" : "overflow-auto rounded-lg border border-gray-200 bg-gray-50",
      children: jsx("canvas", {
        ref: canvasElementRef
      })
    }), image?.url && loadError && jsx("img", {
      src: image.url,
      alt: image.alt || "",
      class: "h-auto max-w-full rounded-lg border border-gray-200"
    }), loadError && jsx("p", {
      class: "mt-2 text-sm text-red-600",
      children: loadError
    })]
  });
}

marked.setOptions({
  breaks: true,
  gfm: true
});
const INITIAL_CONTENT = `# My Amazing Blog Post

Start writing your blog post here using **markdown** syntax.

## Features of this editor:

- Easy to write
- Supports code blocks
- Rendered beautifully by Astro

\`\`\`javascript
console.log("Hello, world!");
\`\`\`

Enjoy writing!`;
const toolbarButtonClass = "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1";
const modeButtonClass = "px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1";
const snippets = [{
  label: "Article outline",
  value: `## Introduction

Write a short opening that tells readers what they will learn.

## Main idea

Expand the topic with examples, context, and useful details.

## Takeaway

Close with a clear next step or memorable conclusion.
`
}, {
  label: "Comparison table",
  value: `| Option | Best for | Notes |
| --- | --- | --- |
| Option A | Quick starts | Add details here |
| Option B | Advanced use | Add details here |
`
}, {
  label: "Checklist",
  value: `- [ ] First task
- [ ] Second task
- [ ] Third task
`
}, {
  label: "Callout",
  value: `> **Note:** Add an important reminder or helpful context here.
`
}, {
  label: "FAQ",
  value: `## FAQ

### Question one?

Answer the question clearly.

### Question two?

Answer the question clearly.
`
}, {
  label: "HTML details",
  value: `<details>
<summary>Read more</summary>

Hidden markdown-friendly details go here.

</details>
`
}];
const makeDefaultFilename = (value) => value.toLowerCase().trim().replace(/['"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
const escapeHtmlAttribute = (value) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeMarkdownAlt = (value) => String(value).replace(/]/g, "\\]");
const normalizeImageWidth = (value) => {
  const width = value.trim().toLowerCase();
  if (!width) return "";
  if (/^\d{1,4}$/.test(width)) return width;
  if (/^\d{1,4}px$/.test(width)) return width.replace("px", "");
  if (/^\d{1,3}%$/.test(width)) return width;
  return null;
};
const normalizeRotation = (degrees) => {
  const number = Number(degrees);
  if (!Number.isFinite(number)) return 0;
  return (Math.round(number) % 360 + 360) % 360;
};
const normalizeSearchText = (value) => String(value).normalize("NFKD").replace(/[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed]/g, "").replace(/\u0640/g, "").replace(/[إأآٱا]/g, "ا").replace(/[ؤ]/g, "و").replace(/[ئ]/g, "ي").replace(/[ىی]/g, "ي").replace(/[ة]/g, "ه").replace(/[ک]/g, "ك").toLowerCase();
const normalizeHashtags = (value) => {
  const input = Array.isArray(value) ? value.join(",") : String(value || "");
  const seen = /* @__PURE__ */ new Set();
  return input.split(/[,\n]/).map((tag) => tag.trim().replace(/^#+/, "").trim()).filter(Boolean).filter((tag) => {
    const key = tag.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
const formatTagsInput = (value) => {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  const text = String(value || "").trim();
  if (text.startsWith("[") && text.endsWith("]")) {
    return normalizeHashtags(text.slice(1, -1).replace(/["']/g, "")).join(", ");
  }
  return normalizeHashtags(text).join(", ");
};
const getImageStyleValue = (style, property) => {
  const match = style.match(new RegExp(`${property}\\s*:\\s*([^;]+)`, "i"));
  return match ? match[1].trim() : "";
};
const parseImageMarkup = (markup) => {
  const text = markup.trim();
  const markdownMatch = text.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (markdownMatch) {
    return {
      url: markdownMatch[2],
      alt: markdownMatch[1].replace(/\\]/g, "]"),
      width: "",
      rotation: 0,
      offsetX: 0,
      offsetY: 0
    };
  }
  if (!/^<img\b[^>]*>$/i.test(text)) {
    return null;
  }
  const style = text.match(/\sstyle=["']([^"']*)["']/i)?.[1] || "";
  const width = text.match(/\swidth=["']([^"']+)["']/i)?.[1] || getImageStyleValue(style, "width");
  const rotationMatch = style.match(/rotate\(\s*(-?\d+(?:\.\d+)?)deg\s*\)/i);
  const offsetX = Number.parseInt(getImageStyleValue(style, "margin-left"), 10);
  const offsetY = Number.parseInt(getImageStyleValue(style, "margin-top"), 10);
  return {
    url: text.match(/\ssrc=["']([^"']+)["']/i)?.[1] || "",
    alt: text.match(/\salt=["']([^"']*)["']/i)?.[1] || "",
    width: normalizeImageWidth(width || "") ?? "",
    rotation: normalizeRotation(rotationMatch?.[1] || 0),
    offsetX: Number.isFinite(offsetX) ? offsetX : 0,
    offsetY: Number.isFinite(offsetY) ? offsetY : 0
  };
};
const findFirstImageInContent = (value) => {
  let lineStart = 0;
  const lines = value.split("\n");
  for (const line of lines) {
    const lineEnd = lineStart + line.length;
    const trimmedLine = line.trim();
    const image = parseImageMarkup(trimmedLine);
    if (image?.url) {
      const leadingWhitespace = line.indexOf(trimmedLine);
      return {
        range: {
          lineStart: lineStart + Math.max(leadingWhitespace, 0),
          lineEnd: lineStart + Math.max(leadingWhitespace, 0) + trimmedLine.length
        },
        image
      };
    }
    const inlineMarkdownMatch = line.match(/!\[[^\]]*\]\([^)]+\)/);
    if (inlineMarkdownMatch) {
      return {
        range: {
          lineStart: lineStart + inlineMarkdownMatch.index,
          lineEnd: lineStart + inlineMarkdownMatch.index + inlineMarkdownMatch[0].length
        },
        image: parseImageMarkup(inlineMarkdownMatch[0])
      };
    }
    const inlineHtmlMatch = line.match(/<img\b[^>]*>/i);
    if (inlineHtmlMatch) {
      return {
        range: {
          lineStart: lineStart + inlineHtmlMatch.index,
          lineEnd: lineStart + inlineHtmlMatch.index + inlineHtmlMatch[0].length
        },
        image: parseImageMarkup(inlineHtmlMatch[0])
      };
    }
    lineStart = lineEnd + 1;
  }
  return null;
};
const createBlockInsertion = (value, start, end, text) => {
  const before = value.slice(0, start);
  const after = value.slice(end);
  const prefix = before.trim() ? before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n" : "";
  const suffix = after.trim() ? after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n" : "";
  return {
    insertion: `${prefix}${text}${suffix}`,
    contentStart: start + prefix.length
  };
};
const buildImageMarkup = (url, alt, displayWidth = "", rotation = 0, offsetX = 0, offsetY = 0) => {
  const normalizedRotation = normalizeRotation(rotation);
  const normalizedOffsetX = Math.max(0, Math.round(Number(offsetX) || 0));
  const normalizedOffsetY = Math.max(0, Math.round(Number(offsetY) || 0));
  if (!displayWidth && normalizedRotation === 0 && normalizedOffsetX === 0 && normalizedOffsetY === 0) {
    return `![${escapeMarkdownAlt(alt)}](${url})`;
  }
  const src = escapeHtmlAttribute(url);
  const safeAlt = escapeHtmlAttribute(alt);
  const styleParts = ["display: block", "height: auto", "max-width: 100%"];
  if (displayWidth.endsWith("%")) {
    styleParts.unshift(`width: ${displayWidth}`);
  }
  if (normalizedRotation !== 0) {
    styleParts.push(`transform: rotate(${normalizedRotation}deg)`);
    styleParts.push("transform-origin: center center");
  }
  if (normalizedOffsetX > 0) {
    styleParts.push(`margin-left: ${normalizedOffsetX}px`);
  }
  if (normalizedOffsetY > 0) {
    styleParts.push(`margin-top: ${normalizedOffsetY}px`);
  }
  const widthAttribute = displayWidth && !displayWidth.endsWith("%") ? ` width="${displayWidth}"` : "";
  return `<img src="${src}" alt="${safeAlt}"${widthAttribute} style="${styleParts.join("; ")};" />`;
};
function BlogEditor() {
  const [filename, setFilename] = useState("new-post.md");
  const [title, setTitle] = useState("My Amazing Blog Post");
  const [tagsInput, setTagsInput] = useState("blog, astro");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [filenameExists, setFilenameExists] = useState(false);
  const [filenameMessage, setFilenameMessage] = useState("");
  const [existingPosts, setExistingPosts] = useState([]);
  const [existingPostSearch, setExistingPostSearch] = useState("");
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalFilename, setOriginalFilename] = useState("");
  const [previewMode, setPreviewMode] = useState("split");
  const [selectedSnippet, setSelectedSnippet] = useState(snippets[0].label);
  const [cursorInfo, setCursorInfo] = useState({
    line: 1,
    column: 1
  });
  const [isUploadingContentImage, setIsUploadingContentImage] = useState(false);
  const [selectedCanvasImage, setSelectedCanvasImage] = useState(null);
  const textareaRef = useRef(null);
  const contentImageInputRef = useRef(null);
  const pendingImageSelectionRef = useRef(null);
  const latestContentRef = useRef(content);
  const editorStats = useMemo(() => {
    const plainText = content.replace(/```[\s\S]*?```/g, " ").replace(/`[^`]*`/g, " ").replace(/[#>*_[\]()-]/g, " ");
    const words = plainText.trim().split(/\s+/).filter(Boolean).length;
    const characters = content.length;
    const lines = content.split("\n").length;
    const readingMinutes = Math.max(1, Math.ceil(words / 225));
    return {
      words,
      characters,
      lines,
      readingMinutes
    };
  }, [content]);
  const filteredExistingPosts = useMemo(() => {
    const query = normalizeSearchText(existingPostSearch.trim());
    if (!query) return existingPosts;
    return existingPosts.filter((post) => [post.filename, post.title, post.description, post.pubDate, ...post.tags || []].filter(Boolean).some((value) => normalizeSearchText(value).includes(query)));
  }, [existingPostSearch, existingPosts]);
  const previewHtml = useMemo(() => marked.parse(content || ""), [content]);
  const previewParts = useMemo(() => {
    if (!selectedCanvasImage?.image?.url) {
      return {
        hasEditableImage: false,
        beforeHtml: previewHtml,
        afterHtml: ""
      };
    }
    const before = content.slice(0, selectedCanvasImage.range.lineStart);
    const after = content.slice(selectedCanvasImage.range.lineEnd);
    return {
      hasEditableImage: true,
      beforeHtml: marked.parse(before || ""),
      afterHtml: marked.parse(after || "")
    };
  }, [content, previewHtml, selectedCanvasImage]);
  useEffect(() => {
    latestContentRef.current = content;
  }, [content]);
  useEffect(() => {
    if (!content) {
      setSelectedCanvasImage(null);
      return;
    }
    if (selectedCanvasImage) {
      const currentLine = content.slice(selectedCanvasImage.range.lineStart, selectedCanvasImage.range.lineEnd).trim();
      const currentImage = parseImageMarkup(currentLine);
      if (currentImage?.url === selectedCanvasImage.image.url) {
        setSelectedCanvasImage({
          range: selectedCanvasImage.range,
          image: currentImage
        });
        return;
      }
    }
    setSelectedCanvasImage(findFirstImageInContent(content));
  }, [content]);
  const checkFilenameExists = async (filenameToCheck) => {
    if (!filenameToCheck.endsWith(".md")) {
      setFilenameExists(false);
      setFilenameMessage("");
      return;
    }
    const slug = filenameToCheck.replace(".md", "");
    try {
      const response = await fetch(`/blog/${slug}`, {
        method: "HEAD"
      });
      if (response.ok) {
        setFilenameExists(true);
        setFilenameMessage(`A blog post with filename "${filenameToCheck}" already exists. Saving will overwrite it.`);
      } else {
        setFilenameExists(false);
        setFilenameMessage("");
      }
    } catch (error) {
      setFilenameExists(false);
      setFilenameMessage("");
    }
  };
  useEffect(() => {
    if (!filename) {
      setFilenameExists(false);
      setFilenameMessage("");
      return;
    }
    const timer = setTimeout(() => {
      checkFilenameExists(filename);
    }, 500);
    return () => clearTimeout(timer);
  }, [filename]);
  useEffect(() => {
    fetchExistingPosts();
  }, []);
  const fetchExistingPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await fetch("/api/list-posts?limit=1000");
      if (response.ok) {
        const data = await response.json();
        setExistingPosts(data.posts || []);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };
  const handleEditPost = async (post) => {
    setFilename(post.filename);
    setTitle(post.title);
    setContent("Loading...");
    setIsEditing(true);
    setOriginalFilename(post.filename);
    setMessage(`Loading "${post.filename}"...`);
    try {
      const response = await fetch(`/api/get-post?filename=${encodeURIComponent(post.filename)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.status}`);
      }
      const data = await response.json();
      const {
        frontmatter,
        body
      } = data;
      setTitle(frontmatter.title || post.title);
      setTagsInput(formatTagsInput(frontmatter.tags || post.tags || []));
      setImage(frontmatter.image || "");
      setContent(body.trim());
      setImageFile(null);
      setImagePreview("");
      setPreviewMode("split");
      setMessage(`Loaded "${post.filename}". You can now edit the content.`);
    } catch (error) {
      console.error("Error loading post:", error);
      setContent(`---
title: "${post.title}"
pubDate: ${post.pubDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]}
description: "${post.description}"
author: "${post.author}"
tags: [${post.tags.map((t) => `"${t}"`).join(", ")}]
---

[Failed to load full content. Please edit manually.]`);
      setMessage(`Could not load full content for "${post.filename}". You may need to edit manually.`);
    }
  };
  const handleDeletePost = async (postFilename) => {
    if (!confirm(`Are you sure you want to delete "${postFilename}"? This cannot be undone.`)) {
      return;
    }
    try {
      const response = await fetch("/api/delete-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          filename: postFilename
        })
      });
      const result = await response.json();
      if (response.ok) {
        setMessage(`Post "${postFilename}" deleted successfully.`);
        fetchExistingPosts();
      } else {
        setMessage(`Error deleting post: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Network error: ${error.message}`);
    }
  };
  const handleRefreshPosts = () => {
    fetchExistingPosts();
    setMessage("Refreshing post list...");
  };
  const handleSave = async () => {
    if (!filename.endsWith(".md")) {
      setMessage("Filename must end with .md");
      return;
    }
    setIsSaving(true);
    setMessage("Saving...");
    const contentToSave = latestContentRef.current;
    try {
      console.log("Saving post:", {
        filename,
        title,
        tags: normalizeHashtags(tagsInput),
        content: contentToSave.substring(0, 50) + "...",
        imageFile: imageFile ? imageFile.name : "none"
      });
      let imageBase64 = "";
      let imageFilename = "";
      if (imageFile) {
        imageBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
        imageFilename = imageFile.name;
      }
      const response = await fetch("/api/save-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          filename,
          title,
          tags: normalizeHashtags(tagsInput),
          content: contentToSave,
          image,
          imageBase64,
          imageFilename
        })
      });
      console.log("Response status:", response.status);
      let result;
      const responseText = await response.text();
      try {
        result = JSON.parse(responseText);
      } catch {
        console.error("Non-JSON response:", responseText.substring(0, 200));
        setMessage(`Server error: ${responseText.substring(0, 100)}`);
        return;
      }
      console.log("Response result:", result);
      if (response.ok) {
        setMessage(`Post saved successfully as ${filename}`);
        setFilename("");
        setTitle("");
        setTagsInput("");
        setContent("");
        setImage("");
        setImageFile(null);
        setImagePreview("");
        setIsEditing(false);
        setOriginalFilename("");
        fetchExistingPosts();
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Network error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };
  const handleClear = () => {
    setFilename("");
    setTitle("");
    setTagsInput("");
    setContent("");
    setMessage("");
    setImage("");
    setImageFile(null);
    setImagePreview("");
    setIsEditing(false);
    setOriginalFilename("");
  };
  const updateCursorInfo = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const beforeCursor = content.slice(0, ta.selectionStart);
    const lines = beforeCursor.split("\n");
    setCursorInfo({
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    });
    const range = getSelectedLineRange();
    if (!range) {
      setSelectedCanvasImage(findFirstImageInContent(content));
      return;
    }
    const selectedText = content.slice(range.lineStart, range.lineEnd).trim();
    const image2 = parseImageMarkup(selectedText);
    setSelectedCanvasImage(image2?.url ? {
      range,
      image: image2
    } : findFirstImageInContent(content));
  };
  const focusTextarea = (start, end = start) => {
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(start, end);
      updateCursorInfo();
    });
  };
  const replaceSelection = (text, selectStartOffset = text.length, selectLength = 0) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newText = content.slice(0, start) + text + content.slice(end);
    setContent(newText);
    focusTextarea(start + selectStartOffset, start + selectStartOffset + selectLength);
  };
  const replaceSavedSelection = (text) => {
    const range = pendingImageSelectionRef.current;
    pendingImageSelectionRef.current = null;
    if (!range) {
      replaceSelection(text);
      return;
    }
    const currentContent = latestContentRef.current;
    const start = Math.min(range.start, currentContent.length);
    const end = Math.min(range.end, currentContent.length);
    const {
      insertion,
      contentStart
    } = createBlockInsertion(currentContent, start, end, text);
    setContent(currentContent.slice(0, start) + insertion + currentContent.slice(end));
    const image2 = parseImageMarkup(text);
    setSelectedCanvasImage(image2?.url ? {
      range: {
        lineStart: contentStart,
        lineEnd: contentStart + text.length
      },
      image: image2
    } : null);
    focusTextarea(contentStart + text.length);
  };
  const applyWrap = (before, after = before, placeholder = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const newText = content.slice(0, start) + before + selected + after + content.slice(end);
    setContent(newText);
    const selectionStart = start + before.length;
    const selectionEnd = selectionStart + selected.length;
    focusTextarea(selectionStart, selectionEnd);
  };
  const getSelectedLineRange = () => {
    const ta = textareaRef.current;
    if (!ta) return null;
    const lineStart = content.lastIndexOf("\n", ta.selectionStart - 1) + 1;
    const nextLineBreak = content.indexOf("\n", ta.selectionEnd);
    const lineEnd = nextLineBreak === -1 ? content.length : nextLineBreak;
    return {
      lineStart,
      lineEnd
    };
  };
  const prefixSelectedLines = (prefix) => {
    const range = getSelectedLineRange();
    if (!range) return;
    const selectedLines = content.slice(range.lineStart, range.lineEnd);
    const replacement = selectedLines.split("\n").map((line) => `${prefix}${line}`).join("\n");
    setContent(content.slice(0, range.lineStart) + replacement + content.slice(range.lineEnd));
    focusTextarea(range.lineStart, range.lineStart + replacement.length);
  };
  const setSelectedLinesAsOrderedList = () => {
    const range = getSelectedLineRange();
    if (!range) return;
    const selectedLines = content.slice(range.lineStart, range.lineEnd);
    const replacement = selectedLines.split("\n").map((line, index) => `${index + 1}. ${line}`).join("\n");
    setContent(content.slice(0, range.lineStart) + replacement + content.slice(range.lineEnd));
    focusTextarea(range.lineStart, range.lineStart + replacement.length);
  };
  const setHeading = (level) => {
    const range = getSelectedLineRange();
    if (!range) return;
    const line = content.slice(range.lineStart, range.lineEnd);
    const cleanLine = line.replace(/^#{1,6}\s+/, "");
    const replacement = `${"#".repeat(level)} ${cleanLine || "Heading"}`;
    setContent(content.slice(0, range.lineStart) + replacement + content.slice(range.lineEnd));
    focusTextarea(range.lineStart + level + 1, range.lineStart + replacement.length);
  };
  const insertAtCursor = (text) => {
    replaceSelection(text);
  };
  const insertLink = () => {
    const ta = textareaRef.current;
    const selected = ta ? content.slice(ta.selectionStart, ta.selectionEnd) : "";
    const label = selected || "link text";
    const url = prompt("Link URL", "https://");
    if (url === null) return;
    replaceSelection(`[${label}](${url})`, 1, label.length);
  };
  const insertImageMarkdown = () => {
    const alt = prompt("Image alt text", "Alt text");
    if (alt === null) return;
    const url = prompt("Image URL", image || "/blog-images/");
    if (url === null) return;
    const ta = textareaRef.current;
    if (!ta) return;
    const imageText = buildImageMarkup(url, alt);
    const {
      insertion,
      contentStart
    } = createBlockInsertion(content, ta.selectionStart, ta.selectionEnd, imageText);
    replaceSelection(insertion);
    setSelectedCanvasImage({
      range: {
        lineStart: contentStart,
        lineEnd: contentStart + imageText.length
      },
      image: parseImageMarkup(imageText)
    });
  };
  const updateCanvasImageLine = (nextImage) => {
    const selection = selectedCanvasImage;
    if (!selection) return;
    const currentContent = latestContentRef.current;
    const replacement = buildImageMarkup(nextImage.url, nextImage.alt, nextImage.width, nextImage.rotation, nextImage.offsetX, nextImage.offsetY);
    const nextRange = {
      lineStart: selection.range.lineStart,
      lineEnd: selection.range.lineStart + replacement.length
    };
    const nextContent = currentContent.slice(0, selection.range.lineStart) + replacement + currentContent.slice(selection.range.lineEnd);
    latestContentRef.current = nextContent;
    setContent(nextContent);
    setSelectedCanvasImage({
      range: nextRange,
      image: nextImage
    });
  };
  const openContentImagePicker = () => {
    const ta = textareaRef.current;
    if (ta) {
      pendingImageSelectionRef.current = {
        start: ta.selectionStart,
        end: ta.selectionEnd
      };
    }
    contentImageInputRef.current?.click();
  };
  const handleContentImageUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const defaultAlt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
    const alt = prompt("Image alt text", defaultAlt);
    if (alt === null) {
      pendingImageSelectionRef.current = null;
      return;
    }
    setIsUploadingContentImage(true);
    setMessage("Uploading image...");
    try {
      const imageBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const response = await fetch("/api/upload-editor-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          imageBase64,
          imageFilename: file.name,
          alt
        })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to upload image");
      }
      replaceSavedSelection(buildImageMarkup(result.imageUrl, alt));
      const savedKb = Math.round(result.imageOptimization.savedSize / 1024);
      const originalKb = Math.round(result.imageOptimization.originalSize / 1024);
      setMessage(`Image uploaded and inserted (${savedKb}KB, was ${originalKb}KB).`);
    } catch (error) {
      pendingImageSelectionRef.current = null;
      setMessage(`Image upload error: ${error.message}`);
    } finally {
      setIsUploadingContentImage(false);
    }
  };
  const insertSnippet = () => {
    const snippet = snippets.find((item) => item.label === selectedSnippet);
    if (!snippet) return;
    const prefix = content.trim() ? "\n\n" : "";
    insertAtCursor(`${prefix}${snippet.value}`);
  };
  const syncFilenameFromTitle = () => {
    const slug = makeDefaultFilename(title);
    if (!slug) return;
    setFilename(`${slug}.md`);
  };
  const handleKeyDown = (event) => {
    const key = event.key.toLowerCase();
    if ((event.ctrlKey || event.metaKey) && key === "b") {
      event.preventDefault();
      applyWrap("**", "**", "bold text");
    }
    if ((event.ctrlKey || event.metaKey) && key === "i") {
      event.preventDefault();
      applyWrap("*", "*", "italic text");
    }
    if ((event.ctrlKey || event.metaKey) && key === "k") {
      event.preventDefault();
      insertLink();
    }
    if (event.altKey && ["1", "2", "3"].includes(event.key)) {
      event.preventDefault();
      setHeading(Number(event.key));
    }
  };
  const messageIsSuccess = message.toLowerCase().includes("success") || message.toLowerCase().includes("loaded") || message.toLowerCase().includes("refreshing");
  return jsx("div", {
    class: "min-h-screen bg-gray-50 py-8",
    children: jsx("div", {
      class: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
      children: jsxs("div", {
        class: "rounded-lg bg-white p-6 shadow",
        children: [jsxs("div", {
          class: "mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
          children: [jsxs("div", {
            children: [jsx("h1", {
              class: "text-3xl font-bold text-gray-900",
              children: "Blog Editor Control Panel"
            }), jsxs("p", {
              class: "mt-2 text-gray-600",
              children: ["Create and edit markdown blog posts saved to", " ", jsx("code", {
                class: "rounded bg-gray-100 px-2 py-1",
                children: "src/content/blog/"
              })]
            })]
          }), isEditing && jsxs("div", {
            class: "rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800",
            children: ["Editing ", originalFilename]
          })]
        }), jsxs("div", {
          class: "grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]",
          children: [jsxs("div", {
            children: [jsx("h2", {
              class: "mb-4 text-xl font-semibold text-gray-800",
              children: isEditing ? "Edit Post" : "Create New Post"
            }), message && jsx("div", {
              class: `mb-4 rounded border p-3 ${messageIsSuccess ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`,
              children: message
            }), jsxs("div", {
              class: "space-y-4",
              children: [jsxs("div", {
                children: [jsx("label", {
                  for: "title",
                  class: "mb-1 block text-sm font-medium text-gray-700",
                  children: "Post Title"
                }), jsxs("div", {
                  class: "flex flex-col gap-2 sm:flex-row",
                  children: [jsx("input", {
                    type: "text",
                    id: "title",
                    name: "title",
                    class: "w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500",
                    placeholder: "My Amazing Blog Post",
                    value: title,
                    onInput: (e) => setTitle(e.target.value)
                  }), jsx("button", {
                    type: "button",
                    onClick: syncFilenameFromTitle,
                    class: "inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    children: "Slug"
                  })]
                })]
              }), jsxs("div", {
                children: [jsx("label", {
                  for: "filename",
                  class: "mb-1 block text-sm font-medium text-gray-700",
                  children: "Filename"
                }), jsx("input", {
                  type: "text",
                  id: "filename",
                  name: "filename",
                  class: "w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500",
                  placeholder: "my-new-post.md",
                  value: filename,
                  onInput: (e) => setFilename(e.target.value)
                }), jsx("p", {
                  class: "mt-1 text-sm text-gray-500",
                  children: "File will be saved in src/content/blog/"
                }), filenameMessage && jsx("div", {
                  class: `mt-2 rounded border p-2 text-sm ${filenameExists ? "border-yellow-200 bg-yellow-50 text-yellow-800" : "border-blue-200 bg-blue-50 text-blue-800"}`,
                  children: filenameMessage
                })]
              }), jsxs("div", {
                children: [jsx("label", {
                  for: "tags",
                  class: "mb-1 block text-sm font-medium text-gray-700",
                  children: "Hashtags"
                }), jsx("input", {
                  type: "text",
                  id: "tags",
                  name: "tags",
                  class: "w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500",
                  placeholder: "#astro, #travel, #news",
                  value: tagsInput,
                  onInput: (e) => setTagsInput(e.currentTarget.value)
                }), jsx("p", {
                  class: "mt-1 text-sm text-gray-500",
                  children: "Separate hashtags with commas. Readers can click each tag to see matching posts."
                }), normalizeHashtags(tagsInput).length > 0 && jsx("div", {
                  class: "mt-2 flex flex-wrap gap-2",
                  children: normalizeHashtags(tagsInput).map((tag) => jsxs("span", {
                    class: "inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800",
                    children: ["#", tag]
                  }, tag))
                })]
              }), jsxs("div", {
                children: [jsx("label", {
                  for: "image",
                  class: "mb-1 block text-sm font-medium text-gray-700",
                  children: "Featured Image (Optional)"
                }), jsx("input", {
                  type: "file",
                  id: "image",
                  name: "image",
                  accept: "image/*",
                  class: "w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 focus:border-blue-500 focus:outline-none focus:ring-blue-500",
                  onChange: handleImageChange
                }), (imagePreview || image) && jsx("div", {
                  class: "mt-3 overflow-hidden rounded-md border border-gray-200 bg-gray-50",
                  children: jsx("img", {
                    src: imagePreview || image,
                    alt: "Featured preview",
                    class: "max-h-56 w-full object-cover"
                  })
                })]
              }), jsxs("section", {
                class: "rounded-lg border border-gray-200 bg-gray-50",
                children: [jsxs("div", {
                  class: "border-b border-gray-200 bg-white p-3",
                  children: [jsxs("div", {
                    class: "mb-3 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between",
                    children: [jsx("label", {
                      for: "content",
                      class: "block text-sm font-semibold text-gray-800",
                      children: "Markdown Content"
                    }), jsx("div", {
                      class: "inline-flex w-fit overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm",
                      children: ["write", "split", "preview"].map((mode) => jsx("button", {
                        type: "button",
                        onClick: () => setPreviewMode(mode),
                        class: `${modeButtonClass} ${previewMode === mode ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`,
                        children: mode === "write" ? "Write" : mode === "split" ? "Split" : "Preview"
                      }, mode))
                    })]
                  }), jsx("input", {
                    ref: contentImageInputRef,
                    type: "file",
                    accept: "image/*",
                    class: "hidden",
                    onChange: handleContentImageUpload
                  }), jsxs("div", {
                    class: "flex flex-wrap gap-2",
                    children: [jsx("button", {
                      type: "button",
                      title: "Bold (Ctrl+B)",
                      onClick: () => applyWrap("**", "**", "bold text"),
                      class: toolbarButtonClass,
                      children: jsx("strong", {
                        children: "B"
                      })
                    }), jsx("button", {
                      type: "button",
                      title: "Italic (Ctrl+I)",
                      onClick: () => applyWrap("*", "*", "italic text"),
                      class: toolbarButtonClass,
                      children: jsx("em", {
                        children: "I"
                      })
                    }), jsx("button", {
                      type: "button",
                      title: "Strikethrough",
                      onClick: () => applyWrap("~~", "~~", "deleted text"),
                      class: toolbarButtonClass,
                      children: "S"
                    }), jsx("button", {
                      type: "button",
                      title: "Inline code",
                      onClick: () => applyWrap("`", "`", "code"),
                      class: toolbarButtonClass,
                      children: "``"
                    }), [1, 2, 3].map((level) => jsxs("button", {
                      type: "button",
                      title: `Heading ${level} (Alt+${level})`,
                      onClick: () => setHeading(level),
                      class: toolbarButtonClass,
                      children: ["H", level]
                    }, level)), jsx("button", {
                      type: "button",
                      title: "Blockquote",
                      onClick: () => prefixSelectedLines("> "),
                      class: toolbarButtonClass,
                      children: ">"
                    }), jsx("button", {
                      type: "button",
                      title: "Bullet list",
                      onClick: () => prefixSelectedLines("- "),
                      class: toolbarButtonClass,
                      children: "UL"
                    }), jsx("button", {
                      type: "button",
                      title: "Numbered list",
                      onClick: setSelectedLinesAsOrderedList,
                      class: toolbarButtonClass,
                      children: "OL"
                    }), jsx("button", {
                      type: "button",
                      title: "Task list",
                      onClick: () => prefixSelectedLines("- [ ] "),
                      class: toolbarButtonClass,
                      children: "To-do"
                    }), jsx("button", {
                      type: "button",
                      title: "Code block",
                      onClick: () => applyWrap("\n```javascript\n", "\n```\n", "code here"),
                      class: toolbarButtonClass,
                      children: "Code"
                    }), jsx("button", {
                      type: "button",
                      title: "Link (Ctrl+K)",
                      onClick: insertLink,
                      class: toolbarButtonClass,
                      children: "Link"
                    }), jsx("button", {
                      type: "button",
                      title: "Image",
                      onClick: insertImageMarkdown,
                      class: toolbarButtonClass,
                      children: "Image"
                    }), jsx("button", {
                      type: "button",
                      title: "Upload image into markdown",
                      onClick: openContentImagePicker,
                      disabled: isUploadingContentImage,
                      class: `${toolbarButtonClass} disabled:cursor-not-allowed disabled:opacity-50`,
                      children: isUploadingContentImage ? "Uploading" : "Upload Image"
                    }), jsx("button", {
                      type: "button",
                      title: "Table",
                      onClick: () => insertAtCursor("\n\n| Column | Column |\n| --- | --- |\n| Value | Value |\n"),
                      class: toolbarButtonClass,
                      children: "Table"
                    }), jsx("button", {
                      type: "button",
                      title: "Horizontal rule",
                      onClick: () => insertAtCursor("\n\n---\n\n"),
                      class: toolbarButtonClass,
                      children: "HR"
                    })]
                  }), jsxs("div", {
                    class: "mt-3 grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_auto]",
                    children: [jsx("select", {
                      value: selectedSnippet,
                      onInput: (e) => setSelectedSnippet(e.target.value),
                      class: "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500",
                      children: snippets.map((snippet) => jsx("option", {
                        value: snippet.label,
                        children: snippet.label
                      }, snippet.label))
                    }), jsx("button", {
                      type: "button",
                      onClick: insertSnippet,
                      class: "inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                      children: "Insert"
                    })]
                  })]
                }), jsxs("div", {
                  class: `grid gap-0 ${previewMode === "split" ? "lg:grid-cols-2" : "grid-cols-1"}`,
                  children: [previewMode !== "preview" && jsx("div", {
                    class: "min-h-[520px] border-gray-200 lg:border-r",
                    children: jsx("textarea", {
                      ref: textareaRef,
                      id: "content",
                      name: "content",
                      rows: "22",
                      class: "h-full min-h-[520px] w-full resize-y border-0 bg-white px-4 py-3 font-mono text-sm leading-6 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500",
                      placeholder: "Write your blog post in markdown here...",
                      value: content,
                      onInput: (e) => {
                        setContent(e.target.value);
                        updateCursorInfo();
                      },
                      onClick: updateCursorInfo,
                      onKeyUp: updateCursorInfo,
                      onKeyDown: handleKeyDown
                    })
                  }), previewMode !== "write" && jsxs("div", {
                    class: "min-h-[520px] bg-white p-4",
                    children: [jsx("div", {
                      class: "max-w-none overflow-auto text-gray-800 [&_a]:text-blue-700 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-blue-200 [&_blockquote]:bg-blue-50 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:h-auto [&_img]:max-w-full [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-4 [&_pre]:mb-4 [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:bg-gray-900 [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-gray-100 [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-gray-200 [&_td]:p-2 [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:p-2 [&_ul]:list-disc",
                      dangerouslySetInnerHTML: {
                        __html: previewParts.beforeHtml
                      }
                    }), previewParts.hasEditableImage && jsx(MarkdownImageCanvas, {
                      selection: selectedCanvasImage,
                      onChange: updateCanvasImageLine
                    }), previewParts.hasEditableImage && jsx("div", {
                      class: "max-w-none overflow-auto text-gray-800 [&_a]:text-blue-700 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-blue-200 [&_blockquote]:bg-blue-50 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:h-auto [&_img]:max-w-full [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-4 [&_pre]:mb-4 [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:bg-gray-900 [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-gray-100 [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-gray-200 [&_td]:p-2 [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:p-2 [&_ul]:list-disc",
                      dangerouslySetInnerHTML: {
                        __html: previewParts.afterHtml
                      }
                    })]
                  })]
                }), jsxs("div", {
                  class: "flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-white px-3 py-2 text-xs text-gray-500",
                  children: [jsxs("div", {
                    class: "flex flex-wrap gap-3",
                    children: [jsxs("span", {
                      children: [editorStats.words, " words"]
                    }), jsxs("span", {
                      children: [editorStats.characters, " characters"]
                    }), jsxs("span", {
                      children: [editorStats.lines, " lines"]
                    }), jsxs("span", {
                      children: [editorStats.readingMinutes, " min read"]
                    })]
                  }), jsxs("span", {
                    children: ["Line ", cursorInfo.line, ", column ", cursorInfo.column]
                  })]
                })]
              }), jsxs("div", {
                class: "flex flex-wrap gap-3",
                children: [jsx("button", {
                  type: "button",
                  onClick: handleSave,
                  disabled: isSaving,
                  class: "inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  children: isSaving ? "Saving..." : "Save Post"
                }), jsx("button", {
                  type: "button",
                  onClick: () => window.open(`/blog/${filename.replace(".md", "")}`, "_blank"),
                  class: "inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  children: "Open Post"
                }), jsx("button", {
                  type: "button",
                  onClick: handleClear,
                  class: "inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  children: "Clear"
                })]
              })]
            })]
          }), jsxs("aside", {
            children: [jsx("h2", {
              class: "mb-4 text-xl font-semibold text-gray-800",
              children: "Existing Blog Posts"
            }), jsxs("div", {
              class: "rounded-lg bg-gray-50 p-4",
              children: [jsxs("div", {
                class: "mb-4 flex items-center justify-between gap-3",
                children: [jsxs("p", {
                  class: "text-gray-600",
                  children: ["Posts in", " ", jsx("code", {
                    class: "rounded bg-gray-100 px-2 py-1",
                    children: "src/content/blog/"
                  })]
                }), jsx("button", {
                  type: "button",
                  onClick: handleRefreshPosts,
                  class: "inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  children: "Refresh"
                })]
              }), jsxs("div", {
                class: "mb-4",
                children: [jsx("label", {
                  for: "existing-post-search",
                  class: "sr-only",
                  children: "Search existing blog posts"
                }), jsxs("div", {
                  class: "relative",
                  children: [jsx("div", {
                    class: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
                    children: jsx("svg", {
                      class: "h-4 w-4 text-gray-400",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      xmlns: "http://www.w3.org/2000/svg",
                      children: jsx("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                      })
                    })
                  }), jsx("input", {
                    id: "existing-post-search",
                    type: "search",
                    value: existingPostSearch,
                    onInput: (event) => setExistingPostSearch(event.currentTarget.value),
                    placeholder: "Search posts...",
                    class: "block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  })]
                })]
              }), loadingPosts ? jsxs("div", {
                class: "py-8 text-center",
                children: [jsx("div", {
                  class: "inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"
                }), jsx("p", {
                  class: "mt-2 text-gray-500",
                  children: "Loading posts..."
                })]
              }) : existingPosts.length === 0 ? jsx("div", {
                class: "rounded-md border-2 border-dashed border-gray-300 p-6 text-center",
                children: jsx("p", {
                  class: "text-sm text-gray-500",
                  children: "No blog posts yet. Create your first post using the editor."
                })
              }) : filteredExistingPosts.length === 0 ? jsx("div", {
                class: "rounded-md border-2 border-dashed border-gray-300 p-6 text-center",
                children: jsxs("p", {
                  class: "text-sm text-gray-500",
                  children: ['No posts match "', existingPostSearch.trim(), '".']
                })
              }) : jsx("div", {
                class: "max-h-[650px] space-y-3 overflow-y-auto pr-2",
                children: filteredExistingPosts.map((post) => jsx("div", {
                  class: "rounded-md border border-gray-200 bg-white p-4 hover:bg-gray-50",
                  children: jsxs("div", {
                    class: "flex items-start justify-between gap-4",
                    children: [jsxs("div", {
                      class: "min-w-0 flex-1",
                      children: [jsx("h3", {
                        class: "truncate font-medium text-gray-900",
                        children: post.filename
                      }), jsx("p", {
                        class: "mt-1 line-clamp-2 text-sm text-gray-500",
                        children: post.title
                      }), jsx("div", {
                        class: "mt-2 flex flex-wrap gap-1",
                        children: post.tags && post.tags.map((tag) => jsx("span", {
                          class: "inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-800",
                          children: tag
                        }, tag))
                      }), jsxs("p", {
                        class: "mt-2 text-xs text-gray-400",
                        children: ["Published: ", post.pubDate || "Unknown"]
                      })]
                    }), jsxs("div", {
                      class: "flex shrink-0 gap-2",
                      children: [jsx("button", {
                        type: "button",
                        onClick: () => handleEditPost(post),
                        class: "text-sm font-medium text-blue-600 hover:text-blue-800",
                        children: "Edit"
                      }), jsx("button", {
                        type: "button",
                        onClick: () => handleDeletePost(post.filename),
                        class: "text-sm font-medium text-red-600 hover:text-red-800",
                        children: "Delete"
                      })]
                    })]
                  })
                }, post.filename))
              }), jsxs("div", {
                class: "mt-6 rounded-lg bg-blue-50 p-4",
                children: [jsx("h3", {
                  class: "font-medium text-blue-800",
                  children: "Editor tools"
                }), jsxs("ul", {
                  class: "mt-2 space-y-1 text-sm text-blue-700",
                  children: [jsx("li", {
                    children: "Ctrl+B, Ctrl+I, Ctrl+K for quick formatting"
                  }), jsx("li", {
                    children: "Alt+1, Alt+2, Alt+3 for headings"
                  }), jsx("li", {
                    children: "Split mode keeps writing and preview side by side"
                  }), jsx("li", {
                    children: "Snippets insert reusable article blocks"
                  })]
                })]
              })]
            })]
          })]
        })]
      })
    })
  });
}

const $$Admin = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Admin Panel - Blog Editor" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AdminControlNav", $$AdminControlNav, { "active": "editor" })} ${renderComponent($$result2, "BlogEditor", BlogEditor, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Ahmed Talal/Desktop/astro-blog/src/components/BlogEditor.jsx", "client:component-export": "default" })} ` })}`;
}, "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/admin.astro", void 0);

const $$file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/admin.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
