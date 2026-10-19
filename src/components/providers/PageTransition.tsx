"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { scrollToPosition } from "@/lib/smooth-scroll";

/** App routes rendered by Next (the static /product tool page is a full load). */
const APP_ROUTE = /^\/(ai-projects|experiences|side-projects|work\/[^/]+)?\/?$/;

const LABELS: Record<string, string> = {
  "/": "Home",
  "/ai-projects": "AI Projects",
  "/experiences": "Experiences",
  "/side-projects": "Side Projects",
};

const COVER_MS = 380;
const MIN_VISIBLE_MS = 650;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Covers route changes with a branded loader. Without it, the next page is
 * painted at the previous scroll offset (often its bottom) for a frame before
 * the scroll resets, which reads as a stray card flashing past.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [label, setLabel] = useState<string | null>(null);
  const startedAt = useRef(0);
  const target = useRef<string | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      if (!APP_ROUTE.test(url.pathname)) return;

      // Capture phase: stop Next's <Link> handler and navigate once covered.
      event.preventDefault();
      const destination = url.pathname + url.search + url.hash;
      target.current = url.pathname;
      startedAt.current = performance.now();
      setLabel(LABELS[url.pathname] ?? "Case study");
      router.prefetch(url.pathname);
      window.setTimeout(() => router.push(destination, { scroll: false }), reduced ? 0 : COVER_MS);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [reduced, router]);

  // The new route has rendered: reset scroll under the cover, then reveal.
  useEffect(() => {
    if (!target.current || pathname !== target.current) return;
    target.current = null;
    if (!window.location.hash) scrollToPosition(0);
    const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - startedAt.current));
    let frame = 0;
    const timer = window.setTimeout(() => {
      frame = requestAnimationFrame(() => requestAnimationFrame(() => setLabel(null)));
    }, wait);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {label ? (
        <motion.div
          key="page-transition"
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07080c]"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: COVER_MS / 1000, ease: EASE } }}
          exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.45, ease: EASE } }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[50vh] w-[60vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(closest-side, rgba(99,102,241,0.55), transparent)" }}
          />
          <motion.div
            className="relative flex flex-col items-center gap-5"
            initial={reduced ? false : { y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.12, duration: 0.5, ease: EASE } }}
            exit={reduced ? undefined : { y: -10, opacity: 0, transition: { duration: 0.3, ease: EASE } }}
          >
            <Image src="/logo-resized.png" alt="" width={44} height={44} priority className="opacity-90" />
            <p className="text-sm font-medium tracking-[0.2em] text-zinc-400 uppercase">ming.creatives</p>
            <p className="text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-[-0.03em] text-zinc-100">{label}</p>
            <span className="relative mt-1 block h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
              <motion.i
                className="absolute inset-y-0 left-0 block w-1/2 rounded-full bg-gradient-to-r from-transparent via-white to-transparent"
                initial={{ x: "-100%" }}
                animate={reduced ? { x: "50%" } : { x: ["-100%", "200%"] }}
                transition={reduced ? { duration: 0 } : { duration: 1.1, ease: "easeInOut", repeat: Infinity }}
              />
            </span>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
