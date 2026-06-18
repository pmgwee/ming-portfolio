"use client";

import { useEffect, useMemo, useRef } from "react";
import { FIELD, TILE_COUNT, hash01, hashCycle, tileSrc } from "@/lib/showcase";

const TWO_PI = Math.PI * 2;
const HALF_PI = Math.PI / 2;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/**
 * Layer 1 — the organic radial-burst image emitter.
 *
 * Runs its OWN rAF loop, driven by TIME (not scroll): a single accumulator
 * grows at FLOW_SPEED every frame, so the field flows continuously and never
 * rewinds. Scroll only dims/brightens the whole layer (the parent's entry-dim
 * ramp on `fieldWrapRef`), it does not move the cards.
 *
 * Each card cycles repeatedly; on every cycle boundary it RE-RANDOMISES its
 * angle/scale/rotation via hashCycle(i, cycle), so paths look independent and
 * organic. Two tiers behave differently:
 *   • base  — drifts outward at constant speed and near-constant size, with a
 *             slight bump just before it reaches the edge and fades.
 *   • burst — perspective fly-through: spawns small near center, scales up
 *             dramatically while translating, then passes the lens and fades.
 *
 * Transforms are written straight to DOM refs (no per-frame React state),
 * matching the Hero's hot-path pattern. The parent also fades the whole layer
 * out via the `fieldWrapRef` opacity on the hinge.
 *
 * Under prefers-reduced-motion we render a calm static cluster and never start
 * the loop.
 */
export function ImageField({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  // Pool size depends on viewport (set once on mount).
  const isMobile =
    typeof window !== "undefined" && window.innerWidth <= 768;
  const N = isMobile ? FIELD.N_MOBILE : FIELD.N_DESKTOP;

  // Per-card identity — stable for the life of the pool. A card's tier sets
  // its cycle speed (burst = faster → parallax) and which motion model the
  // loop uses; the offset staggers cycle boundaries so cards never spawn in
  // lockstep. The angle / scale / rotation / spread re-randomise per cycle in
  // the loop via hashCycle (see frame()).
  const cards = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => {
        const burst = hash01(i, 911.3) < FIELD.BURST_FRACTION;
        return {
          burst,
          speed: FIELD.BASE_SPEED * (burst ? FIELD.BURST_SPEED_MULT : 1),
          offset: hash01(i, 17.1),
        };
      }),
    [N],
  );

  useEffect(() => {
    if (reducedMotion) return;

    let rafId = 0;
    let last = performance.now();
    let advance = 0;
    let running = true;

    // 1 CSS vmax in px — cached here, refreshed on resize (cheap to multiply).
    let vmaxPx = Math.max(window.innerWidth, window.innerHeight) / 100;
    const onResize = () => {
      vmaxPx = Math.max(window.innerWidth, window.innerHeight) / 100;
    };
    window.addEventListener("resize", onResize);

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); // clamp big tab-switch gaps
      last = now;

      // Time-driven: the field flows on its own and never rewinds. Scroll does
      // not touch `advance` — it only dims the layer (parent's entry-dim ramp).
      advance += FIELD.FLOW_SPEED * dt;

      const fadeIn = (phase: number) => clamp01(phase / FIELD.FADE_IN_PHASE);

      for (let i = 0; i < N; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const c = cards[i];

        // A card's life is a chain of cycles. `cycle` (integer) selects which
        // spawn-instance it is; `phase` (0 spawn → 1 exit) is progress within.
        const phaseGlobal = advance * c.speed + c.offset;
        const cycle = Math.floor(phaseGlobal);
        const phase = phaseGlobal - cycle;

        // Shared per-cycle params: a rotating quadrant keeps angles balanced
        // across the screen, with random jitter inside it; rotation is fixed
        // for the cycle. (Opacity is 0 at both cycle boundaries, so the
        // per-cycle param snap is never seen.)
        const quadrant = ((i + cycle) % 4 + 4) % 4;
        const angle =
          (quadrant + hashCycle(i, cycle, 1) * FIELD.QUAD_JITTER) * HALF_PI;
        const rotation = (hashCycle(i, cycle, 4) * 2 - 1) * FIELD.ROTATE_MAX;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        let scale: number;
        let x: number;
        let y: number;
        let opacity: number;

        if (c.burst) {
          // Foreground: perspective fly-through. One hyperbolic factor drives
          // scale AND drift, so both rush together as the card nears the lens.
          const burstScale = lerp(
            FIELD.BURST_SCALE_MIN,
            FIELD.BURST_SCALE_MAX,
            hashCycle(i, cycle, 3),
          );
          const spread = lerp(
            FIELD.BURST_SPREAD_MIN_VMAX,
            FIELD.BURST_SPREAD_MAX_VMAX,
            hashCycle(i, cycle, 2),
          );
          const z = lerp(FIELD.Z_FAR, FIELD.Z_NEAR, phase);
          const proj = FIELD.FOCAL / z;
          scale = proj * burstScale;
          x = cos * spread * vmaxPx * proj;
          y = sin * spread * vmaxPx * proj;
          // Fade out as it passes the lens (driven by scale → coincides with
          // it filling the frame).
          opacity =
            fadeIn(phase) *
            clamp01((FIELD.PASS_BY_SCALE - scale) / FIELD.PASS_BY_FADE_BAND);
        } else {
          // Midground: steady linear drift outward at near-constant size, with
          // a slight bump just before it reaches the edge and fades.
          const startRadius = lerp(
            FIELD.BASE_START_MIN_VMAX,
            FIELD.BASE_START_MAX_VMAX,
            hashCycle(i, cycle, 2),
          );
          const radius = lerp(startRadius, FIELD.BASE_END_VMAX, phase) * vmaxPx;
          const cardScale = lerp(
            FIELD.BASE_CARD_SCALE_MIN,
            FIELD.BASE_CARD_SCALE_MAX,
            hashCycle(i, cycle, 3),
          );
          const bump = smoothstep(FIELD.BASE_BUMP_START, 1, phase);
          scale = cardScale * lerp(1, FIELD.BASE_SCALE_END_MULT, bump);
          x = cos * radius;
          y = sin * radius;
          // Fade out by phase as it reaches the edge (scale never crosses the
          // pass-by threshold, so opacity is keyed to travel progress).
          opacity =
            fadeIn(phase) *
            clamp01((1 - phase) / FIELD.BASE_FADE_OUT_PHASE);
        }

        el.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${scale}) rotate(${rotation}deg)`;
        el.style.opacity = String(opacity);
        // Larger cards sort on top → growing burst cards rise above the
        // calmer base drifters.
        el.style.zIndex = String(Math.round(scale * 20));
      }

      if (running) rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    // Pause the loop (and the idle drift's battery drain) when off-screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          last = performance.now(); // avoid a huge dt jump on resume
          rafId = requestAnimationFrame(frame);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0 },
    );
    if (rootRef.current) io.observe(rootRef.current);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [reducedMotion, N, cards]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 z-10"
      aria-hidden
    >
      {reducedMotion ? (
        /* Static calm cluster — a few tiles arranged around center. */
        <div className="absolute inset-0">
          {Array.from({ length: 7 }).map((_, i) => {
            const angle = (i / 7) * TWO_PI;
            const r = 26; // vmin
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 overflow-hidden rounded-2xl border border-white/10 opacity-30"
                style={{
                  width: `${FIELD.CARD_W_VW}vw`,
                  aspectRatio: "3 / 4",
                  transform: `translate(calc(-50% + ${x}vmin), calc(-50% + ${y}vmin)) scale(0.9)`,
                  boxShadow: "var(--card-shadow)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tileSrc((i % TILE_COUNT) + 1)}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      ) : (
        Array.from({ length: N }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 overflow-hidden rounded-2xl border border-white/10"
            style={{
              width: `${FIELD.CARD_W_VW}vw`,
              aspectRatio: "3 / 4",
              opacity: 0,
              willChange: "transform, opacity",
              // Deep-z spawn placeholder (opacity 0); the rAF loop takes over
              // on the first frame after mount.
              transform: "translate3d(-50%, -50%, 0) scale(0.12)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tileSrc((i % TILE_COUNT) + 1)}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              draggable={false}
            />
          </div>
        ))
      )}
    </div>
  );
}
