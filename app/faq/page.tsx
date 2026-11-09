import ContentPage from "@/components/ContentPage";

export const metadata = {
  title: "FAQ — VisaReady",
  description: "What VisaReady is and isn't, how visa sponsorship works, the waitlist, prices, sharing, and staying safe from job scams.",
};

// Wording is from Darian's "FAQ - Visa Ready" doc. Keep it exactly as written:
// it has been simplified for readers whose first language isn't English.

const IS = [
  "A website that helps you find jobs abroad where the employer can sponsor your work visa",
  "Built for African professionals, in Africa or abroad, and open to anyone who needs a visa-sponsored job in the UK, Canada, Australia, New Zealand or the USA",
  "A place to learn what each work visa needs, with links to the official rules",
  "A monthly membership, with a 30-day free trial",
];

const IS_NOT = [
  "A recruitment agency. We don't hire you or place you in a job",
  "A government website or an embassy",
  "A law firm or immigration adviser. We don't give legal or visa advice",
  "A promise of a job or a visa. Only employers give jobs, and only governments give visas",
];

type Faq = { q: string; a: React.ReactNode };

const SECTIONS: { title: string; items: Faq[] }[] = [
  {
    title: "1. About VisaReady",
    items: [
      {
        q: "What is VisaReady?",
        a: "VisaReady is a website that helps African professionals find jobs abroad. We only show jobs where the employer can sponsor a work visa. This saves you time. You stop applying for jobs that can never accept you.",
      },
      {
        q: "Who is VisaReady for?",
        a: "VisaReady is for anyone who needs a visa-sponsored job to work abroad. We built it with Africans in mind, wherever you live: in Africa, or already in the UK, Canada, Australia, New Zealand, the USA or anywhere else. Many people already living abroad need a new sponsor to stay, for example when a study visa or work visa is ending. You do not need to be African to join. It is for skilled workers, for example nurses, engineers, IT workers, accountants and teachers. You can be early in your career or very experienced.",
      },
      {
        q: "Which countries are the jobs in?",
        a: "The United Kingdom (UK), Canada, Australia, New Zealand and the United States (USA). We may add more countries later.",
      },
      {
        q: "Can I use VisaReady from any country?",
        a: "Yes. You can join from any country in Africa, and from any country outside Africa too.",
      },
      {
        q: "Why did you build VisaReady?",
        a: "Our founder is African. He lost his UK work visa because he could not find a job that would sponsor him in time. He applied for many jobs. Only late in the process did he learn that most of them did not sponsor visas. Hours, days and interviews were wasted. We built VisaReady so this does not happen to you.",
      },
      {
        q: "Is VisaReady open now?",
        a: (
          <>
            Not yet. We are building it now. <a href="/#signup">Join the free waitlist</a> and we will email you
            before we open.
          </>
        ),
      },
      {
        q: "Does VisaReady apply for jobs for me?",
        a: "No. You apply for each job yourself, on the employer's own website or by their instructions. VisaReady helps you find the right jobs and understand the visa.",
      },
    ],
  },
  {
    title: "2. Jobs and visas",
    items: [
      {
        q: "What does “visa sponsorship” mean?",
        a: "In most countries you need a work visa to work there. For many work visas, an employer must “sponsor” you. This means the employer gives the government official papers saying they want to hire you. Without a sponsor, you usually cannot get this kind of work visa.",
      },
      {
        q: "Will every job on VisaReady sponsor my visa?",
        a: "We only list jobs from employers that can sponsor visas. But each job and each visa has its own rules. Before you apply, always read the job advert. If you are not sure, ask the employer: “Will you sponsor a work visa for this role?”",
      },
      {
        q: "How do you check the employers?",
        a: "We check each employer against the official list of approved sponsors, where the country has one. We check that the job is still open and accepts people from overseas. We remove jobs that close. Each job shows which checks we have done.",
      },
      {
        q: "If an employer can sponsor, will I get a visa?",
        a: "Not always. The government decides who gets a visa. The job, the salary and you must all meet the visa rules. For example, in the UK the job must be at the right skill level and pay enough. VisaReady shows you these rules, with a link to the official government page.",
      },
      {
        q: "Do you guarantee I will get a job or a visa?",
        a: "No. Nobody honest can promise this. Employers decide who they hire. Governments decide who gets a visa. VisaReady helps you find the right jobs and prepare, so you have a better chance.",
      },
      {
        q: "Can VisaReady tell me if I qualify for a visa?",
        a: "No. We are not immigration advisers. We show you the rules so you can check them yourself. If you need advice about your own case, speak to a licensed immigration adviser or lawyer in the country you want to move to.",
      },
      {
        q: "What kinds of jobs are on VisaReady?",
        a: "Skilled jobs in areas such as healthcare, IT and tech, engineering, finance and accounting, sales, marketing, teaching and skilled trades.",
      },
      {
        q: "Do I need a degree?",
        a: "Not always. Some visas need a degree. Others need a skill, a trade or work experience. Each job shows what the employer asks for.",
      },
      {
        q: "Do I need an English test?",
        a: "Many work visas need proof of English, for example an IELTS or PTE test. Some jobs in Canada need French. Each visa has its own rules. We show you which test you may need.",
      },
      {
        q: "Can I bring my family?",
        a: "Many work visas let you bring your husband, wife or partner and your children. The rules and costs are different for each visa. Check the official page for the visa you want.",
      },
    ],
  },
  {
    title: "3. The waitlist and founding members",
    items: [
      {
        q: "What is the waitlist?",
        a: "The waitlist is a list of people who want to use VisaReady when it opens. It is free to join. We will email you when VisaReady is ready.",
      },
      {
        q: "How much does it cost to join the waitlist?",
        a: "Nothing. Joining the waitlist is free. You do not need a bank card.",
      },
      {
        q: "What is a founding member?",
        a: "A founding member is someone who joins the waitlist before VisaReady opens. Founding members get 50% off the monthly price for life. This is our thank you for joining early.",
      },
      {
        q: "What does “50% off for life” mean?",
        a: "You pay half the normal monthly price. You keep this lower price for as long as you stay a member.",
      },
      {
        q: "Do I need to do anything to keep my founding member price?",
        a: "Yes, two small things. First, confirm your email address using the link we send you. Second, start your membership when VisaReady opens. We will email you when that happens.",
      },
      {
        q: "I didn't get the confirmation email. What do I do?",
        a: "Check your spam or promotions folder. The email comes from VisaReady. If it is not there, try signing up again with the same email and we will send it again.",
      },
      {
        q: "I signed up twice. Is that a problem?",
        a: "No. You only have one place on the list. Use the same email each time.",
      },
      {
        q: "What information do you ask for?",
        a: "When you join, we only ask for your name, email, country, the job you want and where you want to work. Later, when VisaReady opens, we may ask more questions so we can show you the best jobs for you. You choose what to share.",
      },
    ],
  },
  {
    title: "4. Prices, free trial and payment",
    items: [
      {
        q: "How much will VisaReady cost?",
        a: "VisaReady will be a low monthly membership, priced for African professionals and shown in your local money. It will cost far less than other visa job websites, and a tiny part of what many agents charge. We will share the price before launch.",
      },
      {
        q: "How much do founding members pay?",
        a: "Founding members pay half the normal price, for life. You will always see the exact price in your local money before you pay anything.",
      },
      {
        q: "Will I have to pay before I know the price?",
        a: "No, never. You will see the price, then get 30 days free. You only pay if you decide to stay.",
      },
      {
        q: "Is there a free trial?",
        a: "Yes. When VisaReady opens, you get 30 days free. You can use everything during the trial.",
      },
      {
        q: "Why do you ask for my payment details for the free trial?",
        a: "So your membership carries on without a break when the trial ends. We do not take any money during the 30 free days. We email you 3 days before the trial ends, so there are no surprises.",
      },
      {
        q: "How can I pay?",
        a: "With a bank card, and with mobile money in countries where we can offer it. We will show you the options for your country when VisaReady opens.",
      },
      {
        q: "Can I cancel?",
        a: "Yes, at any time, in your account. There is no contract. If you cancel during the free trial, you pay nothing.",
      },
      {
        q: "What happens to my founding member price if I cancel?",
        a: "You keep your founding member price for as long as you stay a member. If you cancel, you lose it. We will always tell you before this happens.",
      },
      {
        q: "Can I get a refund?",
        a: "No. VisaReady is a monthly membership, so we do not give refunds for a month you have already started. You can cancel at any time and keep using VisaReady until the end of the month you paid for. We email you 3 days before your free trial ends, so you can cancel before you pay. If we charge you by mistake, for example twice in one month, we will refund the extra payment. This does not affect any rights you have under the law in your country.",
      },
    ],
  },
  {
    title: "5. Sharing with friends",
    items: [
      {
        q: "How do I share VisaReady with friends?",
        a: "After you confirm your email, you get your own link. Send it to friends on WhatsApp, Facebook, X or by email. When a friend joins using your link and confirms their email, it counts for you.",
      },
      {
        q: "Do I get anything for sharing?",
        a: "Yes. We will reward members who bring friends, for example free months of VisaReady. We will share the full rewards soon.",
      },
    ],
  },
  {
    title: "6. Safety, scams and your data",
    items: [
      {
        q: "Is VisaReady a scam?",
        a: "No. We understand why you ask. Many people have lost money to fake agents and fake jobs. VisaReady is different: joining is free, we never charge for a job, an interview or a visa, and we never ask you to pay an employer or an agent.",
      },
      {
        q: "How can I spot a job scam?",
        a: (
          <>
            Be careful if someone:
            <ul>
              <li>asks you to pay for a job, an interview, a job offer or a visa</li>
              <li>promises you a visa or a job &ldquo;100%&rdquo;</li>
              <li>asks you to send money by mobile money or to a personal bank account</li>
              <li>
                contacts you on WhatsApp or Telegram and says they are from a big company, but uses a free email
                like Gmail
              </li>
              <li>asks for your passport before you have even had an interview</li>
            </ul>
            Real employers do not ask you to pay to get a job. Visa fees are paid to the government, on the
            government&apos;s own website.
          </>
        ),
      },
      {
        q: "Someone says they are from VisaReady and wants money. What do I do?",
        a: "Do not pay. Our emails only come from @visaready.co addresses.",
      },
      {
        q: "I saw a job on VisaReady that looks wrong. What do I do?",
        a: (
          <>
            Click &ldquo;Report this job&rdquo; on the job, or email{" "}
            <a href="mailto:support@visaready.co">support@visaready.co</a>. We will check it and remove it if needed.
          </>
        ),
      },
      {
        q: "Is my information safe?",
        a: (
          <>
            Yes. We keep your information private and secure. We do not sell your information. We never share your
            profile with an employer unless you say yes first. You can ask us to delete your information at any
            time. Read our <a href="/privacy">Privacy Policy</a> for the full details.
          </>
        ),
      },
      {
        q: "Do you need my passport?",
        a: "No. We only ask which country your passport is from, so we can show you the right jobs and visas. Never send us a copy of your passport.",
      },
    ],
  },
  {
    title: "7. Contact us",
    items: [
      {
        q: "How do I contact VisaReady?",
        a: (
          <>
            Email <a href="mailto:support@visaready.co">support@visaready.co</a>. We aim to reply within 2 working
            days.
          </>
        ),
      },
      {
        q: "Can I call you or visit an office?",
        a: "Not yet. Email is the best way to reach us.",
      },
      {
        q: "Can you help with my visa application?",
        a: "No. We can't advise you on your own visa case. For that, speak to a licensed immigration adviser or lawyer in the country you want to move to. We can only help with questions about using VisaReady.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <ContentPage eyebrow="FAQ" title={<>Frequently asked <em>questions.</em></>}>
      <div className="faq-isnot">
        <div className="faq-is">
          <h3>VisaReady IS</h3>
          <ul>{IS.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        <div className="faq-not">
          <h3>VisaReady is NOT</h3>
          <ul>{IS_NOT.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        <p className="faq-promise">
          <strong>Our promise:</strong> we never charge you for a job, a job interview or a visa. If someone says
          they are from VisaReady and asks you for money for a job or a visa, it is a scam.
        </p>
      </div>

      {SECTIONS.map((s) => (
        <section key={s.title} className="faq-section">
          <h2>{s.title}</h2>
          <div className="faq">
            {s.items.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <div className="faq-a">{typeof f.a === "string" ? <p>{f.a}</p> : <div>{f.a}</div>}</div>
              </details>
            ))}
          </div>
        </section>
      ))}
    </ContentPage>
  );
}
