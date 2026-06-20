"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CaretLeft,
  CaretRight,
  SpeakerSimpleHigh,
  SpeakerSimpleX,
} from "@phosphor-icons/react";
import {
  CAROUSEL,
  HOVER,
  PARALLAX,
  REVEAL,
  labelFromUrl,
} from "@/lib/showcase";
import { useCursorParallax } from "@/hooks/useCursorParallax";
import { MiniPreview } from "./MiniPreview";

/* ------------------------------------------------------------------ */
/*  CONFIG — tune the stage here (sourced from src/lib/showcase.ts).    */
/*  Edit the constants in showcase.ts; they are re-surfaced below so     */
/*  every knob the stage uses is visible at a glance.                   */
/* ------------------------------------------------------------------ */
const CONFIG = {
  /** Transform-only reveal start (panel rises + scales + un-rounds). */
  reveal: REVEAL, // { START_SCALE, START_RADIUS_PX }
  /** Edge hover-zones → translate-away + mini-preview. */
  hover: HOVER, // { ZONE_PCT, TRANSLATE_PX, SCALE, EASE_MS, PREVIEW_* }
  /** Magnetic cursor parallax. */
  parallax: PARALLAX, // { MAX_X, MAX_Y, LERP }
  /** Crossfade between active clips. */
  carousel: CAROUSEL, // { CROSSFADE_MS }
} as const;

/**
 * Layer 3 — the interactive, true full-bleed video carousel (Leonardo-style).
 *
 * The OUTER `panelRef` is full-bleed (inset-0 = 100vw×100vh) and owned by GSAP,
 * which drives the transform-only reveal (translateY 100→0, scale START→1,
 * radius START→0). The INNER `mediaRef` is owned by JS — `useCursorParallax`
 * composes cursor parallax + the edge hover translate-away into a single
 * transform there, so the two never fight.
 *
 * A–E implemented: reveal target, autoplay/unmute, wrap-around carousel
 * (only the active clip plays), hover mini-preview, cursor parallax, plus
 * mobile swipe. Overlay UI (F) is deferred.
 */
export function VideoStage({
  panelRef,
  controlsRef,
  settled,
  isMobile,
  reducedMotion,
  videos,
}: {
  panelRef: React.RefObject<HTMLDivElement | null>;
  controlsRef: React.RefObject<HTMLDivElement | null>;
  settled: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
  /** Ordered clip URLs from the S3 `video/` folder (one per carousel slide). */
  videos: string[];
}) {
  // One slide per clip in the video/ folder; label derived from the filename.
  const slides = videos.map((src) => ({ src, label: labelFromUrl(src) }));
  const N = slides.length;
  // Wrap-around divisor — never 0 so the modulo math is always safe even when
  // the folder listing is empty (e.g. local dev with no S3 creds).
  const M = Math.max(N, 1);

  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const hoverOffsetRef = useRef<{ x: number; scale: number }>({ x: 0, scale: 1 });

  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);
  const [canHover, setCanHover] = useState(false);

  // Fine-pointer + hover capability (excludes touch / coarse pointers).
  useEffect(() => {
    setCanHover(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    );
  }, []);

  // Parallax + hover translate-away are desktop-only, post-settle, motion-OK.
  const interactive = settled && canHover && !reducedMotion;

  const prevIndex = (activeIndex - 1 + M) % M;
  const nextIndex = (activeIndex + 1) % M;

  const next = useCallback(() => setActiveIndex((i) => (i + 1) % M), [M]);
  const prev = useCallback(() => setActiveIndex((i) => (i - 1 + M) % M), [M]);

  // --- Playback: only the active clip plays; the rest pause (perf). --------
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === activeIndex) {
        v.muted = muted;
        void v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [activeIndex, muted]);

  // --- Hover target → fed to the parallax/transform loop on mediaRef. ------
  useEffect(() => {
    let x = 0;
    let scale = 1;
    if (interactive && hoverSide === "left") {
      x = CONFIG.hover.TRANSLATE_PX; // shift right, away from the left edge
      scale = CONFIG.hover.SCALE;
    } else if (interactive && hoverSide === "right") {
      x = -CONFIG.hover.TRANSLATE_PX;
      scale = CONFIG.hover.SCALE;
    }
    hoverOffsetRef.current = { x, scale };
  }, [hoverSide, interactive]);

  // Drop any active hover when interactivity turns off (scroll-away / mobile).
  useEffect(() => {
    if (!interactive) setHoverSide(null);
  }, [interactive]);

  // --- Cursor parallax + hover translate-away (single rAF on mediaRef). ----
  useCursorParallax({
    targetRef: mediaRef,
    enabled: interactive,
    hoverOffsetRef,
    maxX: CONFIG.parallax.MAX_X,
    maxY: CONFIG.parallax.MAX_Y,
    lerp: CONFIG.parallax.LERP,
  });

  // --- Mobile swipe → prev/next. -------------------------------------------
  useEffect(() => {
    if (!isMobile || !settled) return;
    const el = panelRef.current;
    if (!el) return;
    let startX = 0;
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0]?.clientX ?? 0;
    };
    const onEnd = (e: TouchEvent) => {
      const dx = (e.changedTouches[0]?.clientX ?? 0) - startX;
      if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [isMobile, settled, panelRef, next, prev]);

  const toggleMute = useCallback(() => {
    const v = videoRefs.current[activeIndex];
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) void v.play().catch(() => {});
    setMuted(v.muted);
  }, [activeIndex]);

  // Interactive elements only catch events once the stage has settled.
  const pe = settled ? "auto" : "none";
  const zoneW = `${CONFIG.hover.ZONE_PCT * 100}vw`;
  const arrowCls =
    "absolute top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60";

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {/*
        GSAP owns the panel's transform/border-radius/opacity entirely (see
        Showcase.tsx). We must NOT set an inline `transform` here — GSAP reads
        the computed matrix and a CSS `translateY(100%)` bakes into a stale px Y
        it never animates away, leaving the panel parked below the fold. The
        `opacity-0` class is the only pre-JS hidden state; GSAP's autoAlpha
        overrides it the instant the reveal tween initialises.
      */}
      <div
        ref={panelRef}
        className="pointer-events-auto absolute inset-0 overflow-hidden bg-black opacity-0"
      >
        {/* Crossfading video stack — only the active clip plays. */}
        <div
          ref={mediaRef}
          className="absolute inset-0"
          style={{ willChange: "transform" }}
        >
          {slides.map((slide, i: number) => (
            <video
              key={slide.src}
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                opacity: i === activeIndex ? 1 : 0,
                transition: `opacity ${CONFIG.carousel.CROSSFADE_MS}ms ease`,
              }}
              src={slide.src || undefined}
              muted
              loop
              playsInline
              preload={i === 0 ? "auto" : "metadata"}
            />
          ))}
        </div>

        {/* Controls — faded in by the parent timeline (controlsRef opacity). */}
        <div ref={controlsRef} style={{ opacity: 0 }}>
          {/* Edge hover-zones (desktop only) — preview + arrow live together. */}
          {!isMobile && (
            <>
              <div
                onPointerEnter={() => interactive && setHoverSide("left")}
                onPointerLeave={() => setHoverSide(null)}
                className="absolute inset-y-0 left-0 z-10"
                style={{ width: zoneW, pointerEvents: pe }}
              >
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous clip"
                  className={`${arrowCls} left-4 md:left-6`}
                  style={{ pointerEvents: pe }}
                >
                  <CaretLeft weight="bold" className="size-5" />
                </button>
              </div>

              <div
                onPointerEnter={() => interactive && setHoverSide("right")}
                onPointerLeave={() => setHoverSide(null)}
                className="absolute inset-y-0 right-0 z-10"
                style={{ width: zoneW, pointerEvents: pe }}
              >
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next clip"
                  className={`${arrowCls} right-4 md:right-6`}
                  style={{ pointerEvents: pe }}
                >
                  <CaretRight weight="bold" className="size-5" />
                </button>
              </div>

              {/* Mini-previews of the neighbouring clips. */}
              {N > 0 && (
                <>
                  <MiniPreview
                    side="left"
                    src={slides[prevIndex].src}
                    label={slides[prevIndex].label}
                    visible={interactive && hoverSide === "left"}
                  />
                  <MiniPreview
                    side="right"
                    src={slides[nextIndex].src}
                    label={slides[nextIndex].label}
                    visible={interactive && hoverSide === "right"}
                  />
                </>
              )}
            </>
          )}

          {/* Mobile arrows (no hover-zones; swipe also works). */}
          {isMobile && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous clip"
                className={`${arrowCls} left-3`}
                style={{ pointerEvents: pe }}
              >
                <CaretLeft weight="bold" className="size-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next clip"
                className={`${arrowCls} right-3`}
                style={{ pointerEvents: pe }}
              >
                <CaretRight weight="bold" className="size-5" />
              </button>
            </>
          )}

          {/* Unmute / Mute toggle (functional) — above the right hover-zone. */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute video" : "Mute video"}
            className="absolute bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/60 md:bottom-7 md:right-7"
            style={{ pointerEvents: pe }}
          >
            {muted ? (
              <SpeakerSimpleX weight="bold" className="size-4" />
            ) : (
              <SpeakerSimpleHigh weight="bold" className="size-4" />
            )}
            {muted ? "Unmute" : "Mute"}
          </button>

          {/* Overlay UI (F) is deferred. */}
        </div>
      </div>
    </div>
  );
}
