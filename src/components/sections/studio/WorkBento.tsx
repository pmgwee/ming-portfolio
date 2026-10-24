"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { HERO_FILM } from "@/lib/hero-story";
import { SITE } from "@/lib/seo";
import { SERVICE_PROOF, SERVICE_RAYS } from "@/lib/studio";
import { SERVICE_ICONS } from "./serviceIcons";

const EASE = [0.16, 1, 0.3, 1] as const;

// Film (2 of 3 columns) beside the agents; the web product runs full width below.
const LAYOUT = [
  "min-h-[560px] lg:col-span-2 lg:min-h-[620px]",
  "lg:col-span-1",
  "lg:col-span-3 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]",
] as const;

/**
 * Each service with something real behind it: the AI-generated hero film,
 * the BersamaAi community agents, and the DuitSini tracker. Cards carry their
 * ray's colour from the prism above.
 */
export function WorkBento({ reduced }: { reduced: boolean }) {
  const filmRef = useRef<HTMLVideoElement>(null);

  // The film only loads and plays while its card is on screen.
  useEffect(() => {
    const film = filmRef.current;
    if (!film || reduced) return;
    const sight = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          film.preload = "auto";
          film.play().catch(() => {});
        } else {
          film.pause();
        }
      },
      { threshold: 0.25 },
    );
    sight.observe(film);
    return () => sight.disconnect();
  }, [reduced]);

  const reveal = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.7, ease: EASE },
      };

  return (
    <div className="mx-auto w-full max-w-[1240px] px-6 pb-24 pt-28 md:px-10 md:pb-32 md:pt-36">
      <motion.div {...reveal} className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-white/60">
            <span aria-hidden="true" className="h-px w-8 bg-current" />
            Proof, not promises
          </p>
          <h3 className="mt-5 text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.03em] text-white">Start from real work</h3>
        </div>
        <p className="max-w-[40ch] text-[17px] leading-7 text-zinc-300">Something I&apos;ve made for each service, and the place your project could begin.</p>
      </motion.div>

      <motion.ul {...reveal} aria-label="Ming's services" className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-3">
        {SITE.services.map((service, i) => {
          const proof = SERVICE_PROOF[i];
          const ray = SERVICE_RAYS[i];
          const Icon = SERVICE_ICONS[i];
          const film = i === 0;
          const wide = i === 2;

          const body = (
            <div className={`relative flex flex-col p-6 md:p-8 ${film ? "mt-auto max-w-[620px]" : "flex-1"}`}>
              <p className="flex items-center gap-2 text-sm font-medium" style={{ color: ray.color }}>
                <Icon aria-hidden="true" size={16} weight="bold" />
                {service.shortName}
              </p>
              <h4 className="mt-3 text-[1.6rem] font-medium leading-tight tracking-[-0.015em] text-white md:text-[1.85rem]">{proof.title}</h4>
              <p className="mt-3 text-[15px] leading-6 text-zinc-300 md:text-base md:leading-7">{service.description}</p>
              <p className="mt-5 flex gap-2.5 text-sm leading-6 text-white/80">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full" style={{ background: ray.color, boxShadow: `0 0 10px rgba(${ray.rgb},0.9)` }} />
                {proof.caption}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 pt-1 lg:mt-auto lg:pt-8">
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Start a project: ${service.shortName}, on WhatsApp (opens in a new tab)`}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-200"
                >
                  Start a project <ArrowUpRight aria-hidden="true" size={14} weight="bold" />
                </a>
                <a
                  href={proof.link.href}
                  {...(proof.link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-white underline decoration-white/35 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-200"
                >
                  {proof.link.label} <ArrowRight aria-hidden="true" size={14} />
                </a>
              </div>
            </div>
          );

          return (
            <li
              key={service.name}
              id={proof.anchor}
              className={`group relative flex scroll-mt-28 flex-col overflow-hidden rounded-md border border-white/15 bg-[#0d0f16] transition-colors hover:border-white/30 ${LAYOUT[i]}`}
            >
              <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${ray.color} 30%, ${ray.color} 70%, transparent)` }} />

              {film ? (
                <>
                  <video
                    ref={filmRef}
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
                    src={HERO_FILM.mobile}
                    poster={HERO_FILM.ending}
                    muted
                    loop
                    playsInline
                    preload="none"
                    aria-hidden="true"
                  />
                  <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,12,0.1)_0%,rgba(7,8,12,0.35)_40%,rgba(7,8,12,0.92)_78%)]" />
                  {body}
                </>
              ) : "image" in proof ? (
                wide ? (
                  <>
                    {body}
                    <div className="relative order-first m-3 aspect-[16/10] overflow-hidden rounded-[4px] border border-white/10 lg:order-none lg:m-4 lg:aspect-auto lg:min-h-[380px]">
                      <Image
                        src={proof.image}
                        alt={proof.alt}
                        fill
                        sizes="(min-width: 1024px) 620px, 100vw"
                        // A UI screenshot with small text: serve the near-lossless
                        // file as-is rather than letting the optimizer re-compress it.
                        unoptimized
                        className="object-cover object-left-top transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={proof.image}
                        alt={proof.alt}
                        fill
                        sizes="(min-width: 1024px) 380px, 100vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none"
                      />
                    </div>
                    {body}
                  </>
                )
              ) : (
                body
              )}
            </li>
          );
        })}
      </motion.ul>
    </div>
  );
}
