import { mediaUrl } from "./media";

/* The scrubbed sequence — every frame of the source video (1920×1080).
   MUST equal the number of frame_XXXX.jpg files in S3 (frame_0001 … frame_0169). */
export const FRAME_COUNT = 169;

/* Frame URLs are fixed (frame_0001…), and the JPGs are uploaded `immutable`, so a
   browser that cached them won't re-fetch for a year — re-uploading frames in
   place (even with a CloudFront invalidation) never reaches returning visitors.
   So we version the PATH instead: bump this and upload the new sequence to
   s3://…/frames/<this>/. A new path = a brand-new URL = everyone fetches the new
   frames immediately, with no invalidation and no stale cache. */
export const FRAMES_VERSION = "v1";

export const frameSrc = (i: number) =>
  mediaUrl(`/frames/${FRAMES_VERSION}/frame_${String(i).padStart(4, "0")}.jpg`);

export const HERO_TEXT_FADE_END = 0.08;

export type Annotation = {
  id: string;
  show: number;
  hide: number;
  eyebrow: string;
  title: string;
  body: string;
  position?: "left" | "center" | "right";
};

// Keep the production hero's three scroll beats and timing, with current copy.
export const ANNOTATIONS: Annotation[] = [
  {
    id: "systems",
    show: 0.1,
    hide: 0.3,
    eyebrow: "01 — Production systems",
    title: "Beyond the prototype.",
    body: "Agentic workflows and software designed to keep working after launch.",
  },
  {
    id: "craft",
    show: 0.38,
    hide: 0.58,
    eyebrow: "02 — The craft",
    title: "Engineering meets imagination.",
    body: "Computer Science foundations with a creative technologist's visual instinct.",
    position: "right",
  },
  {
    id: "paths",
    show: 0.66,
    hide: 0.86,
    eyebrow: "03 — Explore",
    title: "One person. Two paths.",
    body: "Explore my AI systems and experience, or discover Ming Creatives' studio work.",
    position: "center",
  },
];
