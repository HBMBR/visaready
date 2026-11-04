import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { welcomeEmail } from "@/lib/email-templates/welcome";
import { getSiteUrl } from "@/lib/site";
import { openSignup, type PendingSignup } from "@/lib/signup-token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // crypto

const TOTAL_FOUNDING_SPOTS = 1000;

// Concurrent verifications can compute the same next founder number. The UNIQUE
// constraint rejects the loser (P2002), and Serializable isolation can abort a
// transaction (P2034). Both are safe to retry: the count is recomputed each time.
const MAX_ATTEMPTS = 5;

function isRetryable(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    (err.code === "P2002" || err.code === "P2034")
  );
}

function extractIp(req: NextRequest): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim().slice(0, 64) || null;
  return req.headers.get("x-real-ip")?.slice(0, 64) ?? null;
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

  const audit = {
    ipAddress: extractIp(request),
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
    if (result.created && result.founderNumber) {
      try {
        const tpl = welcomeEmail({ firstName: result.firstName, founderNumber: result.founderNumber });
        await sendEmail({ to: result.email, subject: tpl.subject, html: tpl.html, text: tpl.text });
      } catch (mailErr) {
        console.error("[verify] welcome email failed:", mailErr);
      }
    }

    return NextResponse.redirect(
      `${origin}/verified?status=success&n=${result.founderNumber ?? ""}`
    );
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

      const count = await tx.signup.count();
      const founderNumber = count < TOTAL_FOUNDING_SPOTS ? count + 1 : null;

      const row = await tx.signup.create({
        data: { ...data, ...audit, founderNumber },
      });
      return { ...row, created: true };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );
}
