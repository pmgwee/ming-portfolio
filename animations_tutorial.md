## Image Sequence Scrubbed on a Canvas

scrolling, scroll-driven animation, and image sequence as frame scrubbed on a canvas fit together 

This is the Apple-AirPods-style effect: a video exported as frames, redrawn on a
`<canvas>` as the user scrolls. There are **two methods** to drive it.

```
┌─────────────────────────────────────────────┐
│  Lenis  →  smooths the raw scroll position    │  (input layer)
└───────────────────────┬───────────────────────┘
                        │
        ┌───────────────┴────────────────┐
        │                                │
  Hand-rolled RAF                 GSAP ScrollTrigger     (animation driver)
  (you own the loop)              (library owns the loop)
        │                                │
        └───────────────┬────────────────┘
                        ▼
                  ctx.drawImage()                        (output — identical)
```
## 2. The Real Decision

- **Single scrubber → hand-rolled.** **Many animated sections → GSAP.**
- If you mix Lenis + ScrollTrigger, **share one RAF clock.**

The genuine question is **not** "Hand-rolled RAF or ScrollTrigger." It's:

> **For driving a scroll animation, do I write the RAF/progress math myself,
> or let ScrollTrigger do it?**

Both drivers end at the **exact same line** — `ctx.drawImage(...)`. Only the
*driver* changes.

---

### Method 1 — Hand-Rolled RAF *(current implementation)*

You compute scroll progress yourself and draw the matching frame.

```
scroll event → RAF throttle → getBoundingClientRect()
  → progress (0–1) → frameIndex → drawImage()   // only if index changed
```

**Characteristics**
- You own the loop — progress math, throttling, frame-index mapping, the draw.
- Zero animation-library dependency (lightest bundle).
- The canonical frame-scrub pattern.

> [!NOTE]
> In this project, see [`Hero.tsx`](src/components/sections/Hero.tsx) — the
> `update()` hot path at lines 84–126.

### Method 2 — GSAP ScrollTrigger

You hand GSAP an object with a `frame` property and let `scrub` drive it.

```js
const seq = { frame: 0 };

gsap.to(seq, {
  frame: FRAME_COUNT - 1,
  snap: "frame",                 // round to whole frames
  ease: "none",
  scrollTrigger: {
    trigger: section,
    start: "top top",
    end: "bottom bottom",        // ≈ the 560vh scrub distance
    scrub: true,                 // ← replaces RAF + progress math
    pin: true,                   // ← replaces the sticky CSS
  },
  onUpdate: () => drawFrame(Math.round(seq.frame)),
});
```

> [!TIP]
> ScrollTrigger draws **nothing**. It just animates a number and calls your
> `onUpdate`. Your `drawFrame()` does the actual rendering in *both* methods.

---

## 4. Side-by-Side Comparison

### What each concern costs you

image1.png

### Which wins, by scenario

image.png

---

## 5. The Gotcha: Lenis + ScrollTrigger Must Share a Clock

ScrollTrigger reads the **native** scroll position. With Lenis in play, you must
sync them or the scrub lags the smooth scroll by a frame or two.

```js
// Tell ScrollTrigger to update on every Lenis scroll
lenis.on("scroll", ScrollTrigger.update);

// Drive Lenis from GSAP's ticker so they share one RAF loop
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

> [!WARNING]
> The hand-rolled method **sidesteps this entirely** — it reads
> `getBoundingClientRect()` directly, which Lenis has already moved. No clock
> syncing required.

---

