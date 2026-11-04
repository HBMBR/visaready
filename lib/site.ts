// Canonical public origin for links we put in emails and redirects.
//
// This must NEVER be derived from request headers (Origin / Host): those are
// client-controlled, and a verification link built from them could be pointed
// at an attacker's domain, leaking the token when the user clicks it.

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  // Vercel sets this server-side for preview deployments; it is not user input.
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  throw new Error(
    "NEXT_PUBLIC_SITE_URL is not configured. It is required in production to build email links."
  );
}
