interface Industry {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const INDUSTRIES: Industry[] = [
  {
    title: "Tech & Innovation",
    description: "Software, data, cloud, cybersecurity",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M8 4h8a3 3 0 013 3v10a3 3 0 01-3 3H8a3 3 0 01-3-3V7a3 3 0 013-3z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 9h6M9 12h6M9 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Finance",
    description: "Banking, accounting, fintech",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 21h18M5 21V10m4 11V10m6 11V10m4 11V10M2 9l10-6 10 6H2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Consulting",
    description: "Strategy, advisory, transformation",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 7a3 3 0 116 0 3 3 0 01-6 0zM4 21v-1a6 6 0 0112 0v1M15 11a3 3 0 116 0 3 3 0 01-6 0z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    title: "Creative & Media",
    description: "Design, content, marketing",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function IndustryTiles() {
  return (
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
      {INDUSTRIES.map((industry) => (
        <div
          key={industry.title}
          className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 p-3 text-white transition hover:bg-white/15"
        >
          <div className="text-gold-400 mb-1.5">{industry.icon}</div>
          <h3 className="text-sm font-semibold leading-tight">{industry.title}</h3>
          <p className="mt-0.5 text-[11px] text-white/70 leading-tight">{industry.description}</p>
        </div>
      ))}
    </div>
  );
}
