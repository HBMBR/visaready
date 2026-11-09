import { NextRequest, NextResponse } from "next/server";
import { createLoginToken, isAdminEmail } from "@/lib/admin-auth";
import { sendEmail } from "@/lib/email";
import { adminLoginEmail } from "@/lib/email-templates/admin-login";
import { getSiteUrl } from "@/lib/site";
import { throttled, clientIp } from "@/lib/throttle";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST { email } — emails a sign-in link if the address is on ADMIN_EMAILS.
// The response is the same either way, so this can't be used to discover staff addresses.
export async function POST(request: NextRequest) {
  let email = "";
  try {
    const body = await request.json();
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!email || email.length > 255) {
    return NextResponse.json({ error: "Enter your work email." }, { status: 400 });
  }

  if (throttled(`admin-ip:${clientIp(request.headers)}`, 20) || throttled(`admin-email:${email}`, 5)) {
    return NextResponse.json({ error: "Too many attempts. Try again in an hour." }, { status: 429 });
  }

  if (isAdminEmail(email)) {
    try {
      const loginUrl = `${getSiteUrl()}/api/admin/callback?token=${encodeURIComponent(createLoginToken(email))}`;
      const tpl = adminLoginEmail({ loginUrl });
      await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text });
      console.log(`[admin] login link sent to ${email}`);
    } catch (err) {
      console.error("[admin] login email failed:", err);
      return NextResponse.json(
        { error: "We couldn't send the sign-in email. Check /api/health for SMTP status." },
        { status: 502 }
      );
    }
  } else {
    console.warn(`[admin] login requested for non-staff address`);
  }

  return NextResponse.json({ ok: true });
}
