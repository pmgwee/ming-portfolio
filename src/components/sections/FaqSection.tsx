"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Plus } from "@phosphor-icons/react";
import { SITE } from "@/lib/seo";

const EASE = [0.16, 1, 0.3, 1] as const;

export function FaqSection() {
  const reduced = useReducedMotion();
  const reveal = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 0.6, ease: EASE },
      };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-t border-white/10 bg-[#07080c] px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div className="mx-auto max-w-3xl text-center" {...reveal}>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-indigo-200">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="mt-4 text-[clamp(1.8rem,3vw+0.6rem,2.8rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-zinc-100"
          >
            Frequently asked questions
          </h2>
        </motion.div>

        <motion.div
          className="mt-14 w-full border-t border-white/10"
          {...reveal}
        >
          {SITE.faq.map((item, index) => (
            <FaqItem
              key={item.q}
              index={index}
              question={item.q}
              answer={item.a}
              reduced={!!reduced}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

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
  const questionId = `faq-question-${index}`;
  const panelId = `faq-panel-${index}`;

  return (
    <div className="border-b border-white/10">
      <button
        id={questionId}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={panelId}
        className="group flex min-h-16 w-full items-start gap-5 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-200 md:py-6"
      >
        <span className="w-6 shrink-0 pt-0.5 font-mono text-sm tabular-nums text-indigo-200/80">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 text-base font-semibold leading-snug text-zinc-100 transition-colors duration-200 group-hover:text-white md:text-lg">
          {question}
        </span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 45 : 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.3, ease: EASE }}
          className="mt-0.5 shrink-0 text-zinc-400 transition-colors group-hover:text-zinc-200"
        >
          <Plus size={22} weight="light" />
        </motion.span>
      </button>

      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={questionId}
        aria-hidden={!open}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.45, ease: EASE }}
        className="overflow-hidden"
      >
        <p className="pb-6 pl-11 pr-11 text-sm leading-relaxed text-zinc-300 md:pb-7 md:text-base">
          {answer}
        </p>
      </motion.div>
    </div>
  );
}
