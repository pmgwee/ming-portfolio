import { ENGINEERING_PROJECTS } from "@/lib/engineering-projects";
import { SITE, absoluteUrl, sameAs } from "@/lib/seo";

export function JsonLd() {
  const personId = `${SITE.url}/#person`;
  const studioId = `${SITE.url}/#ming-creatives`;
  const websiteId = `${SITE.url}/#website`;

  const projectNodes = ENGINEERING_PROJECTS.map((project) => {
    const isContribution = project.slug === "career-ops";
    const repository = project.proofLinks.find((link) =>
      link.label.includes("repository"),
    );

    return {
      "@type": repository ? "SoftwareSourceCode" : "CreativeWork",
      "@id": `${absoluteUrl(`/work/${project.slug}`)}#project`,
      name: project.title,
      description: project.summary,
      url: absoluteUrl(`/work/${project.slug}`),
      ...(repository ? { codeRepository: repository.href } : {}),
      ...(isContribution
        ? { contributor: { "@id": personId } }
        : { creator: { "@id": personId } }),
      keywords: [...project.stack],
      isPartOf: { "@id": websiteId },
    };
  });

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Person",
      "@id": personId,
      name: SITE.personName,
      alternateName: [...SITE.alternateNames],
      jobTitle: SITE.jobTitle,
      description: SITE.description,
      url: SITE.url,
      knowsAbout: [...SITE.expertise],
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Universiti Sains Malaysia",
      },
      affiliation: { "@id": studioId },
      sameAs: sameAs(),
    },
    {
      "@type": "Organization",
      "@id": studioId,
      name: SITE.studioName,
      url: SITE.url,
      description:
        "The creative studio identity of Gwee Per Ming for immersive web design, business websites and apps, AI workflow automation, and generative-AI creative production.",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon.png"),
      },
      makesOffer: SITE.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
        },
      })),
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: SITE.url,
      name: `${SITE.name} · ${SITE.studioName}`,
      description: SITE.description,
      inLanguage: "en",
      about: { "@id": personId },
      publisher: { "@id": personId },
    },
    ...projectNodes,
  ];

  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
