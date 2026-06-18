"use client";

import { useEffect, useMemo, useRef } from "react";
import { FIELD, TILE_COUNT, hash01, hashCycle, tileSrc } from "@/lib/showcase";

const TWO_PI = Math.PI * 2;
/** Golden angle (~137.508°) — phyllotaxis spacing for balanced angular spread. */
const GOLDEN = 2.399963;

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
 *   • burst — emerges from center at a VARIED intrinsic size (layered depth),
 *             drifts outward, and gently scales up ~1.2× in the second half
 *             of travel, then exits the frame (no exit fade — just moves out).
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
  // loop uses. `offset` staggers cycle boundaries on an EVEN grid (one card
  // per 1/N slot, lightly jittered) so the field stays continuously filled:
  // each new card spawns to replace one already on its way out — never in
  // lockstep, never leaving empty gaps. Angle / scale / rotation re-randomise
  // per cycle in the loop via hashCycle (see frame()).
  const cards = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => {
        const burst = hash01(i, 911.3) < FIELD.BURST_FRACTION;
        return {
          burst,
          speed: FIELD.BASE_SPEED * (burst ? FIELD.BURST_SPEED_MULT : 1),
          offset: (i + hash01(i, 17.1)) / N,
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

        // BASE tier direction: a golden-angle (phyllotaxis) base unique per
        // card index (~137.5° steps) plus small per-cycle jitter — the same
        // even full-circle spread the burst tier uses, so base cards fill ALL
        // angles (left/right/top/down) with no quadrant clustering and no two
        // cards on the same radial line. (The burst tier overrides `angle`/
        // `cos`/`sin` below.) Rotation is fixed per cycle; opacity is 0 at both
        // cycle boundaries, so the per-cycle jitter snap is never seen.
        const angle =
          ((i * GOLDEN) % TWO_PI) +
          (hashCycle(i, cycle, 1) * 2 - 1) * FIELD.BASE_ANGLE_JITTER;
        const rotation = (hashCycle(i, cycle, 4) * 2 - 1) * FIELD.ROTATE_MAX;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        let scale: number;
        let x: number;
        let y: number;
        let opacity: number;

        if (c.burst) {
          // Foreground: emerges from center, drifts outward. Each card spawns
          // at a VARIED intrinsic size (layered depth) and holds it, then
          // gently scales up ~1.2× in the second half of travel so it exits as
          // a slightly scaled-up picture.
          //
          // Angle: golden-angle (phyllotaxis) base unique per card index
          // (~137.5° steps) plus small per-cycle jitter — spreads bursts around
          // the FULL circle so two simultaneously-visible bursts never share a
          // radial line. (Base & burst are disjoint index sets, so their golden
          // angles don't coincide either.)
          const baseAngle = (i * GOLDEN) % TWO_PI;
          const angle =
            baseAngle +
            (hashCycle(i, cycle, 1) * 2 - 1) * FIELD.BURST_ANGLE_JITTER;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);

          // VARIED intrinsic size per card/cycle → layered depth
          // (small/background to large/foreground). No perspective projection,
          // so this IS the visible card size.
          const size0 = lerp(
            FIELD.BURST_SCALE_MIN,
            FIELD.BURST_SCALE_MAX,
            hashCycle(i, cycle, 3),
          );
          // Spawn near center, travel outward to off-screen.
          const startRadius = lerp(
            FIELD.BURST_START_MIN_VMAX,
            FIELD.BURST_START_MAX_VMAX,
            hashCycle(i, cycle, 2),
          );
          const radius = lerp(startRadius, FIELD.BURST_END_VMAX, phase) * vmaxPx;
          // Gentle 1.2× scale-up, only in the second half of travel — each
          // card exits scaled up relative to its OWN initial size (variety
          // preserved, not a uniform growth curve).
          const bump = smoothstep(FIELD.BURST_BUMP_START, 1, phase);
          scale = size0 * lerp(1, FIELD.BURST_SCALE_END_MULT, bump);
          x = cos * radius;
          y = sin * radius;
          // Duty gate: only emit on a per-cycle subset of cycles so the burst
          // stream thins out and adjacent bursts rarely co-emit (kills the
          // 0.2–0.3s same-trajectory follow). Off-duty cycles stay invisible.
          const onDuty = hashCycle(i, cycle, 7) < FIELD.BURST_DUTY;
          // No pass-by lens anymore: bursts fade IN at center, then travel out
          // at full opacity and exit the frame (fully off-screen before the
          // cycle wraps → "just moves out", no exit fade).
          opacity = onDuty ? fadeIn(phase) : 0;
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
          // Fade out as the card travels outward: a slow quadratic ease-in
          // that starts at BASE_FADE_START and reaches exactly 0 at phase 1
          // (= BASE_END_VMAX = off-screen), so the card dims gradually on its
          // way out and is fully gone the instant it leaves the viewport.
          const fadeT = clamp01(
            (phase - FIELD.BASE_FADE_START) / (1 - FIELD.BASE_FADE_START),
          );
          opacity = fadeIn(phase) * (1 - fadeT * fadeT);
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
