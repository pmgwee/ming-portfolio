import type Lenis from "lenis";

/**
 * Shared access to the single Lenis instance created in `SmoothScrollProvider`.
 *
 * In-page anchor jumps MUST go through Lenis, not native/Next `<Link>` hash
 * navigation: Lenis owns the scroll position via its RAF loop, so a native jump
 * is overwritten on the next frame (and is fought outright while a momentum
 * scroll is in flight). `lenis.scrollTo` cancels momentum and animates to the
 * target deterministically — so clicks land on the first try, even mid-scroll.
 */
let lenisInstance: Lenis | null = null;

/** Called by the provider on mount/unmount. */
export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

/**
 * Smooth-scroll to an in-page hash target (`"#services"`, or `"#"` / `"#top"`
 * for the top of the page). Falls back to native scrolling when Lenis isn't
 * running (reduced-motion, or before the provider has mounted).
 */
export function scrollToHash(hash: string) {
  if (typeof window === "undefined") return;

  const toTop = hash === "" || hash === "#" || hash === "#top";

  if (lenisInstance) {
    lenisInstance.scrollTo(toTop ? 0 : hash, { offset: 0 });
    return;
  }

  // Fallback — no Lenis (reduced-motion or not yet mounted).
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const behavior: ScrollBehavior = prefersReduced ? "auto" : "smooth";

  if (toTop) {
    window.scrollTo({ top: 0, behavior });
  } else {
    document.querySelector(hash)?.scrollIntoView({ behavior });
  }
}
