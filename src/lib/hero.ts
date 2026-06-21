import { mediaUrl } from "./media";

/* The scrubbed sequence — every frame of the source video (1920×1080).
   MUST equal the number of frame_XXXX.jpg files in S3 (frame_0001 … frame_0169). */
export const FRAME_COUNT = 169;

export const frameSrc = (i: number) =>
  mediaUrl(`/frames/frame_${String(i).padStart(4, "0")}.jpg`);

/* Hero text finishes fading out by this scroll progress (first 8%). */
export const HERO_TEXT_FADE_END = 0.08;

export type Annotation = {
  id: string;
  show: number;
  hide: number;
  eyebrow: string;
  title: string;
  body: string;
  /* Horizontal anchor within the hero — defaults to "left". */
  position?: "left" | "center" | "right";
};

/* Scroll-position zones where each annotation card is visible. */
export const ANNOTATIONS: Annotation[] = [
  {
    id: "intro",
    show: 0.1,
    hide: 0.3,
    eyebrow: "01 — Hello",
    title: "I design & build the web.",
    body: "Creative developer focused on cinematic, performant interfaces — where motion, 3D and engineering meet.",
  },
  {
    id: "skill",
    show: 0.38,
    hide: 0.58,
    eyebrow: "02 — Toolkit",
    title: "A full-stack toolkit.",
    body: "Next.js · React · TypeScript · WebGL · GSAP · Framer Motion. Pixel-precise UI, real-time graphics, and systems that scale.",
    position: "right",
  },
  {
    id: "work",
    show: 0.66,
    hide: 0.86,
    eyebrow: "03 — Selected work",
    title: "Things I've shipped.",
    body: "Interactive product sites, 3D scrollytelling, and design systems. Currently open to new roles — let's talk.",
    position: "center",
  },
];
