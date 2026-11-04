import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Learn More — VisaReady",
  description: "What VisaReady is, why we're building it, and how it helps African professionals access global visa-sponsored work.",
};

export default function LearnMore() {
  return (
    <>
      <Nav />

      <section className="hero" style={{ padding: "48px 0 56px", minHeight: "auto" }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <span className="hero-eyebrow">
            <span className="dot"></span>
            About VisaReady
          </span>
          <h1 className="hero-title" style={{ maxWidth: "100%", margin: "20px 0 12px" }}>
            What VisaReady is, and <em>why we're building it.</em>
          </h1>
          <p className="hero-lede" style={{ maxWidth: "60ch" }}>
            A short one-pager on what we&apos;re solving, who it&apos;s for, and how it works.
          </p>
        </div>
      </section>

      <section style={{ background: "var(--paper)", padding: "64px 0" }}>
        <div className="container" style={{ maxWidth: 780 }}>

          <div style={{ marginBottom: 44 }}>
            <h2 style={{ fontSize: 30, marginBottom: 14 }}>What is VisaReady?</h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ink-mute)" }}>
              VisaReady is a hand-vetted register of visa-sponsoring employers, built for African professionals
              looking for real work abroad. Every employer on the platform is confirmed to hold an active
              sponsor licence, has been spoken to by our team, and is re-checked monthly. No dead listings,
              no recruiters fishing, no applications into the void.
            </p>
          </div>

          <div style={{ marginBottom: 44 }}>
            <h2 style={{ fontSize: 30, marginBottom: 14 }}>The pressure point we solve</h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ink-mute)" }}>
              African talent is among the most skilled in the world, but the path to a visa-sponsored job abroad
              is broken. Job boards are flooded with roles that aren&apos;t actually open to international applicants.
              Recruiters disappear after the first email. Employers list sponsor licences they no longer hold.
              Candidates waste months chasing dead ends — and pay agents thousands of dollars for the privilege.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ink-mute)", marginTop: 14 }}>
              VisaReady cuts the noise. Every job on our platform is one you can actually apply for from where
              you are today — verified, current, and sponsoring.
            </p>
          </div>

          <div style={{ marginBottom: 44 }}>
            <h2 style={{ fontSize: 30, marginBottom: 14 }}>Why we&apos;re building it</h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ink-mute)" }}>
              The continent has 1.4 billion people and the youngest working-age population on earth. Healthcare,
              tech, engineering, finance — every shortage list in the developed world has African talent waiting
              to fill it. The infrastructure to connect them honestly doesn&apos;t yet exist. We&apos;re building it.
            </p>
          </div>

          <div style={{ marginBottom: 44 }}>
            <h2 style={{ fontSize: 30, marginBottom: 14 }}>How it works</h2>
            <ol style={{ fontSize: 17, lineHeight: 1.8, color: "var(--ink-mute)", paddingLeft: 22 }}>
              <li><strong style={{ color: "var(--ink)" }}>Sign up</strong> — tell us your nationality, desired role, and contact details.</li>
              <li><strong style={{ color: "var(--ink)" }}>Browse verified jobs</strong> — every listing comes with a confirmed sponsor licence, visa pathway, and recruiter contact.</li>
              <li><strong style={{ color: "var(--ink)" }}>Apply with confidence</strong> — you&apos;re applying to roles that are actually open to you.</li>
              <li><strong style={{ color: "var(--ink)" }}>Locked-in pricing</strong> — founding members lock in 50% off for life.</li>
            </ol>
          </div>

          <div style={{ marginBottom: 44 }}>
            <h2 style={{ fontSize: 30, marginBottom: 14 }}>Who it&apos;s for</h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ink-mute)" }}>
              Tech, finance, healthcare, engineering, sales, marketing, administrative, creative and skilled-trade
              professionals across Africa who are ready to move for the right opportunity — and want a clean
              shot at finding it.
            </p>
          </div>

          <div style={{ textAlign: "center", marginTop: 56, paddingTop: 40, borderTop: "1px solid var(--rule)" }}>
            <Link href="/" className="btn btn-fill" style={{ padding: "14px 30px", fontSize: 15 }}>
              Reserve My Spot
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}
