// Where members want to work. Single source of truth for the signup dropdown,
// /api/signup validation, the staff dashboard, and the copy on the site.

export const DESTINATIONS = [
  { code: "UK", label: "United Kingdom" },
  { code: "EU", label: "Europe" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "NZ", label: "New Zealand" },
  { code: "US", label: "USA" },
  { code: "NOT_SURE", label: "Not sure yet" },
] as const;

export type DestinationCode = (typeof DESTINATIONS)[number]["code"];

/** Used in copy across the site and emails. */
export const DESTINATIONS_PHRASE = "the UK, Europe, Canada, Australia, New Zealand and the USA";

export function isValidDestination(value: string): value is DestinationCode {
  return DESTINATIONS.some((d) => d.code === value);
}

export function destinationName(code: string | null | undefined): string {
  if (!code) return "—";
  return DESTINATIONS.find((d) => d.code === code)?.label ?? code;
}
