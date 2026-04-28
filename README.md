# Astro Blog with Tailwind CSS & Admin Control Panel

A modern content-driven blog built with Astro and Tailwind CSS, featuring a built-in admin panel for creating, editing, and managing Markdown posts.

## Features

- **Dynamic Blog Pages**: Each Markdown file in `src/pages/blog/` becomes a published blog post.
- **Admin Control Panel**: A dedicated `/admin` page with a live Markdown editor to create, edit, and delete posts.
- **Tailwind CSS**: Utility-first styling for a responsive, polished design.
- **Astro Static Generation**: Fast, SEO-friendly static pages with dynamic routing.
- **Interactive UI**: Built with Preact for a smooth editing experience.
- **API Endpoints**:
  - `POST /api/save-post` - Saves or updates a Markdown file.
  - `GET /api/list-posts` - Lists all existing blog posts with metadata.
  - `POST /api/delete-post` - Deletes a blog post by filename.
- **Filename Existence Check**: Real-time warning when a filename already exists in the blog directory.
- **Edit & Delete Functionality**: Manage existing posts directly from the admin panel.

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm (or yarn/pnpm)

### Installation

1. Clone the repository or navigate to the project folder.
2. Install dependencies:

```bash
cd "astro-blog codex"
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The server will start on `http://localhost:4321` or a different port if 4321 is busy. Check the terminal output for the active URL.
Open your browser to `http://localhost:<port>`.

## Using the Admin Panel

1. Navigate to **`/admin`** such as `http://localhost:4321/admin`.
2. Fill in the form:
   - **Filename**: Must end with `.md`, for example `my-post.md`.
     *A warning will appear if a post with the same filename already exists.*
   - **Post Title**: The title that will appear in the blog listing.
   - **Markdown Content**: The full post content, including frontmatter. A template is pre-filled.
3. Click **"Save Post"**.
4. The post will be saved to `src/pages/blog/<filename>` and immediately available at `/blog/<slug>`.  

### Managing Existing Posts 

The right column of the admin panel shows all existing blog posts. For each post you can:
gg
- **Edit**: Click the **Edit** button to load the post's title and filename into the form. Full content is not loaded, so you can edit it manually.
- **Delete**: Click the **Delete** button to permanently remove the post. Confirmation is required.
- **Refresh**: Use the **Refresh** button at the top of the list to reload the post list after saving or deleting.

### Preview and Clear

- **Preview**: Opens the new post in a new tab. The post must be saved first.
- **Clear**: Resets the form.

## Viewing Blog Posts

- **Homepage** (`/`): Shows a hero section, feature highlights, and a preview of the latest posts.
- **Blog Index** (`/blog`): Lists all blog posts in a responsive card grid.
- **Individual Post** (`/blog/<slug>`): Displays the full Markdown-rendered post with its frontmatter.

## Project Structure

```text
project-root/
|-- src/
|   |-- pages/
|   |   |-- blog/               # Blog posts (.md files)
|   |   |   |-- first-post.md
|   |   |   |-- second-post.md
|   |   |   `-- ...
|   |   |-- api/
|   |   |   |-- save-post.js    # API endpoint for saving posts
|   |   |   |-- list-posts.js   # API endpoint for listing posts
|   |   |   `-- delete-post.js  # API endpoint for deleting posts
|   |   |-- admin.astro         # Admin control panel
|   |   |-- index.astro         # Homepage
|   |   `-- blog/
|   |       |-- index.astro     # Blog listing
|   |       `-- [slug].astro    # Dynamic post page
|   |-- layouts/
|   |   `-- Layout.astro        # Global layout with navigation
|   |-- components/
|   |   |-- Welcome.astro
|   |   `-- BlogEditor.jsx      # Interactive editor (Preact)
|   `-- assets/
|-- public/                     # Static assets
|-- astro.config.mjs            # Astro configuration
|-- tailwind.config.js          # Tailwind CSS configuration
`-- package.json
```

## Configuration

### Tailwind CSS

The project uses `@astrojs/tailwind`. Configuration is in `tailwind.config.js`. You can customize colors, fonts, and more there.

### Astro Integrations

- `@astrojs/tailwind` - Tailwind CSS support.
- `@astrojs/preact` - Preact for interactive components.

### Markdown and Frontmatter

Each blog post must have a YAML frontmatter block at the top:

```yaml
---
title: "My Post Title"
pubDate: 2026-03-20
description: "A short description"
author: "Author Name"
tags: ["astro", "blog"]
---
```

The `pubDate`, `description`, `author`, and `tags` fields are optional but recommended.

## Building for Production

To create a production-ready static site:

```bash
npm run build
```

The output will be in the `dist/` directory. You can preview it with:

```bash
npm run preview
```

## Troubleshooting

### "Port already in use"

If port 4321 is busy, Astro will automatically choose another port such as 4322. Check the terminal output for the actual URL.

### "Cannot save post" or API errors

- Ensure the dev server is running.
- Check the browser's developer console for network errors.
- Verify that the `src/pages/blog/` directory exists and is writable.

### "Blog post not appearing"

- The post file must be saved with a `.md` extension inside `src/pages/blog/`.
- The frontmatter must be valid YAML.
- Restart the dev server if you edited files while it was running. Astro will hot-reload most changes.

## License

MIT

## Acknowledgements

- [Astro](https://astro.build) - The web framework for content-driven websites.
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework.
- [Preact](https://preactjs.com) - Fast 3kB React alternative.

---

Happy blogging!
