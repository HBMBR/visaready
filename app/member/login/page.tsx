import { redirect } from "next/navigation";
import CardPage from "@/components/CardPage";
import { currentMember } from "@/lib/member-auth";
import MemberLoginForm from "./MemberLoginForm";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function MemberLoginPage({ searchParams }: PageProps) {
  if (await currentMember().catch(() => null)) redirect("/member");
  const params = await searchParams;

  return (
    <CardPage>
      <div className="signup-card">
        <h2>
          Sign in to <em>VisaReady</em>
        </h2>
        <p className="sub">
          Enter the email you signed up with and we&apos;ll send you a sign-in link. No password needed.
        </p>
        {params.error === "link" && (
          <div className="form-error" style={{ marginBottom: 14 }}>
            That sign-in link is invalid or has expired (links last 30 minutes). Request a new one below.
          </div>
        )}
        <MemberLoginForm />
      </div>
    </CardPage>
  );
}
