import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Showcase } from "@/components/sections/Showcase/Showcase";
import { NextSection } from "@/components/sections/NextSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Showcase />
      <NextSection />
    </main>
  );
}
