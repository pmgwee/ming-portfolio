/* ------------------------------------------------------------------ */
/*  Showcase — Image fly-through → fullscreen video reveal             */
/*  All tunable constants live here (mirrors src/lib/hero.ts).         */
/* ------------------------------------------------------------------ */

/**
 * Heavy media (image-field tiles + carousel clips) is no longer hardcoded by
 * filename. It is listed live from S3 at runtime via the `/api/media` route
 * ([src/app/api/media/route.ts](src/app/api/media/route.ts)) and resolved by
 * the components below, so dropping a new batch into the relevant S3 folder
 * (`temp_pictures/`, `video1/`, `video2/`, …) is picked up with no code change.
 */

/* ------------------------------------------------------------------ */
/*  Carousel slides (Layer 3) — the full-bleed clips, in order          */
/* ------------------------------------------------------------------ */
/**
 * Optional overlay UI (requirement F) per slide — DEFERRED for now. The shape
 * is kept so a slide can later opt into a headline + typewriter prompt bar
 * without touching the component wiring.
 */
export type ShowcaseOverlay = {
  headline: string;
  prompts: string[];
};

export type ShowcaseSlide = {
  /**
   * S3 folder (e.g. "video1") whose CURRENT clip plays for this slide. The file
   * URL is resolved at runtime from /api/media (newest clip in the folder), so
   * replacing the clip in that folder needs no code change. Two slides may share
   * a folder (the same clip plays in both).
   */
  folder: string;
  /** Short state/name label shown on the hover mini-preview chip. */
  label: string;
  /** Per-slide overlay (F). Undefined = no overlay on this slide. */
  overlay?: ShowcaseOverlay;
};

/**
 * The carousel, in display order. Each slide names the S3 FOLDER its clip lives
 * in; /api/media resolves that to the folder's current clip at runtime. To swap
 * a clip, drop a new file into that folder on S3 (no code change). To add a
 * slide, add an entry here — its folder is listed automatically.
 * (video2 is reused for slides 0 and 2, so the same clip plays in both.)
 */
export const SHOWCASE_VIDEOS: ShowcaseSlide[] = [
  { folder: "video2", label: "Flow State" },
  { folder: "video1", label: "Deep Focus" },
  { folder: "video2", label: "Momentum" },
];

/* ------------------------------------------------------------------ */
/*  Scroll-progress phase ranges (p = 0 settled → 1 video full-bleed)  */
/*  Tweens are placed on a normalised (duration = 1) GSAP timeline so   */
/*  these fractions equal absolute timeline positions.                  */
/* ------------------------------------------------------------------ */
export const PHASES = {
  /** Image field ramps from half-opacity (entry) to full by this progress. */
  dimRampEnd: 0.2,
  fieldStart: 0.1,
  fieldEnd: 0.62,
  hingeStart: 0.62,
  hingeEnd: 0.72,
  /**
   * Single continuous reveal: the panel rises + scales + un-rounds to full
   * bleed in one expo-out motion (replaces the old slide+expand split). Set
   * the panel above the nav at revealStart; controls fade in over its tail.
   */
  revealStart: 0.62,
  revealEnd: 0.92,
  controlsStart: 0.86,
  controlsEnd: 1.0,
  /** Progress past which the stage is "settled" → interactivity is enabled. */
  settledAt: 0.92,
} as const;

/* ------------------------------------------------------------------ */
/*  Reveal / hover / parallax / carousel tunables                       */
/*  (mirrored into the VideoStage CONFIG block for at-a-glance tuning)   */
/* ------------------------------------------------------------------ */

/** Transform-only full-bleed reveal of the video panel. */
export const REVEAL = {
  /** Uniform start scale of the centered cinematic card before it fills. */
  START_SCALE: 0.62,
  /** Corner radius (px) of the card at the start of the reveal → 0 at full. */
  START_RADIUS_PX: 16,
} as const;

/** Edge hover-zones → translate-away + mini-preview reveal. */
export const HOVER = {
  /** Width of each edge hover-zone as a fraction of viewport width. */
  ZONE_PCT: 0.12,
  /** How far the active video slides away from a hovered edge (px). */
  TRANSLATE_PX: 48,
  /** Active video scale while a zone is hovered. */
  SCALE: 0.92,
  /** Ease time constant (ms) for the hover settle (used by the lerp loop). */
  EASE_MS: 400,
  /** Mini-preview dimensions / radius (px). */
  PREVIEW_W: 220,
  PREVIEW_H: 300,
  PREVIEW_RADIUS: 12,
} as const;

/** Subtle magnetic cursor parallax on the active video. */
export const PARALLAX = {
  /** Max horizontal / vertical displacement (px) at the screen edges. */
  MAX_X: 10,
  MAX_Y: 6,
  /** Lerp factor toward the target each frame (lower = smoother/slower). */
  LERP: 0.08,
} as const;

/** Carousel crossfade between active clips. */
export const CAROUSEL = {
  CROSSFADE_MS: 500,
} as const;

/* ------------------------------------------------------------------ */
/*  Image-field (Layer 1) tuning — organic radial-burst emitter         */
/* ------------------------------------------------------------------ */
/*  Velocity-driven: a single `advance` accumulator grows every second      */
/*  every second — at FLOW_SPEED when idle, boosted by live scroll speed. Each */
/*  card cycles repeatedly; on every cycle boundary it RE-RANDOMISES its */
/*  angle/scale/rotation via hashCycle(i, cycle) for independent organic */
/*  paths. Two tiers behave differently:                                 */
/*   • base  — evenly spread around ALL angles (golden-angle per tier),   */
/*             holds a varied size then grows in the 2nd half, fades out.  */
/*   • burst — emerges from center at a VARIED size, drifts outward, and  */
/*             gently scales up ~1.2× in the second half of its travel.   */
export const FIELD = {
  /** Card-pool size — desktop / mobile. */
  N_DESKTOP: 24,
  N_MOBILE: 12,
  /**
   * IDLE advance rate per second — the field's drift pace when the user is
   * NOT scrolling. Scrolling boosts this via SCROLL_VEL_GAIN (below). At idle
   * a base card takes ~24s to drift across and fade (burst ~5s).
   */
  FLOW_SPEED: 0.06,
  /** How much one unit of `advance` moves a BASE card through its cycle. */
  BASE_SPEED: 0.7,
  /**
   * Burst cards advance this much faster than base cards. This gap alone sets
   * how many bursts pass per base lifetime (~4–5), independent of FLOW_SPEED.
   */
  BURST_SPEED_MULT: 4.5,
  /**
   * Velocity coupling: scroll speed (px/s, magnitude — either direction) adds
   * this much per px/s to the advance rate on top of FLOW_SPEED. The field
   * therefore drifts slowly when idle and accelerates with scroll activity,
   * easing back to the idle drift ~150 ms after scrolling stops. ~0.0002 → a
   * 1000 px/s scroll roughly quadruples the pace.
   */
  SCROLL_VEL_GAIN: 0.0002,
  /** Cap on the scroll boost (added advance-rate) so frantic scrolling can't overclock the field. */
  SCROLL_BOOST_MAX: 0.5,
  /** Fraction of the pool assigned to the fast "burst" tier. */
  BURST_FRACTION: 0.5,
  /** Base card size (CSS vw); height via aspect-ratio in the component. */
  CARD_W_VW: 14,
  /**
   * Per-cycle angular jitter (radians, ±) layered on each BASE card's
   * golden-angle base angle — same idea as BURST_ANGLE_JITTER. ~0.18 rad ≈
   * ±10°; small enough that the golden spacing dominates (no two cards share
   * a radial line), large enough to stay organic.
   */
  BASE_ANGLE_JITTER: 0.18,
  /** Phase slice over which any freshly-spawned card fades in from nothing. */
  FADE_IN_PHASE: 0.1,
  /** Max fixed per-card rotateZ (degrees, ±). */
  ROTATE_MAX: 1,

  /* --- Burst tier — center-spawn outward drift ----------------------- */
  /**
   * Varied INTRINSIC spawn-size band (no perspective projection anymore, so
   * this IS the visible card size). A wide 0.6→1.5 range gives the layered
   * depth (small/background to large/foreground) of a scattered field.
   */
  BURST_SCALE_MIN: 0.4,
  BURST_SCALE_MAX: 0.8,
  /**
   * Per-cycle angular jitter (radians, ±) layered on top of each burst card's
   * golden-angle base angle. Small enough that the ~137.5° golden spacing
   * dominates (so two bursts never share a radial line), large enough to
   * avoid mechanical precision. ~0.18 rad ≈ ±10°.
   */
  BURST_ANGLE_JITTER: 0.18,
  /**
   * Fraction of cycles in which a given burst card is allowed to be visible
   * (duty gate). <1 thins the burst stream so adjacent bursts rarely co-emit,
   * giving the field breathing room instead of a steady pile-up.
   */
  BURST_DUTY: 0.9,
  /** Spawn radius band (CSS vmax) — near center, where bursts emerge from. */
  BURST_START_MIN_VMAX: 3,
  BURST_START_MAX_VMAX: 10,
  /** Radius (CSS vmax) a burst card reaches at the end of its travel (off-screen). */
  BURST_END_VMAX: 100,
  /**
   * Phase at which the gentle scale-up begins ramping (smoothstep → 1 at
   * phase 1). Halfway, per spec — cards hold their varied size, then grow in
   * the second half of travel so they exit as slightly scaled-up pictures.
   */
  BURST_BUMP_START: 0.02,
  /** Scale-up cap applied over the second half of travel (1.2×, per spec). */
  BURST_SCALE_END_MULT: 1.9,

  /* --- Base tier — center-spawn outward drift, grows in 2nd half ------ */
  /** Varied INTRINSIC size band — each card holds its own size, like burst. */
  BASE_CARD_SCALE_MIN: 0.4,
  BASE_CARD_SCALE_MAX: 1,
  /** Scale-up a base card reaches by the end of travel (exits scaled-up). */
  BASE_SCALE_END_MULT: 2.3,
  /**
   * Phase at which the scale-up begins (smoothstep → 1 at exit). Second half
   * (0.5): the card holds its varied size through the first half, then grows
   * so it exits as a slightly scaled-up picture — same shape as the burst tier.
   */
  BASE_BUMP_START: 0.01,
  /**
   * Spawn radius (CSS vmax). Base cards originate at the very CENTER (0,0) and
   * fan outward along their golden angle — set both to 0 for a pure center
   * spawn, or nudge MAX up slightly to spread the emergence ring a little.
   */
  BASE_START_MIN_VMAX: 0,
  BASE_START_MAX_VMAX: 5,
  /** Radius (CSS vmax) a base card reaches at the end of its travel (off-screen). */
  BASE_END_VMAX: 100,
  /**
   * Phase at which the trailing fade-out begins ramping (quadratic ease-in),
   * reaching exactly 0 at phase 1 (= BASE_END_VMAX = off-screen). Larger =
   * later/harder, smaller = earlier/softer. The base card thus fades slowly
   * as it travels out and is fully gone the moment it leaves the screen.
   */
  BASE_FADE_START: 0.4,
} as const;

/** Outer Stage scroll length (CSS vh) — sets total scrub distance. */
export const STAGE_VH = 320;

/** A deterministic ±JITTER offset for card `i` (stable across renders). */
export function jitterFor(i: number): number {
  // Cheap hash → [-1, 1), no Math.random so SSR/hydration stay consistent.
  const s = Math.sin(i * 127.1) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
}

/**
 * A deterministic [0, 1) hash for card `i` under a `salt` (SSR-safe, no
 * Math.random). Use distinct salts to decorrelate per-card attributes
 * (base scale, world radius, rotation) so they don't all move in lockstep.
 */
export function hash01(i: number, salt: number): number {
  const s = Math.sin((i + 1) * salt) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * A deterministic [0, 1) hash over a card index `i` AND its cycle number `k`
 * (which may be negative when scrolling back), salted to decorrelate the
 * per-cycle attributes (angle / spread / scale / rotation). Same `(i, k)` →
 * same value every time, so trajectories reproduce exactly on scroll-rewind.
 */
export function hashCycle(i: number, k: number, salt: number): number {
  const s = Math.sin(i * 374.7 + k * 92.13 + salt * 57.31) * 43758.5453;
  return s - Math.floor(s);
}
