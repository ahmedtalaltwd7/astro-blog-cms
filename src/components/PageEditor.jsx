import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { marked } from "marked";
import MarkdownImageCanvas from "./MarkdownImageCanvas.jsx";

marked.setOptions({
  breaks: true,
  gfm: true,
});

const DEFAULT_CONTENT = `# New Page

Write your standalone page content here.
`;

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

function makeFilename(value) {
  const slug = String(value || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${slug || "new-page"}.md`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

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

function createGalleryImage(file, imageBase64) {
  const cleanName = String(file?.name || "Gallery image")
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();

  return {
    id: `page-gallery-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: cleanName || "Gallery image",
    alt: cleanName || "Gallery image",
    caption: "",
    imageUrl: "",
    imageBase64,
    imageFilename: file?.name || "image",
    imagePreviewUrl: URL.createObjectURL(file),
  };
}

function textInputClass() {
  return "mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";
}

function Field({ label, children }) {
  return (
    <label class="block">
      <span class="block text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function GalleryImageCard({ image, index, total, onUpdate, onReplace, onRemove, onMove }) {
  const preview = image.imagePreviewUrl || image.imageUrl || "";

  return (
    <article class="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div class="grid gap-4 lg:grid-cols-[170px_minmax(0,1fr)]">
        <div class="aspect-[4/3] overflow-hidden rounded-md bg-slate-100">
          {preview ? (
            <img src={preview} alt={image.alt || ""} class="h-full w-full object-cover" />
          ) : (
            <div class="flex h-full items-center justify-center text-sm text-slate-500">
              No image
            </div>
          )}
        </div>

        <div class="grid gap-4">
          <div class="grid gap-4 md:grid-cols-2">
            <Field label="Image title">
              <input
                class={textInputClass()}
                value={image.title || ""}
                onInput={(event) => onUpdate(index, "title", event.currentTarget.value)}
              />
            </Field>
            <Field label="Alt text">
              <input
                class={textInputClass()}
                value={image.alt || ""}
                onInput={(event) => onUpdate(index, "alt", event.currentTarget.value)}
              />
            </Field>
          </div>

          <Field label="Caption">
            <textarea
              rows={2}
              class={textInputClass()}
              value={image.caption || ""}
              onInput={(event) => onUpdate(index, "caption", event.currentTarget.value)}
            />
          </Field>

          <Field label="Replace image">
            <input
              type="file"
              accept="image/*"
              class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              onChange={(event) => onReplace(index, event.currentTarget.files?.[0])}
            />
          </Field>

          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => onMove(index, -1)}
              class="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Move up
            </button>
            <button
              type="button"
              disabled={index === total - 1}
              onClick={() => onMove(index, 1)}
              class="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Move down
            </button>
            <button
              type="button"
              onClick={() => onRemove(index)}
              class="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function PageEditor() {
  const [pages, setPages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("New Page");
  const [description, setDescription] = useState("");
  const [filename, setFilename] = useState("new-page.md");
  const [pageType, setPageType] = useState("normal");
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [galleryImages, setGalleryImages] = useState([]);
  const [previewMode, setPreviewMode] = useState("split");
  const [selectedSnippet, setSelectedSnippet] = useState(snippets[0].label);
  const [cursorInfo, setCursorInfo] = useState({ line: 1, column: 1 });
  const [isUploadingContentImage, setIsUploadingContentImage] = useState(false);
  const [selectedCanvasImage, setSelectedCanvasImage] = useState(null);
  const textareaRef = useRef(null);
  const contentImageInputRef = useRef(null);
  const pendingImageSelectionRef = useRef(null);
  const latestContentRef = useRef(content);

  const previewHtml = useMemo(() => marked.parse(content || ""), [content]);
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

  async function fetchPages() {
    setLoadingPages(true);
    try {
      const response = await fetch("/api/list-pages");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load pages.");
      setPages(data.pages || []);
    } catch (error) {
      setMessage(`Load error: ${error.message}`);
    } finally {
      setLoadingPages(false);
    }
  }

  useEffect(() => {
    fetchPages();
  }, []);

  function clearForm() {
    setIsEditing(false);
    setTitle("New Page");
    setDescription("");
    setFilename("new-page.md");
    setPageType("normal");
    setContent(DEFAULT_CONTENT);
    setGalleryImages([]);
    setPreviewMode("split");
    setSelectedSnippet(snippets[0].label);
    setCursorInfo({ line: 1, column: 1 });
    setSelectedCanvasImage(null);
    setMessage("");
  }

  async function editPage(page) {
    setMessage(`Loading ${page.filename}...`);
    try {
      const response = await fetch(`/api/get-page?filename=${encodeURIComponent(page.filename)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load page.");

      setIsEditing(true);
      setFilename(data.filename);
      setTitle(data.frontmatter.title || page.title);
      setDescription(data.frontmatter.description || "");
      setPageType(data.frontmatter.pageType || "normal");
      setContent(data.body || "");
      setGalleryImages(data.frontmatter.galleryImages || []);
      setPreviewMode("split");
      setMessage(`Loaded ${data.filename}.`);
    } catch (error) {
      setMessage(`Load error: ${error.message}`);
    }
  }

  async function addGalleryImages(files) {
    const selectedFiles = Array.from(files || []).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (selectedFiles.length === 0) return;

    const nextImages = await Promise.all(
      selectedFiles.map(async (file) => createGalleryImage(file, await fileToDataUrl(file))),
    );
    setGalleryImages((current) => [...current, ...nextImages].slice(0, 200));
    setMessage(`Added ${nextImages.length} image${nextImages.length === 1 ? "" : "s"}. Save the page to publish.`);
  }

  async function replaceGalleryImage(index, file) {
    if (!file) return;

    const imageBase64 = await fileToDataUrl(file);
    const cleanName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
    setGalleryImages((current) => {
      const images = [...current];
      images[index] = {
        ...images[index],
        imageBase64,
        imageFilename: file.name,
        imagePreviewUrl: URL.createObjectURL(file),
        title: images[index].title || cleanName,
        alt: images[index].alt || cleanName,
      };
      return images;
    });
  }

  function updateGalleryImage(index, field, value) {
    setGalleryImages((current) => {
      const images = [...current];
      images[index] = { ...images[index], [field]: value };
      return images;
    });
  }

  function removeGalleryImage(index) {
    setGalleryImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
  }

  function moveGalleryImage(index, direction) {
    setGalleryImages((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;

      const images = [...current];
      const [image] = images.splice(index, 1);
      images.splice(nextIndex, 0, image);
      return images;
    });
  }

  function updateCursorInfo() {
    const ta = textareaRef.current;
    if (!ta) return;

    const beforeCursor = ta.value.slice(0, ta.selectionStart);
    const lines = beforeCursor.split("\n");
    setCursorInfo({
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
    });
  }

  function focusTextarea(selectionStart, selectionEnd = selectionStart) {
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      ta.focus();
      if (typeof selectionStart === "number") {
        ta.setSelectionRange(selectionStart, selectionEnd);
        updateCursorInfo();
      }
    });
  }

  function replaceSelection(text, selectionOffset = text.length, selectionLength = 0) {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const nextContent = content.slice(0, start) + text + content.slice(end);
    const nextSelectionStart = start + selectionOffset;

    setContent(nextContent);
    focusTextarea(nextSelectionStart, nextSelectionStart + selectionLength);
  }

  function replaceSavedSelection(text) {
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
  }

  function applyWrap(before, after = before, placeholder = "") {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const nextContent =
      content.slice(0, start) + before + selected + after + content.slice(end);
    const selectionStart = start + before.length;

    setContent(nextContent);
    focusTextarea(selectionStart, selectionStart + selected.length);
  }

  function getSelectedLineRange() {
    const ta = textareaRef.current;
    if (!ta) return null;

    const lineStart = content.lastIndexOf("\n", ta.selectionStart - 1) + 1;
    const nextLineBreak = content.indexOf("\n", ta.selectionEnd);
    const lineEnd = nextLineBreak === -1 ? content.length : nextLineBreak;
    return { lineStart, lineEnd };
  }

  function prefixSelectedLines(prefix) {
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
  }

  function setSelectedLinesAsOrderedList() {
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
  }

  function setHeading(level) {
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
  }

  function insertAtCursor(text) {
    replaceSelection(text);
  }

  function insertLink() {
    const ta = textareaRef.current;
    const selected = ta ? content.slice(ta.selectionStart, ta.selectionEnd) : "";
    const label = selected || "link text";
    const url = prompt("Link URL", "https://");
    if (url === null) return;
    replaceSelection(`[${label}](${url})`, 1, label.length);
  }

  function insertImageMarkdown() {
    const alt = prompt("Image alt text", "Alt text");
    if (alt === null) return;
    const url = prompt("Image URL", "/page-images/");
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
  }

  function updateCanvasImageLine(nextImage) {
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
  }

  function openContentImagePicker() {
    const ta = textareaRef.current;
    if (ta) {
      pendingImageSelectionRef.current = {
        start: ta.selectionStart,
        end: ta.selectionEnd,
      };
    }
    contentImageInputRef.current?.click();
  }

  async function handleContentImageUpload(event) {
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
      const imageBase64 = await fileToDataUrl(file);
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
      setMessage(`Image uploaded and inserted (${savedKb}KB, was ${originalKb}KB).`);
    } catch (error) {
      pendingImageSelectionRef.current = null;
      setMessage(`Image upload error: ${error.message}`);
    } finally {
      setIsUploadingContentImage(false);
    }
  }

  function insertSnippet() {
    const snippet = snippets.find((item) => item.label === selectedSnippet);
    if (!snippet) return;
    const prefix = content.trim() ? "\n\n" : "";
    insertAtCursor(`${prefix}${snippet.value}`);
  }

  function handleKeyDown(event) {
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
  }

  async function savePage() {
    if (!filename.endsWith(".md")) {
      setMessage("Filename must end with .md.");
      return;
    }

    if (!confirm(`Save standalone page "${filename}"?`)) return;

    setSaving(true);
    setMessage("Saving page...");
    try {
      const response = await fetch("/api/save-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename,
          title,
          description,
          pageType,
          content,
          galleryImages,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save page.");

      setMessage(`Saved ${data.filename}. Open /pages/${data.slug} to view it.`);
      setIsEditing(true);
      setGalleryImages(data.galleryImages || []);
      await fetchPages();
    } catch (error) {
      setMessage(`Save error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function deletePage(page) {
    if (!confirm(`Delete standalone page "${page.filename}"? This cannot be undone.`)) return;

    try {
      const response = await fetch("/api/delete-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: page.filename }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete page.");

      const deletedAssetCount = data.deletedAssets?.length || 0;
      setMessage(
        deletedAssetCount > 0
          ? `Deleted ${page.filename} and ${deletedAssetCount} related image file${deletedAssetCount === 1 ? "" : "s"}.`
          : `Deleted ${page.filename}.`,
      );
      if (filename === page.filename) clearForm();
      await fetchPages();
    } catch (error) {
      setMessage(`Delete error: ${error.message}`);
    }
  }

  return (
    <div class="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium uppercase tracking-wide text-blue-600">
              Admin
            </p>
            <h1 class="mt-1 text-3xl font-bold text-gray-900">Page Control</h1>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Create standalone markdown pages outside the blog posts folder.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={clearForm}
              class="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              New Page
            </button>
            <button
              type="button"
              onClick={savePage}
              disabled={saving}
              class="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : isEditing ? "Update Page" : "Save Page"}
            </button>
          </div>
        </div>

        {message && (
          <div class="mb-6 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {message}
          </div>
        )}

        <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main class="grid gap-6">
            <section class="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
              <div class="grid gap-5 md:grid-cols-2">
                <Field label="Page title">
                  <input
                    class={textInputClass()}
                    value={title}
                    onInput={(event) => {
                      const nextTitle = event.currentTarget.value;
                      setTitle(nextTitle);
                      if (!isEditing) setFilename(makeFilename(nextTitle));
                    }}
                  />
                </Field>
                <Field label="Markdown filename">
                  <input
                    class={textInputClass()}
                    value={filename}
                    onInput={(event) => setFilename(event.currentTarget.value)}
                  />
                </Field>
                <Field label="Page type">
                  <select
                    class={textInputClass()}
                    value={pageType}
                    onInput={(event) => setPageType(event.currentTarget.value)}
                  >
                    <option value="normal">Normal markdown page</option>
                    <option value="gallery">Image gallery page</option>
                  </select>
                </Field>
                <Field label="Description">
                  <input
                    class={textInputClass()}
                    value={description}
                    onInput={(event) => setDescription(event.currentTarget.value)}
                  />
                </Field>
              </div>
            </section>

            <section class="rounded-lg border border-gray-200 bg-gray-50">
              <div class="border-b border-gray-200 bg-white p-3">
                <div class="mb-3 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <label for="page-content" class="block text-sm font-semibold text-gray-800">
                    Markdown Content
                  </label>
                  <div class="flex flex-wrap items-center gap-3">
                    <a
                      href={`/pages/${filename.replace(/\.md$/i, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      class="text-sm font-semibold text-blue-700 hover:text-blue-800"
                    >
                      Open Page
                    </a>
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
                    onClick={() => applyWrap("\n```javascript\n", "\n```\n", "code here")}
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
                    onInput={(event) => setSelectedSnippet(event.currentTarget.value)}
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
                      id="page-content"
                      name="page-content"
                      rows={22}
                      class="h-full min-h-[520px] w-full resize-y border-0 bg-white px-4 py-3 font-mono text-sm leading-6 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                      placeholder="Write your page in markdown here..."
                      value={content}
                      onInput={(event) => {
                        setContent(event.currentTarget.value);
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
                      dangerouslySetInnerHTML={{ __html: previewParts.beforeHtml }}
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
                        dangerouslySetInnerHTML={{ __html: previewParts.afterHtml }}
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

            {pageType === "gallery" && (
              <section class="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 class="text-xl font-bold text-slate-950">Gallery Images</h2>
                    <p class="mt-1 text-sm text-slate-600">
                      {galleryImages.length} images for this page
                    </p>
                  </div>
                  <label class="inline-flex w-full cursor-pointer items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 md:w-auto">
                    Add Images
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      class="sr-only"
                      onChange={(event) => {
                        addGalleryImages(event.currentTarget.files);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>

                <div class="mt-6 grid gap-4">
                  {galleryImages.length > 0 ? (
                    galleryImages.map((image, index) => (
                      <GalleryImageCard
                        key={image.id || index}
                        image={image}
                        index={index}
                        total={galleryImages.length}
                        onUpdate={updateGalleryImage}
                        onReplace={replaceGalleryImage}
                        onRemove={removeGalleryImage}
                        onMove={moveGalleryImage}
                      />
                    ))
                  ) : (
                    <div class="rounded-md border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600">
                      No gallery images yet.
                    </div>
                  )}
                </div>
              </section>
            )}
          </main>

          <aside class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <div class="mb-4 flex items-center justify-between gap-3">
              <h2 class="text-lg font-bold text-slate-950">Standalone Pages</h2>
              <button
                type="button"
                onClick={fetchPages}
                class="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>

            {loadingPages ? (
              <p class="py-8 text-center text-sm text-slate-500">Loading pages...</p>
            ) : pages.length === 0 ? (
              <div class="rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
                No standalone pages yet.
              </div>
            ) : (
              <div class="max-h-[760px] space-y-3 overflow-y-auto pr-1">
                {pages.map((page) => (
                  <div class="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <h3 class="truncate text-sm font-semibold text-slate-950">
                          {page.title}
                        </h3>
                        <p class="mt-1 truncate text-xs text-slate-500">{page.filename}</p>
                        <p class="mt-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
                          {page.pageType === "gallery" ? "Gallery page" : "Normal page"}
                        </p>
                        {page.pageType === "gallery" && (
                          <p class="mt-1 text-xs text-slate-500">
                            {page.galleryImageCount} images
                          </p>
                        )}
                      </div>
                    </div>
                    <div class="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
                      <button type="button" onClick={() => editPage(page)} class="text-blue-700 hover:text-blue-800">
                        Edit
                      </button>
                      <a href={`/pages/${page.slug}`} target="_blank" rel="noreferrer" class="text-slate-700 hover:text-slate-900">
                        Open
                      </a>
                      <button type="button" onClick={() => deletePage(page)} class="text-red-700 hover:text-red-800">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
