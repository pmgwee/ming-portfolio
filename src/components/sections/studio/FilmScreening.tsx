"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowCounterClockwise, Pause, Play, SpeakerHigh, SpeakerSlash, X } from "@phosphor-icons/react";
import { AIGC_FILM, SERVICE_RAYS } from "@/lib/studio";
import styles from "./Studio.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;
const AMBER = SERVICE_RAYS[0];
const clock = (s: number) => `0:${String(Math.min(59, Math.floor(s))).padStart(2, "0")}`;

/**
 * The AIGC brief, answered with the film itself. The film is about opening a
 * door, so its screen opens like one: a 9:16 portal parted from a centre seam,
 * framed by a slowly turning spectral rim (the prism again) and spilling its
 * own colours onto the page. Beside it, the storyboard: each beat lights up as
 * the film reaches it, and clicking a beat cuts straight to it.
 */
export function FilmScreening({
  reduced,
  onClose,
  ref,
}: {
  reduced: boolean;
  onClose: () => void;
  /** AnimatePresence's popLayout measures the screen through this. */
  ref?: React.Ref<HTMLDivElement>;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const setRoot = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.RefObject<HTMLDivElement | null>).current = node;
    },
    [ref],
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const glowRef = useRef<HTMLCanvasElement>(null);
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);

  const shots = AIGC_FILM.shots;
  const active = shots.reduce((found, shot, i) => (time >= shot.at ? i : found), 0);

  // Play with sound: the pick that opened the screen was a click, which
  // browsers accept as permission. Fall back to muted if they still refuse.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.play().catch(() => {
      video.muted = true;
      setMuted(true);
      void video.play().catch(() => {});
    });
  }, []);

  // Each frame: spill the film's colours behind the screen and advance the
  // shot-segmented progress bar (written directly, no re-render per frame).
  useEffect(() => {
    const video = videoRef.current;
    const ctx = glowRef.current?.getContext("2d");
    if (!video) return;
    let frame = 0;
    const paint = () => {
      frame = requestAnimationFrame(paint);
      if (ctx && !reduced && video.readyState >= 2) ctx.drawImage(video, 0, 0, 9, 16);
      const t = video.currentTime;
      shots.forEach((shot, i) => {
        const end = shots[i + 1]?.at ?? AIGC_FILM.duration;
        const fill = fillRefs.current[i];
        if (fill) fill.style.transform = `scaleX(${Math.min(1, Math.max(0, (t - shot.at) / (end - shot.at)))})`;
      });
    };
    frame = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(frame);
  }, [reduced, shots]);

  // Scrolling the screen away pauses it.
  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;
    const sight = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
    });
    sight.observe(root);
    return () => sight.disconnect();
  }, []);

  const seek = useCallback((at: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = at;
    setTime(at);
    setEnded(false);
    void video.play().catch(() => {});
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (ended) seek(0);
    else if (video.paused) void video.play().catch(() => {});
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const glass = "grid size-10 place-items-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-200";

  return (
    <motion.div
      ref={setRoot}
      role="region"
      aria-label={`${AIGC_FILM.title}: an AI-generated film with its storyboard`}
      initial={reduced ? false : { opacity: 0, x: -56, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, x: -40, scale: 0.97, transition: { duration: 0.35, ease: EASE } }}
      transition={{ duration: 0.85, ease: EASE }}
      className="relative flex shrink-0 items-center gap-6 xl:gap-8"
    >
      <div className="relative">
        {/* The film's own light, washing onto the page behind the screen. */}
        <canvas
          ref={glowRef}
          width={9}
          height={16}
          aria-hidden="true"
          className="pointer-events-none absolute left-[-22%] top-[-10%] -z-10 h-[120%] w-[144%] opacity-75 blur-[70px] saturate-150"
        />

        <div className={styles.portalRim}>
          <motion.div
            initial={reduced ? false : { clipPath: "inset(0% 50% 0% 50% round 30px)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0% round 30px)" }}
            transition={{ duration: 1.15, ease: EASE, delay: 0.2 }}
            className="relative aspect-[9/16] h-[min(600px,74vh)] overflow-hidden rounded-[30px] bg-black"
          >
            <video
              ref={videoRef}
              src={AIGC_FILM.src}
              poster={AIGC_FILM.poster}
              playsInline
              preload="auto"
              aria-label={`${AIGC_FILM.title}, a 15-second AI-generated film`}
              className="absolute inset-0 size-full object-cover"
              onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
              onPlay={() => {
                setPlaying(true);
                setEnded(false);
              }}
              onPause={() => setPlaying(false)}
              onEnded={() => setEnded(true)}
            />

            <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white/90 backdrop-blur-md">
              <span aria-hidden="true" className={`size-1.5 rounded-full ${playing ? "animate-pulse" : ""}`} style={{ background: AMBER.color }} />
              Now screening
            </span>

            {ended ? (
              <button
                type="button"
                onClick={() => seek(0)}
                className="absolute inset-0 grid place-items-center bg-black/45 text-sm font-medium text-white backdrop-blur-[2px] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand-200"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-5 py-2.5">
                  <ArrowCounterClockwise aria-hidden="true" size={16} /> Watch again
                </span>
              </button>
            ) : null}

            <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgba(0,0,0,0.78)_45%)] px-4 pb-4 pt-16">
              <p className="text-[19px] font-medium tracking-[-0.01em] text-white">{AIGC_FILM.title}</p>
              <p className="mt-0.5 text-xs text-white/65">AI-generated TVC · one continuous shot · 0:15</p>
              <div aria-hidden="true" className="mt-3 flex gap-1">
                {shots.map((shot, i) => {
                  const end = shots[i + 1]?.at ?? AIGC_FILM.duration;
                  return (
                    <span key={shot.at} className="h-[3px] overflow-hidden rounded-full bg-white/25" style={{ flex: end - shot.at }}>
                      <span
                        ref={(node) => {
                          fillRefs.current[i] = node;
                        }}
                        className="block h-full origin-left scale-x-0 rounded-full"
                        style={{ background: AMBER.color }}
                      />
                    </span>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button type="button" onClick={toggle} aria-label={playing ? "Pause film" : "Play film"} className={glass}>
                  {playing ? <Pause aria-hidden="true" size={16} weight="fill" /> : <Play aria-hidden="true" size={16} weight="fill" />}
                </button>
                <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute film" : "Mute film"} className={glass}>
                  {muted ? <SpeakerSlash aria-hidden="true" size={16} /> : <SpeakerHigh aria-hidden="true" size={16} />}
                </button>
                <span className="ml-auto font-mono text-[11px] tabular-nums text-white/70">
                  {clock(time)} / {clock(AIGC_FILM.duration)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Storyboard: the beats behind the final cut. */}
      <motion.div
        initial={reduced ? false : { opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.55 }}
        className="w-[188px]"
      >
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">Storyboard</p>
          <button type="button" onClick={onClose} aria-label="Close the film" className={glass}>
            <X aria-hidden="true" size={16} />
          </button>
        </div>
        <ol aria-label="Storyboard beats" className="mt-3 space-y-1.5">
          {shots.map((shot, i) => {
            const on = i === active;
            return (
              <li key={shot.at}>
                <button
                  type="button"
                  aria-current={on ? "step" : undefined}
                  onClick={() => seek(shot.at)}
                  className={`flex w-full items-center gap-3 rounded-md p-1.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-200 ${on ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"}`}
                >
                  <span
                    className="relative h-[68px] w-[38px] shrink-0 overflow-hidden rounded-[6px] transition-shadow duration-300"
                    style={{ boxShadow: on ? `0 0 0 2px ${AMBER.color}, 0 0 18px rgba(${AMBER.rgb},0.55)` : "0 0 0 1px rgba(255,255,255,0.15)" }}
                  >
                    <Image src={shot.frame} alt="" fill sizes="38px" unoptimized className="object-cover" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] tabular-nums text-white/45">
                      {String(i + 1).padStart(2, "0")} · {clock(shot.at)}
                    </span>
                    <span className={`block text-[13px] leading-snug transition-colors ${on ? "text-white" : "text-white/65"}`}>{shot.label}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-[11px] leading-4 text-white/40">Concept, storyboard, generation and edit by Ming Creatives.</p>
      </motion.div>
    </motion.div>
  );
}
