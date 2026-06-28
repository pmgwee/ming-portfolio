import { SITE, absoluteUrl, sameAs } from "@/lib/seo";

/**
 * JSON-LD structured data — the primary AEO/GEO signal.
 *
 * Defines a single connected entity graph (Person ⇄ Organization ⇄ WebSite) so
 * Google's Knowledge Graph and AI Overview can resolve "Ming Creatives" /
 * "Perming Gwee" to one concrete person+brand rather than guessing among
 * unrelated "Ming" entities. Stable @id anchors let the nodes reference each
 * other; `sameAs` ties the entity to its off-site profiles.
 */
export function JsonLd() {
  const personId = `${SITE.url}/#person`;
  const orgId = `${SITE.url}/#organization`;
  const siteId = `${SITE.url}/#website`;
  const image = absoluteUrl("/logo.jpg"); // illustration → represents the person
  const logoUrl = absoluteUrl("/icon.png"); // crystal "M" → the brand logo mark
  const profiles = sameAs();

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Person",
      "@id": personId,
      name: SITE.personName,
      givenName: SITE.givenName,
      familyName: SITE.familyName,
      alternateName: [...SITE.alternateNames],
      url: SITE.url,
      image,
      jobTitle: SITE.jobTitle,
      description: SITE.description,
      knowsAbout: [...SITE.expertise],
      address: { "@type": "PostalAddress", addressCountry: SITE.location },
      sameAs: profiles,
      worksFor: { "@id": orgId },
    },
    {
      "@type": "Organization",
      "@id": orgId,
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      logo: { "@type": "ImageObject", url: logoUrl },
      founder: { "@id": personId },
      sameAs: profiles,
    },
    {
      "@type": "WebSite",
      "@id": siteId,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      inLanguage: "en",
      publisher: { "@id": orgId },
    },
  ];

  const json = { "@context": "https://schema.org", "@graph": graph };

  return (
    <script
      type="application/ld+json"
      // Structured data is a static string built from trusted constants.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
