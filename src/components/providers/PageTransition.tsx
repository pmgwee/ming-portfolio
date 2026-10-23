"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TRANSITION_KEY, registerTransition, transitionLabel } from "@/lib/page-transition";
import { jumpToHash, scrollToPosition } from "@/lib/smooth-scroll";
import { SITE } from "@/lib/seo";

/** Routes rendered by the Next app (client navigation). Others load in full. */
const APP_ROUTE = /^\/(ai-projects|experiences|side-projects|work\/[^/]+)?\/?$/;

const COVER_MS = 380;
const MIN_VISIBLE_MS = 650;
const EASE = [0.16, 1, 0.3, 1] as const;

const afterLayout = (fn: () => void) => requestAnimationFrame(() => requestAnimationFrame(fn));

/**
 * Site-wide page transition. Every in-site navigation fades in a branded cover,
 * changes page underneath it, settles the scroll position (top, or the target
 * section), then fades out. Covers client routes, full page loads (the static
 * career-plan tool), section links from sub-pages, and browser back/forward.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [label, setLabel] = useState<string | null>(null);
  const [instant, setInstant] = useState(false);
  const startedAt = useRef(0);
  const target = useRef<string | null>(null);
  const lastPath = useRef(pathname);

  const reveal = useCallback((hash: string) => {
    const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - startedAt.current));
    window.setTimeout(() => {
      // Sections settle (pinned stages, images) before the hash jump.
      afterLayout(() => {
        if (hash) jumpToHash(hash);
        afterLayout(() => setLabel(null));
      });
    }, wait);
  }, []);

  const start = useCallback((href: string) => {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) {
      window.location.assign(url.href);
      return;
    }
    startedAt.current = performance.now();
    setInstant(false);
    setLabel(transitionLabel(url.pathname));
    const destination = url.pathname + url.search + url.hash;
    const delay = reduced ? 0 : COVER_MS;
    if (APP_ROUTE.test(url.pathname)) {
      target.current = url.pathname;
      router.prefetch(url.pathname);
      window.setTimeout(() => router.push(destination, { scroll: false }), delay);
    } else {
      // Full page load (e.g. the static tool page): the next page reveals itself.
      try { sessionStorage.setItem(TRANSITION_KEY, transitionLabel(url.pathname)); } catch {}
      window.setTimeout(() => window.location.assign(destination), delay);
    }
  }, [reduced, router]);

  useEffect(() => {
    registerTransition(start);
    return () => registerTransition(null);
  }, [start]);

  // Arrived through a full page load that started a transition elsewhere.
  useEffect(() => {
    let arrived: string | null = null;
    try {
      arrived = sessionStorage.getItem(TRANSITION_KEY);
      sessionStorage.removeItem(TRANSITION_KEY);
    } catch {}
    if (!arrived) return;
    startedAt.current = performance.now() - MIN_VISIBLE_MS / 2;
    setInstant(true);
    setLabel(arrived);
    afterLayout(() => {
      delete document.documentElement.dataset.transition;
      reveal(window.location.hash);
    });
  }, [reveal]);

  // Any same-origin link to another page goes through the cover.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || !anchor.href || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return;
      if (anchor.dataset.noTransition !== undefined) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      // Capture phase: runs before Next's <Link>; other onClick handlers still run.
      event.preventDefault();
      start(url.href);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [start]);

  // Browser back/forward between pages.
  useEffect(() => {
    const onPop = () => {
      if (window.location.pathname === lastPath.current) return;
      startedAt.current = performance.now();
      setInstant(true);
      setLabel(transitionLabel(window.location.pathname));
      target.current = window.location.pathname;
    };
    // Restored from the back/forward cache after a full-load transition.
    const onShow = (event: PageTransitionEvent) => { if (event.persisted) setLabel(null); };
    window.addEventListener("popstate", onPop);
    window.addEventListener("pageshow", onShow);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("pageshow", onShow);
    };
  }, []);

  // The new route has rendered under the cover: settle scroll, then reveal.
  useEffect(() => {
    lastPath.current = pathname;
    if (!target.current || pathname !== target.current) return;
    target.current = null;
    if (!window.location.hash) scrollToPosition(0);
    reveal(window.location.hash);
  }, [pathname, reveal]);

  return (
    <AnimatePresence>
      {label ? (
        <motion.div
          key="page-transition"
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07080c]"
          initial={reduced || instant ? false : { opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: COVER_MS / 1000, ease: EASE } }}
          exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.45, ease: EASE } }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[50vh] w-[60vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(closest-side, rgba(87,123,244,0.55), transparent)" }}
          />
          <motion.div
            className="relative flex flex-col items-center gap-5"
            initial={reduced || instant ? false : { y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.12, duration: 0.5, ease: EASE } }}
            exit={reduced ? undefined : { y: -10, opacity: 0, transition: { duration: 0.3, ease: EASE } }}
          >
            <Image src={SITE.logo} alt="" width={44} height={44} priority className="opacity-90" />
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">ming.creatives</p>
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
