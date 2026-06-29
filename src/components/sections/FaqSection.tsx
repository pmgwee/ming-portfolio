"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Plus, ArrowUpRight } from "@phosphor-icons/react";
import { SITE } from "@/lib/seo";

/**
 * FAQ section — standalone accordion. The visible counterpart of the `FAQPage`
 * JSON-LD in `JsonLd.tsx`; both are generated from `SITE.faq`, so they always
 * match. Every answer ships in the initial SSR HTML (height-animated, never
 * conditionally mounted), keeping it crawlable by Google/LLMs whether the
 * panel is open or closed. Defines the `#faq` anchor.
 *
 * The about intro + services grid that used to live here now lives in
 * `ServicesSection` (id="services"), one step above in the page flow.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function FaqSection() {
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
      id="faq"
      aria-labelledby="faq-heading"
      className="relative border-t border-white/10 bg-[#07080c] px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Centered heading */}
        <motion.div className="mx-auto max-w-3xl text-center" {...reveal}>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-indigo-400">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="mt-4 text-[clamp(1.8rem,3vw+0.6rem,2.8rem)] font-semibold leading-[1.08] tracking-tighter text-zinc-100"
          >
            Frequently asked{" "}
            <span className="text-gradient">questions</span>
          </h2>
        </motion.div>

        {/* Full-width accordion */}
        <motion.div
          className="mt-14 w-full border-t border-white/10"
          {...reveal}
        >
          {SITE.faq.map((f, i) => (
            <FaqItem
              key={f.q}
              index={i}
              question={f.q}
              answer={f.a}
              reduced={!!reduced}
            />
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          id="contact"
          className="mt-16 scroll-mt-24 flex flex-col items-start justify-between gap-6 rounded-[24px] border border-white/10 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-10 md:flex-row md:items-center md:p-14"
          style={{ boxShadow: "var(--card-shadow)" }}
          {...reveal}
        >
          <div>
            <h3 className="max-w-[18ch] text-3xl font-semibold tracking-tighter md:text-4xl">
              Have a project in mind?
            </h3>
            <p className="mt-3 max-w-[44ch] text-zinc-400">
              I&apos;m open to new projects and collaborations. Let&apos;s build
              something unforgettable together.
            </p>
          </div>
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-zinc-950 transition-all duration-300 hover:bg-zinc-200"
          >
            Start on WhatsApp
            <ArrowUpRight
              weight="bold"
              className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * One foldable Q&A row. Answer is always rendered (height-animated only) so
 * crawlers read it regardless of open/closed state. Answer text is full-width,
 * indented to align with the question text (matching the `pl-11` number column).
 */
function FaqItem({
  index,
  question,
  answer,
  reduced,
}: {
  index: number;
  question: string;
  answer: string;
  reduced: boolean;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `faq-panel-${index}`;

  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="group flex w-full items-start gap-5 py-6 text-left md:py-7"
      >
        {/* Index number */}
        <span className="w-6 shrink-0 pt-0.5 font-mono text-sm tabular-nums text-indigo-400/80">
          {String(index + 1).padStart(2, "0")}
        </span>
        {/* Question */}
        <span className="flex-1 text-base font-semibold text-zinc-100 transition-colors duration-300 group-hover:text-white md:text-lg">
          {question}
        </span>
        {/* +/× icon */}
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 45 : 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.4, ease: EASE }}
          className="mt-0.5 shrink-0 text-zinc-400 transition-colors duration-300 group-hover:text-indigo-400"
        >
          <Plus size={22} weight="light" />
        </motion.span>
      </button>

      {/* Answer — height-animated, always in DOM, full width aligned with question text */}
      <motion.div
        id={panelId}
        role="region"
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.5, ease: EASE }}
        className="overflow-hidden"
      >
        {/* pl-11 = w-6 number + gap-5 — keeps answer flush with question text */}
        <p className="pb-7 pl-11 pr-11 text-base leading-relaxed text-zinc-400">
          {answer}
        </p>
      </motion.div>
    </div>
  );
}
