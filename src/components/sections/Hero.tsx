"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, FilmStrip } from "@phosphor-icons/react";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { useScrollFilm } from "@/hooks/useScrollFilm";
import { HERO_CHAPTERS, HERO_DESTINATIONS, HERO_FILM, chapterOpacity } from "@/lib/hero-story";
import { SITE } from "@/lib/seo";
import { scrollToPosition } from "@/lib/smooth-scroll";
import styles from "./Hero.module.css";
import { CurtainLayer, type CurtainController } from "./CurtainLayer";

/**
 * Experience: the supplied curtain/TV/ship film leads; HTML restores its four
 * chapters. The film-only section height (1320/1140/950vh) is a user-requested
 * slower mapping; Lenis settings are unchanged.
 * Signature: decoded video frames, rather than timers, drive the chapter copy.
 * First viewport: artwork first; the introduction sits behind an interactive
 * curtain layer, with a bottom timeline rail framing the film.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<CurtainController | null>(null);
  const curtainRevealRef = useRef(0);
  const filmTimeRef = useRef(0);
  const openingRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const readButtonRef = useRef<HTMLButtonElement>(null);
  const wasReadingRef = useRef(false);
  const activeRef = useRef("intro");
  const [active, setActive] = useState("intro");
  const [reduced, setReduced] = useState(false);
  const [reading, setReading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [introductionOpen, setIntroductionOpen] = useState(false);
  const staticMode = reading || reduced;

  useEffect(() => {
    if (reading) document.getElementById("hero-reading-heading")?.focus({ preventScroll: true });
    else if (wasReadingRef.current) readButtonRef.current?.focus({ preventScroll: true });
    wasReadingRef.current = reading;
  }, [reading]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    setMounted(true);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  const paintOpening = useCallback(() => {
    const openingOpacity = Math.min(1, Math.max(0, (2.45 - filmTimeRef.current) / 0.3)) * curtainRevealRef.current;
    if (openingRef.current) {
      openingRef.current.style.opacity = String(openingOpacity);
      openingRef.current.inert = openingOpacity < 0.1;
      openingRef.current.setAttribute("aria-hidden", String(openingOpacity < 0.1));
    }
  }, []);

  const revealIntroduction = useCallback((amount: number) => {
    curtainRevealRef.current = amount;
    paintOpening();
  }, [paintOpening]);

  // CurtainLayer unmounts in static modes and remounts closed, so the trigger
  // state and the imperative reveal must return to closed with it.
  useEffect(() => {
    if (!staticMode) return;
    setIntroductionOpen(false);
    curtainRevealRef.current = 0;
    paintOpening();
  }, [staticMode, paintOpening]);

  const paint = useCallback((time: number) => {
    filmTimeRef.current = time;
    curtainRef.current?.setTime(time);
    paintOpening();
    let next = "intro";
    HERO_CHAPTERS.forEach((chapter, index) => {
      const node = chapterRefs.current[index];
      const opacity = chapterOpacity(time, chapter.start, chapter.end);
      if (!node) return;
      node.style.opacity = String(opacity);
      node.style.transform = `translateY(${(1 - opacity) * 10}px)`;
      node.inert = opacity < 0.1;
      node.setAttribute("aria-hidden", String(opacity < 0.1));
      if (time >= chapter.start) next = chapter.id;
    });
    if (progressRef.current) {
      progressRef.current.value = String(time);
      progressRef.current.style.setProperty("--played", `${time / HERO_FILM.duration * 100}%`);
      progressRef.current.setAttribute("aria-valuetext", `${time.toFixed(1)} of 15 seconds`);
    }
    if (timeRef.current) timeRef.current.textContent = `00:${String(time > 14.9 ? 15 : Math.floor(time)).padStart(2, "0")} / 00:15`;
    if (sectionRef.current) {
      sectionRef.current.dataset.chapter = next;
      sectionRef.current.style.setProperty("--film-focus", time < 5.1 ? "45%" : time < 6.7 ? "36%" : "50%");
    }
    if (activeRef.current !== next) {
      activeRef.current = next;
      setActive(next);
    }
  }, [paintOpening]);

  const { ready, failed, retry } = useScrollFilm({ sectionRef, videoRef, enabled: mounted && !staticMode, onFrame: paint });

  const jump = (time: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const travel = section.offsetHeight - window.innerHeight;
    const top = window.scrollY + section.getBoundingClientRect().top;
    scrollToPosition(top + Math.max(0, travel) * (time / HERO_FILM.duration));
  };

  const toggleReading = () => {
    setReading((value) => !value);
    requestAnimationFrame(() => {
      if (sectionRef.current) scrollToPosition(window.scrollY + sectionRef.current.getBoundingClientRect().top);
    });
  };

  return (
    <section ref={sectionRef} data-cinematic-hero data-chapter="intro" data-film-time="0" data-static={staticMode}
      className={`scroll-animation ${styles.hero}`} aria-label="Gwee Per Ming and Ming Creatives — an introduction in four chapters">
      <div ref={stageRef} className={`hero-sticky ${styles.stage}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_FILM.poster} alt="" fetchPriority="high" loading="eager" className={styles.film} />
        <video ref={videoRef} className={styles.film} style={{ opacity: ready && !failed ? 1 : 0 }} muted playsInline
          preload="none" poster={HERO_FILM.poster} disablePictureInPicture aria-hidden="true" />
        <div className={styles.shade} aria-hidden="true" />
        <div ref={openingRef} id="hero-introduction" className={styles.opening} aria-hidden="true" inert>
          <p className={styles.role}>{SITE.headline}</p>
          <h1 id="hero-heading">{SITE.personName}</h1>
          <p className={styles.openingLine}>Production AI. Creative worlds.</p>
          <p className={styles.openingBody}>I build AI systems that work beyond the prototype, and digital experiences through my studio, Ming Creatives.</p>
          <div className={styles.actions}>
            <AnchorLink href="#ai-systems" className={styles.primary}>Explore AI Products <ArrowRight aria-hidden="true" size={17} /></AnchorLink>
            <AnchorLink href="#showcase" className={styles.secondary}>Enter the studio</AnchorLink>
          </div>
          <p className={styles.scrollPrompt}><span className="hero-scroll-dot"><ArrowDown aria-hidden="true" size={17} /></span>Scroll to step inside</p>
        </div>

        {mounted && !staticMode ? <CurtainLayer stageRef={stageRef} controllerRef={curtainRef} onReveal={revealIntroduction} /> : null}
        <button type="button" className={styles.curtainTrigger} aria-controls="hero-introduction" aria-expanded={introductionOpen}
          onClick={() => {
            if (introductionOpen) curtainRef.current?.close();
            else curtainRef.current?.open();
            setIntroductionOpen((value) => !value);
          }}>
          <span>{introductionOpen ? "Close the curtain" : "Draw the curtain"}</span><ArrowDown aria-hidden="true" size={15} />
        </button>

        {HERO_CHAPTERS.map((chapter, index) => (
          <div key={chapter.id} ref={(node) => { chapterRefs.current[index] = node; }}
            className={`${styles.chapter} ${styles[chapter.side]}`} data-story-chapter={chapter.id} aria-hidden="true" inert>
            <p className={styles.chapterLabel}><span>{chapter.number}</span> {chapter.label}</p>
            <h2>{chapter.title}</h2>
            <p className={styles.chapterBody}>{chapter.body}</p>
            {chapter.side === "index" ? (
              <>
                <nav aria-label="Explore the portfolio" className={styles.destinations}>
                  {HERO_DESTINATIONS.map((destination) => (
                    <AnchorLink key={destination.href} href={destination.href} className={styles.destination}>
                      <span>{destination.label}<ArrowUpRight aria-hidden="true" size={18} /></span><small>{destination.detail}</small>
                    </AnchorLink>
                  ))}
                </nav>
                <a className={styles.contact} href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
                  Have something in mind? <span>Studio inquiry <ArrowUpRight aria-hidden="true" size={16} /></span>
                </a>
              </>
            ) : <AnchorLink href={chapter.href} className={styles.chapterAction}>{chapter.action}<ArrowUpRight aria-hidden="true" size={18} /></AnchorLink>}
          </div>
        ))}

        <div className={styles.toolbar}>
          <div className={styles.timeline}>
            <div className={styles.timelineLabel}><span>{active === "intro" ? "Prologue" : `${HERO_CHAPTERS.find((chapter) => chapter.id === active)?.number} · ${HERO_CHAPTERS.find((chapter) => chapter.id === active)?.label}`}</span><span ref={timeRef}>00:00 / 00:15</span></div>
            <div className={styles.rail}>
              <input ref={progressRef} type="range" min="0" max="15" step="0.1" defaultValue="0" aria-label="Film position" onChange={(event) => jump(Number(event.currentTarget.value))} />
              <div className={styles.ticks} aria-hidden="true">{HERO_CHAPTERS.map((chapter) => <i key={chapter.id} style={{ left: `${chapter.start / HERO_FILM.duration * 100}%` }} />)}</div>
            </div>
          </div>
          <button ref={readButtonRef} type="button" className={styles.readButton} onClick={toggleReading}><BookOpen aria-hidden="true" size={17} /><span>Read without motion</span></button>
        </div>
        {!ready && !failed && mounted && !staticMode ? <span className={styles.loading} role="status">Preparing the film…</span> : null}
        {failed ? <div className={styles.error} role="status"><span>The film couldn&apos;t load.</span><button type="button" onClick={retry}>Try again</button><button type="button" onClick={toggleReading}>Read the introduction</button></div> : null}
      </div>

      <div className={styles.reader}>
        <div className={styles.readerIntro}>
          <p>{SITE.headline}</p><h1 id="hero-reading-heading" tabIndex={-1}>{SITE.personName}</h1><p>{SITE.introduction}</p>
          {!reduced ? <button type="button" className={styles.chapterAction} onClick={toggleReading}><FilmStrip aria-hidden="true" size={18} />Return to the film</button> : null}
        </div>
        {HERO_CHAPTERS.map((chapter) => (
          <article key={chapter.id} className={styles.readerChapter}>
            <p className={styles.chapterLabel}><span>{chapter.number}</span> {chapter.label}</p>
            <div><h3>{chapter.title}</h3><p>{chapter.body}</p><AnchorLink href={chapter.href} className={styles.chapterAction}>{chapter.action}<ArrowUpRight aria-hidden="true" size={18} /></AnchorLink></div>
          </article>
        ))}
        <AnchorLink href="#showcase" className={styles.primary}>Continue to Collections<ArrowDown aria-hidden="true" size={17} /></AnchorLink>
      </div>
      <noscript><style>{"[data-cinematic-hero]{height:auto!important}[data-cinematic-hero]>.hero-sticky{display:none}[data-cinematic-hero]>div:last-of-type{display:block}"}</style></noscript>
    </section>
  );
}
