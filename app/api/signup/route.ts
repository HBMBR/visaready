import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateSignup } from "@/lib/signup-validation";
import { LEGAL_VERSION } from "@/lib/legal";
import { cleanUtm } from "@/lib/utm";
import { recordSignupAttempt } from "@/lib/signup-attempt";
import { cleanReferralCode } from "@/lib/referral";
import { sealSignup } from "@/lib/signup-token";
import { sendEmail } from "@/lib/email";
import { verificationEmail } from "@/lib/email-templates/verification";
import { getSiteUrl } from "@/lib/site";
import { throttled, clientIp } from "@/lib/throttle";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // crypto

// This endpoint sends an email to whatever address is submitted, and says
// whether an address is already on the list, so it's throttled to stop it
// being used to spam people or to check lots of addresses.
const MAX_PER_IP = 10;
const MAX_PER_EMAIL = 3;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  // Emails are stored lower-cased and are UNIQUE, so "Jo@X.com" and "jo@x.com" are the same person.
  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = String(body.phone ?? "").trim();
  const nationality = String(body.nationality ?? "").trim();
  const desiredRole = String(body.desiredRole ?? "").trim();
  const destination = String(body.destination ?? "").trim();
  const ref = cleanReferralCode(body.ref);
  const utm = cleanUtm(body.utm);

  // Same rules as the form, including the Terms / Privacy / Disclaimer box:
  // a request that skips the form still can't sign up without agreeing.
  const problem = validateSignup({
    firstName,
    lastName,
    email,
    phone,
    nationality,
    desiredRole,
    destination,
    agreed: body.agreed === true,
  });
  if (problem) {
    return NextResponse.json({ error: problem.message, field: problem.field }, { status: 400 });
  }

  if (throttled(`signup-ip:${clientIp(request.headers)}`, MAX_PER_IP) || throttled(`signup-email:${email}`, MAX_PER_EMAIL)) {
    return NextResponse.json(
      { error: "Too many sign-up attempts. Please check your inbox or try again in an hour." },
      { status: 429 }
    );
  }

  try {
    // Read-only check — nothing is written until the link is clicked.
    const existing = await prisma.signup.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      // Already on the list: no second account, no second email.
      return NextResponse.json({ ok: true, existing: true });
    }
  } catch (err) {
    console.error("[signup] db lookup failed:", err);
    return NextResponse.json(
      { error: "We hit an issue on our side. Please try again shortly." },
      { status: 500 }
    );
  }

  try {
    const token = sealSignup({
      firstName,
      lastName,
      email,
      phone: phone || null,
      nationality,
      desiredRole,
      destination,
      ref,
      // Validation above guarantees they ticked the box; record when, and
      // which version of the documents. Saved with them once they confirm.
      agreedAt: Date.now(),
      termsVersion: LEGAL_VERSION,
      utm,
    });
    const verifyUrl = `${getSiteUrl()}/api/verify?token=${encodeURIComponent(token)}`;
    const tpl = verificationEmail({ firstName, verifyUrl });
    await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text });
  } catch (err) {
    console.error("[signup] verification email failed:", err);
    return NextResponse.json(
      { error: "We couldn't send your verification email. Please try again or contact support@visaready.co." },
      { status: 502 }
    );
  }

  // Count it for the staff numbers (anonymous; failures don't affect the person).
  await recordSignupAttempt({ email, nationality, desiredRole, destination, utm });

  return NextResponse.json({ ok: true });
}
