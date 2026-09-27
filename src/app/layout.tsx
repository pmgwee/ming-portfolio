import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// CloudFront base for the heavy media (frames, tiles, clips). Inlined at build.
const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: `${SITE.name} · ${SITE.studioName}`,
  authors: [{ name: SITE.personName, url: SITE.url }],
  creator: SITE.personName,
  publisher: SITE.personName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: `${SITE.name} · ${SITE.studioName}`,
    title: SITE.title,
    description: SITE.description,
    locale: SITE.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(SITE.gscVerification
    ? { verification: { google: SITE.gscVerification } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body id="top">
        {/* Warm up the CloudFront connection (DNS + TLS) before the media
            requests fire. No crossOrigin — media is fetched non-CORS (see
            DEPLOYMENT.md). React hoists this <link> into <head>. */}
        {MEDIA_BASE ? <link rel="preconnect" href={MEDIA_BASE} /> : null}
        <JsonLd />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
