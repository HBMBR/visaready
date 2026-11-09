const STEPS = [
  {
    title: "Join the waitlist",
    body: "Tell us your nationality, the role you want and where you'd like to work.",
  },
  {
    title: "Browse jobs from sponsoring employers",
    body: "At launch, each listing shows the checks we've done and the visa route it relates to.",
  },
  {
    title: "Apply with your eyes open",
    body: "You still need to meet the visa requirements; we show you what they are and link to the official rules.",
  },
  {
    title: "Locked-in pricing",
    body: "Founding members get 50% off for life.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section how" id="how-it-works">
      <div className="container">
        <div className="section-head">
          <div className="section-eyebrow">How it works</div>
          <h2 className="section-title">
            From waitlist to <em>application</em>.
          </h2>
          <p className="section-sub">
            We&apos;re launching soon. Here&apos;s what VisaReady will do for you, and what it won&apos;t.
          </p>
        </div>

        <ol className="how-steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="how-step">
              <span className="how-n">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>

        <p className="how-note">
          VisaReady is not a recruitment agency, law firm or government body. We don&apos;t give immigration advice
          and can&apos;t guarantee a job or a visa. <a href="/learn-more">Read more about VisaReady →</a>
        </p>
      </div>
    </section>
  );
}
