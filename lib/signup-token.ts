// Stateless pending-signup tokens.
//
// Nothing is written to the database until the user clicks the link in the
// verification email. Until then the submitted details live ONLY inside the
// link itself, sealed with AES-256-GCM:
//
//   * encrypted  — the link doesn't expose name/phone to anyone who sees the URL
//   * authenticated — a tampered or forged token fails to decrypt
//   * expiring   — `exp` is inside the sealed payload, so it can't be extended
//
// Requires SIGNUP_TOKEN_SECRET (32+ random chars). Rotating it invalidates every
// outstanding verification link, which is the intended way to revoke them all.

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

export const TOKEN_TTL_HOURS = 48;
const VERSION = 1;
const IV_BYTES = 12;
const TAG_BYTES = 16;

export interface PendingSignup {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  desiredRole: string;
}

interface SealedPayload extends PendingSignup {
  v: number;
  /** expiry, unix ms */
  exp: number;
}

function getKey(): Buffer {
  const secret = process.env.SIGNUP_TOKEN_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error(
      "SIGNUP_TOKEN_SECRET is not configured (needs 32+ random characters, e.g. `openssl rand -base64 48`)."
    );
  }
  // Fixed-length 256-bit key regardless of how the secret is formatted.
  return createHash("sha256").update(secret, "utf8").digest();
}

export function sealSignup(data: PendingSignup): string {
  const payload: SealedPayload = {
    v: VERSION,
    exp: Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000,
    ...data,
  };
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString("base64url");
}

export type OpenResult =
  | { ok: true; data: PendingSignup }
  | { ok: false; reason: "invalid" | "expired" };

export function openSignup(token: string): OpenResult {
  let raw: Buffer;
  try {
    raw = Buffer.from(token, "base64url");
  } catch {
    return { ok: false, reason: "invalid" };
  }
  if (raw.length <= IV_BYTES + TAG_BYTES) return { ok: false, reason: "invalid" };

  let payload: SealedPayload;
  try {
    const iv = raw.subarray(0, IV_BYTES);
    const tag = raw.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
    const ciphertext = raw.subarray(IV_BYTES + TAG_BYTES);
    const decipher = createDecipheriv("aes-256-gcm", getKey(), iv);
    decipher.setAuthTag(tag);
    const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    payload = JSON.parse(plain.toString("utf8"));
  } catch {
    // Wrong key, tampered bytes, truncated link — all look the same to the user.
    return { ok: false, reason: "invalid" };
  }

  if (payload.v !== VERSION || typeof payload.exp !== "number") {
    return { ok: false, reason: "invalid" };
  }
  if (payload.exp < Date.now()) return { ok: false, reason: "expired" };

  const { firstName, lastName, email, phone, nationality, desiredRole } = payload;
  return { ok: true, data: { firstName, lastName, email, phone, nationality, desiredRole } };
}
