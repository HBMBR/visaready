// Staff (Marketing / Support) access to the signups dashboard.
//
// * Who: only addresses listed in ADMIN_EMAILS (comma-separated). Removing an
//   address revokes access immediately — every request re-checks the list.
// * How: email a short-lived signed login link; clicking it sets a signed,
//   httpOnly session cookie. No passwords are stored anywhere.
// * Keys: HMAC-SHA256 keyed from SIGNUP_TOKEN_SECRET with a separate label, so
//   signup links and staff sessions can never be swapped for one another.
//   Rotating SIGNUP_TOKEN_SECRET logs every staff member out.

import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "vr_admin";
export const LOGIN_LINK_TTL_MS = 15 * 60 * 1000; // 15 minutes
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

type Purpose = "admin-login" | "admin-session";
interface Payload {
  p: Purpose;
  e: string; // staff email
  exp: number; // unix ms
}

export function adminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(/[,\s]+/)
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isAdminEmail(email: string): boolean {
  return adminEmails().has(email.trim().toLowerCase());
}

function key(): Buffer {
  const secret = process.env.SIGNUP_TOKEN_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error("SIGNUP_TOKEN_SECRET is not configured (needs 32+ random characters).");
  }
  return createHash("sha256").update(`visaready-admin-v1:${secret}`, "utf8").digest();
}

function sign(p: Purpose, email: string, ttlMs: number): string {
  const payload: Payload = { p, e: email.toLowerCase(), exp: Date.now() + ttlMs };
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = createHmac("sha256", key()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

/** Returns the staff email if the token is valid, of the right purpose, unexpired, and still allowlisted. */
function verify(token: string | undefined | null, p: Purpose): string | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    const expected = createHmac("sha256", key()).update(body).digest();
    const given = Buffer.from(sig, "base64url");
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Payload;
    if (payload.p !== p || typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    if (!isAdminEmail(payload.e)) return null;
    return payload.e;
  } catch {
    return null;
  }
}

export const createLoginToken = (email: string) => sign("admin-login", email, LOGIN_LINK_TTL_MS);
export const verifyLoginToken = (token: string | null) => verify(token, "admin-login");
export const createSessionToken = (email: string) => sign("admin-session", email, SESSION_TTL_MS);
export const verifySessionToken = (token: string | undefined) => verify(token, "admin-session");

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  };
}

/** Current staff email from the session cookie, or null. */
export async function currentAdmin(): Promise<string | null> {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

/** For admin pages: returns the staff email or redirects to the login page. */
export async function requireAdmin(): Promise<string> {
  const email = await currentAdmin();
  if (!email) redirect("/admin/login");
  return email;
}
