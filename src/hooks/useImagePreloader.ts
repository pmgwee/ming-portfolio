"use client";

import { useEffect, useRef, useState } from "react";

export interface PreloadedSequence {
  /** Cached <img> elements, index 0 = frame 1. */
  imagesRef: React.RefObject<HTMLImageElement[]>;
  /** 0 → 1 load progress, drives the loading bar. */
  progress: number;
  /** True once every frame has loaded (or errored) — safe to start drawing. */
  loaded: boolean;
  /**
   * True once the first few frames are in — enough to reveal the hero and let
   * the user start scrolling while the rest of the sequence streams in. Lets us
   * drop the blocking overlay after ~250 KB instead of the whole ~tens-of-MB run.
   */
  ready: boolean;
}

/** Frames needed before we reveal the hero (the rest keep loading behind it). */
const READY_THRESHOLD = 8;

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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let done = 0;
    const imgs: HTMLImageElement[] = [];
    const readyAt = Math.min(READY_THRESHOLD, frameCount);

    const onSettled = () => {
      if (cancelled) return;
      done += 1;
      setProgress(done / frameCount);
      // Reveal as soon as the leading frames are in (the scrub guards any frame
      // that hasn't arrived yet); keep loading the rest in the background.
      if (done >= readyAt) setReady(true);
      if (done === frameCount) setLoaded(true);
    };

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.decoding = "async";
      // Prioritise the leading frames so first paint + early scrub are smooth;
      // the tail can trickle in at low priority.
      img.fetchPriority = i <= readyAt ? "high" : "low";
      img.onload = onSettled;
      img.onerror = onSettled;
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

  return { imagesRef, progress, loaded, ready };
}
