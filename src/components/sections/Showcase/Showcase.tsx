"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImageField } from "./ImageField";
import { HeroText } from "./HeroText";
import { VideoStage } from "./VideoStage";
import { PHASES, REVEAL } from "@/lib/showcase";

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
  // True once the reveal is ~complete → VideoStage enables hover/parallax/swipe.
  const [settled, setSettled] = useState(false);
  const settledRef = useRef(false);

  // Heavy media (image-field tiles + carousel clips) is listed live from S3 via
  // /api/media — a single fetch here, passed down to both layers. Empty until it
  // resolves; both components degrade gracefully to no media in the meantime.
  const [media, setMedia] = useState<{
    tiles: string[];
    videos: Record<string, string>;
  }>({ tiles: [], videos: {} });
  useEffect(() => {
    let cancelled = false;
    fetch("/api/media")
      .then((r) => (r.ok ? r.json() : { tiles: [], videos: {} }))
      .then((d: { tiles?: unknown; videos?: unknown }) => {
        if (cancelled) return;
        setMedia({
          tiles: Array.isArray(d.tiles) ? (d.tiles as string[]) : [],
          videos:
            d.videos && typeof d.videos === "object"
              ? (d.videos as Record<string, string>)
              : {},
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

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

        // Reduced motion: no pin, no scrub, no parallax/hover. Simple fade —
        // rest the full-bleed video in view above the nav, controls visible.
        if (reduced) {
          gsap.set(pinnedRef.current, { zIndex: 70 });
          gsap.set(panelRef.current, {
            yPercent: 0,
            scale: 1,
            borderRadius: 0,
            autoAlpha: 1,
          });
          gsap.set(controlsRef.current, { opacity: 1 });
          gsap.set(heroWrapRef.current, { autoAlpha: 0 });
          settledRef.current = true;
          setSettled(true);
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
            onUpdate: (self) => {
              // Gate interactivity once the video is essentially full-bleed.
              const s = self.progress >= PHASES.settledAt;
              if (s !== settledRef.current) {
                settledRef.current = s;
                setSettled(s);
              }
            },
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
            { pointerEvents: "none", autoAlpha: 0 },
            PHASES.hingeEnd,
          );

        // --- Above the nav exactly when the video starts taking over ------
        // pinnedRef gets a stacking context above the navbar (z-60); reverts
        // automatically when scrubbed back. By revealEnd only the video shows.
        tl.set(pinnedRef.current, { zIndex: 70 }, PHASES.revealStart);

        // --- Continuous full-bleed reveal (0.62 → 0.92) -------------------
        // One transform-only expo-out motion: the panel rises (yPercent),
        // scales up from a centered cinematic card, and un-rounds to 0. No
        // layout properties (width/height) — only transform + border-radius.
        tl.fromTo(
          panelRef.current,
          {
            yPercent: 100,
            scale: REVEAL.START_SCALE,
            borderRadius: REVEAL.START_RADIUS_PX,
            autoAlpha: 1, // Visible immediately off-screen; GSAP overrides opacity-0
          },
          {
            yPercent: 0,
            scale: 1,
            borderRadius: 0,
            autoAlpha: 1,
            ease: "expo.out",
            duration: PHASES.revealEnd - PHASES.revealStart,
          },
          PHASES.revealStart,
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
          <ImageField reducedMotion={reducedMotion} tiles={media.tiles} />
        </div>

        {/* Layer 2 — hero text */}
        <HeroText
          wrapRef={heroWrapRef}
          h1Ref={h1Ref}
          subRef={subRef}
          buttonsRef={buttonsRef}
        />

        {/* Layer 3 — interactive full-bleed video carousel */}
        <VideoStage
          panelRef={panelRef}
          controlsRef={controlsRef}
          settled={settled}
          isMobile={isMobile}
          reducedMotion={reducedMotion}
          videos={media.videos}
        />
      </div>
    </section>
  );
}
