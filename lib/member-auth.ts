// Member ("Sign In") access: the same email-link approach as the staff
// dashboard, but for people on the waitlist. No passwords.
//
// * Sign-in link: 30 minutes, emailed only to addresses that are on the list.
// * Session: signed httpOnly cookie for 30 days. Also set when someone clicks
//   their confirmation link, so the "You're in!" page can show their referral link.
// * Every request re-reads the member's row, so deleting a row signs them out.
// * Unsubscribe links: signed with the same key but a different purpose, so they
//   can't be used to sign in.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { readToken, signToken } from "@/lib/signed-token";
import { getSiteUrl } from "@/lib/site";

export const MEMBER_COOKIE = "vr_member";
const LABEL = "visaready-member-v1";
const LOGIN_LINK_TTL_MS = 30 * 60 * 1000;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const UNSUBSCRIBE_TTL_MS = 10 * 365 * 24 * 60 * 60 * 1000; // effectively permanent

type Purpose = "member-login" | "member-session" | "unsubscribe";

function sign(p: Purpose, signupId: string, ttlMs: number): string {
  return signToken(LABEL, { p, s: signupId }, ttlMs);
}

function verify(token: string | null | undefined, p: Purpose): string | null {
  const payload = readToken<{ p: string; s: string }>(LABEL, token);
  if (!payload || payload.p !== p || typeof payload.s !== "string") return null;
  return payload.s;
}

export const createMemberLoginToken = (id: string) => sign("member-login", id, LOGIN_LINK_TTL_MS);
export const verifyMemberLoginToken = (t: string | null) => verify(t, "member-login");
export const createMemberSessionToken = (id: string) => sign("member-session", id, SESSION_TTL_MS);
export const createUnsubscribeToken = (id: string) => sign("unsubscribe", id, UNSUBSCRIBE_TTL_MS);
export const verifyUnsubscribeToken = (t: string | null | undefined) => verify(t, "unsubscribe");

export function memberCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  };
}

/** Link in the email footer: a page with an "Unsubscribe" button. */
export function unsubscribePageUrl(signupId: string): string {
  return `${getSiteUrl()}/unsubscribe?token=${encodeURIComponent(createUnsubscribeToken(signupId))}`;
}

/** List-Unsubscribe header target: mail apps POST here for one-click unsubscribe. */
export function unsubscribeOneClickUrl(signupId: string): string {
  return `${getSiteUrl()}/api/unsubscribe?token=${encodeURIComponent(createUnsubscribeToken(signupId))}`;
}

/** The signed-in member's row, or null. */
export async function currentMember() {
  const jar = await cookies();
  const id = verify(jar.get(MEMBER_COOKIE)?.value, "member-session");
  if (!id) return null;
  return prisma.signup.findUnique({ where: { id } });
}

export async function requireMember() {
  const member = await currentMember();
  if (!member) redirect("/member/login");
  return member;
}
