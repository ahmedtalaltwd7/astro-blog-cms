/* empty css                                    */
import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_RHxhWfPN.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_zSSWPtV9.mjs';
import { useState, useEffect } from 'preact/hooks';
import { jsx, jsxs, Fragment } from 'preact/jsx-runtime';
export { renderers } from '../../renderers.mjs';

const DEFAULT_SECTION = {
  id: "",
  title: "New Home Section",
  body: "Add your section content here.",
  imageUrl: "",
  imageAlt: "",
  style: "normal",
  backgroundColor: "#eff6ff",
  backgroundColorTo: "#dbeafe",
  waveColor: "#ffffff",
  wavePosition: "top",
  textColor: "#111827",
  bodyTextColor: "#4b5563",
  autoSlide: false,
  sliderOrientation: "vertical",
  sliderImages: []
};
const DEFAULT_HOW_IT_WORKS = {
  heading: "How It Works",
  cards: [{
    title: "Edit Markdown",
    body: "Use the admin control panel to write blog posts in markdown with frontmatter. The editor provides a live preview.",
    accentColor: "#2563eb",
    accentBackgroundColor: "#dbeafe",
    cardBackgroundColor: "#f9fafb",
    titleColor: "#111827",
    bodyTextColor: "#4b5563",
    backgroundImageUrl: "",
    overlayColor: "#000000",
    overlayOpacity: 0,
    cardStyle: "normal",
    iconKey: "edit"
  }, {
    title: "Save to Files",
    body: "Posts are saved as .md files and the API handles file creation and validation.",
    accentColor: "#7c3aed",
    accentBackgroundColor: "#ede9fe",
    cardBackgroundColor: "#f9fafb",
    titleColor: "#111827",
    bodyTextColor: "#4b5563",
    backgroundImageUrl: "",
    overlayColor: "#000000",
    overlayOpacity: 0,
    cardStyle: "normal",
    iconKey: "file"
  }, {
    title: "Dynamic Pages",
    body: "Astro generates pages for each blog post using dynamic routing. Tailwind CSS keeps the design responsive.",
    accentColor: "#16a34a",
    accentBackgroundColor: "#dcfce7",
    cardBackgroundColor: "#f9fafb",
    titleColor: "#111827",
    bodyTextColor: "#4b5563",
    backgroundImageUrl: "",
    overlayColor: "#000000",
    overlayOpacity: 0,
    cardStyle: "normal",
    iconKey: "check"
  }]
};
const STYLE_OPTIONS = [{
  value: "normal",
  label: "Normal"
}, {
  value: "wavy",
  label: "Wavy Background"
}, {
  value: "imageZoom",
  label: "Image Zoom on Hover"
}, {
  value: "verticalSlider",
  label: "Vertical Image Slider"
}];
const WAVE_POSITION_OPTIONS = [{
  value: "top",
  label: "Above"
}, {
  value: "bottom",
  label: "Down"
}];
const SLIDER_ORIENTATION_OPTIONS = [{
  value: "vertical",
  label: "Vertical"
}, {
  value: "horizontal",
  label: "Horizontal"
}];
const CARD_STYLE_OPTIONS = [{
  value: "normal",
  label: "Normal"
}, {
  value: "imageZoom",
  label: "Image Zoom on Hover"
}];
const CARD_ICON_OPTIONS = [{
  value: "edit",
  label: "Edit",
  path: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
}, {
  value: "file",
  label: "File",
  path: "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
}, {
  value: "check",
  label: "Check",
  path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
}, {
  value: "star",
  label: "Star",
  path: "M11.48 3.499a.562.562 0 011.04 0l2.13 5.18a.563.563 0 00.475.345l5.59.43c.527.04.74.697.338 1.04l-4.262 3.652a.563.563 0 00-.182.557l1.302 5.46a.562.562 0 01-.84.61l-4.793-2.927a.563.563 0 00-.586 0L6.9 20.773a.562.562 0 01-.84-.61l1.302-5.46a.563.563 0 00-.182-.557l-4.262-3.651a.562.562 0 01.338-1.041l5.59-.43a.563.563 0 00.475-.345l2.13-5.18z"
}, {
  value: "image",
  label: "Image",
  path: "M3 16.5l4.5-4.5 3 3 4.5-6 6 7.5M4.5 19.5h15A1.5 1.5 0 0021 18V6a1.5 1.5 0 00-1.5-1.5h-15A1.5 1.5 0 003 6v12a1.5 1.5 0 001.5 1.5z"
}, {
  value: "rocket",
  label: "Rocket",
  path: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96A14.98 14.98 0 019.63 8.41m0 0a6 6 0 00-7.38 5.84h4.8m2.58-5.84a6 6 0 017.38 5.84m-7.38-5.84L3 21l12.59-6.63"
}];
function createSection() {
  return {
    ...DEFAULT_SECTION,
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `section-${Date.now()}`
  };
}
function createSliderSection() {
  return {
    ...DEFAULT_SECTION,
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `section-${Date.now()}`,
    title: "Vertical Image Slider",
    body: "Add images, links, and auto-slide behavior for this homepage slider.",
    style: "verticalSlider",
    autoSlide: true,
    sliderOrientation: "vertical",
    sliderImages: [createSliderImage()]
  };
}
function createSliderImage() {
  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `slide-${Date.now()}`,
    imageUrl: "",
    imageAlt: "",
    href: ""
  };
}
function createHowItWorksCard() {
  return {
    title: "New Card",
    body: "Add card content here.",
    accentColor: "#2563eb",
    accentBackgroundColor: "#dbeafe",
    cardBackgroundColor: "#f9fafb",
    titleColor: "#111827",
    bodyTextColor: "#4b5563",
    backgroundImageUrl: "",
    overlayColor: "#000000",
    overlayOpacity: 25,
    cardStyle: "normal",
    iconKey: "star"
  };
}
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function TextField({
  label,
  value,
  onInput,
  placeholder = ""
}) {
  return jsxs("label", {
    class: "block",
    children: [jsx("span", {
      class: "block text-sm font-medium text-gray-700",
      children: label
    }), jsx("input", {
      type: "text",
      value,
      placeholder,
      onInput,
      class: "mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
    })]
  });
}
function TextAreaField({
  label,
  value,
  onInput,
  rows = 4
}) {
  return jsxs("label", {
    class: "block",
    children: [jsx("span", {
      class: "block text-sm font-medium text-gray-700",
      children: label
    }), jsx("textarea", {
      value,
      rows,
      onInput,
      class: "mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
    })]
  });
}
function ColorField({
  label,
  value,
  onInput
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
        value,
        onInput,
        class: "h-10 w-12 cursor-pointer rounded border border-gray-300 bg-white p-1"
      }), jsx("input", {
        type: "text",
        value,
        onInput,
        class: "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      })]
    })]
  });
}
function hexToRgb(hex) {
  const normalized = String(hex || "#000000").replace("#", "");
  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value)) {
    return "0, 0, 0";
  }
  return `${value >> 16 & 255}, ${value >> 8 & 255}, ${value & 255}`;
}
function getCardIconPath(iconKey) {
  return CARD_ICON_OPTIONS.find((option) => option.value === iconKey)?.path || CARD_ICON_OPTIONS[0].path;
}
function HowItWorksCardPreview({
  card,
  index
}) {
  const backgroundImage = card.backgroundImagePreviewUrl || card.backgroundImageUrl;
  const overlayAlpha = Number(card.overlayOpacity || 0) / 100;
  const usesImageZoom = card.cardStyle === "imageZoom" && backgroundImage;
  const cardStyle = {
    backgroundColor: card.cardBackgroundColor || "#f9fafb",
    color: card.bodyTextColor || "#4b5563"
  };
  if (backgroundImage && !usesImageZoom) {
    cardStyle.backgroundImage = `linear-gradient(rgba(${hexToRgb(card.overlayColor)}, ${overlayAlpha}), rgba(${hexToRgb(card.overlayColor)}, ${overlayAlpha})), url("${backgroundImage}")`;
    cardStyle.backgroundSize = "cover";
    cardStyle.backgroundPosition = "center";
  }
  return jsxs("div", {
    class: "group relative overflow-hidden rounded-md border border-gray-200 p-4 shadow-sm",
    style: cardStyle,
    children: [usesImageZoom && jsxs(Fragment, {
      children: [jsx("img", {
        src: backgroundImage,
        alt: "",
        class: "absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
      }), jsx("div", {
        class: "absolute inset-0",
        style: {
          backgroundColor: `rgba(${hexToRgb(card.overlayColor)}, ${overlayAlpha})`
        }
      })]
    }), jsxs("div", {
      class: "relative z-10",
      children: [jsx("div", {
        class: "mb-4 flex h-10 w-10 items-center justify-center rounded-md",
        style: {
          backgroundColor: card.accentBackgroundColor || "#dbeafe",
          color: card.accentColor || "#2563eb"
        },
        children: jsx("svg", {
          class: "h-5 w-5",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          xmlns: "http://www.w3.org/2000/svg",
          "aria-hidden": "true",
          children: jsx("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: getCardIconPath(card.iconKey)
          })
        })
      }), jsx("h3", {
        class: "text-lg font-bold",
        style: {
          color: card.titleColor || "#111827"
        },
        children: card.title
      }), jsx("p", {
        class: "mt-2 text-sm leading-6",
        style: {
          color: card.bodyTextColor || "#4b5563"
        },
        children: card.body
      })]
    })]
  });
}
function SectionPreview({
  section
}) {
  const imageSrc = section.imagePreviewUrl || section.imageUrl;
  const hasImage = Boolean(imageSrc);
  const sliderImages = section.sliderImages || [];
  const previewStyle = {
    "--preview-bg": section.backgroundColor || DEFAULT_SECTION.backgroundColor,
    "--preview-bg-to": section.backgroundColorTo || DEFAULT_SECTION.backgroundColorTo,
    "--preview-wave": section.waveColor || DEFAULT_SECTION.waveColor,
    "--preview-heading": section.textColor || DEFAULT_SECTION.textColor,
    "--preview-body": section.bodyTextColor || DEFAULT_SECTION.bodyTextColor
  };
  if (section.style === "verticalSlider") {
    const isHorizontal = section.sliderOrientation === "horizontal";
    return jsxs("div", {
      class: "rounded-md border border-gray-200 p-4",
      style: {
        backgroundColor: section.backgroundColor || "#ffffff"
      },
      children: [jsx("h3", {
        class: "text-lg font-bold",
        style: {
          color: section.textColor
        },
        children: section.title
      }), jsx("p", {
        class: "mt-2 text-sm",
        style: {
          color: section.bodyTextColor
        },
        children: section.body
      }), jsx("div", {
        class: `mt-4 overflow-hidden rounded-md bg-gray-100 ${isHorizontal ? "h-48" : "h-64"}`,
        children: jsx("div", {
          class: `${isHorizontal ? "flex h-full gap-3" : "grid gap-3"} ${section.autoSlide ? isHorizontal ? "animate-[horizontal-preview_8s_linear_infinite]" : "animate-[vertical-preview_8s_linear_infinite]" : ""}`,
          children: sliderImages.length > 0 ? sliderImages.map((image, index) => {
            const slideSrc = image.imagePreviewUrl || image.imageUrl;
            return slideSrc ? jsx("img", {
              src: slideSrc,
              alt: image.imageAlt || `Slide ${index + 1}`,
              class: isHorizontal ? "h-48 w-64 shrink-0 rounded-md object-cover" : "h-36 w-full rounded-md object-cover"
            }, image.id || index) : jsxs("div", {
              class: isHorizontal ? "flex h-48 w-64 shrink-0 items-center justify-center rounded-md bg-gradient-to-r from-blue-400 to-purple-500 text-sm font-semibold text-white" : "flex h-36 items-center justify-center rounded-md bg-gradient-to-r from-blue-400 to-purple-500 text-sm font-semibold text-white",
              children: ["Slide ", index + 1]
            }, image.id || index);
          }) : jsx("div", {
            class: "flex h-36 items-center justify-center rounded-md bg-gray-200 text-sm text-gray-600",
            children: "No slider images"
          })
        })
      }), jsx("style", {
        children: `
          @keyframes vertical-preview {
            0%, 18% { transform: translateY(0); }
            45%, 63% { transform: translateY(-9.75rem); }
            90%, 100% { transform: translateY(0); }
          }
          @keyframes horizontal-preview {
            0%, 18% { transform: translateX(0); }
            45%, 63% { transform: translateX(-17rem); }
            90%, 100% { transform: translateX(0); }
          }
        `
      })]
    });
  }
  if (section.style === "wavy") {
    const wavePosition = section.wavePosition === "bottom" ? "bottom" : "top";
    return jsxs("div", {
      class: `relative overflow-hidden rounded-md border border-gray-200 ${wavePosition === "bottom" ? "pb-10 pt-5" : "pb-6 pt-0"}`,
      style: {
        ...previewStyle,
        background: "linear-gradient(180deg, var(--preview-bg), var(--preview-bg-to))"
      },
      children: [jsx("svg", {
        class: `h-10 w-full ${wavePosition === "bottom" ? "absolute bottom-0 left-0 rotate-180" : "block"}`,
        viewBox: "0 0 1200 120",
        preserveAspectRatio: "none",
        "aria-hidden": "true",
        children: jsx("path", {
          d: "M0,32 C180,86 330,86 520,42 C705,0 835,6 1000,46 C1090,68 1150,70 1200,58 L1200,0 L0,0 Z",
          fill: "var(--preview-wave)"
        })
      }), jsxs("div", {
        class: "relative z-10 px-4 text-center",
        children: [jsx("h3", {
          class: "text-lg font-bold",
          style: {
            color: "var(--preview-heading)"
          },
          children: section.title
        }), jsx("p", {
          class: "mt-2 text-sm",
          style: {
            color: "var(--preview-body)"
          },
          children: section.body
        })]
      })]
    });
  }
  if (section.style === "imageZoom") {
    return jsxs("div", {
      class: "overflow-hidden rounded-md border border-gray-200 bg-white",
      children: [jsx("div", {
        class: "overflow-hidden bg-gray-100",
        children: hasImage ? jsx("img", {
          src: imageSrc,
          alt: section.imageAlt || section.title,
          class: "h-32 w-full object-cover transition duration-500 hover:scale-110"
        }) : jsx("div", {
          class: "h-32 bg-gradient-to-r from-blue-400 to-purple-500"
        })
      }), jsxs("div", {
        class: "p-4",
        style: {
          backgroundColor: section.backgroundColor || "#ffffff"
        },
        children: [jsx("h3", {
          class: "text-lg font-bold",
          style: {
            color: section.textColor
          },
          children: section.title
        }), jsx("p", {
          class: "mt-2 text-sm",
          style: {
            color: section.bodyTextColor
          },
          children: section.body
        })]
      })]
    });
  }
  return jsxs("div", {
    class: "rounded-md border border-gray-200 p-4",
    style: {
      backgroundColor: section.backgroundColor || "#ffffff"
    },
    children: [jsx("h3", {
      class: "text-lg font-bold",
      style: {
        color: section.textColor
      },
      children: section.title
    }), jsx("p", {
      class: "mt-2 text-sm",
      style: {
        color: section.bodyTextColor
      },
      children: section.body
    }), hasImage && jsx("img", {
      src: imageSrc,
      alt: section.imageAlt || section.title,
      class: "mt-4 h-28 w-full rounded object-cover"
    })]
  });
}
function PanelButton({
  active,
  children,
  onClick
}) {
  return jsx("button", {
    type: "button",
    onClick,
    class: `rounded-md px-3 py-2 text-sm font-semibold transition ${active ? "bg-blue-600 text-white shadow-sm" : "bg-white text-gray-700 hover:bg-gray-50"}`,
    children
  });
}
function ListButton({
  active,
  label,
  meta,
  onClick
}) {
  return jsxs("button", {
    type: "button",
    onClick,
    class: `w-full rounded-md border px-3 py-2 text-left transition ${active ? "border-blue-500 bg-blue-50 text-blue-800" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`,
    children: [jsx("span", {
      class: "block truncate text-sm font-semibold",
      children: label
    }), meta && jsx("span", {
      class: "mt-1 block text-xs text-gray-500",
      children: meta
    })]
  });
}
function HomeSectionsAdmin() {
  const [sections, setSections] = useState([]);
  const [howItWorks, setHowItWorks] = useState(DEFAULT_HOW_IT_WORKS);
  const [activePanel, setActivePanel] = useState("how");
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeSliderIndex, setActiveSliderIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const selectedCardIndex = howItWorks.cards[activeCardIndex] ? activeCardIndex : 0;
  const selectedCard = howItWorks.cards[selectedCardIndex];
  const customSectionEntries = sections.map((section, index) => ({
    section,
    index
  })).filter((entry) => entry.section.style !== "verticalSlider");
  const sliderSectionEntries = sections.map((section, index) => ({
    section,
    index
  })).filter((entry) => entry.section.style === "verticalSlider");
  const selectedSectionEntry = customSectionEntries.find((entry) => entry.index === activeSectionIndex) || customSectionEntries[0];
  const selectedSectionIndex = selectedSectionEntry?.index || 0;
  const selectedSection = selectedSectionEntry ? sections[selectedSectionIndex] : null;
  const selectedSliderEntry = sliderSectionEntries.find((entry) => entry.index === activeSliderIndex) || sliderSectionEntries[0];
  const selectedSliderIndex = selectedSliderEntry?.index || 0;
  const selectedSlider = selectedSliderEntry ? sections[selectedSliderIndex] : null;
  useEffect(() => {
    let mounted = true;
    async function loadSections() {
      try {
        const [sectionsResponse, howItWorksResponse] = await Promise.all([fetch("/api/home-sections"), fetch("/api/how-it-works")]);
        const [sectionsData, howItWorksData] = await Promise.all([sectionsResponse.json(), howItWorksResponse.json()]);
        if (mounted) {
          setSections(sectionsData.sections || []);
          setHowItWorks({
            ...DEFAULT_HOW_IT_WORKS,
            ...howItWorksData.config
          });
        }
      } catch (error) {
        if (mounted) {
          setMessage(`Could not load home sections: ${error.message}`);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    loadSections();
    return () => {
      mounted = false;
    };
  }, []);
  const updateSection = (index, field, value) => {
    setSections((current) => {
      const next = [...current];
      next[index] = {
        ...next[index],
        [field]: value
      };
      return next;
    });
  };
  const updateSectionImage = async (index, file) => {
    if (!file) return;
    const imageBase64 = await fileToDataUrl(file);
    setSections((current) => {
      const next = [...current];
      next[index] = {
        ...next[index],
        imageBase64,
        imageFilename: file.name,
        imagePreviewUrl: URL.createObjectURL(file)
      };
      return next;
    });
  };
  const removeSectionImage = (index) => {
    setSections((current) => {
      const next = [...current];
      const section = {
        ...next[index]
      };
      delete section.imageBase64;
      delete section.imageFilename;
      delete section.imagePreviewUrl;
      section.imageUrl = "";
      next[index] = section;
      return next;
    });
  };
  const updateSliderImage = (sectionIndex, imageIndex, field, value) => {
    setSections((current) => {
      const next = [...current];
      const sliderImages = [...next[sectionIndex]?.sliderImages || []];
      sliderImages[imageIndex] = {
        ...sliderImages[imageIndex],
        [field]: value
      };
      next[sectionIndex] = {
        ...next[sectionIndex],
        sliderImages
      };
      return next;
    });
  };
  const updateSliderImageFile = async (sectionIndex, imageIndex, file) => {
    if (!file) return;
    const imageBase64 = await fileToDataUrl(file);
    setSections((current) => {
      const next = [...current];
      const sliderImages = [...next[sectionIndex]?.sliderImages || []];
      sliderImages[imageIndex] = {
        ...sliderImages[imageIndex],
        imageBase64,
        imageFilename: file.name,
        imagePreviewUrl: URL.createObjectURL(file)
      };
      next[sectionIndex] = {
        ...next[sectionIndex],
        sliderImages
      };
      return next;
    });
  };
  const addSliderImage = (sectionIndex) => {
    setSections((current) => {
      const next = [...current];
      const sliderImages = [...next[sectionIndex]?.sliderImages || [], createSliderImage()].slice(0, 12);
      next[sectionIndex] = {
        ...next[sectionIndex],
        sliderImages
      };
      return next;
    });
  };
  const removeSliderImage = (sectionIndex, imageIndex) => {
    setSections((current) => {
      const next = [...current];
      const sliderImages = (next[sectionIndex]?.sliderImages || []).filter((_, index) => index !== imageIndex);
      next[sectionIndex] = {
        ...next[sectionIndex],
        sliderImages
      };
      return next;
    });
  };
  const updateHowItWorksField = (field, value) => {
    setHowItWorks((current) => ({
      ...current,
      [field]: value
    }));
  };
  const updateHowItWorksCard = (index, field, value) => {
    setHowItWorks((current) => {
      const cards = [...current.cards];
      cards[index] = {
        ...cards[index],
        [field]: value
      };
      return {
        ...current,
        cards
      };
    });
  };
  const addHowItWorksCard = () => {
    setHowItWorks((current) => {
      const cards = [...current.cards, createHowItWorksCard()].slice(0, 12);
      setActiveCardIndex(cards.length - 1);
      return {
        ...current,
        cards
      };
    });
    setActivePanel("how");
  };
  const deleteHowItWorksCard = (index) => {
    setHowItWorks((current) => {
      const cards = current.cards.filter((_, cardIndex) => cardIndex !== index);
      setActiveCardIndex(Math.max(0, Math.min(index, cards.length - 1)));
      return {
        ...current,
        cards
      };
    });
  };
  const moveHowItWorksCard = (index, direction) => {
    setHowItWorks((current) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= current.cards.length) return current;
      const cards = [...current.cards];
      const [card] = cards.splice(index, 1);
      cards.splice(targetIndex, 0, card);
      setActiveCardIndex(targetIndex);
      return {
        ...current,
        cards
      };
    });
  };
  const updateHowItWorksCardImage = async (index, file) => {
    if (!file) return;
    const backgroundImageBase64 = await fileToDataUrl(file);
    setHowItWorks((current) => {
      const cards = [...current.cards];
      cards[index] = {
        ...cards[index],
        backgroundImageBase64,
        backgroundImageFilename: file.name,
        backgroundImagePreviewUrl: URL.createObjectURL(file)
      };
      return {
        ...current,
        cards
      };
    });
  };
  const removeHowItWorksCardImage = (index) => {
    setHowItWorks((current) => {
      const cards = [...current.cards];
      const card = {
        ...cards[index]
      };
      delete card.backgroundImageBase64;
      delete card.backgroundImageFilename;
      delete card.backgroundImagePreviewUrl;
      card.backgroundImageUrl = "";
      cards[index] = card;
      return {
        ...current,
        cards
      };
    });
  };
  const addSection = () => {
    setSections((current) => {
      const next = [...current, createSection()].slice(0, 12);
      setActiveSectionIndex(next.length - 1);
      return next;
    });
    setActivePanel("sections");
  };
  const addSliderSection = () => {
    setSections((current) => {
      const next = [...current, createSliderSection()].slice(0, 12);
      setActiveSliderIndex(next.length - 1);
      return next;
    });
    setActivePanel("sliders");
  };
  const deleteSection = (index) => {
    setSections((current) => {
      const next = current.filter((_, sectionIndex) => sectionIndex !== index);
      setActiveSectionIndex(Math.max(0, Math.min(index, next.length - 1)));
      return next;
    });
  };
  const moveSection = (index, direction) => {
    setSections((current) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= current.length) return current;
      const next = [...current];
      const [section] = next.splice(index, 1);
      next.splice(targetIndex, 0, section);
      setActiveSectionIndex(targetIndex);
      return next;
    });
  };
  const saveSections = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("Saving home page sections...");
    try {
      const [sectionsResponse, howItWorksResponse] = await Promise.all([fetch("/api/home-sections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sections
        })
      }), fetch("/api/how-it-works", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          config: howItWorks
        })
      })]);
      const [sectionsData, howItWorksData] = await Promise.all([sectionsResponse.json(), howItWorksResponse.json()]);
      if (!sectionsResponse.ok) {
        throw new Error(sectionsData.error || "Failed to save home sections.");
      }
      if (!howItWorksResponse.ok) {
        throw new Error(howItWorksData.error || "Failed to save How It Works.");
      }
      setSections(sectionsData.sections || []);
      setHowItWorks({
        ...DEFAULT_HOW_IT_WORKS,
        ...howItWorksData.config
      });
      setMessage("Home page sections updated successfully.");
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
        children: "Loading home sections..."
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
            children: "Home Sections Control"
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
            href: "/admin/site",
            class: "inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50",
            children: "Header and Footer"
          }), jsx("a", {
            href: "/",
            class: "inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700",
            children: "View Home"
          })]
        })]
      }), jsxs("form", {
        onSubmit: saveSections,
        class: "space-y-6",
        children: [jsx("div", {
          class: "sticky top-16 z-20 rounded-lg border border-gray-200 bg-white/95 p-4 shadow-sm backdrop-blur",
          children: jsxs("div", {
            class: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
            children: [jsxs("div", {
              class: "flex w-fit rounded-lg bg-gray-100 p-1",
              children: [jsx(PanelButton, {
                active: activePanel === "how",
                onClick: () => setActivePanel("how"),
                children: "How It Works"
              }), jsx(PanelButton, {
                active: activePanel === "sections",
                onClick: () => setActivePanel("sections"),
                children: "Custom Sections"
              }), jsx(PanelButton, {
                active: activePanel === "sliders",
                onClick: () => setActivePanel("sliders"),
                children: "Image Sliders"
              })]
            }), jsxs("div", {
              class: "flex flex-wrap items-center gap-3",
              children: [activePanel === "how" ? jsx("button", {
                type: "button",
                onClick: addHowItWorksCard,
                disabled: howItWorks.cards.length >= 12,
                class: "rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60",
                children: "Add Card"
              }) : activePanel === "sections" ? jsx("button", {
                type: "button",
                onClick: addSection,
                disabled: sections.length >= 12,
                class: "rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60",
                children: "Add Section"
              }) : jsx("button", {
                type: "button",
                onClick: addSliderSection,
                disabled: sections.length >= 12,
                class: "rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60",
                children: "Add Slider"
              }), jsx("button", {
                type: "submit",
                disabled: saving,
                class: "rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60",
                children: saving ? "Saving..." : "Save Changes"
              }), message && jsx("p", {
                class: "text-sm font-medium text-gray-700",
                children: message
              })]
            })]
          })
        }), jsxs("div", {
          class: "grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_380px]",
          children: [jsxs("aside", {
            class: "rounded-lg bg-white p-4 shadow-sm xl:sticky xl:top-40 xl:self-start",
            children: [jsx("h2", {
              class: "text-sm font-semibold uppercase tracking-wide text-gray-500",
              children: activePanel === "how" ? "Cards" : activePanel === "sections" ? "Sections" : "Sliders"
            }), jsx("div", {
              class: "mt-4 grid gap-2",
              children: activePanel === "how" ? howItWorks.cards.length > 0 ? howItWorks.cards.map((card, index) => jsx(ListButton, {
                active: index === selectedCardIndex,
                label: card.title || `Card ${index + 1}`,
                meta: `Card ${index + 1}`,
                onClick: () => setActiveCardIndex(index)
              }, `${card.title}-${index}`)) : jsx("p", {
                class: "rounded-md border border-gray-200 p-4 text-sm text-gray-600",
                children: "No cards yet."
              }) : activePanel === "sections" ? customSectionEntries.length > 0 ? customSectionEntries.map(({
                section,
                index
              }) => jsx(ListButton, {
                active: index === selectedSectionIndex,
                label: section.title || `Section ${index + 1}`,
                meta: STYLE_OPTIONS.find((option) => option.value === section.style)?.label,
                onClick: () => setActiveSectionIndex(index)
              }, section.id || index)) : jsx("p", {
                class: "rounded-md border border-gray-200 p-4 text-sm text-gray-600",
                children: "No sections yet."
              }) : sliderSectionEntries.length > 0 ? sliderSectionEntries.map(({
                section,
                index
              }) => jsx(ListButton, {
                active: index === selectedSliderIndex,
                label: section.title || `Slider ${index + 1}`,
                meta: `${section.sliderImages?.length || 0} images`,
                onClick: () => setActiveSliderIndex(index)
              }, section.id || index)) : jsx("p", {
                class: "rounded-md border border-gray-200 p-4 text-sm text-gray-600",
                children: "No sliders yet."
              })
            })]
          }), jsx("main", {
            class: "rounded-lg bg-white p-6 shadow-sm",
            children: activePanel === "how" ? jsxs("div", {
              class: "space-y-6",
              children: [jsxs("div", {
                class: "grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end",
                children: [jsx(TextField, {
                  label: "Section Heading",
                  value: howItWorks.heading,
                  onInput: (event) => updateHowItWorksField("heading", event.currentTarget.value)
                }), jsxs("div", {
                  class: "flex gap-2",
                  children: [jsx("button", {
                    type: "button",
                    onClick: () => moveHowItWorksCard(selectedCardIndex, -1),
                    disabled: !selectedCard || selectedCardIndex === 0,
                    class: "rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50",
                    children: "Up"
                  }), jsx("button", {
                    type: "button",
                    onClick: () => moveHowItWorksCard(selectedCardIndex, 1),
                    disabled: !selectedCard || selectedCardIndex === howItWorks.cards.length - 1,
                    class: "rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50",
                    children: "Down"
                  }), jsx("button", {
                    type: "button",
                    onClick: () => deleteHowItWorksCard(selectedCardIndex),
                    disabled: !selectedCard,
                    class: "rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50",
                    children: "Delete"
                  })]
                })]
              }), selectedCard ? jsxs("div", {
                class: "grid gap-5",
                children: [jsxs("div", {
                  class: "grid gap-5 md:grid-cols-2",
                  children: [jsx(TextField, {
                    label: "Card Title",
                    value: selectedCard.title,
                    onInput: (event) => updateHowItWorksCard(selectedCardIndex, "title", event.currentTarget.value)
                  }), jsxs("label", {
                    class: "block",
                    children: [jsx("span", {
                      class: "block text-sm font-medium text-gray-700",
                      children: "Card Style"
                    }), jsx("select", {
                      value: selectedCard.cardStyle || "normal",
                      onInput: (event) => updateHowItWorksCard(selectedCardIndex, "cardStyle", event.currentTarget.value),
                      class: "mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100",
                      children: CARD_STYLE_OPTIONS.map((option) => jsx("option", {
                        value: option.value,
                        children: option.label
                      }, option.value))
                    })]
                  }), jsxs("label", {
                    class: "block",
                    children: [jsx("span", {
                      class: "block text-sm font-medium text-gray-700",
                      children: "Card Icon"
                    }), jsx("select", {
                      value: selectedCard.iconKey || "edit",
                      onInput: (event) => updateHowItWorksCard(selectedCardIndex, "iconKey", event.currentTarget.value),
                      class: "mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100",
                      children: CARD_ICON_OPTIONS.map((option) => jsx("option", {
                        value: option.value,
                        children: option.label
                      }, option.value))
                    })]
                  }), jsx(TextField, {
                    label: "Background Image URL",
                    value: selectedCard.backgroundImageUrl,
                    placeholder: "/how-it-works-assets/example.webp",
                    onInput: (event) => updateHowItWorksCard(selectedCardIndex, "backgroundImageUrl", event.currentTarget.value)
                  })]
                }), jsx(TextAreaField, {
                  label: "Card Description",
                  value: selectedCard.body,
                  onInput: (event) => updateHowItWorksCard(selectedCardIndex, "body", event.currentTarget.value)
                }), jsxs("label", {
                  class: "block",
                  children: [jsx("span", {
                    class: "block text-sm font-medium text-gray-700",
                    children: "Upload Background Image"
                  }), jsx("input", {
                    type: "file",
                    accept: "image/*",
                    onChange: (event) => updateHowItWorksCardImage(selectedCardIndex, event.currentTarget.files?.[0]),
                    class: "mt-2 block w-full cursor-pointer rounded-md border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
                  }), (selectedCard.backgroundImageUrl || selectedCard.backgroundImagePreviewUrl) && jsx("button", {
                    type: "button",
                    onClick: () => removeHowItWorksCardImage(selectedCardIndex),
                    class: "mt-3 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50",
                    children: "Remove Background Image"
                  })]
                }), jsxs("div", {
                  class: "grid gap-5 md:grid-cols-2",
                  children: [jsx(ColorField, {
                    label: "Card Background",
                    value: selectedCard.cardBackgroundColor,
                    onInput: (event) => updateHowItWorksCard(selectedCardIndex, "cardBackgroundColor", event.currentTarget.value)
                  }), jsx(ColorField, {
                    label: "Title Color",
                    value: selectedCard.titleColor,
                    onInput: (event) => updateHowItWorksCard(selectedCardIndex, "titleColor", event.currentTarget.value)
                  }), jsx(ColorField, {
                    label: "Body Text Color",
                    value: selectedCard.bodyTextColor,
                    onInput: (event) => updateHowItWorksCard(selectedCardIndex, "bodyTextColor", event.currentTarget.value)
                  }), jsx(ColorField, {
                    label: "Icon Color",
                    value: selectedCard.accentColor,
                    onInput: (event) => updateHowItWorksCard(selectedCardIndex, "accentColor", event.currentTarget.value)
                  }), jsx(ColorField, {
                    label: "Icon Background",
                    value: selectedCard.accentBackgroundColor,
                    onInput: (event) => updateHowItWorksCard(selectedCardIndex, "accentBackgroundColor", event.currentTarget.value)
                  }), jsx(ColorField, {
                    label: "Overlay Color",
                    value: selectedCard.overlayColor,
                    onInput: (event) => updateHowItWorksCard(selectedCardIndex, "overlayColor", event.currentTarget.value)
                  })]
                }), jsxs("label", {
                  class: "block",
                  children: [jsx("span", {
                    class: "block text-sm font-medium text-gray-700",
                    children: "Overlay Opacity"
                  }), jsx("input", {
                    type: "range",
                    min: "0",
                    max: "90",
                    value: selectedCard.overlayOpacity,
                    onInput: (event) => updateHowItWorksCard(selectedCardIndex, "overlayOpacity", Number(event.currentTarget.value)),
                    class: "mt-3 w-full"
                  }), jsxs("span", {
                    class: "mt-1 block text-sm text-gray-600",
                    children: [selectedCard.overlayOpacity, "%"]
                  })]
                })]
              }) : jsxs("div", {
                class: "rounded-md border border-gray-200 p-8 text-center",
                children: [jsx("h3", {
                  class: "text-lg font-semibold text-gray-900",
                  children: "No card selected"
                }), jsx("button", {
                  type: "button",
                  onClick: addHowItWorksCard,
                  class: "mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700",
                  children: "Add Card"
                })]
              })]
            }) : activePanel === "sections" ? jsx("div", {
              class: "space-y-6",
              children: selectedSection ? jsxs(Fragment, {
                children: [jsxs("div", {
                  class: "flex flex-wrap items-center justify-between gap-3",
                  children: [jsx("h2", {
                    class: "text-lg font-semibold text-gray-900",
                    children: "Edit Custom Section"
                  }), jsxs("div", {
                    class: "flex gap-2",
                    children: [jsx("button", {
                      type: "button",
                      onClick: () => moveSection(selectedSectionIndex, -1),
                      disabled: selectedSectionIndex === 0,
                      class: "rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50",
                      children: "Up"
                    }), jsx("button", {
                      type: "button",
                      onClick: () => moveSection(selectedSectionIndex, 1),
                      disabled: selectedSectionIndex === sections.length - 1,
                      class: "rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50",
                      children: "Down"
                    }), jsx("button", {
                      type: "button",
                      onClick: () => deleteSection(selectedSectionIndex),
                      class: "rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50",
                      children: "Delete"
                    })]
                  })]
                }), jsxs("div", {
                  class: "grid gap-5 md:grid-cols-2",
                  children: [jsx(TextField, {
                    label: "Title",
                    value: selectedSection.title,
                    onInput: (event) => updateSection(selectedSectionIndex, "title", event.currentTarget.value)
                  }), jsxs("label", {
                    class: "block",
                    children: [jsx("span", {
                      class: "block text-sm font-medium text-gray-700",
                      children: "Style"
                    }), jsx("select", {
                      value: selectedSection.style,
                      onInput: (event) => updateSection(selectedSectionIndex, "style", event.currentTarget.value),
                      class: "mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100",
                      children: STYLE_OPTIONS.map((option) => jsx("option", {
                        value: option.value,
                        children: option.label
                      }, option.value))
                    })]
                  })]
                }), jsx(TextAreaField, {
                  label: "Body",
                  value: selectedSection.body,
                  onInput: (event) => updateSection(selectedSectionIndex, "body", event.currentTarget.value)
                }), jsxs("div", {
                  class: "grid gap-5 md:grid-cols-2",
                  children: [jsx(TextField, {
                    label: "Image URL",
                    value: selectedSection.imageUrl,
                    placeholder: "/home-section-assets/example.webp",
                    onInput: (event) => updateSection(selectedSectionIndex, "imageUrl", event.currentTarget.value)
                  }), jsx(TextField, {
                    label: "Image Alt Text",
                    value: selectedSection.imageAlt,
                    onInput: (event) => updateSection(selectedSectionIndex, "imageAlt", event.currentTarget.value)
                  })]
                }), jsxs("label", {
                  class: "block",
                  children: [jsx("span", {
                    class: "block text-sm font-medium text-gray-700",
                    children: "Upload Image"
                  }), jsx("input", {
                    type: "file",
                    accept: "image/*",
                    onChange: (event) => updateSectionImage(selectedSectionIndex, event.currentTarget.files?.[0]),
                    class: "mt-2 block w-full cursor-pointer rounded-md border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
                  }), (selectedSection.imageUrl || selectedSection.imagePreviewUrl) && jsx("button", {
                    type: "button",
                    onClick: () => removeSectionImage(selectedSectionIndex),
                    class: "mt-3 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50",
                    children: "Remove Image"
                  })]
                }), jsxs("div", {
                  class: "grid gap-5 md:grid-cols-2",
                  children: [jsx(ColorField, {
                    label: "Background Color",
                    value: selectedSection.backgroundColor || DEFAULT_SECTION.backgroundColor,
                    onInput: (event) => updateSection(selectedSectionIndex, "backgroundColor", event.currentTarget.value)
                  }), jsx(ColorField, {
                    label: "Second Background Color",
                    value: selectedSection.backgroundColorTo || DEFAULT_SECTION.backgroundColorTo,
                    onInput: (event) => updateSection(selectedSectionIndex, "backgroundColorTo", event.currentTarget.value)
                  }), jsx(ColorField, {
                    label: "Wave Color",
                    value: selectedSection.waveColor || DEFAULT_SECTION.waveColor,
                    onInput: (event) => updateSection(selectedSectionIndex, "waveColor", event.currentTarget.value)
                  }), jsxs("label", {
                    class: "block",
                    children: [jsx("span", {
                      class: "block text-sm font-medium text-gray-700",
                      children: "Wave Position"
                    }), jsx("select", {
                      value: selectedSection.wavePosition || DEFAULT_SECTION.wavePosition,
                      onInput: (event) => updateSection(selectedSectionIndex, "wavePosition", event.currentTarget.value),
                      class: "mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100",
                      children: WAVE_POSITION_OPTIONS.map((option) => jsx("option", {
                        value: option.value,
                        children: option.label
                      }, option.value))
                    })]
                  }), jsx(ColorField, {
                    label: "Title Color",
                    value: selectedSection.textColor || DEFAULT_SECTION.textColor,
                    onInput: (event) => updateSection(selectedSectionIndex, "textColor", event.currentTarget.value)
                  }), jsx(ColorField, {
                    label: "Body Text Color",
                    value: selectedSection.bodyTextColor || DEFAULT_SECTION.bodyTextColor,
                    onInput: (event) => updateSection(selectedSectionIndex, "bodyTextColor", event.currentTarget.value)
                  })]
                })]
              }) : jsxs("div", {
                class: "rounded-md border border-gray-200 p-8 text-center",
                children: [jsx("h3", {
                  class: "text-lg font-semibold text-gray-900",
                  children: "No section selected"
                }), jsx("button", {
                  type: "button",
                  onClick: addSection,
                  class: "mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700",
                  children: "Add Section"
                })]
              })
            }) : jsx("div", {
              class: "space-y-6",
              children: selectedSlider ? jsxs(Fragment, {
                children: [jsxs("div", {
                  class: "flex flex-wrap items-center justify-between gap-3",
                  children: [jsx("h2", {
                    class: "text-lg font-semibold text-gray-900",
                    children: "Edit Vertical Image Slider"
                  }), jsxs("div", {
                    class: "flex gap-2",
                    children: [jsx("button", {
                      type: "button",
                      onClick: () => moveSection(selectedSliderIndex, -1),
                      disabled: selectedSliderIndex === 0,
                      class: "rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50",
                      children: "Up"
                    }), jsx("button", {
                      type: "button",
                      onClick: () => moveSection(selectedSliderIndex, 1),
                      disabled: selectedSliderIndex === sections.length - 1,
                      class: "rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50",
                      children: "Down"
                    }), jsx("button", {
                      type: "button",
                      onClick: () => deleteSection(selectedSliderIndex),
                      class: "rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50",
                      children: "Delete"
                    })]
                  })]
                }), jsxs("div", {
                  class: "grid gap-5 md:grid-cols-2",
                  children: [jsx(TextField, {
                    label: "Slider Title",
                    value: selectedSlider.title,
                    onInput: (event) => updateSection(selectedSliderIndex, "title", event.currentTarget.value)
                  }), jsxs("label", {
                    class: "flex items-center gap-3 self-end text-sm font-medium text-gray-700",
                    children: [jsx("input", {
                      type: "checkbox",
                      checked: Boolean(selectedSlider.autoSlide),
                      onInput: (event) => updateSection(selectedSliderIndex, "autoSlide", event.currentTarget.checked),
                      class: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    }), "Auto slide"]
                  }), jsxs("label", {
                    class: "block",
                    children: [jsx("span", {
                      class: "block text-sm font-medium text-gray-700",
                      children: "Slider Style"
                    }), jsx("select", {
                      value: selectedSlider.sliderOrientation || DEFAULT_SECTION.sliderOrientation,
                      onInput: (event) => updateSection(selectedSliderIndex, "sliderOrientation", event.currentTarget.value),
                      class: "mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100",
                      children: SLIDER_ORIENTATION_OPTIONS.map((option) => jsx("option", {
                        value: option.value,
                        children: option.label
                      }, option.value))
                    })]
                  })]
                }), jsx(TextAreaField, {
                  label: "Slider Description",
                  value: selectedSlider.body,
                  onInput: (event) => updateSection(selectedSliderIndex, "body", event.currentTarget.value)
                }), jsxs("div", {
                  class: "grid gap-5 md:grid-cols-2",
                  children: [jsx(ColorField, {
                    label: "Background Color",
                    value: selectedSlider.backgroundColor || DEFAULT_SECTION.backgroundColor,
                    onInput: (event) => updateSection(selectedSliderIndex, "backgroundColor", event.currentTarget.value)
                  }), jsx(ColorField, {
                    label: "Title Color",
                    value: selectedSlider.textColor || DEFAULT_SECTION.textColor,
                    onInput: (event) => updateSection(selectedSliderIndex, "textColor", event.currentTarget.value)
                  }), jsx(ColorField, {
                    label: "Body Text Color",
                    value: selectedSlider.bodyTextColor || DEFAULT_SECTION.bodyTextColor,
                    onInput: (event) => updateSection(selectedSliderIndex, "bodyTextColor", event.currentTarget.value)
                  })]
                }), jsxs("div", {
                  class: "rounded-md border border-gray-200 bg-gray-50 p-4",
                  children: [jsxs("div", {
                    class: "mb-4 flex flex-wrap items-center justify-between gap-3",
                    children: [jsx("h3", {
                      class: "text-sm font-semibold text-gray-900",
                      children: "Slider Images"
                    }), jsx("button", {
                      type: "button",
                      onClick: () => addSliderImage(selectedSliderIndex),
                      disabled: (selectedSlider.sliderImages || []).length >= 12,
                      class: "rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50",
                      children: "Add Image"
                    })]
                  }), jsxs("div", {
                    class: "grid gap-4",
                    children: [(selectedSlider.sliderImages || []).map((image, imageIndex) => jsxs("div", {
                      class: "grid gap-4 rounded-md border border-gray-200 bg-white p-4 md:grid-cols-2",
                      children: [jsx(TextField, {
                        label: `Image ${imageIndex + 1} URL`,
                        value: image.imageUrl,
                        placeholder: "/home-section-assets/example.webp",
                        onInput: (event) => updateSliderImage(selectedSliderIndex, imageIndex, "imageUrl", event.currentTarget.value)
                      }), jsx(TextField, {
                        label: "Click URL",
                        value: image.href,
                        placeholder: "/blog",
                        onInput: (event) => updateSliderImage(selectedSliderIndex, imageIndex, "href", event.currentTarget.value)
                      }), jsx(TextField, {
                        label: "Alt Text",
                        value: image.imageAlt,
                        onInput: (event) => updateSliderImage(selectedSliderIndex, imageIndex, "imageAlt", event.currentTarget.value)
                      }), jsxs("label", {
                        class: "block",
                        children: [jsx("span", {
                          class: "block text-sm font-medium text-gray-700",
                          children: "Upload Image"
                        }), jsx("input", {
                          type: "file",
                          accept: "image/*",
                          onChange: (event) => updateSliderImageFile(selectedSliderIndex, imageIndex, event.currentTarget.files?.[0]),
                          class: "mt-2 block w-full cursor-pointer rounded-md border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
                        })]
                      }), jsx("div", {
                        class: "md:col-span-2",
                        children: jsx("button", {
                          type: "button",
                          onClick: () => removeSliderImage(selectedSliderIndex, imageIndex),
                          class: "rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50",
                          children: "Remove Image"
                        })
                      })]
                    }, image.id || imageIndex)), (selectedSlider.sliderImages || []).length === 0 && jsx("div", {
                      class: "rounded-md border border-gray-200 bg-white p-5 text-center text-sm text-gray-600",
                      children: "No slider images yet."
                    })]
                  })]
                })]
              }) : jsxs("div", {
                class: "rounded-md border border-gray-200 p-8 text-center",
                children: [jsx("h3", {
                  class: "text-lg font-semibold text-gray-900",
                  children: "No slider selected"
                }), jsx("button", {
                  type: "button",
                  onClick: addSliderSection,
                  class: "mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700",
                  children: "Add Slider"
                })]
              })
            })
          }), jsxs("aside", {
            class: "rounded-lg bg-white p-5 shadow-sm xl:sticky xl:top-40 xl:self-start",
            children: [jsx("h2", {
              class: "text-lg font-semibold text-gray-900",
              children: "Live Preview"
            }), jsx("div", {
              class: "mt-4 grid gap-4",
              children: activePanel === "how" ? jsxs("div", {
                class: "rounded-md border border-gray-200 bg-white p-4",
                children: [jsx("h3", {
                  class: "text-center text-xl font-bold text-gray-900",
                  children: howItWorks.heading
                }), jsx("div", {
                  class: "mt-4 grid gap-3",
                  children: howItWorks.cards.length > 0 ? howItWorks.cards.map((card, index) => jsx(HowItWorksCardPreview, {
                    card,
                    index
                  }, `${card.title}-${index}`)) : jsx("div", {
                    class: "rounded-md border border-gray-200 p-4 text-center text-sm text-gray-600",
                    children: "No How It Works cards"
                  })
                })]
              }) : activePanel === "sections" && selectedSection ? jsx(SectionPreview, {
                section: selectedSection
              }) : activePanel === "sliders" && selectedSlider ? jsx(SectionPreview, {
                section: selectedSlider
              }) : jsx("div", {
                class: "rounded-md border border-gray-200 p-5 text-center text-sm text-gray-600",
                children: "No item selected"
              })
            })]
          })]
        })]
      })]
    })
  });
}

const $$HomeSections = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Admin Panel - Home Sections" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "HomeSectionsAdmin", HomeSectionsAdmin, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Ahmed Talal/Desktop/astro-blog/src/components/HomeSectionsAdmin.jsx", "client:component-export": "default" })} ` })}`;
}, "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/admin/home-sections.astro", void 0);

const $$file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/admin/home-sections.astro";
const $$url = "/admin/home-sections";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$HomeSections,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
