"use client";

import { useEffect, useRef } from "react";
import { PRISM } from "@/lib/studio";

type Point = { x: number; y: number; t: number };
type Ripple = { x: number; y: number; age: number };

const BANDS = PRISM.SPECTRUM.length;
/** Steps from white (fresh light) to full colour (dispersed, fading light). */
const LEVELS = 4;
const ease = (t: number) => 1 - (1 - t) ** 3;

// Each spectral band at each step out of white, so the draw loop only picks strings.
const PALETTE = PRISM.SPECTRUM.map((rgb) => {
  const [r, g, b] = rgb.split(",").map(Number);
  return Array.from({ length: LEVELS }, (_, level) => {
    const s = (level + 1) / LEVELS;
    const mix = (c: number) => Math.round(255 + (c - 255) * s);
    return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
  });
});

/**
 * Prism light across the studio sky, after the Ming Creatives logo (明, "ming",
 * is light). A crystal lattice hides in the sky; the pointer is a soft light
 * that reveals an area of it. Fresh light reads white, and as it fades it
 * disperses into a spectrum laid across the width of the path. Clicks ripple a
 * ring of light outward. With no input for a moment a faint ghost light
 * drifts across, so touch screens sense it too. Off under reduced motion.
 */
export function PrismField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { CELL } = PRISM;
    const ROW = CELL * 0.866;
    const now = () => performance.now() / 1000;
    const cellX = (i: number, j: number) => (i + 0.5 + (j % 2) * 0.5) * CELL;
    const cellY = (j: number) => (j + 0.5) * ROW;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let light = new Float32Array(0);
    let hue = new Float32Array(0);
    const ripples: Ripple[] = [];
    let pointer: Point | null = null;
    let ghost: Point | null = null;
    let idle: number = PRISM.IDLE_AFTER;
    let ghostClock = Math.random() * 40;
    let frame = 0;
    let last = 0;

    // Light a soft disc. `band` fixes the hue; otherwise it follows the
    // signed distance across the path, red on one side and violet on the other.
    function stamp(x: number, y: number, amount: number, radius: number, ux: number, uy: number, band?: number) {
      const r2 = radius * radius;
      const j0 = Math.max(0, Math.floor((y - radius) / ROW));
      const j1 = Math.min(rows - 1, Math.ceil((y + radius) / ROW));
      const i0 = Math.max(0, Math.floor((x - radius) / CELL) - 1);
      const i1 = Math.min(cols - 1, Math.ceil((x + radius) / CELL));
      for (let j = j0; j <= j1; j++) {
        const dy = cellY(j) - y;
        for (let i = i0; i <= i1; i++) {
          const dx = cellX(i, j) - x;
          const d2 = dx * dx + dy * dy;
          if (d2 > r2) continue;
          const weight = amount * Math.exp(-d2 / (r2 * 0.34));
          const k = j * cols + i;
          light[k] = Math.min(1, light[k] + weight);
          const target = band ?? Math.min(0.999, Math.max(0, ((dy * ux - dx * uy) / radius + 1) / 2));
          hue[k] += (target - hue[k]) * Math.min(1, weight * 3);
        }
      }
    }

    // Light along a segment; faster travel lights a wider area.
    function stroke(from: Point, to: Point, amount: number) {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 0.5) return;
      const speed = distance / Math.max(0.008, to.t - from.t);
      const radius = PRISM.BRUSH_MIN + (PRISM.BRUSH_MAX - PRISM.BRUSH_MIN) * Math.min(1, speed / 1400);
      const steps = Math.ceil(distance / (CELL * 0.6));
      for (let s = 1; s <= steps; s++) {
        const f = s / steps;
        stamp(from.x + dx * f, from.y + dy * f, amount, radius, dx / distance, dy / distance);
      }
    }

    function glow(at: Point | null, strength: number) {
      if (!at || strength <= 0) return;
      const wash = ctx!.createRadialGradient(at.x, at.y, 0, at.x, at.y, PRISM.GLOW_RADIUS);
      wash.addColorStop(0, `rgba(255,255,255,${PRISM.GLOW_ALPHA * strength})`);
      wash.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.globalAlpha = 1;
      ctx!.fillStyle = wash;
      ctx!.fillRect(at.x - PRISM.GLOW_RADIUS, at.y - PRISM.GLOW_RADIUS, PRISM.GLOW_RADIUS * 2, PRISM.GLOW_RADIUS * 2);
    }

    function draw(at: number) {
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      glow(pointer, 1 - Math.min(1, (at - (pointer?.t ?? 0)) / 0.6));
      glow(ghost, PRISM.GHOST * 0.6);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i;
          const v = light[k];
          if (v < PRISM.LOW) continue;
          const band = Math.floor(hue[k] * BANDS);
          // Only the brightest core stays white; the rest shows its colour.
          const level = Math.min(LEVELS - 1, Math.floor((1.25 - v) * LEVELS));
          const size = PRISM.DOT * (0.7 + v * 0.7);
          ctx!.globalAlpha = Math.sqrt(Math.min(1, (v - PRISM.LOW) / 0.45)) * PRISM.ALPHA;
          ctx!.fillStyle = PALETTE[band][level];
          ctx!.fillRect(cellX(i, j) - size / 2, cellY(j) - size / 2, size, size);
        }
      }
      ctx!.globalAlpha = 1;
    }

    function tick(ms: number) {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (ms - (last || ms)) / 1000);
      last = ms;
      idle += dt;
      const at = now();

      if (idle > PRISM.IDLE_AFTER) {
        ghostClock += dt;
        const next = {
          x: width * (0.5 + 0.42 * Math.sin(ghostClock * 0.23 + 1.3)),
          y: height * (0.3 + 0.18 * Math.sin(ghostClock * 0.37)),
          t: at,
        };
        if (ghost) stroke(ghost, next, PRISM.INK * PRISM.GHOST * Math.min(1, (idle - PRISM.IDLE_AFTER) / 1.5));
        ghost = next;
      } else {
        ghost = null;
      }

      for (let r = ripples.length - 1; r >= 0; r--) {
        const ripple = ripples[r];
        ripple.age += dt;
        const t = ripple.age / PRISM.RIPPLE_LIFE;
        if (t >= 1) {
          ripples.splice(r, 1);
          continue;
        }
        const radius = PRISM.RIPPLE_RADIUS * ease(t);
        const count = Math.max(10, Math.ceil((Math.PI * 2 * radius) / 9));
        for (let n = 0; n < count; n++) {
          const a = (n / count) * Math.PI * 2;
          stamp(ripple.x + Math.cos(a) * radius, ripple.y + Math.sin(a) * radius, 0.05 * (1 - t), 24, 0, 0, n / count);
        }
      }

      const keep = 0.5 ** (dt / PRISM.FADE);
      for (let k = 0; k < light.length; k++) light[k] = light[k] > 0.01 ? light[k] * keep : 0;
      draw(at);
    }

    function resize() {
      width = host!.clientWidth;
      height = host!.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / ROW);
      light = new Float32Array(cols * rows);
      hue = new Float32Array(cols * rows);
    }

    const local = (event: PointerEvent): Point => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top, t: now() };
    };
    const onMove = (event: PointerEvent) => {
      const next = local(event);
      if (pointer && next.t - pointer.t < 0.25) stroke(pointer, next, PRISM.INK);
      pointer = next;
      idle = 0;
    };
    const onDown = (event: PointerEvent) => {
      const { x, y } = local(event);
      ripples.push({ x, y, age: 0 });
      idle = 0;
    };
    const start = () => {
      if (frame) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    const viewport = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    viewport.observe(host);
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerdown", onDown, { passive: true });

    return () => {
      stop();
      observer.disconnect();
      viewport.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 size-full ${className}`} />;
}
