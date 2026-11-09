import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentAdmin } from "@/lib/admin-auth";
import { countryName, parseFilters, whereFor } from "@/lib/admin-query";
import { destinationName } from "@/lib/destinations";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_ROWS = 50_000;

// Names are typed by the public. A cell starting with = + - @ (or tab/CR) can run
// as a formula when the CSV is opened in Excel/Sheets, so prefix those with '.
function cell(value: string | number | null | undefined, { formulaSafe = true } = {}): string {
  let s = value == null ? "" : String(value);
  if (formulaSafe && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(request: NextRequest) {
  const staff = await currentAdmin();
  if (!staff) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const filters = parseFilters(request.nextUrl.searchParams);
  const rows = await prisma.signup.findMany({
    where: whereFor(filters),
    orderBy: { verifiedAt: "desc" },
    take: MAX_ROWS,
    include: {
      referredBy: { select: { email: true } },
      _count: { select: { referrals: { where: { referralCounted: true } } } },
    },
  });

  console.log(`[admin] export by ${staff}: ${rows.length} rows, filters=${JSON.stringify({ ...filters, page: undefined })}`);

  const header = [
    "First name", "Last name", "Email", "Phone", "Nationality", "Nationality code", "Desired role", "Destination",
    "Referral code", "Confirmed referrals", "Referred by (email)", "Referral counted", "Unsubscribed (UTC)",
    "Agreed to Terms/Privacy/Disclaimer (UTC)", "Terms version",
    "Founder number", "Signed up (UTC)",
  ];
  const ts = (d: Date | null) => (d ? d.toISOString().replace("T", " ").slice(0, 19) : "");
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        cell(r.firstName),
        cell(r.lastName),
        cell(r.email),
        // Phone is validated to digits, spaces, ()- and a leading +, so it can't
        // contain a formula; keep the + so numbers stay in international format.
        cell(r.phone, { formulaSafe: false }),
        cell(countryName(r.nationality)),
        cell(r.nationality),
        cell(r.desiredRole),
        cell(r.destination ? destinationName(r.destination) : ""),
        cell(r.referralCode),
        cell(r._count.referrals),
        cell(r.referredBy?.email),
        cell(r.referredBy ? (r.referralCounted ? "yes" : "no") : ""),
        cell(ts(r.unsubscribedAt)),
        cell(ts(r.termsAgreedAt)),
        cell(r.termsVersion),
        cell(r.founderNumber),
        cell(ts(r.verifiedAt)),
      ].join(",")
    );
  }

  const stamp = new Date().toISOString().slice(0, 10);
  // BOM so Excel opens UTF-8 names (é, ô, …) correctly
  return new NextResponse("﻿" + lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="visaready-signups-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
