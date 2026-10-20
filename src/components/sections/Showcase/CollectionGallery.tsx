"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, InstagramLogo, Play, X } from "@phosphor-icons/react";
import { collectionEntry, instagramProfile, isCollectionVideo } from "@/lib/collection";
import { suspendPageScroll } from "@/lib/smooth-scroll";
import { createGalleryWheelStepper } from "@/lib/gallery-wheel";
import styles from "./CollectionGallery.module.css";

export type GallerySelection = { index: number; source: HTMLElement; rect: DOMRect };
const EASE = "cubic-bezier(.16,1,.3,1)";
const palettes = new Map<string, string[]>();

function Palette({ src, supplied }: { src: string; supplied?: string[] }) {
  const [result, setResult] = useState<{ src: string; colors: string[] | null } | null>(null);
  const colors = supplied?.filter(c => /^#[0-9a-f]{6}$/i.test(c)) ?? (result?.src === src ? result.colors : undefined);
  useEffect(() => {
    if (supplied?.length || isCollectionVideo(src)) return;
    const cached = palettes.get(src);
    if (cached) { setResult({ src, colors: cached }); return; }
    const abort = new AbortController();
    fetch(`/api/collection/palette?key=${encodeURIComponent(collectionEntry(src, 0).key)}`, { signal: abort.signal })
      .then(async response => {
        if (!response.ok) throw new Error("Palette unavailable");
        const data = await response.json();
        const values: string[] = Array.isArray(data.colors) ? data.colors.filter((v: unknown) => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v)) : [];
        if (values.length) palettes.set(src, values);
        if (!abort.signal.aborted) setResult({ src, colors: values });
      })
      .catch(() => { if (!abort.signal.aborted) setResult({ src, colors: null }); });
    return () => abort.abort();
  }, [src, supplied]);
  if (isCollectionVideo(src) && !supplied?.length) return null;
  return <div className={styles.palette}>
    <p className={styles.paletteTitle}>{supplied?.length ? "Color palette" : "Colors from this image"}</p>
    {colors?.length ? <ul className={styles.swatches} aria-label="Image color palette">
      {colors.map(color => <li className={styles.swatch} key={color}><i style={{ backgroundColor: color }} aria-hidden="true" /><span>{color.toUpperCase()}</span></li>)}
    </ul> : <p className={styles.note}>{colors === undefined ? "Sampling colors…" : "Color palette unavailable."}</p>}
  </div>;
}

/** Experience extension: the photograph leads; credits recede. A field card
 * grows from its frozen position into an uncropped viewing stage. Navigation
 * slides images through the stage; closing restores the original scroll point.
 * Existing charcoal / Geist vocabulary, native dialog focus, no invented credits.
 */
export function CollectionGallery({ tiles, selection, onClose, reducedMotion }: {
  tiles: string[]; selection: GallerySelection; onClose: () => void; reducedMotion: boolean;
}) {
  const [index, setIndex] = useState(selection.index);
  const [direction, setDirection] = useState(1);
  const [retry, setRetry] = useState(0);
  const [mediaState, setMediaState] = useState<"loading" | "ready" | "error">("loading");
  const [wheelStep] = useState(createGalleryWheelStepper);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const firstFrame = useRef(true);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const src = tiles[index];
  const entry = collectionEntry(src, index);
  const video = isCollectionVideo(src);
  const profile = instagramProfile(entry.model?.instagram);

  const navigate = useCallback((next: number) => {
    const target = (next + tiles.length) % tiles.length;
    if (target === index) return;
    setDirection(next > index ? 1 : -1);
    setMediaState("loading");
    setIndex(target);
    setRetry(0);
  }, [index, tiles.length]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onWheel = (event: WheelEvent) => {
      const target = event.target;
      if (event.ctrlKey || event.metaKey || event.defaultPrevented || closing.current || tiles.length < 2 || !(target instanceof Element)) return;
      // Keep native video controls, zoom gestures and editable fields intact.
      if (target.closest("video, input, textarea, select, [contenteditable='true']")) return;
      // When the dialog needs vertical scrolling (mobile / zoom / short windows),
      // retain it outside the filmstrip. Horizontal gestures still browse.
      if (dialog.scrollHeight > dialog.clientHeight + 1 && Math.abs(event.deltaY) >= Math.abs(event.deltaX) && !stripRef.current?.contains(target)) return;
      if (!event.deltaX && !event.deltaY) return;
      event.preventDefault();
      const step = wheelStep(event, performance.now());
      if (step) navigate(index + step);
    };
    dialog.addEventListener("wheel", onWheel, { passive: false });
    return () => dialog.removeEventListener("wheel", onWheel);
  }, [index, navigate, tiles.length, wheelStep]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const resume = suspendPageScroll();
    const overflow = document.documentElement.style.overflow;
    const gutter = document.documentElement.style.scrollbarGutter;
    document.documentElement.style.scrollbarGutter = "stable";
    document.documentElement.style.overflow = "hidden";
    const playing = [...document.querySelectorAll("video")].filter(v => !v.paused && !dialog.contains(v));
    playing.forEach(v => v.pause());
    dialog.showModal();
    if (!reducedMotion) dialog.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: EASE });
    return () => {
      dialog.close();
      document.documentElement.style.overflow = overflow;
      document.documentElement.style.scrollbarGutter = gutter;
      resume();
      playing.filter(v => v.isConnected).forEach(v => v.play().catch(() => {}));
      selection.source.focus({ preventScroll: true });
    };
  }, [reducedMotion, selection]);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const animations: Animation[] = [];
    if (!reducedMotion) {
      if (firstFrame.current) {
        const target = frame.getBoundingClientRect();
        const origin = selection.rect;
        const transform = `translate(${origin.left - target.left}px, ${origin.top - target.top}px) scale(${origin.width / target.width}, ${origin.height / target.height})`;
        animations.push(frame.animate([{ transform, opacity: .5 }, { transform: "none", opacity: 1 }], { duration: 680, easing: EASE }));
      } else {
        animations.push(frame.animate([
          { opacity: .3, transform: `perspective(1200px) translate3d(${direction * 72}px, 0, -80px) rotateY(${-direction * 6}deg)`, transformOrigin: "center" },
          { opacity: 1, transform: "perspective(1200px) translate3d(0, 0, 0) rotateY(0deg)", transformOrigin: "center" },
        ], { duration: 480, easing: EASE }));
      }
      if (detailsRef.current) animations.push(detailsRef.current.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 460, delay: firstFrame.current ? 160 : 0, easing: EASE, fill: "backwards" }));
    }
    firstFrame.current = false;
    const strip = stripRef.current;
    const thumb = strip?.querySelector<HTMLElement>(`[data-index="${index}"]`);
    if (strip && thumb) strip.scrollTo({ left: thumb.offsetLeft - strip.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2, behavior: reducedMotion ? "instant" : "smooth" });
    return () => animations.forEach(a => a.cancel());
  }, [index, direction, reducedMotion, selection]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const dialog = dialogRef.current;
    if (reducedMotion || !dialog) { onClose(); return; }
    const frame = frameRef.current;
    if (frame && index === selection.index && selection.source.dataset.src === src) {
      const target = frame.getBoundingClientRect();
      const origin = selection.source.getBoundingClientRect();
      frame.animate([{ transform: "none" }, {
        transform: `translate(${origin.left - target.left}px, ${origin.top - target.top}px) scale(${origin.width / target.width}, ${origin.height / target.height})`,
      }], { duration: 240, easing: EASE, fill: "forwards" });
    }
    const animation = dialog.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: "ease-out", fill: "forwards" });
    animation.finished.then(onClose, onClose);
  }, [onClose, reducedMotion, index, selection, src]);

  return createPortal(<dialog ref={dialogRef} className={styles.dialog} aria-label="Ming Creatives collection viewer" data-lenis-prevent
    onCancel={event => { event.preventDefault(); close(); }}
    onKeyDown={event => {
      // Native video controls retain their own seek/volume shortcuts.
      if ((event.target as HTMLElement).tagName === "VIDEO") return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); navigate(index + (event.key === "ArrowRight" ? 1 : -1)); }
    }}>
    <div className={styles.shell}>
      <header className={styles.top}>
        <p className={styles.brand}>Ming Creatives<span className={styles.topTitle}>Collection</span></p>
        <button type="button" className={styles.close} onClick={close} autoFocus aria-label="Close collection">Close<X aria-hidden="true" /></button>
      </header>
      <div className={styles.content}>
        <div ref={frameRef} className={styles.frame} style={{ transformOrigin: "top left" }}
          onTouchStart={e => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
          onTouchEnd={e => {
            if (!touch.current || video) return;
            const dx = e.changedTouches[0].clientX - touch.current.x;
            const dy = e.changedTouches[0].clientY - touch.current.y;
            touch.current = null;
            if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) navigate(index + (dx < 0 ? 1 : -1));
          }}>
          {mediaState === "error" ? <div className={styles.error}><p>This image couldn’t load.</p><button onClick={() => { setRetry(n => n + 1); setMediaState("loading"); }}>Try again</button></div> : video ?
            <video key={`${src}:${retry}`} className={styles.media} src={src} poster={entry.poster} controls playsInline preload="metadata" aria-label={entry.title} onLoadedMetadata={() => { if (entry.poster) setMediaState("ready"); }} onLoadedData={() => setMediaState("ready")} onError={() => setMediaState("error")} /> :
            // Original media, uncropped; thumbnails reuse the already loaded field assets.
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`${src}:${retry}`} className={styles.media} src={src} alt={entry.alt} draggable={false} onLoad={() => setMediaState("ready")} onError={() => setMediaState("error")} />}
          {mediaState === "loading" ? <p className={styles.loading} role="status">Loading {video ? "film" : "image"}…</p> : null}
        </div>
        <div ref={detailsRef} className={styles.details}>
          <h2>{entry.title}</h2>
          {entry.description ? <p className={styles.description}>{entry.description}</p> : null}
          <dl className={styles.metadata}>
            {entry.location ? <div><dt>Location</dt><dd>{entry.location}</dd></div> : null}
            {entry.model ? <div><dt>Talent</dt><dd>{entry.model.name}{profile ? <><br /><a className={styles.instagram} href={profile} target="_blank" rel="noopener noreferrer"><InstagramLogo aria-hidden="true" />Instagram</a></> : null}</dd></div> : null}
            {entry.capturedAt ? <div><dt>Captured</dt><dd>{entry.capturedAt}</dd></div> : null}
          </dl>
          <Palette src={src} supplied={entry.palette} />
          <div className={styles.nav}>
            <p className={styles.count} aria-live="polite" aria-atomic="true">{String(index + 1).padStart(2, "0")} <span aria-hidden="true">/</span><span className="sr-only"> of </span> {String(tiles.length).padStart(2, "0")}</p>
            <div className={styles.arrows}><button className={styles.arrow} aria-label="Previous image" onClick={() => navigate(index - 1)} disabled={tiles.length < 2}><ArrowLeft aria-hidden="true" /></button><button className={styles.arrow} aria-label="Next image" onClick={() => navigate(index + 1)} disabled={tiles.length < 2}><ArrowRight aria-hidden="true" /></button></div>
          </div>
        </div>
      </div>
      <footer className={styles.bottom}>
        <p className={styles.hint}>A closer look.<br />Scroll, swipe or use the arrow keys.</p>
        <div className={styles.strip} ref={stripRef} role="group" aria-label="Collection thumbnails">
          {tiles.map((tile, i) => {
            const item = collectionEntry(tile, i);
            return <button type="button" key={tile} className={styles.thumb} data-index={i} aria-current={i === index} aria-label={`View ${item.title}`} title={item.title} onClick={() => navigate(i)}>
              {isCollectionVideo(tile) ? <span className={styles.clipThumb}>
                {/* Static posters avoid six extra video decoders and media downloads. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {item.poster ? <img src={item.poster} alt="" loading="lazy" draggable={false} /> : null}
                <span className={styles.playBadge}><Play weight="fill" aria-hidden="true" /></span>
              </span> :
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tile} alt="" loading="lazy" draggable={false} />}
            </button>;
          })}
        </div>
      </footer>
    </div>
  </dialog>, document.body);
}
