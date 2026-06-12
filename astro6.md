# Astro 6 Upgrade Instructions

This guide upgrades this project from Astro 5 to Astro 6.

Official references:

- Astro v6 upgrade guide: https://docs.astro.build/en/guides/upgrade-to/v6/
- Astro 6.0 release notes: https://astro.build/blog/astro-6/
- Astro changelog: https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md
- Vercel adapter changelog: https://github.com/withastro/astro/blob/main/packages/integrations/vercel/CHANGELOG.md

## Current Project Snapshot

- Package manager: npm, with `package-lock.json`.
- Current Astro version: `astro@^5.17.3`.
- Official integrations in use: `@astrojs/preact`, `@astrojs/vercel`, `@astrojs/tailwind`.
- Runtime target: `output: "server"` with the Vercel adapter.
- Node requirement in `package.json`: `22.x`.
- Local Node checked during this audit: `v22.18.0`.
- Astro config file is already `astro.config.mjs`, which is compatible with Astro 6.

Initial scan did not find these common removed or renamed APIs:

- `Astro.glob()`
- `<ViewTransitions />`
- `<ClientRouter />`
- `astro:schema`
- `astro:content` collection queries
- `import.meta.env.ASSETS_PREFIX`
- Astro `i18n` config
- Removed Astro experimental flags

The main thing to watch is the `src/content` folder. This app mostly treats Markdown files as editable project files through `import.meta.glob()`, `fs`, and Vercel Blob. If Astro 6 reports legacy content collection errors, use the content-collection fix below.

## Upgrade Steps

1. Create a branch before changing dependencies.

```bash
git checkout -b upgrade/astro-6
```

2. Confirm Node is at least `22.12.0`.

```bash
node -v
```

Astro 6 drops Node 18 and Node 20 support. This repo already asks for Node `22.x`, but Vercel must also be configured to use Node 22.

Optional local pin:

```bash
echo 22.12.0 > .nvmrc
```

3. Run Astro's official upgrade command.

```bash
npx @astrojs/upgrade
```

This should upgrade Astro and official integrations together. For this repo, expect updates around:

```text
astro
@astrojs/preact
@astrojs/vercel
@astrojs/tailwind
```

4. Reinstall and refresh the lockfile.

```bash
npm install
```

5. Build locally.

```bash
npm run build
```

6. Run the site locally and smoke test the public and admin flows.

```bash
npm run dev
```

Check:

- Home page: `/`
- Blog list: `/blog`
- Blog detail pages: `/blog/example-slug`
- Tag pages: `/tags/example-tag`
- Gallery: `/gallery`
- Admin login: `/admin/login`
- Admin post/page create, edit, delete, and image upload flows
- API calls from the admin UI, especially protected endpoints under `/api`

7. Test Vercel-style local server behavior if possible.

```bash
npm run preview
```

8. Deploy a preview build and confirm Vercel is using Node 22.

## Project-Specific Fixes

### If Astro 6 Reports Content Collection Errors

Astro 6 removes automatic legacy content collection support. This repo has Markdown in:

```text
src/content/blog
src/content/pages
```

If the build complains about missing or legacy content collection configuration, add a minimal `src/content.config.ts`:

```ts
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/blog" }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/pages" }),
});

export const collections = { blog, pages };
```

If schemas are added later, import Zod from `astro/zod`, not `astro:content`:

```ts
import { z } from "astro/zod";
```

For a fast migration, avoid strict schemas until the upgrade build is clean, because old frontmatter may contain mixed or missing fields.

### If Vercel Adapter Fails

Astro 6 uses Vite 7 and updated official adapter majors. If the Vercel adapter reports a breaking change:

1. Confirm `@astrojs/vercel` was updated by `npx @astrojs/upgrade`.
2. Check the Vercel adapter changelog.
3. Keep `output: "server"` and `adapter: vercel()` unless the changelog says this project needs a new option.

Current config shape should remain close to:

```js
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";
import vercel from "@astrojs/vercel";

export default defineConfig({
  integrations: [tailwind(), preact()],
  output: "server",
  adapter: vercel(),
});
```

### If Markdown Heading Links Change

Astro 6 changes generated Markdown heading IDs to match the newer compatibility behavior. Headings that end with punctuation or component syntax may keep a trailing hyphen in the generated ID.

After upgrading, check any manual links like:

```md
[Jump](#picture)
```

They may need to become:

```md
[Jump](#picture-)
```

This matters only if the site has manual table-of-contents links or hard-coded heading anchors.

### If Image Rendering Looks Different

Astro 6 changes the default image service:

- Responsive image styling is emitted differently.
- Images are no longer upscaled by the default service.
- SVGs can now be rasterized if an output `format` asks for it.
- `getImage()` must run on the server, not in client-side code.

This repo uses plain `<img>` in several places and also uses `sharp` directly for upload processing. Still, visually check hero images, blog images, gallery images, and uploaded editor images after the build.

### If Environment Variables Behave Differently

Astro 6 always inlines `import.meta.env` values and does not coerce strings like `"true"` or `"1"` into booleans or numbers.

This repo currently relies mostly on `process.env` in server-side helpers. Keep private server secrets on `process.env`, especially:

```text
ADMIN_AUTH_SECRET
BLOB_READ_WRITE_TOKEN
DEV_ENV_TOKEN
```

Only expose browser-safe values through `PUBLIC_*` variables.

### If Script Or Style Order Changes

Astro 6 now preserves `<script>` and `<style>` tag order as written. If a page suddenly changes styling or client behavior, inspect components with multiple script or style tags and reorder them intentionally.

## Validation Checklist

Run:

```bash
npm run build
npm run dev
```

Then confirm:

- No build errors or Astro deprecation errors.
- Public pages render with correct layout.
- Arabic and English content still renders with correct direction and alignment.
- Blog detail pages still render both compiled Markdown and runtime Markdown.
- Admin authentication still redirects correctly.
- Admin mutating API requests still include and pass CSRF checks.
- Uploads still process through `sharp`.
- Vercel preview deploy uses Node 22 and starts successfully.

## Rollback

If the upgrade is not ready, restore the dependency files from git and reinstall:

```bash
git restore package.json package-lock.json
npm install
```

If code files were changed for the migration, restore only the files you intentionally edited.
