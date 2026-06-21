"use client";

import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
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
  subRef,
  buttonsRef,
}: {
  wrapRef: React.RefObject<HTMLDivElement | null>;
  h1Ref: React.RefObject<HTMLHeadingElement | null>;
  subRef: React.RefObject<HTMLParagraphElement | null>;
  buttonsRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
    >
      <EyebrowBadge>Portfolio · 2026</EyebrowBadge>

      <h1
        ref={h1Ref}
        className="mt-6 max-w-[16ch] text-5xl font-semibold leading-[1.02] tracking-tighter md:text-7xl lg:text-8xl"
      >
        Ming Vision
      </h1>

      <p
        ref={subRef}
        className="mt-5 max-w-[44ch] text-base text-zinc-300 md:text-lg"
      >
        {/* A reel of real-time 3D, scroll choreography, and interface work — built
        in the browser, no compromises. */}
      </p>

      <div ref={buttonsRef} className="mt-8 flex items-center gap-3">
        <Button href="#work" showArrow>
          Watch showreel
        </Button>
        <Button href="#contact" variant="secondary">
          Start a project
        </Button>
      </div>
    </div>
  );
}
