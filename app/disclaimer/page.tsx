import ContentPage from "@/components/ContentPage";
import { SITE_DISCLAIMER } from "@/components/Footer";

export const metadata = {
  title: "Disclaimer — VisaReady",
  description: "VisaReady is a job search and research tool. We are not a law firm, recruitment agency or government body.",
};

// TODO: replace the body with the full text of the "VisaReady Disclaimer" doc.
export default function DisclaimerPage() {
  return (
    <ContentPage eyebrow="Disclaimer" title={<>What VisaReady <em>is and isn&apos;t.</em></>} updated="7 November 2026">
      <p>{SITE_DISCLAIMER}</p>

      <h2>Not immigration or legal advice</h2>
      <p>
        Information on VisaReady, including any visa route shown next to a job, is general information to help
        you research. It is not legal or immigration advice. Visa rules change often: always check the official
        government rules for the country you are applying to, and speak to a regulated adviser if you need advice
        on your situation.
      </p>

      <h2>No guarantee of a job or a visa</h2>
      <p>
        Employers decide who they hire, and governments decide who gets a visa. You still need to meet the visa
        requirements for any job you apply for. VisaReady can&apos;t guarantee that you will get an interview, a job
        offer, sponsorship or a visa.
      </p>

      <h2>Not a recruitment agency</h2>
      <p>
        VisaReady doesn&apos;t recruit on behalf of employers and never asks for money in exchange for a job or a
        visa. If anyone claiming to be from VisaReady asks you to pay for a job or a visa, don&apos;t pay. Report it
        to <a href="mailto:support@visaready.co">support@visaready.co</a>.
      </p>

      <h2>Employer checks</h2>
      <p>
        When listings go live, we will check employers against each country&apos;s official sponsor register and
        re-check listings regularly. Sponsor registers and job openings can change at any time, so a check
        reflects what we found when we made it.
      </p>
    </ContentPage>
  );
}
