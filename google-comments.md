# Google Comments Manual

This manual explains how to add comments to blog post pages using Google Account sign-in. The recommended flow is:

1. Render a comment box on `src/pages/blog/[slug].astro`.
2. Show a Sign in with Google button.
3. Send Google's ID token to an Astro API route.
4. Verify the ID token on the server.
5. Create a lightweight local comments session cookie.
6. Allow signed-in readers to post comments.
7. Store comments locally or in Vercel Blob.
8. Add moderation controls for the admin.

Official references:

- Google Sign in with Google button guide: https://developers.google.com/identity/gsi/web/guides/display-button
- Google backend ID token verification: https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
- Google Identity Services HTML API: https://developers.google.com/identity/gsi/web/reference/html-reference
- Google Auth Library for Node.js `verifyIdToken`: https://cloud.google.com/nodejs/docs/reference/google-auth-library/latest/google-auth-library/verifyidtokenoptions

## Recommended Architecture

Use Google Identity Services for authentication, then store comments inside this app.

```text
Blog post page
  -> loads Google Identity Services script
  -> reader signs in with Google
  -> browser receives Google JWT credential
  -> browser sends credential to /api/comments/google-login
  -> server verifies ID token with Google Auth Library
  -> server sets comment session cookie
  -> reader posts comment to /api/comments/create
  -> server stores comment in local JSON or Vercel Blob
  -> public page loads approved comments from /api/comments/list
```

Do not store or trust plain Google user IDs sent by the browser. The backend must verify the Google ID token first.

## What This Adds

New files:

```text
src/components/Comments.jsx
src/lib/comment-auth.js
src/lib/comments.js
src/pages/api/comments/session.js
src/pages/api/comments/google-login.js
src/pages/api/comments/logout.js
src/pages/api/comments/list.js
src/pages/api/comments/create.js
src/pages/api/comments/delete.js
```

Existing files to edit:

```text
src/pages/blog/[slug].astro
src/middleware.js
package.json
.env.local
```

Optional admin files:

```text
src/components/CommentsAdmin.jsx
src/pages/admin/comments.astro
src/pages/api/comments/admin-list.js
src/pages/api/comments/approve.js
```

## Google Cloud Setup

### 1. Create OAuth Client

In Google Cloud Console:

1. Create or select a project.
2. Configure the OAuth consent screen.
3. Create OAuth client credentials.
4. Choose **Web application**.
5. Add authorized JavaScript origins.

Local origin:

```text
http://localhost:4321
```

Production origin:

```text
https://your-domain.com
```

For the JavaScript callback flow in this guide, you do not need a redirect URI. If you use `data-login_uri` instead, add that login endpoint as an authorized redirect URI.

### 2. Add Environment Variables

Local `.env.local`:

```env
PUBLIC_GOOGLE_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
COMMENT_AUTH_SECRET=long-random-comment-secret-at-least-32-characters
dev_env_token=local
```

Vercel production:

```env
PUBLIC_GOOGLE_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
COMMENT_AUTH_SECRET=long-random-comment-secret-at-least-32-characters
DEV_ENV_TOKEN=pro-ready
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

Why two Google client ID variables:

- `PUBLIC_GOOGLE_CLIENT_ID` is safe to expose to the browser.
- `GOOGLE_CLIENT_ID` is used by the backend to verify the ID token audience.

Both values should normally be the same web client ID.

## Install Google Auth Library

```bash
npm install google-auth-library
```

This is used by the backend to verify Google ID tokens.

## Add Comment Session Auth Helper

Create:

```text
src/lib/comment-auth.js
```

Example:

```js
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const COMMENT_COOKIE = "comment_user_token";
const COMMENT_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
const MIN_SECRET_LENGTH = 32;

function getCommentSecret() {
  const secret = process.env.COMMENT_AUTH_SECRET || "";
  if (secret.length < MIN_SECRET_LENGTH) {
    throw new Error("COMMENT_AUTH_SECRET must be at least 32 characters.");
  }
  return secret;
}

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(value) {
  const normalized = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(normalized + padding, "base64").toString("utf8");
}

function sign(value) {
  return createHmac("sha256", getCommentSecret())
    .update(value)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left || ""));
  const rightBuffer = Buffer.from(String(right || ""));
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function createCommentToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user.sub,
    name: user.name,
    email: user.email,
    picture: user.picture,
    iat: now,
    exp: now + COMMENT_MAX_AGE_SECONDS,
    nonce: randomBytes(12).toString("hex"),
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifyCommentToken(token) {
  try {
    const [encodedPayload, signature] = String(token || "").split(".");
    if (!encodedPayload || !signature) return null;
    if (!safeEqual(signature, sign(encodedPayload))) return null;

    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (!payload.sub || !payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getCommentCookieOptions(url, maxAge = COMMENT_MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    secure: new URL(url).protocol === "https:",
    sameSite: "strict",
    path: "/",
    maxAge,
  };
}

export function getCommentUser(cookies) {
  return verifyCommentToken(cookies.get(COMMENT_COOKIE)?.value);
}
```

## Add Comments Storage Helper

Create:

```text
src/lib/comments.js
```

Example:

```js
import fs from "node:fs/promises";
import path from "node:path";
import {
  isReadonlyRuntime,
  readJsonBlob,
  writeJsonBlob,
} from "./runtime-storage.js";

const COMMENTS_DIR = path.join(process.cwd(), "data", "comments");
const COMMENTS_BLOB_PREFIX = "comments/";
const MAX_COMMENT_LENGTH = 2000;

export function normalizeCommentSlug(value) {
  const slug = String(value || "").normalize("NFC").trim();
  if (!slug || slug.includes("..") || /[\\/]/.test(slug) || /[\0<>:\"|?*]/.test(slug)) {
    return "";
  }
  return slug.replace(/\.md$/i, "");
}

export function sanitizeCommentBody(value) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim()
    .slice(0, MAX_COMMENT_LENGTH);
}

function getCommentPath(slug) {
  return path.join(COMMENTS_DIR, `${slug}.json`);
}

function getCommentBlobPath(slug) {
  return `${COMMENTS_BLOB_PREFIX}${slug}.json`;
}

export async function readComments(slug) {
  const safeSlug = normalizeCommentSlug(slug);
  if (!safeSlug) return [];

  const blobComments = await readJsonBlob(getCommentBlobPath(safeSlug));
  if (Array.isArray(blobComments)) return blobComments;

  try {
    const raw = await fs.readFile(getCommentPath(safeSlug), "utf8");
    const comments = JSON.parse(raw);
    return Array.isArray(comments) ? comments : [];
  } catch {
    return [];
  }
}

export async function writeComments(slug, comments) {
  const safeSlug = normalizeCommentSlug(slug);
  if (!safeSlug) throw new Error("Invalid post slug");

  const normalized = Array.isArray(comments) ? comments : [];

  if (isReadonlyRuntime()) {
    await writeJsonBlob(getCommentBlobPath(safeSlug), normalized);
    return normalized;
  }

  await fs.mkdir(COMMENTS_DIR, { recursive: true });
  await fs.writeFile(getCommentPath(safeSlug), `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  return normalized;
}

export async function addComment(slug, user, body) {
  const safeBody = sanitizeCommentBody(body);
  if (!safeBody) throw new Error("Comment cannot be empty");

  const comments = await readComments(slug);
  const comment = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    status: "approved",
    body: safeBody,
    author: {
      sub: user.sub,
      name: user.name || "Google user",
      picture: user.picture || "",
    },
    createdAt: new Date().toISOString(),
  };

  comments.push(comment);
  await writeComments(slug, comments);
  return comment;
}

export function publicCommentView(comment) {
  return {
    id: comment.id,
    status: comment.status,
    body: comment.body,
    author: {
      name: comment.author?.name || "Google user",
      picture: comment.author?.picture || "",
    },
    createdAt: comment.createdAt,
  };
}
```

Privacy note: Do not expose commenter email addresses publicly. Store only what is required.

## Add Google Login API

Create:

```text
src/pages/api/comments/google-login.js
```

Example:

```js
import { OAuth2Client } from "google-auth-library";
import {
  COMMENT_COOKIE,
  createCommentToken,
  getCommentCookieOptions,
} from "../../../lib/comment-auth.js";

export const prerender = false;

const client = new OAuth2Client();

export async function POST({ request, cookies }) {
  try {
    const { credential } = await request.json();
    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      return Response.json({ error: "GOOGLE_CLIENT_ID is not configured" }, { status: 500 });
    }

    if (!credential) {
      return Response.json({ error: "Google credential is required" }, { status: 400 });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();

    if (!payload?.sub) {
      return Response.json({ error: "Invalid Google account" }, { status: 401 });
    }

    if (payload.email_verified === false) {
      return Response.json({ error: "Google email is not verified" }, { status: 403 });
    }

    const user = {
      sub: payload.sub,
      name: payload.name || payload.email || "Google user",
      email: payload.email || "",
      picture: payload.picture || "",
    };

    cookies.set(
      COMMENT_COOKIE,
      createCommentToken(user),
      getCommentCookieOptions(request.url),
    );

    return Response.json({
      user: {
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Google comment login failed:", error);
    return Response.json({ error: "Google sign-in failed" }, { status: 401 });
  }
}
```

Google's backend verification requirements include checking the token signature, `aud`, `iss`, and `exp`. `google-auth-library` handles these checks when `verifyIdToken()` is called with the correct audience.

## Add Comment Session API

Create:

```text
src/pages/api/comments/session.js
```

Example:

```js
import { getCommentUser } from "../../../lib/comment-auth.js";

export const prerender = false;

export async function GET({ cookies }) {
  const user = getCommentUser(cookies);

  return Response.json({
    user: user
      ? {
          name: user.name,
          picture: user.picture,
        }
      : null,
  });
}
```

## Add Comment Logout API

Create:

```text
src/pages/api/comments/logout.js
```

Example:

```js
import {
  COMMENT_COOKIE,
  getCommentCookieOptions,
} from "../../../lib/comment-auth.js";

export const prerender = false;

export async function POST({ request, cookies }) {
  cookies.delete(COMMENT_COOKIE, getCommentCookieOptions(request.url, 0));
  return Response.json({ success: true });
}
```

## Add List Comments API

Create:

```text
src/pages/api/comments/list.js
```

Example:

```js
import { publicCommentView, readComments } from "../../../lib/comments.js";

export const prerender = false;

export async function GET({ url }) {
  const slug = url.searchParams.get("slug");
  const comments = await readComments(slug);

  return Response.json({
    comments: comments
      .filter((comment) => comment.status === "approved")
      .map(publicCommentView),
  });
}
```

## Add Create Comment API

Create:

```text
src/pages/api/comments/create.js
```

Example:

```js
import { getCommentUser } from "../../../lib/comment-auth.js";
import { addComment, publicCommentView } from "../../../lib/comments.js";

export const prerender = false;

const rateLimitBuckets = new Map();

function getClientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function checkRateLimit(request) {
  const now = Date.now();
  const key = `comment:${getClientIp(request)}`;
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  bucket.count += 1;
  return bucket.count <= 5;
}

export async function POST({ request, cookies }) {
  try {
    if (!checkRateLimit(request)) {
      return Response.json({ error: "Too many comments. Try again soon." }, { status: 429 });
    }

    const user = getCommentUser(cookies);
    if (!user) {
      return Response.json({ error: "Sign in with Google to comment" }, { status: 401 });
    }

    const { slug, body } = await request.json();
    const comment = await addComment(slug, user, body);

    return Response.json({
      success: true,
      comment: publicCommentView(comment),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
```

## Add Comments Component

Create:

```text
src/components/Comments.jsx
```

Example:

```jsx
import { useEffect, useRef, useState } from "preact/hooks";

export default function Comments({ slug, googleClientId }) {
  const buttonRef = useRef(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadSession() {
    const response = await fetch("/api/comments/session");
    const data = await response.json();
    setUser(data.user || null);
  }

  async function loadComments() {
    const params = new URLSearchParams({ slug });
    const response = await fetch(`/api/comments/list?${params.toString()}`);
    const data = await response.json();
    setComments(data.comments || []);
  }

  async function handleCredentialResponse(response) {
    setError("");
    const loginResponse = await fetch("/api/comments/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response.credential }),
    });
    const data = await loginResponse.json();

    if (!loginResponse.ok) {
      setError(data.error || "Google sign-in failed");
      return;
    }

    setUser(data.user);
  }

  async function submitComment(event) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const response = await fetch("/api/comments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, body }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not save comment");
        return;
      }

      setComments((current) => [...current, data.comment]);
      setBody("");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/comments/logout", { method: "POST" });
    setUser(null);
  }

  useEffect(() => {
    loadSession();
    loadComments();
  }, [slug]);

  useEffect(() => {
    if (!googleClientId || user || !buttonRef.current) return;

    const render = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
      });
    };

    if (window.google?.accounts?.id) {
      render();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = render;
    document.head.appendChild(script);
  }, [googleClientId, user]);

  return (
    <section class="mt-10 border-t border-slate-200 pt-8">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-950">Comments</h2>
          <p class="mt-1 text-sm text-slate-600">
            Sign in with Google to join the discussion.
          </p>
        </div>
        {!user && <div ref={buttonRef}></div>}
      </div>

      {error && (
        <p class="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {user && (
        <form onSubmit={submitComment} class="mt-6 rounded-md border border-slate-200 bg-slate-50 p-4">
          <div class="mb-3 flex items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-3">
              {user.picture && (
                <img src={user.picture} alt="" class="h-9 w-9 rounded-full" />
              )}
              <p class="truncate text-sm font-semibold text-slate-800">
                Commenting as {user.name}
              </p>
            </div>
            <button type="button" onClick={logout} class="text-sm font-semibold text-slate-500 hover:text-slate-800">
              Sign out
            </button>
          </div>
          <textarea
            value={body}
            onInput={(event) => setBody(event.currentTarget.value)}
            rows={4}
            maxLength={2000}
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a comment..."
            required
          />
          <div class="mt-3 flex items-center justify-between gap-3">
            <p class="text-xs text-slate-500">{body.length}/2000</p>
            <button
              type="submit"
              disabled={saving || !body.trim()}
              class="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      )}

      <div class="mt-6 grid gap-4">
        {comments.length === 0 ? (
          <p class="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600">
            No comments yet.
          </p>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} class="rounded-md border border-slate-200 bg-white p-4">
              <div class="flex items-center gap-3">
                {comment.author.picture && (
                  <img src={comment.author.picture} alt="" class="h-9 w-9 rounded-full" />
                )}
                <div>
                  <p class="text-sm font-semibold text-slate-900">{comment.author.name}</p>
                  <time class="text-xs text-slate-500" dateTime={comment.createdAt}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </time>
                </div>
              </div>
              <p class="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {comment.body}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
```

## Render Comments on Blog Posts

Edit:

```text
src/pages/blog/[slug].astro
```

Add import:

```astro
import Comments from "../../components/Comments.jsx";
```

Add server variable near the other constants:

```astro
const googleClientId = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID;
```

Render near the bottom of the article, before or after the "Back to Blog" links:

```astro
{googleClientId && (
  <Comments
    client:load
    slug={safeSlug}
    googleClientId={googleClientId}
  />
)}
```

If `PUBLIC_GOOGLE_CLIENT_ID` is missing, the comments UI will not render.

## Protect Admin Comment APIs in Middleware

Public comment APIs:

```text
/api/comments/session
/api/comments/google-login
/api/comments/logout
/api/comments/list
/api/comments/create
```

These can stay public because they have their own Google/comment-session checks.

Admin-only comment APIs, if added later, should be protected in:

```text
src/middleware.js
```

Example:

```js
const ADMIN_API_PATHS = new Set([
  "/api/comments/admin-list",
  "/api/comments/delete",
  "/api/comments/approve",
]);

const MUTATING_ADMIN_API_PATHS = new Set([
  "/api/comments/delete",
  "/api/comments/approve",
]);
```

## Add Admin Delete API

Create:

```text
src/pages/api/comments/delete.js
```

Protect it in `src/middleware.js`.

Example:

```js
import { readComments, writeComments } from "../../../lib/comments.js";

export const prerender = false;

export async function POST({ request }) {
  const { slug, id } = await request.json();
  const comments = await readComments(slug);
  const nextComments = comments.filter((comment) => comment.id !== id);
  await writeComments(slug, nextComments);

  return Response.json({ success: true });
}
```

## Optional: Moderation Instead of Auto-Approve

In `src/lib/comments.js`, change:

```js
status: "approved",
```

to:

```js
status: "pending",
```

Then add admin APIs:

```text
src/pages/api/comments/admin-list.js
src/pages/api/comments/approve.js
src/pages/api/comments/delete.js
```

Public `list.js` should continue to show only:

```js
comment.status === "approved"
```

## Optional: Restrict Comments to One Google Workspace Domain

In `google-login.js`, after `ticket.getPayload()`:

```js
const allowedDomain = process.env.GOOGLE_COMMENTS_ALLOWED_DOMAIN;

if (allowedDomain && payload.hd !== allowedDomain) {
  return Response.json({ error: "This Google domain cannot comment" }, { status: 403 });
}
```

Environment:

```env
GOOGLE_COMMENTS_ALLOWED_DOMAIN=example.com
```

Use the `hd` claim for Workspace domain checks. Do not rely only on the email domain.

## Optional: Blocklist Users

Add environment variable:

```env
GOOGLE_COMMENTS_BLOCKED_SUBS=sub1,sub2,sub3
```

Check in `google-login.js`:

```js
const blockedSubs = new Set(
  String(process.env.GOOGLE_COMMENTS_BLOCKED_SUBS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);

if (blockedSubs.has(payload.sub)) {
  return Response.json({ error: "This account cannot comment" }, { status: 403 });
}
```

## Optional: Email Notifications

When a comment is created, send an email to the site owner.

Recommended additions:

- `COMMENT_NOTIFICATION_EMAIL`
- email provider API key
- helper module such as `src/lib/comment-notifications.js`

Only send notifications after rate limit checks and successful comment save.

## Security Checklist

- Verify Google ID tokens on the server.
- Validate the ID token audience against `GOOGLE_CLIENT_ID`.
- Use the Google `sub` claim as the stable user ID.
- Do not use email as the database primary key.
- Do not expose commenter email addresses publicly.
- Set `COMMENT_AUTH_SECRET` to at least 32 characters.
- Store comment auth in `httpOnly` cookies.
- Rate-limit comment creation.
- Limit comment length.
- Escape/render comment text as text, not raw HTML.
- Moderate comments if the site is public.
- Use HTTPS in production.
- Configure authorized JavaScript origins in Google Cloud.

## Storage Checklist

### Local Dev

Use:

```env
dev_env_token=local
```

Comments save to:

```text
data/comments
```

### Vercel Production

Use:

```env
DEV_ENV_TOKEN=pro-ready
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

Comments save to Blob paths like:

```text
comments/post-slug.json
```

### Docker Local Mode

Mount:

```yaml
volumes:
  - ./data/comments:/app/data/comments
```

## Testing

### Local Test

1. Add `PUBLIC_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_ID`, and `COMMENT_AUTH_SECRET` to `.env.local`.
2. Add `http://localhost:4321` to Google Cloud authorized JavaScript origins.
3. Install the library:

```bash
npm install google-auth-library
```

4. Start dev server:

```bash
npm run dev
```

5. Open a post:

```text
http://localhost:4321/blog/example-slug
```

6. Sign in with Google.
7. Post a comment.
8. Refresh and confirm the comment appears.

### Build Test

```bash
npm run build
```

## Troubleshooting

### Google Button Does Not Appear

Check:

- `PUBLIC_GOOGLE_CLIENT_ID` exists.
- Browser can load `https://accounts.google.com/gsi/client`.
- The component is rendered with `client:load`.
- Authorized JavaScript origin includes the current site origin.

### Login API Returns 401

Check:

- `GOOGLE_CLIENT_ID` matches the client ID used in the browser.
- The ID token is sent as `credential`.
- The backend can reach Google's public keys.
- The token has not expired.

### Error: `GOOGLE_CLIENT_ID is not configured`

Set:

```env
GOOGLE_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
```

Then restart the server.

### Error: `COMMENT_AUTH_SECRET must be at least 32 characters`

Set:

```env
COMMENT_AUTH_SECRET=long-random-comment-secret-at-least-32-characters
```

Then restart the server.

### Comments Save Locally but Disappear After Restart

Persist:

```text
data/comments
```

For Docker, mount it as a volume. For Vercel production, use Blob storage.

### Comments Do Not Save on Vercel

Set:

```env
DEV_ENV_TOKEN=pro-ready
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

Then redeploy.

## Recommended First Version

Start with:

- Google sign-in button.
- Verified ID token login route.
- Comment session cookie.
- Approved-by-default comments.
- Public comment list.
- Rate limit.
- No HTML rendering in comments.

Add later:

- Admin moderation.
- Pending comments.
- Email notifications.
- Spam filters.
- User blocklist.
