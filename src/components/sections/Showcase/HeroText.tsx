"use client";

import { Button } from "@/components/ui/Button";

/**
 * Layer 2 — the sharp centered headline that sits in front of the image field
 * and exits (translate-up + fade) on the hinge.
 *
 * Refs are owned by the parent <Showcase> so the single GSAP timeline can drive
 * the exit; this component is otherwise presentational. Copy is a tunable
 * placeholder distinct from the page's first Hero.
 */
export function HeroText({
  wrapRef,
  h1Ref,
  buttonsRef,
}: {
  wrapRef: React.RefObject<HTMLDivElement | null>;
  h1Ref: React.RefObject<HTMLHeadingElement | null>;
  buttonsRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
    >
      <p className="text-sm font-medium text-zinc-200">Creative work by Gwee Per Ming</p>

      <h2
        ref={h1Ref}
        className="mt-6 max-w-[16ch] text-5xl font-semibold leading-[1.02] tracking-tighter md:text-7xl lg:text-8xl"
      >
        Ming Creatives
      </h2>

      <div ref={buttonsRef} className="mt-8 flex items-center gap-3">
        <Button
          href="#services"
          showArrow
        >
          Explore the studio
        </Button>
        <Button
          href="https://wa.me/message/DFUGF3HXISNEF1"
          variant="secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Start a project
        </Button>
      </div>
    </div>
  );
}
