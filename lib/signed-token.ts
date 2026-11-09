// Small HMAC-SHA256 signed tokens: `<base64url(json)>.<base64url(sig)>`.
//
// Each caller passes its own `label`, which is mixed into the key, so a token
// minted for one purpose (e.g. staff sessions) can never be accepted by another
// (e.g. member sessions). All keys derive from SIGNUP_TOKEN_SECRET; rotating it
// invalidates every outstanding token and session.

import { createHash, createHmac, timingSafeEqual } from "crypto";

function key(label: string): Buffer {
  const secret = process.env.SIGNUP_TOKEN_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error("SIGNUP_TOKEN_SECRET is not configured (needs 32+ random characters).");
  }
  return createHash("sha256").update(`${label}:${secret}`, "utf8").digest();
}

export function signToken(label: string, payload: Record<string, unknown>, ttlMs: number): string {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + ttlMs }), "utf8").toString("base64url");
  const sig = createHmac("sha256", key(label)).update(body).digest("base64url");
  return `${body}.${sig}`;
}

/** The payload if the signature is valid and it hasn't expired, else null. */
export function readToken<T extends Record<string, unknown>>(label: string, token: string | null | undefined): T | null {
  if (!token) return null;
  const [body, sig, extra] = token.split(".");
  if (!body || !sig || extra !== undefined) return null;
  try {
    const expected = createHmac("sha256", key(label)).update(body).digest();
    const given = Buffer.from(sig, "base64url");
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload || typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload as T;
  } catch {
    return null;
  }
}
