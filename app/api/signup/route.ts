import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { COUNTRIES } from "@/lib/countries";
import { isValidRole } from "@/lib/roles";
import { isValidDestination } from "@/lib/destinations";
import { cleanReferralCode } from "@/lib/referral";
import { sealSignup } from "@/lib/signup-token";
import { sendEmail } from "@/lib/email";
import { verificationEmail } from "@/lib/email-templates/verification";
import { getSiteUrl } from "@/lib/site";
import { throttled, clientIp } from "@/lib/throttle";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // crypto

// Allowed nationality codes (whitelist defense)
const VALID_NATIONALITY = new Set<string>([
  ...COUNTRIES.map((c) => c.code),
  "OTHER",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s\-()]{5,30}$/;

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

  if (!firstName || firstName.length < 2 || firstName.length > 60) {
    return NextResponse.json({ error: "Please enter your first name." }, { status: 400 });
  }
  if (!lastName || lastName.length < 2 || lastName.length > 60) {
    return NextResponse.json({ error: "Please enter your last name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 255) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (phone && !PHONE_RE.test(phone)) {
    return NextResponse.json({ error: "That phone number doesn't look right. Leave it blank if you prefer." }, { status: 400 });
  }
  if (!VALID_NATIONALITY.has(nationality)) {
    return NextResponse.json({ error: "Please select your nationality." }, { status: 400 });
  }
  if (!isValidRole(desiredRole)) {
    return NextResponse.json({ error: "Please select a desired role." }, { status: 400 });
  }
  if (!isValidDestination(destination)) {
    return NextResponse.json({ error: "Please choose where you'd like to work." }, { status: 400 });
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

  return NextResponse.json({ ok: true });
}
