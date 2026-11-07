"use client";

import { useEffect } from "react";
import { trackSignup } from "@/lib/pixels";

/** Fires the ad "sign-up" event once, on the "You're in!" page after a new confirmation. */
export default function SignupConversion() {
  useEffect(() => {
    trackSignup();
  }, []);
  return null;
}
