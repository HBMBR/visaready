"use client";

import { useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#industries", label: "Industries" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
];

/** On the home page, jump to the form and put the cursor in it. */
export function goToSignup(e: MouseEvent) {
  const email = document.getElementById("email");
  if (!email) return; // other pages: follow the /#signup link
  e.preventDefault();
  document.getElementById("signup")?.scrollIntoView({ behavior: "smooth", block: "center" });
  email.focus({ preventScroll: true });
}

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = LINKS.map((l) => (
    <a
      key={l.href}
      href={l.href}
      className={l.href === pathname ? "active" : undefined}
      onClick={() => setOpen(false)}
    >
      {l.label}
    </a>
  ));

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Logo />
        <nav className="nav-links" aria-label="Main">{links}</nav>
        <div className="nav-cta">
          <a className="btn btn-ghost hide-sm" href="/member">Sign In</a>
          <a className="btn btn-fill" href="/#signup" onClick={goToSignup}>Register</a>
          <button
            className="icon-btn hamburger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            type="button"
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              {open ? <path d="M3 3l10 10M13 3L3 13" /> : <path d="M2 5h12M2 11h12" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" className="nav-mobile" aria-label="Main">
          <div className="container">
            {links}
            <a href="/member" onClick={() => setOpen(false)}>Sign In</a>
          </div>
        </nav>
      )}
    </header>
  );
}
