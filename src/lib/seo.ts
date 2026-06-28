/**
 * Single source of truth for all SEO / AEO / GEO metadata.
 *
 * Everything that feeds <head> tags, the sitemap, robots, the OG image, the
 * web manifest, the footer, and the JSON-LD structured data is derived from
 * `SITE` below.
 *
 * Positioning: The absolute PRIMARY focus is building, scaling, and representing
 * the "Ming" personal and studio brand. This website serves as Ming's official
 * interactive portfolio — centering Ming as the brand entity, showcasing a core
 * creative mindset, high-impact Awwwards-quality 3D animation, and advanced
 * Generative AI implementation.
 *
 * Search Intent: Structured heavily around variations like "ming portfolio",
 * "ming creative", "ming website", and "ming 3d animation".
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
    "Ming Portfolio",
    "Ming Creative",
    "Ming Website",
    "Ming 3D Animation",
    "Gwee Per Ming",
    "Perming Gwee",
    "gweeperming",
    "perming",
    "Gwee",
    "Ming",
  ],

  /**
   * <title> default — ~60 characters.
   * Ming leads as the brand entity. Awwwards frames the quality standard.
   * Directly addresses "Ming Portfolio" and "Ming Creative" search queries.
   */
  title: "Ming Creatives | Awwwards 3D Animation & Generative AI",

  /**
   * ~155 chars. Person-first framing — Ming is the subject, not the portfolio.
   * Hits "Ming Creative", "Ming Website", and "Ming 3D" intent while
   * positioning Generative AI as the second creative pillar.
   */
  description:
    "Ming is a Creative Technologist blending Awwwards-Quality 3D animation with Generative AI — building experiences that are as technically precise as they are visually unforgettable.",

  /**
   * Three clean brand pillars separated by · — each standalone and searchable.
   * Awwwards-Standard signals the quality benchmark Ming builds to.
   */
  jobTitle:
    "Creative Technologist · Awwwards-Standard 3D Web Animator · Generative AI Developer",

  locale: "en_US",

  /** Geographic disambiguation for the entity. */
  location: "Malaysia",

  /** X/Twitter @handle without the @. Enables twitter:creator. */
  twitterHandle: "gweeperming",

  /** Google Search Console verification token. */
  gscVerification: "VY-sT_74iIU6P13LMHLRgPbYhsEdm9uOKgkpgg_QtFs",

  /**
   * Keywords optimized for Ming-branded search intent, elevating Generative AI
   * and Awwwards-quality 3D animation as the two core discovery pillars.
   */
  keywords: [
    "ming portfolio",
    "ming creative",
    "ming creative portfolio",
    "ming website",
    "ming 3d animation",
    "Ming Creatives",
    "Perming Gwee",
    "Gwee Per Ming",
    "gweeperming",
    "perming",
    "awwwards 3d animation",
    "awwwards quality portfolio",
    "generative AI developer portfolio",
    "creative technologist portfolio",
    "3D animated website",
    "interactive portfolio website",
    "WebGL developer Malaysia",
    "AI agents and automation",
    "GSAP animation",
    "Next.js portfolio",
  ],

  /**
   * Topics of authority — schema.org `knowsAbout` (a core AEO signal).
   * Ordered by brand priority: Generative AI and 3D animation lead.
   */
  expertise: [
    "Generative AI integration",
    "AI agents & automation",
    "Awwwards-quality 3D animated websites",
    "Creative web development",
    "3D web / WebGL",
    "Scroll-driven animation",
    "Scrollytelling",
    "GSAP",
    "Next.js",
    "React",
  ],

  /** Social / profile links — single source for the footer AND schema `sameAs`. */
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