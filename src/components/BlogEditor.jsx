import { useMemo, useRef, useState, useEffect } from "preact/hooks";
import { marked } from "marked";
import MarkdownImageCanvas from "./MarkdownImageCanvas.jsx";

marked.setOptions({
  breaks: true,
  gfm: true,
});

const INITIAL_CONTENT = `# My Amazing Blog Post

Start writing your blog post here using **markdown** syntax.

## Features

- Easy to write
- Supports code blocks
- Rendered beautifully by Astro

\`\`\`javascript
console.log("Hello, world!");
\`\`\`

Enjoy writing!`;

const toolbarButtonClass =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1";

const modeButtonClass =
  "px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1";

const snippets = [
  {
    label: "Article outline",
    value: `## Introduction

Write a short opening that tells readers what they will learn.

## Main idea

Expand the topic with examples, context, and useful details.

## Takeaway

Close with a clear next step or memorable conclusion.
`,
  },
  {
    label: "Comparison table",
    value: `| Option | Best for | Notes |
| --- | --- | --- |
| Option A | Quick starts | Add details here |
| Option B | Advanced use | Add details here |
`,
  },
  {
    label: "Checklist",
    value: `- [ ] First task
- [ ] Second task
- [ ] Third task
`,
  },
  {
    label: "Callout",
    value: `> **Note:** Add an important reminder or helpful context here.
`,
  },
  {
    label: "FAQ",
    value: `## FAQ

### Question one?

Answer the question clearly.

### Question two?

Answer the question clearly.
`,
  },
  {
    label: "HTML details",
    value: `<details>
<summary>Read more</summary>

Hidden markdown-friendly details go here.

</details>
`,
  },
];

const makeDefaultFilename = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const escapeHtmlAttribute = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

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
  return ((Math.round(number) % 360) + 360) % 360;
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
      offsetY: 0,
    };
  }

  if (!/^<img\b[^>]*>$/i.test(text)) {
    return null;
  }

  const style = text.match(/\sstyle=["']([^"']*)["']/i)?.[1] || "";
  const width =
    text.match(/\swidth=["']([^"']+)["']/i)?.[1] ||
    getImageStyleValue(style, "width");
  const rotationMatch = style.match(/rotate\(\s*(-?\d+(?:\.\d+)?)deg\s*\)/i);
  const offsetX = Number.parseInt(getImageStyleValue(style, "margin-left"), 10);
  const offsetY = Number.parseInt(getImageStyleValue(style, "margin-top"), 10);

  return {
    url: text.match(/\ssrc=["']([^"']+)["']/i)?.[1] || "",
    alt: text.match(/\salt=["']([^"']*)["']/i)?.[1] || "",
    width: normalizeImageWidth(width || "") ?? "",
    rotation: normalizeRotation(rotationMatch?.[1] || 0),
    offsetX: Number.isFinite(offsetX) ? offsetX : 0,
    offsetY: Number.isFinite(offsetY) ? offsetY : 0,
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
          lineEnd: lineStart + Math.max(leadingWhitespace, 0) + trimmedLine.length,
        },
        image,
      };
    }

    const inlineMarkdownMatch = line.match(/!\[[^\]]*\]\([^)]+\)/);
    if (inlineMarkdownMatch) {
      return {
        range: {
          lineStart: lineStart + inlineMarkdownMatch.index,
          lineEnd: lineStart + inlineMarkdownMatch.index + inlineMarkdownMatch[0].length,
        },
        image: parseImageMarkup(inlineMarkdownMatch[0]),
      };
    }

    const inlineHtmlMatch = line.match(/<img\b[^>]*>/i);
    if (inlineHtmlMatch) {
      return {
        range: {
          lineStart: lineStart + inlineHtmlMatch.index,
          lineEnd: lineStart + inlineHtmlMatch.index + inlineHtmlMatch[0].length,
        },
        image: parseImageMarkup(inlineHtmlMatch[0]),
      };
    }

    lineStart = lineEnd + 1;
  }

  return null;
};

const createBlockInsertion = (value, start, end, text) => {
  const before = value.slice(0, start);
  const after = value.slice(end);
  const prefix = before.trim()
    ? before.endsWith("\n\n")
      ? ""
      : before.endsWith("\n")
        ? "\n"
        : "\n\n"
    : "";
  const suffix = after.trim()
    ? after.startsWith("\n\n")
      ? ""
      : after.startsWith("\n")
        ? "\n"
        : "\n\n"
    : "";

  return {
    insertion: `${prefix}${text}${suffix}`,
    contentStart: start + prefix.length,
  };
};

const buildImageMarkup = (
  url,
  alt,
  displayWidth = "",
  rotation = 0,
  offsetX = 0,
  offsetY = 0,
) => {
  const normalizedRotation = normalizeRotation(rotation);
  const normalizedOffsetX = Math.max(0, Math.round(Number(offsetX) || 0));
  const normalizedOffsetY = Math.max(0, Math.round(Number(offsetY) || 0));

  if (
    !displayWidth &&
    normalizedRotation === 0 &&
    normalizedOffsetX === 0 &&
    normalizedOffsetY === 0
  ) {
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

  const widthAttribute =
    displayWidth && !displayWidth.endsWith("%") ? ` width="${displayWidth}"` : "";
  return `<img src="${src}" alt="${safeAlt}"${widthAttribute} style="${styleParts.join("; ")};" />`;
};

export default function BlogEditor() {
  const [filename, setFilename] = useState("new-post.md");
  const [title, setTitle] = useState("My Amazing Blog Post");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [filenameExists, setFilenameExists] = useState(false);
  const [filenameMessage, setFilenameMessage] = useState("");
  const [existingPosts, setExistingPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalFilename, setOriginalFilename] = useState("");
  const [previewMode, setPreviewMode] = useState("split");
  const [selectedSnippet, setSelectedSnippet] = useState(snippets[0].label);
  const [cursorInfo, setCursorInfo] = useState({ line: 1, column: 1 });
  const [isUploadingContentImage, setIsUploadingContentImage] = useState(false);
  const [selectedCanvasImage, setSelectedCanvasImage] = useState(null);
  const textareaRef = useRef(null);
  const contentImageInputRef = useRef(null);
  const pendingImageSelectionRef = useRef(null);
  const latestContentRef = useRef(content);

  const editorStats = useMemo(() => {
    const plainText = content
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`[^`]*`/g, " ")
      .replace(/[#>*_[\]()-]/g, " ");
    const words = plainText.trim().split(/\s+/).filter(Boolean).length;
    const characters = content.length;
    const lines = content.split("\n").length;
    const readingMinutes = Math.max(1, Math.ceil(words / 225));

    return { words, characters, lines, readingMinutes };
  }, [content]);

  const previewHtml = useMemo(
    () => marked.parse(content || ""),
    [content],
  );

  const previewParts = useMemo(() => {
    if (!selectedCanvasImage?.image?.url) {
      return {
        hasEditableImage: false,
        beforeHtml: previewHtml,
        afterHtml: "",
      };
    }

    const before = content.slice(0, selectedCanvasImage.range.lineStart);
    const after = content.slice(selectedCanvasImage.range.lineEnd);

    return {
      hasEditableImage: true,
      beforeHtml: marked.parse(before || ""),
      afterHtml: marked.parse(after || ""),
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
      const currentLine = content
        .slice(
          selectedCanvasImage.range.lineStart,
          selectedCanvasImage.range.lineEnd,
        )
        .trim();
      const currentImage = parseImageMarkup(currentLine);

      if (currentImage?.url === selectedCanvasImage.image.url) {
        setSelectedCanvasImage({
          range: selectedCanvasImage.range,
          image: currentImage,
        });
        return;
      }
    }

    setSelectedCanvasImage(findFirstImageInContent(content));
  }, [content]);

  // Check if a blog post with the given filename already exists
  const checkFilenameExists = async (filenameToCheck) => {
    if (!filenameToCheck.endsWith(".md")) {
      setFilenameExists(false);
      setFilenameMessage("");
      return;
    }
    const slug = filenameToCheck.replace(".md", "");
    try {
      const response = await fetch(`/blog/${slug}`, { method: "HEAD" });
      if (response.ok) {
        setFilenameExists(true);
        setFilenameMessage(
          `A blog post with filename "${filenameToCheck}" already exists. Saving will overwrite it.`,
        );
      } else {
        setFilenameExists(false);
        setFilenameMessage("");
      }
    } catch (error) {
      // Network error or page not found (404) - treat as not existing
      setFilenameExists(false);
      setFilenameMessage("");
    }
  };

  // Debounced effect to check filename existence when filename changes
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

  // Fetch existing posts on component mount
  useEffect(() => {
    fetchExistingPosts();
  }, []);

  const fetchExistingPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await fetch("/api/list-posts");
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
      const response = await fetch(
        `/api/get-post?filename=${encodeURIComponent(post.filename)}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.status}`);
      }
      const data = await response.json();
      const { frontmatter, body } = data;
      setTitle(frontmatter.title || post.title);
      setImage(frontmatter.image || "");
      setContent(body.trim());
      setImageFile(null);
      setImagePreview("");
      setPreviewMode("split");
      setMessage(`Loaded "${post.filename}". You can now edit the content.`);
    } catch (error) {
      console.error("Error loading post:", error);
      setContent(
        `---\ntitle: "${post.title}"\npubDate: ${post.pubDate || new Date().toISOString().split("T")[0]}\ndescription: "${post.description}"\nauthor: "${post.author}"\ntags: [${post.tags.map((t) => `"${t}"`).join(", ")}]\n---\n\n[Failed to load full content. Please edit manually.]`,
      );
      setMessage(
        `Could not load full content for "${post.filename}". You may need to edit manually.`,
      );
    }
  };

  const handleDeletePost = async (postFilename) => {
    if (
      !confirm(
        `Are you sure you want to delete "${postFilename}"? This cannot be undone.`,
      )
    ) {
      return;
    }
    try {
      const response = await fetch("/api/delete-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: postFilename }),
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
        content: contentToSave.substring(0, 50) + "...",
        imageFile: imageFile ? imageFile.name : "none",
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename,
          title,
          content: contentToSave,
          image,
          imageBase64,
          imageFilename,
        }),
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
      column: lines[lines.length - 1].length + 1,
    });

    const range = getSelectedLineRange();
    if (!range) {
      setSelectedCanvasImage(findFirstImageInContent(content));
      return;
    }

    const selectedText = content.slice(range.lineStart, range.lineEnd).trim();
    const image = parseImageMarkup(selectedText);
    setSelectedCanvasImage(
      image?.url ? { range, image } : findFirstImageInContent(content),
    );
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
    focusTextarea(
      start + selectStartOffset,
      start + selectStartOffset + selectLength,
    );
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
    const { insertion, contentStart } = createBlockInsertion(
      currentContent,
      start,
      end,
      text,
    );

    setContent(currentContent.slice(0, start) + insertion + currentContent.slice(end));
    const image = parseImageMarkup(text);
    setSelectedCanvasImage(
      image?.url
        ? {
            range: {
              lineStart: contentStart,
              lineEnd: contentStart + text.length,
            },
            image,
          }
        : null,
    );
    focusTextarea(contentStart + text.length);
  };

  const applyWrap = (before, after = before, placeholder = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const newText =
      content.slice(0, start) + before + selected + after + content.slice(end);

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
    return { lineStart, lineEnd };
  };

  const prefixSelectedLines = (prefix) => {
    const range = getSelectedLineRange();
    if (!range) return;
    const selectedLines = content.slice(range.lineStart, range.lineEnd);
    const replacement = selectedLines
      .split("\n")
      .map((line) => `${prefix}${line}`)
      .join("\n");

    setContent(
      content.slice(0, range.lineStart) +
        replacement +
        content.slice(range.lineEnd),
    );
    focusTextarea(range.lineStart, range.lineStart + replacement.length);
  };

  const setSelectedLinesAsOrderedList = () => {
    const range = getSelectedLineRange();
    if (!range) return;
    const selectedLines = content.slice(range.lineStart, range.lineEnd);
    const replacement = selectedLines
      .split("\n")
      .map((line, index) => `${index + 1}. ${line}`)
      .join("\n");

    setContent(
      content.slice(0, range.lineStart) +
        replacement +
        content.slice(range.lineEnd),
    );
    focusTextarea(range.lineStart, range.lineStart + replacement.length);
  };

  const setHeading = (level) => {
    const range = getSelectedLineRange();
    if (!range) return;
    const line = content.slice(range.lineStart, range.lineEnd);
    const cleanLine = line.replace(/^#{1,6}\s+/, "");
    const replacement = `${"#".repeat(level)} ${cleanLine || "Heading"}`;

    setContent(
      content.slice(0, range.lineStart) +
        replacement +
        content.slice(range.lineEnd),
    );
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
    const { insertion, contentStart } = createBlockInsertion(
      content,
      ta.selectionStart,
      ta.selectionEnd,
      imageText,
    );

    replaceSelection(insertion);
    setSelectedCanvasImage({
      range: {
        lineStart: contentStart,
        lineEnd: contentStart + imageText.length,
      },
      image: parseImageMarkup(imageText),
    });
  };

  const updateCanvasImageLine = (nextImage) => {
    const selection = selectedCanvasImage;
    if (!selection) return;
    const currentContent = latestContentRef.current;

    const replacement = buildImageMarkup(
      nextImage.url,
      nextImage.alt,
      nextImage.width,
      nextImage.rotation,
      nextImage.offsetX,
      nextImage.offsetY,
    );
    const nextRange = {
      lineStart: selection.range.lineStart,
      lineEnd: selection.range.lineStart + replacement.length,
    };
    const nextContent =
      currentContent.slice(0, selection.range.lineStart) +
      replacement +
      currentContent.slice(selection.range.lineEnd);

    latestContentRef.current = nextContent;
    setContent(nextContent);
    setSelectedCanvasImage({ range: nextRange, image: nextImage });
  };

  const openContentImagePicker = () => {
    const ta = textareaRef.current;
    if (ta) {
      pendingImageSelectionRef.current = {
        start: ta.selectionStart,
        end: ta.selectionEnd,
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          imageFilename: file.name,
          alt,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload image");
      }

      replaceSavedSelection(buildImageMarkup(result.imageUrl, alt));
      const savedKb = Math.round(result.imageOptimization.savedSize / 1024);
      const originalKb = Math.round(result.imageOptimization.originalSize / 1024);
      setMessage(
        `Image uploaded and inserted (${savedKb}KB, was ${originalKb}KB).`,
      );
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

  const messageIsSuccess =
    message.toLowerCase().includes("success") ||
    message.toLowerCase().includes("loaded") ||
    message.toLowerCase().includes("refreshing");

  return (
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="rounded-lg bg-white p-6 shadow">
          <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                Blog Editor Control Panel
              </h1>
              <p class="mt-2 text-gray-600">
                Create and edit markdown blog posts saved to{" "}
                <code class="rounded bg-gray-100 px-2 py-1">
                  src/content/blog/
                </code>
              </p>
            </div>
            {isEditing && (
              <div class="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
                Editing {originalFilename}
              </div>
            )}
          </div>

          <div class="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
            <div>
              <h2 class="mb-4 text-xl font-semibold text-gray-800">
                {isEditing ? "Edit Post" : "Create New Post"}
              </h2>

              {message && (
                <div
                  class={`mb-4 rounded border p-3 ${
                    messageIsSuccess
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {message}
                </div>
              )}

              <div class="space-y-4">
                <div>
                  <label
                    for="title"
                    class="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Post Title
                  </label>
                  <div class="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      id="title"
                      name="title"
                      class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      placeholder="My Amazing Blog Post"
                      value={title}
                      onInput={(e) => setTitle(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={syncFilenameFromTitle}
                      class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Slug
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    for="filename"
                    class="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Filename
                  </label>
                  <input
                    type="text"
                    id="filename"
                    name="filename"
                    class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="my-new-post.md"
                    value={filename}
                    onInput={(e) => setFilename(e.target.value)}
                  />
                  <p class="mt-1 text-sm text-gray-500">
                    File will be saved in src/content/blog/
                  </p>
                  {filenameMessage && (
                    <div
                      class={`mt-2 rounded border p-2 text-sm ${
                        filenameExists
                          ? "border-yellow-200 bg-yellow-50 text-yellow-800"
                          : "border-blue-200 bg-blue-50 text-blue-800"
                      }`}
                    >
                      {filenameMessage}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    for="image"
                    class="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Featured Image (Optional)
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    onChange={handleImageChange}
                  />
                  {(imagePreview || image) && (
                    <div class="mt-3 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                      <img
                        src={imagePreview || image}
                        alt="Featured preview"
                        class="max-h-56 w-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <section class="rounded-lg border border-gray-200 bg-gray-50">
                  <div class="border-b border-gray-200 bg-white p-3">
                    <div class="mb-3 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                      <label
                        for="content"
                        class="block text-sm font-semibold text-gray-800"
                      >
                        Markdown Content
                      </label>
                      <div class="inline-flex w-fit overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
                        {["write", "split", "preview"].map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setPreviewMode(mode)}
                            class={`${modeButtonClass} ${
                              previewMode === mode
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {mode === "write"
                              ? "Write"
                              : mode === "split"
                                ? "Split"
                                : "Preview"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      ref={contentImageInputRef}
                      type="file"
                      accept="image/*"
                      class="hidden"
                      onChange={handleContentImageUpload}
                    />

                    <div class="flex flex-wrap gap-2">
                      <button
                        type="button"
                        title="Bold (Ctrl+B)"
                        onClick={() => applyWrap("**", "**", "bold text")}
                        class={toolbarButtonClass}
                      >
                        <strong>B</strong>
                      </button>
                      <button
                        type="button"
                        title="Italic (Ctrl+I)"
                        onClick={() => applyWrap("*", "*", "italic text")}
                        class={toolbarButtonClass}
                      >
                        <em>I</em>
                      </button>
                      <button
                        type="button"
                        title="Strikethrough"
                        onClick={() => applyWrap("~~", "~~", "deleted text")}
                        class={toolbarButtonClass}
                      >
                        S
                      </button>
                      <button
                        type="button"
                        title="Inline code"
                        onClick={() => applyWrap("`", "`", "code")}
                        class={toolbarButtonClass}
                      >
                        ``
                      </button>
                      {[1, 2, 3].map((level) => (
                        <button
                          key={level}
                          type="button"
                          title={`Heading ${level} (Alt+${level})`}
                          onClick={() => setHeading(level)}
                          class={toolbarButtonClass}
                        >
                          H{level}
                        </button>
                      ))}
                      <button
                        type="button"
                        title="Blockquote"
                        onClick={() => prefixSelectedLines("> ")}
                        class={toolbarButtonClass}
                      >
                        &gt;
                      </button>
                      <button
                        type="button"
                        title="Bullet list"
                        onClick={() => prefixSelectedLines("- ")}
                        class={toolbarButtonClass}
                      >
                        UL
                      </button>
                      <button
                        type="button"
                        title="Numbered list"
                        onClick={setSelectedLinesAsOrderedList}
                        class={toolbarButtonClass}
                      >
                        OL
                      </button>
                      <button
                        type="button"
                        title="Task list"
                        onClick={() => prefixSelectedLines("- [ ] ")}
                        class={toolbarButtonClass}
                      >
                        To-do
                      </button>
                      <button
                        type="button"
                        title="Code block"
                        onClick={() =>
                          applyWrap("\n```javascript\n", "\n```\n", "code here")
                        }
                        class={toolbarButtonClass}
                      >
                        Code
                      </button>
                      <button
                        type="button"
                        title="Link (Ctrl+K)"
                        onClick={insertLink}
                        class={toolbarButtonClass}
                      >
                        Link
                      </button>
                      <button
                        type="button"
                        title="Image"
                        onClick={insertImageMarkdown}
                        class={toolbarButtonClass}
                      >
                        Image
                      </button>
                      <button
                        type="button"
                        title="Upload image into markdown"
                        onClick={openContentImagePicker}
                        disabled={isUploadingContentImage}
                        class={`${toolbarButtonClass} disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {isUploadingContentImage ? "Uploading" : "Upload Image"}
                      </button>
                      <button
                        type="button"
                        title="Table"
                        onClick={() =>
                          insertAtCursor(
                            "\n\n| Column | Column |\n| --- | --- |\n| Value | Value |\n",
                          )
                        }
                        class={toolbarButtonClass}
                      >
                        Table
                      </button>
                      <button
                        type="button"
                        title="Horizontal rule"
                        onClick={() => insertAtCursor("\n\n---\n\n")}
                        class={toolbarButtonClass}
                      >
                        HR
                      </button>
                    </div>

                    <div class="mt-3 grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_auto]">
                      <select
                        value={selectedSnippet}
                        onInput={(e) => setSelectedSnippet(e.target.value)}
                        class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      >
                        {snippets.map((snippet) => (
                          <option key={snippet.label} value={snippet.label}>
                            {snippet.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={insertSnippet}
                        class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Insert
                      </button>
                    </div>

                  </div>

                  <div
                    class={`grid gap-0 ${
                      previewMode === "split" ? "lg:grid-cols-2" : "grid-cols-1"
                    }`}
                  >
                    {previewMode !== "preview" && (
                      <div class="min-h-[520px] border-gray-200 lg:border-r">
                        <textarea
                          ref={textareaRef}
                          id="content"
                          name="content"
                          rows="22"
                          class="h-full min-h-[520px] w-full resize-y border-0 bg-white px-4 py-3 font-mono text-sm leading-6 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                          placeholder="Write your blog post in markdown here..."
                          value={content}
                          onInput={(e) => {
                            setContent(e.target.value);
                            updateCursorInfo();
                          }}
                          onClick={updateCursorInfo}
                          onKeyUp={updateCursorInfo}
                          onKeyDown={handleKeyDown}
                        />
                      </div>
                    )}

                    {previewMode !== "write" && (
                      <div class="min-h-[520px] bg-white p-4">
                        <div
                          class="max-w-none overflow-auto text-gray-800 [&_a]:text-blue-700 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-blue-200 [&_blockquote]:bg-blue-50 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:h-auto [&_img]:max-w-full [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-4 [&_pre]:mb-4 [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:bg-gray-900 [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-gray-100 [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-gray-200 [&_td]:p-2 [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:p-2 [&_ul]:list-disc"
                          dangerouslySetInnerHTML={{
                            __html: previewParts.beforeHtml,
                          }}
                        />
                        {previewParts.hasEditableImage && (
                          <MarkdownImageCanvas
                            selection={selectedCanvasImage}
                            onChange={updateCanvasImageLine}
                          />
                        )}
                        {previewParts.hasEditableImage && (
                          <div
                            class="max-w-none overflow-auto text-gray-800 [&_a]:text-blue-700 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-blue-200 [&_blockquote]:bg-blue-50 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:h-auto [&_img]:max-w-full [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-4 [&_pre]:mb-4 [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:bg-gray-900 [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-gray-100 [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-gray-200 [&_td]:p-2 [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:p-2 [&_ul]:list-disc"
                            dangerouslySetInnerHTML={{
                              __html: previewParts.afterHtml,
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  <div class="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-white px-3 py-2 text-xs text-gray-500">
                    <div class="flex flex-wrap gap-3">
                      <span>{editorStats.words} words</span>
                      <span>{editorStats.characters} characters</span>
                      <span>{editorStats.lines} lines</span>
                      <span>{editorStats.readingMinutes} min read</span>
                    </div>
                    <span>
                      Line {cursorInfo.line}, column {cursorInfo.column}
                    </span>
                  </div>
                </section>

                <div class="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Post"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        `/blog/${filename.replace(".md", "")}`,
                        "_blank",
                      )
                    }
                    class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Open Post
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            <aside>
              <h2 class="mb-4 text-xl font-semibold text-gray-800">
                Existing Blog Posts
              </h2>

              <div class="rounded-lg bg-gray-50 p-4">
                <div class="mb-4 flex items-center justify-between gap-3">
                  <p class="text-gray-600">
                    Posts in{" "}
                    <code class="rounded bg-gray-100 px-2 py-1">
                      src/content/blog/
                    </code>
                  </p>
                  <button
                    type="button"
                    onClick={handleRefreshPosts}
                    class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Refresh
                  </button>
                </div>

                {loadingPosts ? (
                  <div class="py-8 text-center">
                    <div class="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    <p class="mt-2 text-gray-500">Loading posts...</p>
                  </div>
                ) : existingPosts.length === 0 ? (
                  <div class="rounded-md border-2 border-dashed border-gray-300 p-6 text-center">
                    <p class="text-sm text-gray-500">
                      No blog posts yet. Create your first post using the
                      editor.
                    </p>
                  </div>
                ) : (
                  <div class="max-h-[650px] space-y-3 overflow-y-auto pr-2">
                    {existingPosts.map((post) => (
                      <div
                        key={post.filename}
                        class="rounded-md border border-gray-200 bg-white p-4 hover:bg-gray-50"
                      >
                        <div class="flex items-start justify-between gap-4">
                          <div class="min-w-0 flex-1">
                            <h3 class="truncate font-medium text-gray-900">
                              {post.filename}
                            </h3>
                            <p class="mt-1 line-clamp-2 text-sm text-gray-500">
                              {post.title}
                            </p>
                            <div class="mt-2 flex flex-wrap gap-1">
                              {post.tags &&
                                post.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    class="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-800"
                                  >
                                    {tag}
                                  </span>
                                ))}
                            </div>
                            <p class="mt-2 text-xs text-gray-400">
                              Published: {post.pubDate || "Unknown"}
                            </p>
                          </div>
                          <div class="flex shrink-0 gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditPost(post)}
                              class="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePost(post.filename)}
                              class="text-sm font-medium text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div class="mt-6 rounded-lg bg-blue-50 p-4">
                  <h3 class="font-medium text-blue-800">Editor tools</h3>
                  <ul class="mt-2 space-y-1 text-sm text-blue-700">
                    <li>Ctrl+B, Ctrl+I, Ctrl+K for quick formatting</li>
                    <li>Alt+1, Alt+2, Alt+3 for headings</li>
                    <li>Split mode keeps writing and preview side by side</li>
                    <li>Snippets insert reusable article blocks</li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
