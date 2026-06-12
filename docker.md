# Docker Manual

This guide explains how to run the Astro Blog CMS inside a Docker container. It includes Dockerfile examples, `.dockerignore`, Docker Compose, environment variables, local development, production, and persistent storage options.

The project currently uses Node `22.x`, Astro server output, and a Vercel adapter. The existing scripts are:

```json
{
  "dev": "astro dev",
  "build": "node ./node_modules/astro/astro.js build",
  "start": "node dist/server/entry.mjs",
  "preview": "vercel dev"
}
```

## Recommended Docker Approach

For this project, there are two good container options:

- **Option A: Keep the current Vercel adapter** and use the existing `npm run build` plus `npm run start` flow.
- **Option B: Switch to `@astrojs/node`** if you want a more standard generic Node server container.

Start with Option A because it requires no code changes.

## Important Docker Notes

- Containers are usually ephemeral. If you use `dev_env_token=local`, saved posts, settings, uploads, and admin sessions must be stored in mounted volumes.
- If you use `dev_env_token=pro-ready` with `BLOB_READ_WRITE_TOKEN`, content and uploaded assets can persist in Vercel Blob instead of container volumes.
- Never bake `.env.local` or production secrets into the Docker image.
- Use environment variables at runtime with `docker run --env-file`, Docker Compose, or your hosting platform.
- Use a Debian-based Node image for easier `sharp` support. Avoid Alpine unless you know how to handle native dependency differences.

## Docker Ignore File

Create a `.dockerignore` file at the project root.

```dockerignore
node_modules
dist
.astro
.git
.github
.vercel
.vscode

*.log
*.err.log
*.out.log
debug.log

.env
.env.*
!.env.example

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

Why:

- Keeps the image smaller.
- Prevents local build output from being copied.
- Prevents secrets from entering the image.
- Forces dependencies to install cleanly inside Docker.

## Option A: Dockerfile for Current Project

Create a `Dockerfile` at the project root.

```dockerfile
# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/src ./src
COPY --from=build /app/data ./data

EXPOSE 4321

CMD ["npm", "run", "start"]
```

This Dockerfile:

- Installs dependencies with `npm ci`.
- Builds the Astro app.
- Copies only the needed runtime files into the final image.
- Starts the server with `npm run start`.

## Build the Image

```bash
docker build -t astro-blog-cms .
```

## Run the Container Locally

Create a local env file named `docker.env`.

```env
ADMIN_AUTH_SECRET=local-docker-secret-at-least-32-characters
admin_password=$2a$12$replace-with-a-real-bcrypt-hash
dev_env_token=local
PORT=4321
HOST=0.0.0.0
```

Run:

```bash
docker run --rm \
  --name astro-blog-cms \
  --env-file docker.env \
  -p 4321:4321 \
  astro-blog-cms
```

Open:

```text
http://localhost:4321
```

On Windows PowerShell, use:

```powershell
docker run --rm `
  --name astro-blog-cms `
  --env-file docker.env `
  -p 4321:4321 `
  astro-blog-cms
```

## Generate an Admin Password Hash

The app expects a bcrypt hash, not a plain password.

Run:

```bash
node -e "import bcrypt from 'bcryptjs'; const password = process.argv[1]; console.log(bcrypt.hashSync(password, 12));" "your-admin-password"
```

Put the generated hash in `docker.env`:

```env
admin_password=$2a$12$generatedHashGoesHere
```

For production, use uppercase if preferred:

```env
ADMIN_PASSWORD=$2a$12$generatedHashGoesHere
```

Both names are supported by `src/lib/admin-auth.js`.

## Docker Compose: Local Filesystem Mode

Use this when you want admin edits to write into mounted local folders.

Create `docker-compose.yml`:

```yaml
services:
  astro-blog:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: astro-blog-cms
    ports:
      - "4321:4321"
    env_file:
      - docker.env
    environment:
      NODE_ENV: production
      HOST: 0.0.0.0
      PORT: 4321
      dev_env_token: local
    volumes:
      - ./src/content/blog:/app/src/content/blog
      - ./src/content/pages:/app/src/content/pages
      - ./src/data:/app/src/data
      - ./public:/app/public
      - ./data/auth:/app/data/auth
    restart: unless-stopped
```

Run:

```bash
docker compose up --build
```

Stop:

```bash
docker compose down
```

### What the Volumes Do

- `src/content/blog`: persists blog Markdown posts.
- `src/content/pages`: persists custom Markdown pages.
- `src/data`: persists editable JSON settings.
- `public`: persists uploaded images and public assets.
- `data/auth`: persists local admin password/session files.

Use bind mounts for development and simple self-hosted deployments. For production containers, Blob storage is usually cleaner.

## Docker Compose: Vercel Blob Mode

Use this when you want content and uploads to persist in Vercel Blob instead of container volumes.

Create `docker-compose.blob.yml`:

```yaml
services:
  astro-blog:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: astro-blog-cms-blob
    ports:
      - "4321:4321"
    env_file:
      - docker.env
    environment:
      NODE_ENV: production
      HOST: 0.0.0.0
      PORT: 4321
      dev_env_token: pro-ready
      BLOB_READ_WRITE_TOKEN: ${BLOB_READ_WRITE_TOKEN}
    restart: unless-stopped
```

`docker.env` example:

```env
ADMIN_AUTH_SECRET=blob-mode-secret-at-least-32-characters
ADMIN_PASSWORD=$2a$12$replace-with-a-real-bcrypt-hash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token_here
```

Run:

```bash
docker compose -f docker-compose.blob.yml up --build
```

In Blob mode:

- Blog posts are saved to `blog-posts/`.
- Custom pages are saved to `site-pages/`.
- Admin settings are saved to `admin-data/`.
- Uploaded assets are saved to Blob.

## Development Container

For live local development, you can run Astro dev inside Docker.

Create `Dockerfile.dev`:

```dockerfile
FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

Create `docker-compose.dev.yml`:

```yaml
services:
  astro-blog-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: astro-blog-cms-dev
    ports:
      - "4321:4321"
    env_file:
      - docker.env
    environment:
      dev_env_token: local
      HOST: 0.0.0.0
      PORT: 4321
    volumes:
      - .:/app
      - /app/node_modules
    restart: unless-stopped
```

Run:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Use this for coding. Use the production Dockerfile for deployment.

## Production Container with Local Storage

If you deploy the container to a VPS and want local filesystem persistence, create host folders:

```bash
mkdir -p runtime/src/content/blog
mkdir -p runtime/src/content/pages
mkdir -p runtime/src/data
mkdir -p runtime/public
mkdir -p runtime/data/auth
```

Copy existing content into those folders before first run:

```bash
cp -r src/content/blog/* runtime/src/content/blog/
cp -r src/content/pages/* runtime/src/content/pages/
cp -r src/data/* runtime/src/data/
cp -r public/* runtime/public/
```

Then mount:

```yaml
volumes:
  - ./runtime/src/content/blog:/app/src/content/blog
  - ./runtime/src/content/pages:/app/src/content/pages
  - ./runtime/src/data:/app/src/data
  - ./runtime/public:/app/public
  - ./runtime/data/auth:/app/data/auth
```

Use:

```env
dev_env_token=local
```

This approach works, but backups become your responsibility.

## Production Container with Blob Storage

For production, the simplest persistence strategy is:

```env
DEV_ENV_TOKEN=pro-ready
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token_here
ADMIN_AUTH_SECRET=production-secret-at-least-32-characters
ADMIN_PASSWORD=$2a$12$replace-with-a-real-bcrypt-hash
```

Then you do not need to mount content and upload volumes for CMS edits.

You may still want a small volume for:

```text
data/auth
```

because local admin password/session files live there. If you rely only on `ADMIN_PASSWORD` and do not need local password changes to persist, you can skip that volume.

## Option B: Use Astro Node Adapter for Docker

The current project uses the Vercel adapter. For a pure Docker deployment, the Astro Node adapter is often a better fit.

Install:

```bash
npm install @astrojs/node
```

Change `astro.config.mjs`:

```js
// @ts-check
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

Then build:

```bash
npm run build
```

The existing start script should still be:

```json
"start": "node dist/server/entry.mjs"
```

Use the same production Dockerfile after switching adapters.

## Environment Variable Reference

| Variable | Local Dev | Docker Production | Blob Production | Description |
| --- | --- | --- | --- | --- |
| `ADMIN_AUTH_SECRET` | Required | Required | Required | Signs admin tokens. At least 32 characters. |
| `admin_password` | Optional | Optional | Optional | Lowercase initial bcrypt password hash. |
| `ADMIN_PASSWORD` | Optional | Recommended | Recommended | Uppercase initial bcrypt password hash. |
| `dev_env_token` | `local` | `local` or `pro-ready` | `pro-ready` | Lowercase storage mode. |
| `DEV_ENV_TOKEN` | Optional | `local` or `pro-ready` | `pro-ready` | Uppercase storage mode. |
| `BLOB_READ_WRITE_TOKEN` | Optional | Optional | Required | Enables Vercel Blob reads/writes. |
| `HOST` | `0.0.0.0` | `0.0.0.0` | `0.0.0.0` | Allows traffic from outside the container. |
| `PORT` | `4321` | `4321` | `4321` | Server port. |
| `NODE_ENV` | `development` | `production` | `production` | Runtime mode. |

## Docker Commands

### Build

```bash
docker build -t astro-blog-cms .
```

### Run

```bash
docker run --rm --env-file docker.env -p 4321:4321 astro-blog-cms
```

### Run in Background

```bash
docker run -d \
  --name astro-blog-cms \
  --env-file docker.env \
  -p 4321:4321 \
  astro-blog-cms
```

### View Logs

```bash
docker logs -f astro-blog-cms
```

### Stop

```bash
docker stop astro-blog-cms
```

### Remove Container

```bash
docker rm astro-blog-cms
```

### Rebuild Without Cache

```bash
docker build --no-cache -t astro-blog-cms .
```

## Health Check Example

You can add a Docker health check if your runtime image has a health-check tool available.

Example using Node:

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:4321/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
```

Add it before `CMD` in the final Dockerfile stage.

## Nginx Reverse Proxy Example

If running on a VPS, put Nginx in front of the container.

Example Nginx site:

```nginx
server {
  listen 80;
  server_name example.com;

  location / {
    proxy_pass http://127.0.0.1:4321;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Then run the container bound to localhost only:

```bash
docker run -d \
  --name astro-blog-cms \
  --env-file docker.env \
  -p 127.0.0.1:4321:4321 \
  astro-blog-cms
```

## Backup Strategy

### If Using Local Mode

Back up:

```text
src/content/blog
src/content/pages
src/data
public
data/auth
```

If using Docker volumes, back up the host-mounted folders.

### If Using Blob Mode

Back up:

- Vercel Blob content.
- Environment variables.
- Any mounted `data/auth` folder if password changes happen inside the container.

## Common Problems

### Container Starts but Site Is Not Reachable

Check:

- `HOST=0.0.0.0`
- `PORT=4321`
- `-p 4321:4321`
- Container logs with `docker logs`.

### Admin Save Fails in Docker

If using local mode, make sure folders are writable and mounted:

```text
/app/src/content/blog
/app/src/content/pages
/app/src/data
/app/public
/app/data/auth
```

If using Blob mode, make sure:

```env
dev_env_token=pro-ready
BLOB_READ_WRITE_TOKEN=valid_token
```

### Images Upload but Disappear After Restart

The `public` folder was not persisted.

Use a volume:

```yaml
volumes:
  - ./public:/app/public
```

Or use Blob mode.

### Password Change Disappears After Restart

The `data/auth` folder was not persisted.

Use:

```yaml
volumes:
  - ./data/auth:/app/data/auth
```

Or keep password management outside the container through environment variables.

### Build Fails Around Sharp

Use:

```dockerfile
FROM node:22-bookworm-slim
```

Avoid `node:alpine` unless you intentionally handle native dependencies.

### Production Container Cannot Write Files

The container filesystem may be read-only or discarded on restart.

Use one of these:

- Mounted volumes with `dev_env_token=local`.
- Blob storage with `dev_env_token=pro-ready` and `BLOB_READ_WRITE_TOKEN`.

## Final Production Checklist

- Docker image builds successfully.
- `.dockerignore` excludes secrets and logs.
- `ADMIN_AUTH_SECRET` is set at runtime.
- `ADMIN_PASSWORD` or stored admin password exists.
- `HOST=0.0.0.0`.
- `PORT=4321`.
- Storage mode is chosen intentionally.
- Local mode has persistent volumes.
- Blob mode has `BLOB_READ_WRITE_TOKEN`.
- Public site opens at `/`.
- Admin login opens at `/admin/login`.
- Admin save actions work after container restart.
- Uploaded images still exist after container restart.
