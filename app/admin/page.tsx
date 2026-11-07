import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { COUNTRIES } from "@/lib/countries";
import { ROLES } from "@/lib/roles";
import { DESTINATIONS, destinationName } from "@/lib/destinations";
import {
  PAGE_SIZE,
  countryName,
  filterQuery,
  parseFilters,
  whatsappLink,
  whereFor,
} from "@/lib/admin-query";
import CopyEmails from "./CopyEmails";

export const dynamic = "force-dynamic";

const DAY = 86_400_000;

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}

export default async function AdminDashboard({ searchParams }: PageProps) {
  const staff = await requireAdmin();
  const filters = parseFilters(await searchParams);
  const where = whereFor(filters);
  const filtered = Object.keys(where).length > 0;

  const now = Date.now();
  const since30 = new Date(Math.floor(now / DAY) * DAY - 29 * DAY); // start of day, 30 days incl. today (UTC)

  // "verifiedAt" is a timestamp without time zone holding UTC (Prisma's default),
  // so date_trunc on it directly gives UTC days.
  const [total, last7, referralsCounted, unsubscribed, daily, byNationality, byRole, byDestination, topReferrers, matching, rows] = await Promise.all([
    prisma.signup.count(),
    prisma.signup.count({ where: { verifiedAt: { gte: new Date(now - 7 * DAY) } } }),
    prisma.signup.count({ where: { referralCounted: true } }),
    prisma.signup.count({ where: { unsubscribedAt: { not: null } } }),
    prisma.$queryRaw<{ d: Date; n: number }[]>`
      SELECT date_trunc('day', "verifiedAt") AS d, count(*)::int AS n
      FROM "Signup" WHERE "verifiedAt" >= ${since30}
      GROUP BY 1 ORDER BY 1`,
    prisma.signup.groupBy({ by: ["nationality"], _count: { _all: true }, orderBy: { _count: { nationality: "desc" } } }),
    prisma.signup.groupBy({ by: ["desiredRole"], _count: { _all: true }, orderBy: { _count: { desiredRole: "desc" } } }),
    prisma.signup.groupBy({ by: ["destination"], _count: { _all: true }, orderBy: { _count: { destination: "desc" } } }),
    prisma.signup.groupBy({
      by: ["referredById"],
      where: { referralCounted: true, referredById: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { referredById: "desc" } },
      take: 10,
    }),
    prisma.signup.count({ where }),
    prisma.signup.findMany({
      where,
      orderBy: { verifiedAt: "desc" },
      skip: (filters.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        referredBy: { select: { firstName: true, lastName: true, email: true } },
        _count: { select: { referrals: { where: { referralCounted: true } } } },
      },
    }),
  ]);

  const referrerRows = await prisma.signup.findMany({
    where: { id: { in: topReferrers.map((r) => r.referredById!).filter(Boolean) } },
    select: { id: true, firstName: true, lastName: true },
  });
  const referrerName = new Map(referrerRows.map((r) => [r.id, `${r.firstName} ${r.lastName}`]));

  // Fill gaps so every one of the last 30 days has a bar
  const perDay = new Map(daily.map((r) => [new Date(r.d).toISOString().slice(0, 10), r.n]));
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(since30.getTime() + i * DAY);
    const key = d.toISOString().slice(0, 10);
    return { key, label: fmtDate(d), n: perDay.get(key) ?? 0 };
  });
  const maxDay = Math.max(1, ...days.map((d) => d.n));
  const last30 = days.reduce((s, d) => s + d.n, 0);

  const pages = Math.max(1, Math.ceil(matching / PAGE_SIZE));
  const exportHref = `/api/admin/export${filterQuery(filters, { page: 1 })}`;

  return (
    <main className="adm-main">
      <header className="adm-top">
        <div className="adm-brand">
          <span className="brand-mark">V</span>
          <span>Visa<em>Ready</em> <small>Signups</small></span>
        </div>
        <div className="adm-top-right">
          <span className="adm-mute">{staff}</span>
          <form action="/api/admin/logout" method="post">
            <button className="adm-btn" type="submit">Sign out</button>
          </form>
        </div>
      </header>

      {/* ── Headline numbers ── */}
      <section className="adm-stats">
        <Stat label="Total signups" value={total} />
        <Stat label="Last 7 days" value={last7} />
        <Stat label="Last 30 days" value={last30} />
        <Stat label="Confirmed referrals" value={referralsCounted} sub={unsubscribed ? `${unsubscribed.toLocaleString()} unsubscribed from emails` : undefined} />
      </section>

      {/* ── Charts ── */}
      <section className="adm-panels">
        <div className="adm-panel adm-panel-wide">
          <h2>Signups per day <span className="adm-mute">last 30 days (UTC)</span></h2>
          <div className="adm-daily" role="img" aria-label={`Daily signups over the last 30 days, ${last30} in total`}>
            {days.map((d) => (
              <div key={d.key} className="adm-daily-col" title={`${d.label}: ${d.n}`}>
                <div className="adm-daily-bar" style={{ height: `${(d.n / maxDay) * 100}%` }} />
              </div>
            ))}
          </div>
          <div className="adm-daily-axis">
            <span>{days[0].label}</span>
            <span>peak {maxDay === 1 && last30 === 0 ? 0 : maxDay}/day</span>
            <span>{days[days.length - 1].label}</span>
          </div>
        </div>
        <Breakdown
          title="By nationality"
          rows={byNationality.map((r) => ({ label: countryName(r.nationality), n: r._count._all }))}
        />
        <Breakdown title="By desired role" rows={byRole.map((r) => ({ label: r.desiredRole, n: r._count._all }))} />
        <Breakdown
          title="By destination"
          rows={byDestination.map((r) => ({ label: r.destination ? destinationName(r.destination) : "Not asked (early signups)", n: r._count._all }))}
        />
        <Breakdown
          title="Top referrers"
          empty="No confirmed referrals yet."
          rows={topReferrers.map((r) => ({ label: referrerName.get(r.referredById!) ?? "—", n: r._count._all }))}
        />
      </section>

      {/* ── Filters ── */}
      <section className="adm-panel">
        <form className="adm-filters" method="get">
          <input name="q" defaultValue={filters.q} placeholder="Search name, email or phone" aria-label="Search" />
          <select name="nationality" defaultValue={filters.nationality} aria-label="Nationality">
            <option value="">All nationalities</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
            <option value="OTHER">Other</option>
          </select>
          <select name="role" defaultValue={filters.role} aria-label="Desired role">
            <option value="">All roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select name="destination" defaultValue={filters.destination} aria-label="Destination">
            <option value="">All destinations</option>
            {DESTINATIONS.map((d) => (
              <option key={d.code} value={d.code}>{d.label}</option>
            ))}
          </select>
          <label className="adm-date">From <input type="date" name="from" defaultValue={filters.from} /></label>
          <label className="adm-date">To <input type="date" name="to" defaultValue={filters.to} /></label>
          <button className="adm-btn adm-btn-primary" type="submit">Apply</button>
          {filtered && <Link className="adm-btn" href="/admin">Clear</Link>}
        </form>

        <div className="adm-tablebar">
          <span>
            <b>{matching.toLocaleString()}</b> {filtered ? "matching" : "total"} signup{matching === 1 ? "" : "s"}
          </span>
          <span className="adm-tablebar-actions">
            <CopyEmails emails={rows.filter((r) => !r.unsubscribedAt).map((r) => r.email)} />
            <a className="adm-btn adm-btn-primary" href={exportHref}>
              Export CSV{filtered ? " (filtered)" : ""}
            </a>
          </span>
        </div>

        {/* ── Table ── */}
        <div className="adm-tablewrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Nationality</th>
                <th>Desired role</th>
                <th>Destination</th>
                <th>Referrals</th>
                <th>Referred by</th>
                <th>Founder #</th>
                <th>Signed up</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={10} className="adm-empty">
                    {filtered ? "No signups match these filters." : "No confirmed signups yet."}
                  </td>
                </tr>
              )}
              {rows.map((r) => {
                const wa = whatsappLink(r.phone);
                return (
                  <tr key={r.id}>
                    <td className="adm-name">{r.firstName} {r.lastName}</td>
                    <td>
                      <a href={`mailto:${r.email}`}>{r.email}</a>
                      {r.unsubscribedAt && <span className="adm-tag" title={`Unsubscribed ${fmtDate(r.unsubscribedAt)}`}>Unsubscribed</span>}
                    </td>
                    <td className="adm-phone">
                      {r.phone ? <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`}>{r.phone}</a> : <span className="adm-mute">—</span>}
                      {wa && (
                        <a className="adm-wa" href={wa} target="_blank" rel="noopener noreferrer" title="Open in WhatsApp">
                          WhatsApp
                        </a>
                      )}
                    </td>
                    <td>{countryName(r.nationality)}</td>
                    <td>{r.desiredRole}</td>
                    <td>{destinationName(r.destination)}</td>
                    <td className="adm-num">{r._count.referrals || "—"}</td>
                    <td>
                      {r.referredBy ? (
                        <span title={r.referredBy.email}>
                          {r.referredBy.firstName} {r.referredBy.lastName}
                          {!r.referralCounted && <span className="adm-tag" title="Same phone or same IP within 24h as the referrer, so it isn't counted">not counted</span>}
                        </span>
                      ) : (
                        <span className="adm-mute">—</span>
                      )}
                    </td>
                    <td>{r.founderNumber ? `#${String(r.founderNumber).padStart(4, "0")}` : "—"}</td>
                    <td className="adm-nowrap">{fmtDate(r.verifiedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <nav className="adm-pager" aria-label="Pages">
            {filters.page > 1 ? (
              <Link className="adm-btn" href={`/admin${filterQuery(filters, { page: filters.page - 1 })}`}>← Newer</Link>
            ) : <span />}
            <span className="adm-mute">Page {filters.page} of {pages}</span>
            {filters.page < pages ? (
              <Link className="adm-btn" href={`/admin${filterQuery(filters, { page: filters.page + 1 })}`}>Older →</Link>
            ) : <span />}
          </nav>
        )}
      </section>

      <p className="adm-foot adm-mute">
        Contact details are personal data. Use them only to communicate about VisaReady, and never email people
        marked Unsubscribed (they&apos;re left out of &ldquo;Copy emails&rdquo;). Founder # is sign-up order, for staff only.
      </p>
    </main>
  );
}

function Stat({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="adm-stat">
      <div className="adm-stat-label">{label}</div>
      <div className="adm-stat-value">{value.toLocaleString()}</div>
      {sub && <div className="adm-mute">{sub}</div>}
    </div>
  );
}

function Breakdown({ title, rows, empty = "No data yet." }: { title: string; rows: { label: string; n: number }[]; empty?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return (
    <div className="adm-panel">
      <h2>{title}</h2>
      {rows.length === 0 ? (
        <p className="adm-mute">{empty}</p>
      ) : (
        <ul className="adm-bars">
          {rows.map((r) => (
            <li key={r.label}>
              <span className="adm-bars-label">{r.label}</span>
              <span className="adm-bars-track">
                <span className="adm-bars-fill" style={{ width: `${(r.n / max) * 100}%` }} />
              </span>
              <span className="adm-bars-n">{r.n.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
