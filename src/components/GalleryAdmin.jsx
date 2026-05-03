import { useEffect, useState } from "preact/hooks";

const DEFAULT_CONFIG = {
  title: "Gallery",
  description: "A curated set of images from the site.",
  thumbnail: {
    webpUrl: "",
    avifUrl: "",
    imageUrl: "",
    alt: "Gallery thumbnail",
  },
  images: [],
};

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function createImageItem(file, imageBase64) {
  const cleanName = String(file?.name || "Gallery image")
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();

  return {
    id: `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: cleanName || "Gallery image",
    alt: cleanName || "Gallery image",
    caption: "",
    webpUrl: "",
    avifUrl: "",
    imageUrl: "",
    imageBase64,
    imageFilename: file?.name || "image",
    imagePreviewUrl: URL.createObjectURL(file),
  };
}

function getImagePreview(image) {
  return image.imagePreviewUrl || image.webpUrl || image.imageUrl || image.avifUrl || "";
}

function TextField({ label, value, onInput, placeholder = "" }) {
  return (
    <label class="block">
      <span class="block text-sm font-medium text-gray-700">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onInput={onInput}
        class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function TextArea({ label, value, onInput, placeholder = "" }) {
  return (
    <label class="block">
      <span class="block text-sm font-medium text-gray-700">{label}</span>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={3}
        onInput={onInput}
        class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function ImageFormatMeta({ image }) {
  const hasWebp = Boolean(image.webpUrl || image.imageUrl);
  const hasAvif = Boolean(image.avifUrl);

  return (
    <div class="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
      <span
        class={`rounded-md px-2 py-1 ${
          hasWebp ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
        }`}
      >
        WebP
      </span>
      <span
        class={`rounded-md px-2 py-1 ${
          hasAvif ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
        }`}
      >
        AVIF
      </span>
    </div>
  );
}

function GalleryImageCard({
  image,
  index,
  total,
  onUpdate,
  onFileChange,
  onRemove,
  onMove,
}) {
  const preview = getImagePreview(image);

  return (
    <article class="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div class="grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)]">
        <div>
          <div class="aspect-[4/3] overflow-hidden rounded-md bg-slate-100">
            {preview ? (
              <img src={preview} alt={image.alt || ""} class="h-full w-full object-cover" />
            ) : (
              <div class="flex h-full items-center justify-center text-sm text-slate-500">
                No image
              </div>
            )}
          </div>
          <ImageFormatMeta image={image} />
        </div>

        <div class="grid gap-4">
          <div class="grid gap-4 md:grid-cols-2">
            <TextField
              label="Image title"
              value={image.title || ""}
              onInput={(event) => onUpdate(index, "title", event.currentTarget.value)}
            />
            <TextField
              label="Alt text"
              value={image.alt || ""}
              onInput={(event) => onUpdate(index, "alt", event.currentTarget.value)}
            />
          </div>

          <TextArea
            label="Caption"
            value={image.caption || ""}
            onInput={(event) => onUpdate(index, "caption", event.currentTarget.value)}
          />

          <label class="block">
            <span class="block text-sm font-medium text-gray-700">Replace image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => onFileChange(index, event.currentTarget.files?.[0])}
              class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
          </label>

          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onMove(index, -1)}
              disabled={index === 0}
              class="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Move up
            </button>
            <button
              type="button"
              onClick={() => onMove(index, 1)}
              disabled={index === total - 1}
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

export default function GalleryAdmin() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const response = await fetch("/api/gallery-settings");
        const data = await response.json();
        if (mounted && data.config) {
          setConfig({ ...DEFAULT_CONFIG, ...data.config });
        }
      } catch (error) {
        if (mounted) {
          setMessage(`Could not load gallery settings: ${error.message}`);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  const updateConfig = (field, value) => {
    setConfig((current) => ({ ...current, [field]: value }));
  };

  const updateThumbnail = (field, value) => {
    setConfig((current) => ({
      ...current,
      thumbnail: { ...current.thumbnail, [field]: value },
    }));
  };

  const handleThumbnailFile = async (file) => {
    if (!file) return;
    const imageBase64 = await fileToDataUrl(file);
    setConfig((current) => ({
      ...current,
      thumbnail: {
        ...current.thumbnail,
        imageBase64,
        imageFilename: file.name,
        imagePreviewUrl: URL.createObjectURL(file),
        alt: current.thumbnail.alt || current.title,
      },
    }));
  };

  const removeThumbnail = () => {
    if (!confirm("Remove the gallery thumbnail? Save afterward to publish this change.")) {
      return;
    }

    setConfig((current) => ({
      ...current,
      thumbnail: {
        webpUrl: "",
        avifUrl: "",
        imageUrl: "",
        alt: current.thumbnail.alt || "Gallery thumbnail",
      },
    }));
  };

  const addImages = async (files) => {
    const selectedFiles = Array.from(files || []).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (selectedFiles.length === 0) return;

    const nextImages = await Promise.all(
      selectedFiles.map(async (file) => createImageItem(file, await fileToDataUrl(file))),
    );

    setConfig((current) => ({
      ...current,
      images: [...current.images, ...nextImages].slice(0, 48),
    }));
  };

  const updateImage = (index, field, value) => {
    setConfig((current) => {
      const images = [...current.images];
      images[index] = { ...images[index], [field]: value };
      return { ...current, images };
    });
  };

  const updateImageFile = async (index, file) => {
    if (!file) return;
    const imageBase64 = await fileToDataUrl(file);
    setConfig((current) => {
      const images = [...current.images];
      const cleanName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      images[index] = {
        ...images[index],
        imageBase64,
        imageFilename: file.name,
        imagePreviewUrl: URL.createObjectURL(file),
        title: images[index].title || cleanName,
        alt: images[index].alt || cleanName,
      };
      return { ...current, images };
    });
  };

  const removeImage = (index) => {
    const title = config.images[index]?.title || `image ${index + 1}`;
    if (!confirm(`Remove "${title}" from the gallery? Save afterward to publish this change.`)) {
      return;
    }

    setConfig((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const moveImage = (index, direction) => {
    setConfig((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.images.length) return current;

      const images = [...current.images];
      const [image] = images.splice(index, 1);
      images.splice(nextIndex, 0, image);
      return { ...current, images };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!confirm("Save gallery settings and upload pending images as WebP and AVIF?")) {
      return;
    }

    setSaving(true);
    setMessage("Saving gallery images...");

    try {
      const response = await fetch("/api/gallery-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save gallery settings.");
      }

      setConfig({ ...DEFAULT_CONFIG, ...data.config });
      const uploads = data.imageOptimizations?.length || 0;
      setMessage(
        uploads > 0
          ? `Gallery saved. ${uploads} upload${uploads === 1 ? "" : "s"} converted to WebP and AVIF.`
          : "Gallery saved.",
      );
    } catch (error) {
      setMessage(`Save error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div class="min-h-screen bg-gray-50 px-4 py-12">
        <div class="mx-auto max-w-5xl rounded-lg bg-white p-8 text-center shadow">
          Loading gallery settings...
        </div>
      </div>
    );
  }

  const thumbnailPreview =
    config.thumbnail.imagePreviewUrl ||
    config.thumbnail.webpUrl ||
    config.thumbnail.imageUrl ||
    config.thumbnail.avifUrl;

  return (
    <div class="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} class="mx-auto max-w-7xl">
        <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium uppercase tracking-wide text-blue-600">
              Admin
            </p>
            <h1 class="mt-1 text-3xl font-bold text-gray-900">Gallery Control</h1>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Add gallery images, set a thumbnail, and publish optimized WebP plus AVIF files.
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <a
              href="/gallery"
              class="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              View Gallery
            </a>
            <button
              type="submit"
              disabled={saving}
              class="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Gallery"}
            </button>
          </div>
        </div>

        {message && (
          <div class="mb-6 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {message}
          </div>
        )}

        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section class="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
            <h2 class="text-xl font-bold text-slate-950">Gallery Details</h2>
            <div class="mt-5 grid gap-5">
              <TextField
                label="Gallery title"
                value={config.title}
                onInput={(event) => updateConfig("title", event.currentTarget.value)}
              />
              <TextArea
                label="Gallery description"
                value={config.description}
                onInput={(event) => updateConfig("description", event.currentTarget.value)}
              />
            </div>
          </section>

          <aside class="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
            <h2 class="text-xl font-bold text-slate-950">Gallery Thumbnail</h2>
            <div class="mt-5">
              <div class="aspect-[4/3] overflow-hidden rounded-md bg-slate-100">
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt={config.thumbnail.alt || ""}
                    class="h-full w-full object-cover"
                  />
                ) : (
                  <div class="flex h-full items-center justify-center text-sm text-slate-500">
                    No thumbnail
                  </div>
                )}
              </div>
              <ImageFormatMeta image={config.thumbnail} />
            </div>
            <div class="mt-5 grid gap-4">
              <TextField
                label="Thumbnail alt text"
                value={config.thumbnail.alt || ""}
                onInput={(event) => updateThumbnail("alt", event.currentTarget.value)}
              />
              <label class="block">
                <span class="block text-sm font-medium text-gray-700">Upload thumbnail</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleThumbnailFile(event.currentTarget.files?.[0])}
                  class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                />
              </label>
              {thumbnailPreview && (
                <button
                  type="button"
                  onClick={removeThumbnail}
                  class="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  Remove Thumbnail
                </button>
              )}
            </div>
          </aside>
        </div>

        <section class="mt-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 class="text-xl font-bold text-slate-950">Images</h2>
              <p class="mt-1 text-sm text-slate-600">{config.images.length} images</p>
            </div>
            <label class="inline-flex w-full cursor-pointer items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 md:w-auto">
              Add Images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => addImages(event.currentTarget.files)}
                class="sr-only"
              />
            </label>
          </div>

          <div class="mt-6 grid gap-4">
            {config.images.length > 0 ? (
              config.images.map((image, index) => (
                <GalleryImageCard
                  key={image.id || index}
                  image={image}
                  index={index}
                  total={config.images.length}
                  onUpdate={updateImage}
                  onFileChange={updateImageFile}
                  onRemove={removeImage}
                  onMove={moveImage}
                />
              ))
            ) : (
              <div class="rounded-md border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600">
                No gallery images yet.
              </div>
            )}
          </div>
        </section>
      </form>
    </div>
  );
}
