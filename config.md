# Configuration Manual

This manual explains how the Astro Blog CMS is configured for development, local server runs, Vercel, production, and pro-ready Blob storage. It also gives practical examples for changing configuration safely.

Use this file when you need to change environment variables, deployment settings, Astro options, storage behavior, or admin security settings.

## Configuration Files

### `astro.config.mjs`

Main Astro configuration.

Current setup:

```js
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";
import vercel from "@astrojs/vercel";

export default defineConfig({
  integrations: [tailwind(), preact()],
  output: "server",
  adapter: vercel(),
  image: {
    remotePatterns: [
      { protocol: "https" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
```

What it means:

- `integrations: [tailwind(), preact()]` enables Tailwind CSS and Preact components.
- `output: "server"` allows dynamic routes and API endpoints.
- `adapter: vercel()` prepares the app for Vercel deployment.
- `image.remotePatterns` allows HTTPS images and local dev images.
- `markdown.shikiConfig.theme` controls code block highlighting.

### `package.json`

Defines Node version, scripts, and dependencies.

Important values:

```json
{
  "engines": {
    "node": "22.x"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "node ./node_modules/astro/astro.js build",
    "preview": "vercel dev",
    "start": "node dist/server/entry.mjs",
    "serve:watch": "nodemon --watch src --ext md,astro,js,json --exec \"npm run build && node dist/server/entry.mjs\""
  }
}
```

### `.vercelignore`

Controls what is not uploaded to Vercel.

Current ignored items:

```text
node_modules/
dist/
.astro/

*.log
*.err.log
*.out.log

.env
.env.*
!.env.example
```

This keeps local dependencies, build output, logs, and secret environment files out of deployments.

### `.env.local`

Local-only environment variables. This file is intentionally ignored and should not be committed.

Example:

```env
ADMIN_AUTH_SECRET=replace-with-a-long-random-secret-at-least-32-characters
admin_password=$2a$12$replace-with-a-bcrypt-password-hash
dev_env_token=local
BLOB_READ_WRITE_TOKEN=optional-vercel-blob-token
```

## Environment Variables

### Required for Admin Auth

| Variable | Required | Used By | Description |
| --- | --- | --- | --- |
| `ADMIN_AUTH_SECRET` | Yes | `src/lib/admin-auth.js` | Signs admin access and refresh tokens. Must be at least 32 characters. |
| `admin_password` | Usually first setup | `src/lib/admin-auth.js` | Initial admin bcrypt password hash. Lowercase name is supported. |
| `ADMIN_PASSWORD` | Alternative | `src/lib/admin-auth.js` | Alternative uppercase password hash variable. |

### Required for Storage Mode

| Variable | Required | Used By | Description |
| --- | --- | --- | --- |
| `dev_env_token` | Recommended | `src/lib/runtime-storage.js` | Storage mode. Supports `local` and `pro-ready`. |
| `DEV_ENV_TOKEN` | Alternative | `src/lib/runtime-storage.js` | Uppercase storage mode variable for deployed environments. |
| `BLOB_READ_WRITE_TOKEN` | Required for Blob writes | `src/lib/runtime-storage.js` | Vercel Blob read/write token. |

## Storage Modes

Storage behavior is controlled by:

```text
src/lib/runtime-storage.js
```

### Local Mode

Use this for normal development.

```env
dev_env_token=local
```

Behavior:

- JSON settings write to `src/data`.
- Blog posts write to `src/content/blog`.
- Custom pages write to `src/content/pages`.
- Images write to `public`.
- Admin auth files write to `data/auth`.

Best for:

- Local development.
- Editing content in the admin panel.
- Testing without Vercel Blob.

### Serverless Readonly Mode

This happens automatically on Vercel when no local mode is set and Blob is not enabled.

Behavior:

- Writes are blocked for content/settings that need persistence.
- Some image uploads may return inline data URLs.
- Admin settings/content edits may fail with a storage error.

Best for:

- Read-only deployments.
- Demo sites where editing from production admin is not needed.

### Pro-Ready Blob Mode

Use this for editable Vercel production.

```env
dev_env_token=pro-ready
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token_here
```

Behavior:

- Settings write to Blob paths like `admin-data/site.json`.
- Blog posts write to Blob paths like `blog-posts/post-name.md`.
- Custom pages write to Blob paths like `site-pages/page-name.md`.
- Uploaded assets write to Blob.
- Public pages read Blob content first, then local defaults.

Best for:

- Vercel production with admin editing enabled.
- Production content updates without rebuilding the site.

## Development Configuration

Use this for local coding.

### `.env.local`

```env
ADMIN_AUTH_SECRET=local-development-secret-change-me-123456
admin_password=$2a$12$replace-with-a-real-bcrypt-hash
dev_env_token=local
```

### Commands

```bash
npm install
npm run dev
```

### Expected Behavior

- Site runs with Astro dev server.
- Admin can save files locally.
- Content changes appear from local project files.
- No Vercel Blob token is required.

### Example: Switch Local Dev to Writable Filesystem

Set:

```env
dev_env_token=local
```

Then restart:

```bash
npm run dev
```

Use this if admin saves fail locally because the app thinks it is in read-only mode.

## Local Built Server Configuration

Use this to test the production build locally.

### Commands

```bash
npm run build
npm run start
```

### `.env.local`

```env
ADMIN_AUTH_SECRET=local-built-server-secret-1234567890
admin_password=$2a$12$replace-with-a-real-bcrypt-hash
dev_env_token=local
```

### Expected Behavior

- The site runs from `dist/server/entry.mjs`.
- Local writes still use the filesystem because `dev_env_token=local`.
- Uploaded images may also write to `dist/client` if that directory exists, so images can appear in the built server without a rebuild.

### Example: Watch Build Server During Development

```bash
npm run serve:watch
```

This rebuilds and starts the built server when files in `src` change.

## Vercel Development Preview

Use this to test Vercel-like behavior locally.

### Command

```bash
npm run preview
```

This runs:

```bash
vercel dev
```

### Local Vercel Preview with Filesystem Writes

```env
ADMIN_AUTH_SECRET=local-vercel-dev-secret-1234567890
admin_password=$2a$12$replace-with-a-real-bcrypt-hash
dev_env_token=local
```

Best for:

- Testing routes through Vercel dev.
- Still saving content to local files.

### Local Vercel Preview with Blob Behavior

```env
ADMIN_AUTH_SECRET=local-vercel-blob-secret-1234567890
admin_password=$2a$12$replace-with-a-real-bcrypt-hash
dev_env_token=pro-ready
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token_here
```

Best for:

- Testing production-style storage before deploying.
- Confirming Blob-backed admin edits work.

## Vercel Production Configuration

Set these in the Vercel project environment variables, not in `.env.local`.

### Editable Production Site

```env
ADMIN_AUTH_SECRET=production-long-random-secret-at-least-32-characters
ADMIN_PASSWORD=$2a$12$replace-with-a-real-bcrypt-hash
DEV_ENV_TOKEN=pro-ready
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token_here
```

Behavior:

- Admin login works.
- Admin saves content/settings to Vercel Blob.
- Uploaded images persist in Blob.
- Public pages read Blob content first.

### Read-Only Production Site

```env
ADMIN_AUTH_SECRET=production-long-random-secret-at-least-32-characters
ADMIN_PASSWORD=$2a$12$replace-with-a-real-bcrypt-hash
```

Do not set:

```env
DEV_ENV_TOKEN=pro-ready
BLOB_READ_WRITE_TOKEN=...
```

Behavior:

- Public site works from bundled code/content.
- Admin routes can authenticate, but write operations that require storage may fail.
- Use this only when production admin editing is not needed.

### Recommended Vercel Settings

- Node version: `22.x`.
- Build command: `npm run build`.
- Output/build handling: Vercel adapter controls this.
- Environment variables: set separately for Production, Preview, and Development if needed.
- Blob store: required for production admin editing.

## Production on a Non-Vercel Server

The current project is configured with:

```js
adapter: vercel()
```

That is best for Vercel. The existing `start` script runs:

```bash
node dist/server/entry.mjs
```

If you want a generic Node server deployment, consider switching to the Astro Node adapter.

### Example: Switch to Node Adapter

Install:

```bash
npm install @astrojs/node
```

Change `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";
import node from "@astrojs/node";

export default defineConfig({
  integrations: [tailwind(), preact()],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});
```

Then build and run:

```bash
npm run build
node dist/server/entry.mjs
```

Use local writable storage:

```env
ADMIN_AUTH_SECRET=server-long-random-secret-at-least-32-characters
ADMIN_PASSWORD=$2a$12$replace-with-a-real-bcrypt-hash
DEV_ENV_TOKEN=local
```

Use Blob storage from a server:

```env
ADMIN_AUTH_SECRET=server-long-random-secret-at-least-32-characters
ADMIN_PASSWORD=$2a$12$replace-with-a-real-bcrypt-hash
DEV_ENV_TOKEN=pro-ready
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token_here
```

## Admin Password Configuration

The admin password is stored as a bcrypt hash.

Supported environment variable names:

```env
admin_password=...
ADMIN_PASSWORD=...
```

The code first checks the local admin record in:

```text
data/auth/admin.json
```

If that does not exist, it can use the environment password hash.

### Example: Generate a Bcrypt Hash

Run this locally:

```bash
node -e "import bcrypt from 'bcryptjs'; const password = process.argv[1]; console.log(bcrypt.hashSync(password, 12));" "your-new-password"
```

Put the output in `.env.local` for development:

```env
admin_password=$2a$12$generatedHashGoesHere
```

Or put it in Vercel as:

```env
ADMIN_PASSWORD=$2a$12$generatedHashGoesHere
```

### Example: Change Password Through Admin

Use:

```text
/admin/password
```

That saves the new hash to:

```text
data/auth/admin.json
```

For deployed production, make sure the runtime storage strategy supports the way you want password changes to persist.

## Admin Token Configuration

Token settings live in:

```text
src/lib/admin-auth.js
```

Current values:

```js
export const ACCESS_MAX_AGE_SECONDS = 15 * 60;
export const REFRESH_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
const MIN_AUTH_SECRET_LENGTH = 32;
```

### Example: Longer Access Token

Before:

```js
export const ACCESS_MAX_AGE_SECONDS = 15 * 60;
```

After:

```js
export const ACCESS_MAX_AGE_SECONDS = 30 * 60;
```

Run:

```bash
npm run build
```

Use longer access tokens only if you accept a longer window before access cookies expire.

## Storage Configuration Examples

### Example: Local Dev Content Editing

```env
ADMIN_AUTH_SECRET=dev-secret-at-least-32-characters-long
admin_password=$2a$12$replace-with-a-real-bcrypt-hash
dev_env_token=local
```

Run:

```bash
npm run dev
```

### Example: Vercel Production with Admin Editing

```env
ADMIN_AUTH_SECRET=prod-secret-at-least-32-characters-long
ADMIN_PASSWORD=$2a$12$replace-with-a-real-bcrypt-hash
DEV_ENV_TOKEN=pro-ready
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token_here
```

Deploy:

```bash
npm run build
```

Vercel runs the build during deployment.

### Example: Vercel Preview with Same Storage as Production

Set Preview environment variables in Vercel:

```env
ADMIN_AUTH_SECRET=preview-secret-at-least-32-characters-long
ADMIN_PASSWORD=$2a$12$replace-with-a-real-bcrypt-hash
DEV_ENV_TOKEN=pro-ready
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token_here
```

Use this when preview deployments should support admin edits.

### Example: Vercel Preview Without Writes

Set:

```env
ADMIN_AUTH_SECRET=preview-secret-at-least-32-characters-long
ADMIN_PASSWORD=$2a$12$replace-with-a-real-bcrypt-hash
```

Leave Blob variables unset.

Use this when preview deployments should be read-only.

## Astro Configuration Examples

### Example: Allow Another Remote Image Host

Change `astro.config.mjs`.

Before:

```js
image: {
  remotePatterns: [
    { protocol: "https" },
    { protocol: "http", hostname: "127.0.0.1" },
    { protocol: "http", hostname: "localhost" },
  ],
},
```

After:

```js
image: {
  remotePatterns: [
    { protocol: "https" },
    { protocol: "http", hostname: "127.0.0.1" },
    { protocol: "http", hostname: "localhost" },
    { protocol: "https", hostname: "images.example.com" },
  ],
},
```

Then run:

```bash
npm run build
```

### Example: Change Markdown Code Theme

Before:

```js
markdown: {
  shikiConfig: {
    theme: "github-dark",
  },
},
```

After:

```js
markdown: {
  shikiConfig: {
    theme: "dracula",
  },
},
```

Then run:

```bash
npm run build
```

### Example: Add Another Astro Integration

Install the integration:

```bash
npm install @astrojs/sitemap
```

Change:

```js
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  integrations: [tailwind(), preact(), sitemap()],
});
```

If the integration requires a site URL, add:

```js
export default defineConfig({
  site: "https://example.com",
  integrations: [tailwind(), preact(), sitemap()],
});
```

## Site Data Configuration Examples

These settings can be edited through admin pages or by editing JSON files in `src/data`.

### Header and Footer

File:

```text
src/data/site.json
```

Admin screen:

```text
/admin/site
```

Example:

```json
{
  "brandName": "Astro Blog CMS",
  "navLinks": [
    { "label": "Home", "href": "/" },
    { "label": "Blog", "href": "/blog" },
    { "label": "Gallery", "href": "/gallery" }
  ],
  "footerText": "Built with Astro and Tailwind CSS"
}
```

Validation logic:

```text
src/lib/site-config.js
```

### Hero

File:

```text
src/data/hero.json
```

Admin screen:

```text
/admin/hero
```

Validation logic:

```text
src/lib/hero-config.js
```

### Home Sections

File:

```text
src/data/home-sections.json
```

Admin screen:

```text
/admin/home-sections
```

Validation logic:

```text
src/lib/home-sections.js
```

### Gallery

File:

```text
src/data/gallery.json
```

Admin screen:

```text
/admin/gallery
```

Validation logic:

```text
src/lib/gallery-config.js
```

## Changing Configuration Safely

### If You Add a New Environment Variable

1. Read it in one shared helper module.
2. Normalize and validate the value.
3. Document it in `config.md`.
4. Add it to local `.env.local` only if needed.
5. Add it to Vercel environment variables if needed in production.

Example helper:

```js
function getFeatureFlag() {
  return String(process.env.MY_FEATURE_FLAG || "").toLowerCase() === "true";
}
```

### If You Add a New JSON Setting

1. Add a default value in the matching `src/lib/*-config.js` file.
2. Normalize it in the same helper.
3. Add it to the matching API route.
4. Add admin controls in the matching component.
5. Render it in the public page or layout.

Example:

```js
export const DEFAULT_SITE_CONFIG = {
  showSearchLink: true,
};
```

### If You Change Deployment Target

For Vercel:

```js
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "server",
  adapter: vercel(),
});
```

For a generic Node server:

```js
import node from "@astrojs/node";

export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
});
```

After changing adapters:

```bash
npm install
npm run build
```

## Common Problems

### Error: `ADMIN_AUTH_SECRET must be set`

Set:

```env
ADMIN_AUTH_SECRET=long-random-value-at-least-32-characters
```

Then restart the server.

### Admin Saves Fail on Vercel

Production probably has no Blob write storage.

Set:

```env
DEV_ENV_TOKEN=pro-ready
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token_here
```

Then redeploy.

### Admin Saves Fail Locally

Make sure `.env.local` contains:

```env
dev_env_token=local
```

Then restart:

```bash
npm run dev
```

### Images Save but Do Not Appear in Built Server

Run a fresh build:

```bash
npm run build
npm run start
```

The upload code writes to `dist/client` only when that directory exists.

### Vercel Does Not See Environment Changes

After changing Vercel environment variables, redeploy the project.

### Build Uses Wrong Node Version

Confirm `package.json` includes:

```json
"engines": {
  "node": "22.x"
}
```

Then make sure the deployment platform uses Node 22.

## Recommended Configurations

### Local Development

```env
ADMIN_AUTH_SECRET=dev-secret-at-least-32-characters-long
admin_password=$2a$12$replace-with-a-real-bcrypt-hash
dev_env_token=local
```

Command:

```bash
npm run dev
```

### Local Production Build Test

```env
ADMIN_AUTH_SECRET=local-build-secret-at-least-32-characters
admin_password=$2a$12$replace-with-a-real-bcrypt-hash
dev_env_token=local
```

Commands:

```bash
npm run build
npm run start
```

### Vercel Production Editable CMS

```env
ADMIN_AUTH_SECRET=prod-secret-at-least-32-characters-long
ADMIN_PASSWORD=$2a$12$replace-with-a-real-bcrypt-hash
DEV_ENV_TOKEN=pro-ready
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token_here
```

Vercel build command:

```bash
npm run build
```

### Vercel Production Read-Only Site

```env
ADMIN_AUTH_SECRET=prod-secret-at-least-32-characters-long
ADMIN_PASSWORD=$2a$12$replace-with-a-real-bcrypt-hash
```

Use this only if production admin editing is not required.

## Configuration Checklist Before Deploy

- `ADMIN_AUTH_SECRET` is set and at least 32 characters.
- `ADMIN_PASSWORD` or a stored admin password exists.
- Node version is `22.x`.
- `npm run build` passes locally.
- Vercel production environment variables are set.
- `BLOB_READ_WRITE_TOKEN` is set if production admin editing is required.
- `DEV_ENV_TOKEN=pro-ready` is set if production should use Blob storage.
- `.env.local` is not committed.
- Auth session files are not used as public documentation.
- Public pages still load after changing config.

## Quick Reference

| Goal | Change |
| --- | --- |
| Local writable admin | `dev_env_token=local` |
| Production editable admin on Vercel | `DEV_ENV_TOKEN=pro-ready` plus `BLOB_READ_WRITE_TOKEN` |
| Production read-only site | Leave Blob variables unset |
| Change deployment adapter | Edit `astro.config.mjs` |
| Change Node version | Edit `package.json` `engines.node` |
| Change admin token lifetime | Edit `src/lib/admin-auth.js` |
| Change storage behavior | Edit `src/lib/runtime-storage.js` |
| Change header/footer defaults | Edit `src/lib/site-config.js` and `src/data/site.json` |
| Change hero defaults | Edit `src/lib/hero-config.js` and `src/data/hero.json` |
