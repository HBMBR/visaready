"use client";

import { useState, FormEvent } from "react";
import { COUNTRIES } from "@/lib/countries";
import { ROLES } from "@/lib/roles";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  desiredRole: string;
}

export default function SignupForm() {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    desiredRole: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [sentTo, setSentTo] = useState("");

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
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setSentTo(form.email.trim());
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
    }
  }

  if (status === "sent") {
    return (
      <aside className="signup-card success" id="signupCard">
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
          confirm your email and claim your founding seat — your spot isn&apos;t saved until you do.
        </p>
        <p style={{ fontSize: 13, opacity: 0.8 }}>
          Can&apos;t see it? Check your spam or promotions folder.
        </p>
      </aside>
    );
  }

  return (
    <aside className="signup-card" id="signupCard">
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
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              required
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

        <button type="submit" className="submit" disabled={status === "submitting"}>
          {status === "submitting" && "Sending link…"}
          {(status === "idle" || status === "error") && "Get Early Access"}
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
            Already have an account? <a href="#">Log In</a>
          </div>
        </div>
      </form>
    </aside>
  );
}
