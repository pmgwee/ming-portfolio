---
name: Ming Creatives Cinematic Hero
description: A supplied CGI studio film opened by an interactive curtain layer, with white live chapter typography, a streaming-style timeline and an equivalent static reading path.
colors:
  film-white: "#fff"
  night: "#07080c"
  control-ink: "#101219"
  supporting-text: "#e4e4e7"
  quiet-text: "#d4d4d8"
  chapter-copy: "#f1f1f4"
  link-hover: "#dce3ff"
  focus: "#c7d2fe"
typography:
  display:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "clamp(3rem, 6vw, 6rem)"
    fontWeight: 650
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "clamp(2.75rem, 4.7vw, 5.2rem)"
    fontWeight: 650
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "16px"
    lineHeight: 1.75
  label:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 550
  control:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
  utility:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "11px"
  index:
    fontFamily: "Geist Mono, monospace"
    fontSize: "12px"
rounded:
  pill: "999px"
spacing:
  action-gap: "12px"
  mobile-gutter: "24px"
  chapter-gutter: "40px"
components:
  hero-primary:
    backgroundColor: "{colors.film-white}"
    textColor: "{colors.control-ink}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "11px 22px"
  hero-primary-hover:
    backgroundColor: "{colors.supporting-text}"
  hero-secondary:
    backgroundColor: "rgb(7 8 12 / 55%)"
    textColor: "{colors.film-white}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "11px 22px"
  hero-secondary-hover:
    backgroundColor: "rgb(7 8 12 / 85%)"
  curtain-trigger:
    textColor: "{colors.film-white}"
    padding: "8px 4px"
  film-timeline:
    textColor: "{colors.supporting-text}"
    typography: "{typography.utility}"
  chapter-action:
    textColor: "{colors.film-white}"
    padding: "7px 0"
  destination-link:
    textColor: "{colors.film-white}"
    padding: "14px 0"
---

# Design System: Ming Creatives Cinematic Hero

## Overview

**Creative North Star: "The Scroll Film"**

The supplied cinematic CGI film leads this homepage hero. The first viewport is artwork: the introduction to Gwee Per Ming and Ming Creatives waits behind an interactive foreground curtain, and premium white live DOM typography carries every essential word. This is an Experience surface: the film carries the atmosphere; the interface provides readable chapters and clear onward routes.

This document is a scoped extraction of the implemented hero on `codex/cinematic-film-hero`, not a replacement for the root `DESIGN.md` or `PRODUCT.md`. It applies only to the film, its curtain layer, overlays, timeline, ending index, static reader, and the navbar's hero-only hide/reveal rule. The navbar's own design and every following section remain outside its authority. The North Star names the already chosen film-led treatment; it adds no new visual direction.

**Key Characteristics:**

- Artwork first: the introduction waits behind an interactive curtain of gold bead strands.
- Supplied CGI film, with essential identity and chapter copy rendered as live DOM text.
- White Geist typography, a single thin streaming-style timeline, and local dark contrast layers.
- Decoded-frame chapter cues over a deliberately slower, user-authorized scroll travel, with artwork-only intervals.
- No site navbar inside the film; it reveals as Collections enters.
- Full landscape framing on mobile and an equivalent motion-free reading path.

Source provenance: `src/components/sections/Hero.tsx` owns composition, visibility, curtain-trigger state and focus; `CurtainLayer.tsx` owns the curtain canvases; `Hero.module.css` owns the scoped visual treatment; `src/lib/hero-story.ts` owns media paths, chapter copy, destinations and cues; `src/hooks/useScrollFilm.ts` owns seeking and media lifecycle; `src/lib/smooth-scroll.ts` owns timeline jumps; `src/components/ui/Navbar.tsx` with `Navbar.module.css` owns the hero-aware reveal. Supporting incumbent sources are `src/app/globals.css`, `src/app/layout.tsx`, `src/components/providers/SmoothScrollProvider.tsx`, and `src/components/ui/AnchorLink.tsx`. Identity comes from `SITE` in `src/lib/seo.ts` and the established public facts in `PRODUCT.md`; this extraction did not inspect private career records.

Implementation evidence is recorded in `docs/cinematic-hero-review.md` (see “Current refinement — 17 October 2026”), including builds and scripted headless-Chromium checks of real pointer movement, keyboard/touch curtain control, reader round trips, the timeline, navbar reveal, and desktop/tablet/mobile/landscape layouts. Those are emulated checks, not physical-device testing. Actual Safari/Instagram-browser phone review and production-release approval remain outstanding.

## Colors

White reading elements sit on a near-black surround while the film supplies its own gold, glass, light and environmental color. Frontmatter owns the extracted primitive values; these are hero-local roles, not a new whole-site palette.

### Primary

- **Film White:** identity, headings, primary action surface, curtain control, and the played timeline segment and thumb.

### Neutral

- **Night:** film surround, curtain backdrop fill and static reader ground.
- **Control Ink:** text inside the light primary action; also the media-error surface.
- **Supporting Text:** role line, scroll prompt, destination details, timeline label and utility copy.
- **Quiet Text:** elapsed clock and static-reader paragraphs.
- **Chapter Copy:** the live chapter paragraphs over the film.

Link Hover supplies the restrained cool response for chapter actions and ending destinations. Focus is the existing shared keyboard outline, not a new decorative hero accent. Translucent borders and scrims remain implementation-specific treatments in the sidecar rather than an invented tonal scale.

**The Live White Type Rule.** Essential hero copy stays live and legible; the film's generated lettering and the curtain never substitute for identity, chapter text or navigation.

## Typography

**Display and Body Font:** Geist Sans, with Arial and sans-serif fallbacks, inherited from the existing layout. **Index Font:** Geist Mono with a monospace fallback.

Compact, balanced headings give the overlay its premium editorial character. The display, headline, chapter body, chapter label, control, utility and numeric-index roles are extracted above. Chapter numbers use tabular numerals; chapter headings and the opening identity use balanced wrapping. Chapter paragraphs are limited to (44ch), and opening copy to (56ch). The timeline label and read button use the (11px) utility size; the elapsed clock uses tabular numerals.

The opening supporting line uses (550 weight), a fluid size of (`clamp(1.15rem, 2vw, 1.75rem)`) and tracking of (-0.025em). Its paragraph uses (16px) with (1.7) line height. These opening-only settings are not promoted into reusable tokens.

At mobile widths, the identity becomes (`clamp(2.8rem, 12vw, 4.5rem)`), chapter headings (`clamp(2.5rem, 10vw, 4rem)`) with a (15ch) cap, and chapter paragraphs (14px) with (1.65) line height. Primary and secondary labels become (12px). The ending index intentionally steps down from cinematic display to navigable text.

The static reader has its own readable hierarchy: identity (`clamp(2.5rem, 6vw, 5rem)`, 600 weight, 1.05 line height), chapter titles (`clamp(1.75rem, 3vw, 3rem)`, 600 weight, 1.1 line height), and paragraphs capped at (65ch). It is not a frozen overlay composition.

## Layout

The moving version has one sticky stage of (100svh). At the user's explicit request for slower playback, this film-only section is (1320vh) above tablet width, (1140vh) at widths at or below (1024px), and (950vh) at or below (768px). These override the global `.scroll-animation` defaults (560/490/420vh), which remain unchanged in `globals.css`. Usable travel is about 2.65 times the first preview. Film progress uses `section.offsetHeight - window.innerHeight`; these heights are playback settings, not spare whitespace.

Desktop uses a cover-fit film, a centered opening identity (hidden until the curtain opens), a centered “Draw the curtain” control above the toolbar, and a bottom toolbar with the timeline on the left and “Read without motion” on the right. There are no corner captions or wordmark over the film. Chapter overlays alternate left, right, left, then expand into an ending index. Regular chapter width is `min(530px, 44vw)`, aligned against a centered (1320px) composition with a minimum (40px) chapter inset. The desktop index has five equal destination columns. Film focal position changes with decoded time: (45%) before (5.1s), (36%) until (6.7s), then (50%).

Tablet widths (769–1024px) keep the cover-fit desktop framing, so some scene edges are cropped there. At (768px) and below, the complete landscape film uses `object-fit: contain` and `object-position: center 20%` above the lower reading area. Preserve the TV, passenger and ending lettering in frame. Copy uses the mobile gutter; destination links become two columns and hide supplementary detail, and the toolbar stacks a full-width timeline above the read button. Do not substitute a portrait cover crop.

Short desktop viewports, at heights up to (650px) and widths from (769px), tighten vertical spacing and type to keep copy above the toolbar. Viewports up to (500px) tall, such as landscape phones, go further: the opening is top-aligned without the scroll prompt, the curtain control moves to the free top-right corner, and chapter/index type is compacted so headings stay in frame above the timeline. These are height adaptations, not changes to film duration or scroll distance.

The static reader collapses the outer height to auto, hides the sticky stage, and exposes identity followed by all four chapters. Its centered container is capped at (1400px), with desktop padding (160px 40px 80px); chapter rows use a (1:3) grid. Mobile padding becomes (145px 24px 64px) and rows stack into one column.

**The Pacing Rule.** The 1320/1140/950vh travel is a user-authorized motion setting. Keep it, and Lenis at wheel multiplier (1), touch multiplier (1.1) and lerp (0.1), unless the user asks for a pacing change; layout refinement does not authorize retiming the film.

## Elevation & Depth

Depth comes from the supplied CGI scene, not invented floating UI panels. A directional dark film scrim and local radial contrast fields support live text. The ending index uses a broader bottom gradient; mobile chapter copy uses a denser linear scrim. These are readability layers, not replacement effects applied to the film.

The curtain is the one deliberate foreground layer: canvas strands (z-index 3) above the introduction (2), with a softly blurred reconstructed room plate (1) behind it. Chapter text uses a subtle black text shadow. Controls separate through translucency and fine white rules, without a card-shadow system or backdrop blur. The sidecar records actual shadow and gradient extensions; no new shadow scale is implied.

## Shapes

Primary and secondary links share the pill silhouette. The timeline is a visually (2px) rail with a (6px) round thumb and (1px) chapter ticks. The curtain control and chapter actions are text with a bottom rule; ending destinations and reader chapters use horizontal rules rather than cards. The error notice alone uses softly rounded corners (12px). The film stage clips overflow, but mobile framing retains the entire landscape scene.

## Components

### Opening actions and chapter links

Primary links are light-on-dark and secondary links translucent with a white border. Both use a minimum height of (46px) ((44px) on short viewports), flex alignment, the action-gap token, and background/color transitions of (180ms ease). Hover darkens the light primary surface and strengthens the secondary ground. Chapter actions have a minimum height of (44px), a fine bottom border and a cool hover response. The shared keyboard outline is (2px) with a (4px) offset. There is no bespoke pressed animation.

The opening routes are “Explore AI Products” to `#ai-systems` and “Enter the studio” to `#showcase`. In-page links retain real hash destinations and route enhanced navigation through the existing `AnchorLink`/Lenis owner. Do not replace link semantics with buttons.

### Interactive curtain

The opening identity starts hidden, inert and `aria-hidden`. `CurtainLayer` extracts warm, low-saturation gold bead pixels from the actual opening poster into a strand texture and reconstructs a room plate behind them from neighbouring pixels. Strands are sliced into short rows and pulled sideways by a spring toward the target opening; pointer proximity adds independent sway.

- **Pointer:** fine pointers reveal up to (0.9) while hovering and close on leave.
- **Touch and keyboard:** a native “Draw the curtain” / “Close the curtain” button (`aria-controls="hero-introduction"`, `aria-expanded`) latches the curtain fully open or closed.
- **Scroll:** film time opens the curtain fully by (1.3s), so interaction is never required.
- **Lifecycle:** canvas work sleeps at rest, pauses on hidden documents and stops drawing after (2.5s), by which point the plate has blended into the original film. The control hides once chapter 01 begins.

It is an image-derived effect, not cloth physics, and the MP4 files are unchanged. The layer unmounts in reader and reduced-motion modes; Hero resets its trigger state and reveal amount with it, so returning to the film always starts closed and labelled “Draw the curtain”.

### Signature scroll film and cues

The source is the user-supplied `hf_20261017_041740_2fe5f4c1-8436-4c2f-b484-7a33b69d8210.mp4`. The review records (450 frames), original (30fps) timing and (15s) duration. Silent H.264 review encodes and the poster are versioned under `public/hero/studio-journey-v1/`; desktop uses `film-1080.mp4`, mobile uses `film-720.mp4`, and loading/failure and the curtain texture use `poster.webp`. An `ending.webp` path is declared but is not rendered by this Hero. These assets are independent of the old CloudFront frame sequence.

No zoom, cut, face alteration, or additional film fade was introduced. The artwork is decorative (`aria-hidden` video, empty-alt poster). The former visible captions (“ming.creatives / Independent mind. Creative studio.” and “AI-created studio film · imagined character”) were removed at the user's request; the source remains AI-generated artwork and is not presented as a documentary portrait or a product screenshot.

| Live chapter | Film interval | Placement and onward route |
| --- | --- | --- |
| Opening | Revealed by the curtain; fading out by 2.45s | Center; AI Products / studio |
| 01 About me | 2.90–4.95s | Left; Experience |
| 02 The studio | 5.05–6.35s | Right; Collections |
| 03 Production AI | 7.35–10.55s | Left; AI Products |
| 04 Explore | 12.95s through film end | Wide ending index; portfolio destinations / studio inquiry |

The final cue's configured end is (15.5s), intentionally beyond the media duration so it remains readable at the end. Chapter fade-in/out uses (0.22s) of film time with at most (10px) vertical reveal. Artwork-only gaps preserve the cushion, TV portal and passenger/light transitions. The `jump` values in `hero-story.ts` belonged to the removed chapter buttons and are currently unused.

Scroll maps linearly into the media duration minus one (1/30s) frame. Only one seek is in flight; `seeked` and the loaded frame's `currentTime` drive the text, focal position, curtain time and timeline. Copy does not follow a separate timer or independent interpolation loop. Stopping scroll holds the chapter; reversing it retraces the story. Lenis is driven by the existing GSAP ticker.

### Timeline and focus

The bottom toolbar holds one minimalist streaming-style timeline and “Read without motion.” It replaces the earlier top progress line and chapter-pill menu. The timeline is a native range input labelled “Film position” (0–15s in 0.1s steps, `aria-valuetext` in seconds) with a visually thin rail inside a (44px) interaction height. Above it sit the current chapter name (“Prologue” before 01, then “01 · About me” and so on) and a decoded-frame elapsed clock that reads 00:15 / 00:15 at the end; tick marks sit at each chapter start.

Changing the range calculates the matching position in the section travel and uses immediate `scrollToPosition` through Lenis, falling back to native instant scrolling. It does not start playback or add another scroll owner. Hidden opening/chapter content becomes `inert` and `aria-hidden` below opacity (0.1); its links must not remain in the keyboard sequence.

### Ending destinations

The Explore chapter offers Collections, Services, AI Products, Experience and Side Project as real links. Each has a fine top rule, a small directional arrow and desktop supporting detail. A separate studio-inquiry link uses `SITE.whatsapp` with a new tab and `noopener noreferrer`. The reader's fourth chapter instead uses its configured “Start a conversation” link to `#contact`, then offers “Continue to Collections.” Preserve these implemented distinctions rather than claiming identical ending navigation in both modes.

### Navbar in the hero

The site navbar is hidden, `aria-hidden` and `inert` throughout the film, including the ending index. It reveals with an opacity/translate transition (450ms opacity, 600ms translate) once `#showcase` enters the viewport by (32px), and hides again when scrolling back into the hero. A resize observer on the hero recalculates after reader-mode height changes. Reduced motion removes the spatial transition.

### Static reader and media states

“Read without motion” exposes all chapters in document order, unloads the video and the curtain, scrolls to the hero start and focuses the reader's programmatically focusable identity heading. “Return to the film” restores focus to the read button without an extra scroll jump, with the curtain closed. It is omitted when reduced motion is requested. Reduced-motion CSS and preference state select the reader without requesting the film; the no-JavaScript fallback likewise exposes the reading layout.

The poster loads eagerly with high fetch priority. The video begins with `preload="none"`; the enabled hook selects one responsive source per initialization and then loads it. Orientation changes do not trigger a second source download within that initialization. Loading uses the status “Preparing the film…”; errors preserve the poster and offer “Try again” or “Read the introduction” in a status notice. Essential content is never conditional on successful video delivery.

## Do's and Don'ts

### Do:

- **Do** preserve the supplied film's order and timing, and keep it framed as AI-generated artwork without documentary claims.
- **Do** keep Gwee Per Ming, Ming Creatives and essential chapter copy in readable live DOM text.
- **Do** preserve the authorized 1320/1140/950vh travel and the shared scroll owner when refining this hero.
- **Do** keep the curtain's button and scroll alternatives, and reset its state whenever the layer remounts.
- **Do** retain full landscape framing above the mobile reading area and verify chapter/control clearance, including landscape phones.
- **Do** preserve inert hidden chapters, visible keyboard focus and the complete static reader.
- **Do** treat the implementation review as recorded emulated evidence and actual-phone review as still pending.

### Don't:

- **Don't** overwrite the root design system or extend these hero-local rules to unrelated sections.
- **Don't** crop the mobile film into portrait, change the supplied character, or add unrequested film edits.
- **Don't** replace live text with generated glass lettering or describe the imagined scene as documentary proof.
- **Don't** retime captions with wall-clock animation, change the stage height as a spacing optimization, or make curtain interaction mandatory.
- **Don't** reintroduce the corner captions, chapter-pill menu or top progress line, or show the navbar inside the film.
- **Don't** invent achievements, private data, new identity claims or whole-site component rules.
