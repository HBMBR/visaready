import { NextResponse } from "next/server";
import { MEMBER_COOKIE } from "@/lib/member-auth";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.redirect(`${getSiteUrl()}/`, 303);
  res.cookies.set(MEMBER_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
