# Code Guide

This file explains how the Astro Blog CMS codebase is organized and how the main parts work together.

## Application Shape

The project is an Astro server-rendered site with two main areas:

- **Public site**: Home, blog, tags, gallery, and custom page routes.
- **Admin control center**: Protected editor screens powered by Preact components and Astro API routes.

Astro renders the page shell, layouts, and public routes. Preact handles richer admin interactions such as Markdown editing, image insertion, form state, previews, and settings panels. API routes under `src/pages/api` perform content reads/writes, image processing, authentication, and settings updates.

## Root Configuration

### `astro.config.mjs`

Configures Astro for this project.

- Enables Tailwind with `@astrojs/tailwind`.
- Enables Preact islands with `@astrojs/preact`.
- Uses `@astrojs/vercel` as the deployment adapter.
- Sets `output: "server"` so routes and API endpoints can run dynamically.
- Allows local and remote image sources.
- Sets the Markdown syntax highlighting theme.

### `package.json`

Defines the project scripts and dependencies.

- `npm run dev` starts Astro development mode.
- `npm run build` builds the server output.
- `npm run start` runs `dist/server/entry.mjs`.
- `npm run preview` starts `vercel dev`.
- `npm run serve:watch` rebuilds and restarts the built server when source files change.

### `tailwind.config.js`

Provides Tailwind CSS configuration for the site and admin interface.

### `tsconfig.json`

Provides Astro/TypeScript project configuration.

## Layout and Global UI

### `src/layouts/Layout.astro`

This is the shared layout for public pages and admin pages.

Main responsibilities:

- Imports `src/styles/global.css`.
- Reads site chrome settings from `readSiteConfig()`.
- Builds header and footer styles from JSON configuration.
- Renders the logo, brand name, nav links, footer links, and footer text.
- Filters admin links out of the public navigation.
- Adds a light/dark theme toggle using `localStorage`.
- Adds a mobile navigation menu.
- Adds optional Arabic content mode support.
- Loads `/admin-arabic-mode.js` for admin language behavior.

Most pages wrap their content in:

```astro
<Layout title="Page Title" description="Meta description">
  ...
</Layout>
```

## Public Pages

### `src/pages/index.astro`

Renders the home page.

Main responsibilities:

- Reads blog posts from `src/content/blog` and optional Vercel Blob entries.
- Sorts posts by `postOrder`, then date.
- Shows the latest three posts.
- Reads editable hero settings from `readHeroConfig()`.
- Reads editable home sections from `readHomeSections()`.
- Reads feature cards from `readHowItWorks()`.
- Renders section styles such as normal sections, wavy sections, image zoom sections, and vertical/horizontal sliders.
- Includes client-side slider behavior for auto-sliding home sections.

### `src/pages/blog/index.astro`

Renders the blog listing page.

Main responsibilities:

- Displays a search field and post grid.
- Fetches posts from `/api/list-posts`.
- Supports pagination with a "Load More" button.
- Stores list scroll/search state in `sessionStorage` so returning from a post can restore the list.
- Renders post cards with thumbnails, titles, dates, descriptions, tags, and language direction.

### `src/pages/blog/[slug].astro`

Renders one blog post.

Main responsibilities:

- Decodes and normalizes the route slug.
- Redirects `.md` URLs to clean canonical URLs.
- Rejects unsafe slugs and path traversal.
- Loads compiled Markdown modules when available.
- Falls back to runtime file reads so newly created posts can appear without a rebuild.
- Reads Vercel Blob post content when Blob storage is configured.
- Parses frontmatter and Markdown body.
- Renders Markdown through Astro compiled components or `marked`.
- Detects Arabic content and sets `dir`, `lang`, and text alignment.
- Renders post image, title, date, author, tags, description, body, and navigation links.

### `src/pages/tags/[tag].astro`

Renders posts for a specific hashtag.

Main responsibilities:

- Reads the tag from the route.
- Fetches matching posts from `/api/list-posts?tag=...`.
- Renders matching post cards client-side.
- Shows an empty state when no posts match.

### `src/pages/gallery.astro`

Renders the public gallery page.

Main responsibilities:

- Reads gallery settings from the gallery config helper.
- Displays configured gallery images.
- Uses gallery metadata such as titles, captions, thumbnails, and images.

### `src/pages/pages/[slug].astro`

Renders custom Markdown pages.

Main responsibilities:

- Decodes and validates custom page slugs.
- Redirects `.md` URLs to clean page URLs.
- Reads page content with `readPageContent()`.
- Parses page frontmatter with `parsePageMarkdown()`.
- Renders Markdown with `marked`.
- Supports normal pages and gallery pages.
- Renders page-level gallery images with a lightbox viewer.
- Detects Arabic content and sets correct direction and language attributes.

## Admin Pages

Admin pages are Astro pages that render the shared layout, `AdminControlNav`, and a Preact admin component.

### `src/pages/admin.astro`

Main blog editor screen. Loads `BlogEditor`.

### `src/pages/admin/hero.astro`

Hero settings editor. Loads `HeroAdmin`.

### `src/pages/admin/pages.astro`

Custom page editor. Loads `PageEditor`.

### `src/pages/admin/home-sections.astro`

Home section editor. Loads `HomeSectionsAdmin`.

### `src/pages/admin/gallery.astro`

Gallery editor. Loads `GalleryAdmin`.

### `src/pages/admin/uploads.astro`

Upload statistics screen. Loads `UploadStatsAdmin`.

### `src/pages/admin/site.astro`

Header, footer, logo, icon, nav, and brand settings editor. Loads `SiteChromeAdmin`.

### `src/pages/admin/password.astro`

Admin password setup/change screen. Loads `AdminPasswordAdmin`.

### `src/pages/admin/login.astro`

Admin login page.

## Admin Components

### `src/components/AdminControlNav.astro`

Renders the admin navigation bar.

Main responsibilities:

- Shows links to all admin areas.
- Highlights the active admin page.
- Adds the Arabic content toggle.
- Adds "View Site" and "Logout" actions.
- Loads `/admin-auth-fetch.js` so authenticated API calls include admin auth behavior.

### `src/components/BlogEditor.jsx`

Interactive blog editor.

Main responsibilities:

- Manages blog post form state.
- Creates safe filenames from titles.
- Edits title, tags, language, image, and Markdown body.
- Provides Markdown snippets.
- Previews Markdown with `marked`.
- Uploads editor images.
- Inserts Markdown image markup.
- Lists, loads, saves, and deletes posts through API routes.
- Handles Arabic content detection and admin Arabic mode.

### `src/components/PageEditor.jsx`

Interactive custom page editor.

Main responsibilities:

- Creates and edits Markdown pages.
- Supports normal pages and page galleries.
- Manages page metadata, language, gallery image data, and body content.
- Calls page API routes for listing, loading, saving, and deleting pages.

### `src/components/HeroAdmin.jsx`

Hero editor for the home page.

Main responsibilities:

- Edits hero title, subtitle, metadata, buttons, background type, colors, overlay, and image.
- Saves settings through `/api/hero-settings`.

### `src/components/HomeSectionsAdmin.jsx`

Home page section editor.

Main responsibilities:

- Adds, edits, reorders, and removes home sections.
- Supports normal, wavy, image zoom, and slider sections.
- Manages colors, text, images, wave settings, and slider images.
- Saves through `/api/home-sections`.

### `src/components/GalleryAdmin.jsx`

Gallery settings editor.

Main responsibilities:

- Manages public gallery content.
- Uploads and organizes gallery images.
- Saves through `/api/gallery-settings`.

### `src/components/SiteChromeAdmin.jsx`

Header and footer editor.

Main responsibilities:

- Edits brand name, logo, icon, nav links, footer links, colors, footer text, and header language.
- Saves through `/api/site-settings`.

### `src/components/AdminPasswordAdmin.jsx`

Admin password manager.

Main responsibilities:

- Sets the first admin password.
- Changes an existing password.
- Calls `/api/admin/change-password`.

### `src/components/UploadStatsAdmin.jsx`

Upload stats viewer.

Main responsibilities:

- Calls `/api/upload-stats`.
- Displays counts and sizes for uploaded assets.

### `src/components/MarkdownImageCanvas.jsx`

Canvas-style helper for Markdown images.

Main responsibilities:

- Helps position, rotate, size, or prepare image markup for Markdown content.
- Works with the blog/page editor image workflow.

## API Routes

All API route files live under `src/pages/api`.

### Blog APIs

- `save-post.js`: Saves or updates a Markdown blog post. Accepts JSON or multipart form data, processes optional images with Sharp, writes frontmatter, assigns `postOrder`, and stores content locally or in Vercel Blob.
- `get-post.js`: Reads one existing post for editing.
- `list-posts.js`: Lists posts for public and admin views. Supports pagination, search, tags, and merging local/Blob posts.
- `delete-post.js`: Deletes a post from local storage or Blob storage.

### Page APIs

- `save-page.js`: Saves a custom Markdown page using helpers from `static-pages.js`.
- `get-page.js`: Reads one custom page.
- `list-pages.js`: Lists custom pages.
- `delete-page.js`: Deletes a custom page.

### Image and Upload APIs

- `upload-editor-image.js`: Uploads images used inside Markdown content, validates file type and size, converts to WebP with Sharp, and returns Markdown image syntax.
- `delete-upload-image.js`: Deletes uploaded image assets.
- `upload-stats.js`: Counts uploaded files and sizes.

### Settings APIs

- `hero-settings.js`: Reads and writes home hero configuration.
- `home-sections.js`: Reads and writes managed home sections.
- `how-it-works.js`: Reads and writes feature card settings.
- `gallery-settings.js`: Reads and writes gallery configuration.
- `site-settings.js`: Reads and writes header/footer/site chrome configuration.

### Admin Auth APIs

- `admin/login.js`: Verifies admin credentials and creates auth cookies.
- `admin/logout.js`: Clears auth cookies and session data.
- `admin/refresh.js`: Refreshes access tokens when a valid refresh token exists.
- `admin/change-password.js`: Sets or changes the admin password hash.

## Library Modules

Library files live in `src/lib`.

### `runtime-storage.js`

Central storage abstraction.

Main responsibilities:

- Detects storage mode from `.env.local` or environment variables.
- Determines whether the app is running in local, read-only, serverless, or pro-ready mode.
- Reads/writes JSON in Vercel Blob.
- Reads/writes text content in Vercel Blob.
- Lists and deletes Blob entries.
- Saves uploaded assets either to Vercel Blob, local public folders, or inline data URLs.
- Provides shared helpers such as `saveWebpAsset()`.

### `admin-auth.js`

Admin authentication and session helper.

Main responsibilities:

- Reads admin password hash from `data/auth/admin.json` or environment variables.
- Verifies passwords with bcrypt.
- Creates signed access and refresh tokens.
- Verifies tokens with HMAC signatures.
- Stores and rotates refresh sessions in `data/auth/session.json`.
- Creates and validates CSRF tokens.
- Provides secure cookie options.
- Implements simple in-memory rate limiting.

### `site-config.js`

Header/footer/site chrome settings.

Main responsibilities:

- Defines default site config.
- Normalizes colors, links, URLs, text, and language.
- Reads settings from Blob first, then local `src/data/site.json`.
- Writes settings to Blob in read-only mode or local JSON in local mode.

### `hero-config.js`

Home page hero settings.

Main responsibilities:

- Defines and normalizes hero text, metadata, buttons, background, colors, images, and overlays.
- Reads/writes hero JSON data.

### `home-sections.js`

Managed home section settings.

Main responsibilities:

- Defines section models for normal sections, wavy sections, image zoom sections, and sliders.
- Normalizes section content, image data, colors, and slider options.
- Reads/writes home section JSON data.

### `how-it-works.js`

Feature card settings for the home page.

Main responsibilities:

- Defines feature card data.
- Normalizes icons, card text, colors, background images, and styles.
- Reads/writes settings used by the home page feature section.

### `gallery-config.js`

Gallery settings.

Main responsibilities:

- Defines the public gallery model.
- Normalizes image entries, titles, captions, thumbnails, and display settings.
- Reads/writes gallery JSON data.

### `static-pages.js`

Custom page helper module.

Main responsibilities:

- Normalizes page filenames and slugs.
- Parses page Markdown frontmatter.
- Builds page Markdown with frontmatter.
- Reads/writes page content locally or through Blob storage.
- Lists page files from local storage and Blob storage.
- Detects Arabic content and resolves page language.

## Middleware

### `src/middleware.js`

Protects admin pages and admin API routes.

Main responsibilities:

- Defines protected admin pages and API paths.
- Allows `/admin/login` without authentication.
- Allows initial password setup when no admin password exists.
- Verifies admin access tokens.
- Rotates refresh sessions when access tokens expire.
- Requires CSRF tokens for mutating admin API requests.
- Redirects unauthenticated page requests to `/admin/login`.
- Returns JSON `401` or `403` errors for unauthenticated/invalid API requests.

## Data Files

### `src/data/*.json`

Default editable settings for the site.

- `site.json`: Header, footer, brand, nav, colors, language.
- `hero.json`: Home hero text, buttons, backgrounds, metadata.
- `home-sections.json`: Managed home page sections.
- `how-it-works.json`: Feature cards.
- `gallery.json`: Gallery settings.

These files act as local defaults and local development storage when the app is writable.

### `src/content/blog/*.md`

Markdown blog posts. Blog frontmatter can include:

- `title`
- `pubDate`
- `createdAt`
- `description`
- `author`
- `language`
- `tags`
- `postOrder`
- `image`
- `thumbnail`

### `src/content/pages/*.md`

Custom Markdown pages. Page frontmatter can include:

- `title`
- `description`
- `pageType`
- `language`
- `createdAt`
- `updatedAt`
- `galleryImages`

### `data/auth/*.json`

Local admin auth storage.

- `admin.json`: Stored admin username and bcrypt password hash.
- `session.json`: Current refresh token session metadata.

These files are runtime auth data and should not contain public documentation content.

## Public Assets

### `public/*`

Static assets served by the site.

Important folders:

- `blog-images`: Main blog images.
- `blog-thumbs`: Generated blog thumbnails.
- `markdown-images`: Images inserted inside Markdown content.
- `gallery-images`: Gallery images.
- `hero-images`: Hero images.
- `home-section-assets`: Images used by managed home sections.
- `how-it-works-assets`: Images used by feature cards.
- `page-images`: Images used by custom pages.
- `site-assets`: Logo, icon, and shared site assets.

### `client/markdown-images`

Additional local image output folder used by the editor upload workflow.

## Request Flow

### Public Blog Flow

1. Visitor opens `/blog`.
2. Browser JavaScript calls `/api/list-posts`.
3. `list-posts.js` reads Markdown posts from local content and Blob storage.
4. The page renders post cards.
5. Visitor opens `/blog/[slug]`.
6. `[slug].astro` loads compiled Markdown or runtime Markdown content.
7. The post renders with metadata, image, tags, language direction, and body.

### Admin Save Post Flow

1. Admin logs in at `/admin/login`.
2. Middleware verifies cookies before allowing `/admin`.
3. `BlogEditor.jsx` submits post data to `/api/save-post`.
4. Middleware checks access token and CSRF token.
5. `save-post.js` validates filename, title, and content.
6. Optional image upload is optimized with Sharp and saved.
7. Frontmatter is rebuilt.
8. Markdown is written to `src/content/blog` locally or `blog-posts/` in Vercel Blob.
9. The API returns the saved post path, image URLs, and post order.

### Settings Save Flow

1. Admin edits settings in a Preact admin component.
2. Component sends JSON to a settings API route.
3. Middleware validates the admin session and CSRF token.
4. The API route normalizes values with the matching `src/lib` helper.
5. Settings are saved to local `src/data/*.json` or Blob `admin-data/*.json`.
6. Public pages read the updated settings on the next request.

### Image Upload Flow

1. Admin selects or pastes an image in the editor.
2. Editor calls `/api/upload-editor-image` or sends an image to `/api/save-post`.
3. API validates file type and size.
4. Sharp rotates and converts the image to WebP.
5. The storage helper saves it locally, to Vercel Blob, or inline depending on runtime mode.
6. API returns the image URL and Markdown image syntax.

## Storage Modes

The project supports several storage modes.

- **Local mode**: Writes directly to the repository files and `public` folders.
- **Readonly serverless mode**: Blocks writes unless Blob storage is available.
- **Pro-ready Blob mode**: Reads and writes editable content through Vercel Blob.
- **Inline fallback**: Some image uploads return data URLs if no writable storage is available.

The main decision points are handled in `runtime-storage.js`:

- `isReadonlyRuntime()`
- `hasBlobStorage()`
- `requireWritableStorage()`
- `readJsonBlob()`
- `writeJsonBlob()`
- `readTextBlob()`
- `writeTextBlob()`
- `saveAsset()`

## Security Model

Admin protection is split between middleware and auth helpers.

- `middleware.js` decides which requests need authentication.
- `admin-auth.js` creates and verifies access/refresh tokens.
- Access tokens are short-lived.
- Refresh tokens are rotated and tracked in `data/auth/session.json`.
- Mutating admin API requests require CSRF validation.
- Password hashes are verified with bcrypt.
- Initial password setup is allowed only before a stored admin password exists.

## Code Patterns Used Across the Project

- **Normalize before saving**: Config helpers sanitize colors, URLs, text, filenames, arrays, and language values.
- **Blob first on reads**: Many readers check Vercel Blob first so deployed edits override bundled defaults.
- **Local fallback**: Local files are used when Blob is unavailable or the app is running in writable development mode.
- **Runtime Markdown fallback**: Dynamic post/page routes can read Markdown directly from disk or Blob so new content appears without requiring a full rebuild.
- **Safe filenames**: API routes reject path traversal, slashes, null bytes, and invalid filename characters.
- **Language detection**: Arabic content is detected and rendered with RTL direction where needed.
- **Image optimization**: Upload routes convert images to WebP and generate thumbnails where appropriate.

## Where to Change Common Features

- Change public header/footer: `src/layouts/Layout.astro`, `src/lib/site-config.js`, `src/components/SiteChromeAdmin.jsx`.
- Change home page layout: `src/pages/index.astro`, `src/lib/hero-config.js`, `src/lib/home-sections.js`.
- Change blog cards: `src/pages/blog/index.astro`, `src/pages/tags/[tag].astro`.
- Change post rendering: `src/pages/blog/[slug].astro`.
- Change admin editor behavior: `src/components/BlogEditor.jsx`.
- Change page editor behavior: `src/components/PageEditor.jsx`.
- Change upload behavior: `src/pages/api/upload-editor-image.js`, `src/pages/api/save-post.js`, `src/lib/runtime-storage.js`.
- Change authentication: `src/lib/admin-auth.js`, `src/middleware.js`, `src/pages/api/admin/*.js`.
- Change Vercel/local storage behavior: `src/lib/runtime-storage.js`.
