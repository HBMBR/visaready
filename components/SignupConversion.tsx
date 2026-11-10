"use client";

import { useEffect } from "react";
import { trackLead } from "@/lib/pixels";

/**
 * Sends the "Lead" ad event once, on the "You're in!" page after a new
 * confirmation (the page is only given `new=1` the first time the link is
 * clicked). `new=1` is then removed from the address, so reloading the page
 * or going back to it doesn't count the same person twice.
 */
export default function SignupConversion() {
  useEffect(() => {
    trackLead();
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has("new")) {
        url.searchParams.delete("new");
        window.history.replaceState(window.history.state, "", url.toString());
      }
    } catch {
      /* not important if it fails */
    }
  }, []);
  return null;
}
