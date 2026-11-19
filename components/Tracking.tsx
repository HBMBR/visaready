"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/pixels";
import { rememberUtmFromUrl } from "@/lib/utm";

/**
 * On every page: remembers ad tags (utm_…) from the link the visitor came in
 * on, so they're saved with the sign-up even if they look around first; and
 * sends a PageView when they move to another page without a full reload.
 */
export default function Tracking() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    rememberUtmFromUrl();
    if (first.current) {
      first.current = false; // the first PageView is sent when the pixel loads
      return;
    }
    trackPageView();
  }, [pathname]);

  return null;
}
