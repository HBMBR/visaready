interface IndustryCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const INDUSTRIES: IndustryCard[] = [
  {
    title: "Tech & Innovation",
    description: "Software engineering, data science, cloud, cybersecurity and AI roles across Europe, Canada and ANZ.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    title: "Finance & Consulting",
    description: "Banking, advisory, accounting and strategy roles at sponsor-licensed firms hiring international talent.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V10m4 11V10m6 11V10m4 11V10M2 9l10-6 10 6H2z" />
      </svg>
    ),
  },
  {
    title: "Creative & Media",
    description: "Design, content, brand and marketing roles at studios and global agencies sponsoring talent visas.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5L12 3z" />
      </svg>
    ),
  },
  {
    title: "Engineering",
    description: "Mechanical, electrical, civil and process engineering roles at firms with current sponsor licences.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18M3 12h18M5.5 5.5l13 13M5.5 18.5l13-13" />
      </svg>
    ),
  },
  {
    title: "Sales",
    description: "Account executives, business development and revenue roles at international firms hiring overseas talent.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l6-6 4 4 8-8M14 7h7v7" />
      </svg>
    ),
  },
  {
    title: "Marketing",
    description: "Brand, growth, digital and product marketing roles at sponsor-licensed companies worldwide.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l18-8v18l-18-8v-2zM7 13v6" />
      </svg>
    ),
  },
  {
    title: "Healthcare",
    description: "Nurses, doctors, allied health and care roles at hospitals and clinics on national shortage lists.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18M3 12h18" />
        <rect x="3" y="3" width="18" height="18" rx="3" />
      </svg>
    ),
  },
  {
    title: "Administrative",
    description: "Office management, executive assistants, operations and admin roles at firms recruiting globally.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h8M8 11h8M8 15h5" />
      </svg>
    ),
  },
];

export default function IndustryCards() {
  return (
    <section className="section" id="opportunities">
      <div className="container">
        <div className="section-head">
          <div className="section-eyebrow">Opportunities</div>
          <h2 className="section-title">
            Industries we <em>cover</em>.
          </h2>
          <p className="section-sub">
            Visa-sponsored roles across the disciplines most in demand globally — software, finance,
            consulting, design, healthcare and skilled engineering.
          </p>
        </div>

        <div className="cards">
          {INDUSTRIES.map((industry) => (
            <a key={industry.title} href="#" className="card">
              <span className="ic">{industry.icon}</span>
              <h3>{industry.title}</h3>
              <p>{industry.description}</p>
              <span className="link">
                Discover Roles
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M1.5 5.5h8M6 1.5l3.5 4-3.5 4" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
