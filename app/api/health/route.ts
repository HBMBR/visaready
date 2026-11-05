import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyTransport } from "@/lib/email";
import { getSiteUrl } from "@/lib/site";

// GET /api/health — is everything signup needs in place?
// Reports pass/fail only. Never returns values of settings or raw errors;
// details go to the server log (Vercel → Project → Logs).

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Check = { ok: boolean; hint?: string };

function present(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

export async function GET() {
  const checks: Record<string, Check> = {};

  // 1. Database reachable + table migrated
  if (!present("DATABASE_URL")) {
    checks.database = { ok: false, hint: "DATABASE_URL is not set for this environment." };
  } else {
    try {
      await prisma.$queryRaw`SELECT 1`;
      try {
        await prisma.signup.count();
        checks.database = { ok: true };
      } catch (err) {
        console.error("[health] signup table:", err);
        checks.database = {
          ok: false,
          hint: "Connected, but the Signup table is missing. Migrations haven't run — redeploy, or run `npm run db:deploy`.",
        };
      }
    } catch (err) {
      console.error("[health] db connect:", err);
      checks.database = { ok: false, hint: "DATABASE_URL is set but the database can't be reached." };
    }
  }

  // 2. Confirmation-link secret
  const secret = process.env.SIGNUP_TOKEN_SECRET?.trim() ?? "";
  checks.signupTokenSecret =
    secret.length >= 32
      ? { ok: true }
      : { ok: false, hint: secret ? "SIGNUP_TOKEN_SECRET is shorter than 32 characters." : "SIGNUP_TOKEN_SECRET is not set." };

  // 3. SMTP
  const missingSmtp = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"].filter((n) => !present(n));
  if (missingSmtp.length) {
    checks.smtp = { ok: false, hint: `Not set: ${missingSmtp.join(", ")}.` };
  } else {
    checks.smtp = (await verifyTransport())
      ? { ok: true }
      : { ok: false, hint: "SMTP settings present but login/connection failed (check host, port, user, password)." };
  }

  // 4. Staff dashboard access list (count only — never the addresses)
  const staffCount = (process.env.ADMIN_EMAILS ?? "").split(/[,\s]+/).filter(Boolean).length;
  checks.adminEmails = staffCount
    ? { ok: true, hint: `${staffCount} staff address${staffCount === 1 ? "" : "es"} can sign in to /admin.` }
    : { ok: false, hint: "ADMIN_EMAILS is not set — nobody can sign in to /admin." };

  // 5. Where email links will point
  let siteUrl: string | null = null;
  try {
    siteUrl = getSiteUrl();
    checks.siteUrl = { ok: true };
  } catch {
    checks.siteUrl = { ok: false, hint: "Set NEXT_PUBLIC_SITE_URL (e.g. https://visaready.co)." };
  }

  const ok = Object.values(checks).every((c) => c.ok);
  return NextResponse.json(
    { ok, environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV, emailLinksPointTo: siteUrl, checks },
    { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } }
  );
}
