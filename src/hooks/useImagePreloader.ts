"use client";

import { useEffect, useRef, useState } from "react";

export interface PreloadedSequence {
  /** Cached <img> elements, index 0 = frame 1. */
  imagesRef: React.RefObject<HTMLImageElement[]>;
  /** 0 → 1 load progress, drives the loading bar. */
  progress: number;
  /** True once every frame has settled (loaded OR errored) — safe to start drawing. */
  loaded: boolean;
  /** 0-based indices of frames that failed to load (onerror). Empty on a clean load. */
  failedFrames: number[];
}

/**
 * Preloads and caches an image sequence so the scroll-scrubbed canvas never
 * draws a blank/half-loaded frame.
 *
 * Every <img> is created eagerly and held in a ref (not state) so re-renders
 * don't recreate them. `onerror` counts toward progress too, so one bad frame
 * can't wedge the loading bar below 100%.
 *
 * @param frameCount number of frames in the sequence (1-indexed)
 * @param srcFor     maps a 1-based frame index to its URL
 */
export function useImagePreloader(
  frameCount: number,
  srcFor: (frame: number) => string,
): PreloadedSequence {
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failedFrames, setFailedFrames] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;
    let done = 0;
    const failed: number[] = [];
    const imgs: HTMLImageElement[] = [];

    const onSettled = () => {
      if (cancelled) return;
      done += 1;
      setProgress(done / frameCount);
      if (done === frameCount) {
        setLoaded(true);
        if (failed.length) setFailedFrames([...failed].sort((a, b) => a - b));
      }
    };

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const frameIndex = i - 1; // 0-based, matches imagesRef indexing
      img.decoding = "async";
      img.onload = onSettled;
      img.onerror = () => {
        failed.push(frameIndex);
        onSettled();
      };
      img.src = srcFor(i);
      imgs.push(img);
    }

    imagesRef.current = imgs;

    return () => {
      cancelled = true;
    };
    // srcFor is intentionally excluded — callers pass a fresh closure each render,
    // and we only want to (re)load when the frame count changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount]);

  return { imagesRef, progress, loaded, failedFrames };
}
