import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { NextSection } from "@/components/sections/NextSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <NextSection />
    </main>
  );
}
