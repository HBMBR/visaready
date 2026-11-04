import Logo from "@/components/Logo";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ status?: string; n?: string }>;
}

export default async function VerifiedPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.status ?? "invalid";
  const founderNumber = params.n;

  const content = renderContent(status, founderNumber);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b1638",
        backgroundImage: "url(/hero-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "60% 18%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(11,22,56,0.7) 0%, rgba(11,22,56,0.5) 50%, rgba(11,22,56,0.85) 100%)",
        }}
      />
      <div style={{ position: "relative", width: "100%", maxWidth: 440 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <Logo />
        </div>

        <div className="signup-card success" style={{ textAlign: "center" }}>
          <div className="stamp" style={{ background: content.iconColor }}>
            {content.icon}
          </div>
          <h2 style={{ textAlign: "center", fontSize: 28 }}>{content.title}</h2>
          <p>{content.body}</p>

          {content.showFounderBadge && founderNumber && (
            <div className="seat">
              Founding member<b>#{String(founderNumber).padStart(4, "0")}</b>
            </div>
          )}

          <div style={{ marginTop: 28 }}>
            <Link href="/" className="btn btn-fill" style={{ padding: "12px 28px" }}>
              {content.cta}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function renderContent(status: string, n?: string) {
  switch (status) {
    case "success":
      return {
        iconColor: "var(--green)",
        icon: (
          <svg width="38" height="38" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 22l8 8 16-18" />
          </svg>
        ),
        title: "You're in!",
        body: n
          ? "Your email is verified and your founding seat is locked in. Check your inbox for a welcome message with the full details."
          : "Your email is verified. We'll be in touch when we launch.",
        showFounderBadge: true,
        cta: "Back to home",
      };
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
        showFounderBadge: false,
        cta: "Sign up again",
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
        showFounderBadge: false,
        cta: "Back to home",
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
        body: "We hit a snag verifying your email. Please try the link again, or contact support@visaready.co.",
        showFounderBadge: false,
        cta: "Back to home",
      };
  }
}
