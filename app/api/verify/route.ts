import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { welcomeEmail } from "@/lib/email-templates/welcome";
import { getSiteUrl } from "@/lib/site";
import { openSignup, type PendingSignup } from "@/lib/signup-token";
import { newReferralCode, referralCounts, referralUrl } from "@/lib/referral";
import { MEMBER_COOKIE, createMemberSessionToken, memberCookieOptions, unsubscribeOneClickUrl, unsubscribePageUrl } from "@/lib/member-auth";
import { clientIp } from "@/lib/throttle";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // crypto

// Concurrent verifications can compute the same next founder number, and two
// new referral codes can (very rarely) collide. The UNIQUE constraints reject
// the loser (P2002), and Serializable isolation can abort a transaction (P2034).
// Both are safe to retry: the number and the code are recomputed each time.
const MAX_ATTEMPTS = 5;

function isRetryable(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    (err.code === "P2002" || err.code === "P2034")
  );
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const origin = getSiteUrl();

  if (!token) {
    return NextResponse.redirect(`${origin}/verified?status=invalid`);
  }

  const opened = openSignup(token);
  if (!opened.ok) {
    return NextResponse.redirect(`${origin}/verified?status=${opened.reason}`);
  }

  const ip = clientIp(request.headers);
  const audit = {
    ipAddress: ip === "unknown" ? null : ip.slice(0, 64),
    userAgent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
  };

  try {
    let result: Awaited<ReturnType<typeof createVerifiedSignup>> | undefined;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        result = await createVerifiedSignup(opened.data, audit);
        break;
      } catch (err) {
        if (isRetryable(err) && attempt < MAX_ATTEMPTS) {
          console.warn(`[verify] contention, retry ${attempt}/${MAX_ATTEMPTS}`);
          continue;
        }
        throw err;
      }
    }
    if (!result) throw new Error("verification exhausted retries");

    // Welcome email only on first verification (non-fatal if it fails).
    if (result.created) {
      try {
        const tpl = welcomeEmail({
          firstName: result.firstName,
          referralLink: referralUrl(result.referralCode),
          memberUrl: `${origin}/member`,
          unsubscribeUrl: unsubscribePageUrl(result.id),
        });
        await sendEmail({
          to: result.email,
          subject: tpl.subject,
          html: tpl.html,
          text: tpl.text,
          fromName: "Darian from VisaReady",
          unsubscribeUrl: unsubscribeOneClickUrl(result.id),
        });
      } catch (mailErr) {
        console.error("[verify] welcome email failed:", mailErr);
      }
    }

    // Clicking the link proves they own the address, so sign them in: the
    // "You're in!" page and the member page can then show their referral link.
    // `new=1` makes the ad pixels count the sign-up once, not on every re-click.
    const res = NextResponse.redirect(`${origin}/verified?status=success${result.created ? "&new=1" : ""}`);
    res.cookies.set(MEMBER_COOKIE, createMemberSessionToken(result.id), memberCookieOptions());
    return res;
  } catch (err) {
    console.error("[verify] error:", err);
    return NextResponse.redirect(`${origin}/verified?status=error`);
  }
}

/**
 * First (and only) database write for a signup. Idempotent: clicking the same
 * link twice, or two links for the same email, just returns the existing row.
 */
async function createVerifiedSignup(
  data: PendingSignup,
  audit: { ipAddress: string | null; userAgent: string | null }
) {
  return prisma.$transaction(
    async (tx) => {
      const existing = await tx.signup.findUnique({ where: { email: data.email } });
      if (existing) return { ...existing, created: false };

      // No cap: everyone who confirms is a founding member. The number is
      // sign-up order, kept for staff only.
      const { _max } = await tx.signup.aggregate({ _max: { founderNumber: true } });
      const founderNumber = (_max.founderNumber ?? 0) + 1;

      let referredById: string | null = null;
      let referralCounted = false;
      if (data.ref) {
        const referrer = await tx.signup.findUnique({
          where: { referralCode: data.ref },
          select: { id: true, phone: true, ipAddress: true, verifiedAt: true },
        });
        if (referrer) {
          referredById = referrer.id;
          referralCounted = referralCounts(referrer, {
            phone: data.phone,
            ipAddress: audit.ipAddress,
            at: new Date(),
          });
        }
      }

      const { ref: _ref, agreedAt, termsVersion, ...fields } = data;
      const row = await tx.signup.create({
        data: {
          ...fields,
          ...audit,
          termsAgreedAt: agreedAt ? new Date(agreedAt) : null,
          termsVersion: termsVersion ?? null,
          founderNumber,
          referralCode: newReferralCode(),
          referredById,
          referralCounted,
        },
      });
      return { ...row, created: true };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );
}
