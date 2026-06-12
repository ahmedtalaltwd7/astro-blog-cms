# Project Manual

This manual explains how to work on the Astro Blog CMS codebase. Use it when you want to edit features, add content, change the admin panel, adjust API behavior, or understand which files should be changed together.

For a high-level project description, read `README.md`. For a code map, read `code.md`. This file is the practical edit manual.

## First Steps

### Install and Run

```bash
npm install
npm run dev
```

The local site usually opens at:

```text
http://localhost:4321
```

If port `4321` is busy, Astro prints the active port in the terminal.

### Build Check

```bash
npm run build
```

Run this after code changes that affect routes, API files, components, Markdown rendering, or config helpers.

## Important Project Rules

- Public route files live in `src/pages`.
- Admin UI route files live in `src/pages/admin`.
- API endpoints live in `src/pages/api`.
- Reusable business logic lives in `src/lib`.
- Interactive admin UI lives in `src/components`.
- Blog posts live in `src/content/blog`.
- Custom pages live in `src/content/pages`.
- Editable default settings live in `src/data`.
- Uploaded public assets live in `public`.
- Runtime auth files live in `data/auth`.

Do not edit `data/auth/session.json` unless you intentionally want to affect the current local admin session.

Do not commit secrets from `.env.local`, auth files, or deployed environment variables.

## Daily Editing Workflow

1. Identify the feature area.
2. Find the public page, admin component, API route, and helper module involved.
3. Make the smallest matching change.
4. If the change writes data, check `src/middleware.js` protection rules.
5. Run `npm run build` for route/component/API changes.
6. Test the affected page in the browser.

## File Responsibilities

### Public Page Files

Use these when changing what visitors see:

- `src/pages/index.astro`: Home page.
- `src/pages/blog/index.astro`: Blog list, search, and load more.
- `src/pages/blog/[slug].astro`: Blog post detail page.
- `src/pages/tags/[tag].astro`: Tag result page.
- `src/pages/gallery.astro`: Public gallery.
- `src/pages/pages/[slug].astro`: Custom Markdown pages.
- `src/layouts/Layout.astro`: Header, footer, theme toggle, mobile menu, shared page shell.

### Admin Page Files

Use these when changing admin screens:

- `src/pages/admin.astro`: Blog editor page.
- `src/pages/admin/hero.astro`: Hero editor page.
- `src/pages/admin/pages.astro`: Custom page editor page.
- `src/pages/admin/home-sections.astro`: Home sections editor page.
- `src/pages/admin/gallery.astro`: Gallery editor page.
- `src/pages/admin/uploads.astro`: Upload stats page.
- `src/pages/admin/site.astro`: Header/footer settings page.
- `src/pages/admin/password.astro`: Password page.
- `src/pages/admin/login.astro`: Login page.

### Admin Component Files

Use these when changing form behavior or admin interactivity:

- `src/components/AdminControlNav.astro`: Admin navigation.
- `src/components/BlogEditor.jsx`: Blog editor.
- `src/components/PageEditor.jsx`: Page editor.
- `src/components/HeroAdmin.jsx`: Hero settings editor.
- `src/components/HomeSectionsAdmin.jsx`: Home section editor.
- `src/components/GalleryAdmin.jsx`: Gallery editor.
- `src/components/SiteChromeAdmin.jsx`: Header/footer settings editor.
- `src/components/AdminPasswordAdmin.jsx`: Password editor.
- `src/components/UploadStatsAdmin.jsx`: Upload stats view.
- `src/components/MarkdownImageCanvas.jsx`: Markdown image helper.

### Library Files

Use these when changing shared logic:

- `src/lib/runtime-storage.js`: Local/Vercel Blob storage behavior.
- `src/lib/admin-auth.js`: Admin login, tokens, cookies, password, CSRF, sessions.
- `src/lib/site-config.js`: Header/footer settings model.
- `src/lib/hero-config.js`: Hero settings model.
- `src/lib/home-sections.js`: Home section settings model.
- `src/lib/how-it-works.js`: Feature card settings model.
- `src/lib/gallery-config.js`: Gallery settings model.
- `src/lib/static-pages.js`: Custom Markdown page model.

### API Files

Use these when changing server behavior:

- `src/pages/api/save-post.js`: Create/update blog posts.
- `src/pages/api/get-post.js`: Load one post for editing.
- `src/pages/api/list-posts.js`: List/search/filter/paginate posts.
- `src/pages/api/delete-post.js`: Delete posts.
- `src/pages/api/save-page.js`: Create/update custom pages.
- `src/pages/api/get-page.js`: Load one page for editing.
- `src/pages/api/list-pages.js`: List custom pages.
- `src/pages/api/delete-page.js`: Delete custom pages.
- `src/pages/api/upload-editor-image.js`: Upload images inside Markdown.
- `src/pages/api/delete-upload-image.js`: Delete uploaded image assets.
- `src/pages/api/upload-stats.js`: Count uploaded assets.
- `src/pages/api/hero-settings.js`: Hero config API.
- `src/pages/api/home-sections.js`: Home sections API.
- `src/pages/api/how-it-works.js`: Feature cards API.
- `src/pages/api/gallery-settings.js`: Gallery config API.
- `src/pages/api/site-settings.js`: Header/footer config API.
- `src/pages/api/admin/login.js`: Login API.
- `src/pages/api/admin/logout.js`: Logout API.
- `src/pages/api/admin/refresh.js`: Refresh-token API.
- `src/pages/api/admin/change-password.js`: Password API.

## Runtime Model

The app can read and write content in two ways:

- **Local filesystem**: Used in development when writable.
- **Vercel Blob**: Used for deployed editable content when configured.

The storage decision is centralized in:

```text
src/lib/runtime-storage.js
```

Before adding any new file-writing feature, check this file and follow the same pattern used by existing content/settings APIs.

## Middleware and Admin Protection

`src/middleware.js` protects admin pages and admin APIs.

When adding a new admin API route:

1. Add the API path to `ADMIN_API_PATHS`.
2. If it changes data, add it to `MUTATING_ADMIN_API_PATHS`.
3. Make sure the frontend uses the admin fetch helper so CSRF headers are included.

Example:

```js
const ADMIN_API_PATHS = new Set([
  "/api/my-new-admin-route",
]);

const MUTATING_ADMIN_API_PATHS = new Set([
  "/api/my-new-admin-route",
]);
```

Only add public APIs outside these sets when the route is safe for unauthenticated visitors.

## Content Editing

### Add a Blog Post Manually

Create a new file in:

```text
src/content/blog/my-new-post.md
```

Example:

```md
---
title: "My New Post"
pubDate: 2026-05-08
createdAt: 2026-05-08T12:00:00.000Z
description: "Short summary for the blog listing."
author: "Blog Author"
language: "en"
tags: ["astro", "cms"]
postOrder: 100
image: "/blog-images/example.webp"
thumbnail: "/blog-thumbs/example-thumb.webp"
---

# My New Post

Write the post content here.
```

After saving, visit:

```text
/blog/my-new-post
```

### Add a Custom Page Manually

Create a new file in:

```text
src/content/pages/about.md
```

Example:

```md
---
title: "About"
description: "About this website."
pageType: "normal"
language: "en"
createdAt: "2026-05-08T12:00:00.000Z"
updatedAt: "2026-05-08T12:00:00.000Z"
galleryImages: "[]"
---

# About

This is a custom page.
```

Visit:

```text
/pages/about
```

### Add a Gallery Page Manually

Use `pageType: "gallery"` and include gallery image data.

```md
---
title: "Photo Page"
description: "A page with a gallery."
pageType: "gallery"
language: "en"
createdAt: "2026-05-08T12:00:00.000Z"
updatedAt: "2026-05-08T12:00:00.000Z"
galleryImages: "[{\"imageUrl\":\"/page-images/example.webp\",\"title\":\"Example\",\"caption\":\"Caption text\",\"alt\":\"Example image\"}]"
---

# Photo Page

Intro text before the gallery.
```

## Edit Examples

### Example 1: Change the Site Navigation

Best option: use the admin screen at:

```text
/admin/site
```

Manual file edit option:

```text
src/data/site.json
```

Before:

```json
"navLinks": [
  { "label": "Home", "href": "/" },
  { "label": "Blog", "href": "/blog" }
]
```

After:

```json
"navLinks": [
  { "label": "Home", "href": "/" },
  { "label": "Blog", "href": "/blog" },
  { "label": "Gallery", "href": "/gallery" },
  { "label": "About", "href": "/pages/about" }
]
```

Related code:

- `src/lib/site-config.js` validates the links.
- `src/layouts/Layout.astro` renders the links.
- `src/components/SiteChromeAdmin.jsx` edits them in admin.

### Example 2: Change the Home Hero Text

Best option: use the admin screen at:

```text
/admin/hero
```

Manual file edit option:

```text
src/data/hero.json
```

Change fields such as:

```json
{
  "title": "New Hero Title",
  "subtitle": "A short sentence for the home page.",
  "primaryButtonText": "Read Blog",
  "primaryButtonHref": "/blog"
}
```

Related code:

- `src/lib/hero-config.js` normalizes hero data.
- `src/pages/index.astro` renders the hero.
- `src/components/HeroAdmin.jsx` edits hero data.
- `src/pages/api/hero-settings.js` saves hero data.

### Example 3: Change Blog Card Design

Change public blog cards in:

```text
src/pages/blog/index.astro
```

Look for:

```js
function renderPost(post) {
  ...
}
```

If tag pages should look the same, also update:

```text
src/pages/tags/[tag].astro
```

Example change:

Before:

```html
<article class="post-card bg-white rounded-xl shadow-md overflow-hidden">
```

After:

```html
<article class="post-card bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
```

Run:

```bash
npm run build
```

### Example 4: Add a New Frontmatter Field to Blog Posts

Example goal: add `featured: true` to posts.

Files usually involved:

- `src/pages/api/save-post.js`
- `src/pages/api/list-posts.js`
- `src/pages/blog/[slug].astro`
- `src/components/BlogEditor.jsx`

Manual Markdown example:

```md
---
title: "Featured Post"
featured: true
---

Post content.
```

Implementation checklist:

1. Add a field in `BlogEditor.jsx` form state.
2. Send that field to `/api/save-post`.
3. Write it into frontmatter in `save-post.js`.
4. Parse it in `list-posts.js` if the blog list needs it.
5. Render it in `src/pages/blog/[slug].astro` if the post page needs it.

Example frontmatter write in `save-post.js`:

```js
if (featured) {
  frontmatter += `\nfeatured: true`;
}
```

Example read pattern:

```js
const featured = frontmatter.featured === "true" || frontmatter.featured === true;
```

### Example 5: Add a New Public Page Route

Create:

```text
src/pages/about.astro
```

Example:

```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout title="About">
  <main class="min-h-screen bg-gray-50 py-12">
    <section class="mx-auto max-w-4xl px-4">
      <h1 class="text-4xl font-bold text-slate-950">About</h1>
      <p class="mt-4 text-slate-600">
        This page is rendered by Astro.
      </p>
    </section>
  </main>
</Layout>
```

Then visit:

```text
/about
```

If you want it in navigation, update `/admin/site` or `src/data/site.json`.

### Example 6: Add a New Admin API Route

Create:

```text
src/pages/api/example-settings.js
```

Example:

```js
export const prerender = false;

export async function GET() {
  return new Response(JSON.stringify({ message: "Hello admin" }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request }) {
  const data = await request.json();

  return new Response(JSON.stringify({ success: true, data }), {
    headers: { "Content-Type": "application/json" },
  });
}
```

Then protect it in:

```text
src/middleware.js
```

Add:

```js
"/api/example-settings"
```

to both `ADMIN_API_PATHS` and `MUTATING_ADMIN_API_PATHS` if it accepts writes.

### Example 7: Add a New Admin Screen

Create the component:

```text
src/components/ExampleAdmin.jsx
```

Example:

```jsx
import { useState } from "preact/hooks";

export default function ExampleAdmin() {
  const [message, setMessage] = useState("");

  async function save() {
    await fetch("/api/example-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  }

  return (
    <section class="mx-auto max-w-3xl px-4 py-8">
      <label class="block text-sm font-semibold text-slate-700">
        Message
      </label>
      <input
        class="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
        value={message}
        onInput={(event) => setMessage(event.currentTarget.value)}
      />
      <button
        type="button"
        class="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white"
        onClick={save}
      >
        Save
      </button>
    </section>
  );
}
```

Create the page:

```text
src/pages/admin/example.astro
```

Example:

```astro
---
import Layout from "../../layouts/Layout.astro";
import AdminControlNav from "../../components/AdminControlNav.astro";
import ExampleAdmin from "../../components/ExampleAdmin.jsx";
---

<Layout title="Example Admin">
  <AdminControlNav active="example" />
  <ExampleAdmin client:load />
</Layout>
```

Then add a link in:

```text
src/components/AdminControlNav.astro
```

Example:

```js
{
  key: "example",
  label: "Example",
  href: "/admin/example",
  description: "Example settings",
}
```

### Example 8: Change Image Upload Limits

Editor image uploads are handled in:

```text
src/pages/api/upload-editor-image.js
```

Find:

```js
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
```

Example change to 20 MB:

```js
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
```

Blog cover image processing is handled in:

```text
src/pages/api/save-post.js
```

Related constants:

```js
const MAX_IMAGE_DIMENSION = 1920;
const THUMB_WIDTH = 640;
const THUMB_HEIGHT = 360;
```

### Example 9: Change Storage Behavior

Most storage behavior should be changed in:

```text
src/lib/runtime-storage.js
```

Common functions:

```js
isReadonlyRuntime()
hasBlobStorage()
requireWritableStorage()
readJsonBlob()
writeJsonBlob()
readTextBlob()
writeTextBlob()
saveAsset()
saveWebpAsset()
```

If a new feature writes JSON settings, follow the pattern in:

```text
src/lib/site-config.js
```

If a new feature writes Markdown content, follow the pattern in:

```text
src/lib/static-pages.js
```

### Example 10: Add Arabic/RTL Support to a New Public View

Use the same pattern as the blog post and custom page routes.

Example:

```js
function hasArabicContent(value) {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(String(value || ""));
}

const language = hasArabicContent(title + " " + body) ? "ar" : "en";
const direction = language === "ar" ? "rtl" : "ltr";
```

Then render:

```astro
<article dir={direction} lang={language}>
  ...
</article>
```

## Common Change Recipes

### Change Header/Footer

Use:

- `src/data/site.json`
- `src/lib/site-config.js`
- `src/components/SiteChromeAdmin.jsx`
- `src/pages/api/site-settings.js`
- `src/layouts/Layout.astro`

If adding a new field:

1. Add default value in `DEFAULT_SITE_CONFIG`.
2. Normalize it in `normalizeSiteConfig()`.
3. Add form controls in `SiteChromeAdmin.jsx`.
4. Render it in `Layout.astro`.

### Change Hero

Use:

- `src/data/hero.json`
- `src/lib/hero-config.js`
- `src/components/HeroAdmin.jsx`
- `src/pages/api/hero-settings.js`
- `src/pages/index.astro`

If adding a new hero option:

1. Add default and normalization in `hero-config.js`.
2. Add admin control in `HeroAdmin.jsx`.
3. Use the field in `index.astro`.

### Change Home Sections

Use:

- `src/data/home-sections.json`
- `src/lib/home-sections.js`
- `src/components/HomeSectionsAdmin.jsx`
- `src/pages/api/home-sections.js`
- `src/pages/index.astro`

If adding a new section style:

1. Add style normalization in `home-sections.js`.
2. Add admin controls in `HomeSectionsAdmin.jsx`.
3. Add rendering logic in `index.astro`.
4. Add CSS for the new section style.

### Change Gallery

Use:

- `src/data/gallery.json`
- `src/lib/gallery-config.js`
- `src/components/GalleryAdmin.jsx`
- `src/pages/api/gallery-settings.js`
- `src/pages/gallery.astro`

### Change Blog Editing

Use:

- `src/components/BlogEditor.jsx`
- `src/pages/api/save-post.js`
- `src/pages/api/get-post.js`
- `src/pages/api/list-posts.js`
- `src/pages/api/delete-post.js`
- `src/pages/blog/index.astro`
- `src/pages/blog/[slug].astro`

### Change Custom Page Editing

Use:

- `src/components/PageEditor.jsx`
- `src/lib/static-pages.js`
- `src/pages/api/save-page.js`
- `src/pages/api/get-page.js`
- `src/pages/api/list-pages.js`
- `src/pages/api/delete-page.js`
- `src/pages/pages/[slug].astro`

### Change Admin Login or Passwords

Use:

- `src/lib/admin-auth.js`
- `src/middleware.js`
- `src/pages/admin/login.astro`
- `src/pages/admin/password.astro`
- `src/components/AdminPasswordAdmin.jsx`
- `src/pages/api/admin/login.js`
- `src/pages/api/admin/logout.js`
- `src/pages/api/admin/refresh.js`
- `src/pages/api/admin/change-password.js`

Be careful with:

- Cookie names.
- Token max ages.
- CSRF behavior.
- Password hash validation.
- Refresh session rotation.

## API Editing Checklist

When editing or adding an API route:

- Add `export const prerender = false;` for dynamic server routes.
- Validate all user input.
- Reject unsafe filenames.
- Return JSON with `Content-Type: application/json`.
- Use helpers from `src/lib` instead of duplicating storage logic.
- Use `requireWritableStorage()` before writes in read-only environments.
- Add the route to `src/middleware.js` if it should be admin-only.
- Add mutating routes to the CSRF-protected set.
- Test success and error responses.

## Component Editing Checklist

When editing Preact admin components:

- Keep form state local with hooks.
- Use existing field naming where possible.
- Keep API payloads aligned with matching API route names.
- Show loading/saving/error states.
- Keep Arabic content mode behavior intact.
- Use existing Tailwind classes and admin layout style.
- Avoid changing unrelated admin screens.

## Markdown Editing Checklist

When editing Markdown generation:

- Preserve valid YAML frontmatter.
- Keep strings quoted with `JSON.stringify()` where possible.
- Strip old frontmatter before writing new frontmatter.
- Preserve existing `createdAt` and `pubDate` when updating posts.
- Preserve image and thumbnail URLs when no new image is uploaded.
- Keep slugs and filenames safe.

## Image Editing Checklist

When changing image code:

- Validate uploaded file type.
- Enforce a maximum upload size.
- Convert large images with Sharp where possible.
- Save WebP output consistently.
- Save thumbnails when blog cards need them.
- Include both local public directories and `dist/client` directories when needed.
- Keep Vercel Blob behavior working through `saveWebpAsset()`.

## Build and Verification

For documentation-only edits:

```bash
git status --short
```

For code edits:

```bash
npm run build
```

For UI edits:

```bash
npm run dev
```

Then check the affected route in the browser.

Suggested routes to test:

- `/`
- `/blog`
- `/blog/example-slug`
- `/gallery`
- `/pages/example-page`
- `/admin/login`
- `/admin`
- `/admin/site`

## Troubleshooting

### Admin Page Redirects to Login

The admin session is missing or expired. Log in again at:

```text
/admin/login
```

### Admin API Returns 401

The request is not authenticated. Check:

- Login cookies.
- Middleware protected path list.
- Admin fetch helper.

### Admin API Returns 403

The CSRF token is missing or invalid. Check:

- `public/admin-auth-fetch.js`
- `src/middleware.js`
- Whether the route is listed in `MUTATING_ADMIN_API_PATHS`.

### Content Saves Locally but Not on Vercel

Check:

- `dev_env_token`
- `BLOB_READ_WRITE_TOKEN`
- `src/lib/runtime-storage.js`
- Vercel project environment variables.

### New Post Does Not Appear

Check:

- The file is in `src/content/blog`.
- The filename ends with `.md`.
- The slug is safe.
- Frontmatter is valid.
- `/api/list-posts` returns it.
- The dev server has reloaded if needed.

### Images Do Not Render

Check:

- Image URL begins with `/` or `http`.
- File exists in the expected `public` folder.
- Blob URL is reachable if using Vercel Blob.
- The image was converted and saved by the upload route.

## Safe Files to Edit Often

These files are normal project files:

- `README.md`
- `code.md`
- `manual.md`
- `src/pages/**/*.astro`
- `src/components/**/*.jsx`
- `src/lib/**/*.js`
- `src/pages/api/**/*.js`
- `src/content/**/*.md`
- `src/data/**/*.json`
- `src/styles/global.css`

## Files to Edit Carefully

These can affect security, deploys, or generated output:

- `.env.local`
- `data/auth/admin.json`
- `data/auth/session.json`
- `package-lock.json`
- `astro.config.mjs`
- `src/middleware.js`
- `src/lib/admin-auth.js`
- `src/lib/runtime-storage.js`

## Final Rule

When a feature has both public display and admin editing, update both sides together:

```text
admin component -> API route -> lib helper/data model -> public page render
```

That chain is the heart of this project.
