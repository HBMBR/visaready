"use client";

import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Logo />
        <nav className="nav-links">
          <a href="#" className="active">Home</a>
          <a href="#opportunities">Opportunities</a>
          <a href="#talent">Talent</a>
          <a href="#mentorship">Mentorship</a>
          <a href="#blog">Blog</a>
        </nav>
        <div className="nav-cta">
          <button className="btn btn-ghost hide-sm" type="button">Sign In</button>
          <button
            className="btn btn-fill"
            type="button"
            onClick={() => {
              document.getElementById("email")?.focus();
            }}
          >
            Register
          </button>
          <ThemeToggle />
          <button className="icon-btn hamburger" aria-label="Menu" type="button">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M2 5h12M2 11h12" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
