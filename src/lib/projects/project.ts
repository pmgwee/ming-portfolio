/** Earlier portfolio projects; AI-focused work is featured in its own section. */
import { mediaUrl } from "@/lib/media";

const WHATSAPP = "https://wa.me/message/DFUGF3HXISNEF1";

export interface ShowcaseProject {
  id: string;
  title: string;
  meta: string;
  description: string;
  image: string;
  tags: string[];
  handle: string;
  category: string;
  status: string;
  href?: string;
  prototype?: string;
}

export const heroCopy = {
  title: "Built to ship.",
  titleAccent: "Built to last.",
  subtitle:
    "Selected products and prototypes, with each project’s status clearly labeled.",
  primaryCta: { label: "Start a project", href: WHATSAPP },
  secondaryCta: { label: "See side projects", href: "#side-project" },
};

export const PROJECTS: ShowcaseProject[] = [
  {
    id: "internify",
    title: "Internify",
    meta: "Internship discovery platform",
    description:
      "A student team project for internship discovery, with company listings, student profiles, and AI-assisted role recommendations. The public URL is a project demo, not evidence of a live commercial service.",
    image: mediaUrl("/projects/Internship_platform.jpg"),
    tags: ["Next.js", "Prisma", "MongoDB", "OpenAI"],
    handle: "@internify",
    category: "Full-stack · EdTech",
    status: "Student project · public demo",
    href: "https://internify-deploy.vercel.app",
    prototype: mediaUrl("/prototype/Internship_platform.jpg"),
  },
  {
    id: "renowise",
    title: "RenoWise",
    meta: "Renovation services marketplace",
    description:
      "A final-year marketplace project matching homeowners with renovation contractors by budget, location, and category. The public URL is a project demo, not evidence of a live commercial service.",
    image: mediaUrl("/projects/Rennovation_marketplace.jpg"),
    tags: ["Next.js", "MongoDB", "Prisma", "GPT"],
    handle: "@renowise",
    category: "Marketplace · PropTech",
    status: "Final-year project · public demo",
    href: "https://renowise-usm.vercel.app/",
    prototype: mediaUrl("/prototype/Rennovation_marketplace.jpg"),
  },
  {
    id: "saturun",
    title: "SatuRun",
    meta: "Running community app concept",
    description:
      "A mobile-first prototype for discovering running events and community activity. The current showcase uses mock data; its API, server, and database are not wired as a live service.",
    image: mediaUrl("/projects/Running_community.jpg"),
    tags: ["Expo", "React Native", "Mobile UI"],
    handle: "@saturun",
    category: "Mobile · Community",
    status: "UI prototype · mock data",
    prototype: mediaUrl("/prototype/Running_community.jpg"),
  },
];

export const MORPH_CARDS: (ShowcaseProject & { key: string })[] = PROJECTS.map(
  (project, index) => ({ ...project, key: `${project.id}-${index}` }),
);

export const morphCopy = {
  eyebrow: "Side projects",
  headerWords: [
    "I",
    "design,",
    "build,",
    "&",
    "ship",
    "the",
    "platform",
    "your",
    "idea",
    "deserves.",
  ],
  subtitle:
    "Selected earlier projects and prototypes, with their current status clearly described.",
  primaryCta: { label: "Explore projects", href: "#earlier-work" },
  secondaryCta: { label: "Contact Ming Creatives", href: WHATSAPP },
};

export const PROJECT_IMAGE_URLS = PROJECTS.map((project) => project.image);
export const PROTOTYPE_IMAGE_URLS = PROJECTS.map((project) => project.prototype).filter(
  (url): url is string => Boolean(url),
);
