"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SITE } from "@/lib/seo";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ServicesSection() {
  const reduced = useReducedMotion();

  const reveal = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.7, ease: EASE },
      };

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative overflow-hidden border-t border-white/10 bg-[#07080c] px-6 py-24 md:px-10 md:py-32"
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[50vh] w-[80vw] max-w-4xl -translate-x-1/2 -translate-y-1/3 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(99,102,241,0.5), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px]">
        {/* Centered header */}
        <motion.div className="mx-auto max-w-3xl text-center" {...reveal}>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-indigo-400">
            {SITE.geo.city} · {SITE.geo.nearbyTowns.join(" · ")} ·{" "}
            {SITE.geo.region}, {SITE.location}
          </p>
          <h2
            id="services-heading"
            className="mt-4 text-[clamp(2rem,3.6vw+0.4rem,3.4rem)] font-semibold leading-[1.06] tracking-tighter text-zinc-100"
          >
            Awwwards-quality web &amp; AI.
            
            <span className="text-gradient">
              Based in {SITE.geo.city}, {SITE.geo.region}.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed text-zinc-400">
            3D animated websites and Generative AI experiences — designed,
            built, and shipped end-to-end, to an international standard.
          </p>
        </motion.div>

        {/* Services grid */}
        <motion.ul
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          {...reveal}
        >
          {SITE.services.map((s) => (
            <li
              key={s.name}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-white/20 hover:bg-white/5"
            >
              <p className="text-sm font-semibold text-zinc-100">{s.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {s.description}
              </p>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
