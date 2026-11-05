// Canonical public origin for links we put in emails and redirects.
//
// This must NEVER be derived from request headers (Origin / Host): those are
// client-controlled, and a verification link built from them could be pointed
// at an attacker's domain, leaking the token when the user clicks it.

function https(host: string): string {
  return `https://${host.trim().replace(/\/+$/, "")}`;
}

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  // Vercel system env vars (server-side, not user input).
  // VERCEL_URL is the per-deployment hash URL, which sits behind Vercel
  // Deployment Protection — a link to it would show a Vercel login page to the
  // public. So prefer the production domain, then the stable branch URL.
  const env = process.env.VERCEL_ENV;
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const branch = process.env.VERCEL_BRANCH_URL;
  const deployment = process.env.VERCEL_URL;
  if (env === "production" && prod) return https(prod);
  if (branch) return https(branch);
  if (deployment) return https(deployment);

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  throw new Error(
    "NEXT_PUBLIC_SITE_URL is not configured. It is required in production to build email links."
  );
}
