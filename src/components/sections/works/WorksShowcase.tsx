"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import {
  PROJECTS,
  PROTOTYPE_IMAGE_URLS,
  type ShowcaseProject,
} from "@/lib/projects/project";
import { ProjectCursorPreview } from "./ProjectCursorPreview";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
} as const;

// Cursor-follow feel — a touch of lag for the premium spring trail.
const FOLLOW_SPRING = { stiffness: 260, damping: 28, mass: 0.6 };

export function WorksShowcase() {
  const reduced = useReducedMotion();
  const [canHover, setCanHover] = useState(false);
  const [active, setActive] = useState<ShowcaseProject | null>(null);

  // Raw cursor (viewport coords) → spring-followed for the floating preview.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, FOLLOW_SPRING);
  const springY = useSpring(mouseY, FOLLOW_SPRING);
  const initRef = useRef(false);

  // The popout is a desktop-only flourish — skip it on touch / reduced motion.
  const enabled = canHover && !reduced;

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Preload prototype images so the first hover pops with no load flash.
  useEffect(() => {
    if (!enabled) return;
    PROTOTYPE_IMAGE_URLS.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [enabled]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!enabled) return;
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    // Snap the springs to the cursor on the first move so the preview never
    // slides in from (0,0) on the very first hover.
    if (!initRef.current) {
      springX.jump(e.clientX);
      springY.jump(e.clientY);
      initRef.current = true;
    }
  };

  return (
    <section
      id="work"
      onPointerMove={handlePointerMove}
      onMouseLeave={() => setActive(null)}
      className="relative z-20 border-t border-white/5 bg-[#07080c] px-6 py-14 md:px-10 md:py-18"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-[1400px]"
      >
        <motion.h2
          variants={itemVariants}
          className="max-w-[20ch] text-4xl font-semibold tracking-tighter md:text-6xl"
        >
          Four products • All in production
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="mt-5 max-w-[52ch] text-lg text-zinc-400"
        >
          EdTech, PropTech, AI, and mobile — each platform solving a real
          problem, target real users.
        </motion.p>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PROJECTS.map((p) => {
            const Wrapper = p.href ? "a" : ("div" as "a" | "div");
            const linkProps = p.href
              ? { href: p.href, target: "_blank", rel: "noopener noreferrer" }
              : {};
            // While one card is hovered, the others recede a touch (focus).
            const dim = enabled && active !== null && active.id !== p.id;
            return (
              <motion.div
                key={p.id}
                variants={itemVariants}
                onMouseEnter={() => {
                  if (enabled) setActive(p);
                }}
                onMouseLeave={() => setActive(null)}
                className="group flex flex-col justify-between rounded-[20px] border border-white/10 bg-white/[0.03] p-7 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.05]"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                <Wrapper
                  {...linkProps}
                  className={`flex flex-col gap-4 transition-opacity duration-300 ${
                    dim ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-indigo-300">
                      {p.category}
                    </span>
                    <ArrowUpRight
                      weight="bold"
                      className={`size-5 shrink-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                        p.href ? "text-zinc-400 group-hover:text-white" : "text-zinc-700"
                      }`}
                    />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-zinc-100">
                    {p.title}
                  </h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">
                    {p.description}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[10px] text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Cursor-following prototype preview (desktop / motion-allowed only). */}
      {enabled && (
        <ProjectCursorPreview
          active={active}
          springX={springX}
          springY={springY}
        />
      )}
    </section>
  );
}
