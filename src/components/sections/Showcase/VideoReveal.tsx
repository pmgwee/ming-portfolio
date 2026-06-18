"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight, SpeakerSimpleHigh, SpeakerSimpleX } from "@phosphor-icons/react";
import { PANEL, VIDEO_SRC } from "@/lib/showcase";

/**
 * Layer 3 — the native <video> panel that slides up from below and expands to
 * full-bleed. Autoplays muted (so no user gesture is needed); the parent
 * timeline drives translate/width/height/radius via `panelRef`, and fades the
 * controls in via `controlsRef`.
 *
 * Controls: a functional Unmute/Mute toggle plus decorative ‹ › arrows (one
 * clip for now → they restart playback; wire to a carousel when more clips
 * are added).
 */
export function VideoReveal({
  panelRef,
  controlsRef,
  isMobile,
}: {
  panelRef: React.RefObject<HTMLDivElement | null>;
  controlsRef: React.RefObject<HTMLDivElement | null>;
  isMobile: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  // Fallback for browsers that ignore the autoPlay attribute (muted → allowed).
  useEffect(() => {
    const v = videoRef.current;
    if (v) void v.play().catch(() => {});
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) void v.play().catch(() => {});
    setMuted(v.muted);
  }, []);

  const restart = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    void v.play().catch(() => {});
  }, []);

  const startWidth = isMobile ? PANEL.WIDTH_VW_MOBILE : PANEL.WIDTH_VW_DESKTOP;

  return (
    // Centering wrapper (no transform) so GSAP fully owns the panel's transform.
    <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center">
      <div
        ref={panelRef}
        className="pointer-events-auto relative overflow-hidden bg-black"
        style={{
          width: `${startWidth}vw`,
          height: `${PANEL.REST_HEIGHT_VH}vh`,
          borderRadius: `${PANEL.RADIUS_PX}px`,
          // Start fully below; GSAP drives yPercent 100 → 25 → 0.
          transform: "translateY(100%)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={VIDEO_SRC}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
        />

        {/* Controls — faded in by the parent timeline from ~86%. */}
        <div ref={controlsRef} style={{ opacity: 0 }}>
        {/* Carousel arrows (decorative for a single clip) */}
        <button
          type="button"
          onClick={restart}
          aria-label="Previous clip"
          className="absolute left-4 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 md:left-6"
        >
          <CaretLeft weight="bold" className="size-5" />
        </button>
        <button
          type="button"
          onClick={restart}
          aria-label="Next clip"
          className="absolute right-4 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 md:right-6"
        >
          <CaretRight weight="bold" className="size-5" />
        </button>

        {/* Unmute / Mute toggle (functional) */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="absolute bottom-5 right-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/60 md:bottom-7 md:right-7"
        >
          {muted ? (
            <SpeakerSimpleX weight="bold" className="size-4" />
          ) : (
            <SpeakerSimpleHigh weight="bold" className="size-4" />
          )}
          {muted ? "Unmute" : "Mute"}
        </button>
        </div>
      </div>
    </div>
  );
}
