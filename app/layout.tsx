import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://visaready.co"),
  title: "VisaReady — Empowering African Talent Globally",
  description:
    "The premium platform for Africa's next generation of leaders. Founding members lock in 50% off for life. Verified visa-sponsored jobs around the world.",
  openGraph: {
    title: "VisaReady — Empowering African Talent Globally",
    description:
      "The hand-vetted register of visa-sponsoring employers — built for African professionals seeking real work abroad.",
    url: "https://visaready.co",
    siteName: "VisaReady",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
