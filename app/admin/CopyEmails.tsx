"use client";

import { useState } from "react";

/** Copies the emails shown on the current page, comma-separated (paste into BCC). */
export default function CopyEmails({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false);
  if (emails.length === 0) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(emails.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy these emails:", emails.join(", "));
    }
  }

  return (
    <button type="button" className="adm-btn" onClick={copy} title="Comma-separated, ready to paste into BCC">
      {copied ? "Copied ✓" : `Copy ${emails.length} email${emails.length === 1 ? "" : "s"} (this page)`}
    </button>
  );
}
