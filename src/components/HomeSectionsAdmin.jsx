import { useEffect, useState } from "preact/hooks";

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
  sliderImages: [],
};

const DEFAULT_HOW_IT_WORKS = {
  heading: "How It Works",
  cards: [
    {
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
      iconKey: "edit",
    },
    {
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
      iconKey: "file",
    },
    {
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
      iconKey: "check",
    },
  ],
};

const STYLE_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "wavy", label: "Wavy Background" },
  { value: "imageZoom", label: "Image Zoom on Hover" },
  { value: "verticalSlider", label: "Vertical Image Slider" },
];

const WAVE_POSITION_OPTIONS = [
  { value: "top", label: "Above" },
  { value: "bottom", label: "Down" },
];

const SLIDER_ORIENTATION_OPTIONS = [
  { value: "vertical", label: "Vertical" },
  { value: "horizontal", label: "Horizontal" },
];

const CARD_STYLE_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "imageZoom", label: "Image Zoom on Hover" },
];

const CARD_ICON_OPTIONS = [
  {
    value: "edit",
    label: "Edit",
    path: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  },
  {
    value: "file",
    label: "File",
    path: "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2",
  },
  {
    value: "check",
    label: "Check",
    path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    value: "star",
    label: "Star",
    path: "M11.48 3.499a.562.562 0 011.04 0l2.13 5.18a.563.563 0 00.475.345l5.59.43c.527.04.74.697.338 1.04l-4.262 3.652a.563.563 0 00-.182.557l1.302 5.46a.562.562 0 01-.84.61l-4.793-2.927a.563.563 0 00-.586 0L6.9 20.773a.562.562 0 01-.84-.61l1.302-5.46a.563.563 0 00-.182-.557l-4.262-3.651a.562.562 0 01.338-1.041l5.59-.43a.563.563 0 00.475-.345l2.13-5.18z",
  },
  {
    value: "image",
    label: "Image",
    path: "M3 16.5l4.5-4.5 3 3 4.5-6 6 7.5M4.5 19.5h15A1.5 1.5 0 0021 18V6a1.5 1.5 0 00-1.5-1.5h-15A1.5 1.5 0 003 6v12a1.5 1.5 0 001.5 1.5z",
  },
  {
    value: "rocket",
    label: "Rocket",
    path: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96A14.98 14.98 0 019.63 8.41m0 0a6 6 0 00-7.38 5.84h4.8m2.58-5.84a6 6 0 017.38 5.84m-7.38-5.84L3 21l12.59-6.63",
  },
];

function createSection() {
  return {
    ...DEFAULT_SECTION,
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `section-${Date.now()}`,
  };
}

function createSliderSection() {
  return {
    ...DEFAULT_SECTION,
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `section-${Date.now()}`,
    title: "Vertical Image Slider",
    body: "Add images, links, and auto-slide behavior for this homepage slider.",
    style: "verticalSlider",
    autoSlide: true,
    sliderOrientation: "vertical",
    sliderImages: [createSliderImage()],
  };
}

function createSliderImage() {
  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `slide-${Date.now()}`,
    imageUrl: "",
    imageAlt: "",
    href: "",
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
    iconKey: "star",
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

function TextAreaField({ label, value, onInput, rows = 4 }) {
  return (
    <label class="block">
      <span class="block text-sm font-medium text-gray-700">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onInput={onInput}
        class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function ColorField({ label, value, onInput }) {
  return (
    <label class="block">
      <span class="block text-sm font-medium text-gray-700">{label}</span>
      <div class="mt-2 flex items-center gap-3">
        <input
          type="color"
          value={value}
          onInput={onInput}
          class="h-10 w-12 cursor-pointer rounded border border-gray-300 bg-white p-1"
        />
        <input
          type="text"
          value={value}
          onInput={onInput}
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </label>
  );
}

function hexToRgb(hex) {
  const normalized = String(hex || "#000000").replace("#", "");
  const value = Number.parseInt(normalized, 16);

  if (Number.isNaN(value)) {
    return "0, 0, 0";
  }

  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
}

function getCardIconPath(iconKey) {
  return (
    CARD_ICON_OPTIONS.find((option) => option.value === iconKey)?.path ||
    CARD_ICON_OPTIONS[0].path
  );
}

function HowItWorksCardPreview({ card, index }) {
  const backgroundImage = card.backgroundImagePreviewUrl || card.backgroundImageUrl;
  const overlayAlpha = Number(card.overlayOpacity || 0) / 100;
  const usesImageZoom = card.cardStyle === "imageZoom" && backgroundImage;
  const cardStyle = {
    backgroundColor: card.cardBackgroundColor || "#f9fafb",
    color: card.bodyTextColor || "#4b5563",
  };

  if (backgroundImage && !usesImageZoom) {
    cardStyle.backgroundImage = `linear-gradient(rgba(${hexToRgb(card.overlayColor)}, ${overlayAlpha}), rgba(${hexToRgb(card.overlayColor)}, ${overlayAlpha})), url("${backgroundImage}")`;
    cardStyle.backgroundSize = "cover";
    cardStyle.backgroundPosition = "center";
  }

  return (
    <div class="group relative overflow-hidden rounded-md border border-gray-200 p-4 shadow-sm" style={cardStyle}>
      {usesImageZoom && (
        <>
          <img
            src={backgroundImage}
            alt=""
            class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div
            class="absolute inset-0"
            style={{
              backgroundColor: `rgba(${hexToRgb(card.overlayColor)}, ${overlayAlpha})`,
            }}
          />
        </>
      )}
      <div class="relative z-10">
        <div
          class="mb-4 flex h-10 w-10 items-center justify-center rounded-md"
          style={{
            backgroundColor: card.accentBackgroundColor || "#dbeafe",
            color: card.accentColor || "#2563eb",
          }}
        >
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d={getCardIconPath(card.iconKey)}
            />
          </svg>
        </div>
        <h3 class="text-lg font-bold" style={{ color: card.titleColor || "#111827" }}>
          {card.title}
        </h3>
        <p class="mt-2 text-sm leading-6" style={{ color: card.bodyTextColor || "#4b5563" }}>
          {card.body}
        </p>
      </div>
    </div>
  );
}

function SectionPreview({ section }) {
  const imageSrc = section.imagePreviewUrl || section.imageUrl;
  const hasImage = Boolean(imageSrc);
  const sliderImages = section.sliderImages || [];
  const previewStyle = {
    "--preview-bg": section.backgroundColor || DEFAULT_SECTION.backgroundColor,
    "--preview-bg-to": section.backgroundColorTo || DEFAULT_SECTION.backgroundColorTo,
    "--preview-wave": section.waveColor || DEFAULT_SECTION.waveColor,
    "--preview-heading": section.textColor || DEFAULT_SECTION.textColor,
    "--preview-body": section.bodyTextColor || DEFAULT_SECTION.bodyTextColor,
  };

  if (section.style === "verticalSlider") {
    const isHorizontal = section.sliderOrientation === "horizontal";

    return (
      <div
        class="rounded-md border border-gray-200 p-4"
        style={{ backgroundColor: section.backgroundColor || "#ffffff" }}
      >
        <h3 class="text-lg font-bold" style={{ color: section.textColor }}>
          {section.title}
        </h3>
        <p class="mt-2 text-sm" style={{ color: section.bodyTextColor }}>
          {section.body}
        </p>
        <div
          class={`mt-4 overflow-hidden rounded-md bg-gray-100 ${
            isHorizontal ? "h-48" : "h-64"
          }`}
        >
          <div
            class={`${isHorizontal ? "flex h-full gap-3" : "grid gap-3"} ${
              section.autoSlide
                ? isHorizontal
                  ? "animate-[horizontal-preview_8s_linear_infinite]"
                  : "animate-[vertical-preview_8s_linear_infinite]"
                : ""
            }`}
          >
            {sliderImages.length > 0 ? (
              sliderImages.map((image, index) => {
                const slideSrc = image.imagePreviewUrl || image.imageUrl;
                return slideSrc ? (
                  <img
                    key={image.id || index}
                    src={slideSrc}
                    alt={image.imageAlt || `Slide ${index + 1}`}
                    class={isHorizontal ? "h-48 w-64 shrink-0 rounded-md object-cover" : "h-36 w-full rounded-md object-cover"}
                  />
                ) : (
                  <div
                    key={image.id || index}
                    class={isHorizontal ? "flex h-48 w-64 shrink-0 items-center justify-center rounded-md bg-gradient-to-r from-blue-400 to-purple-500 text-sm font-semibold text-white" : "flex h-36 items-center justify-center rounded-md bg-gradient-to-r from-blue-400 to-purple-500 text-sm font-semibold text-white"}
                  >
                    Slide {index + 1}
                  </div>
                );
              })
            ) : (
              <div class="flex h-36 items-center justify-center rounded-md bg-gray-200 text-sm text-gray-600">
                No slider images
              </div>
            )}
          </div>
        </div>
        <style>{`
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
        `}</style>
      </div>
    );
  }

  if (section.style === "wavy") {
    const wavePosition = section.wavePosition === "bottom" ? "bottom" : "top";

    return (
      <div
        class={`relative overflow-hidden rounded-md border border-gray-200 ${
          wavePosition === "bottom" ? "pb-10 pt-5" : "pb-6 pt-0"
        }`}
        style={{
          ...previewStyle,
          background: "linear-gradient(180deg, var(--preview-bg), var(--preview-bg-to))",
        }}
      >
        <svg
          class={`h-10 w-full ${
            wavePosition === "bottom"
              ? "absolute bottom-0 left-0 rotate-180"
              : "block"
          }`}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,32 C180,86 330,86 520,42 C705,0 835,6 1000,46 C1090,68 1150,70 1200,58 L1200,0 L0,0 Z"
            fill="var(--preview-wave)"
          />
        </svg>
        <div class="relative z-10 px-4 text-center">
          <h3 class="text-lg font-bold" style={{ color: "var(--preview-heading)" }}>
            {section.title}
          </h3>
          <p class="mt-2 text-sm" style={{ color: "var(--preview-body)" }}>
            {section.body}
          </p>
        </div>
      </div>
    );
  }

  if (section.style === "imageZoom") {
    return (
      <div class="overflow-hidden rounded-md border border-gray-200 bg-white">
        <div class="overflow-hidden bg-gray-100">
          {hasImage ? (
            <img
              src={imageSrc}
              alt={section.imageAlt || section.title}
              class="h-32 w-full object-cover transition duration-500 hover:scale-110"
            />
          ) : (
            <div class="h-32 bg-gradient-to-r from-blue-400 to-purple-500" />
          )}
        </div>
        <div class="p-4" style={{ backgroundColor: section.backgroundColor || "#ffffff" }}>
          <h3 class="text-lg font-bold" style={{ color: section.textColor }}>
            {section.title}
          </h3>
          <p class="mt-2 text-sm" style={{ color: section.bodyTextColor }}>
            {section.body}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      class="rounded-md border border-gray-200 p-4"
      style={{ backgroundColor: section.backgroundColor || "#ffffff" }}
    >
      <h3 class="text-lg font-bold" style={{ color: section.textColor }}>
        {section.title}
      </h3>
      <p class="mt-2 text-sm" style={{ color: section.bodyTextColor }}>
        {section.body}
      </p>
      {hasImage && (
        <img
          src={imageSrc}
          alt={section.imageAlt || section.title}
          class="mt-4 h-28 w-full rounded object-cover"
        />
      )}
    </div>
  );
}

function PanelButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      class={`rounded-md px-3 py-2 text-sm font-semibold transition ${
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

function ListButton({ active, label, meta, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      class={`w-full rounded-md border px-3 py-2 text-left transition ${
        active
          ? "border-blue-500 bg-blue-50 text-blue-800"
          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span class="block truncate text-sm font-semibold">{label}</span>
      {meta && <span class="mt-1 block text-xs text-gray-500">{meta}</span>}
    </button>
  );
}

export default function HomeSectionsAdmin() {
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
  const customSectionEntries = sections
    .map((section, index) => ({ section, index }))
    .filter((entry) => entry.section.style !== "verticalSlider");
  const sliderSectionEntries = sections
    .map((section, index) => ({ section, index }))
    .filter((entry) => entry.section.style === "verticalSlider");
  const selectedSectionEntry =
    customSectionEntries.find((entry) => entry.index === activeSectionIndex) ||
    customSectionEntries[0];
  const selectedSectionIndex = selectedSectionEntry?.index || 0;
  const selectedSection = selectedSectionEntry ? sections[selectedSectionIndex] : null;
  const selectedSliderEntry =
    sliderSectionEntries.find((entry) => entry.index === activeSliderIndex) ||
    sliderSectionEntries[0];
  const selectedSliderIndex = selectedSliderEntry?.index || 0;
  const selectedSlider = selectedSliderEntry ? sections[selectedSliderIndex] : null;

  useEffect(() => {
    let mounted = true;

    async function loadSections() {
      try {
        const [sectionsResponse, howItWorksResponse] = await Promise.all([
          fetch("/api/home-sections"),
          fetch("/api/how-it-works"),
        ]);
        const [sectionsData, howItWorksData] = await Promise.all([
          sectionsResponse.json(),
          howItWorksResponse.json(),
        ]);
        if (mounted) {
          setSections(sectionsData.sections || []);
          setHowItWorks({ ...DEFAULT_HOW_IT_WORKS, ...howItWorksData.config });
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
      next[index] = { ...next[index], [field]: value };
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
        imagePreviewUrl: URL.createObjectURL(file),
      };
      return next;
    });
  };

  const removeSectionImage = (index) => {
    setSections((current) => {
      const next = [...current];
      const section = { ...next[index] };
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
      const sliderImages = [...(next[sectionIndex]?.sliderImages || [])];
      sliderImages[imageIndex] = { ...sliderImages[imageIndex], [field]: value };
      next[sectionIndex] = { ...next[sectionIndex], sliderImages };
      return next;
    });
  };

  const updateSliderImageFile = async (sectionIndex, imageIndex, file) => {
    if (!file) return;

    const imageBase64 = await fileToDataUrl(file);
    setSections((current) => {
      const next = [...current];
      const sliderImages = [...(next[sectionIndex]?.sliderImages || [])];
      sliderImages[imageIndex] = {
        ...sliderImages[imageIndex],
        imageBase64,
        imageFilename: file.name,
        imagePreviewUrl: URL.createObjectURL(file),
      };
      next[sectionIndex] = { ...next[sectionIndex], sliderImages };
      return next;
    });
  };

  const addSliderImage = (sectionIndex) => {
    setSections((current) => {
      const next = [...current];
      const sliderImages = [...(next[sectionIndex]?.sliderImages || []), createSliderImage()].slice(0, 12);
      next[sectionIndex] = { ...next[sectionIndex], sliderImages };
      return next;
    });
  };

  const removeSliderImage = (sectionIndex, imageIndex) => {
    setSections((current) => {
      const next = [...current];
      const sliderImages = (next[sectionIndex]?.sliderImages || []).filter(
        (_, index) => index !== imageIndex,
      );
      next[sectionIndex] = { ...next[sectionIndex], sliderImages };
      return next;
    });
  };

  const updateHowItWorksField = (field, value) => {
    setHowItWorks((current) => ({ ...current, [field]: value }));
  };

  const updateHowItWorksCard = (index, field, value) => {
    setHowItWorks((current) => {
      const cards = [...current.cards];
      cards[index] = { ...cards[index], [field]: value };
      return { ...current, cards };
    });
  };

  const addHowItWorksCard = () => {
    setHowItWorks((current) => {
      const cards = [...current.cards, createHowItWorksCard()].slice(0, 12);
      setActiveCardIndex(cards.length - 1);
      return { ...current, cards };
    });
    setActivePanel("how");
  };

  const deleteHowItWorksCard = (index) => {
    setHowItWorks((current) => {
      const cards = current.cards.filter((_, cardIndex) => cardIndex !== index);
      setActiveCardIndex(Math.max(0, Math.min(index, cards.length - 1)));
      return { ...current, cards };
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
      return { ...current, cards };
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
        backgroundImagePreviewUrl: URL.createObjectURL(file),
      };
      return { ...current, cards };
    });
  };

  const removeHowItWorksCardImage = (index) => {
    setHowItWorks((current) => {
      const cards = [...current.cards];
      const card = { ...cards[index] };
      delete card.backgroundImageBase64;
      delete card.backgroundImageFilename;
      delete card.backgroundImagePreviewUrl;
      card.backgroundImageUrl = "";
      cards[index] = card;
      return { ...current, cards };
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
      const [sectionsResponse, howItWorksResponse] = await Promise.all([
        fetch("/api/home-sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sections }),
        }),
        fetch("/api/how-it-works", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ config: howItWorks }),
        }),
      ]);
      const [sectionsData, howItWorksData] = await Promise.all([
        sectionsResponse.json(),
        howItWorksResponse.json(),
      ]);

      if (!sectionsResponse.ok) {
        throw new Error(sectionsData.error || "Failed to save home sections.");
      }

      if (!howItWorksResponse.ok) {
        throw new Error(howItWorksData.error || "Failed to save How It Works.");
      }

      setSections(sectionsData.sections || []);
      setHowItWorks({ ...DEFAULT_HOW_IT_WORKS, ...howItWorksData.config });
      setMessage("Home page sections updated successfully.");
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
          Loading home sections...
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
              Home Sections Control
            </h1>
          </div>
        </div>

        <form onSubmit={saveSections} class="space-y-6">
          <div class="sticky top-16 z-20 rounded-lg border border-gray-200 bg-white/95 p-4 shadow-sm backdrop-blur">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div class="flex w-fit rounded-lg bg-gray-100 p-1">
                <PanelButton
                  active={activePanel === "how"}
                  onClick={() => setActivePanel("how")}
                >
                  How It Works
                </PanelButton>
                <PanelButton
                  active={activePanel === "sections"}
                  onClick={() => setActivePanel("sections")}
                >
                  Custom Sections
                </PanelButton>
                <PanelButton
                  active={activePanel === "sliders"}
                  onClick={() => setActivePanel("sliders")}
                >
                  Image Sliders
                </PanelButton>
              </div>
              <div class="flex flex-wrap items-center gap-3">
                {activePanel === "how" ? (
                  <button
                    type="button"
                    onClick={addHowItWorksCard}
                    disabled={howItWorks.cards.length >= 12}
                    class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Add Card
                  </button>
                ) : activePanel === "sections" ? (
                  <button
                    type="button"
                    onClick={addSection}
                    disabled={sections.length >= 12}
                    class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Add Section
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={addSliderSection}
                    disabled={sections.length >= 12}
                    class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Add Slider
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  class="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                {message && <p class="text-sm font-medium text-gray-700">{message}</p>}
              </div>
            </div>
          </div>

          <div class="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_380px]">
            <aside class="rounded-lg bg-white p-4 shadow-sm xl:sticky xl:top-40 xl:self-start">
              <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500">
                {activePanel === "how" ? "Cards" : activePanel === "sections" ? "Sections" : "Sliders"}
              </h2>
              <div class="mt-4 grid gap-2">
                {activePanel === "how" ? (
                  howItWorks.cards.length > 0 ? (
                    howItWorks.cards.map((card, index) => (
                      <ListButton
                        key={`${card.title}-${index}`}
                        active={index === selectedCardIndex}
                        label={card.title || `Card ${index + 1}`}
                        meta={`Card ${index + 1}`}
                        onClick={() => setActiveCardIndex(index)}
                      />
                    ))
                  ) : (
                    <p class="rounded-md border border-gray-200 p-4 text-sm text-gray-600">
                      No cards yet.
                    </p>
                  )
                ) : activePanel === "sections" ? (
                  customSectionEntries.length > 0 ? (
                  customSectionEntries.map(({ section, index }) => (
                    <ListButton
                      key={section.id || index}
                      active={index === selectedSectionIndex}
                      label={section.title || `Section ${index + 1}`}
                      meta={STYLE_OPTIONS.find((option) => option.value === section.style)?.label}
                      onClick={() => setActiveSectionIndex(index)}
                    />
                  ))
                ) : (
                  <p class="rounded-md border border-gray-200 p-4 text-sm text-gray-600">
                    No sections yet.
                  </p>
                  )
                ) : sliderSectionEntries.length > 0 ? (
                  sliderSectionEntries.map(({ section, index }) => (
                    <ListButton
                      key={section.id || index}
                      active={index === selectedSliderIndex}
                      label={section.title || `Slider ${index + 1}`}
                      meta={`${section.sliderImages?.length || 0} images`}
                      onClick={() => setActiveSliderIndex(index)}
                    />
                  ))
                ) : (
                  <p class="rounded-md border border-gray-200 p-4 text-sm text-gray-600">
                    No sliders yet.
                  </p>
                )}
              </div>
            </aside>

            <main class="rounded-lg bg-white p-6 shadow-sm">
              {activePanel === "how" ? (
                <div class="space-y-6">
                  <div class="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                    <TextField
                      label="Section Heading"
                      value={howItWorks.heading}
                      onInput={(event) =>
                        updateHowItWorksField("heading", event.currentTarget.value)
                      }
                    />
                    <div class="flex gap-2">
                      <button
                        type="button"
                        onClick={() => moveHowItWorksCard(selectedCardIndex, -1)}
                        disabled={!selectedCard || selectedCardIndex === 0}
                        class="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() => moveHowItWorksCard(selectedCardIndex, 1)}
                        disabled={!selectedCard || selectedCardIndex === howItWorks.cards.length - 1}
                        class="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Down
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteHowItWorksCard(selectedCardIndex)}
                        disabled={!selectedCard}
                        class="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {selectedCard ? (
                    <div class="grid gap-5">
                      <div class="grid gap-5 md:grid-cols-2">
                        <TextField
                          label="Card Title"
                          value={selectedCard.title}
                          onInput={(event) =>
                            updateHowItWorksCard(selectedCardIndex, "title", event.currentTarget.value)
                          }
                        />
                        <label class="block">
                          <span class="block text-sm font-medium text-gray-700">
                            Card Style
                          </span>
                          <select
                            value={selectedCard.cardStyle || "normal"}
                            onInput={(event) =>
                              updateHowItWorksCard(
                                selectedCardIndex,
                                "cardStyle",
                                event.currentTarget.value,
                              )
                            }
                            class="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            {CARD_STYLE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label class="block">
                          <span class="block text-sm font-medium text-gray-700">
                            Card Icon
                          </span>
                          <select
                            value={selectedCard.iconKey || "edit"}
                            onInput={(event) =>
                              updateHowItWorksCard(
                                selectedCardIndex,
                                "iconKey",
                                event.currentTarget.value,
                              )
                            }
                            class="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            {CARD_ICON_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <TextField
                          label="Background Image URL"
                          value={selectedCard.backgroundImageUrl}
                          placeholder="/how-it-works-assets/example.webp"
                          onInput={(event) =>
                            updateHowItWorksCard(
                              selectedCardIndex,
                              "backgroundImageUrl",
                              event.currentTarget.value,
                            )
                          }
                        />
                      </div>
                      <TextAreaField
                        label="Card Description"
                        value={selectedCard.body}
                        onInput={(event) =>
                          updateHowItWorksCard(selectedCardIndex, "body", event.currentTarget.value)
                        }
                      />
                      <label class="block">
                        <span class="block text-sm font-medium text-gray-700">
                          Upload Background Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            updateHowItWorksCardImage(
                              selectedCardIndex,
                              event.currentTarget.files?.[0],
                            )
                          }
                          class="mt-2 block w-full cursor-pointer rounded-md border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
                        />
                        {(selectedCard.backgroundImageUrl ||
                          selectedCard.backgroundImagePreviewUrl) && (
                          <button
                            type="button"
                            onClick={() => removeHowItWorksCardImage(selectedCardIndex)}
                            class="mt-3 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                          >
                            Remove Background Image
                          </button>
                        )}
                      </label>
                      <div class="grid gap-5 md:grid-cols-2">
                        <ColorField
                          label="Card Background"
                          value={selectedCard.cardBackgroundColor}
                          onInput={(event) =>
                            updateHowItWorksCard(
                              selectedCardIndex,
                              "cardBackgroundColor",
                              event.currentTarget.value,
                            )
                          }
                        />
                        <ColorField
                          label="Title Color"
                          value={selectedCard.titleColor}
                          onInput={(event) =>
                            updateHowItWorksCard(selectedCardIndex, "titleColor", event.currentTarget.value)
                          }
                        />
                        <ColorField
                          label="Body Text Color"
                          value={selectedCard.bodyTextColor}
                          onInput={(event) =>
                            updateHowItWorksCard(
                              selectedCardIndex,
                              "bodyTextColor",
                              event.currentTarget.value,
                            )
                          }
                        />
                        <ColorField
                          label="Icon Color"
                          value={selectedCard.accentColor}
                          onInput={(event) =>
                            updateHowItWorksCard(selectedCardIndex, "accentColor", event.currentTarget.value)
                          }
                        />
                        <ColorField
                          label="Icon Background"
                          value={selectedCard.accentBackgroundColor}
                          onInput={(event) =>
                            updateHowItWorksCard(
                              selectedCardIndex,
                              "accentBackgroundColor",
                              event.currentTarget.value,
                            )
                          }
                        />
                        <ColorField
                          label="Overlay Color"
                          value={selectedCard.overlayColor}
                          onInput={(event) =>
                            updateHowItWorksCard(selectedCardIndex, "overlayColor", event.currentTarget.value)
                          }
                        />
                      </div>
                      <label class="block">
                        <span class="block text-sm font-medium text-gray-700">
                          Overlay Opacity
                        </span>
                        <input
                          type="range"
                          min="0"
                          max="90"
                          value={selectedCard.overlayOpacity}
                          onInput={(event) =>
                            updateHowItWorksCard(
                              selectedCardIndex,
                              "overlayOpacity",
                              Number(event.currentTarget.value),
                            )
                          }
                          class="mt-3 w-full"
                        />
                        <span class="mt-1 block text-sm text-gray-600">
                          {selectedCard.overlayOpacity}%
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div class="rounded-md border border-gray-200 p-8 text-center">
                      <h3 class="text-lg font-semibold text-gray-900">No card selected</h3>
                      <button
                        type="button"
                        onClick={addHowItWorksCard}
                        class="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Add Card
                      </button>
                    </div>
                  )}
                </div>
              ) : activePanel === "sections" ? (
                <div class="space-y-6">
                  {selectedSection ? (
                    <>
                      <div class="flex flex-wrap items-center justify-between gap-3">
                        <h2 class="text-lg font-semibold text-gray-900">
                          Edit Custom Section
                        </h2>
                        <div class="flex gap-2">
                          <button
                            type="button"
                            onClick={() => moveSection(selectedSectionIndex, -1)}
                            disabled={selectedSectionIndex === 0}
                            class="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Up
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSection(selectedSectionIndex, 1)}
                            disabled={selectedSectionIndex === sections.length - 1}
                            class="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Down
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSection(selectedSectionIndex)}
                            class="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div class="grid gap-5 md:grid-cols-2">
                        <TextField
                          label="Title"
                          value={selectedSection.title}
                          onInput={(event) =>
                            updateSection(selectedSectionIndex, "title", event.currentTarget.value)
                          }
                        />
                        <label class="block">
                          <span class="block text-sm font-medium text-gray-700">
                            Style
                          </span>
                          <select
                            value={selectedSection.style}
                            onInput={(event) =>
                              updateSection(selectedSectionIndex, "style", event.currentTarget.value)
                            }
                            class="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            {STYLE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <TextAreaField
                        label="Body"
                        value={selectedSection.body}
                        onInput={(event) =>
                          updateSection(selectedSectionIndex, "body", event.currentTarget.value)
                        }
                      />
                      <div class="grid gap-5 md:grid-cols-2">
                        <TextField
                          label="Image URL"
                          value={selectedSection.imageUrl}
                          placeholder="/home-section-assets/example.webp"
                          onInput={(event) =>
                            updateSection(selectedSectionIndex, "imageUrl", event.currentTarget.value)
                          }
                        />
                        <TextField
                          label="Image Alt Text"
                          value={selectedSection.imageAlt}
                          onInput={(event) =>
                            updateSection(selectedSectionIndex, "imageAlt", event.currentTarget.value)
                          }
                        />
                      </div>
                      <label class="block">
                        <span class="block text-sm font-medium text-gray-700">
                          Upload Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            updateSectionImage(
                              selectedSectionIndex,
                              event.currentTarget.files?.[0],
                            )
                          }
                          class="mt-2 block w-full cursor-pointer rounded-md border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
                        />
                        {(selectedSection.imageUrl || selectedSection.imagePreviewUrl) && (
                          <button
                            type="button"
                            onClick={() => removeSectionImage(selectedSectionIndex)}
                            class="mt-3 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                          >
                            Remove Image
                          </button>
                        )}
                      </label>
                      <div class="grid gap-5 md:grid-cols-2">
                        <ColorField
                          label="Background Color"
                          value={selectedSection.backgroundColor || DEFAULT_SECTION.backgroundColor}
                          onInput={(event) =>
                            updateSection(selectedSectionIndex, "backgroundColor", event.currentTarget.value)
                          }
                        />
                        <ColorField
                          label="Second Background Color"
                          value={selectedSection.backgroundColorTo || DEFAULT_SECTION.backgroundColorTo}
                          onInput={(event) =>
                            updateSection(selectedSectionIndex, "backgroundColorTo", event.currentTarget.value)
                          }
                        />
                        <ColorField
                          label="Wave Color"
                          value={selectedSection.waveColor || DEFAULT_SECTION.waveColor}
                          onInput={(event) =>
                            updateSection(selectedSectionIndex, "waveColor", event.currentTarget.value)
                          }
                        />
                        <label class="block">
                          <span class="block text-sm font-medium text-gray-700">
                            Wave Position
                          </span>
                          <select
                            value={selectedSection.wavePosition || DEFAULT_SECTION.wavePosition}
                            onInput={(event) =>
                              updateSection(selectedSectionIndex, "wavePosition", event.currentTarget.value)
                            }
                            class="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            {WAVE_POSITION_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <ColorField
                          label="Title Color"
                          value={selectedSection.textColor || DEFAULT_SECTION.textColor}
                          onInput={(event) =>
                            updateSection(selectedSectionIndex, "textColor", event.currentTarget.value)
                          }
                        />
                        <ColorField
                          label="Body Text Color"
                          value={selectedSection.bodyTextColor || DEFAULT_SECTION.bodyTextColor}
                          onInput={(event) =>
                            updateSection(selectedSectionIndex, "bodyTextColor", event.currentTarget.value)
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <div class="rounded-md border border-gray-200 p-8 text-center">
                      <h3 class="text-lg font-semibold text-gray-900">No section selected</h3>
                      <button
                        type="button"
                        onClick={addSection}
                        class="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Add Section
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div class="space-y-6">
                  {selectedSlider ? (
                    <>
                      <div class="flex flex-wrap items-center justify-between gap-3">
                        <h2 class="text-lg font-semibold text-gray-900">
                          Edit Vertical Image Slider
                        </h2>
                        <div class="flex gap-2">
                          <button
                            type="button"
                            onClick={() => moveSection(selectedSliderIndex, -1)}
                            disabled={selectedSliderIndex === 0}
                            class="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Up
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSection(selectedSliderIndex, 1)}
                            disabled={selectedSliderIndex === sections.length - 1}
                            class="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Down
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSection(selectedSliderIndex)}
                            class="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div class="grid gap-5 md:grid-cols-2">
                        <TextField
                          label="Slider Title"
                          value={selectedSlider.title}
                          onInput={(event) =>
                            updateSection(selectedSliderIndex, "title", event.currentTarget.value)
                          }
                        />
                        <label class="flex items-center gap-3 self-end text-sm font-medium text-gray-700">
                          <input
                            type="checkbox"
                            checked={Boolean(selectedSlider.autoSlide)}
                            onInput={(event) =>
                              updateSection(selectedSliderIndex, "autoSlide", event.currentTarget.checked)
                            }
                            class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          Auto slide
                        </label>
                        <label class="block">
                          <span class="block text-sm font-medium text-gray-700">
                            Slider Style
                          </span>
                          <select
                            value={selectedSlider.sliderOrientation || DEFAULT_SECTION.sliderOrientation}
                            onInput={(event) =>
                              updateSection(
                                selectedSliderIndex,
                                "sliderOrientation",
                                event.currentTarget.value,
                              )
                            }
                            class="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            {SLIDER_ORIENTATION_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <TextAreaField
                        label="Slider Description"
                        value={selectedSlider.body}
                        onInput={(event) =>
                          updateSection(selectedSliderIndex, "body", event.currentTarget.value)
                        }
                      />
                      <div class="grid gap-5 md:grid-cols-2">
                        <ColorField
                          label="Background Color"
                          value={selectedSlider.backgroundColor || DEFAULT_SECTION.backgroundColor}
                          onInput={(event) =>
                            updateSection(selectedSliderIndex, "backgroundColor", event.currentTarget.value)
                          }
                        />
                        <ColorField
                          label="Title Color"
                          value={selectedSlider.textColor || DEFAULT_SECTION.textColor}
                          onInput={(event) =>
                            updateSection(selectedSliderIndex, "textColor", event.currentTarget.value)
                          }
                        />
                        <ColorField
                          label="Body Text Color"
                          value={selectedSlider.bodyTextColor || DEFAULT_SECTION.bodyTextColor}
                          onInput={(event) =>
                            updateSection(selectedSliderIndex, "bodyTextColor", event.currentTarget.value)
                          }
                        />
                      </div>
                      <div class="rounded-md border border-gray-200 bg-gray-50 p-4">
                        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
                          <h3 class="text-sm font-semibold text-gray-900">Slider Images</h3>
                          <button
                            type="button"
                            onClick={() => addSliderImage(selectedSliderIndex)}
                            disabled={(selectedSlider.sliderImages || []).length >= 12}
                            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Add Image
                          </button>
                        </div>
                        <div class="grid gap-4">
                          {(selectedSlider.sliderImages || []).map((image, imageIndex) => (
                            <div
                              key={image.id || imageIndex}
                              class="grid gap-4 rounded-md border border-gray-200 bg-white p-4 md:grid-cols-2"
                            >
                              <TextField
                                label={`Image ${imageIndex + 1} URL`}
                                value={image.imageUrl}
                                placeholder="/home-section-assets/example.webp"
                                onInput={(event) =>
                                  updateSliderImage(
                                    selectedSliderIndex,
                                    imageIndex,
                                    "imageUrl",
                                    event.currentTarget.value,
                                  )
                                }
                              />
                              <TextField
                                label="Click URL"
                                value={image.href}
                                placeholder="/blog"
                                onInput={(event) =>
                                  updateSliderImage(
                                    selectedSliderIndex,
                                    imageIndex,
                                    "href",
                                    event.currentTarget.value,
                                  )
                                }
                              />
                              <TextField
                                label="Alt Text"
                                value={image.imageAlt}
                                onInput={(event) =>
                                  updateSliderImage(
                                    selectedSliderIndex,
                                    imageIndex,
                                    "imageAlt",
                                    event.currentTarget.value,
                                  )
                                }
                              />
                              <label class="block">
                                <span class="block text-sm font-medium text-gray-700">
                                  Upload Image
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(event) =>
                                    updateSliderImageFile(
                                      selectedSliderIndex,
                                      imageIndex,
                                      event.currentTarget.files?.[0],
                                    )
                                  }
                                  class="mt-2 block w-full cursor-pointer rounded-md border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
                                />
                              </label>
                              <div class="md:col-span-2">
                                <button
                                  type="button"
                                  onClick={() => removeSliderImage(selectedSliderIndex, imageIndex)}
                                  class="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                                >
                                  Remove Image
                                </button>
                              </div>
                            </div>
                          ))}
                          {(selectedSlider.sliderImages || []).length === 0 && (
                            <div class="rounded-md border border-gray-200 bg-white p-5 text-center text-sm text-gray-600">
                              No slider images yet.
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div class="rounded-md border border-gray-200 p-8 text-center">
                      <h3 class="text-lg font-semibold text-gray-900">No slider selected</h3>
                      <button
                        type="button"
                        onClick={addSliderSection}
                        class="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Add Slider
                      </button>
                    </div>
                  )}
                </div>
              )}
            </main>

            <aside class="rounded-lg bg-white p-5 shadow-sm xl:sticky xl:top-40 xl:self-start">
              <h2 class="text-lg font-semibold text-gray-900">Live Preview</h2>
              <div class="mt-4 grid gap-4">
                {activePanel === "how" ? (
                  <div class="rounded-md border border-gray-200 bg-white p-4">
                    <h3 class="text-center text-xl font-bold text-gray-900">
                      {howItWorks.heading}
                    </h3>
                    <div class="mt-4 grid gap-3">
                      {howItWorks.cards.length > 0 ? (
                        howItWorks.cards.map((card, index) => (
                          <HowItWorksCardPreview
                            key={`${card.title}-${index}`}
                            card={card}
                            index={index}
                          />
                        ))
                      ) : (
                        <div class="rounded-md border border-gray-200 p-4 text-center text-sm text-gray-600">
                          No How It Works cards
                        </div>
                      )}
                    </div>
                  </div>
                ) : activePanel === "sections" && selectedSection ? (
                  <SectionPreview section={selectedSection} />
                ) : activePanel === "sliders" && selectedSlider ? (
                  <SectionPreview section={selectedSlider} />
                ) : (
                  <div class="rounded-md border border-gray-200 p-5 text-center text-sm text-gray-600">
                    No item selected
                  </div>
                )}
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}
