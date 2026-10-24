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
  applyScrollLock();
}

/**
 * Page-level scroll lock (e.g. while the hero film downloads). Survives the
 * Lenis instance mounting after the lock was taken: `setLenis` re-applies it.
 */
let scrollLocks = 0;
function applyScrollLock() {
  if (typeof document === "undefined") return;
  const locked = scrollLocks > 0;
  const root = document.documentElement;
  root.style.overflow = locked ? "hidden" : "";
  document.body.style.overflow = locked ? "hidden" : "";
  root.dataset.scrollLocked = String(locked);
  if (locked) lenisInstance?.stop();
  else lenisInstance?.start();
}

/** Lock page scrolling; call the returned function to release (idempotent). */
export function lockPageScroll() {
  scrollLocks += 1;
  applyScrollLock();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    scrollLocks = Math.max(0, scrollLocks - 1);
    applyScrollLock();
  };
}

/** Suspend the existing scroll owner while a native gallery dialog is open. */
export function suspendPageScroll() {
  const instance = lenisInstance;
  const wasStopped = instance?.isStopped;
  instance?.stop();
  return () => { if (instance && !wasStopped) instance.start(); };
}

/** Jump (no animation) to a section hash, e.g. behind the page-transition cover. */
export function jumpToHash(hash: string) {
  if (typeof document === "undefined" || !hash) return;
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;
  if (lenisInstance) {
    // After a route change Lenis still holds the previous page's scroll limit;
    // re-measure first or the jump is clamped short of the section.
    lenisInstance.resize();
    lenisInstance.scrollTo(target, { immediate: true, force: true });
  } else target.scrollIntoView({ block: "start" });
}

/** Chapter controls use the existing scroll owner; its speed settings stay intact. */
export function scrollToPosition(top: number) {
  if (typeof window === "undefined") return;
  if (lenisInstance) {
    lenisInstance.resize();
    lenisInstance.scrollTo(top, { immediate: true });
  } else {
    window.scrollTo({ top, behavior: "instant" });
  }
}

/** Per-frame scroll writes (the page following the playing hero film): no re-measure. */
export function followScrollPosition(top: number) {
  if (typeof window === "undefined") return;
  if (lenisInstance) lenisInstance.scrollTo(top, { immediate: true });
  else window.scrollTo({ top, behavior: "instant" });
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
