"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { SITE } from "@/lib/seo";
import { ENGINEERING_PROJECTS } from "@/lib/engineering-projects";
import { EXPERIENCE } from "@/lib/experience";

const EASE = [0.16, 1, 0.3, 1] as const;

const HOOKS = [
  {
    href: "/ai-projects",
    eyebrow: `${String(ENGINEERING_PROJECTS.length).padStart(2, "0")} case studies`,
    title: "AI agents that run beyond the prototype.",
    body: "See what each system does, what I built myself, and how it runs today.",
    chips: [...ENGINEERING_PROJECTS.slice(0, 3).map((project) => project.title), `+${ENGINEERING_PROJECTS.length - 3} more`],
    cta: "Explore AI Projects",
    glow: "radial-gradient(closest-side, rgba(99,102,241,0.9), transparent)",
  },
  {
    href: "/experiences",
    eyebrow: `${String(EXPERIENCE.length).padStart(2, "0")} roles`,
    title: "From fintech engineering to independent AI consulting.",
    body: "The background behind the work: Computer Science, a fintech engineering internship, and the studio.",
    chips: EXPERIENCE.map((entry) => entry.organization),
    cta: "View Experiences",
    glow: "radial-gradient(closest-side, rgba(255,212,0,0.7), transparent)",
  },
];

export function ServicesSection() {
  const reduced = useReducedMotion();
  const reveal = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.6, ease: EASE },
      };

  return (
    <section
      id="services"
      aria-labelledby="studio-heading"
      className="scroll-mt-28 relative overflow-hidden border-t border-white/10 bg-[#07080c] px-6 py-24 md:px-10 md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[42vh] w-[70vw] max-w-4xl -translate-x-1/2 -translate-y-1/3 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(99,102,241,0.45), transparent)" }}
      />

      <div className="relative mx-auto w-full max-w-[1400px]">
        <motion.div className="max-w-3xl" {...reveal}>
          <p className="text-sm font-medium text-indigo-200">Creative services</p>
          <h2
            id="studio-heading"
            className="mt-4 text-[clamp(2rem,4.2vw,4rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-zinc-100"
          >
            Ming Creatives studio
          </h2>
          <p className="mt-6 max-w-[68ch] text-base leading-relaxed text-zinc-300 md:text-lg">
            Ming Creatives is my studio for digital and creative work. Alongside
            my Data &amp; AI consulting, I am building my content creation practice as{" "}
            <a
              href={SITE.studioExploreUrl}
              target="_blank"
              rel="noopener noreferrer me"
              className="text-zinc-100 underline decoration-white/40 underline-offset-4 hover:decoration-white"
            >
              @yier.ming on Instagram
            </a>.
          </p>
        </motion.div>

        <motion.ul
          aria-label="Ming Creatives services"
          className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          {...reveal}
        >
          {SITE.services.map((service) => (
            <li
              key={service.name}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.05]"
            >
              <h3 className="text-base font-semibold text-zinc-100">{service.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                {service.description}
              </p>
            </li>
          ))}
        </motion.ul>

        <a
          href={SITE.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200"
        >
          Start a creative project
        </a>

        <motion.div className="mt-20 border-t border-white/10 pt-12" {...reveal}>
          <p className="text-sm font-medium text-indigo-200">Behind the studio</p>
          <h3 className="mt-3 max-w-[24ch] text-[clamp(1.6rem,3vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-zinc-100">
            The engineering work that powers it.
          </h3>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {HOOKS.map((hook) => (
              <Link
                key={hook.href}
                href={hook.href}
                className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101219] p-7 transition-colors duration-300 hover:border-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200 md:p-9"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
                  style={{ background: hook.glow }}
                />
                <span className="relative font-mono text-sm text-zinc-400">{hook.eyebrow}</span>
                <span className="relative mt-4 max-w-[22ch] text-2xl font-semibold leading-tight tracking-[-0.03em] text-zinc-100 md:text-[2rem]">
                  {hook.title}
                </span>
                <span className="relative mt-3 max-w-[48ch] text-sm leading-relaxed text-zinc-300">{hook.body}</span>
                <span className="relative mt-6 flex flex-wrap gap-2">
                  {hook.chips.map((chip) => (
                    <span key={chip} className="rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-300">
                      {chip}
                    </span>
                  ))}
                </span>
                <span className="relative mt-auto flex items-center justify-between pt-8">
                  <span className="text-base font-semibold text-white">{hook.cta}</span>
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-zinc-100 text-[#07080c] transition-transform duration-300 group-hover:-rotate-45">
                    <ArrowRight aria-hidden="true" weight="bold" className="size-5" />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
