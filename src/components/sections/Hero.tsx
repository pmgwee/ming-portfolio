"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { Button } from "@/components/ui/Button";
import {
  ANNOTATIONS,
  FRAME_COUNT,
  HERO_TEXT_FADE_END,
  frameSrc,
} from "@/lib/hero";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const tickingRef = useRef(false);
  const currentFrameRef = useRef(-1);
  const prevVisibleRef = useRef("");
  // Map of frameIndex → nearest loaded frameIndex; null when every frame loaded.
  const nearestUsableRef = useRef<Int16Array | null>(null);

  const [visibleCards, setVisibleCards] = useState<string[]>([]);

  const { imagesRef, progress, loaded, failedFrames } = useImagePreloader(
    FRAME_COUNT,
    frameSrc,
  );

  /* Draw one frame, cover-fit + centered, in device-pixel space (DPR-aware). */
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let img: HTMLImageElement | undefined = imagesRef.current?.[index];
      // If this frame failed to load, fall back to the nearest frame that did —
      // keeps the scrub coherent across gaps instead of freezing on a stale frame.
      if (!img || !img.complete || img.naturalWidth === 0) {
        const fallback = nearestUsableRef.current?.[index] ?? -1;
        img = fallback >= 0 ? imagesRef.current?.[fallback] : undefined;
      }
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cw = canvas.width; // already × dpr
      const ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;

      let drawW: number;
      let drawH: number;
      if (canvasRatio > imgRatio) {
        drawW = cw;
        drawH = cw / imgRatio;
      } else {
        drawH = ch;
        drawW = ch * imgRatio;
      }

      // Mobile: zoom 1.3× to keep the subject prominent on small screens.
      if (window.innerWidth <= 768) {
        drawW *= 1.3;
        drawH *= 1.3;
      }

      const drawX = (cw - drawW) / 2;
      const drawY = (ch - drawH) / 2;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    },
    [imagesRef],
  );

  /* DPR-aware sizing — internal resolution scaled, CSS size left in px. */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    if (currentFrameRef.current >= 0) drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  /* The hot path — runs inside one RAF per scroll burst. */
  const update = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    const progressVal =
      scrollable > 0
        ? Math.min(1, Math.max(0, -rect.top / scrollable))
        : 0;

    // 1) Canvas frame (direct draw, only when the index changes).
    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.floor(progressVal * FRAME_COUNT),
    );
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      drawFrame(frameIndex);
    }

    // 2) Hero text fade over the first 8% (direct DOM, no React state).
    if (heroTextRef.current) {
      const o = Math.max(0, 1 - progressVal / HERO_TEXT_FADE_END);
      heroTextRef.current.style.opacity = String(o);
      heroTextRef.current.style.pointerEvents = o < 0.05 ? "none" : "auto";
    }

    // 3) Scrub progress bar (direct DOM transform).
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = `scaleX(${progressVal})`;
    }

    // 4) Annotation visibility — React state only when the set changes.
    const visible = ANNOTATIONS.filter(
      (a) => progressVal >= a.show && progressVal < a.hide,
    ).map((a) => a.id);
    const key = visible.join(",");
    if (key !== prevVisibleRef.current) {
      prevVisibleRef.current = key;
      setVisibleCards(visible);
    }
  }, [drawFrame]);

  /* Wire up scroll + resize with RAF throttling. */
  useEffect(() => {
    resizeCanvas();
    update();

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        update();
        tickingRef.current = false;
      });
    };
    const onResize = () => {
      resizeCanvas();
      update();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [resizeCanvas, update]);

  /* Once frames settle, build a nearest-usable lookup so any frame that failed
     to load falls back to the closest one that did — and loudly warn which frames
     are missing (a silent gap is exactly what froze the scrub at ~frame 119). */
  useEffect(() => {
    if (!loaded) return;
    if (failedFrames.length === 0) {
      nearestUsableRef.current = null; // clean load — no fallback needed
      return;
    }

    console.warn(
      `[Hero] ${failedFrames.length}/${FRAME_COUNT} frames failed to load — ` +
        `scrub will fall back to the nearest loaded frame. Missing:\n` +
        failedFrames.map((i) => frameSrc(i + 1)).join("\n"),
    );

    const imgs = imagesRef.current ?? [];
    const usable = (i: number) => {
      const im = imgs[i];
      return !!im && im.complete && im.naturalWidth > 0;
    };
    const map = new Int16Array(FRAME_COUNT).fill(-1);
    // Forward pass: nearest usable frame at or before i.
    let prev = -1;
    for (let i = 0; i < FRAME_COUNT; i++) {
      if (usable(i)) prev = i;
      map[i] = prev;
    }
    // Backward pass: prefer the next usable frame when it's strictly closer.
    let next = -1;
    for (let i = FRAME_COUNT - 1; i >= 0; i--) {
      if (usable(i)) next = i;
      const before = map[i];
      if (next >= 0 && (before < 0 || next - i < i - before)) map[i] = next;
    }
    nearestUsableRef.current = map;
  }, [loaded, failedFrames, imagesRef]);

  /* Once frames finish loading, force a repaint of the current frame. */
  useEffect(() => {
    if (!loaded) return;
    currentFrameRef.current = -1;
    resizeCanvas();
    update();
  }, [loaded, resizeCanvas, update]);

  return (
    <section ref={sectionRef} className="scroll-animation relative">
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      >
        {/* Frame-sequence canvas */}
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          style={{ willChange: "contents", transform: "translateZ(0)" }}
        />

        {/* Cinematic vignette / gradient overlays for text legibility */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(120%_80%_at_50%_40%,transparent_40%,rgba(7,8,12,0.55)_100%)]" />

        {/* Scrub progress bar (pinned to top of viewport) */}
        <div className="absolute left-0 top-0 z-40 h-[3px] w-full bg-white/5">
          <div
            ref={progressBarRef}
            className="h-full origin-left bg-gradient-to-r from-indigo-500 to-violet-500"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Hero text — fades out over the first 8% of scroll */}
        <div
          ref={heroTextRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center"
        >
          <EyebrowBadge>Creative Technologist &amp; AI Consultant</EyebrowBadge>
          <h1 className="mt-6 max-w-[15ch] text-5xl font-semibold leading-[1.02] tracking-tighter md:text-7xl lg:text-8xl">
            Hi, I&apos;m Ming
          </h1>
          <p className="mt-5 max-w-[44ch] text-base text-zinc-300 md:text-lg">
            I craft award-standard 3D animated websites — cinematic,
            high-performance experiences built to win attention — and add AI
            agents &amp; automation when you need an edge.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Button href="#work" showArrow>
              View work
            </Button>
            <Button href="#contact" variant="secondary">
              Get in touch
            </Button>
          </div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-10 flex flex-col items-center gap-2 text-zinc-400"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
              Scroll
            </span>
            <span className="flex h-8 w-5 justify-center rounded-full border border-zinc-500/60 pt-1.5">
              <motion.span
                className="h-1.5 w-1 rounded-full bg-zinc-300"
                animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </span>
          </motion.div>
        </div>

        {/* Annotation cards — CSS transitions, anchored bottom-left */}
        <div className="absolute inset-x-0 bottom-0 z-30 px-6 pb-10 md:px-10 md:pb-14">
          <div className="relative mx-auto h-48 max-w-[1400px] md:h-44">
            {ANNOTATIONS.map((a) => {
              const visible = visibleCards.includes(a.id);
              const position = a.position ?? "left";
              const anchor =
                position === "right"
                  ? "right-0"
                  : position === "center"
                    ? "left-1/2 -translate-x-1/2"
                    : "left-0";
              return (
                <div
                  key={a.id}
                  className={`absolute bottom-0 w-[min(92vw,440px)] rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-500 ${anchor} ${
                    visible
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-6 opacity-0"
                  }`}
                  style={{ boxShadow: "var(--card-shadow)" }}
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-indigo-300">
                    {a.eyebrow}
                  </div>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
                    {a.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {a.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Loading overlay — blocks until EVERY frame is loaded, so the scrub
            never lands on a blank/half-loaded frame even if the user scrolls
            immediately. */}
        {!loaded && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#07080c]">
            <div className="font-mono text-[11px] uppercase tracking-[0.35em] text-zinc-400">
              Loading experience
            </div>
            <div className="mt-5 h-px w-56 overflow-hidden bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-[width] duration-200 ease-out"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <div className="mt-3 font-mono text-[10px] tabular-nums text-zinc-500">
              {Math.round(progress * 100)}%
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
