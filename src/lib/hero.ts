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
    eyebrow: "01 — Ming Creatives",
    title: "Your brand deserves this.",
    body: "This isn't a demo — it's the product. I build Awwwards-level 3D animated websites that make brands impossible to ignore.",
  },
  {
    id: "skill",
    show: 0.38,
    hide: 0.58,
    eyebrow: "02 — The craft",
    title: "Cinema meets engineering.",
    body: "The kind of website your visitors explore instead of skim — every movement deliberate, every detail obsessed over. No templates, no shortcuts.",
    position: "right",
  },
  {
    id: "work",
    show: 0.66,
    hide: 0.86,
    eyebrow: "03 — Let's build yours",
    title: "What should your website say?",
    body: "Portfolios, product launches, creative studios — I turn your vision into a site that stops the scroll. Let's talk.",
    position: "center",
  },
];
