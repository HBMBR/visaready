"use client";

import { useState } from "react";

interface Props {
  link: string;
  text: string;
}

export default function ShareLinks({ link, text }: Props) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy your link:", link);
    }
  }

  return (
    <div className="share">
      <div className="share-link">
        <input readOnly value={link} aria-label="Your referral link" onFocus={(e) => e.currentTarget.select()} />
        <button type="button" className="share-copy" onClick={copy}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <div className="share-buttons">
        <a className="share-btn wa" href={`https://wa.me/?text=${enc(`${text} ${link}`)}`} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        <a className="share-btn fb" href={`https://www.facebook.com/sharer/sharer.php?u=${enc(link)}`} target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
        <a className="share-btn x" href={`https://x.com/intent/post?text=${enc(text)}&url=${enc(link)}`} target="_blank" rel="noopener noreferrer">
          X
        </a>
        <button type="button" className="share-btn copy" onClick={copy}>
          {copied ? "Copied ✓" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
