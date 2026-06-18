"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImageField } from "./ImageField";
import { HeroText } from "./HeroText";
import { VideoReveal } from "./VideoReveal";
import { PHASES } from "@/lib/showcase";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 2 — Image fly-through → fullscreen video reveal.
 *
 * One tall Stage whose inner layer is pinned by ScrollTrigger for the whole
 * range. Three stacked layers share a single scrub timeline; the image field
 * (Layer 1) runs its own rAF loop and only its master opacity is on the
 * timeline. See src/lib/showcase.ts for every tunable constant.
 */
export function Showcase() {
  const stageRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);

  const fieldWrapRef = useRef<HTMLDivElement>(null);
  const heroWrapRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  // Render-time variants (animation responsiveness is handled by matchMedia).
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { reduced } = ctx.conditions as {
          motion: boolean;
          reduced: boolean;
        };

        // Reduced motion: no pin, no scrub. Just rest the video in view.
        if (reduced) {
          gsap.set(panelRef.current, {
            yPercent: 0,
            width: "min(92vw, 1100px)",
          });
          gsap.set(controlsRef.current, { opacity: 1 });
          gsap.set(heroWrapRef.current, { autoAlpha: 0 });
          return;
        }

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            pin: pinnedRef.current,
            anticipatePin: 1,
          },
        });

        // Timeline total duration is normalised to 1.0, so the absolute
        // positions below equal scroll-progress fractions exactly.

        // --- Field dim → bright (0 → dimRampEnd) --------------------------
        // Half-opacity when the section first enters view; brightens to full
        // as the user scrolls in (reverses on scroll-up). The field's own rAF
        // loop owns per-card opacity; this multiplies the whole layer's dim.
        tl.fromTo(
          fieldWrapRef.current,
          { autoAlpha: 0.5 },
          { autoAlpha: 1, duration: PHASES.dimRampEnd },
          0,
        );

        // --- Hinge (0.62 → 0.72): hero text exits, field clears -----------
        tl.to(
          h1Ref.current,
          { y: -48, autoAlpha: 0, ease: "power3.inOut", duration: 0.1 },
          PHASES.hingeStart,
        )
          .to(
            [subRef.current, buttonsRef.current],
            {
              y: -32,
              autoAlpha: 0,
              ease: "power3.inOut",
              duration: 0.1,
              stagger: 0.04,
            },
            PHASES.hingeStart,
          )
          .to(
            fieldWrapRef.current,
            { autoAlpha: 0, duration: 0.1 },
            PHASES.hingeStart,
          )
          // Once faded, stop the hero layer from intercepting clicks.
          .set(
            heroWrapRef.current,
            { pointerEvents: "none" },
            PHASES.hingeEnd,
          );

        // --- Video slide-up (0.72 → 0.80) ---------------------------------
        tl.fromTo(
          panelRef.current,
          { yPercent: 100 },
          { yPercent: 25, ease: "power2.out", duration: 0.08 },
          PHASES.slideStart,
        );

        // --- Expand to full-bleed (0.80 → 0.95) ---------------------------
        tl.to(
          panelRef.current,
          {
            yPercent: 0,
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
            ease: "power2.inOut",
            duration: 0.15,
          },
          PHASES.expandStart,
        );

        // --- Controls fade in (0.86 → 1.0) --------------------------------
        tl.to(
          controlsRef.current,
          { opacity: 1, duration: PHASES.controlsEnd - PHASES.controlsStart },
          PHASES.controlsStart,
        );
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={stageRef}
      className={`showcase-stage relative ${reducedMotion ? "showcase-stage--reduced" : ""}`}
    >
      <div
        ref={pinnedRef}
        className="relative h-screen w-full overflow-hidden bg-[#07080c]"
      >
        {/* Faint oversized background glow (z0) */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.10),transparent_60%)] blur-3xl" />
        </div>

        {/* Layer 1 — image field (own opacity wrapper for the hinge fade) */}
        <div ref={fieldWrapRef} className="absolute inset-0 z-10">
          <ImageField reducedMotion={reducedMotion} />
        </div>

        {/* Layer 2 — hero text */}
        <HeroText
          wrapRef={heroWrapRef}
          h1Ref={h1Ref}
          subRef={subRef}
          buttonsRef={buttonsRef}
        />

        {/* Layer 3 — video reveal */}
        <VideoReveal
          panelRef={panelRef}
          controlsRef={controlsRef}
          isMobile={isMobile}
        />
      </div>
    </section>
  );
}
