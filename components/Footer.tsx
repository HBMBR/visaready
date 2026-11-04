export default function Footer() {
  return (
    <footer className="foot">
      <div className="container">
        <div className="foot-grid">
          <div className="col foot-brand">
            <a className="brand" href="#" style={{ marginBottom: 8 }}>
              <span className="brand-mark">V</span>
              <span className="brand-name">VisaReady</span>
            </a>
            <p>
              The hand-vetted register of visa-sponsoring employers — built for African professionals seeking real work abroad.
            </p>
          </div>
          <div className="col">
          </div>
          <div className="col">
          </div>
          <div className="col">
          </div>
        </div>
        <div className="foot-bot">
          <span>© {new Date().getFullYear()} VisaReady · Empowering African talent globally.</span>
          <span>Set in Bitter &amp; Inter</span>
        </div>
      </div>
    </footer>
  );
}
