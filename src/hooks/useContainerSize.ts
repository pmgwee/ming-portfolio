"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

export interface ContainerSize {
  w: number;
  h: number;
}

/**
 * Track a referenced element's content-box size via ResizeObserver. Used to
 * drive responsive scroll-morph poses (fan / stack / grid) from the live stage
 * rect instead of hardcoded pixels, so the choreography holds at any width.
 *
 * `useLayoutEffect` measures before paint to avoid a one-frame flash at the
 * collapsed `{0,0}` initial size; consumers should keep cards hidden (e.g. an
 * `opacity:0` intro wrapper) until `w > 0`.
 */
export function useContainerSize(
  ref: RefObject<HTMLElement | null>,
): ContainerSize {
  const [size, setSize] = useState<ContainerSize>({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((prev) =>
        prev.w === width && prev.h === height ? prev : { w: width, h: height },
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return size;
}
