"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Wraps the app in Lenis physics-based smooth scrolling.
 *
 * Lenis composes naturally with the Hero's native RAF scroll handler — it just
 * smooths the underlying scroll position, so `getBoundingClientRect()` reads in
 * the canvas scrubber stay accurate. Safari-safe config: a calmer `lerp` and
 * `syncTouch: false` so iOS doesn't stutter.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Honour reduced-motion: skip smoothing entirely.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
