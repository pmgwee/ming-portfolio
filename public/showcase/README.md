# Showcase carousel footage

Drop the full-bleed cinematic clips for Section 2's video carousel here, then
point `SHOWCASE_VIDEOS` in [`src/lib/showcase.ts`](../../src/lib/showcase.ts) at them.

## Expected files

| File            | Notes                                              |
| --------------- | -------------------------------------------------- |
| `clip-01.mp4`   | Slide 1 (currently labelled "Flow State")          |
| `clip-02.mp4`   | Slide 2 ("Deep Focus")                             |
| `clip-03.mp4`   | Slide 3 ("Momentum")                              |
| `clip-0X.webm`  | _Optional_ VP9 sibling — smaller payload           |
| `clip-0X.jpg`   | _Optional_ poster / first-frame still              |

## Specs

- **Codec / container:** H.264, MP4 (add a VP9 `.webm` sibling where possible).
- **Resolution:** 1920×1080 (1080p). `object-fit: cover` crops to the viewport.
- **Length:** ~6–12 s, seamless **loop**.
- **Audio:** muted / no audio track (autoplay requires muted; the Unmute pill
  toggles audio if a track exists).
- **Size:** keep each ≤ ~8–10 MB for fast start.
- **Content:** RAW cinematic footage — **no browser chrome**. (The current
  placeholders in `/public/video1` and `/public/video2` are screen recordings
  with a browser tab/address bar baked into the footage; replacing them here is
  what removes that chrome.)

## Wiring

In `src/lib/showcase.ts`:

```ts
export const SHOWCASE_VIDEOS: ShowcaseSlide[] = [
  { src: "/showcase/clip-01.mp4", label: "Flow State" },
  { src: "/showcase/clip-02.mp4", label: "Deep Focus" },
  { src: "/showcase/clip-03.mp4", label: "Momentum" },
];
```

Add or remove array entries to change the number of carousel slides — the
arrows, hover mini-previews, and swipe all derive from this list.
