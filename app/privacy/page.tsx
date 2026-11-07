import ContentPage from "@/components/ContentPage";

export const metadata = {
  title: "Privacy Policy — VisaReady",
  description: "How VisaReady collects and uses your information.",
};

// TODO: replace with the full Privacy Policy (sent by Darian, 22 Oct).
// Until then this page describes, accurately, what the waitlist does today.
export default function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Privacy Policy"
      title={<>How we use <em>your information.</em></>}
      lede="A plain-English summary of what we collect while VisaReady is in waitlist mode. Our full Privacy Policy will replace this page."
      updated="7 November 2026"
    >
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>When you join the waitlist:</strong> your name, email address, phone number (if you give it),
          nationality, the role you want and where you&apos;d like to work.
        </li>
        <li>
          <strong>When you confirm your email:</strong> the time, your IP address and browser type, to protect the
          waitlist from abuse and fake referrals.
        </li>
        <li>
          <strong>Referrals:</strong> if you joined through a friend&apos;s link, we record who referred you.
        </li>
      </ul>
      <p>
        We don&apos;t store anything until you click the confirmation link in our email. If you never click it, your
        details are not saved.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To keep your founding member place and 50% discount.</li>
        <li>To email you about VisaReady, including your early-access link before launch.</li>
        <li>To send you emails relevant to your profession and destination.</li>
        <li>To count referrals made through your personal link.</li>
      </ul>
      <p>
        We don&apos;t sell your information. Every email we send has an unsubscribe link, and you can unsubscribe at
        any time.
      </p>

      <h2>Cookies and ads</h2>
      <p>
        We use a small cookie to keep you signed in to your member page. If you accept cookies when asked, we
        also use the Meta Pixel and TikTok Pixel to measure which of our ads bring people to VisaReady. If you
        decline, those pixels don&apos;t load. You can change your choice at any time using &ldquo;Cookie
        settings&rdquo; at the bottom of any page.
      </p>

      <h2>Who processes it for us</h2>
      <p>
        Our website host, our database provider and our email provider store and process your information on our
        behalf, only to run VisaReady.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to see, correct or delete your information, or stop all emails, by writing to{" "}
        <a href="mailto:support@visaready.co">support@visaready.co</a>.
      </p>
    </ContentPage>
  );
}
