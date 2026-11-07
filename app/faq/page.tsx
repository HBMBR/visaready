import ContentPage from "@/components/ContentPage";
import { DESTINATIONS_PHRASE } from "@/lib/destinations";

export const metadata = {
  title: "FAQ — VisaReady",
  description: "Questions about VisaReady, the waitlist and founding member pricing.",
};

// Darian is writing the full set of questions and answers; add them here.
// The answers below only repeat what is already said elsewhere on the site.
const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "What is VisaReady?",
    a: `A job search platform for African professionals who want to work abroad. We bring together jobs in ${DESTINATIONS_PHRASE} from employers that sponsor visas, and show you the visa requirements before you apply.`,
  },
  {
    q: "Is it free to join the waitlist?",
    a: "Yes. Joining is free, and everyone on the waitlist becomes a founding member with 50% off for life.",
  },
  {
    q: "When do you launch?",
    a: "We're building VisaReady now. We'll email you before launch with your early-access link.",
  },
  {
    q: "Do you guarantee a job or a visa?",
    a: "No. VisaReady is not a recruitment agency, law firm or government body. We don't give immigration advice and can't guarantee a job or a visa.",
  },
  {
    q: "How do referrals work?",
    a: (
      <>
        After you confirm your email you get a personal link. Share it, and we&apos;ll count the friends who sign up
        and confirm through it. You can see your link any time by <a href="/member">signing in</a>.
      </>
    ),
  },
  {
    q: "How do I stop emails?",
    a: "Click “Unsubscribe” at the bottom of any of our emails, or write to support@visaready.co.",
  },
];

export default function FaqPage() {
  return (
    <ContentPage eyebrow="FAQ" title={<>Frequently asked <em>questions.</em></>}>
      <div className="faq">
        {FAQS.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <div className="faq-a"><p>{f.a}</p></div>
          </details>
        ))}
      </div>
      <p style={{ marginTop: 32 }}>
        Something else? Email <a href="mailto:support@visaready.co">support@visaready.co</a>.
      </p>
    </ContentPage>
  );
}
