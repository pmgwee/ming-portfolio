import type { Metadata } from "next";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { SubpageShell } from "@/components/sections/SubpageShell";
import { SITE } from "@/lib/seo";

const DESCRIPTION =
  "The experience and education behind Ming Creatives: a Computer Science background, fintech engineering internship experience, and creative production.";

export const metadata: Metadata = {
  title: "Experiences",
  description: DESCRIPTION,
  alternates: { canonical: "/experiences" },
  openGraph: {
    url: `${SITE.url}/experiences`,
    title: `Experiences | ${SITE.personName}`,
    description: DESCRIPTION,
  },
};

export default function ExperiencesPage() {
  return (
    <SubpageShell
      title={`Experiences of ${SITE.personName}`}
      next={{
        href: "/side-projects",
        label: "Side Projects",
        hook: "The earlier products and prototypes built along the way, each with its status labelled.",
      }}
    >
      <ExperienceSection />
    </SubpageShell>
  );
}
