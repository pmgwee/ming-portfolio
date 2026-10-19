"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { ENGINEERING_PROJECTS } from "@/lib/engineering-projects";
import { EXPERIENCE } from "@/lib/experience";
import { PROJECTS } from "@/lib/projects/project";

const EASE = [0.16, 1, 0.3, 1] as const;
const count = (n: number) => String(n).padStart(2, "0");

const CARDS = [
  {
    href: "/ai-projects",
    eyebrow: `${count(ENGINEERING_PROJECTS.length)} case studies`,
    title: "AI agents that run beyond the prototype.",
    body: "See what each system does, what I built myself, and how it runs today.",
    chips: [...ENGINEERING_PROJECTS.slice(0, 2).map((project) => project.title), `+${ENGINEERING_PROJECTS.length - 2} more`],
    cta: "Explore AI Projects",
    glow: "radial-gradient(closest-side, rgba(99,102,241,0.9), transparent)",
  },
  {
    href: "/experiences",
    eyebrow: `${count(EXPERIENCE.length)} roles`,
    title: "From fintech engineering to independent AI consulting.",
    body: "The background behind the work: Computer Science, a fintech engineering internship, and the studio.",
    chips: EXPERIENCE.map((entry) => entry.organization),
    cta: "View Experiences",
    glow: "radial-gradient(closest-side, rgba(255,212,0,0.7), transparent)",
  },
  {
    href: "/side-projects",
    eyebrow: `${count(PROJECTS.length)} side projects`,
    title: "Built to ship. Built to last.",
    body: "Earlier products and prototypes that shaped the systems I build today, each with its status labelled.",
    chips: PROJECTS.map((project) => project.title),
    cta: "See Side Projects",
    glow: "radial-gradient(closest-side, rgba(45,212,191,0.6), transparent)",
  },
];

export function CareerSection() {
  const reduced = useReducedMotion();
  const reveal = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.6, ease: EASE },
      };

  return (
    <section
      id="career"
      aria-labelledby="career-heading"
      className="scroll-mt-28 border-t border-white/10 bg-[#07080c] px-6 py-24 md:px-10 md:py-32"
    >
      <motion.div className="mx-auto w-full max-w-[1400px]" {...reveal}>
        <p className="text-sm font-medium text-indigo-200">Career</p>
        <h2
          id="career-heading"
          className="mt-4 max-w-[22ch] text-[clamp(2rem,4.2vw,4rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-zinc-100"
        >
          The engineering work that powers the studio.
        </h2>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative flex min-h-[340px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101219] p-7 transition-colors duration-300 hover:border-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200 md:p-8"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
                style={{ background: card.glow }}
              />
              <span className="relative font-mono text-sm text-zinc-400">{card.eyebrow}</span>
              <span className="relative mt-4 max-w-[20ch] text-2xl font-semibold leading-tight tracking-[-0.03em] text-zinc-100 md:text-[1.75rem]">
                {card.title}
              </span>
              <span className="relative mt-3 max-w-[46ch] text-sm leading-relaxed text-zinc-300">{card.body}</span>
              <span className="relative mt-6 flex flex-wrap gap-2">
                {card.chips.map((chip) => (
                  <span key={chip} className="rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-300">
                    {chip}
                  </span>
                ))}
              </span>
              <span className="relative mt-auto flex items-center justify-between pt-8">
                <span className="text-base font-semibold text-white">{card.cta}</span>
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-zinc-100 text-[#07080c] transition-transform duration-300 group-hover:-rotate-45">
                  <ArrowRight aria-hidden="true" weight="bold" className="size-5" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
