/* ------------------------------------------------------------------ */
/*  Showcase — Image fly-through → fullscreen video reveal             */
/*  All tunable constants live here (mirrors src/lib/hero.ts).         */
/* ------------------------------------------------------------------ */

/** Number of distinct tiles available in /public/temp_pictures. */
export const TILE_COUNT = 32;

/** Maps a 1-based tile index to its URL (tile-01.webp … tile-32.webp). */
export const tileSrc = (i: number) =>
  `/temp_pictures/tile-${String(i).padStart(2, "0")}.webp`;

/** The single clip that rises and expands to full-bleed. */
export const VIDEO_SRC =
  "/video2/v1_3D_Scrollytelling_Sequence_202606170015.mp4";

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
  slideStart: 0.72,
  slideEnd: 0.8,
  expandStart: 0.8,
  expandEnd: 0.95,
  controlsStart: 0.86,
  controlsEnd: 1.0,
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

/* ------------------------------------------------------------------ */
/*  Video panel (Layer 3) geometry                                     */
/* ------------------------------------------------------------------ */
export const PANEL = {
  WIDTH_VW_DESKTOP: 58,
  WIDTH_VW_MOBILE: 86,
  RADIUS_PX: 24,
  /** Resting height before full-bleed (CSS vh). */
  REST_HEIGHT_VH: 70,
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
