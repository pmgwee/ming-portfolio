/**
 * Public identity and metadata used across the site.
 * Ming Creatives (@ming.creatives) is a content-creator brand, not a studio.
 * It stays separate from the creator's real-name identity: never publish the
 * real name, and never link the LinkedIn or GitHub profiles built on it.
 */
const BIOGRAPHY =
  "Ming Creatives is a Malaysian content creator on Instagram as @ming.creatives, sharing photography, AI-generated films, and the creative tech behind them. The creator has a Computer Science background and fintech engineering internship experience, and builds the AI agents and immersive web experiences featured here.";

export const SITE = {
  url: "https://www.mingcreatives.com",
  name: "Ming Creatives",
  shortName: "Ming Creatives",
  handle: "@ming.creatives",
  // Give each new logo version a new filename: image caches key on the path.
  logo: "/logo-resized.png",
  personName: "Ming Creatives",
  alternateNames: ["ming.creatives", "mingcreatives"],
  title: "Ming Creatives | Content Creator",
  description:
    "Ming Creatives is a Malaysian content creator on Instagram (@ming.creatives): photography, AI-generated films, and the AI agents and immersive web built behind them.",
  // Brand identity confirmed by the creator on 2026-10-25: a content creator
  // on Instagram, replacing the earlier Data & AI Consultant positioning.
  jobTitle: "Content Creator",
  headline: "Content Creator",
  biography: BIOGRAPHY,
  introduction:
    "The AI agents and data tools behind the work, built to run every day rather than stop at a demo, from automated workflows to retrieval systems that cite their sources.",
  nationality: "Malaysian",
  locale: "en_MY",
  instagram: "https://www.instagram.com/ming.creatives/",
  whatsapp: "https://wa.me/message/DFUGF3HXISNEF1",
  contact: {
    email: "leeahming199@gmail.com",
    title: "Coffee, ideas, and what’s next.",
    description: "A conversation about the work, a potential opportunity, or a résumé request. Choose a starting point.",
    topics: [
      { id: "coffee", title: "Coffee chat", description: "Compare notes. Share an idea. Say hello." },
      { id: "opportunity", title: "An opportunity", description: "A role or collaboration worth talking about." },
      { id: "resume", title: "Résumé request", description: "For recruiters and hiring managers." },
    ],
    coffeeTitle: "Start with hello.",
    coffeeDescription: "Send a little context and a few times that work for you, including your time zone. We can find a time to chat.",
    coffeeCta: "Chat on WhatsApp",
    coffeeNote: "Opens my current WhatsApp contact. No booking is made automatically.",
    resumeNote: "Résumé requests are for recruiters and hiring managers. Please include your company and the role you’re hiring for.",
    opportunityNote: "Tell me about the team, the role or project, and what you have in mind.",
    emailCta: "Open email draft",
    emailNote: "Opens your email app with these details. Review and send it there.",
    draftNotice: "Your email app should open with your draft. Nothing has been sent by this website. If it didn’t open, email me directly below.",
    labels: { name: "Name", email: "Your email", company: "Company / organisation", role: "Role you’re hiring for", message: "Message" },
    placeholders: { name: "Your name", email: "you@company.com", company: "Company or team", role: "Position / team", message: "A little context, and what you’d like to discuss." },
    optional: "Optional",
    required: "Required fields",
    privacy: "Your details aren’t saved or sent by this website.",
    directEmail: "Or email me directly",
    instagram: "Follow @ming.creatives",
    collab: "Collaboration inquiry",
  },
  gscVerification: "VY-sT_74iIU6P13LMHLRgPbYhsEdm9uOKgkpgg_QtFs",
  keywords: [
    "Ming Creatives",
    "ming.creatives",
    "Content creator",
    "Malaysian content creator",
    "AI films",
    "AIGC",
    "Photography",
    "Creative technology",
    "AI agents",
    "3D web animation",
  ],
  expertise: [
    "Production AI systems",
    "Agentic workflows",
    "Retrieval-augmented generation",
    "Hybrid information retrieval",
    "AI system evaluation",
    "Context engineering",
    "Software engineering",
    "Data engineering",
    "Cloud infrastructure",
    "Web design and development",
    "3D web animation",
    "Business web application development",
    "AI agents and agentic solutions",
    "Generative-AI creative work",
    "Content creation",
    "Photography",
  ],
  services: [
    {
      name: "AIGC & AI TVC production",
      shortName: "AIGC & AI TVC",
      outcome: "Concept to final cut",
      description:
        "AI-generated content (AIGC) and AI-driven TV commercials (TVCs): concept, script, storyboard, video generation, voiceover, and edit, delivered in formats for TV, YouTube, and social media.",
    },
    {
      name: "AI agents & data engineering",
      shortName: "AI agents & data",
      outcome: "Data to working agent",
      description:
        "Production AI agent integrations and data pipelines that connect source data to useful tools, retrieval systems, and business applications.",
    },
    {
      name: "SaaS & web products",
      shortName: "SaaS & web",
      outcome: "Idea to live product",
      description:
        "Cinematic 3D and immersive websites, business websites, and web apps, built as products around business goals, real workflows, and usability.",
    },
  ],
  faq: [
    {
      q: "Who is Ming Creatives?",
      a: BIOGRAPHY,
    },
    {
      q: "What does Ming Creatives make?",
      a: "Photography and portrait series, AI-generated films and commercials, and creative tech: immersive 3D websites and the AI tools behind the content. The work is shared on Instagram as @ming.creatives and collected on this site.",
    },
    {
      q: "Can I collaborate with Ming Creatives?",
      a: "Yes. Ming Creatives takes on brand collaborations and projects in AIGC content and AI-driven TV commercials (TVCs), AI agents and data tools, and SaaS and immersive web products. Start a conversation on WhatsApp from any Start a project button.",
    },
    {
      q: "What AI and software work can recruiters explore?",
      a: "AI Projects features the Personal Always-On AI Agent, Cross-Agent Context Engineering, BersamaAi Community Agents, the INTI-MBA RAG Chatbot, and Career Ops. Each case study explains the contribution, how the system works, its operating status, and outcomes where verified.",
    },
    {
      q: "Are the code repositories public?",
      a: "No. Source repositories aren't linked from this site. Each case study explains how the system works, and a live walkthrough is available on request through WhatsApp or the contact section.",
    },
    {
      q: "What is the engineering background behind Ming Creatives?",
      a: "The creator behind Ming Creatives holds a Computer Science degree and completed a six-month automation engineering internship at a Malaysian fintech investment platform in 2024, covering a compliance pipeline, an investor-classification enhancement, and fintech releases.",
    },
    {
      q: "Where can I follow Ming Creatives?",
      a: "On Instagram as @ming.creatives. The profile is linked from the Follow buttons on this page and the Instagram icon in the footer.",
    },
    {
      q: "How do I get in touch?",
      a: "For collaborations, message Ming Creatives on WhatsApp from any Start a project or Contact button. For anything else, use the contact section to open an email draft to leeahming199@gmail.com.",
    },
  ],
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/ming.creatives/" },
  ],
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE.url).toString();
}

export function sameAs(): string[] {
  return [SITE.instagram];
}
