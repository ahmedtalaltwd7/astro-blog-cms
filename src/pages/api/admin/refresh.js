import {
  ACCESS_MAX_AGE_SECONDS,
  checkRateLimit,
  REFRESH_COOKIE,
  rotateRefreshSession,
  verifyAdminToken,
} from "../../../lib/admin-auth.js";

export const prerender = false;

function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export async function POST({ cookies, request }) {
  const rateLimit = checkRateLimit(request, "admin-refresh", 30, 15 * 60 * 1000);
  if (!rateLimit.ok) {
    return jsonResponse(
      { error: "Too many refresh attempts. Try again later." },
      429,
      { "Retry-After": String(rateLimit.retryAfter) },
    );
  }

  const refreshToken = cookies.get(REFRESH_COOKIE)?.value;
  const refreshPayload = verifyAdminToken(refreshToken, "refresh");

  if (!refreshPayload) {
    return jsonResponse({ error: "Refresh token is invalid." }, 401);
  }

  const rotated = await rotateRefreshSession(cookies, request.url, refreshPayload);

  if (!rotated) {
    return jsonResponse({ error: "Refresh session is invalid." }, 401);
  }

  return jsonResponse({
    success: true,
    accessExpiresIn: ACCESS_MAX_AGE_SECONDS,
    refreshExpiresAt: rotated.refreshPayload.exp,
  });
}
