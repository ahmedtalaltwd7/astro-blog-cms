import {
  checkRateLimit,
  createAndStoreAdminTokens,
  getSafeAdminRedirect,
  verifyAdminPassword,
} from "../../../lib/admin-auth.js";

export const prerender = false;

function wantsJson(request) {
  const accept = request.headers.get("accept") || "";
  const contentType = request.headers.get("content-type") || "";
  return accept.includes("application/json") || contentType.includes("application/json");
}

function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

async function readLoginData(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const formData = await request.formData();
  return {
    username: formData.get("username"),
    password: formData.get("password"),
    redirect: formData.get("redirect"),
  };
}

export async function POST({ cookies, request, redirect }) {
  const rateLimit = checkRateLimit(request, "admin-login", 5, 15 * 60 * 1000);
  if (!rateLimit.ok) {
    return jsonResponse(
      { error: "Too many login attempts. Try again later." },
      429,
      { "Retry-After": String(rateLimit.retryAfter) },
    );
  }

  const data = await readLoginData(request);
  const username = String(data.username || "").trim();
  const password = String(data.password || "");
  const target = getSafeAdminRedirect(data.redirect);

  if (username !== "admin" || !(await verifyAdminPassword(password))) {
    if (wantsJson(request)) {
      return jsonResponse({ error: "Wrong admin username or password." }, 401);
    }

    return redirect(
      `/admin/login?error=1&redirect=${encodeURIComponent(target)}`,
      303,
    );
  }

  await createAndStoreAdminTokens(cookies, request.url);

  if (wantsJson(request)) {
    return jsonResponse({ success: true, redirect: target });
  }

  return redirect(target, 303);
}
