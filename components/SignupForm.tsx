"use client";

import { useEffect, useState, FormEvent } from "react";
import { COUNTRIES } from "@/lib/countries";
import { ROLES } from "@/lib/roles";
import { DESTINATIONS } from "@/lib/destinations";
import { SHORT_DISCLAIMER } from "@/lib/disclaimer";
import { AGREE_MESSAGE, validateSignup, type SignupField } from "@/lib/signup-validation";
import { storedUtm } from "@/lib/utm";
import { trackFormSubmitted } from "@/lib/pixels";

// Element id for each field, so a problem can focus the right input.
const FIELD_ID: Record<SignupField, string> = {
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  phone: "phone",
  nationality: "nationality",
  desiredRole: "role",
  destination: "destination",
  agreed: "agree",
};

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
  const [badField, setBadField] = useState<SignupField | null>(null);
  const [agreed, setAgreed] = useState(false);
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
    if (badField === key) clearError();
  }

  function clearError() {
    setBadField(null);
    setErrorMsg("");
    setStatus((s) => (s === "error" ? "idle" : s));
  }

  function showError(field: SignupField | null, message: string) {
    setStatus("error");
    setErrorMsg(message);
    setBadField(field);
    if (field) document.getElementById(FIELD_ID[field])?.focus();
  }

  const invalid = (field: SignupField) => (badField === field ? { "aria-invalid": true, className: "invalid" } : {});

  // Nothing is saved yet: the server emails a confirmation link, and the
  // details are only stored once that link is clicked.
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    // Check everything here first (same rules as the server), so people see
    // what's missing straight away and nothing is sent without the agreement.
    const problem = validateSignup({ ...form, agreed });
    if (problem) {
      showError(problem.field, problem.message);
      return;
    }

    setStatus("submitting");
    setErrorMsg("");
    setBadField(null);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, agreed, ref, utm: storedUtm() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const field = typeof data.field === "string" && data.field in FIELD_ID ? (data.field as SignupField) : null;
        showError(field, data.error || "Something went wrong. Please try again.");
        return;
      }
      setSentTo(form.email.trim());
      setStatus(data.existing ? "existing" : "sent");
      // Form sent, confirmation email on its way. The "Lead" event comes later,
      // when they click the link.
      if (!data.existing) trackFormSubmitted();
    } catch (err) {
      showError(null, err instanceof Error && err.message !== "Failed to fetch"
        ? err.message
        : "We couldn't reach VisaReady. Check your connection and try again.");
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
              id="firstName" {...invalid("firstName")}
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
              id="lastName" {...invalid("lastName")}
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
            id="email" {...invalid("email")}
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
              id="phone" {...invalid("phone")}
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
              id="nationality" {...invalid("nationality")}
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
              id="role" {...invalid("desiredRole")}
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
              id="destination" {...invalid("destination")}
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

        <p className="form-disclaimer">{SHORT_DISCLAIMER}</p>

        <label className={`form-agree${badField === "agreed" ? " invalid" : ""}`} htmlFor="agree">
          <input
            id="agree"
            type="checkbox"
            required
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (badField === "agreed") clearError();
            }}
            {...invalid("agreed")}
          />
          <span>
            I agree to the <a href="/terms" target="_blank">Terms</a>,{" "}
            <a href="/privacy" target="_blank">Privacy Policy</a> and{" "}
            <a href="/disclaimer" target="_blank">Disclaimer</a>.
          </span>
        </label>

        <button
          type="submit"
          className="submit"
          disabled={status === "submitting" || !agreed}
          title={agreed ? undefined : AGREE_MESSAGE}
        >
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

        {!agreed && status !== "error" && (
          <p className="form-hint">Tick the box above to agree before you join.</p>
        )}

        {status === "error" && <div className="form-error" role="alert">{errorMsg}</div>}

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
        <div className="form-faq">
          Questions? <a href="/faq">Read our FAQ</a>
        </div>
      </form>
    </aside>
  );
}
