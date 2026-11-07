import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { MEMBER_COOKIE, createMemberSessionToken, memberCookieOptions, verifyMemberLoginToken } from "@/lib/member-auth";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET ?token=… — the link from the member sign-in email.
export async function GET(request: NextRequest) {
  const origin = getSiteUrl();
  const id = verifyMemberLoginToken(request.nextUrl.searchParams.get("token"));
  const exists = id ? await prisma.signup.findUnique({ where: { id }, select: { id: true } }) : null;
  if (!id || !exists) {
    return NextResponse.redirect(`${origin}/member/login?error=link`);
  }
  const res = NextResponse.redirect(`${origin}/member`);
  res.cookies.set(MEMBER_COOKIE, createMemberSessionToken(id), memberCookieOptions());
  return res;
}
