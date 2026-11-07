import Logo from "./Logo";

/** Centred card on the hero background — the "You're in!", member and unsubscribe pages. */
export default function CardPage({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <main className="card-page">
      <div className="card-page-inner" style={{ maxWidth: wide ? 520 : 440 }}>
        <div className="card-page-logo">
          <Logo />
        </div>
        {children}
      </div>
    </main>
  );
}
