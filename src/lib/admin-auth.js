import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import fs from "fs/promises";
import { existsSync, readFileSync } from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export const ACCESS_COOKIE = "admin_access_token";
export const REFRESH_COOKIE = "admin_refresh_token";
export const CSRF_COOKIE = "admin_csrf_token";

export const ACCESS_MAX_AGE_SECONDS = 15 * 60;
export const REFRESH_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

const MIN_AUTH_SECRET_LENGTH = 32;
const SESSION_FILE_PATH = path.join(process.cwd(), "data", "auth", "session.json");
const ADMIN_FILE_PATH = path.join(process.cwd(), "data", "auth", "admin.json");

let localEnvCache;

function parseEnvLine(line) {
  const match = String(line || "").match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!match) return null;

  const key = match[1];
  let value = match[2].trim();
  const commentIndex = value.search(/\s+#/);
  if (commentIndex !== -1) {
    value = value.slice(0, commentIndex).trim();
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return [key, value];
}

function readLocalEnv() {
  if (localEnvCache) return localEnvCache;

  localEnvCache = {};
  const envPath = path.join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return localEnvCache;

  try {
    const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const parsed = parseEnvLine(line);
      if (parsed) {
        localEnvCache[parsed[0]] = parsed[1];
      }
    }
  } catch {
    localEnvCache = {};
  }

  return localEnvCache;
}

function getEnvValue(...keys) {
  const localEnv = readLocalEnv();

  for (const key of keys) {
    const value = process.env[key] || localEnv[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

export function getAdminPassword() {
  return getEnvValue("admin_password", "ADMIN_PASSWORD");
}

function isBcryptHash(value) {
  return /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(String(value || ""));
}

function getAuthSecret() {
  const secret = getEnvValue("ADMIN_AUTH_SECRET");
  if (!secret || secret.length < MIN_AUTH_SECRET_LENGTH) {
    throw new Error(
      `ADMIN_AUTH_SECRET must be set and at least ${MIN_AUTH_SECRET_LENGTH} characters long.`,
    );
  }

  return secret;
}

async function writeJsonAtomic(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tempPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await fs.rename(tempPath, filePath);
}

function normalizeAdminRecord(value) {
  const username = String(value?.username || "").trim();
  const passwordHash = String(value?.passwordHash || "").trim();
  const updatedAt = Number(value?.updatedAt);

  if (username !== "admin" || !isBcryptHash(passwordHash) || !Number.isFinite(updatedAt)) {
    return null;
  }

  return { username, passwordHash, updatedAt };
}

export function getAdminFilePath() {
  return ADMIN_FILE_PATH;
}

export async function readAdminRecord() {
  try {
    const raw = await fs.readFile(ADMIN_FILE_PATH, "utf8");
    return normalizeAdminRecord(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function saveAdminRecord(passwordHash, updatedAt = Math.floor(Date.now() / 1000)) {
  if (!isBcryptHash(passwordHash)) {
    throw new Error("Admin password hash must be a valid bcrypt hash.");
  }

  const record = {
    username: "admin",
    passwordHash,
    updatedAt,
  };
  await writeJsonAtomic(ADMIN_FILE_PATH, record);
  return record;
}

async function getAdminPasswordHash() {
  const adminRecord = await readAdminRecord();
  if (adminRecord?.passwordHash) return adminRecord.passwordHash;

  const envPasswordHash = getAdminPassword();
  if (isBcryptHash(envPasswordHash)) {
    await saveAdminRecord(envPasswordHash).catch(() => null);
    return envPasswordHash;
  }

  return "";
}

export async function hasAdminPasswordHash() {
  return Boolean(await getAdminPasswordHash());
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

function signPayload(encodedHeader, encodedPayload) {
  return createHmac("sha256", getAuthSecret())
    .update(`${encodedHeader}.${encodedPayload}`)
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

export function createAdminToken(type = "access") {
  const now = Math.floor(Date.now() / 1000);
  const maxAge = type === "refresh" ? REFRESH_MAX_AGE_SECONDS : ACCESS_MAX_AGE_SECONDS;
  const jti = randomBytes(16).toString("hex");
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: "admin",
    role: "admin",
    type,
    iat: now,
    exp: now + maxAge,
    jti,
  };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedHeader, encodedPayload);

  return {
    token: `${encodedHeader}.${encodedPayload}.${signature}`,
    payload,
  };
}

export function verifyAdminToken(token, expectedType = "access") {
  try {
    const parts = String(token || "").split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    if (!safeEqual(signature, signPayload(encodedHeader, encodedPayload))) return null;

    const header = JSON.parse(base64UrlDecode(encodedHeader));
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (header.alg !== "HS256") return null;
    if (payload.sub !== "admin" || payload.role !== "admin") return null;
    if (payload.type !== expectedType) return null;
    if (!Number.isFinite(payload.exp) || payload.exp <= now) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function verifyAdminPassword(password) {
  const passwordHash = await getAdminPasswordHash();
  if (!passwordHash) return false;

  return bcrypt.compare(String(password || ""), passwordHash);
}

export function getCookieOptions(url, maxAge, httpOnly = true) {
  return {
    httpOnly,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge,
  };
}

export function getSessionFilePath() {
  return SESSION_FILE_PATH;
}

async function ensureSessionDir() {
  await fs.mkdir(path.dirname(SESSION_FILE_PATH), { recursive: true });
}

function normalizeSession(value) {
  const currentRefreshJti = String(value?.currentRefreshJti || "").trim();
  const createdAt = String(value?.createdAt || "").trim();
  const expiresAt = String(value?.expiresAt || "").trim();
  const expiresTime = Date.parse(expiresAt);

  if (!currentRefreshJti || !createdAt || !expiresAt || !Number.isFinite(expiresTime)) {
    return null;
  }

  if (expiresTime <= Date.now()) return null;

  return { currentRefreshJti, createdAt, expiresAt };
}

export async function readRefreshSession() {
  try {
    const raw = await fs.readFile(SESSION_FILE_PATH, "utf8");
    return normalizeSession(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function saveRefreshSession({ currentRefreshJti, createdAt, expiresAt }) {
  const session = { currentRefreshJti, createdAt, expiresAt };
  await writeJsonAtomic(SESSION_FILE_PATH, session);
  return session;
}

export async function clearRefreshSession() {
  try {
    await fs.unlink(SESSION_FILE_PATH);
  } catch {
    await ensureSessionDir();
    await saveRefreshSession({
      currentRefreshJti: "",
      createdAt: new Date(0).toISOString(),
      expiresAt: new Date(0).toISOString(),
    }).catch(() => null);
  }
}

export async function createAndStoreAdminTokens(cookies, url) {
  const access = createAdminToken("access");
  const refresh = createAdminToken("refresh");
  const createdAt = new Date(refresh.payload.iat * 1000).toISOString();
  const expiresAt = new Date(refresh.payload.exp * 1000).toISOString();

  await saveRefreshSession({
    currentRefreshJti: refresh.payload.jti,
    createdAt,
    expiresAt,
  });

  cookies.set(
    ACCESS_COOKIE,
    access.token,
    getCookieOptions(url, ACCESS_MAX_AGE_SECONDS),
  );
  cookies.set(
    REFRESH_COOKIE,
    refresh.token,
    getCookieOptions(url, REFRESH_MAX_AGE_SECONDS),
  );

  ensureCsrfCookie(cookies, url);

  return { accessPayload: access.payload, refreshPayload: refresh.payload };
}

export async function rotateRefreshSession(cookies, url, refreshPayload) {
  const session = await readRefreshSession();
  if (!session || !safeEqual(session.currentRefreshJti, refreshPayload?.jti)) {
    return null;
  }

  return createAndStoreAdminTokens(cookies, url);
}

export function refreshAdminAccessCookie(cookies, url) {
  const access = createAdminToken("access");
  cookies.set(
    ACCESS_COOKIE,
    access.token,
    getCookieOptions(url, ACCESS_MAX_AGE_SECONDS),
  );
  return access.payload;
}

export function clearAdminAuthCookies(cookies, url) {
  cookies.delete(ACCESS_COOKIE, getCookieOptions(url, 0));
  cookies.delete(REFRESH_COOKIE, getCookieOptions(url, 0));
  cookies.delete(CSRF_COOKIE, getCookieOptions(url, 0, false));
}

export function getSafeAdminRedirect(value) {
  const redirect = String(value || "/admin").trim();
  if (!redirect.startsWith("/") || redirect.startsWith("//")) return "/admin";
  if (redirect.startsWith("/api/")) return "/admin";
  if (redirect === "/admin/login") return "/admin";
  return redirect;
}

export function createCsrfToken() {
  return randomBytes(32).toString("hex");
}

export function ensureCsrfCookie(cookies, url) {
  const currentToken = cookies.get(CSRF_COOKIE)?.value;
  if (/^[a-f0-9]{64}$/i.test(String(currentToken || ""))) {
    return currentToken;
  }

  const nextToken = createCsrfToken();
  cookies.set(CSRF_COOKIE, nextToken, getCookieOptions(url, REFRESH_MAX_AGE_SECONDS, false));
  return nextToken;
}

export function verifyCsrfToken(cookies, request) {
  const cookieToken = cookies.get(CSRF_COOKIE)?.value;
  const headerToken = request.headers.get("x-admin-csrf");
  if (!cookieToken || !headerToken) return false;
  return safeEqual(cookieToken, headerToken);
}

const rateLimitBuckets = new Map();

function getClientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "local"
  );
}

export function checkRateLimit(request, name, limit, windowMs) {
  const now = Date.now();
  const key = `${name}:${getClientIp(request)}`;
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  return { ok: true, retryAfter: 0 };
}
