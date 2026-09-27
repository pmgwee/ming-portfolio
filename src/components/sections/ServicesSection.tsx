"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SITE } from "@/lib/seo";

const EASE = [0.16, 1, 0.3, 1] as const;

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
            I&apos;ve designed, built, and shipped end-to-end production AI
            systems and solutions. Ming Creatives is my studio for the creative
            work below.
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
      </div>
    </section>
  );
}
