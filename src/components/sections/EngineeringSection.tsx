"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import { ENGINEERING_PROJECTS } from "@/lib/engineering-projects";

const PREVIEW_WIDTH = 360;
const PREVIEW_HEIGHT = 300;

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
    ENGINEERING_PROJECTS.forEach((project) => {
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

  const activeProject = ENGINEERING_PROJECTS.find((project) => project.slug === activeSlug);

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
          <p className="text-sm font-medium text-indigo-200">Selected engineering work</p>
          <h2
            id="engineering-heading"
            className="mt-3 text-[clamp(2rem,4.2vw,4.25rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-zinc-100"
          >
            Production AI systems
          </h2>
          <p className="mt-5 max-w-[64ch] text-base leading-relaxed text-zinc-300 md:text-lg">
            Systems I&apos;ve built, operated, or contributed to—from always-on
            agents to retrieval and community automation. Open a case study for
            the full scope and proof.
          </p>
        </div>

        <div className="mt-12 border-t border-white/15">
          {ENGINEERING_PROJECTS.map((project, index) => (
            <article
              key={project.slug}
              className="grid gap-5 border-b border-white/10 py-9 md:grid-cols-[minmax(15rem,0.75fr)_minmax(0,1.25fr)] md:gap-12 md:py-11"
            >
              <div>
                <p className="font-mono text-xs tabular-nums text-indigo-200/80">
                  {String(index + 1).padStart(2, "0")} / 05
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
                    className="decoration-white/35 underline decoration-[1px] underline-offset-[0.18em] transition-colors hover:text-white hover:decoration-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200"
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
                <p className="max-w-[65ch] text-base leading-relaxed text-zinc-200 md:text-lg">
                  {project.summary}
                </p>
                <p className="mt-4 max-w-[72ch] text-sm leading-relaxed text-zinc-400">
                  {project.operation}
                </p>
                <p className="mt-5 max-w-[72ch] border-l-2 border-indigo-300/70 pl-4 text-sm font-medium leading-relaxed text-zinc-100 md:text-base">
                  {project.outcome}
                </p>
                <Link
                  href={`/work/${project.slug}`}
                  className="group mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-indigo-200 underline decoration-indigo-300/50 underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300"
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
                className="w-[360px] overflow-hidden rounded-xl border border-white/20 bg-[#111216] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
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
                <figcaption className="border-t border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-300">
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
