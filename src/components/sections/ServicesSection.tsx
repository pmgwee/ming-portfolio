"use client";

import { Fragment, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { DEFAULT_SKY, SKIES, SKY_SHORTLIST, skyById } from "@/lib/studio";
import { PrismField } from "./studio/PrismField";
import { PrismHero } from "./studio/PrismHero";
import { StudioChat } from "./studio/StudioChat";
import { WorkBento } from "./studio/WorkBento";
import styles from "./studio/Studio.module.css";

/**
 * Services, told as light through the Ming Creatives crystal: under a
 * sapphire-sunrise sky, the prism splits into the three services, a phone
 * chat shows how a project starts, then real work backs each service.
 */
export function ServicesSection() {
  const reduced = !!useReducedMotion();
  const [skyId, setSkyId] = useState(DEFAULT_SKY);
  const [picker, setPicker] = useState(false);
  const sky = skyById(skyId);

  // `?sky=<id>` previews a candidate palette and shows the picker; otherwise hidden.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("sky");
    if (param === null) return;
    setSkyId(skyById(param).id);
    setPicker(true);
  }, []);

  function chooseSky(id: string) {
    setSkyId(id);
    const url = new URL(window.location.href);
    url.searchParams.set("sky", id);
    window.history.replaceState(window.history.state, "", url);
  }

  return (
    <section id="services" aria-labelledby="studio-heading" className="relative scroll-mt-20 overflow-hidden bg-[#07080c]">
      <div className="relative isolate pb-8">
        <div aria-hidden="true" className={styles.sky} style={{ background: sky.wash }}>
          {sky.pools.map((color) => (
            <i key={color} className={styles.pool} style={{ background: color }} />
          ))}
          <i className={styles.sheen} />
          <i className={styles.floor} />
        </div>
        <PrismField />

        <PrismHero dark={sky.ink === "dark"} reduced={reduced} />
        <StudioChat reduced={reduced} />

        {picker ? (
          <div role="group" aria-label="Preview sky palette" className="absolute right-3 top-20 z-20 flex gap-1 rounded-md border border-white/20 bg-black/55 p-1.5 text-xs text-white backdrop-blur-md sm:top-24 sm:flex-col">
            {SKIES.map((option, i) => (
              <Fragment key={option.id}>
                {i === SKY_SHORTLIST ? <span aria-hidden="true" className="mx-0.5 w-px self-stretch bg-white/20 sm:mx-0 sm:my-1 sm:h-px sm:w-auto" /> : null}
                <button
                  type="button"
                  aria-pressed={option.id === sky.id}
                  aria-label={option.name}
                  onClick={() => chooseSky(option.id)}
                  className={`flex min-h-9 min-w-9 items-center justify-center gap-2 rounded-sm px-2 text-left sm:justify-start ${option.id === sky.id ? "bg-white/15" : "hover:bg-white/10"}`}
                >
                  <span aria-hidden="true" className="size-4 shrink-0 rounded-full border border-white/40" style={{ background: option.wash }} />
                  <span aria-hidden="true" className="hidden sm:inline">{option.name}</span>
                </button>
              </Fragment>
            ))}
          </div>
        ) : null}
      </div>

      <WorkBento reduced={reduced} />
    </section>
  );
}
