"use client";

import { useEffect, useState, type RefObject } from "react";
import { HERO_FILM, filmTimeAt } from "@/lib/hero-story";

/**
 * Download the whole film before it can be scrubbed. Scroll-scrubbing seeks
 * all over the file, so a progressively streamed video stalls on every seek
 * past the buffered range. Holding the complete file in memory (a blob URL)
 * makes every seek local. Reports download progress (0–1); falls back to
 * plain streaming when the response can't be read as a stream.
 */
async function loadFilm(url: string, signal: AbortSignal, onProgress: (fraction: number) => void) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Film request failed: ${response.status}`);
  const total = Number(response.headers.get("content-length")) || 0;
  if (!response.body || !total) {
    const blob = await response.blob();
    onProgress(1);
    return URL.createObjectURL(blob);
  }
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    onProgress(Math.min(1, received / total));
  }
  onProgress(1);
  return URL.createObjectURL(new Blob(chunks as BlobPart[], { type: response.headers.get("content-type") ?? "video/mp4" }));
}

/** One seek in flight; captions advance only when its frame is decoded. */
export function useScrollFilm({ sectionRef, videoRef, enabled, onFrame }: {
  sectionRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  enabled: boolean;
  onFrame: (time: number) => void;
}) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState(0);
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
    let objectUrl = "";
    const abort = new AbortController();
    setReady(false);
    setFailed(false);
    setProgress(0);

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
      desired = Math.min(filmTimeAt(progress), Math.max(0, Math.min(duration, HERO_FILM.duration) - 1 / 30));
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
    const source = window.matchMedia("(max-width: 768px)").matches ? HERO_FILM.mobile : HERO_FILM.desktop;
    let lastReported = 0;
    loadFilm(source, abort.signal, (fraction) => {
      // Re-render at most every 1% to keep the download loop cheap.
      if (fraction === 1 || fraction - lastReported >= 0.01) {
        lastReported = fraction;
        setProgress(fraction);
      }
    })
      .then((url) => {
        if (disposed) { URL.revokeObjectURL(url); return; }
        objectUrl = url;
        video.src = url;
      })
      .catch(() => {
        if (disposed) return;
        // Streaming fallback: still plays, just without the full preload.
        video.src = source;
        setProgress(1);
      })
      .finally(() => {
        if (disposed) return;
        video.preload = "auto";
        video.load();
        update();
      });
    update();
    return () => {
      disposed = true;
      abort.abort();
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
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [attempt, enabled, onFrame, sectionRef, videoRef]);
  return { ready, failed, progress, retry: () => setAttempt((value) => value + 1) };
}
