/* empty css                                    */
import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_z5fA6ZdE.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_CTphBD5E.mjs';
import { useState, useMemo, useEffect } from 'preact/hooks';
import { jsx, jsxs, Fragment } from 'preact/jsx-runtime';
export { renderers } from '../../renderers.mjs';

const DEFAULT_CONFIG = {
  pageTitle: "Home - Astro Blog",
  metaDescription: "A fully-featured blog system with a control panel editor, Tailwind CSS styling, and dynamic markdown pages.",
  title: "Create Dynamic Blog Pages with Astro",
  subtitle: "A fully-featured blog system with a control panel editor, Tailwind CSS styling, and dynamic markdown pages.",
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
  overlayOpacity: 35
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
    r: value >> 16 & 255,
    g: value >> 8 & 255,
    b: value & 255
  };
}
function getPreviewStyle(config, imagePreview) {
  const style = {
    color: config.textColor
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
function ColorField({
  label,
  name,
  value,
  onChange
}) {
  return jsxs("label", {
    class: "block",
    children: [jsx("span", {
      class: "block text-sm font-medium text-gray-700",
      children: label
    }), jsxs("div", {
      class: "mt-2 flex items-center gap-3",
      children: [jsx("input", {
        type: "color",
        name,
        value,
        onInput: onChange,
        class: "h-10 w-12 cursor-pointer rounded border border-gray-300 bg-white p-1"
      }), jsx("input", {
        type: "text",
        name,
        value,
        onInput: onChange,
        class: "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      })]
    })]
  });
}
function HeroAdmin() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const previewStyle = useMemo(() => getPreviewStyle(config, imagePreview), [config, imagePreview]);
  useEffect(() => {
    let mounted = true;
    async function loadSettings() {
      try {
        const response = await fetch("/api/hero-settings");
        const data = await response.json();
        if (mounted && data.config) {
          setConfig({
            ...DEFAULT_CONFIG,
            ...data.config
          });
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
    const {
      name,
      value
    } = event.currentTarget;
    setConfig((current) => ({
      ...current,
      [name]: name === "overlayOpacity" ? Number(value) : value
    }));
  };
  const handleImageChange = (event) => {
    const file = event.currentTarget.files?.[0];
    setImageFile(file || null);
    setImagePreview(file ? URL.createObjectURL(file) : "");
    if (file) {
      setConfig((current) => ({
        ...current,
        backgroundType: "image"
      }));
    }
  };
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setConfig((current) => ({
      ...current,
      imageUrl: "",
      backgroundType: current.backgroundType === "image" ? "gradient" : current.backgroundType
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...config,
          imageBase64,
          imageFilename,
          removeImage: !config.imageUrl && !imageFile
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save hero settings.");
      }
      setConfig({
        ...DEFAULT_CONFIG,
        ...data.config
      });
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
    return jsx("div", {
      class: "min-h-screen bg-gray-50 px-4 py-12",
      children: jsx("div", {
        class: "mx-auto max-w-5xl rounded-lg bg-white p-8 text-center shadow",
        children: "Loading hero settings..."
      })
    });
  }
  return jsx("div", {
    class: "min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8",
    children: jsxs("div", {
      class: "mx-auto max-w-7xl",
      children: [jsxs("div", {
        class: "mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        children: [jsxs("div", {
          children: [jsx("p", {
            class: "text-sm font-medium uppercase tracking-wide text-blue-600",
            children: "Admin"
          }), jsx("h1", {
            class: "mt-1 text-3xl font-bold text-gray-900",
            children: "Hero Section Control"
          })]
        }), jsxs("div", {
          class: "flex flex-wrap gap-3",
          children: [jsx("a", {
            href: "/admin",
            class: "inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50",
            children: "Blog Editor"
          }), jsx("a", {
            href: "/",
            class: "inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700",
            children: "View Home"
          })]
        })]
      }), jsxs("div", {
        class: "grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]",
        children: [jsxs("form", {
          onSubmit: handleSubmit,
          class: "space-y-6",
          children: [jsxs("section", {
            class: "rounded-lg bg-white p-6 shadow-sm",
            children: [jsx("h2", {
              class: "text-lg font-semibold text-gray-900",
              children: "Page SEO"
            }), jsxs("div", {
              class: "mt-5 grid gap-5",
              children: [jsxs("label", {
                class: "block",
                children: [jsx("span", {
                  class: "block text-sm font-medium text-gray-700",
                  children: "Page Title"
                }), jsx("input", {
                  type: "text",
                  name: "pageTitle",
                  value: config.pageTitle,
                  onInput: updateField,
                  class: "mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                })]
              }), jsxs("label", {
                class: "block",
                children: [jsx("span", {
                  class: "block text-sm font-medium text-gray-700",
                  children: "Meta Description"
                }), jsx("textarea", {
                  name: "metaDescription",
                  value: config.metaDescription,
                  onInput: updateField,
                  rows: 3,
                  class: "mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                })]
              })]
            })]
          }), jsxs("section", {
            class: "rounded-lg bg-white p-6 shadow-sm",
            children: [jsx("h2", {
              class: "text-lg font-semibold text-gray-900",
              children: "Words"
            }), jsxs("div", {
              class: "mt-5 grid gap-5",
              children: [jsxs("label", {
                class: "block",
                children: [jsx("span", {
                  class: "block text-sm font-medium text-gray-700",
                  children: "Title"
                }), jsx("input", {
                  type: "text",
                  name: "title",
                  value: config.title,
                  onInput: updateField,
                  class: "mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                })]
              }), jsxs("label", {
                class: "block",
                children: [jsx("span", {
                  class: "block text-sm font-medium text-gray-700",
                  children: "Subtitle"
                }), jsx("textarea", {
                  name: "subtitle",
                  value: config.subtitle,
                  onInput: updateField,
                  rows: 4,
                  class: "mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                })]
              }), jsxs("div", {
                class: "grid gap-5 sm:grid-cols-2",
                children: [jsxs("label", {
                  class: "block",
                  children: [jsx("span", {
                    class: "block text-sm font-medium text-gray-700",
                    children: "Main Button Text"
                  }), jsx("input", {
                    type: "text",
                    name: "primaryButtonText",
                    value: config.primaryButtonText,
                    onInput: updateField,
                    class: "mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  })]
                }), jsxs("label", {
                  class: "block",
                  children: [jsx("span", {
                    class: "block text-sm font-medium text-gray-700",
                    children: "Main Button Link"
                  }), jsx("input", {
                    type: "text",
                    name: "primaryButtonHref",
                    value: config.primaryButtonHref,
                    onInput: updateField,
                    class: "mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  })]
                }), jsxs("label", {
                  class: "block",
                  children: [jsx("span", {
                    class: "block text-sm font-medium text-gray-700",
                    children: "Second Button Text"
                  }), jsx("input", {
                    type: "text",
                    name: "secondaryButtonText",
                    value: config.secondaryButtonText,
                    onInput: updateField,
                    class: "mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  })]
                }), jsxs("label", {
                  class: "block",
                  children: [jsx("span", {
                    class: "block text-sm font-medium text-gray-700",
                    children: "Second Button Link"
                  }), jsx("input", {
                    type: "text",
                    name: "secondaryButtonHref",
                    value: config.secondaryButtonHref,
                    onInput: updateField,
                    class: "mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  })]
                })]
              })]
            })]
          }), jsxs("section", {
            class: "rounded-lg bg-white p-6 shadow-sm",
            children: [jsx("h2", {
              class: "text-lg font-semibold text-gray-900",
              children: "Background"
            }), jsxs("div", {
              class: "mt-5 grid gap-5",
              children: [jsx("div", {
                class: "grid gap-3 sm:grid-cols-3",
                children: ["gradient", "solid", "image"].map((mode) => jsxs("label", {
                  class: `cursor-pointer rounded-md border px-4 py-3 text-sm font-medium capitalize ${config.backgroundType === mode ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-300 bg-white text-gray-700"}`,
                  children: [jsx("input", {
                    type: "radio",
                    name: "backgroundType",
                    value: mode,
                    checked: config.backgroundType === mode,
                    onInput: updateField,
                    class: "sr-only"
                  }), mode]
                }, mode))
              }), jsxs("div", {
                class: "grid gap-5 sm:grid-cols-2",
                children: [jsx(ColorField, {
                  label: "Text Color",
                  name: "textColor",
                  value: config.textColor,
                  onChange: updateField
                }), config.backgroundType === "solid" && jsx(ColorField, {
                  label: "Background Color",
                  name: "backgroundColor",
                  value: config.backgroundColor,
                  onChange: updateField
                }), config.backgroundType === "gradient" && jsxs(Fragment, {
                  children: [jsx(ColorField, {
                    label: "Gradient Start",
                    name: "gradientFrom",
                    value: config.gradientFrom,
                    onChange: updateField
                  }), jsx(ColorField, {
                    label: "Gradient End",
                    name: "gradientTo",
                    value: config.gradientTo,
                    onChange: updateField
                  })]
                })]
              }), config.backgroundType === "image" && jsxs("div", {
                class: "grid gap-5",
                children: [jsxs("label", {
                  class: "block",
                  children: [jsx("span", {
                    class: "block text-sm font-medium text-gray-700",
                    children: "Upload Hero Image"
                  }), jsx("input", {
                    type: "file",
                    accept: "image/*",
                    onChange: handleImageChange,
                    class: "mt-2 block w-full cursor-pointer rounded-md border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
                  })]
                }), config.imageUrl && !imagePreview && jsxs("p", {
                  class: "text-sm text-gray-600",
                  children: ["Current image: ", config.imageUrl]
                }), jsxs("div", {
                  class: "grid gap-5 sm:grid-cols-2",
                  children: [jsx(ColorField, {
                    label: "Image Overlay Color",
                    name: "overlayColor",
                    value: config.overlayColor,
                    onChange: updateField
                  }), jsxs("label", {
                    class: "block",
                    children: [jsx("span", {
                      class: "block text-sm font-medium text-gray-700",
                      children: "Overlay Opacity"
                    }), jsx("input", {
                      type: "range",
                      name: "overlayOpacity",
                      min: "0",
                      max: "90",
                      value: config.overlayOpacity,
                      onInput: updateField,
                      class: "mt-4 w-full"
                    }), jsxs("span", {
                      class: "mt-2 block text-sm text-gray-600",
                      children: [config.overlayOpacity, "%"]
                    })]
                  })]
                }), (config.imageUrl || imagePreview) && jsx("button", {
                  type: "button",
                  onClick: handleRemoveImage,
                  class: "w-fit rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50",
                  children: "Remove Image"
                })]
              })]
            })]
          }), jsxs("div", {
            class: "flex flex-wrap items-center gap-3",
            children: [jsx("button", {
              type: "submit",
              disabled: saving,
              class: "rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60",
              children: saving ? "Saving..." : "Save Hero Settings"
            }), jsx("button", {
              type: "button",
              onClick: handleReset,
              class: "rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50",
              children: "Reset Defaults"
            }), message && jsx("p", {
              class: "text-sm font-medium text-gray-700",
              children: message
            })]
          })]
        }), jsx("aside", {
          class: "lg:sticky lg:top-6 lg:self-start",
          children: jsxs("section", {
            class: "rounded-lg bg-white p-5 shadow-sm",
            children: [jsx("h2", {
              class: "text-lg font-semibold text-gray-900",
              children: "Live Preview"
            }), jsx("div", {
              class: "mt-4 flex min-h-[420px] items-center justify-center rounded-lg px-6 py-12 text-center shadow-inner",
              style: previewStyle,
              children: jsxs("div", {
                class: "max-w-xl",
                children: [jsx("h3", {
                  class: "text-4xl font-bold leading-tight",
                  children: config.title
                }), jsx("p", {
                  class: "mx-auto mt-5 max-w-lg text-lg opacity-90",
                  children: config.subtitle
                }), jsxs("div", {
                  class: "mt-8 flex flex-col justify-center gap-3 sm:flex-row",
                  children: [jsx("span", {
                    class: "inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-blue-700",
                    children: config.primaryButtonText
                  }), jsx("span", {
                    class: "inline-flex items-center justify-center rounded-md border border-current px-6 py-3 text-sm font-semibold",
                    children: config.secondaryButtonText
                  })]
                })]
              })
            })]
          })
        })]
      })]
    })
  });
}

const $$Hero = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Admin Panel - Hero Section" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroAdmin", HeroAdmin, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Ahmed Talal/Desktop/astro-blog/src/components/HeroAdmin.jsx", "client:component-export": "default" })} ` })}`;
}, "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/admin/hero.astro", void 0);

const $$file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/admin/hero.astro";
const $$url = "/admin/hero";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Hero,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
