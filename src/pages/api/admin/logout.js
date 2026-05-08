import {
  clearAdminAuthCookies,
  clearRefreshSession,
} from "../../../lib/admin-auth.js";

export const prerender = false;

function wantsJson(request) {
  const accept = request.headers.get("accept") || "";
  return accept.includes("application/json");
}

export async function GET({ request }) {
  if (wantsJson(request)) {
    return new Response(JSON.stringify({ error: "Use POST to logout." }), {
      status: 405,
      headers: {
        "Allow": "POST",
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(null, {
    status: 303,
    headers: {
      "Allow": "POST",
      "Location": "/admin/login",
    },
  });
}

export async function POST({ cookies, request, redirect }) {
  await clearRefreshSession();
  clearAdminAuthCookies(cookies, request.url);

  if (wantsJson(request)) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return redirect("/admin/login", 303);
}
