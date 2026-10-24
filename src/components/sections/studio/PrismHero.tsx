"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import { SITE } from "@/lib/seo";
import { SERVICE_RAYS } from "@/lib/studio";
import { SERVICE_ICONS } from "./serviceIcons";
import styles from "./Studio.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

type Geometry = { width: number; height: number; beam: string; rays: string[] };

// Layout centre of `el` within `root`. Offsets ignore transforms, so the
// reveal animation and the crystal's tilt never shift the rays.
function centreIn(el: HTMLElement, root: HTMLElement) {
  let x = el.offsetWidth / 2;
  let y = el.offsetHeight / 2;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/**
 * Light enters the crystal and leaves as three rays, one per service: the
 * Ming Creatives story (明, "ming", is light) told as the section's opening.
 * Rays are measured from the live layout, so they always land on their
 * service; below `lg` the layout stacks and each service keeps its colour as
 * a rule instead.
 */
export function PrismHero({ dark, reduced }: { dark: boolean; reduced: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const crystalRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const crystal = crystalRef.current;
    if (!root || !crystal) return;
    const measure = () => {
      if (window.innerWidth < 1024) {
        setGeometry(null);
        return;
      }
      const width = root.offsetWidth;
      const { x: cx, y: cy } = centreIn(crystal, root);
      // From the sunrise corner, curving into the crystal.
      const beam = `M ${width + 60} -80 C ${width - 60} ${cy * 0.3}, ${cx + 220} ${cy - 70}, ${cx + 10} ${cy - 6}`;
      const rays = dotRefs.current.map((dot) => {
        if (!dot) return "";
        const { x, y } = centreIn(dot, root);
        const sx = cx - 8;
        const sy = cy + 14;
        const drop = y - sy;
        return `M ${sx} ${sy} C ${sx - 30} ${sy + drop * 0.55}, ${x} ${y - drop * 0.5}, ${x} ${y}`;
      });
      setGeometry({ width, height: root.offsetHeight, beam, rays });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    document.fonts?.ready.then(measure);
    const sight = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLit(true);
        sight.disconnect();
      },
      { threshold: 0.2 },
    );
    sight.observe(root);
    return () => {
      observer.disconnect();
      sight.disconnect();
    };
  }, []);

  // The crystal leans toward the pointer.
  useEffect(() => {
    const tilt = tiltRef.current;
    if (!tilt || reduced) return;
    let frame = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    const step = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      tilt.style.transform = `rotateY(${(-14 + x * 12).toFixed(2)}deg) rotateX(${(8 - y * 9).toFixed(2)}deg)`;
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.002 ? requestAnimationFrame(step) : 0;
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      tx = (event.clientX / window.innerWidth - 0.5) * 2;
      ty = (event.clientY / window.innerHeight - 0.5) * 2;
      if (!frame) frame = requestAnimationFrame(step);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  const reveal = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.7, ease: EASE },
      };
  // The hero sits on the sky's light top, so dark-ink skies get near-black
  // text there. The services sit lower, in the deeper band, and stay white.
  const lightInk = "text-white [text-shadow:0_1px_2px_rgba(20,24,90,0.28),0_2px_22px_rgba(20,24,90,0.38)]";
  const ink = dark ? "text-[#0a0c1c]" : lightInk;
  const soft = dark ? "text-[#0a0c1c]/80" : "text-white/85";
  // Navbar black: solid for the primary action, smoked glass for the secondary.
  const primary =
    "border border-white/10 bg-[#07080c]/90 text-white shadow-[0_12px_30px_-14px_rgba(7,8,12,0.7)] backdrop-blur-xl hover:bg-[#07080c] focus-visible:outline-[#07080c]";
  const secondary =
    "border border-white/20 bg-[#07080c]/50 text-white backdrop-blur-xl hover:bg-[#07080c]/70 focus-visible:outline-[#07080c]";

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-[1320px] px-6 pt-32 md:px-10 md:pt-40">
      {geometry ? (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={geometry.width}
          height={geometry.height}
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          fill="none"
        >
          <defs>
            <filter id="prism-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>
          <path d={geometry.beam} pathLength={1} className={styles.draw} data-lit={lit} stroke="#fff" strokeOpacity={0.45} strokeWidth={7} filter="url(#prism-glow)" />
          <path d={geometry.beam} pathLength={1} className={styles.draw} data-lit={lit} stroke="#fff" strokeWidth={1.6} strokeLinecap="round" />
          {lit && !reduced ? <path d={geometry.beam} pathLength={1} className={styles.pulse} stroke="#fff" strokeWidth={2.4} strokeLinecap="round" /> : null}
          {geometry.rays.map((d, i) => {
            const ray = SERVICE_RAYS[i];
            const on = active === null || active === i;
            return (
              <g key={i} style={{ opacity: on ? 1 : 0.28, transition: "opacity 300ms ease" }}>
                <path d={d} pathLength={1} className={`${styles.draw} ${styles.ray}`} data-lit={lit} style={{ "--i": i } as React.CSSProperties} stroke={ray.color} strokeOpacity={0.55} strokeWidth={active === i ? 12 : 8} filter="url(#prism-glow)" />
                <path d={d} pathLength={1} className={`${styles.draw} ${styles.ray}`} data-lit={lit} style={{ "--i": i } as React.CSSProperties} stroke={ray.color} strokeWidth={active === i ? 2.6 : 1.7} strokeLinecap="round" />
                {lit && !reduced ? <path d={d} pathLength={1} className={styles.pulse} style={{ animationDelay: `${1.6 + i * 0.5}s` }} stroke="#fff" strokeWidth={2.2} strokeLinecap="round" /> : null}
              </g>
            );
          })}
        </svg>
      ) : null}

      <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <motion.div {...reveal} className={`order-2 lg:order-1 ${ink}`}>
          <p className="flex items-center gap-2 text-sm font-medium text-white [text-shadow:0_1px_10px_rgba(20,24,90,0.45)]">
            <span aria-hidden="true" className="h-px w-8 bg-current" />
            明 · Ming
          </p>
          <h2 id="studio-heading" className="mt-5 max-w-[13ch] text-balance text-[clamp(2.6rem,5.6vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.035em]">
            Problems in. <span className="block">Ideas out.</span>
          </h2>
          <p className={`mt-6 max-w-[44ch] text-[17px] leading-7 md:text-xl md:leading-8 ${soft}`}>
            From AI films to production AI agents and immersive web products, I take your idea from concept to launch.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 [text-shadow:none]">
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex h-11 items-center gap-1.5 rounded-full px-5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${primary}`}
            >
              Start a project <ArrowUpRight aria-hidden="true" size={14} weight="bold" />
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer me"
              className={`inline-flex h-11 items-center rounded-full px-5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${secondary}`}
            >
              Follow @ming.creatives
            </a>
          </div>
        </motion.div>

        <div ref={crystalRef} className="relative order-1 mx-auto grid size-[168px] place-items-center [perspective:900px] sm:size-[180px] lg:order-2 lg:mx-auto lg:size-[320px]">
          <span aria-hidden="true" className={styles.bloom} />
          <div ref={tiltRef} className={styles.crystal}>
            <Image src={SITE.logo} alt="" width={260} height={260} className="size-full scale-[1.12] object-cover" />
            {reduced ? null : <span aria-hidden="true" className={styles.glint} />}
          </div>
        </div>
      </div>

      <motion.div {...reveal} className={`relative mt-20 lg:mt-48 ${lightInk}`}>
        <ol aria-label="What Ming can build for you" className="grid gap-6 lg:grid-cols-3 lg:gap-10">
          {SITE.services.map((service, i) => {
            const ray = SERVICE_RAYS[i];
            const Icon = SERVICE_ICONS[i];
            return (
              <li
                key={service.name}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                className="border-l-2 pl-5 lg:border-l-0 lg:pl-0"
                style={{ borderColor: ray.color }}
              >
                <span
                  ref={(node) => {
                    dotRefs.current[i] = node;
                  }}
                  aria-hidden="true"
                  className="hidden size-3 rounded-full lg:block"
                  style={{ background: ray.color, boxShadow: `0 0 0 5px rgba(${ray.rgb},0.22), 0 0 28px rgba(${ray.rgb},0.95)` }}
                />
                <p className="flex items-center gap-2.5 text-[clamp(1.5rem,2.3vw,2rem)] font-medium tracking-[-0.03em] lg:mt-6">
                  <Icon aria-hidden="true" weight="bold" className="size-[1em] shrink-0" style={{ color: ray.color }} />
                  {service.shortName}
                </p>
                <p className="mt-2 text-[15px] leading-6 text-white/85">{service.outcome}</p>
              </li>
            );
          })}
        </ol>
      </motion.div>
    </div>
  );
}
