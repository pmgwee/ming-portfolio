"use client";

import { useEffect, useRef } from "react";
import { HOVER } from "@/lib/showcase";
import type { ShowcaseSlide } from "@/lib/showcase";

/**
 * The rounded edge thumbnail that slides in from the left/right edge while its
 * hover-zone is active, previewing the previous/next clip. A live <video> (muted)
 * plays only while `visible` to keep idle decode cost off. A small label chip
 * names the clip's state (e.g. "Flow State").
 *
 * Purely presentational + self-contained slide animation (CSS transition); the
 * active full-bleed video's translate-away is handled separately in VideoStage.
 */
export function MiniPreview({
  side,
  slide,
  visible,
}: {
  side: "left" | "right";
  slide: ShowcaseSlide;
  visible: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Only decode/play while this side is being previewed.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (visible) void v.play().catch(() => {});
    else v.pause();
  }, [visible]);

  const hiddenShift = side === "left" ? "-120%" : "120%";

  return (
    <div
      className="pointer-events-none absolute z-20"
      style={{
        top: "50%",
        marginTop: -HOVER.PREVIEW_H / 2,
        // Inboard of the pinned edge arrow so both stay visible.
        [side]: "clamp(76px, 7vw, 104px)" as never,
        height: HOVER.PREVIEW_H,
        width: HOVER.PREVIEW_W,
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden bg-black shadow-2xl ring-1 ring-white/15"
        style={{
          borderRadius: HOVER.PREVIEW_RADIUS,
          transform: visible ? "translateX(0)" : `translateX(${hiddenShift})`,
          opacity: visible ? 1 : 0,
          transition: `transform ${HOVER.EASE_MS}ms cubic-bezier(0.16,1,0.3,1), opacity ${HOVER.EASE_MS}ms ease`,
          willChange: "transform, opacity",
        }}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={slide.src}
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
        <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          {slide.label}
        </span>
      </div>
    </div>
  );
}
