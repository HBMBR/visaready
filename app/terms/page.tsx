import ContentPage from "@/components/ContentPage";
import { REFERRAL_REWARD } from "@/lib/referral";

export const metadata = {
  title: "Terms — VisaReady",
  description: "Terms for joining the VisaReady waitlist.",
};

// TODO: replace with the full Terms (sent by Darian, 22 Oct).
export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Terms"
      title={<>Waitlist <em>terms.</em></>}
      lede="The basics of joining the VisaReady waitlist. Our full Terms will replace this page before launch."
      updated="7 November 2026"
    >
      <h2>Joining is free</h2>
      <p>
        Joining the waitlist costs nothing and doesn&apos;t commit you to buying anything. You join once you confirm
        your email address.
      </p>

      <h2>Founding member pricing</h2>
      <p>
        Everyone who joins the waitlist before launch is a founding member and gets 50% off the VisaReady
        subscription for as long as they stay a member, plus a 30-day free trial at launch.
      </p>

      <h2>Referrals</h2>
      <p>
        Each member gets a personal link to share. We count friends who sign up and confirm their email through
        your link. Signing yourself up again with another email address doesn&apos;t count. {REFERRAL_REWARD}
      </p>

      <h2>What VisaReady doesn&apos;t do</h2>
      <p>
        VisaReady is not a law firm, recruitment agency or government body. We don&apos;t give immigration advice and
        can&apos;t guarantee a job or a visa. See our <a href="/disclaimer">Disclaimer</a>.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email <a href="mailto:support@visaready.co">support@visaready.co</a>.
      </p>
    </ContentPage>
  );
}
