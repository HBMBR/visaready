import type { Metadata } from "next";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";
import Tracking from "@/components/Tracking";
import { DESTINATIONS_PHRASE } from "@/lib/destinations";

const DESCRIPTION = `Jobs in ${DESTINATIONS_PHRASE} from employers that sponsor visas, for African professionals. Join the waitlist free and get 50% off for life as a founding member.`;

export const metadata: Metadata = {
  metadataBase: new URL("https://visaready.co"),
  title: "VisaReady — Visa-sponsored jobs for African professionals",
  description: DESCRIPTION,
  openGraph: {
    title: "VisaReady — Stop wasting time on jobs that can't sponsor your visa",
    description: DESCRIPTION,
    url: "https://visaready.co",
    siteName: "VisaReady",
    type: "website",
  },
  // Meta domain verification. The same value is also a DNS TXT record on visaready.co.
  other: { "facebook-domain-verification": "91pcozq0nyektgul6bmcix93fysk6o" },
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
      <body>
        {children}
        <CookieConsent />
        <Tracking />
      </body>
    </html>
  );
}
