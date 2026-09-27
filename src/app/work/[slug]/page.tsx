import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ENGINEERING_PROJECTS } from "@/lib/engineering-projects";
import { SITE } from "@/lib/seo";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

function findProject(slug: string) {
  return ENGINEERING_PROJECTS.find((project) => project.slug === slug);
}

export function generateStaticParams() {
  return ENGINEERING_PROJECTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      url: `${SITE.url}/work/${project.slug}`,
      title: `${project.title} | ${SITE.personName}`,
      description: project.summary,
    },
  };
}

function Detail({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-white/15 py-7 md:py-8">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-3 max-w-[76ch] text-sm leading-relaxed text-zinc-300 md:text-base">
        {children}
      </div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-[#07080c] px-6 pb-24 pt-32 md:px-10">
      <div className="mx-auto max-w-[1000px]">
        <Link
          href="/#ai-systems"
          className="inline-flex items-center gap-2 text-sm text-zinc-300 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200"
        >
          <ArrowLeft aria-hidden="true" weight="bold" className="size-4" />
          All AI systems
        </Link>

        <header className="mt-12 pb-10">
          <p className="text-sm font-medium text-indigo-200">Case study · Gwee Per Ming</p>
          <h1 className="mt-4 text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-white">
            {project.title}
          </h1>
          <p className="mt-6 max-w-[68ch] text-lg leading-relaxed text-zinc-300">
            {project.summary}
          </p>
          {project.slug === "career-ops" && (
            <p className="mt-5 text-sm leading-relaxed text-zinc-400">
              <span className="font-semibold text-zinc-200">My role:</span> {project.role}
            </p>
          )}
        </header>

        <Detail title="The problem">{project.problem}</Detail>
        <Detail title="My contribution">{project.contribution}</Detail>
        <Detail title="Architecture and stack">
          <p>{project.architecture}</p>
          <ul aria-label="Technology stack" className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li key={item} className="rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-200">
                {item}
              </li>
            ))}
          </ul>
        </Detail>
        <Detail title="What runs today">{project.operation}</Detail>
        <Detail title="Outcome">{project.outcome}</Detail>

        <Detail title="Proof and source links">
          {project.proofLinks.length > 0 ? (
            <ul className="space-y-3">
              {project.proofLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-2 text-indigo-100 underline decoration-indigo-200/50 underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200"
                  >
                    <span>{link.label}{link.status ? ` · ${link.status}` : ""}</span>
                    <ArrowUpRight aria-hidden="true" weight="bold" className="mt-0.5 size-4 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              The public demo or repository link will be added after a cleaned,
              shareable version is available.
            </p>
          )}
        </Detail>

        <div className="mt-10 flex flex-wrap gap-5">
          <Link
            href="/#experience"
            className="text-sm font-semibold text-zinc-200 underline decoration-white/30 underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200"
          >
            View experience
          </Link>
          <Link
            href="/#contact"
            className="text-sm font-semibold text-zinc-200 underline decoration-white/30 underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200"
          >
            Choose a contact path
          </Link>
        </div>
      </div>
    </main>
  );
}
