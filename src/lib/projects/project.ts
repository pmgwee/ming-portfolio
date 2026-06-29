/**
 * Works showcase content — drives the scroll-morph (`WorksMorph`).
 *
 * Four real, shipped projects. Only the constants `WorksMorph` consumes live
 * here: `PROJECTS`, `MORPH_CARDS`, `heroCopy`, `morphCopy` (+ the preload list).
 * Cover images are offloaded to S3/CloudFront via `mediaUrl()` (the `projects/`
 * prefix); they fall back to `/public/projects` in local dev.
 */
import { mediaUrl } from "@/lib/media";

/** WhatsApp deep-link — the site-wide primary CTA. */
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
  /** Live site / demo URL. Empty string = no public link (e.g. mobile app). */
  href?: string;
  /** Floating UI/UX prototype screenshot shown on card hover (S3 `prototype/`). */
  prototype?: string;
}

/** Section-1 hero copy — fades / translates OUT as the fan collapses. */
export const heroCopy = {
  title: "Built to ship.",
  titleAccent: "Built to last.",
  subtitle:
    "From first concept to live deployment. Real products, fully owned by the people we built them for.",
  primaryCta: { label: "Start a project", href: WHATSAPP },
  secondaryCta: { label: "See the work", href: "#work" },
};

/** The four cornerstone projects — drive the fan, the stack, and the grid. */
export const PROJECTS: ShowcaseProject[] = [
  {
    id: "internify",
    title: "Internify",
    meta: "Internship Platform / Full-Stack",
    description:
      "An internship management platform pairing students with companies — students browse listings, build a project showcase, and get AI-matched roles, while companies post and manage openings. Next.js with NextAuth, Prisma/MongoDB, and an OpenAI recommendation engine.",
    image: mediaUrl("/projects/Internship_platform.jpg"),
    tags: ["Next.js", "Prisma", "MongoDB", "NextAuth", "OpenAI"],
    handle: "@internify",
    category: "Full-Stack / EdTech",
    href: "https://internify-deploy.vercel.app",
    prototype: mediaUrl("/prototype/Internship_platform.jpg"),
  },
  {
    id: "renowise",
    title: "RenoWise",
    meta: "Renovation Marketplace / PropTech",
    description:
      "A full-stack marketplace connecting homeowners with renovation contractors — listings, favourites, reviews, an AI recommendation engine, and real-time Pusher chat, on Next.js + Prisma/MongoDB.",
    image: mediaUrl("/projects/Rennovation_marketplace.jpg"),
    tags: ["Next.js", "MongoDB", "Pusher", "OpenAI"],
    handle: "@renowise",
    category: "Marketplace / PropTech",
    href: "https://renowise-usm.vercel.app/",
    prototype: mediaUrl("/prototype/Rennovation_marketplace.jpg"),
  },
  {
    id: "study-ai",
    title: "Study Assistant",
    meta: "RAG Study Agent / AI",
    description:
      "A RAG-powered study agent that syncs Canvas LMS materials into per-course Pinecone namespaces, then answers with citations — a LangGraph pipeline that expands, retrieves, grades, and generates over a FastAPI + Next.js stack.",
    image: mediaUrl("/projects/University_study_ai_agent.jpg"),
    tags: ["LangGraph", "Pinecone", "FastAPI", "Next.js"],
    handle: "@studyai",
    category: "AI / EdTech",
    href: "https://github.com/pmgwee/Ai-Chatbot",
    prototype: mediaUrl("/prototype/University_study_ai_agent.jpg"),
  },
  {
    id: "saturun",
    title: "SatuRun",
    meta: "Running Community App / Mobile",
    description:
      "A mobile-first running-event discovery and community platform for Malaysia — map-based discovery, community feed, rewards, and group chat, built with Expo + React Native over an Express/Postgres backend.",
    image: mediaUrl("/projects/Running_community.jpg"),
    tags: ["Expo", "React Native", "Expo Router", "Reanimated"],
    handle: "@saturun",
    category: "Mobile / Community",
    href: "https://www.instagram.com/reel/DaIRQ7HTYhY/?igsh=bmFlcndqa3IxNGJp",
    prototype: mediaUrl("/prototype/Running_community.jpg"),
  },
];

/**
 * The persistent card deck for the scroll-morph — one card per project. The
 * fan, the centred stack, and the right-side cascading grid all derive from
 * `MORPH_CARDS.length`, so this scales with `PROJECTS`. Each card carries a
 * stable `key`; images reuse `PROJECTS`' URLs.
 */
export const MORPH_CARDS: (ShowcaseProject & { key: string })[] = PROJECTS.map(
  (p, i) => ({ ...p, key: `${p.id}-${i}` }),
);

/**
 * Section-2 copy revealed as the grid forms. `headerWords` feeds the
 * word-by-word reveal; indices in `accentRange` render in the brand gradient
 * ("design, build, & ship" — the middle clause).
 */
export const morphCopy = {
  eyebrow: "Designed, built & shipped",
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
  accentRange: [1, 2, 3, 4],
  subtitle:
    "User Interface, User Experience, backend, AI, and Infrastructure — I handle the full stack, so you can focus on your product.",
  primaryCta: { label: "Get in touch", href: "https://github.com/pmgwee" },
  secondaryCta: { label: "Let's build yours", href: WHATSAPP },
};

/** Project cover images — the above-the-fold set for preloading. */
export const PROJECT_IMAGE_URLS: string[] = PROJECTS.map((p) => p.image);

/** Prototype hover-preview images — preloaded so the first hover pops instantly. */
export const PROTOTYPE_IMAGE_URLS: string[] = PROJECTS.map(
  (p) => p.prototype,
).filter((url): url is string => Boolean(url));
