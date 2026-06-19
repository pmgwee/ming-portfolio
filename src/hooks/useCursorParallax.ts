"use client";

import { useEffect, useRef } from "react";

/**
 * Smoothed transform driver for the full-bleed video.
 *
 * Composes two sources into ONE transform on `targetRef` (so GSAP — which owns
 * the OUTER panel's reveal transform — and this never fight):
 *   • magnetic cursor parallax — the video drifts a few px toward the inverse
 *     of the cursor (mapped from screen-center offset to ±maxX / ±maxY),
 *   • hover offset — the translateX / scale supplied by the edge hover-zones.
 *
 * Everything is lerped in a single rAF for spring/ease-out smoothness. The loop
 * only runs while `enabled` (settled, non-touch, motion allowed); when disabled
 * it eases back to rest and then stops. Pointer listener is cleaned up on
 * unmount / disable.
 */
export function useCursorParallax({
  targetRef,
  enabled,
  hoverOffsetRef,
  maxX,
  maxY,
  lerp,
}: {
  /** Element to transform (the inner media wrapper). */
  targetRef: React.RefObject<HTMLElement | null>;
  /** Run parallax only when true (settled && !touch && !reduced-motion). */
  enabled: boolean;
  /** Live hover target: translateX (px) + uniform scale, driven by zones. */
  hoverOffsetRef: React.RefObject<{ x: number; scale: number }>;
  maxX: number;
  maxY: number;
  lerp: number;
}) {
  // Mutable animation state kept out of React to avoid per-frame re-renders.
  const targetPRef = useRef({ x: 0, y: 0 }); // parallax target (px)
  const curRef = useRef({ px: 0, py: 0, hx: 0, hs: 1 }); // current (lerped)
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    // When disabled, aim everything at rest; the loop below eases there then
    // stops. Hover offset is read live from the ref each frame regardless.
    if (!enabled) targetPRef.current = { x: 0, y: 0 };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1; // [-1, 1]
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      // Inverse of cursor (magnetic): move away from the pointer.
      targetPRef.current = { x: -nx * maxX, y: -ny * maxY };
    };

    if (enabled) window.addEventListener("pointermove", onPointerMove);

    const REST_EPS = 0.05;
    const tick = () => {
      const cur = curRef.current;
      const tp = targetPRef.current;
      const hov = hoverOffsetRef.current ?? { x: 0, scale: 1 };
      const tHx = enabled ? hov.x : 0;
      const tHs = enabled ? hov.scale : 1;

      cur.px += (tp.x - cur.px) * lerp;
      cur.py += (tp.y - cur.py) * lerp;
      // Hover eases a touch faster than parallax for a snappier translate-away.
      cur.hx += (tHx - cur.hx) * Math.min(1, lerp * 2.5);
      cur.hs += (tHs - cur.hs) * Math.min(1, lerp * 2.5);

      el.style.transform = `translate3d(${(cur.px + cur.hx).toFixed(2)}px, ${cur.py.toFixed(2)}px, 0) scale(${cur.hs.toFixed(4)})`;

      const atRest =
        !enabled &&
        Math.abs(cur.px) < REST_EPS &&
        Math.abs(cur.py) < REST_EPS &&
        Math.abs(cur.hx) < REST_EPS &&
        Math.abs(cur.hs - 1) < REST_EPS / 100;

      if (atRest) {
        el.style.transform = "translate3d(0,0,0) scale(1)";
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [targetRef, enabled, hoverOffsetRef, maxX, maxY, lerp]);
}
