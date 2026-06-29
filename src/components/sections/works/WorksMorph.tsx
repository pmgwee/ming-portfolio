"use client";

import { useRef, useState } from "react";
import {
  motion,
  cubicBezier,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  useInView,
  type MotionValue,
} from "framer-motion";
import { ArrowUp, ArrowDown } from "@phosphor-icons/react";

import { Button } from "@/components/ui/Button";
import {
  useContainerSize,
  type ContainerSize,
} from "@/hooks/useContainerSize";
import {
  MORPH_CARDS,
  morphCopy,
  heroCopy,
  PROJECTS,
  type ShowcaseProject,
} from "@/lib/projects/project";

/**
 * WorksMorph — a single scroll-scrubbed morph that fuses two beats: the four
 * project cards fan out, collapse into a centred stack, then cascade into a
 * right-side grid. Section-1 hero copy fades out as the fan collapses; a
 * section-2 "how I work" block fades in as the grid forms. Pure scroll, fully
 * reversible. Cloned from the goo-ai ShowcaseMorph and rebuilt on this site's
 * design tokens (indigo/violet accent, neumorphic card shadow, Geist Mono).
 */

const EASE = [0.16, 1, 0.3, 1] as const; // site-wide mount ease

// Total pinned scroll length, in viewport heights. Master speed knob: bigger =
// the whole fan → stack → grid morph scrubs slower.
const SECTION_VH = 600;

// Scroll-progress keyframe stops shared by every card property (0 = top of the
// pinned section, 1 = bottom). Movement happens between STOPS[1] and STOPS[4];
// the ends are settle/hold beats.
const STOPS = [0, 0.15, 0.4, 0.5, 0.85, 1];
type EasingFn = (v: number) => number;
const EASE_HOLD: EasingFn = (v) => v; // linear hold
const POWER3_INOUT = cubicBezier(0.65, 0, 0.35, 1); // fan → stack
const POWER2_OUT = cubicBezier(0.25, 1, 0.5, 1); // stack → grid
const CARD_EASES: EasingFn[] = [
  EASE_HOLD,
  POWER3_INOUT,
  EASE_HOLD,
  POWER2_OUT,
  EASE_HOLD,
];

const DECK = MORPH_CARDS.length; // one card per project
const CENTER = (DECK - 1) / 2; // symmetric centre index

// Right-side cascading grid slots — fractions of the measured stage, front→back.
const GRID: { x: number; y: number; rot: number; scale: number; z: number }[] = [
  { x: 0.22, y: -0.16, rot: -3, scale: 1.0, z: 7 },
  { x: 0.3, y: 0.02, rot: 2, scale: 0.96, z: 6 },
  { x: 0.14, y: 0.18, rot: -4, scale: 0.93, z: 5 },
  { x: 0.34, y: 0.22, rot: 3, scale: 0.9, z: 4 },
  { x: 0.06, y: -0.04, rot: 1, scale: 0.98, z: 3 },
  { x: 0.24, y: 0.1, rot: -2, scale: 0.95, z: 2 },
  { x: 0.4, y: -0.1, rot: 4, scale: 0.88, z: 1 },
];

// Lift the section-1 fan up a touch so the deck sits higher under the title.
const FAN_LIFT = -0.1; // fraction of stage height

// @handle corner pills on the two outer fan cards only.
const BUBBLES: Record<number, { side: "left" | "right" }> = {
  0: { side: "left" },
  [DECK - 1]: { side: "right" },
};

const isExternal = (href: string) => /^https?:|^mailto:/.test(href);
const extProps = (href: string) =>
  isExternal(href)
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

// Entrance animations fire when the section scrolls INTO view — not on mount.
// This section sits mid-page (after the tall Hero + Showcase), so a mount-time
// intro would play entirely off-screen and be missed. A single `useInView`
// boolean drives every intro via `animate` (with `initial={false}`), so the
// server and first client render agree (both render the not-yet-in-view state)
// — no hydration mismatch — and it still animates once scrolled to. `once`
// keeps it a one-shot reveal; `amount` triggers it as the section arrives.
const INVIEW_OPTS = { once: true, amount: 0.3 } as const;

export function WorksMorph() {
  const reduced = useReducedMotion();
  // `id="works"` lives on this always-rendered wrapper, NOT the inner sections:
  // the mobile static + desktop pinned variants are mutually `display:none`, so
  // a shared id on both would be a duplicate that resolves to the hidden one
  // (which is why the nav/footer "Works" anchor went nowhere). The wrapper has
  // no layout box of its own, so the anchor lands on whichever variant is shown.
  return (
    <div id="works">
      {reduced ? <ReducedMorph /> : <MorphStage />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop scroll-morph (all morph hooks live here)                    */
/* ------------------------------------------------------------------ */

function MorphStage() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const p = scrollYProgress;
  const size = useContainerSize(stageRef);
  // One in-view signal drives every entrance intro (see INVIEW_OPTS).
  const inView = useInView(viewRef, INVIEW_OPTS);

  return (
    <>
      {/* Mobile — static stacked fallback (no pin, no scrub). */}
      <div className="md:hidden">
        <StaticSections hideHero />
      </div>

      {/* Desktop — pinned, scroll-scrubbed morph. */}
      <section
        ref={sectionRef}
        className="relative hidden bg-[#07080c] md:block"
        aria-label="Project showcase"
        style={{ height: `${SECTION_VH}vh` }}
      >
        <div
          ref={viewRef}
          className="sticky top-0 h-[100dvh] overflow-hidden"
        >
          {/* Ambient accent glow behind the deck. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[80vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(99,102,241,0.35), transparent)",
            }}
          />

          <HeroText p={p} inView={inView} />

          {/* Measured stage = the card coordinate space. */}
          <div ref={stageRef} className="absolute inset-0">
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={
                inView
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 240, scale: 0.92 }
              }
              transition={{ duration: 3.0, ease: EASE, delay: 0.3 }}
            >
              <CardLayer p={p} size={size} inView={inView} />
            </motion.div>
          </div>

          <EcommerceText p={p} />
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Shared persistent card layer                                        */
/* ------------------------------------------------------------------ */

function CardLayer({
  p,
  size,
  inView,
}: {
  p: MotionValue<number>;
  size: ContainerSize;
  inView: boolean;
}) {
  // zIndex can't tween — swap depth order discretely at the hinge.
  const [phase, setPhase] = useState<"fan" | "grid">("fan");
  useMotionValueEvent(p, "change", (v) => {
    setPhase((cur) => {
      const next = v < 0.45 ? "fan" : "grid";
      return cur === next ? cur : next;
    });
  });

  // Avoid the one-frame {0,0} collapse before the stage is measured.
  if (!size.w) return null;

  return (
    <>
      {MORPH_CARDS.map((card, i) => (
        <MorphCard
          key={card.key}
          card={card}
          index={i}
          p={p}
          size={size}
          phase={phase}
          inView={inView}
        />
      ))}
    </>
  );
}

function MorphCard({
  card,
  index,
  p,
  size,
  phase,
  inView,
}: {
  card: ShowcaseProject;
  index: number;
  p: MotionValue<number>;
  size: ContainerSize;
  phase: "fan" | "grid";
  inView: boolean;
}) {
  const { w: W, h: H } = size;
  const m = index - CENTER;

  // Fan (settled section-1 arc).
  const fanX = m * 0.085 * W;
  const fanY = Math.abs(m) * 0.018 * H;
  const fanRot = m * 4.5;
  // Centred tight stack (the hinge).
  const stackX = m * 0.004 * W;
  const stackY = m * 0.006 * H;
  const stackRot = m * 1.5;
  // Cascading grid slot.
  const g = GRID[index];
  const gridX = g.x * W;
  const gridY = g.y * H;

  const x = useTransform(
    p,
    STOPS,
    [fanX, fanX, stackX, stackX, gridX, gridX],
    { ease: CARD_EASES },
  );
  const fanLift = FAN_LIFT * H;
  const y = useTransform(
    p,
    STOPS,
    [fanY + fanLift, fanY + fanLift, stackY, stackY, gridY, gridY],
    { ease: CARD_EASES },
  );
  const rotate = useTransform(
    p,
    STOPS,
    [fanRot, fanRot, stackRot, stackRot, g.rot, g.rot],
    { ease: CARD_EASES },
  );
  const scale = useTransform(
    p,
    STOPS,
    [1, 1, 0.92, 0.92, g.scale, g.scale],
    { ease: CARD_EASES },
  );
  // Bubble pills fade out as the fan collapses (hook called for every card to
  // keep the hook count stable; only outer cards render a bubble).
  const bubbleOpacity = useTransform(p, [0, 0.12], [1, 0]);

  const cardW = Math.min(Math.max(W * 0.14, 140), 200);
  const cardH = cardW * (4 / 3); // aspect-[3/4]
  const z = phase === "fan" ? Math.round(DECK - Math.abs(m)) : g.z;

  const bubble = BUBBLES[index];

  return (
    <motion.div
      className="absolute rounded-[20px]"
      style={{
        x,
        y,
        rotate,
        scale,
        zIndex: z,
        width: cardW,
        left: `calc(50% - ${cardW / 2}px)`,
        top: `calc(50% - ${cardH / 2}px)`,
        boxShadow: "var(--card-shadow)",
      }}
    >
      <CardFace project={card} />

      {bubble && (
        <motion.span
          className={`absolute z-10 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-200 backdrop-blur-md -top-3 ${
            bubble.side === "left" ? "-left-3" : "-right-3"
          }`}
          // In-view pop animates SCALE; scroll-exit drives OPACITY (no conflict).
          initial={false}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 12,
            delay: 0.4 + index * 0.06,
          }}
          style={{ opacity: bubbleOpacity, rotate: -fanRot }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400" />
          {card.handle}
        </motion.span>
      )}
    </motion.div>
  );
}

function CardFace({ project }: { project: ShowcaseProject }) {
  return (
    // Frosted-glass tray (iOS-style): a translucent, blurred bezel frames the
    // screenshot so dark app captures separate cleanly from the dark page.
    <div className="relative aspect-[3/4] rounded-[20px] border border-white/15 bg-white/[0.08] p-1.5 backdrop-blur-xl">
      {/* Inner screenshot — inset + own rounding, on a lifted surface so it
          never reads as a flat black void while loading. */}
      <div className="relative h-full w-full overflow-hidden rounded-[14px] bg-zinc-900 ring-1 ring-inset ring-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover"
          loading="eager"
        />
        {/* Legibility scrim for the caption. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-2.5">
          <p className="font-mono text-[9px] font-medium uppercase tracking-wider text-white/75">
            {project.category}
          </p>
          <p className="text-[11px] font-semibold leading-tight text-white">
            {project.title}
          </p>
        </div>
      </div>
      {/* Glass specular sheen + top hairline highlight. */}
      <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/15 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-3 top-px h-px rounded-full bg-white/25" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section-1 hero text — fades / translates OUT                        */
/* ------------------------------------------------------------------ */

function HeroText({ p, inView }: { p: MotionValue<number>; inView: boolean }) {
  const accent = heroCopy.titleAccent;
  const headOpacity = useTransform(p, [0, 0.18, 0.3, 1], [1, 1, 0, 0]);
  const headY = useTransform(p, [0, 0.3], [0, -56]);
  const tailOpacity = useTransform(p, [0, 0.12, 0.28, 1], [1, 1, 0, 0]);
  const tailY = useTransform(p, [0, 0.28], [0, -32]);

  const [active, setActive] = useState(true);
  useMotionValueEvent(p, "change", (v) => setActive(v < 0.2));

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-between px-6 pb-[15vh] pt-5 text-center"
      style={{ pointerEvents: active ? "auto" : "none" }}
    >
      {/* Heading — one row, dropped to where the second line used to sit
          (the `mt` leaves the old first-row space as breathing room above). */}
      <motion.div style={{ opacity: headOpacity, y: headY }}>
        <motion.h2
          className="mt-[1.15em] whitespace-nowrap text-[clamp(2rem,3.6vw+0.4rem,3rem)] font-semibold leading-[1.08] tracking-tighter text-zinc-100"
          initial={false}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
        >
          {heroCopy.title}{" "}
          {accent && <span className="text-gradient">{accent}</span>}
        </motion.h2>
      </motion.div>

      {/* Subtitle + buttons */}
      <motion.div
        className="flex flex-col items-center"
        style={{ opacity: tailOpacity, y: tailY }}
      >
        <motion.p
          className="max-w-lg text-[clamp(0.95rem,0.6vw+0.8rem,1.05rem)] text-white"
          initial={false}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ delay: 0.45, duration: 0.6, ease: EASE }}
        >
          {heroCopy.subtitle}
        </motion.p>
        {/* <motion.div
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
          initial={false}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ delay: 0.6, duration: 0.6, ease: EASE }}
        >
          <Button
            href={heroCopy.primaryCta.href}
            variant="primary"
            showArrow
            {...extProps(heroCopy.primaryCta.href)}
          >
            {heroCopy.primaryCta.label}
          </Button>
          <Button
            href={heroCopy.secondaryCta.href}
            variant="secondary"
            {...extProps(heroCopy.secondaryCta.href)}
          >
            {heroCopy.secondaryCta.label}
          </Button>
        </motion.div> */}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section-2 "how I work" text — fades IN (left side; grid sits right) */
/* ------------------------------------------------------------------ */

function EcommerceText({ p }: { p: MotionValue<number> }) {
  const eyebrowOpacity = useTransform(p, [0.4, 0.5, 1], [0, 1, 1]);
  const eyebrowY = useTransform(p, [0.4, 0.5], [10, 0]);
  // Subtitle + CTA reveal only AFTER the header words finish staggering in
  // (last word lands at p ≈ 0.825), so the line builds, then the rest follows.
  const tailOpacity = useTransform(p, [0.84, 0.95, 1], [0, 1, 1]);
  const tailY = useTransform(p, [0.84, 0.95], [14, 0]);

  const [active, setActive] = useState(false);
  useMotionValueEvent(p, "change", (v) => setActive(v > 0.55));

  return (
    <div
      className="absolute inset-0 z-20 flex items-center"
      style={{ pointerEvents: active ? "auto" : "none" }}
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="max-w-md md:max-w-lg">
          <motion.p
            className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-indigo-400"
            style={{ opacity: eyebrowOpacity, y: eyebrowY }}
          >
            {morphCopy.eyebrow}
          </motion.p>

          <h2 className="mb-10 mt-3 text-[clamp(1.6rem,2.4vw+0.6rem,2.4rem)] font-semibold leading-[1.1] tracking-tighter text-zinc-100">
            {morphCopy.headerWords.map((word, i) => (
              <HeaderWord
                key={`${word}-${i}`}
                p={p}
                index={i}
                word={word}
                accent={morphCopy.accentRange.includes(i)}
              />
            ))}
          </h2>

          <motion.div style={{ opacity: tailOpacity, y: tailY }}>
            <p className="max-w-md pt-5 text-lg text-zinc-400">
              {morphCopy.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                href={morphCopy.primaryCta.href}
                variant="primary"
                showArrow
                {...extProps(morphCopy.primaryCta.href)}
              >
                {morphCopy.primaryCta.label}
              </Button>
              <Button
                href={morphCopy.secondaryCta.href}
                variant="secondary"
                {...extProps(morphCopy.secondaryCta.href)}
              >
                {morphCopy.secondaryCta.label}
              </Button>
            </div>

            {/* Up / down nav arrows */}
            <div className="mt-8 flex items-center gap-3">
              <ScrollArrow direction="up" />
              <ScrollArrow direction="down" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function HeaderWord({
  p,
  index,
  word,
  accent,
}: {
  p: MotionValue<number>;
  index: number;
  word: string;
  accent: boolean;
}) {
  const start = 0.5 + index * 0.025;
  const opacity = useTransform(p, [start, start + 0.1, 1], [0, 1, 1]);
  const y = useTransform(p, [start, start + 0.1], [12, 0]);
  return (
    <motion.span
      className={`mr-[0.25em] inline-block ${accent ? "text-gradient" : ""}`}
      style={{ opacity, y }}
    >
      {word}
    </motion.span>
  );
}

function ScrollArrow({ direction }: { direction: "up" | "down" }) {
  const onClick = () => {
    const by = direction === "up" ? -window.innerHeight : window.innerHeight;
    // Lenis hijacks the wheel but leaves programmatic scroll to the browser;
    // native smooth scroll is the simplest cross-path that always works here.
    window.scrollBy({ top: by, behavior: "smooth" });
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "up" ? "Scroll up" : "Scroll down"}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-zinc-400 transition-colors hover:border-indigo-400 hover:text-indigo-400"
      style={{ boxShadow: "var(--card-shadow)" }}
    >
      {direction === "up" ? (
        <ArrowUp size={18} weight="bold" />
      ) : (
        <ArrowDown size={18} weight="bold" />
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Reduced-motion + mobile fallback — two static stacked sections      */
/* ------------------------------------------------------------------ */

function ReducedMorph() {
  return <StaticSections />;
}

function StaticSections({ hideHero = false }: { hideHero?: boolean }) {
  return (
    <>
      {/* Section 1 — static fan collapsed to a clean grid. */}
      <section
        className={`flex min-h-[calc(100dvh-5rem)] flex-col items-center justify-center bg-[#07080c] px-6 py-12 text-center${
          hideHero ? " hidden" : ""
        }`}
      >
        <h2 className="max-w-2xl text-balance text-[clamp(2rem,3.6vw+0.4rem,3rem)] font-semibold leading-[1.08] tracking-tighter text-zinc-100">
          {heroCopy.title}{" "}
          <span className="text-gradient">{heroCopy.titleAccent}</span>
        </h2>
        <div className="mt-8 grid w-full max-w-md grid-cols-2 gap-3 sm:max-w-xl sm:grid-cols-4">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="rounded-[20px]"
              style={{ boxShadow: "var(--card-shadow)" }}
            >
              <CompactFace project={project} />
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-lg text-zinc-400">{heroCopy.subtitle}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            href={heroCopy.primaryCta.href}
            variant="primary"
            showArrow
            {...extProps(heroCopy.primaryCta.href)}
          >
            {heroCopy.primaryCta.label}
          </Button>
          <Button
            href={heroCopy.secondaryCta.href}
            variant="secondary"
            {...extProps(heroCopy.secondaryCta.href)}
          >
            {heroCopy.secondaryCta.label}
          </Button>
        </div>
      </section>

      {/* Section 2 — static "how I work" grid. */}
      <section className="bg-[#07080c] px-6 py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1400px] px-0 md:px-4">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-indigo-400">
            {morphCopy.eyebrow}
          </p>
          <h2 className="mt-3 max-w-2xl text-[clamp(1.6rem,2.4vw+0.6rem,2.4rem)] font-semibold leading-[1.1] tracking-tighter text-zinc-100">
            {morphCopy.headerWords.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className={morphCopy.accentRange.includes(i) ? "text-gradient" : ""}
              >
                {word}{" "}
              </span>
            ))}
          </h2>
          <p className="mt-5 max-w-md text-lg text-zinc-400">
            {morphCopy.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              href={morphCopy.primaryCta.href}
              variant="primary"
              showArrow
              {...extProps(morphCopy.primaryCta.href)}
            >
              {morphCopy.primaryCta.label}
            </Button>
            <Button
              href={morphCopy.secondaryCta.href}
              variant="secondary"
              {...extProps(morphCopy.secondaryCta.href)}
            >
              {morphCopy.secondaryCta.label}
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
            {MORPH_CARDS.slice(0, 6).map((card) => (
              <div
                key={card.key}
                className="overflow-hidden rounded-[20px]"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                <CardFace project={card} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function CompactFace({ project }: { project: ShowcaseProject }) {
  return (
    <div className="relative aspect-[3/4] rounded-[20px] border border-white/15 bg-white/[0.08] p-1.5 backdrop-blur-xl">
      <div className="relative h-full w-full overflow-hidden rounded-[14px] bg-zinc-900 ring-1 ring-inset ring-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-2">
          <p className="text-[11px] font-semibold text-white">{project.title}</p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/15 via-transparent to-transparent" />
    </div>
  );
}
