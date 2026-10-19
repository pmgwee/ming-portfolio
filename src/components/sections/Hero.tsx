"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, FilmStrip } from "@phosphor-icons/react";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { useScrollFilm } from "@/hooks/useScrollFilm";
import { HERO_CHAPTERS, HERO_DESTINATIONS, HERO_FILM, chapterLabelAt, chapterOpacity, progressAt } from "@/lib/hero-story";
import { SITE } from "@/lib/seo";
import { lockPageScroll, scrollToPosition } from "@/lib/smooth-scroll";
import styles from "./Hero.module.css";
import { CurtainLayer, type CurtainController } from "./CurtainLayer";

/**
 * Experience: the supplied curtain/TV/ship film leads; HTML restores its four
 * chapters. The film-only section height (1320/1140/950vh) and the HERO_PACING
 * curve (short opening, long glass-lettering reveal) are user-requested; Lenis
 * settings are unchanged.
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
  const tipRef = useRef<HTMLSpanElement>(null);
  const tipLabelRef = useRef<HTMLSpanElement>(null);
  const tipTimeRef = useRef<HTMLSpanElement>(null);
  const previewingRef = useRef(false);
  const readButtonRef = useRef<HTMLButtonElement>(null);
  const wasReadingRef = useRef(false);
  const [reduced, setReduced] = useState(false);
  const [reading, setReading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [announceReady, setAnnounceReady] = useState(false);
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

  // CurtainLayer unmounts in static modes and remounts closed, so the
  // imperative reveal must return to closed with it.
  useEffect(() => {
    if (!staticMode) return;
    curtainRevealRef.current = 0;
    paintOpening();
  }, [staticMode, paintOpening]);

  // Streaming-style scrub tip: chapter + time at a film position, placed along the rail.
  const placeTip = useCallback((time: number) => {
    const fraction = Math.min(1, Math.max(0, time / HERO_FILM.duration));
    tipRef.current?.style.setProperty("--tip", String(fraction));
    if (tipLabelRef.current) tipLabelRef.current.textContent = chapterLabelAt(time);
    if (tipTimeRef.current) tipTimeRef.current.textContent = `00:${String(time > 14.9 ? 15 : Math.floor(time)).padStart(2, "0")} / 00:15`;
  }, []);

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
      progressRef.current.setAttribute("aria-valuetext", `${time.toFixed(1)} of 15 seconds, ${chapterLabelAt(time)}`);
    }
    if (!previewingRef.current) placeTip(time);
    if (sectionRef.current) {
      sectionRef.current.dataset.chapter = next;
      sectionRef.current.style.setProperty("--film-focus", time < 5.1 ? "45%" : time < 6.7 ? "36%" : "50%");
    }
  }, [paintOpening, placeTip]);

  const preview = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    const rect = event.currentTarget.getBoundingClientRect();
    previewingRef.current = true;
    placeTip((event.clientX - rect.left) / rect.width * HERO_FILM.duration);
  };
  const endPreview = () => {
    previewingRef.current = false;
    placeTip(Number(progressRef.current?.value ?? 0));
  };

  const { ready, failed, progress, retry } = useScrollFilm({ sectionRef, videoRef, enabled: mounted && !staticMode, onFrame: paint });
  const preloading = mounted && !staticMode && !ready && !failed;

  // Hold the page on the curtain until the whole film is in memory, so the
  // first scroll scrubs smoothly instead of stalling on unbuffered frames.
  // Only when the visit starts at the hero (not a reload further down).
  useEffect(() => {
    if (!preloading || skipped || window.scrollY > window.innerHeight * 0.5) return;
    return lockPageScroll();
  }, [preloading, skipped]);

  // Briefly confirm the film is ready, then get out of the way.
  useEffect(() => {
    if (!ready || staticMode) return;
    setAnnounceReady(true);
    const timer = window.setTimeout(() => setAnnounceReady(false), 2600);
    const dismiss = () => setAnnounceReady(false);
    window.addEventListener("wheel", dismiss, { once: true, passive: true });
    window.addEventListener("touchmove", dismiss, { once: true, passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchmove", dismiss);
    };
  }, [ready, staticMode]);

  const jump = (time: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const travel = section.offsetHeight - window.innerHeight;
    const top = window.scrollY + section.getBoundingClientRect().top;
    scrollToPosition(top + Math.max(0, travel) * progressAt(time));
  };

  const toggleReading = () => {
    setReading((value) => !value);
    requestAnimationFrame(() => {
      if (sectionRef.current) scrollToPosition(window.scrollY + sectionRef.current.getBoundingClientRect().top);
    });
  };

  return (
    <section ref={sectionRef} data-cinematic-hero data-chapter="intro" data-film-time="0" data-static={staticMode} data-film-ready={!preloading}
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
            <AnchorLink href="/ai-projects" className={styles.primary}>Explore AI Projects <ArrowRight aria-hidden="true" size={17} /></AnchorLink>
            <AnchorLink href="#showcase" className={styles.secondary}>Enter the studio</AnchorLink>
          </div>
          <p className={styles.scrollPrompt}><span className="hero-scroll-dot"><ArrowDown aria-hidden="true" size={17} /></span>Scroll to step inside</p>
        </div>

        {mounted && !staticMode ? <CurtainLayer stageRef={stageRef} controllerRef={curtainRef} onReveal={revealIntroduction} /> : null}

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
            <div className={styles.rail} onPointerMove={preview} onPointerLeave={endPreview}>
              <span ref={tipRef} className={styles.tip} aria-hidden="true"><span ref={tipLabelRef}>Prologue</span><span ref={tipTimeRef}>00:00 / 00:15</span></span>
              <input ref={progressRef} type="range" min="0" max="15" step="0.1" defaultValue="0" aria-label="Film position" onChange={(event) => jump(Number(event.currentTarget.value))} />
              <div className={styles.ticks} aria-hidden="true">{HERO_CHAPTERS.map((chapter) => <i key={chapter.id} style={{ left: `${chapter.start / HERO_FILM.duration * 100}%` }} />)}</div>
            </div>
          </div>
          <button ref={readButtonRef} type="button" className={styles.readButton} onClick={toggleReading}><BookOpen aria-hidden="true" size={17} /><span>Read without motion</span></button>
        </div>
        {preloading || announceReady ? (
          <div className={styles.preloader} data-ready={!preloading} role="status" aria-live="polite">
            {preloading ? (
              <>
                <span>Loading the film</span>
                <span className={styles.preloaderTrack} aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></span>
                <span className={styles.preloaderPct}>{Math.round(progress * 100)}%</span>
                {!skipped ? <button type="button" className={styles.preloaderSkip} onClick={() => setSkipped(true)}>Skip</button> : null}
              </>
            ) : (
              <span className={styles.preloaderReady}>Ready. Scroll to begin <ArrowDown aria-hidden="true" size={15} /></span>
            )}
          </div>
        ) : null}
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
