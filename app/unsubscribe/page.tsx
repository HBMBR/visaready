import CardPage from "@/components/CardPage";
import { prisma } from "@/lib/db";
import { verifyUnsubscribeToken } from "@/lib/member-auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Unsubscribe — VisaReady", robots: { index: false, follow: false } };

interface PageProps {
  searchParams: Promise<{ token?: string; status?: string }>;
}

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  return `${user.slice(0, 2)}${"•".repeat(Math.max(1, user.length - 2))}@${domain}`;
}

export default async function UnsubscribePage({ searchParams }: PageProps) {
  const { token, status } = await searchParams;

  if (status === "done" || status === "invalid" || status === "error") {
    const msg = {
      done: ["You're unsubscribed.", "You won't get any more emails from VisaReady. You're still on the list, and your founding member discount stays."],
      invalid: ["That link didn't work.", "Please use the unsubscribe link from one of our emails, or write to support@visaready.co."],
      error: ["Something went wrong.", "Please try again, or write to support@visaready.co and we'll unsubscribe you."],
    }[status];
    return (
      <CardPage>
        <div className="signup-card success" style={{ textAlign: "center" }}>
          <h2 style={{ textAlign: "center", fontSize: 26 }}>{msg[0]}</h2>
          <p>{msg[1]}</p>
          <div style={{ marginTop: 24 }}>
            <a href="/" className="btn btn-fill" style={{ padding: "12px 26px" }}>Back to home</a>
          </div>
        </div>
      </CardPage>
    );
  }

  const id = verifyUnsubscribeToken(token);
  const member = id ? await prisma.signup.findUnique({ where: { id }, select: { email: true, unsubscribedAt: true } }).catch(() => null) : null;

  return (
    <CardPage>
      <div className="signup-card success" style={{ textAlign: "center" }}>
        {member ? (
          member.unsubscribedAt ? (
            <>
              <h2 style={{ textAlign: "center", fontSize: 26 }}>You&apos;re already unsubscribed.</h2>
              <p>{maskEmail(member.email)} won&apos;t get any more emails from VisaReady.</p>
            </>
          ) : (
            <>
              <h2 style={{ textAlign: "center", fontSize: 26 }}>Unsubscribe from VisaReady emails?</h2>
              <p>
                We&apos;ll stop emailing <b>{maskEmail(member.email)}</b>, including your early-access link at launch.
                Your founding member discount stays.
              </p>
              <form action="/api/unsubscribe" method="post" style={{ marginTop: 24 }}>
                <input type="hidden" name="token" value={token} />
                <button type="submit" className="btn btn-fill" style={{ padding: "12px 26px" }}>Unsubscribe</button>
              </form>
            </>
          )
        ) : (
          <>
            <h2 style={{ textAlign: "center", fontSize: 26 }}>That link didn&apos;t work.</h2>
            <p>Please use the unsubscribe link from one of our emails, or write to support@visaready.co.</p>
          </>
        )}
      </div>
    </CardPage>
  );
}
