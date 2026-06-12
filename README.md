# Astro Blog CMS

Astro Blog CMS is a full-stack Astro website for publishing blog posts, custom pages, galleries, and editable home page content from a protected admin control center. It combines Astro, Tailwind CSS, Preact, Markdown content, server-side routes, local filesystem storage, and optional Vercel Blob storage so the same project can run locally and deploy to Vercel.

## Project Overview

This project is more than a static blog. It includes a public website, a content-management dashboard, image upload tools, authentication, configurable site chrome, and runtime storage helpers.

- **Public website**: Home page, blog index, blog detail pages, tag pages, gallery page, and custom Markdown pages.
- **Admin control center**: Protected pages for editing posts, pages, hero settings, home sections, gallery content, header/footer settings, upload stats, and admin password.
- **Markdown publishing**: Blog posts and pages are written as Markdown with frontmatter metadata.
- **Image workflow**: Uploaded images are optimized and stored for blog content, thumbnails, gallery images, hero images, and page assets.
- **Runtime storage**: Uses local files during development and can use Vercel Blob for deployed content and assets.
- **Authentication**: Admin routes are protected with password login, signed access/refresh cookies, refresh-session rotation, CSRF protection, and basic rate limiting.
- **Responsive design**: Tailwind CSS powers the public site and admin UI, with light/dark theme support and optional Arabic content mode in the admin area.

## Tech Stack

- **Astro 5** for pages, routing, layouts, API endpoints, and server rendering.
- **Vercel adapter** for deployment with `output: "server"`.
- **Tailwind CSS** for styling.
- **Preact** for interactive admin components.
- **Marked** for Markdown preview/rendering in the editor.
- **Sharp** for image processing.
- **Fabric** for image canvas/editor features.
- **bcryptjs** for admin password verification.
- **Vercel Blob** for production-ready remote content and asset storage.

## Main Routes

- `/` - Home page with editable hero content, managed home sections, feature cards, and latest blog posts.
- `/blog` - Blog post listing.
- `/blog/[slug]` - Individual blog post pages.
- `/tags/[tag]` - Posts filtered by tag.
- `/gallery` - Public gallery page.
- `/pages/[slug]` - Custom Markdown pages.
- `/admin/login` - Admin sign-in page.
- `/admin` - Blog editor.
- `/admin/hero` - Home page hero editor.
- `/admin/pages` - Custom page editor.
- `/admin/home-sections` - Home section, card, and slider editor.
- `/admin/gallery` - Gallery settings and image editor.
- `/admin/uploads` - Upload statistics.
- `/admin/site` - Header, footer, brand, navigation, and site chrome settings.
- `/admin/password` - Admin password setup/change screen.

## Project Structure

```text
astro-blog/
|-- astro.config.mjs            # Astro integrations, Vercel adapter, image config
|-- package.json                # Scripts and dependencies
|-- tailwind.config.js          # Tailwind configuration
|-- tsconfig.json               # TypeScript/Astro config
|-- data/
|   `-- auth/                   # Local admin password/session data
|-- public/
|   |-- blog-images/            # Uploaded blog images
|   |-- blog-thumbs/            # Blog thumbnails
|   |-- gallery-images/         # Gallery images and generated variants
|   |-- hero-images/            # Hero assets
|   |-- markdown-images/        # Images inserted into Markdown content
|   |-- page-images/            # Custom page images
|   `-- site-assets/            # Logo, icon, and shared site assets
|-- src/
|   |-- components/             # Admin editors and reusable UI components
|   |-- content/
|   |   |-- blog/               # Markdown blog posts
|   |   `-- pages/              # Markdown custom pages
|   |-- data/                   # Default JSON settings for site, hero, gallery, sections
|   |-- layouts/
|   |   `-- Layout.astro        # Shared public/admin layout and navigation
|   |-- lib/                    # Config readers, runtime storage, auth helpers
|   |-- middleware.js           # Admin route protection and CSRF checks
|   |-- pages/
|   |   |-- admin/              # Admin feature pages
|   |   |-- api/                # Server endpoints for admin/content actions
|   |   |-- blog/               # Blog index and dynamic post routes
|   |   |-- pages/              # Dynamic custom page route
|   |   |-- tags/               # Dynamic tag route
|   |   |-- gallery.astro       # Public gallery
|   |   `-- index.astro         # Home page
|   `-- styles/
|       `-- global.css          # Global site/admin styles
`-- README.md
```

## Getting Started

### Requirements

- Node.js 22.x
- npm

### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Astro starts on `http://localhost:4321` by default. If that port is busy, check the terminal output for the active URL.

### Build

```bash
npm run build
```

### Run the Built Server

```bash
npm run start
```

### Vercel Development Preview

```bash
npm run preview
```

This project maps `preview` to `vercel dev`, which is useful for testing Vercel-style server behavior locally.

## Environment Variables

Create `.env.local` for local development. Do not commit secrets.

```env
ADMIN_AUTH_SECRET=use-a-long-random-secret-at-least-32-characters
admin_password=$2a$12$replace-with-a-bcrypt-password-hash
dev_env_token=local
BLOB_READ_WRITE_TOKEN=optional-vercel-blob-token
```

- `ADMIN_AUTH_SECRET` signs admin access and refresh tokens.
- `admin_password` stores the initial admin bcrypt password hash. After setup, the project can store the admin record in `data/auth/admin.json`.
- `dev_env_token=local` allows local filesystem writes.
- `dev_env_token=pro-ready` enables production-style Blob behavior.
- `BLOB_READ_WRITE_TOKEN` enables Vercel Blob reads/writes when running in pro-ready or deployed mode.

## Content Model

Blog posts live in `src/content/blog` and custom pages live in `src/content/pages`. Each Markdown file can include frontmatter like this:

```yaml
---
title: "My Blog Post"
slug: "my-blog-post"
description: "A short summary for listings and metadata."
pubDate: 2026-05-08
author: "Ahmed Talal"
tags: ["astro", "blog"]
image: "/blog-images/example.webp"
thumbnail: "/blog-thumbs/example-thumb.webp"
postOrder: 10
---
```

The admin editor can create, edit, preview, list, and delete posts and pages. The public routes read both local Markdown files and Vercel Blob entries when Blob storage is configured.

## Admin Features

The admin control center is available at `/admin` after login.

- **Blog Editor**: Write Markdown, manage frontmatter, upload/insert images, preview content, and manage existing posts.
- **Hero Editor**: Change home page title, subtitle, buttons, backgrounds, colors, images, and metadata.
- **Pages Editor**: Create and manage standalone Markdown pages.
- **Home Sections**: Configure editable home sections, cards, waves, image zoom sections, and image sliders.
- **Gallery Editor**: Manage gallery settings, thumbnails, and gallery images.
- **Uploads**: Review upload counts and asset usage.
- **Header & Footer**: Update brand name, logo, icon, navigation links, footer links, colors, and language direction.
- **Password**: Set or change the admin password.

## API Endpoints

Admin and content APIs live under `src/pages/api`.

- `/api/save-post`, `/api/get-post`, `/api/list-posts`, `/api/delete-post`
- `/api/save-page`, `/api/get-page`, `/api/list-pages`, `/api/delete-page`
- `/api/upload-editor-image`, `/api/delete-upload-image`, `/api/upload-stats`
- `/api/hero-settings`, `/api/home-sections`, `/api/how-it-works`
- `/api/gallery-settings`, `/api/site-settings`
- `/api/admin/login`, `/api/admin/logout`, `/api/admin/refresh`, `/api/admin/change-password`

Protected admin APIs require a valid admin session. Mutating requests also require the CSRF token handled by the admin fetch helper.

## Storage Behavior

The storage helper in `src/lib/runtime-storage.js` decides where content and assets are saved.

- **Local development**: Saves JSON, Markdown, and uploaded assets to the repository filesystem.
- **Read-only serverless mode**: Prevents writes unless Blob storage is available.
- **Vercel Blob mode**: Saves deploy-time editable content and uploaded assets to Vercel Blob.
- **Inline fallback**: In read-only mode without Blob, some image operations can return inline data URLs instead of writing files.

## Useful Scripts

```bash
npm run dev          # Start Astro dev server
npm run build        # Build for production
npm run start        # Run built server from dist/server/entry.mjs
npm run preview      # Start Vercel dev preview
npm run serve:watch  # Rebuild and restart on source/content changes
npm run astro        # Run Astro CLI
```

## Deployment Notes

The project is configured for Vercel through `@astrojs/vercel`.

Before deploying:

1. Set `ADMIN_AUTH_SECRET` to a strong random value.
2. Set an admin password hash or use the password setup flow.
3. Add `BLOB_READ_WRITE_TOKEN` if deployed content should be editable.
4. Use `dev_env_token=pro-ready` when testing Blob-backed production behavior.

## Security Notes

- Keep `.env.local`, auth session files, and generated secrets out of version control.
- Admin access uses signed cookies, refresh token rotation, CSRF checks, and middleware route protection.
- The first password setup flow is allowed only when no stored admin password hash exists.

## License

MIT
