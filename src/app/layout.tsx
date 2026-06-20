import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Analytics } from "@vercel/analytics/next";

// CloudFront base for the heavy media (frames, tiles, clips). Inlined at build.
const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE;

export const metadata: Metadata = {
  title: "Ming — Creative Developer & Portfolio",
  description:
    "Creative developer building cinematic, performant web experiences. Selected work, skills, and a way to get in touch.",
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
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <Analytics />
      </body>
    </html>
  );
}
