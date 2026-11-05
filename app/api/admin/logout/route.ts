import { NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/admin-auth";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.redirect(`${getSiteUrl()}/admin/login?signedOut=1`, 303);
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return res;
}
