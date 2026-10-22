import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Showcase } from "@/components/sections/Showcase/Showcase";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CareerSection } from "@/components/sections/CareerSection";
import { CareerPlanDemo } from "@/components/sections/CareerPlanDemo";
import { FaqSection } from "@/components/sections/FaqSection";
import { ContactSection } from "@/components/sections/ContactSection";
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
      <Showcase media={media} />
      <CareerPlanDemo />
      <ServicesSection />
      <CareerSection />
      <ContactSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
