"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import { ENGINEERING_PROJECTS } from "@/lib/engineering-projects";

const PREVIEW_WIDTH = 360;
const PREVIEW_HEIGHT = 300;
const FEATURED_ORDER = [
  "personal-ai-agent",
  "persistent-second-brain",
  "bersamaai",
  "inti-mba-rag",
  "career-ops",
];
const HOME_PROJECTS = [...ENGINEERING_PROJECTS].sort(
  (a, b) => FEATURED_ORDER.indexOf(a.slug) - FEATURED_ORDER.indexOf(b.slug),
);

export function EngineeringSection() {
  const reducedMotion = useReducedMotion();
  const [canHover, setCanHover] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 320, damping: 32 });
  const y = useSpring(pointerY, { stiffness: 320, damping: 32 });
  const previewEnabled = canHover && !reducedMotion;

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!previewEnabled) return;
    HOME_PROJECTS.forEach((project) => {
      const image = new Image();
      image.src = `/project-previews/${project.slug}.webp`;
    });
  }, [previewEnabled]);

  const movePreview = (event: React.PointerEvent) => {
    if (!previewEnabled) return;
    const nextX = Math.max(12, Math.min(window.innerWidth - PREVIEW_WIDTH - 12, event.clientX + 120));
    const nextY = Math.max(12, Math.min(window.innerHeight - PREVIEW_HEIGHT - 12, event.clientY - 120));
    pointerX.set(nextX);
    pointerY.set(nextY);
  };

  const activeProject = HOME_PROJECTS.find((project) => project.slug === activeSlug);

  return (
    <section
      id="ai-systems"
      aria-labelledby="engineering-heading"
      onPointerMove={movePreview}
      onPointerLeave={() => setActiveSlug(null)}
      className="scroll-mt-28 border-t border-white/10 bg-[#07080c] px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="max-w-3xl">
          <h2
            id="engineering-heading"
            className="text-[clamp(2rem,4.2vw,4.25rem)] font-medium leading-[1.04] tracking-[-0.03em] text-zinc-100"
          >
            AI-Project
          </h2>
        </div>

        <div className="mt-12 border-t border-white/15">
          {HOME_PROJECTS.map((project, index) => (
            <article
              key={project.slug}
              className="grid gap-5 border-b border-white/10 py-9 md:grid-cols-[minmax(15rem,0.75fr)_minmax(0,1.25fr)] md:gap-12 md:py-12"
            >
              <div>
                <p className="font-mono text-xs tabular-nums text-brand-200/80">
                  {String(index + 1).padStart(2, "0")} / {String(HOME_PROJECTS.length).padStart(2, "0")}
                </p>
                <h3 className="mt-3 max-w-[20ch] text-[clamp(1.5rem,2.4vw,2.5rem)] font-semibold leading-[1.12] tracking-[-0.035em] text-zinc-100">
                  <Link
                    href={`/work/${project.slug}`}
                    onPointerEnter={(event) => {
                      if (!previewEnabled) return;
                      movePreview(event);
                      setActiveSlug(project.slug);
                    }}
                    onPointerLeave={() => setActiveSlug(null)}
                    className="decoration-white/35 underline decoration-[1px] underline-offset-[0.18em] transition-colors hover:text-white hover:decoration-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-200"
                  >
                    {project.title}
                  </Link>
                </h3>
                {project.slug === "career-ops" && (
                  <p className="mt-4 max-w-[34ch] text-xs leading-relaxed text-zinc-400">
                    My role · {project.role}
                  </p>
                )}
              </div>

              <div>
                <p className="max-w-[58ch] text-lg font-medium leading-snug tracking-[-0.01em] text-zinc-100 md:text-xl">{project.homeLead}</p>
                <p className="mt-5 flex max-w-[64ch] flex-wrap gap-x-3 gap-y-1 border-t border-white/10 pt-4 text-sm leading-relaxed">
                  <span className="font-medium text-brand-200">{project.homeSignalLabel}</span>
                  <span className="text-zinc-300">{project.homeSignal}</span>
                </p>
                <Link
                  href={`/work/${project.slug}`}
                  className="group mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-200 underline decoration-brand-300/50 underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
                >
                  Read case study
                  <ArrowUpRight aria-hidden="true" weight="bold" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {previewEnabled && (
        <motion.div
          aria-hidden="true"
          style={{ x, y }}
          className="pointer-events-none fixed left-0 top-0 z-50"
        >
          <AnimatePresence mode="wait">
            {activeProject && (
              <motion.figure
                key={activeProject.slug}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-[360px] overflow-hidden rounded-md border border-white/20 bg-[#111216] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
              >
                {/* Decorative conceptual artwork, not a product screenshot. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/project-previews/${activeProject.slug}.webp`}
                  alt=""
                  width="360"
                  height="270"
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="border-t border-white/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-zinc-300">
                  Illustrative concept
                </figcaption>
              </motion.figure>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
