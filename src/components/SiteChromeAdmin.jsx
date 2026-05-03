import { useEffect, useMemo, useState } from "preact/hooks";

const DEFAULT_CONFIG = {
  brandName: "Astro Blog",
  logoUrl: "/favicon.svg",
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Hero", href: "/admin/hero" },
  ],
  footerLinks: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Admin", href: "/admin" },
  ],
  headerBackgroundColor: "#ffffff",
  headerTextColor: "#111827",
  headerBrandTextColor: "#111827",
  headerLinkColor: "#374151",
  headerLinkHoverColor: "#2563eb",
  headerBorderColor: "#e5e7eb",
  headerLinkStyle: "pills",
  footerBackgroundColor: "#ffffff",
  footerTextColor: "#6b7280",
  footerBorderColor: "#e5e7eb",
  footerLinkColor: "#2563eb",
  footerText: "Built with Astro, Tailwind CSS, and love",
  footerSubtext: "Dynamic blog pages with markdown editor",
  footerShowLogo: true,
};

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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

function TextField({ label, name, value, onChange, placeholder = "" }) {
  return (
    <label class="block">
      <span class="block text-sm font-medium text-gray-700">{label}</span>
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onInput={onChange}
        class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function PreviewLink({ link, config }) {
  const pillStyle =
    config.headerLinkStyle === "pills"
      ? {
          backgroundColor: `${config.headerLinkHoverColor}18`,
          color: config.headerLinkHoverColor,
        }
      : { color: config.headerLinkColor };

  const underlineStyle =
    config.headerLinkStyle === "underline"
      ? {
          borderBottom: `2px solid ${config.headerLinkHoverColor}`,
          color: config.headerLinkHoverColor,
        }
      : pillStyle;

  return (
    <span
      class={`inline-flex rounded-md px-3 py-2 text-sm font-medium ${
        config.headerLinkStyle === "plain" ? "" : ""
      }`}
      style={config.headerLinkStyle === "underline" ? underlineStyle : pillStyle}
    >
      {link.label}
    </span>
  );
}

export default function SiteChromeAdmin() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const previewLogo = logoPreview || config.logoUrl;

  const headerPreviewStyle = useMemo(
    () => ({
      backgroundColor: config.headerBackgroundColor,
      borderColor: config.headerBorderColor,
      color: config.headerTextColor,
    }),
    [config],
  );

  const footerPreviewStyle = useMemo(
    () => ({
      backgroundColor: config.footerBackgroundColor,
      borderColor: config.footerBorderColor,
      color: config.footerTextColor,
    }),
    [config],
  );

  const brandPreviewStyle = useMemo(
    () => ({
      color: config.headerBrandTextColor,
    }),
    [config.headerBrandTextColor],
  );

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const response = await fetch("/api/site-settings");
        const data = await response.json();
        if (mounted && data.config) {
          setConfig({ ...DEFAULT_CONFIG, ...data.config });
        }
      } catch (error) {
        if (mounted) {
          setMessage(`Could not load header/footer settings: ${error.message}`);
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
    const { name, value, type, checked } = event.currentTarget;
    setConfig((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateNavLink = (index, field, value) => {
    setConfig((current) => {
      const navLinks = [...current.navLinks];
      navLinks[index] = { ...navLinks[index], [field]: value };
      return { ...current, navLinks };
    });
  };

  const updateFooterLink = (index, field, value) => {
    setConfig((current) => {
      const footerLinks = [...current.footerLinks];
      footerLinks[index] = { ...footerLinks[index], [field]: value };
      return { ...current, footerLinks };
    });
  };

  const addNavLink = () => {
    setConfig((current) => ({
      ...current,
      navLinks: [...current.navLinks, { label: "New Link", href: "/" }].slice(0, 6),
    }));
  };

  const addFooterLink = () => {
    setConfig((current) => ({
      ...current,
      footerLinks: [...current.footerLinks, { label: "New Link", href: "/" }].slice(0, 8),
    }));
  };

  const removeNavLink = (index) => {
    const linkLabel = config.navLinks[index]?.label || "this navigation link";
    if (!confirm(`Remove "${linkLabel}" from navigation? Save afterward to publish this change.`)) {
      return;
    }

    setConfig((current) => ({
      ...current,
      navLinks: current.navLinks.filter((_, linkIndex) => linkIndex !== index),
    }));
  };

  const removeFooterLink = (index) => {
    const linkLabel = config.footerLinks[index]?.label || "this footer link";
    if (!confirm(`Remove "${linkLabel}" from footer? Save afterward to publish this change.`)) {
      return;
    }

    setConfig((current) => ({
      ...current,
      footerLinks: current.footerLinks.filter((_, linkIndex) => linkIndex !== index),
    }));
  };

  const handleLogoChange = (event) => {
    const file = event.currentTarget.files?.[0];
    setLogoFile(file || null);
    setLogoPreview(file ? URL.createObjectURL(file) : "");
  };

  const handleRemoveLogo = () => {
    if (!confirm("Remove the site logo? Save afterward to publish this change.")) {
      return;
    }

    setLogoFile(null);
    setLogoPreview("");
    setConfig((current) => ({ ...current, logoUrl: "" }));
  };

  const handleReset = () => {
    if (!confirm("Reset header and footer controls to default values? Save afterward to publish the reset.")) {
      return;
    }

    setLogoFile(null);
    setLogoPreview("");
    setConfig(DEFAULT_CONFIG);
    setMessage("Default header and footer settings are loaded. Save to apply them.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!confirm("Save header and footer settings and update the site?")) {
      return;
    }

    setSaving(true);
    setMessage("Saving header and footer settings...");

    try {
      let logoBase64 = "";
      if (logoFile) {
        logoBase64 = await fileToDataUrl(logoFile);
      }

      const response = await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...config,
          logoBase64,
          removeLogo: !config.logoUrl && !logoFile,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save header/footer settings.");
      }

      setConfig({ ...DEFAULT_CONFIG, ...data.config });
      setLogoFile(null);
      setLogoPreview("");
      setMessage("Header and footer updated successfully.");
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
          Loading header and footer settings...
        </div>
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="mb-8">
          <div>
            <p class="text-sm font-medium uppercase tracking-wide text-blue-600">
              Admin
            </p>
            <h1 class="mt-1 text-3xl font-bold text-gray-900">
              Header and Footer Control
            </h1>
          </div>
        </div>

        <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_440px]">
          <form onSubmit={handleSubmit} class="space-y-6">
            <section class="rounded-lg bg-white p-6 shadow-sm">
              <h2 class="text-lg font-semibold text-gray-900">Brand</h2>
              <div class="mt-5 grid gap-5">
                <TextField
                  label="Brand Name Text"
                  name="brandName"
                  value={config.brandName}
                  onChange={updateField}
                />
                <ColorField
                  label="Brand Name Color"
                  name="headerBrandTextColor"
                  value={config.headerBrandTextColor}
                  onChange={updateField}
                />
                <label class="block">
                  <span class="block text-sm font-medium text-gray-700">
                    Logo Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    class="mt-2 block w-full cursor-pointer rounded-md border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
                  />
                </label>
                {config.logoUrl && !logoPreview && (
                  <p class="text-sm text-gray-600">Current logo: {config.logoUrl}</p>
                )}
                {(config.logoUrl || logoPreview) && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    class="w-fit rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Remove Logo
                  </button>
                )}
              </div>
            </section>

            <section class="rounded-lg bg-white p-6 shadow-sm">
              <h2 class="text-lg font-semibold text-gray-900">Header Style</h2>
              <div class="mt-5 grid gap-5 sm:grid-cols-2">
                <ColorField
                  label="Background"
                  name="headerBackgroundColor"
                  value={config.headerBackgroundColor}
                  onChange={updateField}
                />
                <ColorField
                  label="Header Text"
                  name="headerTextColor"
                  value={config.headerTextColor}
                  onChange={updateField}
                />
                <ColorField
                  label="Link Color"
                  name="headerLinkColor"
                  value={config.headerLinkColor}
                  onChange={updateField}
                />
                <ColorField
                  label="Link Hover"
                  name="headerLinkHoverColor"
                  value={config.headerLinkHoverColor}
                  onChange={updateField}
                />
                <ColorField
                  label="Border"
                  name="headerBorderColor"
                  value={config.headerBorderColor}
                  onChange={updateField}
                />
                <label class="block">
                  <span class="block text-sm font-medium text-gray-700">
                    Link Style
                  </span>
                  <select
                    name="headerLinkStyle"
                    value={config.headerLinkStyle}
                    onInput={updateField}
                    class="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="pills">Pills</option>
                    <option value="plain">Plain</option>
                    <option value="underline">Underline</option>
                  </select>
                </label>
              </div>
            </section>

            <section class="rounded-lg bg-white p-6 shadow-sm">
              <div class="flex items-center justify-between gap-4">
                <h2 class="text-lg font-semibold text-gray-900">Header Links</h2>
                <button
                  type="button"
                  onClick={addNavLink}
                  disabled={config.navLinks.length >= 6}
                  class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add Link
                </button>
              </div>
              <div class="mt-5 grid gap-4">
                {config.navLinks.map((link, index) => (
                  <div
                    key={`${link.label}-${index}`}
                    class="grid gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                  >
                    <label class="block">
                      <span class="block text-sm font-medium text-gray-700">
                        Label
                      </span>
                      <input
                        type="text"
                        value={link.label}
                        onInput={(event) =>
                          updateNavLink(index, "label", event.currentTarget.value)
                        }
                        class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </label>
                    <label class="block">
                      <span class="block text-sm font-medium text-gray-700">
                        URL
                      </span>
                      <input
                        type="text"
                        value={link.href}
                        onInput={(event) =>
                          updateNavLink(index, "href", event.currentTarget.value)
                        }
                        class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </label>
                    <div class="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeNavLink(index)}
                        class="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section class="rounded-lg bg-white p-6 shadow-sm">
              <h2 class="text-lg font-semibold text-gray-900">Footer</h2>
              <div class="mt-5 grid gap-5">
                <TextField
                  label="Footer Main Text"
                  name="footerText"
                  value={config.footerText}
                  onChange={updateField}
                />
                <TextField
                  label="Footer Subtext"
                  name="footerSubtext"
                  value={config.footerSubtext}
                  onChange={updateField}
                />
                <label class="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    name="footerShowLogo"
                    checked={config.footerShowLogo}
                    onInput={updateField}
                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Show logo in footer
                </label>
                <div class="grid gap-5 sm:grid-cols-2">
                  <ColorField
                    label="Background"
                    name="footerBackgroundColor"
                    value={config.footerBackgroundColor}
                    onChange={updateField}
                  />
                  <ColorField
                    label="Text"
                    name="footerTextColor"
                    value={config.footerTextColor}
                    onChange={updateField}
                  />
                  <ColorField
                    label="Border"
                    name="footerBorderColor"
                    value={config.footerBorderColor}
                    onChange={updateField}
                  />
                  <ColorField
                    label="Footer Links"
                    name="footerLinkColor"
                    value={config.footerLinkColor}
                    onChange={updateField}
                  />
                </div>
              </div>
            </section>

            <section class="rounded-lg bg-white p-6 shadow-sm">
              <div class="flex items-center justify-between gap-4">
                <h2 class="text-lg font-semibold text-gray-900">Footer Links</h2>
                <button
                  type="button"
                  onClick={addFooterLink}
                  disabled={config.footerLinks.length >= 8}
                  class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add Link
                </button>
              </div>
              <div class="mt-5 grid gap-4">
                {config.footerLinks.map((link, index) => (
                  <div
                    key={`${link.label}-${index}`}
                    class="grid gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                  >
                    <label class="block">
                      <span class="block text-sm font-medium text-gray-700">
                        Label
                      </span>
                      <input
                        type="text"
                        value={link.label}
                        onInput={(event) =>
                          updateFooterLink(index, "label", event.currentTarget.value)
                        }
                        class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </label>
                    <label class="block">
                      <span class="block text-sm font-medium text-gray-700">
                        URL
                      </span>
                      <input
                        type="text"
                        value={link.href}
                        onInput={(event) =>
                          updateFooterLink(index, "href", event.currentTarget.value)
                        }
                        class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </label>
                    <div class="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeFooterLink(index)}
                        class="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div class="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                class="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Header and Footer"}
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
              <div class="mt-4 overflow-hidden rounded-lg border border-gray-200 shadow-inner">
                <div
                  class="border-b px-4 py-4"
                  style={headerPreviewStyle}
                >
                  <div class="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                    <div class="flex items-center gap-2">
                      {previewLogo && (
                        <img
                          src={previewLogo}
                          alt=""
                          class="h-8 w-8 rounded object-contain"
                        />
                      )}
                      <span class="font-bold" style={brandPreviewStyle}>{config.brandName}</span>
                    </div>
                    <div class="flex justify-center gap-2">
                      {config.navLinks.map((link, index) => (
                        <PreviewLink
                          key={`${link.label}-${index}`}
                          link={link}
                          config={config}
                        />
                      ))}
                    </div>
                    <span class="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white">
                      Admin
                    </span>
                  </div>
                </div>
                <div class="bg-gray-50 px-5 py-12 text-center text-gray-600">
                  Page content
                </div>
                <div class="border-t px-5 py-6 text-center" style={footerPreviewStyle}>
                  {config.footerShowLogo && previewLogo && (
                    <img
                      src={previewLogo}
                      alt=""
                      class="mx-auto mb-3 h-8 w-8 rounded object-contain"
                    />
                  )}
                  <div class="mb-3 flex justify-center gap-4 text-sm">
                    {config.footerLinks.map((link, index) => (
                      <span
                        key={`${link.label}-${index}`}
                        style={{ color: config.footerLinkColor }}
                      >
                        {link.label}
                      </span>
                    ))}
                  </div>
                  <p>{config.footerText}</p>
                  <p class="mt-2 text-sm opacity-80">{config.footerSubtext}</p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
