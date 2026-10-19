import type { Metadata } from "next";
import { WorksMorph } from "@/components/sections/works/WorksMorph";
import { WorksShowcase } from "@/components/sections/works/WorksShowcase";
import { SubpageShell } from "@/components/sections/SubpageShell";
import { SITE } from "@/lib/seo";

const DESCRIPTION =
  "Earlier products and prototypes by Gwee Per Ming, including Internify, RenoWise, and SatuRun, each with its current status labelled.";

export const metadata: Metadata = {
  title: "Side Projects",
  description: DESCRIPTION,
  alternates: { canonical: "/side-projects" },
  openGraph: {
    url: `${SITE.url}/side-projects`,
    title: `Side Projects | ${SITE.personName}`,
    description: DESCRIPTION,
  },
};

export default function SideProjectsPage() {
  return (
    <SubpageShell
      title={`Side Projects by ${SITE.personName}`}
      next={{
        href: "/ai-projects",
        label: "AI Projects",
        hook: "See where these early builds led: production AI agents and systems, with how each one works.",
      }}
    >
      <WorksMorph />
      <WorksShowcase />
    </SubpageShell>
  );
}
