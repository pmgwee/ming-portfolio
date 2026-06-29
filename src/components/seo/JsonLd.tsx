import { SITE, absoluteUrl, sameAs } from "@/lib/seo";

/**
 * JSON-LD structured data — the primary AEO/GEO signal.
 *
 * Defines a single connected entity graph (Person ⇄ Organization/LocalBusiness
 * ⇄ WebSite ⇄ FAQPage) so Google's Knowledge Graph and AI Overview — and the
 * answer-engine LLMs (Gemini, ChatGPT, Claude) — can resolve "Ming Creatives" /
 * "Perming Gwee" to one concrete person+brand, tied to a real service area
 * (Muar / Tangkak / Bukit Gambir, Johor, Malaysia), rather than guessing among
 * unrelated "Ming" entities. Stable @id anchors let the nodes reference each
 * other; `sameAs` ties the entity to its off-site profiles.
 */
export function JsonLd() {
  const personId = `${SITE.url}/#person`;
  const orgId = `${SITE.url}/#organization`;
  const siteId = `${SITE.url}/#website`;
  const faqId = `${SITE.url}/#faq`;
  const image = absoluteUrl("/logo.jpg"); // illustration → represents the person
  const logoUrl = absoluteUrl("/icon.png"); // crystal "M" → the brand logo mark
  const profiles = sameAs();

  // Local geography reused by the Person + LocalBusiness nodes.
  const postalAddress = {
    "@type": "PostalAddress",
    addressLocality: SITE.geo.city,
    addressRegion: SITE.geo.region,
    addressCountry: SITE.geo.countryCode,
  };
  const geoCoordinates = {
    "@type": "GeoCoordinates",
    latitude: SITE.geo.latitude,
    longitude: SITE.geo.longitude,
  };
  // Service area, most-specific first (town → district → state → country).
  const areaServed = SITE.areaServed.map((name) => ({
    "@type": "Place",
    name,
  }));
  // Services as schema.org Offers — names mirror local search phrasing.
  const makesOffer = SITE.services.map((s) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: s.name,
      description: s.description,
    },
  }));

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
      address: postalAddress,
      worksFor: { "@id": orgId },
      sameAs: profiles,
    },
    {
      // Both an Organization and a local ProfessionalService — one brand entity
      // that is also a discoverable local business with a service area.
      "@type": ["Organization", "ProfessionalService"],
      "@id": orgId,
      name: SITE.name,
      url: SITE.url,
      image,
      description: SITE.description,
      logo: { "@type": "ImageObject", url: logoUrl },
      founder: { "@id": personId },
      address: postalAddress,
      geo: geoCoordinates,
      areaServed,
      knowsAbout: [...SITE.expertise],
      makesOffer,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        url: SITE.whatsapp,
        availableLanguage: ["en", "ms", "zh"],
      },
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
    {
      // Answers the literal local questions — read directly by AI Overview and
      // answer-engine LLMs. Mirrored by the visible on-page FAQ (FaqSection).
      "@type": "FAQPage",
      "@id": faqId,
      url: SITE.url,
      isPartOf: { "@id": siteId },
      about: { "@id": orgId },
      mainEntity: SITE.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
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
