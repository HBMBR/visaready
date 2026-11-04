import SignupForm from "./SignupForm";

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
                  Empowering African Talent <em>Globally.</em>
                </h1>
                <p className="hero-lede">
                  Connect with top global opportunities, accelerate your career, and build your future.
                  The premium platform for Africa&apos;s next generation of leaders.
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
