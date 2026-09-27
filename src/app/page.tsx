import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { EngineeringSection } from "@/components/sections/EngineeringSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { Showcase } from "@/components/sections/Showcase/Showcase";
import { WorksMorph } from "@/components/sections/works/WorksMorph";
import { WorksShowcase } from "@/components/sections/works/WorksShowcase";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { AudiencePaths } from "@/components/sections/AudiencePaths";
import { Footer } from "@/components/sections/Footer";
import { getShowcaseMedia } from "@/lib/showcase-media";

// Statically prerendered, regenerated hourly (ISR). Resolving the S3 media list
// here (instead of a client fetch) bakes the URLs into the HTML, so the field's
// images/clips start downloading on first paint — no fetch waterfall.
export const revalidate = 3600;

export default async function Home() {
  const media = await getShowcaseMedia();

  return (
    <main id="main-content" tabIndex={-1}>
      <Navbar />
      <Hero />
      <EngineeringSection />
      <ExperienceSection />
      <WorksMorph />
      <WorksShowcase />
      <Showcase media={media} />
      <ServicesSection />
      <FaqSection />
      <AudiencePaths />
      <Footer />
    </main>
  );
}
