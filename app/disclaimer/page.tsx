import ContentPage from "@/components/ContentPage";

export const metadata = {
  title: "Disclaimer — VisaReady",
  description:
    "VisaReady is a job search and research platform. We are not a government body, law firm, licensed immigration adviser or recruitment agency, and we don't guarantee a job or a visa.",
};

// Text from the "VisaReady Disclaimer" doc (full disclaimer page section).
// TODO: once the company is registered, add its legal name and registered
// details here as the doc says.

const ADVISERS: [string, string][] = [
  ["United Kingdom", "An adviser registered with the Immigration Advice Authority, or a solicitor or barrister"],
  [
    "Canada",
    "A Regulated Canadian Immigration Consultant (licensed by the College of Immigration and Citizenship Consultants), a Canadian lawyer, or a Québec notary",
  ],
  ["Australia", "A registered migration agent or an Australian legal practitioner"],
  ["New Zealand", "A licensed immigration adviser (Immigration Advisers Authority) or a New Zealand lawyer"],
  ["United States", "An immigration attorney or a representative accredited by the US Department of Justice"],
  ["Other countries", "A qualified lawyer in that country, and the official government immigration website"],
];

export default function DisclaimerPage() {
  return (
    <ContentPage eyebrow="Disclaimer" title={<>What VisaReady <em>is and isn&apos;t.</em></>} updated="9 November 2026">
      <h2>1. Who we are</h2>
      <p>
        VisaReady is a job search and research platform built for professionals from Africa who want to work
        abroad. We gather jobs from employers that sponsor work visas in countries such as Canada, the United
        Kingdom, Australia, New Zealand and the United States, and explain official visa route requirements in
        plain language. VisaReady is a technology platform that provides general immigration information and
        tools. It is not a law firm, a recruitment or staffing agency, or a licensed immigration adviser.
      </p>
      <p>
        Applying from Africa often means extra steps: long waits for visa appointments, document legalisation,
        proof of funds and English test requirements. VisaReady is designed around these realities, with prices in
        local currencies, mobile money payments and information on the routes open to African passport holders.
        Requirements differ by passport and destination, so always confirm what applies to you on the official
        government website.
      </p>

      <h2>2. We are not a government body</h2>
      <p>
        VisaReady is independent. We are not part of, endorsed by or affiliated with any government, embassy,
        consulate or immigration authority. We cannot issue, approve, speed up or influence any visa, work permit,
        residence permit or citizenship decision. Only the relevant government can make those decisions.
      </p>

      <h2>3. We do not give immigration advice</h2>
      <p>
        Nothing on this website, including job listings, visa route summaries, eligibility tools, Route Maps,
        articles, newsletters, emails or messages from our team, constitutes legal or immigration advice or creates
        a lawyer–client or adviser–client relationship. In many countries, giving immigration advice is regulated
        and may only be done by licensed advisers or lawyers. Any legal or immigration services are provided
        independently by licensed advisers or lawyers, and are between you and them. For advice on your own
        situation, speak to a qualified adviser in the country you plan to move to.
      </p>

      <h2>4. We don&apos;t place candidates or guarantee results</h2>
      <p>
        VisaReady is a search and research tool, not a staffing agency. We don&apos;t place candidates in jobs, and
        we don&apos;t guarantee employment, sponsorship for a particular role, or a visa. We provide the tools and
        information to help you find employers that sponsor visas; outcomes depend on your qualifications,
        experience, documents and interview performance, and on each employer&apos;s decisions. Immigration outcomes
        depend on individual circumstances and government decisions and are not guaranteed.
      </p>

      <h2>5. We are not a recruitment agency or employer</h2>
      <p>
        VisaReady does not employ you, recruit for employers or act for you in any application. Jobs come from
        employers and publicly available sources, and you apply directly to the employer. Any job offer, contract,
        pay or working conditions are agreed between you and the employer alone. We are not responsible for an
        employer&apos;s decisions, conduct or recruitment process.
      </p>

      <h2>6. How we check employers, and the limits</h2>
      <p>
        Where official registers exist, such as the UK register of licensed sponsors, we check employers against
        them when a job is added. A licence or past sponsorship record does not mean that a particular role will be
        sponsored or that you are eligible for it. Licences can be suspended or withdrawn at any time. Always
        confirm sponsorship directly with the employer before you rely on it.
      </p>

      <h2>7. Information may change</h2>
      <p>
        Immigration rules, salary thresholds, fees, occupation lists and processing times change often, sometimes
        without notice. We base our information on official public sources and try to keep it current, but we
        cannot promise it is complete, accurate or up to date at the moment you read it. Eligibility results and
        Route Maps are general indications based on the information you give us, not decisions. Always check the
        official government website before you act.
      </p>

      <h2>8. Links, partners and commissions</h2>
      <p>
        VisaReady links to websites and services we do not control, including employers, government sites,
        language test providers, money transfer services and licensed advisers. We are not responsible for their
        content, services or fees. Some partners may pay VisaReady a fee or commission when you use them. This never
        changes which jobs we show you, and we will always say when a link is a paid partnership.
      </p>

      <h2>9. Fees and scams</h2>
      <p>
        VisaReady only charges for its own subscription, shown clearly before you pay. We never charge for a job, a
        job offer, a visa, a work permit or &ldquo;processing&rdquo;, and we never ask for payment through WhatsApp,
        personal bank accounts or mobile money numbers belonging to individuals. Be very careful with anyone who
        asks for money in return for a guaranteed job or visa.
      </p>

      <h2>10. Your responsibility</h2>
      <p>
        You are responsible for your own decisions, for the accuracy of the information and documents you submit to
        employers and governments, and for checking that any job offer, employer and visa route is genuine and
        right for you. Any visa application is between you and the government concerned.
      </p>

      <h2>11. Limits on our liability</h2>
      <p>
        To the fullest extent permitted by the law that applies to you, VisaReady is not liable for any loss or
        damage arising from your use of, or reliance on, the platform or its information, including refused or
        delayed visa applications, employer decisions or conduct, or money paid to third parties. Nothing in this
        disclaimer excludes or limits any liability that cannot be excluded or limited by law, including liability
        for death or personal injury caused by negligence, for fraud, or your statutory rights as a consumer in
        your country.
      </p>

      <h2>Finding a licensed adviser</h2>
      <div className="prose-table">
        <table>
          <thead>
            <tr>
              <th>Destination</th>
              <th>Who can give immigration advice</th>
            </tr>
          </thead>
          <tbody>
            {ADVISERS.map(([where, who]) => (
              <tr key={where}>
                <td>{where}</td>
                <td>{who}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 28 }}>
        Questions? Read our <a href="/faq">FAQ</a> or email{" "}
        <a href="mailto:support@visaready.co">support@visaready.co</a>.
      </p>
    </ContentPage>
  );
}
