(() => {
  const storageKey = "adminArabicContentMode";
  const root = document.documentElement;
  const body = document.body;
  const toggle = document.getElementById("admin-arabic-toggle");
  const textNodeOriginals = new WeakMap();
  const attributeOriginals = new WeakMap();
  const managedSelector = [
    "textarea",
    "input:not([type])",
    'input[type="text"]',
    'input[type="search"]',
    'input[type="email"]',
    'input[type="tel"]',
  ].join(",");
  const technicalNamePattern = /(href|url|color|image|file|icon|logo|opacity|order)/i;

  const translations = new Map(
    Object.entries({
      "Admin Control Center": "مركز التحكم",
      "Website Controls": "إعدادات الموقع",
      "Move through the admin pages in order: write content, tune the home page, then adjust the site chrome.": "تنقل بين صفحات الإدارة: اكتب المحتوى، عدل الصفحة الرئيسية، ثم اضبط رأس وتذييل الموقع.",
      "Arabic Content: Off": "المحتوى العربي: إيقاف",
      "Arabic Content: On": "المحتوى العربي: تشغيل",
      "View Site": "عرض الموقع",
      "Logout": "تسجيل الخروج",
      "Blog Editor": "محرر المقالات",
      "Create and manage posts": "إنشاء وإدارة المقالات",
      "Hero": "البطل",
      "Homepage first section": "القسم الأول في الرئيسية",
      "Pages": "الصفحات",
      "Markdown and galleries": "ماركداون ومعارض الصور",
      "Home Sections": "أقسام الرئيسية",
      "Cards, sections, sliders": "البطاقات والأقسام والسلايدر",
      "Gallery": "المعرض",
      "Thumbnail and images": "الصورة المصغرة والصور",
      "Header & Footer": "الرأس والتذييل",
      "Brand and navigation": "الهوية والتنقل",
      "Password": "كلمة المرور",
      "Admin sign-in security": "أمان تسجيل دخول الإدارة",
      "Security": "الأمان",
      "Change Admin Password": "تغيير كلمة مرور الإدارة",
      "Current Password": "كلمة المرور الحالية",
      "New Password": "كلمة المرور الجديدة",
      "Confirm New Password": "تأكيد كلمة المرور الجديدة",
      "Update Password": "تحديث كلمة المرور",
      "Updating...": "جاري التحديث...",
      "Admin": "الإدارة",
      "Blog Editor Control Panel": "لوحة تحكم محرر المقالات",
      "Create and edit markdown blog posts saved to": "إنشاء وتعديل مقالات ماركداون محفوظة في",
      "Edit Post": "تعديل المقال",
      "Create New Post": "إنشاء مقال جديد",
      "Post Title": "عنوان المقال",
      "Content Language": "لغة المحتوى",
      "The saved post page will use this direction and language.": "ستستخدم صفحة المقال المحفوظة هذا الاتجاه وهذه اللغة.",
      "Filename": "اسم الملف",
      "Markdown filename": "اسم ملف ماركداون",
      "Hashtags": "الوسوم",
      "Featured Image (Optional)": "الصورة الرئيسية (اختياري)",
      "Markdown Content": "محتوى ماركداون",
      "Write": "كتابة",
      "Split": "تقسيم",
      "Preview": "معاينة",
      "Insert": "إدراج",
      "Save Post": "حفظ المقال",
      "Update": "تحديث",
      "Open Post": "فتح المقال",
      "Clear": "مسح",
      "Existing Blog Posts": "المقالات الحالية",
      "Refresh": "تحديث",
      "Loading posts...": "جاري تحميل المقالات...",
      "No blog posts yet. Create your first post using the editor.": "لا توجد مقالات بعد. أنشئ أول مقال من المحرر.",
      "Page Control": "لوحة تحكم الصفحات",
      "Create standalone markdown pages outside the blog posts folder.": "إنشاء صفحات ماركداون مستقلة خارج مجلد المقالات.",
      "New Page": "صفحة جديدة",
      "Save Page": "حفظ الصفحة",
      "Update Page": "تحديث الصفحة",
      "Page title": "عنوان الصفحة",
      "Page type": "نوع الصفحة",
      "Normal markdown page": "صفحة ماركداون عادية",
      "Image gallery page": "صفحة معرض صور",
      "Description": "الوصف",
      "Open Page": "فتح الصفحة",
      "Gallery Images": "صور المعرض",
      "Add Images": "إضافة صور",
      "No gallery images yet.": "لا توجد صور في المعرض بعد.",
      "Standalone Pages": "الصفحات المستقلة",
      "Loading pages...": "جاري تحميل الصفحات...",
      "No standalone pages yet.": "لا توجد صفحات مستقلة بعد.",
      "Hero Section Control": "لوحة تحكم قسم البطل",
      "Page SEO": "تحسين محركات البحث",
      "Page Title": "عنوان الصفحة",
      "Meta Description": "وصف الميتا",
      "Words": "النصوص",
      "Title": "العنوان",
      "Subtitle": "العنوان الفرعي",
      "Main Button Text": "نص الزر الرئيسي",
      "Main Button Link": "رابط الزر الرئيسي",
      "Second Button Text": "نص الزر الثاني",
      "Second Button Link": "رابط الزر الثاني",
      "Background": "الخلفية",
      "Live Preview": "المعاينة المباشرة",
      "Save Hero Settings": "حفظ إعدادات البطل",
      "Reset Defaults": "استعادة الافتراضي",
      "Gallery Control": "لوحة تحكم المعرض",
      "Gallery Details": "تفاصيل المعرض",
      "Gallery title": "عنوان المعرض",
      "Gallery description": "وصف المعرض",
      "Gallery Thumbnail": "الصورة المصغرة للمعرض",
      "Thumbnail alt text": "النص البديل للصورة المصغرة",
      "Upload thumbnail": "رفع صورة مصغرة",
      "Remove Thumbnail": "إزالة الصورة المصغرة",
      "Images": "الصور",
      "Add More Images": "إضافة صور أخرى",
      "Header and Footer Control": "لوحة تحكم الرأس والتذييل",
      "Brand": "الهوية",
      "Brand Name Text": "نص اسم العلامة",
      "Brand Name Color": "لون اسم العلامة",
      "Logo Image": "صورة الشعار",
      "Site Icon": "أيقونة الموقع",
      "Header Style": "تنسيق الرأس",
      "Header Text": "نص الرأس",
      "Link Color": "لون الرابط",
      "Link Hover": "لون الرابط عند المرور",
      "Border": "الحدود",
      "Link Style": "نمط الرابط",
      "Header Links": "روابط الرأس",
      "Add Link": "إضافة رابط",
      "Label": "التسمية",
      "URL": "الرابط",
      "Remove": "إزالة",
      "Footer": "التذييل",
      "Footer Main Text": "النص الرئيسي للتذييل",
      "Footer Subtext": "النص الفرعي للتذييل",
      "Show logo in footer": "إظهار الشعار في التذييل",
      "Footer Links": "روابط التذييل",
      "Save Header and Footer": "حفظ الرأس والتذييل",
      "Home Sections Control": "لوحة تحكم أقسام الرئيسية",
      "How It Works": "كيف يعمل",
      "Sections": "الأقسام",
      "Sliders": "السلايدر",
      "Add Section": "إضافة قسم",
      "Add Slider": "إضافة سلايدر",
      "No item selected": "لم يتم اختيار عنصر",
      "No image": "لا توجد صورة",
      "Image title": "عنوان الصورة",
      "Alt text": "النص البديل",
      "Caption": "التعليق",
      "Replace image": "استبدال الصورة",
      "Move up": "تحريك للأعلى",
      "Move down": "تحريك للأسفل",
      "Dark": "داكن",
      "Light": "فاتح",
      "Admin Editor": "لوحة الإدارة",
      "Read more": "اقرأ المزيد",
      "Home": "الرئيسية",
      "Blog": "المدونة",
      "Permalink": "الرابط الدائم",
      "Gallery Page": "صفحة معرض",
      "Page": "صفحة",
      "Previous image": "الصورة السابقة",
      "Next image": "الصورة التالية",
      "Close gallery viewer": "إغلاق عارض الصور",
      "Showing": "عرض",
      "of": "من",
    }),
  );

  function getEnabled() {
    try {
      return localStorage.getItem(storageKey) === "true";
    } catch {
      return false;
    }
  }

  function setStoredEnabled(enabled) {
    try {
      localStorage.setItem(storageKey, String(enabled));
    } catch {
      // The current page still updates if storage is unavailable.
    }
  }

  function translatedText(value) {
    const compact = String(value || "").replace(/\s+/g, " ").trim();
    return translations.get(compact) || "";
  }

  function replacePreservingWhitespace(value, replacement) {
    const leading = String(value).match(/^\s*/)?.[0] || "";
    const trailing = String(value).match(/\s*$/)?.[0] || "";
    return `${leading}${replacement}${trailing}`;
  }

  function shouldSkipNode(node) {
    const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    return Boolean(
      element?.closest?.(
        "script, style, textarea, input, select, option, pre, code, .max-w-none, [data-admin-live-preview]",
      ),
    );
  }

  function translateTextNode(node, enabled) {
    if (!node.nodeValue || shouldSkipNode(node)) return;

    if (!textNodeOriginals.has(node)) {
      textNodeOriginals.set(node, node.nodeValue);
    }

    const original = textNodeOriginals.get(node);
    if (!enabled) {
      if (node.nodeValue !== original) node.nodeValue = original;
      return;
    }

    const translated = translatedText(original);
    if (translated) {
      const nextValue = replacePreservingWhitespace(original, translated);
      if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
    }
  }

  function getAttributeOriginals(element) {
    if (!attributeOriginals.has(element)) {
      attributeOriginals.set(element, {});
    }
    return attributeOriginals.get(element);
  }

  function translateAttributes(element, enabled) {
    if (!(element instanceof Element)) return;

    ["placeholder", "title", "aria-label"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;

      const originals = getAttributeOriginals(element);
      if (!Object.prototype.hasOwnProperty.call(originals, attribute)) {
        originals[attribute] = element.getAttribute(attribute);
      }

      const original = originals[attribute] || "";
      if (!enabled) {
        element.setAttribute(attribute, original);
        return;
      }

      const translated = translatedText(original);
      if (translated) element.setAttribute(attribute, translated);
    });
  }

  function isTextControl(element) {
    return (
      element.matches?.(managedSelector) &&
      !element.closest("#admin-arabic-toggle") &&
      !technicalNamePattern.test(
        [element.name, element.id, element.getAttribute("aria-label")]
          .filter(Boolean)
          .join(" "),
      )
    );
  }

  function setManagedDirection(element, enabled) {
    if (!isTextControl(element)) return;

    if (enabled) {
      if (!element.dataset.adminOriginalDir) {
        element.dataset.adminOriginalDir = element.getAttribute("dir") || "";
      }
      if (!element.dataset.adminOriginalLang) {
        element.dataset.adminOriginalLang = element.getAttribute("lang") || "";
      }
      element.dataset.adminArabicManaged = "true";
      element.setAttribute("dir", "rtl");
      element.setAttribute("lang", "ar");
      element.classList.add("admin-arabic-field");
      return;
    }

    if (element.dataset.adminArabicManaged !== "true") return;
    if (element.dataset.adminOriginalDir) {
      element.setAttribute("dir", element.dataset.adminOriginalDir);
    } else {
      element.removeAttribute("dir");
    }
    if (element.dataset.adminOriginalLang) {
      element.setAttribute("lang", element.dataset.adminOriginalLang);
    } else {
      element.removeAttribute("lang");
    }
    element.classList.remove("admin-arabic-field");
    delete element.dataset.adminArabicManaged;
    delete element.dataset.adminOriginalDir;
    delete element.dataset.adminOriginalLang;
  }

  function walkTextNodes(container, enabled) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => translateTextNode(node, enabled));
  }

  function applyMode(enabled) {
    root.classList.toggle("admin-arabic-content-mode", enabled);
    root.dir = enabled ? "rtl" : "ltr";
    root.lang = enabled ? "ar" : "en";
    body.classList.toggle("admin-arabic-content-mode", enabled);
    body.dataset.contentLanguage = enabled ? "ar" : "en";

    document.querySelectorAll(managedSelector).forEach((element) => {
      setManagedDirection(element, enabled);
    });
    document.querySelectorAll("body *").forEach((element) => {
      translateAttributes(element, enabled);
    });
    walkTextNodes(body, enabled);

    if (toggle) {
      const toggleText = enabled ? "المحتوى العربي: تشغيل" : "Arabic Content: Off";
      toggle.setAttribute("aria-pressed", String(enabled));
      if (toggle.textContent !== toggleText) toggle.textContent = toggleText;
      toggle.classList.toggle("border-blue-600", enabled);
      toggle.classList.toggle("bg-blue-600", enabled);
      toggle.classList.toggle("text-white", enabled);
      toggle.classList.toggle("hover:bg-blue-700", enabled);
      toggle.classList.toggle("border-slate-300", !enabled);
      toggle.classList.toggle("bg-white", !enabled);
      toggle.classList.toggle("text-slate-700", !enabled);
      toggle.classList.toggle("hover:bg-blue-50", !enabled);
    }
  }

  let enabled = getEnabled();
  let isApplyScheduled = false;

  function scheduleApply() {
    if (isApplyScheduled) return;
    isApplyScheduled = true;
    requestAnimationFrame(() => {
      isApplyScheduled = false;
      applyMode(enabled);
    });
  }

  toggle?.addEventListener("click", () => {
    enabled = !enabled;
    setStoredEnabled(enabled);
    applyMode(enabled);
  });

  window.setArabicContentMode = (nextEnabled) => {
    enabled = Boolean(nextEnabled);
    setStoredEnabled(enabled);
    applyMode(enabled);
  };

  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey) return;
    enabled = event.newValue === "true";
    applyMode(enabled);
  });

  applyMode(enabled);

  const observer = new MutationObserver(scheduleApply);
  observer.observe(body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
})();
