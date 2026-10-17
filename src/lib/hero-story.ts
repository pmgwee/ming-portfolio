import { SITE } from "./seo";

/** Versioned review assets, independent of the old S3 frame sequence. */
export const HERO_FILM = {
  desktop: "/hero/studio-journey-v1/film-1080.mp4",
  mobile: "/hero/studio-journey-v1/film-720.mp4",
  poster: "/hero/studio-journey-v1/poster.webp",
  ending: "/hero/studio-journey-v1/ending.webp",
  duration: 15,
} as const;

export const HERO_CHAPTERS = [
  {
    id: "about", number: "01", label: "About me", title: "About me.",
    body: `I'm ${SITE.personName}, a Malaysian Computer Science graduate. I build production AI systems and software, with a creative technologist's eye for how they look and feel.`,
    action: "Explore my experience", href: "#experience",
    start: 2.9, end: 4.95, jump: 3.75, side: "left",
  },
  {
    id: "studio", number: "02", label: "The studio", title: "Ming Creatives.",
    body: "My creative studio for immersive websites, business apps, 3D animation, and generative-AI production. Designed, built, and shipped end to end.",
    action: "Discover the collections", href: "#showcase",
    start: 5.05, end: 6.35, jump: 5.65, side: "right",
  },
  {
    id: "ai", number: "03", label: "Production AI", title: "Built for real work.",
    body: SITE.introduction,
    action: "Explore AI Products", href: "#ai-systems",
    start: 7.35, end: 10.55, jump: 8.9, side: "left",
  },
  {
    id: "explore", number: "04", label: "Explore", title: "Choose your next chapter.",
    body: "Explore my engineering work, step inside the studio, or tell me what you want to build.",
    action: "Start a conversation", href: "#contact",
    start: 12.95, end: 15.5, jump: 14.2, side: "index",
  },
] as const;

export const HERO_DESTINATIONS = [
  { label: "Collections", href: "#showcase", detail: "Visual work" },
  { label: "Services", href: "#services", detail: "Work with the studio" },
  { label: "AI Products", href: "#ai-systems", detail: "Systems & software" },
  { label: "Experience", href: "#experience", detail: "Background & practice" },
  { label: "Side Project", href: "#side-project", detail: "Earlier experiments" },
] as const;

export function chapterOpacity(time: number, start: number, end: number) {
  const fade = 0.22;
  return Math.max(0, Math.min(1, (time - start) / fade, (end - time) / fade));
}
