// Country list + founding-member pricing per Darian's Coke/McDonald's index research.
// Standard price = launch price. Founding price = 50% off for life (every waitlist member — no cap).
//
// Signup is currently free (no deposit), so nothing here is charged. The table
// still drives the nationality dropdown and is kept for future pricing display.

export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  /** ISO 4217 currency code the charge is made in */
  currency: string;
  /** Display string with currency symbol — what users see */
  standardPrice: string;
  /** Founding-member price (50% off) — bolded in UI */
  founderPrice: string;
  /**
   * Founding-member price in the currency's minor unit (kobo, cents, pesewas…),
   * exactly as sent to Paystack's `amount` field. Must agree with `founderPrice`.
   */
  founderAmountMinor: number;
}

export const USD_FALLBACK: Country = {
  code: "OTHER",
  name: "Other",
  currency: "USD",
  standardPrice: "$4.99",
  founderPrice: "$2.50",
  founderAmountMinor: 250,
};

export const COUNTRIES: Country[] = [
  // Southern Africa
  { code: "ZA", name: "South Africa",   currency: "ZAR", standardPrice: "R99",            founderPrice: "R50",        founderAmountMinor: 5_000 },
  { code: "BW", name: "Botswana",       currency: "BWP", standardPrice: "P85",            founderPrice: "P43",        founderAmountMinor: 4_300 },
  { code: "NA", name: "Namibia",        currency: "NAD", standardPrice: "N$95",           founderPrice: "N$48",       founderAmountMinor: 4_800 },
  { code: "ZW", name: "Zimbabwe",       currency: "USD", standardPrice: "$4.99",          founderPrice: "$2.50",      founderAmountMinor: 250 },
  { code: "ZM", name: "Zambia",         currency: "ZMW", standardPrice: "ZMW75",          founderPrice: "ZMW38",      founderAmountMinor: 3_800 },
  { code: "MW", name: "Malawi",         currency: "MWK", standardPrice: "MWK6,500",       founderPrice: "MWK3,250",   founderAmountMinor: 325_000 },

  // East Africa
  { code: "KE", name: "Kenya",          currency: "KES", standardPrice: "KSh600",         founderPrice: "KSh300",     founderAmountMinor: 30_000 },
  { code: "UG", name: "Uganda",         currency: "UGX", standardPrice: "UGX12,000",      founderPrice: "UGX6,000",   founderAmountMinor: 600_000 },
  { code: "TZ", name: "Tanzania",       currency: "TZS", standardPrice: "TSh9,000",       founderPrice: "TSh4,500",   founderAmountMinor: 450_000 },
  { code: "RW", name: "Rwanda",         currency: "RWF", standardPrice: "RWF3,500",       founderPrice: "RWF1,750",   founderAmountMinor: 175_000 },
  { code: "ET", name: "Ethiopia",       currency: "ETB", standardPrice: "Birr250",        founderPrice: "Birr125",    founderAmountMinor: 12_500 },

  // West Africa
  { code: "NG", name: "Nigeria",        currency: "NGN", standardPrice: "₦3,500",         founderPrice: "₦1,750",     founderAmountMinor: 175_000 },
  { code: "GH", name: "Ghana",          currency: "GHS", standardPrice: "GH₵55",          founderPrice: "GH₵28",      founderAmountMinor: 2_800 },
  { code: "SN", name: "Senegal",        currency: "XOF", standardPrice: "CFA2,400",       founderPrice: "CFA1,200",   founderAmountMinor: 120_000 },
  { code: "CI", name: "Côte d'Ivoire",  currency: "XOF", standardPrice: "CFA2,200",       founderPrice: "CFA1,100",   founderAmountMinor: 110_000 },

  // Central Africa
  { code: "CM", name: "Cameroon",       currency: "XAF", standardPrice: "CFA2,300",       founderPrice: "CFA1,150",   founderAmountMinor: 115_000 },
];

/**
 * Currencies the Paystack merchant account can actually charge in.
 * Paystack only settles a handful of currencies per merchant; anything else is
 * rejected at transaction/initialize. Configure via NEXT_PUBLIC_PAYSTACK_CURRENCIES
 * (comma-separated, e.g. "NGN,USD"). It is NEXT_PUBLIC_ so the client-side price
 * box applies exactly the same fallback the server does.
 */
const DEFAULT_SUPPORTED_CURRENCIES = ["NGN", "USD", "GHS", "ZAR", "KES"];

export function supportedCurrencies(): Set<string> {
  const raw = process.env.NEXT_PUBLIC_PAYSTACK_CURRENCIES;
  const list = raw
    ? raw.split(",").map((c) => c.trim().toUpperCase()).filter(Boolean)
    : DEFAULT_SUPPORTED_CURRENCIES;
  return new Set(list.length ? list : DEFAULT_SUPPORTED_CURRENCIES);
}

/** Raw table lookup — no currency fallback applied */
export function countryByCode(code: string | undefined | null): Country {
  if (!code) return USD_FALLBACK;
  return COUNTRIES.find((c) => c.code === code) ?? USD_FALLBACK;
}

/**
 * Effective pricing for a nationality: the local price when Paystack can charge
 * that currency, otherwise the USD fallback. This is what the UI shows and what
 * the server charges.
 */
export function priceFor(code: string | undefined | null): Country {
  const country = countryByCode(code);
  if (supportedCurrencies().has(country.currency)) return country;
  return USD_FALLBACK;
}

export const FALLBACK_COUNTRY_CODE = "OTHER";
