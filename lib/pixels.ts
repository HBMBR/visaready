// Meta Pixel + TikTok Pixel, loaded only after the visitor accepts cookies.
//
// Events (what the ads optimise for):
//   PageView              every page, including moves between pages
//   CompleteRegistration  sign-up form sent (confirmation email on its way)
//   Lead                  email confirmed ("You're in!" page): the main one
//
// The Meta Pixel ID is public (it's in every page's source anyway), so it has
// a built-in default; NEXT_PUBLIC_META_PIXEL_ID in Vercel overrides it.
// TikTok only loads when NEXT_PUBLIC_TIKTOK_PIXEL_ID is set.
//
// Client-only module.

/* eslint-disable @typescript-eslint/no-explicit-any */

const DEFAULT_META_PIXEL_ID = "1051826217917551";
export const META_PIXEL_ID = (process.env.NEXT_PUBLIC_META_PIXEL_ID || DEFAULT_META_PIXEL_ID).trim();
export const TIKTOK_PIXEL_ID = (process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? "").trim();
export const PIXELS_CONFIGURED = Boolean(META_PIXEL_ID || TIKTOK_PIXEL_ID);

const CONSENT_KEY = "vr-cookie-consent";
export type Consent = "granted" | "denied";

export function getConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

type PixelEvent = "Lead" | "CompleteRegistration";

// Events that happened before the visitor answered the cookie banner. They're
// sent if they accept while still on the page, and dropped if they decline.
let pending: PixelEvent[] = [];
let loaded = false;

export function setConsent(v: Consent | null) {
  try {
    if (v) localStorage.setItem(CONSENT_KEY, v);
    else localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* private mode: consent lasts for this page only */
  }
  if (v === "granted") {
    loadPixels(true);
    const queued = pending;
    pending = [];
    queued.forEach(send);
  } else {
    pending = [];
  }
  window.dispatchEvent(new Event("vr-consent"));
}

function loadMeta(id: string) {
  const w = window as any;
  if (w.fbq) return;
  const n: any = function (...args: any[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue.push(args);
  };
  w.fbq = n;
  w._fbq = w._fbq || n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  w.fbq("init", id);
  w.fbq("track", "PageView");
}

function loadTikTok(id: string) {
  const w = window as any;
  if (w.ttq?._loadedId) return;
  w.TiktokAnalyticsObject = "ttq";
  const ttq: any = (w.ttq = w.ttq || []);
  ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
  ttq.setAndDefer = function (t: any, e: string) {
    t[e] = function (...args: any[]) {
      t.push([e, ...args]);
    };
  };
  for (const m of ttq.methods) ttq.setAndDefer(ttq, m);
  ttq.instance = function (t: string) {
    const e = ttq._i[t] || [];
    for (const m of ttq.methods) ttq.setAndDefer(e, m);
    return e;
  };
  ttq.load = function (e: string, n?: any) {
    const r = "https://analytics.tiktok.com/i18n/pixel/events.js";
    ttq._i = ttq._i || {};
    ttq._i[e] = [];
    ttq._i[e]._u = r;
    ttq._t = ttq._t || {};
    ttq._t[e] = +new Date();
    ttq._o = ttq._o || {};
    ttq._o[e] = n || {};
    const s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = `${r}?sdkid=${encodeURIComponent(e)}&lib=ttq`;
    document.head.appendChild(s);
  };
  ttq.load(id);
  ttq.page();
  ttq._loadedId = id;
}

/** Loads the pixels if the visitor has accepted. Safe to call repeatedly. */
export function loadPixels(force = false) {
  if (loaded || !PIXELS_CONFIGURED) return;
  if (!force && getConsent() !== "granted") return;
  loaded = true;
  if (META_PIXEL_ID) loadMeta(META_PIXEL_ID);
  if (TIKTOK_PIXEL_ID) loadTikTok(TIKTOK_PIXEL_ID);
}

function send(event: PixelEvent) {
  const w = window as any;
  if (META_PIXEL_ID) w.fbq?.("track", event);
  // TikTok has no "Lead" standard event: confirmed sign-ups are its CompleteRegistration.
  if (TIKTOK_PIXEL_ID && event === "Lead") w.ttq?.track?.("CompleteRegistration");
}

function track(event: PixelEvent) {
  if (!PIXELS_CONFIGURED) return;
  if (getConsent() !== "granted" && !loaded) {
    if (!pending.includes(event)) pending.push(event);
    return;
  }
  loadPixels(true);
  send(event);
}

/** Email confirmed ("You're in!" page). What the ads optimise for. */
export function trackLead() {
  track("Lead");
}

/** Sign-up form sent; the person still has to confirm their email. */
export function trackFormSubmitted() {
  track("CompleteRegistration");
}

/** A move to another page without a full reload (the first page's PageView is sent on load). */
export function trackPageView() {
  if (!loaded) return;
  const w = window as any;
  if (META_PIXEL_ID) w.fbq?.("track", "PageView");
  if (TIKTOK_PIXEL_ID) w.ttq?.page?.();
}
