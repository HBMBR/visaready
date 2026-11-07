"use client";

import { useState, FormEvent } from "react";

export default function MemberLoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "notfound" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/member/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus(data.found ? "sent" : "notfound");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <p className="form-ok">
        Check your inbox: we&apos;ve sent a sign-in link to <b>{email.trim()}</b>. It expires in 30 minutes.
      </p>
    );
  }

  return (
    <form className="signup-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="member-email">Email Address</label>
        <input
          id="member-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "notfound") setStatus("idle");
          }}
        />
      </div>
      <button type="submit" className="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending link…" : "Email me a sign-in link"}
      </button>
      {status === "notfound" && (
        <div className="form-error">
          We couldn&apos;t find that email on the VisaReady list. Check for typos, or{" "}
          <a href="/#signup">join the waitlist free</a>. If you signed up recently, make sure you clicked the
          confirmation link in our email.
        </div>
      )}
      {status === "error" && <div className="form-error">{error}</div>}
    </form>
  );
}
