import { defineMiddleware } from "astro:middleware";
import {
  ACCESS_COOKIE,
  ensureCsrfCookie,
  hasAdminPasswordHash,
  REFRESH_COOKIE,
  rotateRefreshSession,
  verifyAdminToken,
  verifyCsrfToken,
} from "./lib/admin-auth.js";

const ADMIN_API_PATHS = new Set([
  "/api/admin/change-password",
  "/api/admin/logout",
  "/api/delete-page",
  "/api/delete-post",
  "/api/delete-upload-image",
  "/api/gallery-settings",
  "/api/get-page",
  "/api/get-post",
  "/api/hero-settings",
  "/api/home-sections",
  "/api/how-it-works",
  "/api/list-pages",
  "/api/save-page",
  "/api/save-post",
  "/api/site-settings",
  "/api/upload-editor-image",
  "/api/upload-stats",
]);

const MUTATING_ADMIN_API_PATHS = new Set([
  "/api/admin/change-password",
  "/api/admin/logout",
  "/api/delete-page",
  "/api/delete-post",
  "/api/delete-upload-image",
  "/api/gallery-settings",
  "/api/hero-settings",
  "/api/home-sections",
  "/api/how-it-works",
  "/api/save-page",
  "/api/save-post",
  "/api/site-settings",
  "/api/upload-editor-image",
]);

function isProtectedAdminPage(pathname) {
  return (
    (pathname === "/admin" || pathname.startsWith("/admin/")) &&
    pathname !== "/admin/login"
  );
}

function isProtectedAdminApi(pathname) {
  return ADMIN_API_PATHS.has(pathname);
}

function isMutatingAdminApi(pathname, method) {
  return MUTATING_ADMIN_API_PATHS.has(pathname) && !["GET", "HEAD", "OPTIONS"].includes(method);
}

function isProtectedRequest(pathname) {
  return isProtectedAdminPage(pathname) || isProtectedAdminApi(pathname);
}

function unauthorizedJson() {
  return new Response(JSON.stringify({ error: "Admin login required" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

function forbiddenJson(message = "CSRF token is invalid") {
  return new Response(JSON.stringify({ error: message }), {
    status: 403,
    headers: { "Content-Type": "application/json" },
  });
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, request, url } = context;
  const pathname = url.pathname;
  const isMutatingApi = isMutatingAdminApi(pathname, request.method);
  const isInitialPasswordSetup =
    (pathname === "/admin/password" || pathname === "/api/admin/change-password") &&
    !(await hasAdminPasswordHash());

  if (request.method === "OPTIONS" || isInitialPasswordSetup || !isProtectedRequest(pathname)) {
    return next();
  }

  const accessToken = cookies.get(ACCESS_COOKIE)?.value;
  if (verifyAdminToken(accessToken, "access")) {
    ensureCsrfCookie(cookies, request.url);
    if (isMutatingApi && !verifyCsrfToken(cookies, request)) {
      return forbiddenJson();
    }
    return next();
  }

  if (isMutatingApi) {
    return unauthorizedJson();
  }

  const refreshToken = cookies.get(REFRESH_COOKIE)?.value;
  const refreshPayload = verifyAdminToken(refreshToken, "refresh");
  if (refreshPayload && (await rotateRefreshSession(cookies, request.url, refreshPayload))) {
    ensureCsrfCookie(cookies, request.url);
    return next();
  }

  if (isProtectedAdminApi(pathname)) {
    return unauthorizedJson();
  }

  return context.redirect(
    `/admin/login?redirect=${encodeURIComponent(pathname + url.search)}`,
    303,
  );
});
