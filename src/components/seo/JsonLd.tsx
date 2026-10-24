import { ENGINEERING_PROJECTS } from "@/lib/engineering-projects";
import { SITE, absoluteUrl, sameAs } from "@/lib/seo";

export function JsonLd() {
  const personId = `${SITE.url}/#person`;
  const websiteId = `${SITE.url}/#website`;

  // Repositories are private, so projects are described, never linked to code.
  const projectNodes = ENGINEERING_PROJECTS.map((project) => {
    const isContribution = project.slug === "career-ops";

    return {
      "@type": "CreativeWork",
      "@id": `${absoluteUrl(`/work/${project.slug}`)}#project`,
      name: project.title,
      description: project.summary,
      url: absoluteUrl(`/work/${project.slug}`),
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
      description: SITE.biography,
      url: SITE.url,
      nationality: { "@type": "Country", name: "Malaysia" },
      knowsAbout: [...SITE.expertise],
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Universiti Sains Malaysia",
      },
      image: absoluteUrl("/icon.png"),
      sameAs: sameAs(),
      // A content creator who also takes on collaborations (not a studio).
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
      name: SITE.name,
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
