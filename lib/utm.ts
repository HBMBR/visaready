// Ad tags (UTM parameters) from ad links, e.g.
//   visaready.co/?utm_source=meta&utm_campaign=waitlist&utm_content=ad1-problem-photo&utm_term=nigeria
// Saved against each sign-up so staff can see which ad brought who.
// Used by the browser (to remember them for the visit) and the server (to clean them).

export const UTM_KEYS = ["utm_source", "utm_campaign", "utm_content", "utm_term"] as const;
export type UtmKey = (typeof UTM_KEYS)[number];

export interface Utm {
  utmSource: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
}

export const NO_UTM: Utm = { utmSource: null, utmCampaign: null, utmContent: null, utmTerm: null };

const FIELD: Record<UtmKey, keyof Utm> = {
  utm_source: "utmSource",
  utm_campaign: "utmCampaign",
  utm_content: "utmContent",
  utm_term: "utmTerm",
};

const MAX_LEN = 100;

/** Trims, drops control characters and caps the length; null if empty. */
export function cleanUtmValue(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  // eslint-disable-next-line no-control-regex
  const v = raw.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, MAX_LEN);
  return v || null;
}

/** From URL search params (utm_source=…) to the stored shape. */
export function utmFromParams(params: URLSearchParams): Utm | null {
  const out: Utm = { ...NO_UTM };
  let any = false;
  for (const key of UTM_KEYS) {
    const v = cleanUtmValue(params.get(key));
    if (v) {
      out[FIELD[key]] = v;
      any = true;
    }
  }
  return any ? out : null;
}

/** From an untrusted object ({ utmSource, … }) to the stored shape. */
export function cleanUtm(raw: unknown): Utm {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    utmSource: cleanUtmValue(r.utmSource),
    utmCampaign: cleanUtmValue(r.utmCampaign),
    utmContent: cleanUtmValue(r.utmContent),
    utmTerm: cleanUtmValue(r.utmTerm),
  };
}

// ── Browser: remember the tags for the visit ──
// Kept in sessionStorage (this tab only, gone when it closes), like the
// referral code: the latest ad link someone came from wins.

const STORE_KEY = "vr-utm";

export function rememberUtmFromUrl(): void {
  try {
    const found = utmFromParams(new URLSearchParams(window.location.search));
    if (found) sessionStorage.setItem(STORE_KEY, JSON.stringify(found));
  } catch {
    /* storage blocked: tags are still read from the URL at sign-up */
  }
}

export function storedUtm(): Utm {
  try {
    const fromUrl = utmFromParams(new URLSearchParams(window.location.search));
    if (fromUrl) return fromUrl;
    const raw = sessionStorage.getItem(STORE_KEY);
    return raw ? cleanUtm(JSON.parse(raw)) : { ...NO_UTM };
  } catch {
    return { ...NO_UTM };
  }
}

/** "meta / waitlist / ad1-problem-photo / nigeria" for display; "" if none. */
export function utmLabel(u: Partial<Utm>): string {
  return [u.utmSource, u.utmCampaign, u.utmContent, u.utmTerm].map((v) => v || "–").join(" / ").replace(/^(– \/ ){3}–$/, "");
}
