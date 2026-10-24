/**
 * Studio (services) section: sky palettes, prism-light cursor tuning, and the
 * chat tour's sample briefs. Copy for the services themselves lives in
 * `SITE.services` (seo.ts).
 */

export type SkyInk = "dark" | "light";

export type SkyPalette = {
  id: string;
  name: string;
  /** Text/button scheme for the sky: dark ink on light skies, light on deep ones. */
  ink: SkyInk;
  /** Top-to-bottom wash. Always ends in the page black so the window lands on it. */
  wash: string;
  /** Three drifting light pools: top-left, top-right, and a centre band. */
  pools: [string, string, string];
};

// Candidate skies. `DEFAULT_SKY` is the live one; preview the others with
// `?sky=<id>`, which also shows a picker.
// The first four are sapphire variants: lighter than Royal sapphire, with more
// tonal bands between the bright top and the black floor.
export const SKIES: readonly SkyPalette[] = [
  {
    id: "sapphire-glow",
    name: "Sapphire glow",
    ink: "light",
    wash: "linear-gradient(180deg, #5a80ff 0%, #4470fb 14%, #3460ee 28%, #2a50d8 42%, #2443b8 54%, #1b3290 66%, #10205e 78%, #0a1233 89%, #07080c 97%)",
    pools: ["#9ab8ff", "#c6d4ff", "#1c38b8"],
  },
  {
    id: "prism-sapphire",
    name: "Prism sapphire",
    ink: "light",
    wash: "linear-gradient(180deg, #5277ff 0%, #3f67f6 16%, #3157e4 32%, #2848c9 46%, #2139a6 58%, #192c80 70%, #0f1b52 82%, #090e2a 91%, #07080c 97%)",
    pools: ["#7cc8ff", "#a996ff", "#2446d4"],
  },
  {
    id: "cloud-sapphire",
    name: "Cloud sapphire",
    ink: "light",
    wash: "linear-gradient(180deg, #7392ff 0%, #5c80fb 16%, #4a6ff2 30%, #3a5de0 44%, #2d4bc4 56%, #22399c 68%, #142468 80%, #0a1131 90%, #07080c 97%)",
    pools: ["#e1e8ff", "#c9c6f2", "#2f50d6"],
  },
  {
    // Lavender haze top-left, peach sunrise top-right, a violet-leaning middle,
    // then sapphire into night. Layered radial washes over a lighter base.
    id: "sapphire-sunrise",
    name: "Sapphire sunrise",
    ink: "dark",
    wash: [
      "radial-gradient(55% 32% at 14% 6%, rgba(205,190,255,0.55), transparent 72%)",
      "radial-gradient(48% 30% at 88% 4%, rgba(255,214,192,0.6), transparent 70%)",
      "radial-gradient(70% 26% at 62% 34%, rgba(176,160,255,0.35), transparent 75%)",
      "radial-gradient(60% 22% at 24% 50%, rgba(120,150,255,0.3), transparent 75%)",
      "linear-gradient(180deg, #7b97ff 0%, #6d89fb 10%, #6079f2 22%, #5669e6 34%, #5560d6 44%, #4f55c4 52%, #3f45a6 61%, #2d3184 70%, #1c1f5a 79%, #10122f 88%, #07080c 97%)",
    ].join(", "),
    pools: ["#c4b5ff", "#ffd6c2", "#8d8cf6"],
  },
  {
    id: "sapphire",
    name: "Royal sapphire",
    ink: "light",
    wash: "linear-gradient(180deg, #2f5bff 0%, #2448e0 22%, #1a36b8 42%, #11268a 60%, #0a185a 74%, #070d2c 86%, #07080c 96%)",
    pools: ["#5b86ff", "#1530c9", "#7aa2ff"],
  },
  {
    id: "ming-sky",
    name: "Ming sky",
    ink: "light",
    wash: "linear-gradient(180deg, #4d6fd6 0%, #6f8fe6 20%, #8ea3e3 38%, #5a6fc4 56%, #2b3a86 72%, #0e1435 86%, #07080c 96%)",
    pools: ["#c9c5ea", "#3f63d4", "#9db4f5"],
  },
  {
    id: "periwinkle",
    name: "Periwinkle",
    ink: "dark",
    wash: "linear-gradient(180deg, #e8ecff 0%, #b9c8ff 22%, #7d98fb 44%, #4f6ae8 60%, #24339c 74%, #0b1240 86%, #07080c 96%)",
    pools: ["#577bf4", "#a9bcff", "#6b77f7"],
  },
  {
    id: "glacier",
    name: "Glacier blue",
    ink: "dark",
    wash: "linear-gradient(180deg, #e4f3ff 0%, #b4dcff 20%, #74b4ff 40%, #3f86f5 56%, #1f55cf 70%, #0c2366 84%, #07080c 96%)",
    pools: ["#5aa8ff", "#d2ecff", "#2f6cf0"],
  },
];

/** Skies before this index are the current shortlist; the rest are earlier candidates. */
export const SKY_SHORTLIST = 4;

export const DEFAULT_SKY = "sapphire-sunrise";

export function skyById(id: string | null | undefined): SkyPalette {
  return SKIES.find((sky) => sky.id === id) ?? SKIES.find((sky) => sky.id === DEFAULT_SKY)!;
}

/**
 * Prism light, after the logo: white light enters a crystal and leaves as a
 * spectrum. The pointer is a soft light that reveals a hidden crystal lattice
 * in the sky, sensed more than seen. Distances in CSS px, times in seconds.
 */
export const PRISM = {
  /** Lattice spacing; alternate rows are offset, like a crystal. */
  CELL: 11,
  DOT: 2,
  /** Most a revealed dot ever shows. */
  ALPHA: 0.5,
  /** Light below this stays hidden. */
  LOW: 0.06,
  /** Light radius, from a slow drag to a fast flick: an area, not a line. */
  BRUSH_MIN: 70,
  BRUSH_MAX: 130,
  /** Light per stamp (stamps every ~7px of travel). */
  INK: 0.05,
  /** Light half-life once the pointer moves on. */
  FADE: 0.45,
  /** Red to violet, laid across the width of the path as the light fades. */
  SPECTRUM: ["255,96,96", "255,172,72", "255,230,96", "110,240,150", "90,190,255", "160,128,255"],
  /** Soft wash of light around the pointer itself. */
  GLOW_RADIUS: 170,
  GLOW_ALPHA: 0.07,
  /** Click: a ring of light ripples out through the lattice. */
  RIPPLE_LIFE: 1.1,
  RIPPLE_RADIUS: 220,
  /** A faint ghost light drifts across the sky after this long without input. */
  IDLE_AFTER: 2.4,
  GHOST: 0.45,
} as const;

/**
 * The spectrum leaving the crystal: one ray per service, in `SITE.services`
 * order. `rgb` feeds glows and translucent fills.
 */
export const SERVICE_RAYS = [
  { color: "#ffb86b", rgb: "255,184,107" },
  { color: "#5ee6d0", rgb: "94,230,208" },
  { color: "#c9a6ff", rgb: "201,166,255" },
] as const;

/**
 * Real work behind each service, in `SITE.services` order. The hero film is
 * AI-generated (see public/hero/studio-journey-v2/README.md); the agents and
 * the tracker are Ming's own products, shown from real screenshots.
 */
export const SERVICE_PROOF = [
  {
    anchor: "work-aigc",
    title: "Studio",
    caption: "The 15-second AI-generated film that opens this website.",
    link: { label: "Watch it at the top", href: "#top" },
  },
  {
    anchor: "work-agents",
    title: "AI & Data Consultant",
    image: "/project-previews/bersamaai-discord.webp",
    alt: "BersamaAi community bot posting a filtered industry update into a Discord channel",
    caption: "BersamaAi Community Agents: a Discord bot that filters online sources into topic channels and summarizes videos without captions.",
    link: { label: "Read the case study", href: "/work/bersamaai" },
  },
  {
    anchor: "work-web",
    title: "Solution Architect",
    image: "/project-previews/duitsini-dashboard-v2.webp",
    alt: "DuitSini dashboard showing live Claude and Codex usage limits beside a YouTube-synced music player",
    caption: "DuitSini: an LLM usage and finance tracker, with live agent limits for Claude and Codex at a glance.",
    link: { label: "View on GitHub", href: "https://github.com/pmgwee/DuitSini" },
  },
] as const;

/**
 * The AIGC film screened when the storyboard brief is picked: one continuous
 * AI-generated shot (9:16, 15s, with sound) of a man opening his front door
 * onto an upside-down world. Shot labels describe what is on screen; `at` is
 * where each storyboard beat starts, in seconds.
 */
export const AIGC_FILM = {
  title: "Through the Door",
  src: "/showcase-films/aigc/through-the-door.mp4",
  poster: "/showcase-films/aigc/poster.webp",
  duration: 15,
  shots: [
    { at: 0, label: "The hallway", frame: "/showcase-films/aigc/shot-1.webp" },
    { at: 1.6, label: "Hand on the latch", frame: "/showcase-films/aigc/shot-2.webp" },
    { at: 3.3, label: "The door opens", frame: "/showcase-films/aigc/shot-3.webp" },
    { at: 5.2, label: "A look back", frame: "/showcase-films/aigc/shot-4.webp" },
    { at: 7.2, label: "Step through", frame: "/showcase-films/aigc/shot-5.webp" },
    { at: 9.6, label: "Into the meadow", frame: "/showcase-films/aigc/shot-6.webp" },
  ],
} as const;

/** Sample briefs for the chat tour, one per service in `SITE.services` order. */
export const STUDIO_PROMPTS = [
  "Storyboard a 30-second AI TVC for our product launch",
  "Connect our business data to an AI agent the team can use",
  "Design a cinematic 3D website for our brand",
] as const;
