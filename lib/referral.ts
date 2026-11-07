import { randomInt } from "crypto";
import { getSiteUrl } from "@/lib/site";

// No 0/O/1/I/L so codes survive being read out or retyped.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const REFERRAL_CODE_RE = /^[A-Z0-9]{6,16}$/;

export function newReferralCode(length = 8): string {
  let s = "";
  for (let i = 0; i < length; i++) s += ALPHABET[randomInt(ALPHABET.length)];
  return s;
}

/** Normalises a code from a URL / form; null if it isn't a plausible code. */
export function cleanReferralCode(raw: unknown): string | null {
  const code = String(raw ?? "").trim().toUpperCase();
  return REFERRAL_CODE_RE.test(code) ? code : null;
}

export function referralUrl(code: string): string {
  return `${getSiteUrl()}/?ref=${encodeURIComponent(code)}`;
}

// Must match the final ladder in "VisaReady Emails, Pricing and Referrals".
export const REFERRAL_REWARD = "Refer 5 friends and you get a month free.";

export const SHARE_TEXT =
  "I've joined the VisaReady waitlist: jobs abroad from employers that sponsor visas, for African professionals. It's free to join, and founding members get 50% off for life.";

const SELF_REFERRAL_WINDOW_MS = 24 * 60 * 60 * 1000;

// Last 9 digits, so "+263 77 123 4567" and "077 123 4567" compare equal.
function phoneKey(phone: string | null | undefined): string {
  return (phone ?? "").replace(/\D/g, "").slice(-9);
}

/**
 * Whether a referral should count towards the referrer's total. It's always
 * recorded (so staff can see it), but not counted when it looks like the
 * referrer signing themselves up with a second email:
 *   * the same phone number as the referrer, or
 *   * confirmed from the same IP address within 24 hours of the referrer.
 */
export function referralCounts(
  referrer: { phone: string | null; ipAddress: string | null; verifiedAt: Date },
  referred: { phone: string | null; ipAddress: string | null; at: Date }
): boolean {
  const a = phoneKey(referrer.phone);
  if (a.length >= 7 && a === phoneKey(referred.phone)) return false;
  if (
    referrer.ipAddress &&
    referred.ipAddress &&
    referrer.ipAddress === referred.ipAddress &&
    Math.abs(referred.at.getTime() - referrer.verifiedAt.getTime()) < SELF_REFERRAL_WINDOW_MS
  ) {
    return false;
  }
  return true;
}
