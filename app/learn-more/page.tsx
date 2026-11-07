import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import { DESTINATIONS_PHRASE } from "@/lib/destinations";

export const metadata = {
  title: "Learn More — VisaReady",
  description: "What VisaReady is, why we're building it, and how it will help African professionals find jobs abroad with employers that sponsor visas.",
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
              VisaReady is a job search platform for African professionals who want to work abroad. We bring
              together jobs in {DESTINATIONS_PHRASE} from employers that sponsor visas, check employers
              against official sponsor registers, and show you the visa requirements so you know what to
              expect before you apply. We&apos;re launching soon. Join the waitlist for early access.
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
              VisaReady cuts the noise: no jobs that turn out to be closed to overseas applicants, no endless
              scrolling, and no paying agents for jobs or visas.
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
              <li><strong style={{ color: "var(--ink)" }}>Join the waitlist</strong> — tell us your nationality, the role you want and where you&apos;d like to work.</li>
              <li><strong style={{ color: "var(--ink)" }}>Browse jobs from sponsoring employers</strong> — at launch, each listing shows the checks we&apos;ve done and the visa route it relates to.</li>
              <li><strong style={{ color: "var(--ink)" }}>Apply with your eyes open</strong> — you still need to meet the visa requirements; we show you what they are and link to the official rules.</li>
              <li><strong style={{ color: "var(--ink)" }}>Locked-in pricing</strong> — founding members get 50% off for life.</li>
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
            <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--ink-mute)", maxWidth: "60ch", margin: "0 auto 28px" }}>
              VisaReady is not a recruitment agency, law firm or government body. We don&apos;t give immigration
              advice and can&apos;t guarantee a job or a visa.
            </p>
            <Link href="/#signup" className="btn btn-fill" style={{ padding: "14px 30px", fontSize: 15 }}>
              Join the waitlist free
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}
