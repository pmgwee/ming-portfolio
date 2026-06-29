"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { PROJECTS } from "@/lib/projects/project";

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

export function WorksShowcase() {
  return (
    <section
      id="work"
      className="relative z-20 border-t border-white/5 bg-[#07080c] px-6 py-28 md:px-10 md:py-40"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-[1400px]"
      >
        <motion.div variants={itemVariants}>
          <EyebrowBadge>Selected Work</EyebrowBadge>
        </motion.div>
        <motion.h2
          variants={itemVariants}
          className="mt-6 max-w-[20ch] text-4xl font-semibold tracking-tighter md:text-6xl"
        >
          Four products • All production.
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="mt-5 max-w-[52ch] text-lg text-zinc-400"
        >
          EdTech, PropTech, AI, and mobile — each platform solving a real
          problem, owned by real users.
        </motion.p>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PROJECTS.map((p) => {
            const Wrapper = p.href
              ? "a"
              : ("div" as "a" | "div");
            const linkProps = p.href
              ? { href: p.href, target: "_blank", rel: "noopener noreferrer" }
              : {};
            return (
              <motion.div
                key={p.id}
                variants={itemVariants}
                className="group flex flex-col justify-between rounded-[20px] border border-white/10 bg-white/[0.03] p-7 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.05]"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                <Wrapper {...linkProps} className="flex flex-col gap-4">
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
    </section>
  );
}
