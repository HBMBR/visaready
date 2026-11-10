// Numbers for the "Ads" part of the staff dashboard: sign-ups (forms sent,
// each person once) against confirmed sign-ups, overall and per ad.
// Server-only.

import { prisma } from "@/lib/db";

export interface AdRow {
  utmSource: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  signups: number;
  confirmed: number;
}

export interface AdStats {
  /** When form sign-ups started being counted (first SignupAttempt); null if none yet */
  since: Date | null;
  /** People who sent the form since then (each email once) */
  signups: number;
  /** Of all confirmed members, those who confirmed since then */
  confirmedSince: number;
  byAd: AdRow[];
}

const key = (r: Pick<AdRow, "utmSource" | "utmCampaign" | "utmContent" | "utmTerm">) =>
  JSON.stringify([r.utmSource, r.utmCampaign, r.utmContent, r.utmTerm]);

export async function adStats(): Promise<AdStats> {
  const first = await prisma.signupAttempt.findFirst({ orderBy: { createdAt: "asc" }, select: { createdAt: true } });
  if (!first) return { since: null, signups: 0, confirmedSince: 0, byAd: [] };
  const since = first.createdAt;

  const [people, confirmedSince, attemptsByAd, confirmedByAd] = await Promise.all([
    prisma.$queryRaw<{ n: number }[]>`SELECT count(DISTINCT "emailHash")::int AS n FROM "SignupAttempt"`,
    prisma.signup.count({ where: { verifiedAt: { gte: since } } }),
    prisma.$queryRaw<Omit<AdRow, "confirmed">[]>`
      SELECT "utmSource", "utmCampaign", "utmContent", "utmTerm", count(DISTINCT "emailHash")::int AS signups
      FROM "SignupAttempt"
      GROUP BY 1, 2, 3, 4`,
    // Same window as the sign-ups, so the rate compares like with like.
    prisma.signup.groupBy({
      by: ["utmSource", "utmCampaign", "utmContent", "utmTerm"],
      where: { verifiedAt: { gte: since } },
      _count: { _all: true },
    }),
  ]);

  const rows = new Map<string, AdRow>();
  for (const a of attemptsByAd) rows.set(key(a), { ...a, confirmed: 0 });
  for (const c of confirmedByAd) {
    const k = key(c);
    const row = rows.get(k) ?? {
      utmSource: c.utmSource,
      utmCampaign: c.utmCampaign,
      utmContent: c.utmContent,
      utmTerm: c.utmTerm,
      signups: 0,
      confirmed: 0,
    };
    row.confirmed = c._count._all;
    rows.set(k, row);
  }

  const byAd = [...rows.values()].sort((a, b) => b.confirmed - a.confirmed || b.signups - a.signups);
  return { since, signups: people[0]?.n ?? 0, confirmedSince, byAd };
}

/** "62%", or "—" when there's nothing to compare. */
export function rate(confirmed: number, signups: number): string {
  if (!signups) return "—";
  return `${Math.round((Math.min(confirmed, signups) / signups) * 100)}%`;
}
