import type { Metadata, Viewport } from "next";
import {
  Newsreader,
  Hanken_Grotesk,
  Instrument_Serif,
  Instrument_Sans,
  Sora,
} from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/config";
import { SmoothScroll } from "@/components/smooth-scroll/SmoothScroll";
import { HomeAwareHeader } from "@/components/navigation/HomeAwareHeader";
import { Footer } from "@/components/navigation/Footer";
import { SkipLink } from "@/components/common/SkipLink";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";

/**
 * TYPE DUEL — Phase 2.2
 * Candidate A: Newsreader + Hanken Grotesk (editorial, calm, serious)
 * Candidate B: Instrument Serif + Instrument Sans (elegant, condensed, modern)
 *
 * Active: Candidate B. To switch to A, change ACTIVE_DISPLAY / ACTIVE_BODY.
 * Banned: Cormorant Garamond, Inter, Poppins, DM Sans, Space Grotesk,
 *         Playfair, Montserrat, Roboto, Plus Jakarta Sans.
 */

// ── Candidate A ─────────────────────────────────────────────────────────────
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// ── Candidate B ─────────────────────────────────────────────────────────────
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// ── Sora (from realfurniture reference) ─────────────────────────────────────
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// ── Active selection (swap here to change the whole site) ────────────────────
// "B" → Instrument Serif (display) + Instrument Sans (body)
// "A" → Newsreader (display) + Hanken Grotesk (body)
const ACTIVE: "A" | "B" = "B";

const fontVars =
  ACTIVE === "B"
    ? `${instrumentSerif.variable} ${instrumentSans.variable}`
    : `${newsreader.variable} ${hanken.variable}`;

// Also load both so /lab/type can render the full comparison
const allFontVars = `${newsreader.variable} ${hanken.variable} ${instrumentSerif.variable} ${instrumentSans.variable} ${sora.variable}`;

export const viewport: Viewport = {
  themeColor: "#0B7584",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: `IZEM MOTORS | Location de voitures Aéroport Alger`,
    template: `%s | IZEM MOTORS`,
  },
  description:
    "Véhicules récents livrés et repris gratuitement à l'Aéroport Houari Boumediene d'Alger. Assistance 24h/24, assurance tous risques. Demande en 3 minutes, sans paiement en ligne.",
  keywords: [
    "location voiture aeroport alger",
    "izem motors location voiture",
    "location voiture alger livraison aeroport",
    "location voiture automatique alger",
    "louer une voiture en algerie",
    "location voiture houari boumediene",
    "izem motors alger",
  ],
  authors: [{ name: "IZEM MOTORS" }],
  metadataBase: new URL("https://izem.autos"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "IZEM MOTORS",
  },
  openGraph: {
    title: `IZEM MOTORS | Location de voitures Aéroport Alger`,
    description:
      "Véhicules récents livrés et repris gratuitement à l'Aéroport d'Alger. Assistance 24h/24, assurance tous risques.",
    url: "https://izem.autos",
    siteName: "IZEM MOTORS",
    locale: "fr_DZ",
    type: "website",
    images: [
      {
        url: "/images/hero-fleet-poster.jpg",
        width: 1200,
        height: 630,
        alt: "Flotte IZEM MOTORS devant l'Aéroport Houari Boumediene d'Alger",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `IZEM MOTORS | Location de voitures Aéroport Alger`,
    description: "Livraison et retour gratuits à l'aéroport d'Alger. Réservez en 3 minutes.",
    images: ["/images/hero-fleet-poster.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${allFontVars}`}>
      <head>
        {/* Favicon & Touch Icons for all platforms */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="apple-mobile-web-app-title" content="IZEM MOTORS" />
        <meta name="application-name" content="IZEM MOTORS" />
        <meta name="msapplication-TileColor" content="#0B7584" />
        <meta name="theme-color" content="#0B7584" />

        {/*
          Use Instrument Sans for both display and body for the clean,
          modern, bold Rentgo aesthetic.
        */}
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--font-display:var(--font-instrument-sans);--font-body:var(--font-instrument-sans);}`,
          }}
        />

        {/* Prevent accidental pinch-zoom and gesture wobbles on mobile */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                document.addEventListener('gesturestart', function(e) { e.preventDefault(); }, { passive: false });
                document.addEventListener('gesturechange', function(e) { e.preventDefault(); }, { passive: false });
                document.addEventListener('gestureend', function(e) { e.preventDefault(); }, { passive: false });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <SkipLink />
        <SmoothScroll>
          <HomeAwareHeader />
          {/* div wrapper — pages each declare their own <main id="main"> */}
          <div className="flex-1 w-full">{children}</div>
          <Footer />
          <WhatsAppButton />
        </SmoothScroll>
      </body>
    </html>
  );
}
