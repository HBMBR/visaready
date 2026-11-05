// Shared filter parsing for the dashboard table and the CSV export, so the
// export always contains exactly what staff see filtered on screen.

import type { Prisma } from "@prisma/client";
import { COUNTRIES } from "@/lib/countries";
import { isValidRole } from "@/lib/roles";

export const PAGE_SIZE = 50;

export interface SignupFilters {
  q: string;
  nationality: string;
  role: string;
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  page: number;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const VALID_NATIONALITY = new Set([...COUNTRIES.map((c) => c.code), "OTHER"]);

type Params = Record<string, string | string[] | undefined> | URLSearchParams;

function get(params: Params, key: string): string {
  const v = params instanceof URLSearchParams ? params.get(key) : params[key];
  return (Array.isArray(v) ? v[0] : v ?? "").trim();
}

export function parseFilters(params: Params): SignupFilters {
  const nationality = get(params, "nationality");
  const role = get(params, "role");
  const from = get(params, "from");
  const to = get(params, "to");
  const page = Math.max(1, Number.parseInt(get(params, "page"), 10) || 1);
  return {
    q: get(params, "q").slice(0, 100),
    nationality: VALID_NATIONALITY.has(nationality) ? nationality : "",
    role: isValidRole(role) ? role : "",
    from: DATE_RE.test(from) ? from : "",
    to: DATE_RE.test(to) ? to : "",
    page,
  };
}

export function whereFor(f: SignupFilters): Prisma.SignupWhereInput {
  const where: Prisma.SignupWhereInput = {};
  if (f.q) {
    const contains = { contains: f.q, mode: "insensitive" as const };
    where.OR = [
      { firstName: contains },
      { lastName: contains },
      { email: contains },
      { phone: { contains: f.q } },
    ];
  }
  if (f.nationality) where.nationality = f.nationality;
  if (f.role) where.desiredRole = f.role;
  if (f.from || f.to) {
    where.verifiedAt = {};
    if (f.from) where.verifiedAt.gte = new Date(`${f.from}T00:00:00Z`);
    // inclusive of the whole "to" day
    if (f.to) where.verifiedAt.lt = new Date(new Date(`${f.to}T00:00:00Z`).getTime() + 86_400_000);
  }
  return where;
}

/** Query string for the current filters, optionally overriding some (e.g. page). */
export function filterQuery(f: SignupFilters, override: Partial<SignupFilters> = {}): string {
  const merged = { ...f, ...override };
  const qs = new URLSearchParams();
  if (merged.q) qs.set("q", merged.q);
  if (merged.nationality) qs.set("nationality", merged.nationality);
  if (merged.role) qs.set("role", merged.role);
  if (merged.from) qs.set("from", merged.from);
  if (merged.to) qs.set("to", merged.to);
  if (merged.page > 1) qs.set("page", String(merged.page));
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export function countryName(code: string): string {
  if (code === "OTHER") return "Other";
  return COUNTRIES.find((c) => c.code === code)?.name ?? code;
}

/** wa.me link for numbers given in international format (+…); null otherwise. */
export function whatsappLink(phone: string): string | null {
  if (!phone.trim().startsWith("+")) return null;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 8 ? `https://wa.me/${digits}` : null;
}
