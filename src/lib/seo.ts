/**
 * Public identity, metadata, and studio details used across the portfolio.
 * Gwee Per Ming is the person; Ming Creatives is the separate creative studio.
 */
export const SITE = {
  url: "https://www.mingcreatives.com",
  name: "Gwee Per Ming",
  shortName: "Ming",
  studioName: "Ming Creatives",
  personName: "Gwee Per Ming",
  alternateNames: ["Ming", "Perming Gwee"],
  title: "Gwee Per Ming | Production AI Builder & Creative Technologist",
  description:
    "Gwee Per Ming is a Malaysia-based Computer Science graduate and production AI builder. He builds and operates AI systems and software; Ming Creatives is his separate studio for 3D web design, business apps, AI workflow automation, and generative-AI creative work.",
  jobTitle: "Production AI Builder and Creative Technologist",
  location: "Malaysia",
  locale: "en_MY",
  linkedin: "https://www.linkedin.com/in/gweeperming/",
  github: "https://github.com/pmgwee",
  whatsapp: "https://wa.me/message/DFUGF3HXISNEF1",
  gscVerification: "VY-sT_74iIU6P13LMHLRgPbYhsEdm9uOKgkpgg_QtFs",
  keywords: [
    "Gwee Per Ming",
    "Ming",
    "Production AI Builder",
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
    "Cloud infrastructure",
    "Web design and development",
    "3D web animation",
    "Business web application development",
    "AI agents and workflow automation",
    "Generative-AI creative work",
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
      name: "AI agents & workflow automation",
      description:
        "AI agent integrations and workflow automation designed to reduce repetitive tasks and connect the tools teams use.",
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
      a: "Gwee Per Ming is a Malaysian Computer Science graduate and production AI builder. He builds and operates AI systems and software, bringing a creative-technologist background in 3D and interactive web experiences.",
    },
    {
      q: "What is Ming Creatives?",
      a: "Ming Creatives is Gwee Per Ming’s creative studio identity for client-facing digital and visual work. Gwee Per Ming is the person; Ming Creatives is the studio. His production AI engineering work is presented separately.",
    },
    {
      q: "What services does Ming Creatives offer?",
      a: "Cinematic 3D and immersive web design; business websites and web apps; AI agents and workflow automation; and AI-driven creative content and production.",
    },
    {
      q: "What AI and software work can recruiters explore?",
      a: "The AI Systems section features Career Ops, a Personal Always-On AI Agent, Cross-Agent Context Engineering, BersamaAi Community Agents, and the INTI-MBA RAG Chatbot. Each case study explains Gwee’s contribution, how the system works, its operating status, and outcomes where verified.",
    },
    {
      q: "Which roles is Gwee Per Ming pursuing?",
      a: "He is targeting AI Engineer and AI/Data Consultant roles. These are career directions, not positions he is presenting as past employment.",
    },
    {
      q: "How can I discuss a Ming Creatives project?",
      a: "Use the creative project contact link on this page to reach Ming Creatives about web, 3D, AI automation, or generative-AI production work.",
    },
  ],
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/gweeperming/" },
    { label: "GitHub", href: "https://github.com/pmgwee" },
  ],
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE.url).toString();
}

export function sameAs(): string[] {
  return [SITE.linkedin, SITE.github];
}
