/**
 * Shared hooks for the site-wide page transition (see PageTransition.tsx).
 *
 * Full page loads (the static /product tool page, or a reload into the site)
 * leave a note in sessionStorage; an inline script in the layout reads it
 * before first paint and keeps the screen covered until React reveals it.
 */
export const TRANSITION_KEY = "mc-transition";

/** Inline, pre-paint: cover the page if we arrived through a transition. */
export const TRANSITION_BOOT_SCRIPT = `try{if(sessionStorage.getItem("${TRANSITION_KEY}"))document.documentElement.dataset.transition="1"}catch(e){}`;

const LABELS: [RegExp, string][] = [
  [/^\/$/, "Home"],
  [/^\/ai-projects\/?$/, "AI Projects"],
  [/^\/experiences\/?$/, "Experiences"],
  [/^\/side-projects\/?$/, "Side Projects"],
  [/^\/product\/career-plan/, "职业规划表"],
  [/^\/work\//, "Case study"],
];

export function transitionLabel(pathname: string) {
  return LABELS.find(([pattern]) => pattern.test(pathname))?.[1] ?? "Ming Creatives";
}

let handler: ((href: string) => void) | null = null;

/** Registered by PageTransition on mount. */
export function registerTransition(next: ((href: string) => void) | null) {
  handler = next;
}

/** Navigate to an in-site URL behind the transition cover. */
export function navigateWithTransition(href: string) {
  if (handler) handler(href);
  else window.location.assign(href);
}
