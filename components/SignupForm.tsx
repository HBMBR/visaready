"use client";

import { useEffect, useState, FormEvent } from "react";
import { COUNTRIES } from "@/lib/countries";
import { ROLES } from "@/lib/roles";
import { DESTINATIONS } from "@/lib/destinations";

const REF_KEY = "vr-ref";
const REF_RE = /^[A-Za-z0-9]{6,16}$/;

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  desiredRole: string;
  destination: string;
}

export default function SignupForm() {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    desiredRole: "",
    destination: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "existing" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [ref, setRef] = useState<string | null>(null);

  // Referral links look like visaready.co/?ref=CODE. Remember the code for the
  // visit, so it survives a detour to another page before signing up.
  useEffect(() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("ref");
      if (fromUrl && REF_RE.test(fromUrl)) {
        sessionStorage.setItem(REF_KEY, fromUrl.toUpperCase());
        setRef(fromUrl.toUpperCase());
      } else {
        const stored = sessionStorage.getItem(REF_KEY);
        if (stored && REF_RE.test(stored)) setRef(stored);
      }
    } catch {
      /* storage blocked: the code still works if they sign up on this page */
      const fromUrl = new URLSearchParams(window.location.search).get("ref");
      if (fromUrl && REF_RE.test(fromUrl)) setRef(fromUrl.toUpperCase());
    }
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Nothing is saved yet: the server emails a confirmation link, and the
  // details are only stored once that link is clicked.
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ref }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setSentTo(form.email.trim());
      setStatus(data.existing ? "existing" : "sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
    }
  }

  if (status === "existing") {
    return (
      <aside className="signup-card success" id="signup">
        <div className="stamp">
          <svg width="38" height="38" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 22l8 8 16-18" />
          </svg>
        </div>
        <h2 style={{ textAlign: "center" }}>
          You&apos;re already <em>on the list.</em>
        </h2>
        <p>
          You&apos;re already on the VisaReady list. Sign in to see your founding member status and referral link.
        </p>
        <div style={{ marginTop: 22 }}>
          <a href="/member/login" className="btn btn-fill" style={{ padding: "12px 28px" }}>
            Sign In
          </a>
        </div>
      </aside>
    );
  }

  if (status === "sent") {
    return (
      <aside className="signup-card success" id="signup">
        <div className="stamp">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
        </div>
        <h2 style={{ textAlign: "center" }}>
          Check your inbox, <em>{form.firstName || "founder"}.</em>
        </h2>
        <p>
          We&apos;ve sent a confirmation link to <b>{sentTo}</b>. Click it within 48 hours to
          confirm your email and become a founding member. Your details aren&apos;t saved until you do.
        </p>
        <p style={{ fontSize: 13, opacity: 0.8 }}>
          Can&apos;t see it? Check your spam or promotions folder.
        </p>
      </aside>
    );
  }

  return (
    <aside className="signup-card" id="signup">
      <h2>
        Ready to elevate your career? Join <em>VisaReady</em> today.
      </h2>
      <p className="sub">
        Free to join. Founding members lock in <b>50% off for life</b>. We&apos;ll email you a link to confirm — no spam, ever.
      </p>

      <form className="signup-form" onSubmit={handleSubmit} autoComplete="on" noValidate>
        <div className="row2">
          <div className="field">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              required
              autoComplete="given-name"
              placeholder="First name"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="lastName">Surname</label>
            <input
              id="lastName"
              type="text"
              required
              autoComplete="family-name"
              placeholder="Surname"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div className="row2">
          <div className="field">
            <label htmlFor="phone">Phone Number <span className="optional">(optional)</span></label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+27 …"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="nationality">Nationality</label>
            <select
              id="nationality"
              required
              value={form.nationality}
              onChange={(e) => update("nationality", e.target.value)}
            >
              <option value="">Select…</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label htmlFor="role">Desired Role</label>
            <select
              id="role"
              required
              value={form.desiredRole}
              onChange={(e) => update("desiredRole", e.target.value)}
            >
              <option value="">Select…</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="destination">Where you&apos;d like to work</label>
            <select
              id="destination"
              required
              value={form.destination}
              onChange={(e) => update("destination", e.target.value)}
            >
              <option value="">Select…</option>
              {DESTINATIONS.map((d) => (
                <option key={d.code} value={d.code}>{d.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="submit" disabled={status === "submitting"}>
          {status === "submitting" && "Sending link…"}
          {(status === "idle" || status === "error") && "Join the waitlist free"}
          {(status === "idle" || status === "error") && (
            <span className="arrow">
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M1 4.5h8M6 1l3.5 3.5L6 8" />
              </svg>
            </span>
          )}
        </button>

        {status === "error" && <div className="form-error">{errorMsg}</div>}

        <div className="form-foot">
          <a className="learn" href="/learn-more">
            Learn More
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M5.5 1.5v8M2 6l3.5 3.5L9 6" />
            </svg>
          </a>
          <div className="login">
            Already on the list? <a href="/member/login">Sign In</a>
          </div>
        </div>
      </form>
    </aside>
  );
}
