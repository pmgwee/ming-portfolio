/**
 * Public identity, metadata, and studio details used across the portfolio.
 * Gwee Per Ming is the person; Ming Creatives is the separate creative studio.
 */
const BIOGRAPHY =
  "Gwee Per Ming (Ming) is a Malaysian Data & AI Consultant with a Computer Science background and fintech software engineering internship experience. He builds and scales production AI agents and agentic solutions using emerging AI technologies. He is also building his content creation practice through @ming.creatives on Instagram.";

export const SITE = {
  url: "https://www.mingcreatives.com",
  name: "Gwee Per Ming",
  shortName: "Ming",
  studioName: "Ming Creatives",
  personName: "Gwee Per Ming",
  alternateNames: ["Ming", "Perming Gwee"],
  title: "Gwee Per Ming | Data & AI Consultant",
  description:
    "Gwee Per Ming is a Malaysian Data & AI Consultant building production AI agents and agentic solutions. CS graduate, former fintech engineering intern, and content creator at Ming Creatives.",
  // Current independent identity confirmed by Ming on 2026-10-16, not an
  // employer-held role or a replacement title for the iFAST internship.
  jobTitle: "Data & AI Consultant",
  headline: "Data & AI Consultant · Content Creator",
  biography: BIOGRAPHY,
  introduction:
    "I build and scale production AI agents and data solutions using emerging AI technologies. I translate real-world business needs into end-to-end systems, combining applied AI with data engineering.",
  background: "Malaysian · Computer Science graduate · Former fintech engineering intern",
  studioDescription:
    "Ming Creatives is Gwee Per Ming's studio for immersive web design, business websites and apps, AI agents and data engineering, and generative-AI creative production.",
  nationality: "Malaysian",
  locale: "en_MY",
  linkedin: "https://www.linkedin.com/in/gweeperming/",
  github: "https://github.com/pmgwee",
  instagram: "https://www.instagram.com/ming.creatives/",
  studioExploreUrl: "https://www.instagram.com/yier.ming/",
  whatsapp: "https://wa.me/message/DFUGF3HXISNEF1",
  gscVerification: "VY-sT_74iIU6P13LMHLRgPbYhsEdm9uOKgkpgg_QtFs",
  keywords: [
    "Gwee Per Ming",
    "Ming",
    "Data & AI Consultant",
    "Data engineering",
    "Content creator",
    "ming.creatives",
    "Production AI agents",
    "AI agent systems",
    "RAG systems",
    "Creative Technologist",
    "Ming Creatives",
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
  ],
  services: [
    {
      name: "Cinematic 3D & immersive web design",
      description:
        "3D and motion-led web experiences for portfolios, brands, and digital products, with usability kept in view.",
    },
    {
      name: "Business websites & web apps",
      description:
        "Custom websites and web applications shaped around business goals, customer needs, and real workflows.",
    },
    {
      name: "AI agents & data engineering",
      description:
        "Production AI agent integrations and data pipelines that connect source data to useful tools, retrieval systems, and business applications.",
    },
    {
      name: "AI-driven creative content & production",
      description:
        "AI-assisted imagery, video, and visual concepts for brand storytelling and digital campaigns.",
    },
  ],
  faq: [
    {
      q: "Who is Gwee Per Ming?",
      a: BIOGRAPHY,
    },
    {
      q: "What is Ming Creatives?",
      a: "Ming Creatives is Gwee Per Ming's studio identity for client-facing digital and visual work, and the name of his @ming.creatives content channel. Gwee Per Ming is the person. Ming Creatives is the studio. Yierming Production is separate past experience.",
    },
    {
      q: "What services does Ming Creatives offer?",
      a: "Ming Creatives offers cinematic 3D and immersive web design, business websites and web apps, AI agents and data engineering, and AI-driven creative content and production.",
    },
    {
      q: "What AI and software work can recruiters explore?",
      a: "AI Projects features the Personal Always-On AI Agent, Cross-Agent Context Engineering, BersamaAi Community Agents, the INTI-MBA RAG Chatbot, and Career Ops. Each case study explains Gwee’s contribution, how the system works, its operating status, and outcomes where verified.",
    },
    {
      q: "What does his Data & AI consulting focus on?",
      a: "His independent practice focuses on building and scaling production AI agents and agentic solutions. Data engineering and software development support the work, from source-data pipelines and retrieval to deployment and operation.",
    },
    {
      q: "What is his fintech engineering background?",
      a: "Gwee Per Ming completed a six-month Automation Engineer internship at iFAST Capital from March to August 2024. His work covered a Spring Batch compliance pipeline, an end-to-end investor-classification enhancement, and collaboration on fintech releases.",
    },
    {
      q: "Where can I follow Ming's content?",
      a: "Gwee Per Ming is building his content creation practice on Instagram as @ming.creatives, alongside his Data & AI consulting and creative studio work. The profile is linked through Let's Connect in the introduction and the Instagram link in the footer.",
    },
    {
      q: "How can I discuss a Ming Creatives project?",
      a: "Use the creative project contact link on this page to reach Ming Creatives about web, 3D, AI agents, data engineering, or generative-AI production work.",
    },
  ],
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/gweeperming/" },
    { label: "GitHub", href: "https://github.com/pmgwee" },
    { label: "Instagram", href: "https://www.instagram.com/ming.creatives/" },
  ],
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE.url).toString();
}

export function sameAs(): string[] {
  return [SITE.linkedin, SITE.github, SITE.instagram];
}
