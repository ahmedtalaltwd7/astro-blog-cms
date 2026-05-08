import bcrypt from "bcryptjs";
import {
  clearAdminAuthCookies,
  clearRefreshSession,
  hasAdminPasswordHash,
  saveAdminRecord,
  verifyAdminPassword,
} from "../../../lib/admin-auth.js";

export const prerender = false;

const BCRYPT_ROUNDS = 14;

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function readPasswordData(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const formData = await request.formData();
  return {
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };
}

function getPasswordWeakness(password) {
  const value = String(password || "");

  if (value.length < 12) return "New password must be at least 12 characters.";
  if (!/[a-z]/.test(value)) return "New password must include a lowercase letter.";
  if (!/[A-Z]/.test(value)) return "New password must include an uppercase letter.";
  if (!/\d/.test(value)) return "New password must include a number.";
  if (!/[^A-Za-z0-9]/.test(value)) return "New password must include a symbol.";
  if (/password|admin|qwerty|123456/i.test(value)) {
    return "New password must not contain common weak words.";
  }

  return "";
}

export async function POST({ cookies, request }) {
  try {
    const data = await readPasswordData(request);
    const currentPassword = String(data.currentPassword || "");
    const newPassword = String(data.newPassword || "");
    const confirmPassword = String(data.confirmPassword || "");
    const hasExistingPassword = await hasAdminPasswordHash();

    if (hasExistingPassword && !currentPassword) {
      return jsonResponse({ error: "Current password is required." }, 400);
    }

    if (hasExistingPassword && !(await verifyAdminPassword(currentPassword))) {
      return jsonResponse({ error: "Current password is wrong." }, 401);
    }

    if (!newPassword || !confirmPassword) {
      return jsonResponse({ error: "New password and confirmation are required." }, 400);
    }

    if (newPassword !== confirmPassword) {
      return jsonResponse({ error: "New password and confirmation do not match." }, 400);
    }

    const weakness = getPasswordWeakness(newPassword);
    if (weakness) {
      return jsonResponse({ error: weakness }, 400);
    }

    if (hasExistingPassword && newPassword === currentPassword) {
      return jsonResponse({ error: "New password must be different from the current password." }, 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await saveAdminRecord(passwordHash);
    await clearRefreshSession();
    clearAdminAuthCookies(cookies, request.url);

    return jsonResponse({
      success: true,
      message: "Password updated. Please log in again.",
      redirectTo: "/admin/login",
    });
  } catch (error) {
    console.error("Error changing admin password:", error);
    return jsonResponse({ error: "Failed to change admin password." }, 500);
  }
}
