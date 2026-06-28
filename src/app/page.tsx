import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Showcase } from "@/components/sections/Showcase/Showcase";
import { WorksMorph } from "@/components/sections/works/WorksMorph";
import { NextSection } from "@/components/sections/NextSection";
import { Footer } from "@/components/sections/Footer";
import { getShowcaseMedia } from "@/lib/showcase-media";

// Statically prerendered, regenerated hourly (ISR). Resolving the S3 media list
// here (instead of a client fetch) bakes the URLs into the HTML, so the field's
// images/clips start downloading on first paint — no fetch waterfall.
export const revalidate = 3600;

export default async function Home() {
  const media = await getShowcaseMedia();

  return (
    <main>
      <Navbar />
      <Hero />
      <Showcase media={media} />
      <WorksMorph />
      <NextSection />
      <Footer />
    </main>
  );
}
