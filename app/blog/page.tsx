import ContentPage from "@/components/ContentPage";

export const metadata = {
  title: "Blog — VisaReady",
  description: "News and guides from VisaReady on finding visa-sponsored work abroad.",
};

// First post (from Munya) is on its way. Posts can live under app/blog/<slug>/page.tsx.
export default function BlogPage() {
  return (
    <ContentPage
      eyebrow="Blog"
      title={<>Guides for working <em>abroad.</em></>}
      lede="Practical guides on visa-sponsored jobs, sponsor registers and moving abroad for work."
    >
      <div className="empty-note">
        <h2>Our first post is coming soon.</h2>
        <p>
          Join the waitlist and we&apos;ll email you when it&apos;s published.
        </p>
        <p>
          <a href="/#signup" className="btn btn-fill" style={{ padding: "12px 26px", marginTop: 8 }}>
            Join the waitlist free
          </a>
        </p>
      </div>
    </ContentPage>
  );
}
