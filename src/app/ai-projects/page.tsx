import type { Metadata } from "next";
import { EngineeringSection } from "@/components/sections/EngineeringSection";
import { SubpageShell } from "@/components/sections/SubpageShell";
import { SITE } from "@/lib/seo";

const DESCRIPTION =
  "Production AI agents and systems built by Ming: what each one does, how it works, its operating status, and verified outcomes.";

export const metadata: Metadata = {
  title: "AI Projects",
  description: DESCRIPTION,
  alternates: { canonical: "/ai-projects" },
  openGraph: {
    url: `${SITE.url}/ai-projects`,
    title: `AI Projects | ${SITE.personName}`,
    description: DESCRIPTION,
  },
};

export default function AiProjectsPage() {
  return (
    <SubpageShell
      title={`AI Projects by ${SITE.personName}`}
      next={{
        href: "/experiences",
        label: "Experiences",
        hook: "The background behind these systems: Computer Science, fintech engineering, and independent Data & AI consulting.",
      }}
    >
      <EngineeringSection />
    </SubpageShell>
  );
}
