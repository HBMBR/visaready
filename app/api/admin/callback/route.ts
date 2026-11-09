import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions, verifyLoginToken } from "@/lib/admin-auth";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET ?token=… — the link from the sign-in email. Sets the session cookie.
export async function GET(request: NextRequest) {
  const origin = getSiteUrl();
  const email = verifyLoginToken(request.nextUrl.searchParams.get("token"));
  if (!email) {
    return NextResponse.redirect(`${origin}/admin/login?error=link`);
  }
  console.log(`[admin] signed in: ${email}`);
  const res = NextResponse.redirect(`${origin}/admin`);
  res.cookies.set(SESSION_COOKIE, createSessionToken(email), sessionCookieOptions());
  return res;
}
