"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, FilmStrip } from "@phosphor-icons/react";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { useScrollFilm } from "@/hooks/useScrollFilm";
import { HERO_CHAPTERS, HERO_DESTINATIONS, HERO_FILM, chapterOpacity } from "@/lib/hero-story";
import { SITE } from "@/lib/seo";
import { scrollToPosition } from "@/lib/smooth-scroll";
import styles from "./Hero.module.css";

/**
 * Experience: the supplied curtain/TV/ship film leads; HTML restores its four
 * chapters. Existing Geist/nav and the 560/490/420vh scroll mapping are retained.
 * Signature: decoded video frames, rather than timers, drive the chapter copy.
 * First viewport: identity over gold curtains; quiet controls frame the artwork.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const openingRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const readButtonRef = useRef<HTMLButtonElement>(null);
  const wasReadingRef = useRef(false);
  const activeRef = useRef("intro");
  const [active, setActive] = useState("intro");
  const [reduced, setReduced] = useState(false);
  const [reading, setReading] = useState(false);
  const [mounted, setMounted] = useState(false);
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

  const paint = useCallback((time: number) => {
    const openingOpacity = Math.min(1, Math.max(0, (2.45 - time) / 0.3));
    if (openingRef.current) {
      openingRef.current.style.opacity = String(openingOpacity);
      openingRef.current.inert = openingOpacity < 0.1;
      openingRef.current.setAttribute("aria-hidden", String(openingOpacity < 0.1));
    }
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
    if (progressRef.current) progressRef.current.style.transform = `scaleX(${time / HERO_FILM.duration})`;
    if (sectionRef.current) {
      sectionRef.current.dataset.chapter = next;
      sectionRef.current.style.setProperty("--film-focus", time < 5.1 ? "45%" : time < 6.7 ? "36%" : "50%");
    }
    if (activeRef.current !== next) {
      activeRef.current = next;
      setActive(next);
    }
  }, []);

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
      <div className={`hero-sticky ${styles.stage}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_FILM.poster} alt="" fetchPriority="high" loading="eager" className={styles.film} />
        <video ref={videoRef} className={styles.film} style={{ opacity: ready && !failed ? 1 : 0 }} muted playsInline
          preload="none" poster={HERO_FILM.poster} disablePictureInPicture aria-hidden="true" />
        <div className={styles.shade} aria-hidden="true" />
        <div className={styles.topProgress} aria-hidden="true"><div ref={progressRef} /></div>

        <div className={styles.corner} aria-label="Ming Creatives studio">
          <span className={styles.wordmark}>ming.creatives</span>
          <span>Independent mind. Creative studio.</span>
        </div>

        <div ref={openingRef} className={styles.opening}>
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
          <p className={styles.artworkNote}>AI-created studio film · imagined character</p>
          <nav className={styles.chapters} aria-label="Introduction chapters">
            <button type="button" onClick={() => jump(0)} aria-current={active === "intro" ? "step" : undefined} aria-label="Opening: Gwee Per Ming">
              <span>00</span><span className={styles.chapterName}>Intro</span>
            </button>
            {HERO_CHAPTERS.map((chapter) => (
              <button key={chapter.id} type="button" onClick={() => jump(chapter.jump)} aria-current={active === chapter.id ? "step" : undefined} aria-label={`Chapter ${chapter.number}: ${chapter.label}`}>
                <span>{chapter.number}</span><span className={styles.chapterName}>{chapter.label}</span>
              </button>
            ))}
          </nav>
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
