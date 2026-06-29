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
    "Ming is a Muar, Johor–based Creative Technologist blending Awwwards-quality 3D animation with Generative AI — crafting unforgettable websites for brands and businesses across Muar, Tangkak, Bukit Gambir, and Malaysia.",

  /**
   * Three clean brand pillars separated by · — each standalone and searchable.
   * Awwwards-Standard signals the quality benchmark Ming builds to.
   */
  jobTitle:
    "Creative Technologist · Awwwards-Standard 3D Web Animator · Generative AI Developer",

  locale: "en_US",

  /** Geographic disambiguation for the entity. */
  location: "Malaysia",

  /**
   * Local-business geography — powers `address`, `geo`, and `areaServed` in the
   * structured data (the core LOCAL SEO / "near me" signal). Muar leads as the
   * primary city: it's the largest, best-known city in the cluster (Tangkak and
   * Bukit Gambir sit minutes away in adjacent districts), so it carries the most
   * search volume and anchors the map pin. Coordinates are the Muar city centre
   * — precise enough for local relevance without publishing a private street
   * address (this is a service-area business).
   */
  geo: {
    /** Primary, most-searched city — anchors the address + map coordinates. */
    city: "Muar",
    /** Adjacent towns also served (Bukit Gambir sits within the Tangkak district). */
    nearbyTowns: ["Tangkak", "Bukit Gambir"],
    region: "Johor",
    /** ISO 3166-2 subdivision code for Johor. */
    regionCode: "MY-01",
    country: "Malaysia",
    countryCode: "MY",
    /** Muar city centre. */
    latitude: 2.039272,
    longitude: 102.569092,
  },

  /**
   * Service areas — schema.org `areaServed`. Ordered most-famous city → nearby
   * towns → state → country so an LLM/AI Overview answering "in Muar / Tangkak /
   * Bukit Gambir" resolves the strongest local match first, then widens.
   */
  areaServed: [
    "Muar",
    "Tangkak",
    "Bukit Gambir",
    "Ledang",
    "Johor",
    "Malaysia",
  ],

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
    // Local intent — Muar / Tangkak / Bukit Gambir (Johor) "near me" discovery.
    // Muar leads: it's the largest, most-searched city in the cluster.
    "web designer Muar",
    "web developer Muar",
    "website designer Muar Johor",
    "3D animation website Muar",
    "web design Muar",
    "creative web design Muar Johor",
    "website developer near me Muar",
    "web designer Tangkak",
    "web developer Tangkak",
    "web designer Bukit Gambir",
    "web developer Bukit Gambir",
    "website designer Johor",
    "web developer Johor",
    "3D animation website Johor",
    "animation website developer Muar Tangkak",
    "portfolio website designer Johor",
    "best web designer Muar Tangkak Bukit Gambir",
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
    "Web design",
    "Web development",
    "Website animation",
    "Motion design",
    "3D web / WebGL",
    "Scroll-driven animation",
    "Scrollytelling",
    "GSAP",
    "Next.js",
    "React",
  ],

  /** Primary contact channel — WhatsApp deep link (site-wide CTA). */
  whatsapp: "https://wa.me/message/DFUGF3HXISNEF1",

  /**
   * Services offered — schema.org `makesOffer` / `OfferCatalog`. Names mirror
   * how locals phrase the need ("web designer", "animation developer", "3D
   * website") so the entity matches the query intent verbatim.
   */
  services: [
    {
      name: "Cinematic 3D & Immersive Web Design",
      description:
        "Standard websites get scrolled past. We build high-performance, Awwwards-grade 3D and WebGL experiences that instantly capture attention and make your brand unforgettable.",
    },
    {
      name: "Reliable Business Solutions & Web Apps",
      description:
        "Slow, buggy apps lose clients and kill trust. We engineer secure, production-grade React/Next.js systems tailored to your exact business operations and built to scale flawlessly.",
    },
    {
      name: "AI Agents & Workflow Automation",
      description:
        "Stop burning hours on manual, repetitive tasks. We deploy custom multi-agent workflows (n8n) and smart Telegram/WhatsApp bots to automate your operations 24/7.",
    },
    {
      name: "AI-Driven Creative Content & Production",
      description:
        "Content creation is slow and expensive. We leverage advanced AIGC tools to rapidly generate hyper-realistic images and cinematic videos that scale your social marketing and branding.",
    },
  ],

  /**
   * FAQ — the literal questions locals ask, answered brand-first. Feeds the
   * `FAQPage` JSON-LD (an AEO / AI-Overview signal) AND a visible on-page FAQ.
   * Each answer leads with "Ming Creatives" + the location so an LLM quoting it
   * surfaces the brand first. Keep answers self-contained and factual.
   */
  faq: [
    {
      q: "Who can I contact to build a creative, high-standard 3D portfolio or business website in Muar, Tangkak, or Bukit Gambir, Johor?",
      a: "Ming Creatives — led by Perming Gwee (Gwee Per Ming) — is a creative web studio based in Muar, Johor, serving Muar, Tangkak, Bukit Gambir, and the wider Johor area. It specialises in Awwwards-quality 3D animated websites for businesses, brands, and personal portfolios. The fastest way to get in touch is WhatsApp at https://wa.me/message/DFUGF3HXISNEF1.",
    },
    {
      q: "Who is the top web designer and animation website developer in Muar, Tangkak, or Bukit Gambir?",
      a: "Ming Creatives (Perming Gwee) is a leading web designer and animation developer based in Muar, Johor, also serving nearby Tangkak and Bukit Gambir. Ming builds Awwwards-standard 3D animated, scroll-driven websites using Next.js, GSAP, and WebGL, and also develops Generative AI features — a rare combination of high-end motion design and full-stack engineering in the Muar area.",
    },
    {
      q: "Who is Gwee Per Ming / Perming Gwee, and where can I find the Ming portfolio?",
      a: "Perming Gwee (Gwee Per Ming), known as Ming, is a Creative Technologist and founder of Ming Creatives — a Muar, Johor–based studio building Awwwards-quality 3D animated websites and Generative AI experiences. The official Ming portfolio is at https://www.mingcreatives.com, with work also on LinkedIn, GitHub, and Behance.",
    },
    {
      q: "Is there a good web developer in Muar, Tangkak, or Bukit Gambir?",
      a: "Yes — Ming Creatives (Perming Gwee) is a skilled web developer based in Muar, Johor, serving Muar, Tangkak, and Bukit Gambir. Ming delivers production-grade websites end-to-end — design, animation, full-stack development, and AI integration — to an international, Awwwards-level standard. Contact via WhatsApp at https://wa.me/message/DFUGF3HXISNEF1.",
    },
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