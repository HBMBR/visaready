"use client";

import { useEffect, useState } from "react";
import { PIXELS_CONFIGURED, getConsent, loadPixels, setConsent } from "@/lib/pixels";

// Ad pixels (Meta, TikTok) set cookies, so under UK GDPR / POPIA they only
// load after the visitor says yes. Shown only when a pixel ID is configured.
export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!PIXELS_CONFIGURED) return;
    const sync = () => {
      const c = getConsent();
      setOpen(c === null);
      if (c === "granted") loadPixels();
    };
    sync();
    window.addEventListener("vr-consent", sync);
    return () => window.removeEventListener("vr-consent", sync);
  }, []);

  if (!open) return null;

  return (
    <div className="consent" role="dialog" aria-live="polite" aria-label="Cookie choice">
      <p>
        We use cookies from Meta and TikTok to see which of our ads bring people to VisaReady. Is that OK?{" "}
        <a href="/privacy">Privacy Policy</a>
      </p>
      <div className="consent-actions">
        <button type="button" className="btn consent-no" onClick={() => setConsent("denied")}>Decline</button>
        <button type="button" className="btn btn-fill" onClick={() => setConsent("granted")}>Accept</button>
      </div>
    </div>
  );
}

/** Footer link to change the choice later. */
export function CookieSettingsLink() {
  if (!PIXELS_CONFIGURED) return null;
  return (
    <button type="button" className="foot-linkbtn" onClick={() => setConsent(null)}>
      Cookie settings
    </button>
  );
}
