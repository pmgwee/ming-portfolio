"use client";

import { useEffect, useRef, type RefObject } from "react";
import { HERO_FILM } from "@/lib/hero-story";
import styles from "./Hero.module.css";

export type CurtainController = { setTime: (time: number) => void };

/** Actual gold pixels from the opening, separated into flexible bead strands.
 * No video seeking is driven by the pointer: this is a foreground layer only. */
export function CurtainLayer({ stageRef, controllerRef, onReveal }: {
  stageRef: RefObject<HTMLDivElement | null>;
  controllerRef: RefObject<CurtainController | null>;
  onReveal: (amount: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backdropRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    const backdrop = backdropRef.current;
    const backContext = backdrop?.getContext("2d");
    if (!canvas || !context || !stage || !backdrop || !backContext) { onReveal(1); return; }
    let disposed = false;
    let frame = 0;
    let last = 0;
    let time = 0;
    let width = 1;
    let height = 1;
    let open = 0;
    let velocity = 0;
    let pointer = 0.5;
    let pointerY = 0.5;
    let targetPointer = 0.5;
    let targetY = 0.5;
    let hovering = false;
    let texture: HTMLCanvasElement | null = null;
    let cleanPlate: HTMLCanvasElement | null = null;
    const image = new Image();
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const draw = () => {
      context.clearRect(0, 0, width, height);
      backContext.clearRect(0, 0, width, height);
      if (!texture || !cleanPlate || time > 2.5) return;
      // Match the original cover framing, then bend each strand in short rows.
      const scale = width <= 768 ? Math.min(width / texture.width, height / texture.height) : Math.max(width / texture.width, height / texture.height);
      const sceneWidth = texture.width * scale;
      const sceneHeight = texture.height * scale;
      // Same framing as the film: object-position 45% (desktop) / center 20% (mobile contain).
      const ox = (width - sceneWidth) * (width <= 768 ? 0.5 : 0.45);
      const oy = (height - sceneHeight) * (width <= 768 ? 0.2 : 0.5);
      backContext.globalAlpha = Math.min(1, Math.max(0, (2.5 - time) / 0.35));
      backContext.fillStyle = "#07080c";
      backContext.fillRect(0, 0, width, height);
      // Closed, plate + strands recompose the film frame exactly; a slight blur
      // only grows as strands part, softening the reconstructed gaps. Touch
      // screens skip it: a full-screen canvas filter every frame of the
      // opening swipe cost more than the softening is worth there.
      const blur = coarse ? 0 : Math.min(1, open) * 3;
      backContext.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
      backContext.drawImage(cleanPlate, ox, oy, sceneWidth, sceneHeight);
      backContext.filter = "none";
      // Touch: wider strands and fewer rows (~750 draws a frame, not 1,600).
      const strip = width <= 768 ? (coarse ? 24 : 16) : 10;
      const row = texture.height / (coarse ? 14 : 20);
      context.globalAlpha = Math.max(0, Math.min(1, (2.5 - time) / 0.5));
      for (let x = 0; x < texture.width; x += strip) {
        const home = ox + x * scale;
        const side = home < width / 2 ? -1 : 1;
        const centerWeight = 1 - Math.min(1, Math.abs(home / width - 0.5) * 2);
        for (let y = 0; y < texture.height; y += row) {
          const v = y / texture.height;
          const drape = 0.7 + Math.sin(v * Math.PI * 0.85) * 0.3;
          const proximity = Math.exp(-Math.pow((home / width - pointer) * 3, 2) - Math.pow((v - pointerY) * 2, 2));
          const hand = 0.85 + (side < 0 ? 1 - pointer : pointer) * 0.3;
          const pull = side * open * width * (0.42 + centerWeight * 0.18) * drape * hand;
          const sway = Math.sin(v * 8 + x * 0.027) * open * proximity * 24;
          context.drawImage(texture, x, y, strip, row, home + pull + sway, oy + y * scale, strip * scale + 0.6, row * scale + 0.6);
        }
      }
      context.globalAlpha = 1;
    };
    const tick = (now: number) => {
      frame = 0;
      if (disposed || document.hidden) return;
      const dt = Math.min(0.033, Math.max(0.001, (now - (last || now - 16)) / 1000));
      last = now;
      const follow = 1 - Math.exp(-12 * dt);
      pointer += (targetPointer - pointer) * follow;
      pointerY += (targetY - pointerY) * follow;
      const scrollOpen = Math.min(1, time / 1.3);
      const target = Math.max(scrollOpen, hovering ? 0.9 : 0);
      velocity += ((target - open) * 65 - velocity * 15) * dt;
      open = Math.max(0, Math.min(1, open + velocity * dt));
      stage.dataset.curtainOpen = open.toFixed(3);
      onReveal(Math.max(scrollOpen, Math.min(1, open * 1.45)));
      draw();
      if (Math.abs(target - open) > 0.001 || Math.abs(velocity) > 0.005 || Math.abs(targetPointer - pointer) > 0.001 || Math.abs(targetY - pointerY) > 0.001) wake();
    };
    const wake = () => { if (!frame && !disposed) frame = requestAnimationFrame(tick); };
    const resize = () => {
      width = stage.clientWidth;
      height = stage.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      backdrop.width = canvas.width;
      backdrop.height = canvas.height;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      backContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      wake();
    };
    const move = (event: PointerEvent) => {
      if (coarse || event.pointerType === "touch" || time > 2.5) return;
      const rect = stage.getBoundingClientRect();
      targetPointer = (event.clientX - rect.left) / width;
      targetY = (event.clientY - rect.top) / height;
      hovering = true;
      wake();
    };
    const leave = () => { hovering = false; wake(); };
    const visibility = () => { last = 0; if (!document.hidden) wake(); };
    controllerRef.current = {
      setTime: (next) => { if (next !== time) { time = next; wake(); } },
    };
    image.onload = () => {
      if (disposed) return;
      texture = document.createElement("canvas");
      texture.width = 1280;
      texture.height = 720;
      const source = texture.getContext("2d", { willReadFrequently: true });
      if (!source) { onReveal(1); return; }
      source.drawImage(image, 0, 0, texture.width, texture.height);
      const pixels = source.getImageData(0, 0, texture.width, texture.height);
      const original = new Uint8ClampedArray(pixels.data);
      const mask = new Uint8Array(texture.width * texture.height);
      // Warm, low-saturation metallic beads; reject the red/orange room and blue sky.
      for (let i = 0; i < pixels.data.length; i += 4) {
        const r = pixels.data[i], g = pixels.data[i + 1], b = pixels.data[i + 2];
        const gold = r > 18 && g / Math.max(r, 1) > 0.68 && b / Math.max(r, 1) < 0.78 && r > b + 5;
        mask[i / 4] = gold ? 1 : 0;
        pixels.data[i + 3] = gold ? 255 : 0;
      }
      source.putImageData(pixels, 0, 0);
      // Reconstruct only the narrow strand pixels from neighboring room pixels.
      // This keeps the room still while the foreground beads actually move.
      cleanPlate = document.createElement("canvas");
      cleanPlate.width = texture.width;
      cleanPlate.height = texture.height;
      const plateContext = cleanPlate.getContext("2d");
      if (plateContext) {
        const plate = new ImageData(new Uint8ClampedArray(original), texture.width, texture.height);
        for (let y = 0; y < texture.height; y++) {
          for (let x = 0; x < texture.width; x++) {
            const p = y * texture.width + x;
            if (!mask[p]) continue;
            let left = x, right = x;
            while (left > 0 && x - left < 14 && mask[y * texture.width + left]) left--;
            while (right < texture.width - 1 && right - x < 14 && mask[y * texture.width + right]) right++;
            const weight = (x - left) / Math.max(1, right - left);
            for (let c = 0; c < 3; c++) plate.data[p * 4 + c] = original[(y * texture.width + left) * 4 + c] * (1 - weight) + original[(y * texture.width + right) * 4 + c] * weight;
          }
        }
        plateContext.putImageData(plate, 0, 0);
      }
      resize();
    };
    image.onerror = () => onReveal(1);
    image.src = HERO_FILM.poster;
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    stage.addEventListener("pointermove", move, { passive: true });
    stage.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      controllerRef.current = null;
      image.onload = null;
      image.onerror = null;
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [controllerRef, onReveal, stageRef]);

  return <><canvas ref={backdropRef} className={styles.openingBackdrop} aria-hidden="true" /><canvas ref={canvasRef} className={styles.curtain} aria-hidden="true" /></>;
}
