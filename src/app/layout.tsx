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
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: SITE.name,
  authors: [{ name: SITE.personName, url: SITE.url }],
  creator: SITE.personName,
  publisher: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    locale: SITE.locale,
    // Static share/search thumbnail (public/opengraph-thumbnail.jpg). Resolved
    // to an absolute URL via metadataBase. Changing the URL away from the old
    // /opengraph-image route also forces crawlers to refetch (cache bust).
    images: [
      {
        url: "/opengraph-thumbnail.jpg",
        width: 2048,
        height: 2048,
        alt: SITE.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/opengraph-thumbnail.jpg"],
    ...(SITE.twitterHandle ? { creator: `@${SITE.twitterHandle}` } : {}),
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
  // Classic geo meta tags — a local-SEO signal pinning the entity to Muar,
  // Johor, Malaysia (complements the LocalBusiness JSON-LD).
  other: {
    "geo.region": SITE.geo.regionCode,
    "geo.placename": `${SITE.geo.city}, ${SITE.geo.region}`,
    "geo.position": `${SITE.geo.latitude};${SITE.geo.longitude}`,
    ICBM: `${SITE.geo.latitude}, ${SITE.geo.longitude}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        {/* Warm up the CloudFront connection (DNS + TLS) before the media
            requests fire. No crossOrigin — media is fetched non-CORS (see
            DEPLOYMENT.md). React hoists this <link> into <head>. */}
        {MEDIA_BASE ? <link rel="preconnect" href={MEDIA_BASE} /> : null}
        <JsonLd />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
