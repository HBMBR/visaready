import Link from "next/link";
import CardPage from "@/components/CardPage";
import ShareLinks from "@/components/ShareLinks";
import SignupConversion from "@/components/SignupConversion";
import { currentMember } from "@/lib/member-auth";
import { SHARE_TEXT, referralUrl } from "@/lib/referral";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

interface PageProps {
  searchParams: Promise<{ status?: string; new?: string }>;
}

export default async function VerifiedPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.status ?? "invalid";

  if (status === "success") {
    const member = await currentMember().catch(() => null);
    return (
      <CardPage wide>
        {params.new === "1" && <SignupConversion />}
        <div className="signup-card success" style={{ textAlign: "center" }}>
          <div className="stamp" style={{ background: "var(--green)" }}>
            <svg width="38" height="38" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 22l8 8 16-18" />
            </svg>
          </div>
          <h2 style={{ textAlign: "center", fontSize: 28 }}>
            You&apos;re in{member ? <>, <em>{member.firstName}</em></> : null}!
          </h2>
          <p>
            Your email is confirmed and you&apos;re a VisaReady founding member, with 50% off for life.
          </p>

          {member ? (
            <div className="share-block">
              <h3>Share VisaReady and earn free months.</h3>
              <ShareLinks link={referralUrl(member.referralCode)} text={SHARE_TEXT} />
            </div>
          ) : (
            <p>
              <Link href="/member/login">Sign in</Link> to get your personal referral link.
            </p>
          )}

          <p>We&apos;ll email you before launch with your early-access link.</p>

          <div style={{ marginTop: 26, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {member && (
              <Link href="/member" className="btn btn-fill" style={{ padding: "12px 24px" }}>
                My member page
              </Link>
            )}
            <Link href="/" className="btn btn-outline" style={{ padding: "12px 24px" }}>
              Back to home
            </Link>
          </div>
        </div>
      </CardPage>
    );
  }

  const content = renderProblem(status);
  return (
    <CardPage>
      <div className="signup-card success" style={{ textAlign: "center" }}>
        <div className="stamp" style={{ background: content.iconColor }}>
          {content.icon}
        </div>
        <h2 style={{ textAlign: "center", fontSize: 28 }}>{content.title}</h2>
        <p>{content.body}</p>
        <div style={{ marginTop: 28 }}>
          <Link href={content.href} className="btn btn-fill" style={{ padding: "12px 28px" }}>
            {content.cta}
          </Link>
        </div>
      </div>
    </CardPage>
  );
}

function renderProblem(status: string) {
  switch (status) {
    case "expired":
      return {
        iconColor: "#d97706",
        icon: (
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ),
        title: "Link expired",
        body: "This confirmation link is more than 48 hours old, so your details weren't saved. Sign up again and we'll send you a fresh one.",
        cta: "Sign up again",
        href: "/#signup",
      };
    case "invalid":
      return {
        iconColor: "#dc2626",
        icon: (
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ),
        title: "Invalid link",
        body: "We couldn't read this link — it may have been cut off or copied incompletely. Try clicking it straight from the email, or sign up again.",
        cta: "Back to home",
        href: "/",
      };
    default:
      return {
        iconColor: "#dc2626",
        icon: (
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v4m0 4h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          </svg>
        ),
        title: "Something went wrong",
        body: "We hit a snag confirming your email. Please try the link again, or contact support@visaready.co.",
        cta: "Back to home",
        href: "/",
      };
  }
}
