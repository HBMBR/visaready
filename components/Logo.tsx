interface LogoProps {
  className?: string;
  /** When true, uses dark ink color for wordmark (for footer with light background in dark mode) */
  inkOnLight?: boolean;
}

export default function Logo({ className = "", inkOnLight = false }: LogoProps) {
  return (
    <a href="#" className={`brand ${className}`}>
      <span className="brand-mark">V</span>
      <span className="brand-name" style={inkOnLight ? { color: "var(--ink)" } : undefined}>
        Visa<em>Ready</em>
      </span>
    </a>
  );
}
