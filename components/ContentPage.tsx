import Nav from "./Nav";
import Footer from "./Footer";

interface Props {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  updated?: string;
  children: React.ReactNode;
}

/** Shared layout for the text pages (FAQ, Blog, Disclaimer, Privacy, Terms). */
export default function ContentPage({ eyebrow, title, lede, updated, children }: Props) {
  return (
    <>
      <Nav />
      <section className="hero page-hero">
        <div className="container page-narrow">
          <span className="hero-eyebrow">
            <span className="dot"></span>
            {eyebrow}
          </span>
          <h1 className="hero-title page-title">{title}</h1>
          {lede && <p className="hero-lede page-lede">{lede}</p>}
        </div>
      </section>
      <section className="page-body">
        <div className="container page-narrow prose">
          {children}
          {updated && <p className="prose-updated">Last updated {updated}</p>}
        </div>
      </section>
      <Footer />
    </>
  );
}
