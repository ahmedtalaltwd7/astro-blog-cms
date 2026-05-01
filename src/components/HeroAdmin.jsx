import { useEffect, useMemo, useState } from "preact/hooks";

const DEFAULT_CONFIG = {
  pageTitle: "Home - Astro Blog",
  metaDescription:
    "A fully-featured blog system with a control panel editor, Tailwind CSS styling, and dynamic markdown pages.",
  title: "Create Dynamic Blog Pages with Astro",
  subtitle:
    "A fully-featured blog system with a control panel editor, Tailwind CSS styling, and dynamic markdown pages.",
  primaryButtonText: "Go to Editor",
  primaryButtonHref: "/admin",
  secondaryButtonText: "View Blog",
  secondaryButtonHref: "/blog",
  backgroundType: "gradient",
  backgroundColor: "#2563eb",
  gradientFrom: "#2563eb",
  gradientTo: "#7c3aed",
  textColor: "#ffffff",
  imageUrl: "",
  overlayColor: "#000000",
  overlayOpacity: 35,
};

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function getPreviewStyle(config, imagePreview) {
  const style = {
    color: config.textColor,
  };

  if (config.backgroundType === "solid") {
    style.background = config.backgroundColor;
    return style;
  }

  if (config.backgroundType === "image" && (imagePreview || config.imageUrl)) {
    const rgb = hexToRgb(config.overlayColor);
    const alpha = Number(config.overlayOpacity) / 100;
    style.backgroundImage = `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})), url("${imagePreview || config.imageUrl}")`;
    style.backgroundSize = "cover";
    style.backgroundPosition = "center";
    return style;
  }

  style.background = `linear-gradient(90deg, ${config.gradientFrom}, ${config.gradientTo})`;
  return style;
}

function ColorField({ label, name, value, onChange }) {
  return (
    <label class="block">
      <span class="block text-sm font-medium text-gray-700">{label}</span>
      <div class="mt-2 flex items-center gap-3">
        <input
          type="color"
          name={name}
          value={value}
          onInput={onChange}
          class="h-10 w-12 cursor-pointer rounded border border-gray-300 bg-white p-1"
        />
        <input
          type="text"
          name={name}
          value={value}
          onInput={onChange}
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </label>
  );
}

export default function HeroAdmin() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const previewStyle = useMemo(
    () => getPreviewStyle(config, imagePreview),
    [config, imagePreview],
  );

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const response = await fetch("/api/hero-settings");
        const data = await response.json();
        if (mounted && data.config) {
          setConfig({ ...DEFAULT_CONFIG, ...data.config });
        }
      } catch (error) {
        if (mounted) {
          setMessage(`Could not load hero settings: ${error.message}`);
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

  const updateField = (event) => {
    const { name, value } = event.currentTarget;
    setConfig((current) => ({
      ...current,
      [name]: name === "overlayOpacity" ? Number(value) : value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.currentTarget.files?.[0];
    setImageFile(file || null);
    setImagePreview(file ? URL.createObjectURL(file) : "");
    if (file) {
      setConfig((current) => ({ ...current, backgroundType: "image" }));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setConfig((current) => ({
      ...current,
      imageUrl: "",
      backgroundType: current.backgroundType === "image" ? "gradient" : current.backgroundType,
    }));
  };

  const handleReset = () => {
    setImageFile(null);
    setImagePreview("");
    setConfig(DEFAULT_CONFIG);
    setMessage("Default settings are loaded. Save to apply them.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("Saving hero settings...");

    try {
      let imageBase64 = "";
      let imageFilename = "";

      if (imageFile) {
        imageBase64 = await fileToDataUrl(imageFile);
        imageFilename = imageFile.name;
      }

      const response = await fetch("/api/hero-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...config,
          imageBase64,
          imageFilename,
          removeImage: !config.imageUrl && !imageFile,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save hero settings.");
      }

      setConfig({ ...DEFAULT_CONFIG, ...data.config });
      setImageFile(null);
      setImagePreview("");
      setMessage("Hero section updated successfully.");
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
          Loading hero settings...
        </div>
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-medium uppercase tracking-wide text-blue-600">
              Admin
            </p>
            <h1 class="mt-1 text-3xl font-bold text-gray-900">
              Hero Section Control
            </h1>
          </div>
          <div class="flex flex-wrap gap-3">
            <a
              href="/admin"
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Blog Editor
            </a>
            <a
              href="/admin/home-sections"
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Home Sections
            </a>
            <a
              href="/"
              class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              View Home
            </a>
          </div>
        </div>

        <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <form onSubmit={handleSubmit} class="space-y-6">
            <section class="rounded-lg bg-white p-6 shadow-sm">
              <h2 class="text-lg font-semibold text-gray-900">Page SEO</h2>
              <div class="mt-5 grid gap-5">
                <label class="block">
                  <span class="block text-sm font-medium text-gray-700">
                    Page Title
                  </span>
                  <input
                    type="text"
                    name="pageTitle"
                    value={config.pageTitle}
                    onInput={updateField}
                    class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label class="block">
                  <span class="block text-sm font-medium text-gray-700">
                    Meta Description
                  </span>
                  <textarea
                    name="metaDescription"
                    value={config.metaDescription}
                    onInput={updateField}
                    rows={3}
                    class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>
            </section>

            <section class="rounded-lg bg-white p-6 shadow-sm">
              <h2 class="text-lg font-semibold text-gray-900">Words</h2>
              <div class="mt-5 grid gap-5">
                <label class="block">
                  <span class="block text-sm font-medium text-gray-700">Title</span>
                  <input
                    type="text"
                    name="title"
                    value={config.title}
                    onInput={updateField}
                    class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label class="block">
                  <span class="block text-sm font-medium text-gray-700">
                    Subtitle
                  </span>
                  <textarea
                    name="subtitle"
                    value={config.subtitle}
                    onInput={updateField}
                    rows={4}
                    class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <div class="grid gap-5 sm:grid-cols-2">
                  <label class="block">
                    <span class="block text-sm font-medium text-gray-700">
                      Main Button Text
                    </span>
                    <input
                      type="text"
                      name="primaryButtonText"
                      value={config.primaryButtonText}
                      onInput={updateField}
                      class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                  <label class="block">
                    <span class="block text-sm font-medium text-gray-700">
                      Main Button Link
                    </span>
                    <input
                      type="text"
                      name="primaryButtonHref"
                      value={config.primaryButtonHref}
                      onInput={updateField}
                      class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                  <label class="block">
                    <span class="block text-sm font-medium text-gray-700">
                      Second Button Text
                    </span>
                    <input
                      type="text"
                      name="secondaryButtonText"
                      value={config.secondaryButtonText}
                      onInput={updateField}
                      class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                  <label class="block">
                    <span class="block text-sm font-medium text-gray-700">
                      Second Button Link
                    </span>
                    <input
                      type="text"
                      name="secondaryButtonHref"
                      value={config.secondaryButtonHref}
                      onInput={updateField}
                      class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                </div>
              </div>
            </section>

            <section class="rounded-lg bg-white p-6 shadow-sm">
              <h2 class="text-lg font-semibold text-gray-900">Background</h2>
              <div class="mt-5 grid gap-5">
                <div class="grid gap-3 sm:grid-cols-3">
                  {["gradient", "solid", "image"].map((mode) => (
                    <label
                      key={mode}
                      class={`cursor-pointer rounded-md border px-4 py-3 text-sm font-medium capitalize ${
                        config.backgroundType === mode
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="backgroundType"
                        value={mode}
                        checked={config.backgroundType === mode}
                        onInput={updateField}
                        class="sr-only"
                      />
                      {mode}
                    </label>
                  ))}
                </div>

                <div class="grid gap-5 sm:grid-cols-2">
                  <ColorField
                    label="Text Color"
                    name="textColor"
                    value={config.textColor}
                    onChange={updateField}
                  />
                  {config.backgroundType === "solid" && (
                    <ColorField
                      label="Background Color"
                      name="backgroundColor"
                      value={config.backgroundColor}
                      onChange={updateField}
                    />
                  )}
                  {config.backgroundType === "gradient" && (
                    <>
                      <ColorField
                        label="Gradient Start"
                        name="gradientFrom"
                        value={config.gradientFrom}
                        onChange={updateField}
                      />
                      <ColorField
                        label="Gradient End"
                        name="gradientTo"
                        value={config.gradientTo}
                        onChange={updateField}
                      />
                    </>
                  )}
                </div>

                {config.backgroundType === "image" && (
                  <div class="grid gap-5">
                    <label class="block">
                      <span class="block text-sm font-medium text-gray-700">
                        Upload Hero Image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        class="mt-2 block w-full cursor-pointer rounded-md border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
                      />
                    </label>
                    {config.imageUrl && !imagePreview && (
                      <p class="text-sm text-gray-600">Current image: {config.imageUrl}</p>
                    )}
                    <div class="grid gap-5 sm:grid-cols-2">
                      <ColorField
                        label="Image Overlay Color"
                        name="overlayColor"
                        value={config.overlayColor}
                        onChange={updateField}
                      />
                      <label class="block">
                        <span class="block text-sm font-medium text-gray-700">
                          Overlay Opacity
                        </span>
                        <input
                          type="range"
                          name="overlayOpacity"
                          min="0"
                          max="90"
                          value={config.overlayOpacity}
                          onInput={updateField}
                          class="mt-4 w-full"
                        />
                        <span class="mt-2 block text-sm text-gray-600">
                          {config.overlayOpacity}%
                        </span>
                      </label>
                    </div>
                    {(config.imageUrl || imagePreview) && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        class="w-fit rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                )}
              </div>
            </section>

            <div class="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                class="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Hero Settings"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                class="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Reset Defaults
              </button>
              {message && <p class="text-sm font-medium text-gray-700">{message}</p>}
            </div>
          </form>

          <aside class="lg:sticky lg:top-6 lg:self-start">
            <section class="rounded-lg bg-white p-5 shadow-sm">
              <h2 class="text-lg font-semibold text-gray-900">Live Preview</h2>
              <div
                class="mt-4 flex min-h-[420px] items-center justify-center rounded-lg px-6 py-12 text-center shadow-inner"
                style={previewStyle}
              >
                <div class="max-w-xl">
                  <h3 class="text-4xl font-bold leading-tight">{config.title}</h3>
                  <p class="mx-auto mt-5 max-w-lg text-lg opacity-90">
                    {config.subtitle}
                  </p>
                  <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <span class="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-blue-700">
                      {config.primaryButtonText}
                    </span>
                    <span class="inline-flex items-center justify-center rounded-md border border-current px-6 py-3 text-sm font-semibold">
                      {config.secondaryButtonText}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
