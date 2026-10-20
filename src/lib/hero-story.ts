import { SITE } from "./seo";

/** Versioned review assets, independent of the old S3 frame sequence. */
export const HERO_FILM = {
  desktop: "/hero/studio-journey-v2/film-1080.mp4",
  mobile: "/hero/studio-journey-v2/film-720.mp4",
  poster: "/hero/studio-journey-v2/opening.webp",
  ending: "/hero/studio-journey-v2/ending.webp",
  duration: 15,
} as const;

export const HERO_CHAPTERS = [
  {
    id: "about", number: "01", label: "About me", title: "About me.",
    body: `I'm ${SITE.personName}, a Malaysian Computer Science graduate. I build production AI systems and software, with a creative technologist's eye for how they look and feel.`,
    action: "Explore my experience", href: "/experiences",
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
    action: "Explore AI Projects", href: "/ai-projects",
    start: 7.35, end: 10.55, jump: 8.9, side: "left",
  },
  {
    id: "explore", number: "04", label: "Explore", title: "Choose your next chapter.",
    body: "Explore my engineering work, step inside the studio, or tell me what you want to build.",
    action: "Start a conversation", href: "#contact",
    start: 13.4, end: 15.5, jump: 14.2, side: "index",
  },
] as const;

export const HERO_DESTINATIONS = [
  { label: "Studio", href: "#showcase", detail: "Visual work" },
  { label: "Services", href: "#services", detail: "Work with the studio" },
  { label: "AI Projects", href: "/ai-projects", detail: "Systems & software" },
  { label: "Experiences", href: "/experiences", detail: "Background & practice" },
  { label: "Side Projects", href: "/side-projects", detail: "Earlier experiments" },
] as const;

/**
 * Film time → share of the hero's scroll travel, interpolated linearly between
 * keyframes (user request, 17 Oct 2026). The curtain/opening (0–2.5s) takes about
 * half its former scroll; the glass "ming" lettering forming (12.2–13.4s) takes
 * about 1.6x, before 04 Explore appears. Everything between keeps roughly the
 * previous rate, so section heights and Lenis settings stay unchanged.
 */
export const HERO_PACING = [
  [0, 0],
  [2.5, 0.085],
  [12.2, 0.759],
  [13.4, 0.889],
  [15, 1],
] as const;

export function filmTimeAt(progress: number) {
  const p = Math.min(1, Math.max(0, progress));
  for (let i = 1; i < HERO_PACING.length; i++) {
    const [t0, p0] = HERO_PACING[i - 1];
    const [t1, p1] = HERO_PACING[i];
    if (p <= p1) return t0 + (t1 - t0) * ((p - p0) / (p1 - p0));
  }
  return HERO_FILM.duration;
}

export function progressAt(time: number) {
  const t = Math.min(HERO_FILM.duration, Math.max(0, time));
  for (let i = 1; i < HERO_PACING.length; i++) {
    const [t0, p0] = HERO_PACING[i - 1];
    const [t1, p1] = HERO_PACING[i];
    if (t <= t1) return p0 + (p1 - p0) * ((t - t0) / (t1 - t0));
  }
  return 1;
}

/** Chapter shown on the timeline for a film time ("Prologue" before 01). */
export function chapterLabelAt(time: number) {
  const chapter = [...HERO_CHAPTERS].reverse().find((item) => time >= item.start);
  return chapter ? `${chapter.number} · ${chapter.label}` : "Prologue";
}

export function chapterOpacity(time: number, start: number, end: number) {
  const fade = 0.22;
  return Math.max(0, Math.min(1, (time - start) / fade, (end - time) / fade));
}
