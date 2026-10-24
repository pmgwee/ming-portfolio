/**
 * `--lock-vh`: 1% of the viewport height, for the scroll-driven sections that
 * are many screens tall (the hero film, the showcase stage).
 *
 * On touch screens it is measured once and re-measured only when the width
 * changes (rotation). In-app browsers such as Instagram's resize the page as
 * their header collapses mid-scroll; with plain vh/svh every screen-tall
 * section above the reader grew with it, so a 80px toolbar change moved the
 * services section ~1300px and the page appeared to jump back to the video.
 * Desktop windows follow every resize.
 */
export const VIEWPORT_LOCK_SCRIPT = `(function(){var r=document.documentElement,w=-1,t=matchMedia("(hover: none) and (pointer: coarse)");function s(){if(t.matches&&innerWidth===w)return;w=innerWidth;r.style.setProperty("--lock-vh",innerHeight/100+"px")}s();addEventListener("resize",s)})()`;
