import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyUnsubscribeToken } from "@/lib/member-auth";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST — unsubscribes the member named in the signed token.
//  * From the /unsubscribe page: form field `token`, then redirect back to it.
//  * One-click from Gmail / Apple Mail (RFC 8058): token in the query string,
//    body "List-Unsubscribe=One-Click"; answer with a plain 200.
// There is deliberately no GET handler: link scanners prefetch GET links, which
// would unsubscribe people who never clicked.
export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  const oneClick = form?.get("List-Unsubscribe") === "One-Click";
  const token = request.nextUrl.searchParams.get("token") ?? String(form?.get("token") ?? "");
  const id = verifyUnsubscribeToken(token);

  if (id) {
    try {
      await prisma.signup.updateMany({ where: { id, unsubscribedAt: null }, data: { unsubscribedAt: new Date() } });
    } catch (err) {
      console.error("[unsubscribe] failed:", err);
      if (oneClick) return new NextResponse("Error", { status: 500 });
      return NextResponse.redirect(`${getSiteUrl()}/unsubscribe?status=error`, 303);
    }
  }

  if (oneClick) return new NextResponse(id ? "Unsubscribed" : "Invalid link", { status: id ? 200 : 400 });
  return NextResponse.redirect(`${getSiteUrl()}/unsubscribe?status=${id ? "done" : "invalid"}`, 303);
}
