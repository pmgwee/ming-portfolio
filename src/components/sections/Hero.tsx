"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { Button } from "@/components/ui/Button";
import { ANNOTATIONS, FRAME_COUNT, HERO_TEXT_FADE_END, frameSrc } from "@/lib/hero";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const tickingRef = useRef(false);
  const currentFrameRef = useRef(-1);
  const previousVisibleRef = useRef("");
  const nearestUsableRef = useRef<Int16Array | null>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [visibleCards, setVisibleCards] = useState<string[]>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setMotionAllowed(!reducedMotion.matches);
    updateMotion();
    window.addEventListener("resize", updateMotion);
    reducedMotion.addEventListener("change", updateMotion);
    return () => {
      window.removeEventListener("resize", updateMotion);
      reducedMotion.removeEventListener("change", updateMotion);
    };
  }, []);

  const frameCount = motionAllowed ? FRAME_COUNT : 1;
  const { imagesRef, loaded, firstFrameReady, failedFrames } =
    useImagePreloader(frameCount, frameSrc);

  useEffect(() => {
    if (motionAllowed || !heroTextRef.current) return;
    heroTextRef.current.style.opacity = "1";
    heroTextRef.current.inert = false;
    previousVisibleRef.current = "";
    setVisibleCards([]);
  }, [motionAllowed]);

  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let img: HTMLImageElement | undefined = imagesRef.current?.[index];
      if (!img || !img.complete || img.naturalWidth === 0) {
        const fallback = nearestUsableRef.current?.[index] ?? -1;
        img = fallback >= 0 ? imagesRef.current?.[fallback] : undefined;
      }
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;
      let drawW: number;
      let drawH: number;
      if (canvasRatio > imgRatio) {
        drawW = cw;
        drawH = cw / imgRatio;
      } else {
        drawH = ch;
        drawW = ch * imgRatio;
      }

      if (window.innerWidth <= 768) {
        drawW *= 1.3;
        drawH *= 1.3;
      }

      ctx.drawImage(img, (cw - drawW) / 2, (ch - drawH) / 2, drawW, drawH);
    },
    [imagesRef],
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    if (currentFrameRef.current >= 0) drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  const update = useCallback(() => {
    if (!motionAllowed) return;

    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    const progress =
      scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
    const frameIndex = Math.min(
      frameCount - 1,
      Math.floor(progress * frameCount),
    );

    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      drawFrame(frameIndex);
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = `scaleX(${progress})`;
    }
    if (heroTextRef.current) {
      const opacity = Math.max(0, 1 - progress / HERO_TEXT_FADE_END);
      heroTextRef.current.style.opacity = String(opacity);
      heroTextRef.current.inert = opacity < 0.05;
    }
    const visible = ANNOTATIONS.filter(
      (card) => progress >= card.show && progress < card.hide,
    ).map((card) => card.id);
    const key = visible.join(",");
    if (key !== previousVisibleRef.current) {
      previousVisibleRef.current = key;
      setVisibleCards(visible);
    }
  }, [drawFrame, frameCount, motionAllowed]);

  useEffect(() => {
    resizeCanvas();
    update();

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        update();
        tickingRef.current = false;
      });
    };
    const onResize = () => {
      resizeCanvas();
      update();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [resizeCanvas, update]);

  useEffect(() => {
    if (!firstFrameReady) return;
    currentFrameRef.current = motionAllowed ? -1 : 0;
    resizeCanvas();
    update();
  }, [firstFrameReady, motionAllowed, resizeCanvas, update]);

  useEffect(() => {
    if (!loaded || failedFrames.length === 0) {
      nearestUsableRef.current = null;
      return;
    }

    const imgs = imagesRef.current ?? [];
    const map = new Int16Array(frameCount).fill(-1);
    let previous = -1;
    for (let i = 0; i < frameCount; i++) {
      const img = imgs[i];
      if (img?.complete && img.naturalWidth > 0) previous = i;
      map[i] = previous;
    }
    let next = -1;
    for (let i = frameCount - 1; i >= 0; i--) {
      const img = imgs[i];
      if (img?.complete && img.naturalWidth > 0) next = i;
      if (next >= 0 && (map[i] < 0 || next - i < i - map[i])) map[i] = next;
    }
    nearestUsableRef.current = map;
    currentFrameRef.current = -1;
    update();
  }, [failedFrames, frameCount, imagesRef, loaded, update]);

  return (
    <section ref={sectionRef} className="scroll-animation relative" aria-labelledby="hero-heading">
      <div className="hero-sticky relative w-full overflow-hidden bg-[#07080c]">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 block h-full w-full"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_40%,transparent_25%,rgba(7,8,12,0.68)_100%)]" />
        <p className="absolute bottom-4 left-6 z-20 text-[10px] text-zinc-300/80 md:left-10">
          Animated studio artwork · not a portrait
        </p>

        {motionAllowed && (
          <div aria-hidden="true" className="absolute left-0 top-0 z-20 h-0.5 w-full bg-white/10">
            <div
              ref={progressBarRef}
              className="h-full origin-left bg-indigo-300"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        )}

        <div ref={heroTextRef} className="absolute inset-0 z-20 mx-auto flex w-full max-w-[1400px] flex-col items-center justify-center px-6 py-24 text-center md:px-10">
          <p className="text-sm font-medium tracking-[0.12em] text-zinc-200">
            Production AI Builder <span aria-hidden="true">·</span> Creative Technologist
          </p>
          <h1
            id="hero-heading"
            className="mt-5 text-[clamp(3rem,8vw,6.75rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-white"
          >
            Gwee Per Ming
          </h1>
          <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-zinc-100 [text-shadow:0_1px_14px_rgba(0,0,0,0.95)] md:text-lg">
            I build AI systems and software that go beyond the prototype. Through
            Ming Creatives, I also make cinematic 3D web experiences and visual
            work for brands.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="#ai-systems" showArrow>
              Explore AI products
            </Button>
            <Button href="#showcase" variant="secondary">
              View collections
            </Button>
          </div>
          <p className="mt-10 max-w-[46ch] text-xs leading-relaxed text-zinc-300">
            Computer Science graduate · Malaysia
          </p>
          <div
            aria-hidden="true"
            className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-zinc-300/80"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.28em]">Scroll</span>
            <span className="flex h-8 w-5 justify-center rounded-full border border-zinc-400/50 pt-1">
              <span className="hero-scroll-dot h-1.5 w-1 rounded-full bg-zinc-200" />
            </span>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-6 pb-10 md:px-10 md:pb-14">
          <div className="relative mx-auto h-48 max-w-[1400px] md:h-44">
            {motionAllowed && ANNOTATIONS.map((card) => {
              const visible = visibleCards.includes(card.id);
              const position = card.position ?? "left";
              const anchor = position === "right"
                ? "right-0"
                : position === "center"
                  ? "left-1/2 -translate-x-1/2"
                  : "left-0";
              return (
                <div
                  key={card.id}
                  aria-hidden={!visible}
                  className={`absolute bottom-0 w-[min(92vw,440px)] rounded-xl border border-white/15 bg-[#101116]/85 p-6 shadow-2xl backdrop-blur-xl transition-[opacity,transform] duration-500 ${anchor} ${
                    visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                  style={{
                    transitionDuration: visible ? "500ms, 500ms" : "180ms, 360ms",
                    transitionDelay: visible ? "0ms, 0ms" : "360ms, 0ms",
                  }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-indigo-200">{card.eyebrow}</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-white md:text-2xl">{card.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-200">{card.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
