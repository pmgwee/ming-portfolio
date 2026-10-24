"use client";

import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/seo";
import { ArrowUpRight } from "@phosphor-icons/react";
import styles from "./CollectionGallery.module.css";

/**
 * Layer 2 — the sharp centered headline that sits in front of the image field
 * and exits (translate-up + fade) on the hinge.
 *
 * Refs are owned by the parent <Showcase> so the single GSAP timeline can drive
 * the exit; this component is otherwise presentational. Copy is a tunable
 * placeholder distinct from the page's first Hero.
 */
export function HeroText({
  wrapRef,
  h1Ref,
  buttonsRef,
  onBrowse,
  count,
}: {
  wrapRef: React.RefObject<HTMLDivElement | null>;
  h1Ref: React.RefObject<HTMLHeadingElement | null>;
  buttonsRef: React.RefObject<HTMLDivElement | null>;
  onBrowse: (source: HTMLElement) => void;
  count: number;
}) {
  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
    >
      <p className="text-sm font-medium text-zinc-200">Creative work</p>

      <h2
        ref={h1Ref}
        className="mt-6 max-w-[16ch] text-[clamp(2.5rem,11.5vw,3rem)] font-medium leading-[1.02] tracking-[-0.03em] md:text-7xl lg:text-8xl"
      >
        Ming Creatives
      </h2>

      <div ref={buttonsRef} className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-3">
        {count > 0 ? <button type="button" className={styles.browse} onClick={event => onBrowse(event.currentTarget)}>
          Explore collection <span className={styles.browseCount}>{String(count).padStart(2, "0")}</span><ArrowUpRight aria-hidden="true" />
        </button> : <Button
          href={SITE.instagram}
          showArrow
          target="_blank"
          rel="noopener noreferrer"
        >
          See more on Instagram
        </Button>}
        <Button
          href={SITE.whatsapp}
          variant="secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Book Your Appointment
        </Button>
      </div>
    </div>
  );
}
