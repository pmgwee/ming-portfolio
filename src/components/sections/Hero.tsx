"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, FilmStrip, HandPointing, MouseScroll, Pause, Play } from "@phosphor-icons/react";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { useScrollFilm } from "@/hooks/useScrollFilm";
import { HERO_CHAPTERS, HERO_DESTINATIONS, HERO_FILM, chapterLabelAt, chapterOpacity, endRest, progressAt } from "@/lib/hero-story";
import { SITE } from "@/lib/seo";
import { followScrollPosition, lockPageScroll, scrollToPosition } from "@/lib/smooth-scroll";
import styles from "./Hero.module.css";
import { CurtainLayer, type CurtainController } from "./CurtainLayer";

/**
 * Experience: the supplied curtain/TV/ship film leads; HTML restores its four
 * chapters. The film-only section height (1320/1140/750 × --lock-vh) and the HERO_PACING
 * curve (short opening, long glass-lettering reveal) are user-requested; Lenis
 * settings are unchanged.
 * Signature: decoded video frames, rather than timers, drive the chapter copy.
 * First viewport: artwork first; the introduction sits behind an interactive
 * curtain layer, with a bottom timeline rail framing the film.
 */
/** How long "Play film" rests on each chapter so its copy can be read. */
const CHAPTER_HOLD_MS = 2600;

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
  const toolbarRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const tipLabelRef = useRef<HTMLSpanElement>(null);
  const tipTimeRef = useRef<HTMLSpanElement>(null);
  const previewingRef = useRef(false);
  const readButtonRef = useRef<HTMLButtonElement>(null);
  const wasReadingRef = useRef(false);
  const chapterOpacityRef = useRef<number[]>([]);
  const filmFocusRef = useRef("");
  const autoplayHoldRef = useRef(false);
  const stopAutoplayRef = useRef<(() => void) | null>(null);
  const [reduced, setReduced] = useState(false);
  const [reading, setReading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [autoplaying, setAutoplaying] = useState(false);
  // Phones skip the interactive curtain: its strand redraws made the title
  // reveal stutter there. The introduction shows at once over the film.
  const [curtained, setCurtained] = useState(true);
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
    setCurtained(!window.matchMedia("(max-width: 768px), (pointer: coarse)").matches);
    setMounted(true);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  const paintOpening = useCallback(() => {
    // Runs every scrubbed frame: write only what changed.
    const openingOpacity = Math.min(1, Math.max(0, (2.45 - filmTimeRef.current) / 0.3)) * curtainRevealRef.current;
    const opening = openingRef.current;
    if (opening) {
      opening.style.opacity = String(openingOpacity);
      const hidden = openingOpacity < 0.1;
      if (opening.inert !== hidden) {
        opening.inert = hidden;
        opening.setAttribute("aria-hidden", String(hidden));
      }
    }
    // The timeline rail and "Read without motion" only show while the curtain
    // is open and the film is still on its opening (0:00–0:02). Hidden on the
    // closed curtain and once the film moves on. Kept focusable for keyboards.
    const section = sectionRef.current;
    if (!section) return;
    const toolbar = curtainRevealRef.current > 0.35 && filmTimeRef.current <= 2 ? "shown" : "hidden";
    if (section.dataset.toolbar !== toolbar) section.dataset.toolbar = toolbar;
    // The start hint stays until the film first moves.
    const atStart = String(filmTimeRef.current < 0.15);
    if (section.dataset.atStart !== atStart) section.dataset.atStart = atStart;
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

  useEffect(() => {
    if (staticMode || curtained) return;
    curtainRevealRef.current = 1;
    paintOpening();
  }, [curtained, staticMode, paintOpening]);

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
      if (time >= chapter.start) next = chapter.id;
      if (!node || chapterOpacityRef.current[index] === opacity) return;
      chapterOpacityRef.current[index] = opacity;
      node.style.opacity = String(opacity);
      node.style.transform = `translateY(${(1 - opacity) * 10}px)`;
      node.inert = opacity < 0.1;
      node.setAttribute("aria-hidden", String(opacity < 0.1));
    });
    if (progressRef.current) {
      progressRef.current.value = String(time);
      progressRef.current.style.setProperty("--played", `${time / HERO_FILM.duration * 100}%`);
      progressRef.current.setAttribute("aria-valuetext", `${time.toFixed(1)} of 15 seconds, ${chapterLabelAt(time)}`);
    }
    if (!previewingRef.current) placeTip(time);
    const section = sectionRef.current;
    if (section) {
      if (section.dataset.chapter !== next) section.dataset.chapter = next;
      const focus = time < 5.1 ? "45%" : time < 6.7 ? "36%" : "50%";
      if (filmFocusRef.current !== focus) {
        filmFocusRef.current = focus;
        section.style.setProperty("--film-focus", focus);
      }
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

  const { ready, failed, progress, retry } = useScrollFilm({ sectionRef, videoRef, enabled: mounted && !staticMode, onFrame: paint, holdRef: autoplayHoldRef });
  const preloading = mounted && !staticMode && !ready && !failed;

  // Hold the page on the curtain until the whole film is in memory, so the
  // first scroll scrubs smoothly instead of stalling on unbuffered frames.
  // Only when the visit starts at the hero (not a reload further down).
  useEffect(() => {
    // Skip when arriving at a section (e.g. /#career): the page jumps past the hero.
    if (!preloading || skipped || window.location.hash || window.scrollY > window.innerHeight * 0.5) return;
    return lockPageScroll();
  }, [preloading, skipped]);

  // "Play film": the film plays for real (no seeking, so no dropped frames)
  // and the page follows it, resting on each chapter long enough to read.
  // Any touch, wheel or key hands control straight back to the visitor.
  const stopAutoplay = useCallback(() => stopAutoplayRef.current?.(), []);
  const playFilm = () => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || stopAutoplayRef.current) return;
    const top = window.scrollY + section.getBoundingClientRect().top;
    const travel = Math.max(0, section.offsetHeight - window.innerHeight);
    const filmTravel = travel * (1 - endRest(travel, window.innerHeight));
    const end = Math.min(HERO_FILM.duration, Number.isFinite(video.duration) ? video.duration : HERO_FILM.duration) - 1 / 30;
    const stops: number[] = HERO_CHAPTERS.map((chapter) => chapter.jump).filter((at) => at > video.currentTime + 0.1 && at < end - 1);
    const events = ["touchstart", "wheel", "keydown"] as const;
    let frame = 0;
    let rest = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(rest);
      events.forEach((type) => window.removeEventListener(type, stop));
      video.pause();
      autoplayHoldRef.current = false;
      stopAutoplayRef.current = null;
      setAutoplaying(false);
    };
    const follow = () => {
      const time = video.currentTime;
      paint(time);
      followScrollPosition(top + filmTravel * progressAt(time));
      if (time >= end) return stop();
      if (stops.length && time >= stops[0]) {
        stops.shift();
        video.pause();
        rest = window.setTimeout(() => void video.play().catch(stop), CHAPTER_HOLD_MS);
      }
      frame = requestAnimationFrame(follow);
    };
    stopAutoplayRef.current = stop;
    autoplayHoldRef.current = true;
    setAutoplaying(true);
    // Listen once this tap has finished, so it doesn't count as taking over.
    window.setTimeout(() => events.forEach((type) => window.addEventListener(type, stop, { passive: true })), 0);
    video.play().then(() => { frame = requestAnimationFrame(follow); }, stop);
  };
  useEffect(() => stopAutoplay, [stopAutoplay]);
  useEffect(() => { if (staticMode) stopAutoplay(); }, [staticMode, stopAutoplay]);

  const jump = (time: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const travel = section.offsetHeight - window.innerHeight;
    const top = window.scrollY + section.getBoundingClientRect().top;
    scrollToPosition(top + Math.max(0, travel) * (1 - endRest(travel, window.innerHeight)) * progressAt(time));
  };

  const toggleReading = () => {
    setReading((value) => !value);
    requestAnimationFrame(() => {
      if (sectionRef.current) scrollToPosition(window.scrollY + sectionRef.current.getBoundingClientRect().top);
    });
  };

  return (
    <section ref={sectionRef} data-cinematic-hero data-toolbar="hidden" data-at-start="true" data-chapter="intro" data-film-time="0" data-static={staticMode} data-film-ready={!preloading} data-autoplaying={autoplaying}
      className={`scroll-animation ${styles.hero}`} aria-label="Ming and Ming Creatives: an introduction in four chapters">
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

        {mounted && !staticMode && curtained ? <CurtainLayer stageRef={stageRef} controllerRef={curtainRef} onReveal={revealIntroduction} /> : null}

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

        <div ref={toolbarRef} className={styles.toolbar}>
          <div className={styles.timeline}>
            <div className={styles.rail} onPointerMove={preview} onPointerLeave={endPreview}>
              <span ref={tipRef} className={styles.tip} aria-hidden="true"><span ref={tipLabelRef}>Prologue</span><span ref={tipTimeRef}>00:00 / 00:15</span></span>
              <input ref={progressRef} type="range" min="0" max="15" step="0.1" defaultValue="0" aria-label="Film position" onChange={(event) => jump(Number(event.currentTarget.value))} />
              <div className={styles.ticks} aria-hidden="true">{HERO_CHAPTERS.map((chapter) => <i key={chapter.id} style={{ left: `${chapter.start / HERO_FILM.duration * 100}%` }} />)}</div>
            </div>
          </div>
          <button ref={readButtonRef} type="button" className={styles.readButton} onClick={toggleReading}><BookOpen aria-hidden="true" size={17} /><span>Read without motion</span></button>
        </div>
        {preloading ? (
          <div className={styles.preloader} role="status" aria-live="polite">
            <span>Loading the film</span>
            <span className={styles.preloaderTrack} aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></span>
            <span className={styles.preloaderPct}>{Math.round(progress * 100)}%</span>
            {!skipped ? <button type="button" className={styles.preloaderSkip} onClick={() => setSkipped(true)}>Skip</button> : null}
          </div>
        ) : null}
        {/* What to do on arrival: swipe or scroll through the film, or let it play. */}
        {ready && !failed && !staticMode ? (
          autoplaying ? (
            <button type="button" className={`${styles.startHint} ${styles.playing}`} onClick={stopAutoplay}>
              <Pause aria-hidden="true" size={15} weight="fill" />Pause
            </button>
          ) : (
            <div className={styles.startHint}>
              <span className={styles.gesture}>
                <HandPointing aria-hidden="true" size={19} className={`${styles.touchOnly} ${styles.swipe}`} />
                <MouseScroll aria-hidden="true" size={19} className={`${styles.pointerOnly} ${styles.wheel}`} />
                <span className={styles.touchOnly}>Swipe up to explore</span>
                <span className={styles.pointerOnly}>Scroll to explore</span>
              </span>
              <button type="button" className={styles.playButton} onClick={playFilm}>
                <Play aria-hidden="true" size={13} weight="fill" />Play film
              </button>
            </div>
          )
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
