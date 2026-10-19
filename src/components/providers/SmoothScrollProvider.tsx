"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { scrollToPosition, setLenis } from "@/lib/smooth-scroll";

gsap.registerPlugin(ScrollTrigger);

/**
 * Wraps the app in Lenis physics-based smooth scrolling, synced to GSAP.
 *
 * Lenis composes naturally with the Hero's native RAF scroll handler — it just
 * smooths the underlying scroll position, so `getBoundingClientRect()` reads in
 * the canvas scrubber stay accurate.
 *
 * For the GSAP ScrollTrigger sections (the Showcase stage) we must share ONE
 * clock: ScrollTrigger reads native scroll, so we (1) update it on every Lenis
 * scroll and (2) drive Lenis's `raf` from `gsap.ticker` instead of our own loop.
 * Without this the scrub lags the smooth scroll by a frame or two.
 *
 * Safari-safe config: a calmer `lerp` and `syncTouch: false` so iOS doesn't
 * stutter.
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
      duration: 1.2,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
    });

    // Expose the instance so navbar/footer anchor jumps can route through
    // Lenis (see lib/smooth-scroll.ts for why native hash nav fails here).
    setLenis(lenis);

    // 1) Keep ScrollTrigger in lock-step with Lenis's smoothed position.
    lenis.on("scroll", ScrollTrigger.update);

    // 2) Drive Lenis from GSAP's ticker so both run on one RAF loop.
    //    gsap.ticker time is seconds → Lenis.raf wants milliseconds.
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // A route change keeps Lenis's old scroll target, which would land the new
  // page at the previous offset (e.g. its bottom). Start each page at the top,
  // unless the URL targets a section hash.
  const pathname = usePathname();
  const firstPath = useRef(true);
  useEffect(() => {
    // Leave the browser's own restore alone on the initial load / reload.
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    if (window.location.hash) return;
    scrollToPosition(0);
    ScrollTrigger.refresh();
  }, [pathname]);

  return <>{children}</>;
}
