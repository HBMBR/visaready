// Single source of truth for the "Desired Role" options.
// Imported by both the SignupForm (dropdown) and /api/signup (whitelist validation)
// so the two can never drift apart.

export const ROLES = [
  "Tech & Innovation",
  "Finance & Consulting",
  "Creative & Media",
  "Engineering",
  "Sales",
  "Marketing",
  "Healthcare",
  "Administrative",
  "Skilled Trades",
  "Other",
] as const;

export type Role = (typeof ROLES)[number];

export function isValidRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}
