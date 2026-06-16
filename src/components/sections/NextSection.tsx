"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";

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

const PROJECTS = [
  {
    title: "Aurora — 3D Product Tour",
    tag: "WebGL · R3F",
    blurb:
      "A scroll-driven product reveal rendered in real time, with a frame-synced narrative.",
  },
  {
    title: "Lumen Design System",
    tag: "React · TypeScript",
    blurb:
      "A token-driven component library powering five products with one source of truth.",
  },
  {
    title: "Drift — Scrollytelling",
    tag: "Canvas · GSAP",
    blurb:
      "Cinematic frame-sequence storytelling, the same technique driving this very hero.",
  },
];

export function NextSection() {
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
          A few things I&apos;m proud of.
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="mt-5 max-w-[52ch] text-lg text-zinc-400"
        >
          A snapshot of recent builds — interactive sites, design systems, and
          experiments at the edge of what the browser can do.
        </motion.p>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {PROJECTS.map((p) => (
            <motion.div
              key={p.title}
              variants={itemVariants}
              className="group flex flex-col justify-between rounded-[20px] border border-white/10 bg-white/[0.03] p-7 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.05]"
              style={{ boxShadow: "var(--card-shadow)" }}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-indigo-300">
                    {p.tag}
                  </span>
                  <ArrowUpRight
                    weight="bold"
                    className="size-5 text-zinc-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                  />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {p.blurb}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          variants={itemVariants}
          id="contact"
          className="mt-24 flex flex-col items-start justify-between gap-6 rounded-[24px] border border-white/10 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-10 md:flex-row md:items-center md:p-14"
          style={{ boxShadow: "var(--card-shadow)" }}
        >
          <div>
            <h3 className="max-w-[18ch] text-3xl font-semibold tracking-tighter md:text-4xl">
              Have a role or a project in mind?
            </h3>
            <p className="mt-3 max-w-[44ch] text-zinc-400">
              I&apos;m currently open to new opportunities. Let&apos;s build
              something memorable together.
            </p>
          </div>
          <a
            href="mailto:hello@ming.dev"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-zinc-950 transition-all duration-300 hover:bg-zinc-200"
          >
            Get in touch
            <ArrowUpRight
              weight="bold"
              className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
