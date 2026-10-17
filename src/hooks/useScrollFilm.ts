"use client";

import { useEffect, useState, type RefObject } from "react";
import { HERO_FILM } from "@/lib/hero-story";

/** One seek in flight; captions advance only when its frame is decoded. */
export function useScrollFilm({ sectionRef, videoRef, enabled, onFrame }: {
  sectionRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  enabled: boolean;
  onFrame: (time: number) => void;
}) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || !enabled) return;
    let disposed = false;
    let scrollFrame = 0;
    let seekFrame = 0;
    let desired = 0;
    let lastPresented = -1;
    setReady(false);
    setFailed(false);

    const present = () => {
      if (disposed) return;
      lastPresented = video.currentTime;
      section.dataset.filmTime = lastPresented.toFixed(3);
      onFrame(lastPresented);
    };
    const seek = () => {
      if (disposed || video.readyState < 2 || video.seeking) return;
      if (Math.abs(video.currentTime - desired) <= 1 / 30) {
        if (lastPresented < 0) present();
        return;
      }
      try { video.currentTime = desired; } catch {
        // Some browsers need another data event before seeking is available.
      }
    };
    const update = () => {
      scrollFrame = 0;
      const travel = section.offsetHeight - window.innerHeight;
      const progress = travel > 0 ? Math.min(1, Math.max(0, -section.getBoundingClientRect().top / travel)) : 0;
      const duration = Number.isFinite(video.duration) ? video.duration : HERO_FILM.duration;
      desired = progress * Math.max(0, Math.min(duration, HERO_FILM.duration) - 1 / 30);
      seek();
    };
    const onScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(update); };
    const onLoaded = () => {
      if (disposed) return;
      setReady(true);
      present();
      update();
    };
    const onSeeked = () => {
      present();
      cancelAnimationFrame(seekFrame);
      seekFrame = requestAnimationFrame(seek);
    };
    const onError = () => { if (!disposed) setFailed(true); };

    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("progress", seek);
    video.addEventListener("canplay", seek);
    video.addEventListener("error", onError);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    video.muted = true;
    // Choose once, avoiding a second download on orientation changes.
    video.src = window.matchMedia("(max-width: 768px)").matches ? HERO_FILM.mobile : HERO_FILM.desktop;
    video.preload = "auto";
    video.load();
    update();
    return () => {
      disposed = true;
      cancelAnimationFrame(scrollFrame);
      cancelAnimationFrame(seekFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("progress", seek);
      video.removeEventListener("canplay", seek);
      video.removeEventListener("error", onError);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [attempt, enabled, onFrame, sectionRef, videoRef]);
  return { ready, failed, retry: () => setAttempt((value) => value + 1) };
}
