// Anonymous record of each sign-up form sent (see SignupAttempt in
// prisma/schema.prisma). Server-only.

import { createHmac, createHash } from "crypto";
import { prisma } from "@/lib/db";
import type { Utm } from "@/lib/utm";

/**
 * Keyed hash of an email, so the same person sending the form twice is counted
 * once. Keyed with the server secret, so it can't be reversed by hashing a list
 * of known addresses.
 */
export function emailHash(email: string): string {
  const secret = process.env.SIGNUP_TOKEN_SECRET?.trim() ?? "";
  const key = createHash("sha256").update(`visaready-attempt-v1:${secret}`).digest();
  return createHmac("sha256", key).update(email.trim().toLowerCase()).digest("hex");
}

export async function recordSignupAttempt(a: {
  email: string;
  nationality: string;
  desiredRole: string;
  destination: string | null;
  utm: Utm;
}): Promise<void> {
  try {
    await prisma.signupAttempt.create({
      data: {
        emailHash: emailHash(a.email),
        nationality: a.nationality,
        desiredRole: a.desiredRole,
        destination: a.destination,
        ...a.utm,
      },
    });
  } catch (err) {
    // Only affects the staff numbers, never the person signing up.
    console.error("[signup] couldn't record attempt:", err);
  }
}
