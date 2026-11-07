import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createMemberLoginToken } from "@/lib/member-auth";
import { sendEmail } from "@/lib/email";
import { memberLoginEmail } from "@/lib/email-templates/member-login";
import { getSiteUrl } from "@/lib/site";
import { throttled, clientIp } from "@/lib/throttle";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST { email } — emails a sign-in link if the address is on the list.
export async function POST(request: NextRequest) {
  let email = "";
  try {
    const body = await request.json();
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!email || email.length > 255 || !email.includes("@")) {
    return NextResponse.json({ error: "Enter the email you signed up with." }, { status: 400 });
  }

  if (throttled(`member-ip:${clientIp(request.headers)}`, 20) || throttled(`member-email:${email}`, 5)) {
    return NextResponse.json({ error: "Too many attempts. Please try again in an hour." }, { status: 429 });
  }

  let member: { id: string; firstName: string } | null;
  try {
    member = await prisma.signup.findUnique({ where: { email }, select: { id: true, firstName: true } });
  } catch (err) {
    console.error("[member] lookup failed:", err);
    return NextResponse.json({ error: "We hit an issue on our side. Please try again shortly." }, { status: 500 });
  }

  if (!member) {
    return NextResponse.json({ ok: true, found: false });
  }

  try {
    const loginUrl = `${getSiteUrl()}/api/member/callback?token=${encodeURIComponent(createMemberLoginToken(member.id))}`;
    const tpl = memberLoginEmail({ firstName: member.firstName, loginUrl });
    await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text });
  } catch (err) {
    console.error("[member] login email failed:", err);
    return NextResponse.json(
      { error: "We couldn't send the sign-in email. Please try again or contact support@visaready.co." },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true, found: true });
}
