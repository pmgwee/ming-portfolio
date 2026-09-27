"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import {
  PROJECTS,
  PROTOTYPE_IMAGE_URLS,
  type ShowcaseProject,
} from "@/lib/projects/project";
import { ProjectCursorPreview } from "./ProjectCursorPreview";

const FOLLOW_SPRING = { stiffness: 260, damping: 28, mass: 0.6 };

export function WorksShowcase() {
  const reduced = useReducedMotion();
  const [canHover, setCanHover] = useState(false);
  const [active, setActive] = useState<ShowcaseProject | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, FOLLOW_SPRING);
  const springY = useSpring(mouseY, FOLLOW_SPRING);
  const initRef = useRef(false);
  const enabled = canHover && !reduced;

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    PROTOTYPE_IMAGE_URLS.forEach((url) => {
      const image = new Image();
      image.src = url;
    });
  }, [enabled]);

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!enabled) return;
    mouseX.set(event.clientX);
    mouseY.set(event.clientY);
    if (!initRef.current) {
      springX.jump(event.clientX);
      springY.jump(event.clientY);
      initRef.current = true;
    }
  };

  return (
    <section
      id="earlier-work"
      aria-labelledby="earlier-work-heading"
      onPointerMove={handlePointerMove}
      onMouseLeave={() => setActive(null)}
      className="scroll-mt-28 relative z-20 border-t border-white/10 bg-[#07080c] px-6 py-20 md:px-10 md:py-24"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <p className="text-sm font-medium text-indigo-200">Selected archive</p>
        <h2
          id="earlier-work-heading"
          className="mt-3 text-[clamp(2rem,4.2vw,3.75rem)] font-semibold tracking-[-0.04em] text-zinc-100"
        >
          Side projects
        </h2>
        <p className="mt-4 max-w-[64ch] text-base leading-relaxed text-zinc-300">
          Early products and prototypes that shaped the work I build today.
          Each card shows its current status.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => {
            const card = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-indigo-200">{project.category}</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-100">
                      {project.title}
                    </h3>
                  </div>
                  {project.href ? (
                    <ArrowUpRight aria-hidden="true" weight="bold" className="size-5 shrink-0 text-zinc-300" />
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                  {project.description}
                </p>
                <p className="mt-5 border-t border-white/10 pt-4 text-xs font-medium text-zinc-300">
                  {project.status}
                </p>
                <ul aria-label={`${project.title} technologies`} className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li key={tag} className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-zinc-300">
                      {tag}
                    </li>
                  ))}
                </ul>
              </>
            );

            return (
              <article
                key={project.id}
                onMouseEnter={() => enabled && setActive(project)}
                onFocus={() => enabled && setActive(project)}
                onBlur={() => setActive(null)}
                className={`rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.05] ${
                  enabled && active && active.id !== project.id ? "opacity-70" : "opacity-100"
                }`}
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title}: open public project demo`}
                    className="block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200"
                  >
                    {card}
                  </a>
                ) : card}
              </article>
            );
          })}
        </div>
      </div>

      {enabled && (
        <ProjectCursorPreview active={active} springX={springX} springY={springY} />
      )}
    </section>
  );
}
