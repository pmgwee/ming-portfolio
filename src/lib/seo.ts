/**
 * Single source of truth for all SEO / AEO / GEO metadata.
 *
 * Everything that feeds <head> tags, the sitemap, robots, the OG image, the
 * web manifest, the footer, and the JSON-LD structured data is derived from
 * `SITE` below, so the site speaks with one consistent voice to crawlers and
 * AI answer engines.
 *
 * Positioning: the PRIMARY business is award-standard 3D / creative animated
 * websites (creative technology). AI agents & automation are a secondary,
 * trend-riding offering — present in the copy but never the lead.
 *
 * Brand vs. person: the public brand is "Ming Creatives"; the real person is
 * "Gwee Per Ming" (Malaysia order) / "Perming Gwee" (international), also found
 * as "perming" / "gweeperming". All variants are declared so a search for any
 * of them resolves to this site.
 */
export const SITE = {
  /** Canonical origin — must match the version Google indexes (www). No trailing slash. */
  url: "https://www.mingcreatives.com",

  /** Public brand / entity name. Keep identical everywhere (socials too). */
  name: "Ming Creatives",
  shortName: "Ming Creatives",

  /** Real name (international order for display). */
  personName: "Perming Gwee",
  givenName: "Per Ming",
  familyName: "Gwee",
  /** Every name variant people might search. Drives schema `alternateName`. */
  alternateNames: [
    "Gwee Per Ming",
    "Perming Gwee",
    "gweeperming",
    "perming",
    "Gwee",
    "Ming Creatives",
    "Ming",
  ],

  /** <title> default — brand first, lead with the main business (3D), AI second. */
  title: "Ming Creatives — 3D Creative Websites & AI Consultant",

  /** ~150–160 chars: brand + name + main business (3D/award) + AI secondary + location. */
  description:
    "Ming Creatives is Perming Gwee — a creative technologist in Malaysia crafting award-standard 3D animated websites, plus AI agents & automation when you need them.",

  /** Role: leads creative, includes AI. Used in the eyebrow, OG image, Person.jobTitle. */
  jobTitle: "Creative Technologist & AI Consultant",

  locale: "en_US",
  /** Geographic disambiguation for the entity. */
  location: "Malaysia",

  /** X/Twitter @handle without the @. Enables twitter:creator. */
  twitterHandle: "gweeperming",

  /** TODO (optional): Google Search Console verification token (content value). */
  gscVerification: "",

  /** Terms to associate with the brand + person — creative/3D first, AI second. */
  keywords: [
    "Ming Creatives",
    "Perming Gwee",
    "Gwee Per Ming",
    "gweeperming",
    "perming",
    "3D website",
    "creative developer",
    "creative technologist",
    "awwwards website",
    "3D web animation",
    "scrollytelling",
    "WebGL",
    "GSAP",
    "Next.js",
    "AI consultant",
    "AI agent developer",
    "AI automation",
    "AI consultant Malaysia",
  ],

  /** Topics of authority — schema.org `knowsAbout` (a core AEO signal). Creative first. */
  expertise: [
    "Creative web development",
    "3D web / WebGL",
    "Web animation",
    "Scrollytelling",
    "GSAP",
    "Next.js",
    "React",
    "AI agents",
    "AI automation",
    "Generative AI",
  ],

  /** Social / profile links — single source for the footer AND schema `sameAs`.
   *  This is the core AEO/GEO lever: it ties the on-site entity to the wider web. */
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/gweeperming" },
    { label: "GitHub", href: "https://github.com/pmgwee" },
    { label: "Behance", href: "https://www.behance.net/gweeperming" },
    { label: "Instagram", href: "https://www.instagram.com/ming.creatives/" },
    { label: "Threads", href: "https://www.threads.com/@ming.creatives" },
    { label: "X", href: "https://x.com/gweeperming" },
    { label: "Xiaohongshu", href: "https://xhslink.com/m/2EOcSlNtjzh" },
  ],
} as const;

/** Absolute URL helper for canonical / OG / structured-data references. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE.url).toString();
}

/** Profile URLs only — for schema.org `sameAs`. */
export function sameAs(): string[] {
  return SITE.socials.map((s) => s.href);
}
