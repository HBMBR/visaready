import CardPage from "@/components/CardPage";
import ShareLinks from "@/components/ShareLinks";
import { prisma } from "@/lib/db";
import { requireMember } from "@/lib/member-auth";
import { REFERRAL_REWARD, SHARE_TEXT, referralUrl } from "@/lib/referral";

export const dynamic = "force-dynamic";

export default async function MemberPage() {
  const member = await requireMember();
  const referred = await prisma.signup.count({ where: { referredById: member.id, referralCounted: true } });

  return (
    <CardPage wide>
      <div className="signup-card member-card">
        <p className="member-hi">Hi {member.firstName}</p>
        <div className="member-badge">
          <span>Founding Member</span>
          <b>You&apos;re a Founding Member — 50% off for life</b>
        </div>

        <div className="share-block">
          <h3>Your referral link</h3>
          <p>Share VisaReady with friends who are looking for work abroad. {REFERRAL_REWARD}</p>
          <ShareLinks link={referralUrl(member.referralCode)} text={SHARE_TEXT} />
          <p className="member-count">
            <b>{referred}</b> friend{referred === 1 ? " has" : "s have"} joined through your link
          </p>
        </div>

        <p className="member-soon">
          The full platform is coming soon. We&apos;ll email you your early-access link.
        </p>

        <form action="/api/member/logout" method="post" className="member-out">
          <button type="submit" className="linkish">Sign out</button>
        </form>
      </div>
    </CardPage>
  );
}
