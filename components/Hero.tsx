import SignupForm from "./SignupForm";
import { DESTINATIONS_PHRASE } from "@/lib/destinations";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="stage">
            <div className="stage-content">
              <span className="hero-eyebrow">
                <span className="dot"></span>
                Your talent. Their visa. Your future.
              </span>

              <div>
                <h1 className="hero-title">
                  Stop wasting time on jobs that can&apos;t <em>sponsor your visa.</em>
                </h1>
                <p className="hero-lede">
                  VisaReady brings African professionals jobs in {DESTINATIONS_PHRASE} from employers that
                  sponsor visas. Join the waitlist free and get 50% off for life as a founding member.
                </p>
              </div>
            </div>
          </div>

          <SignupForm />
        </div>
      </div>
    </section>
  );
}
