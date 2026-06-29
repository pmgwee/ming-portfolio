"use client";

import { AnimatePresence, motion, type MotionValue } from "framer-motion";
import type { ShowcaseProject } from "@/lib/projects/project";

/**
 * One floating prototype image for the whole Works grid — it tracks the cursor
 * and swaps its source as you move between cards (rather than one element per
 * card). The parent owns the raw cursor MotionValues; here they're spring-
 * followed for the buttery lag, and AnimatePresence drives the scale 0 → 1 pop.
 *
 * Rendered ONLY on hover-capable, motion-allowed devices (the parent guards
 * this), so there's no touch / reduced-motion branch to worry about here.
 *
 * `pointer-events-none` is essential — the preview sits under the cursor, so it
 * must never intercept the hover it's reacting to.
 */
export function ProjectCursorPreview({
  active,
  springX,
  springY,
}: {
  active: ShowcaseProject | null;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}) {
  return (
    <motion.div
      aria-hidden
      style={{ x: springX, y: springY }}
      className="pointer-events-none fixed left-0 top-0 z-40"
    >
      {/* Static centering / lift offset on a separate element so it never
          competes with the framer transforms above (cursor) or below (pop). */}
      <div className="-translate-x-1/2 -translate-y-[120%]">
        <AnimatePresence mode="wait">
          {active?.prototype && (
            <motion.figure
              key={active.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              // Clean shrink only — no opacity fade or tilt (avoids the exit flash).
              exit={{ scale: 0, transition: { duration: 0.22, ease: "easeIn" } }}
              transition={{ type: "spring", stiffness: 240, damping: 22, mass: 0.7 }}
              className="relative w-[510px] max-w-[80vw] overflow-hidden rounded-2xl border border-white/15 bg-zinc-900 shadow-2xl ring-1 ring-white/10"
            >
              {/* Natural aspect, no crop/upscale → full resolution, no blur. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.prototype}
                alt={`${active.title} prototype`}
                className="block h-auto w-full"
                loading="eager"
                decoding="async"
              />
              {/* Legibility scrim + category chip for the high-end feel. */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/85">
                  {active.category}
                </span>
              </figcaption>
            </motion.figure>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
