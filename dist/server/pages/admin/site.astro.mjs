/* empty css                                    */
import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_RHxhWfPN.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_zSSWPtV9.mjs';
import { useState, useMemo, useEffect } from 'preact/hooks';
import { jsx, jsxs } from 'preact/jsx-runtime';
export { renderers } from '../../renderers.mjs';

const DEFAULT_CONFIG = {
  brandName: "Astro Blog",
  logoUrl: "/favicon.svg",
  navLinks: [{
    label: "Home",
    href: "/"
  }, {
    label: "Blog",
    href: "/blog"
  }, {
    label: "Hero",
    href: "/admin/hero"
  }],
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
  footerShowLogo: true
};
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
function TextField({
  label,
  name,
  value,
  onChange,
  placeholder = ""
}) {
  return jsxs("label", {
    class: "block",
    children: [jsx("span", {
      class: "block text-sm font-medium text-gray-700",
      children: label
    }), jsx("input", {
      type: "text",
      name,
      value,
      placeholder,
      onInput: onChange,
      class: "mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
    })]
  });
}
function PreviewLink({
  link,
  config
}) {
  const pillStyle = config.headerLinkStyle === "pills" ? {
    backgroundColor: `${config.headerLinkHoverColor}18`,
    color: config.headerLinkHoverColor
  } : {
    color: config.headerLinkColor
  };
  const underlineStyle = config.headerLinkStyle === "underline" ? {
    borderBottom: `2px solid ${config.headerLinkHoverColor}`,
    color: config.headerLinkHoverColor
  } : pillStyle;
  return jsx("span", {
    class: `inline-flex rounded-md px-3 py-2 text-sm font-medium ${config.headerLinkStyle === "plain" ? "" : ""}`,
    style: config.headerLinkStyle === "underline" ? underlineStyle : pillStyle,
    children: link.label
  });
}
function SiteChromeAdmin() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const previewLogo = logoPreview || config.logoUrl;
  const headerPreviewStyle = useMemo(() => ({
    backgroundColor: config.headerBackgroundColor,
    borderColor: config.headerBorderColor,
    color: config.headerTextColor
  }), [config]);
  const footerPreviewStyle = useMemo(() => ({
    backgroundColor: config.footerBackgroundColor,
    borderColor: config.footerBorderColor,
    color: config.footerTextColor
  }), [config]);
  const brandPreviewStyle = useMemo(() => ({
    color: config.headerBrandTextColor
  }), [config.headerBrandTextColor]);
  useEffect(() => {
    let mounted = true;
    async function loadSettings() {
      try {
        const response = await fetch("/api/site-settings");
        const data = await response.json();
        if (mounted && data.config) {
          setConfig({
            ...DEFAULT_CONFIG,
            ...data.config
          });
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
    const {
      name,
      value,
      type,
      checked
    } = event.currentTarget;
    setConfig((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  const updateNavLink = (index, field, value) => {
    setConfig((current) => {
      const navLinks = [...current.navLinks];
      navLinks[index] = {
        ...navLinks[index],
        [field]: value
      };
      return {
        ...current,
        navLinks
      };
    });
  };
  const addNavLink = () => {
    setConfig((current) => ({
      ...current,
      navLinks: [...current.navLinks, {
        label: "New Link",
        href: "/"
      }].slice(0, 6)
    }));
  };
  const removeNavLink = (index) => {
    setConfig((current) => ({
      ...current,
      navLinks: current.navLinks.filter((_, linkIndex) => linkIndex !== index)
    }));
  };
  const handleLogoChange = (event) => {
    const file = event.currentTarget.files?.[0];
    setLogoFile(file || null);
    setLogoPreview(file ? URL.createObjectURL(file) : "");
  };
  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    setConfig((current) => ({
      ...current,
      logoUrl: ""
    }));
  };
  const handleReset = () => {
    setLogoFile(null);
    setLogoPreview("");
    setConfig(DEFAULT_CONFIG);
    setMessage("Default header and footer settings are loaded. Save to apply them.");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("Saving header and footer settings...");
    try {
      let logoBase64 = "";
      if (logoFile) {
        logoBase64 = await fileToDataUrl(logoFile);
      }
      const response = await fetch("/api/site-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...config,
          logoBase64,
          removeLogo: !config.logoUrl && !logoFile
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save header/footer settings.");
      }
      setConfig({
        ...DEFAULT_CONFIG,
        ...data.config
      });
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
    return jsx("div", {
      class: "min-h-screen bg-gray-50 px-4 py-12",
      children: jsx("div", {
        class: "mx-auto max-w-5xl rounded-lg bg-white p-8 text-center shadow",
        children: "Loading header and footer settings..."
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
            children: "Header and Footer Control"
          })]
        }), jsxs("div", {
          class: "flex flex-wrap gap-3",
          children: [jsx("a", {
            href: "/admin",
            class: "inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50",
            children: "Blog Editor"
          }), jsx("a", {
            href: "/admin/hero",
            class: "inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50",
            children: "Hero Control"
          }), jsx("a", {
            href: "/admin/home-sections",
            class: "inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50",
            children: "Home Sections"
          }), jsx("a", {
            href: "/",
            class: "inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700",
            children: "View Home"
          })]
        })]
      }), jsxs("div", {
        class: "grid gap-8 lg:grid-cols-[minmax(0,1fr)_440px]",
        children: [jsxs("form", {
          onSubmit: handleSubmit,
          class: "space-y-6",
          children: [jsxs("section", {
            class: "rounded-lg bg-white p-6 shadow-sm",
            children: [jsx("h2", {
              class: "text-lg font-semibold text-gray-900",
              children: "Brand"
            }), jsxs("div", {
              class: "mt-5 grid gap-5",
              children: [jsx(TextField, {
                label: "Brand Name Text",
                name: "brandName",
                value: config.brandName,
                onChange: updateField
              }), jsx(ColorField, {
                label: "Brand Name Color",
                name: "headerBrandTextColor",
                value: config.headerBrandTextColor,
                onChange: updateField
              }), jsxs("label", {
                class: "block",
                children: [jsx("span", {
                  class: "block text-sm font-medium text-gray-700",
                  children: "Logo Image"
                }), jsx("input", {
                  type: "file",
                  accept: "image/*",
                  onChange: handleLogoChange,
                  class: "mt-2 block w-full cursor-pointer rounded-md border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
                })]
              }), config.logoUrl && !logoPreview && jsxs("p", {
                class: "text-sm text-gray-600",
                children: ["Current logo: ", config.logoUrl]
              }), (config.logoUrl || logoPreview) && jsx("button", {
                type: "button",
                onClick: handleRemoveLogo,
                class: "w-fit rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50",
                children: "Remove Logo"
              })]
            })]
          }), jsxs("section", {
            class: "rounded-lg bg-white p-6 shadow-sm",
            children: [jsx("h2", {
              class: "text-lg font-semibold text-gray-900",
              children: "Header Style"
            }), jsxs("div", {
              class: "mt-5 grid gap-5 sm:grid-cols-2",
              children: [jsx(ColorField, {
                label: "Background",
                name: "headerBackgroundColor",
                value: config.headerBackgroundColor,
                onChange: updateField
              }), jsx(ColorField, {
                label: "Header Text",
                name: "headerTextColor",
                value: config.headerTextColor,
                onChange: updateField
              }), jsx(ColorField, {
                label: "Link Color",
                name: "headerLinkColor",
                value: config.headerLinkColor,
                onChange: updateField
              }), jsx(ColorField, {
                label: "Link Hover",
                name: "headerLinkHoverColor",
                value: config.headerLinkHoverColor,
                onChange: updateField
              }), jsx(ColorField, {
                label: "Border",
                name: "headerBorderColor",
                value: config.headerBorderColor,
                onChange: updateField
              }), jsxs("label", {
                class: "block",
                children: [jsx("span", {
                  class: "block text-sm font-medium text-gray-700",
                  children: "Link Style"
                }), jsxs("select", {
                  name: "headerLinkStyle",
                  value: config.headerLinkStyle,
                  onInput: updateField,
                  class: "mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100",
                  children: [jsx("option", {
                    value: "pills",
                    children: "Pills"
                  }), jsx("option", {
                    value: "plain",
                    children: "Plain"
                  }), jsx("option", {
                    value: "underline",
                    children: "Underline"
                  })]
                })]
              })]
            })]
          }), jsxs("section", {
            class: "rounded-lg bg-white p-6 shadow-sm",
            children: [jsxs("div", {
              class: "flex items-center justify-between gap-4",
              children: [jsx("h2", {
                class: "text-lg font-semibold text-gray-900",
                children: "Header Links"
              }), jsx("button", {
                type: "button",
                onClick: addNavLink,
                disabled: config.navLinks.length >= 6,
                class: "rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50",
                children: "Add Link"
              })]
            }), jsx("div", {
              class: "mt-5 grid gap-4",
              children: config.navLinks.map((link, index) => jsxs("div", {
                class: "grid gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]",
                children: [jsxs("label", {
                  class: "block",
                  children: [jsx("span", {
                    class: "block text-sm font-medium text-gray-700",
                    children: "Label"
                  }), jsx("input", {
                    type: "text",
                    value: link.label,
                    onInput: (event) => updateNavLink(index, "label", event.currentTarget.value),
                    class: "mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  })]
                }), jsxs("label", {
                  class: "block",
                  children: [jsx("span", {
                    class: "block text-sm font-medium text-gray-700",
                    children: "URL"
                  }), jsx("input", {
                    type: "text",
                    value: link.href,
                    onInput: (event) => updateNavLink(index, "href", event.currentTarget.value),
                    class: "mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  })]
                }), jsx("div", {
                  class: "flex items-end",
                  children: jsx("button", {
                    type: "button",
                    onClick: () => removeNavLink(index),
                    class: "rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50",
                    children: "Remove"
                  })
                })]
              }, `${link.label}-${index}`))
            })]
          }), jsxs("section", {
            class: "rounded-lg bg-white p-6 shadow-sm",
            children: [jsx("h2", {
              class: "text-lg font-semibold text-gray-900",
              children: "Footer"
            }), jsxs("div", {
              class: "mt-5 grid gap-5",
              children: [jsx(TextField, {
                label: "Footer Main Text",
                name: "footerText",
                value: config.footerText,
                onChange: updateField
              }), jsx(TextField, {
                label: "Footer Subtext",
                name: "footerSubtext",
                value: config.footerSubtext,
                onChange: updateField
              }), jsxs("label", {
                class: "flex items-center gap-3 text-sm font-medium text-gray-700",
                children: [jsx("input", {
                  type: "checkbox",
                  name: "footerShowLogo",
                  checked: config.footerShowLogo,
                  onInput: updateField,
                  class: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                }), "Show logo in footer"]
              }), jsxs("div", {
                class: "grid gap-5 sm:grid-cols-2",
                children: [jsx(ColorField, {
                  label: "Background",
                  name: "footerBackgroundColor",
                  value: config.footerBackgroundColor,
                  onChange: updateField
                }), jsx(ColorField, {
                  label: "Text",
                  name: "footerTextColor",
                  value: config.footerTextColor,
                  onChange: updateField
                }), jsx(ColorField, {
                  label: "Border",
                  name: "footerBorderColor",
                  value: config.footerBorderColor,
                  onChange: updateField
                }), jsx(ColorField, {
                  label: "Footer Links",
                  name: "footerLinkColor",
                  value: config.footerLinkColor,
                  onChange: updateField
                })]
              })]
            })]
          }), jsxs("div", {
            class: "flex flex-wrap items-center gap-3",
            children: [jsx("button", {
              type: "submit",
              disabled: saving,
              class: "rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60",
              children: saving ? "Saving..." : "Save Header and Footer"
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
            }), jsxs("div", {
              class: "mt-4 overflow-hidden rounded-lg border border-gray-200 shadow-inner",
              children: [jsx("div", {
                class: "border-b px-4 py-4",
                style: headerPreviewStyle,
                children: jsxs("div", {
                  class: "grid grid-cols-[auto_1fr_auto] items-center gap-3",
                  children: [jsxs("div", {
                    class: "flex items-center gap-2",
                    children: [previewLogo && jsx("img", {
                      src: previewLogo,
                      alt: "",
                      class: "h-8 w-8 rounded object-contain"
                    }), jsx("span", {
                      class: "font-bold",
                      style: brandPreviewStyle,
                      children: config.brandName
                    })]
                  }), jsx("div", {
                    class: "flex justify-center gap-2",
                    children: config.navLinks.map((link, index) => jsx(PreviewLink, {
                      link,
                      config
                    }, `${link.label}-${index}`))
                  }), jsx("span", {
                    class: "rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white",
                    children: "Admin"
                  })]
                })
              }), jsx("div", {
                class: "bg-gray-50 px-5 py-12 text-center text-gray-600",
                children: "Page content"
              }), jsxs("div", {
                class: "border-t px-5 py-6 text-center",
                style: footerPreviewStyle,
                children: [config.footerShowLogo && previewLogo && jsx("img", {
                  src: previewLogo,
                  alt: "",
                  class: "mx-auto mb-3 h-8 w-8 rounded object-contain"
                }), jsx("div", {
                  class: "mb-3 flex justify-center gap-4 text-sm",
                  children: config.navLinks.map((link, index) => jsx("span", {
                    style: {
                      color: config.footerLinkColor
                    },
                    children: link.label
                  }, `${link.label}-${index}`))
                }), jsx("p", {
                  children: config.footerText
                }), jsx("p", {
                  class: "mt-2 text-sm opacity-80",
                  children: config.footerSubtext
                })]
              })]
            })]
          })
        })]
      })]
    })
  });
}

const $$Site = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Admin Panel - Header and Footer" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "SiteChromeAdmin", SiteChromeAdmin, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Ahmed Talal/Desktop/astro-blog/src/components/SiteChromeAdmin.jsx", "client:component-export": "default" })} ` })}`;
}, "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/admin/site.astro", void 0);

const $$file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/admin/site.astro";
const $$url = "/admin/site";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Site,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
