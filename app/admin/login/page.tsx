import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ error?: string; signedOut?: string }>;
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  if (await currentAdmin()) redirect("/admin");
  const params = await searchParams;

  return (
    <main className="adm-login">
      <div className="adm-login-card">
        <div className="adm-brand">
          <span className="brand-mark">V</span>
          <span>Visa<em>Ready</em> <small>Staff</small></span>
        </div>
        <h1>Sign in</h1>
        <p className="adm-mute">Enter your work email and we&apos;ll send you a sign-in link.</p>
        {params.error === "link" && (
          <p className="adm-alert">That sign-in link is invalid or has expired (links last 15 minutes). Request a new one.</p>
        )}
        {params.signedOut && <p className="adm-note">You&apos;ve been signed out.</p>}
        <LoginForm />
      </div>
    </main>
  );
}
