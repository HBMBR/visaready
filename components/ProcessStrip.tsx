// The checks we will run on every employer once listings go live.
// Worded as what we will do at launch, not what we have already done.
export default function ProcessStrip() {
  return (
    <section className="strip">
      <div className="container strip-inner">
        <div className="strip-h">
          How we&apos;ll <em>check</em> every job.
        </div>
        <div className="strip-steps">
          <div className="strip-step">
            <span className="n">1</span>
            <div className="b">
              <h4>Sponsor licence checked</h4>
              <p>Against each country&apos;s official sponsor register.</p>
            </div>
          </div>
          <div className="strip-step">
            <span className="n">2</span>
            <div className="b">
              <h4>Open to overseas applicants</h4>
              <p>Confirmed before a job goes live.</p>
            </div>
          </div>
          <div className="strip-step">
            <span className="n">3</span>
            <div className="b">
              <h4>Re-checked regularly</h4>
              <p>Closed and stale jobs removed.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
