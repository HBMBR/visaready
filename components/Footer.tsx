import { CookieSettingsLink } from "./CookieConsent";
import { DESTINATIONS_PHRASE } from "@/lib/destinations";

export const SITE_DISCLAIMER =
  "VisaReady is a job search and research tool for African professionals seeking visa-sponsored work abroad. We are not a law firm, recruitment agency or government body, nothing here is legal or immigration advice, and we don't guarantee a job or a visa.";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="container">
        <div className="foot-grid">
          <div className="col foot-brand">
            <a className="brand" href="/" style={{ marginBottom: 8 }}>
              <span className="brand-mark">V</span>
              <span className="brand-name">VisaReady</span>
            </a>
            <p>Jobs from employers that sponsor visas, for African professionals heading to {DESTINATIONS_PHRASE}.</p>
          </div>
          <div className="col foot-disclaimer">
            <h5>Disclaimer</h5>
            <p>{SITE_DISCLAIMER}</p>
            <a href="/disclaimer" className="foot-more">Read the full disclaimer →</a>
          </div>
          <div className="col">
            <h5>VisaReady</h5>
            <a href="/#how-it-works">How it works</a>
            <a href="/#industries">Industries</a>
            <a href="/learn-more">About</a>
            <a href="/blog">Blog</a>
            <a href="/member">Sign In</a>
          </div>
          <div className="col">
            <h5>Help &amp; legal</h5>
            <a href="/faq">FAQ</a>
            <a href="/disclaimer">Disclaimer</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms</a>
            <a href="mailto:support@visaready.co">Contact: support@visaready.co</a>
          </div>
        </div>
        <div className="foot-bot">
          <span>© {new Date().getFullYear()} VisaReady</span>
          <CookieSettingsLink />
        </div>
      </div>
    </footer>
  );
}
