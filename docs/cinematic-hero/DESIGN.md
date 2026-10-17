---
name: Ming Creatives Cinematic Hero
description: A supplied CGI studio film with white live chapter typography and an equivalent static reading path.
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
  chapter-control:
    textColor: "{colors.quiet-text}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  chapter-control-current:
    backgroundColor: "{colors.film-white}"
    textColor: "{colors.control-ink}"
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

The supplied cinematic CGI film leads this homepage hero. Premium white live DOM typography introduces Gwee Per Ming and Ming Creatives without baking essential information into the artwork. This is an Experience surface: the film carries the atmosphere; the interface provides readable chapters and clear onward routes.

This document is a scoped extraction of the implemented hero on `codex/cinematic-film-hero`, not a replacement for the root `DESIGN.md` or `PRODUCT.md`. It applies only to the film, its overlays, chapter controls, ending index, and static reader. The existing site navigation and every following section remain outside its authority. The North Star names the already chosen film-led treatment; it adds no new visual direction.

**Key Characteristics:**

- Supplied CGI film, with essential identity and chapter copy rendered as live DOM text.
- White Geist typography, restrained pill controls, and local dark contrast layers.
- Decoded-frame chapter cues over the preserved scroll travel, with deliberate artwork-only intervals.
- Full landscape framing on mobile and an equivalent motion-free reading path.

Source provenance: `src/components/sections/Hero.tsx` owns composition, visibility and focus; `Hero.module.css` owns the scoped visual treatment; `src/lib/hero-story.ts` owns media paths, chapter copy, destinations and cues; `src/hooks/useScrollFilm.ts` owns seeking and media lifecycle; `src/lib/smooth-scroll.ts` owns chapter jumps. Supporting incumbent sources are `src/app/globals.css`, `src/app/layout.tsx`, `src/components/providers/SmoothScrollProvider.tsx`, and `src/components/ui/AnchorLink.tsx`. Identity comes from `SITE` in `src/lib/seo.ts` and the established public facts in `PRODUCT.md`; this extraction did not inspect private career records.

Implementation evidence is recorded in `docs/cinematic-hero-review.md`, including a successful build and desktop, tablet, mobile, chapter-control, and reader checks. Those are the implementation's recorded checks, not new device testing performed for this documentation. Actual Safari/Instagram-browser phone review and production-release approval remain outstanding there.

## Colors

White reading elements sit on a near-black surround while the film supplies its own gold, glass, light and environmental color. Frontmatter owns the extracted primitive values; these are hero-local roles, not a new whole-site palette.

### Primary

- **Film White:** identity, headings, primary action surface, current chapter, and progress indicator.

### Neutral

- **Night:** film surround and static reader ground.
- **Control Ink:** text inside light primary and current-chapter controls; also the media-error surface.
- **Supporting Text:** role line, scroll prompt, destination details and utility copy.
- **Quiet Text:** unselected chapter controls, artwork attribution and static-reader paragraphs.
- **Chapter Copy:** the live chapter paragraphs over the film.

Link Hover supplies the restrained cool response for chapter actions and ending destinations. Focus is the existing shared keyboard outline, not a new decorative hero accent. Translucent borders and scrims remain implementation-specific treatments in the sidecar rather than an invented tonal scale.

**The Live White Type Rule.** Essential hero copy stays live and legible; the film's generated lettering never substitutes for identity, chapter text or navigation.

## Typography

**Display and Body Font:** Geist Sans, with Arial and sans-serif fallbacks, inherited from the existing layout. **Index Font:** Geist Mono with a monospace fallback.

Compact, balanced headings give the overlay its premium editorial character. The display, headline, chapter body, chapter label, control and numeric-index roles are extracted above. Chapter numbers use tabular numerals; chapter headings and the opening identity use balanced wrapping. Chapter paragraphs are limited to (44ch), and opening copy to (56ch).

The opening supporting line uses (550 weight), a fluid size of (`clamp(1.15rem, 2vw, 1.75rem)`) and tracking of (-0.025em). Its paragraph uses (16px) with (1.7) line height. These opening-only settings are not promoted into reusable tokens.

At mobile widths, the identity becomes (`clamp(2.8rem, 12vw, 4.5rem)`), chapter headings (`clamp(2.5rem, 10vw, 4rem)`) with a (15ch) cap, and chapter paragraphs (14px) with (1.65) line height. Primary and secondary labels become (12px). The ending index intentionally steps down from cinematic display to navigable text.

The static reader has its own readable hierarchy: identity (`clamp(2.5rem, 6vw, 5rem)`, 600 weight, 1.05 line height), chapter titles (`clamp(1.75rem, 3vw, 3rem)`, 600 weight, 1.1 line height), and paragraphs capped at (65ch). It is not a frozen overlay composition.

## Layout

The moving version has one sticky stage of (100svh). Its outer scroll distance stays (560vh) above tablet width, (490vh) at widths at or below (1024px), and (420vh) at or below (768px). Film progress uses `section.offsetHeight - window.innerHeight`; these heights are playback settings, not spare whitespace.

Desktop uses a cover-fit film, centered opening identity, a quiet upper-left wordmark and a bottom toolbar. Chapter overlays alternate left, right, left, then expand into an ending index. Regular chapter width is `min(530px, 44vw)`, aligned against a centered (1320px) composition with a minimum (40px) chapter inset. The desktop index has five equal destination columns. Film focal position changes with decoded time: (45%) before (5.1s), (36%) until (6.7s), then (50%).

At (1100px) and below, visible chapter names collapse to numbers, while full accessible button labels remain. At (768px) and below, the complete landscape film uses `object-fit: contain` and `object-position: center 20%` above the lower reading area. Preserve the TV, passenger and ending lettering in frame. Copy uses the mobile gutter; destination links become two columns and hide supplementary detail, and the toolbar wraps with chapter buttons first. Do not substitute a portrait cover crop.

Short desktop viewports, at heights up to (650px) and widths from (769px), tighten vertical spacing and type to keep copy above the toolbar. This is a height adaptation, not a change to film duration or scroll distance.

The static reader collapses the outer height to auto, hides the sticky stage, and exposes identity followed by all four chapters. Its centered container is capped at (1400px), with desktop padding (160px 40px 80px); chapter rows use a (1:3) grid. Mobile padding becomes (145px 24px 64px) and rows stack into one column.

**The Pacing Rule.** Preserve the existing hero travel and Lenis settings; layout refinement does not authorize accelerating the film.

## Elevation & Depth

Depth comes from the supplied CGI scene, not invented floating UI panels. A directional dark film scrim and local radial contrast fields support live text. The ending index uses a broader bottom gradient; mobile chapter copy uses a denser linear scrim. These are readability layers, not replacement effects applied to the film.

Chapter and corner text use subtle black text shadows. Controls separate through translucency, fine white borders and a light selected state, without a card-shadow system or backdrop blur. The sidecar records actual shadow and gradient extensions; no new shadow scale is implied.

## Shapes

Primary/secondary links and chapter controls share the pill silhouette. The chapter rail encloses its buttons with a fine translucent border. Chapter actions are text with an underline-like bottom border; ending destinations and reader chapters use horizontal rules rather than cards. The error notice alone uses softly rounded corners (12px). The film stage clips overflow, but mobile framing retains the entire landscape scene.

## Components

### Opening actions and chapter links

Primary links are light-on-dark and secondary links translucent with a white border. Both use a minimum height of (46px), flex alignment, the action-gap token, and background/color transitions of (180ms ease). Hover darkens the light primary surface and strengthens the secondary ground. Chapter actions have a minimum height of (44px), a fine bottom border and a cool hover response. The shared keyboard outline is (2px) with a (4px) offset. There is no bespoke pressed animation.

The opening routes are “Explore AI Products” to `#ai-systems` and “Enter the studio” to `#showcase`. In-page links retain real hash destinations and route enhanced navigation through the existing `AnchorLink`/Lenis owner. Do not replace link semantics with buttons.

### Signature scroll film and cues

The source is the user-supplied `hf_20261017_041740_2fe5f4c1-8436-4c2f-b484-7a33b69d8210.mp4`. The review records (450 frames), original (30fps) timing and (15s) duration. Silent H.264 review encodes and the poster are versioned under `public/hero/studio-journey-v1/`; desktop uses `film-1080.mp4`, mobile uses `film-720.mp4`, and loading/failure retain `poster.webp`. An `ending.webp` path is declared but is not rendered by this Hero. These assets are independent of the old CloudFront frame sequence.

No zoom, cut, face alteration, or additional film fade was introduced. The artwork is decorative (`aria-hidden` video, empty-alt poster), with the visible attribution “AI-created studio film · imagined character.” It is not presented as a documentary portrait or a product screenshot.

| Live chapter | Film interval | Jump time | Placement and onward route |
| --- | --- | --- | --- |
| Opening | Full opacity through 2.15s, fading out by 2.45s | 0s | Center; AI Products / studio |
| 01 About me | 2.90–4.95s | 3.75s | Left; Experience |
| 02 The studio | 5.05–6.35s | 5.65s | Right; Collections |
| 03 Production AI | 7.35–10.55s | 8.9s | Left; AI Products |
| 04 Explore | 12.95s through film end | 14.2s | Wide ending index; portfolio destinations / studio inquiry |

The final cue's configured end is (15.5s), intentionally beyond the media duration so it remains readable at the end. Chapter fade-in/out uses (0.22s) of film time with at most (10px) vertical reveal. Artwork-only gaps preserve the portal and passenger/light transitions.

Scroll maps linearly into the media duration minus one (1/30s) frame. Only one seek is in flight; `seeked` and the loaded frame's `currentTime` drive the text, focal position and top progress bar. Copy does not follow a separate timer or independent interpolation loop. Stopping scroll holds the chapter; reversing it retraces the story. Lenis remains at wheel multiplier (1), touch multiplier (1.1), and lerp (0.1), driven by the existing GSAP ticker.

### Chapter controls and focus

The toolbar contains the attribution, “Introduction chapters” navigation and “Read without motion.” Five native buttons represent Intro and the four numbered chapters. The current one uses `aria-current="step"`; on smaller widths numbers remain visible with full `aria-label` text. All chapter buttons retain at least (44px) height, and compact numeric buttons also have at least (44px) width.

Chapter jumps calculate the matching position in the existing section travel, then use immediate `scrollToPosition` through Lenis, falling back to native instant scrolling. They do not start playback or add another scroll owner. Hidden opening/chapter content becomes `inert` and `aria-hidden` below opacity (0.1); its links must not remain in the keyboard sequence. The current rail state follows the last chapter whose start time has passed, including artwork-only gaps; it need not imply visible copy in those gaps.

### Ending destinations

The Explore chapter offers Collections, Services, AI Products, Experience and Side Project as real links. Each has a fine top rule, a small directional arrow and desktop supporting detail. A separate studio-inquiry link uses `SITE.whatsapp` with a new tab and `noopener noreferrer`. The reader's fourth chapter instead uses its configured “Start a conversation” link to `#contact`, then offers “Continue to Collections.” Preserve these implemented distinctions rather than claiming identical ending navigation in both modes.

### Static reader and media states

“Read without motion” exposes all chapters in document order, unloads video, scrolls to the hero start and focuses the reader's programmatically focusable identity heading. “Return to the film” restores focus to the read button and returns to the hero start. It is omitted when reduced motion is requested. Reduced-motion CSS and preference state select the reader without requesting the film; the no-JavaScript fallback likewise exposes the reading layout.

The poster loads eagerly with high fetch priority. The video begins with `preload="none"`; the enabled hook selects one responsive source per initialization and then loads it. Orientation changes do not trigger a second source download within that initialization. Loading uses the status “Preparing the film…”; errors preserve the poster and offer “Try again” or “Read the introduction” in a status notice. Essential content is never conditional on successful video delivery.

## Do's and Don'ts

### Do:

- **Do** preserve the supplied film's order, timing and imagined-character attribution.
- **Do** keep Gwee Per Ming, Ming Creatives and essential chapter copy in readable live DOM text.
- **Do** preserve the original scroll distances and shared scroll owner when refining this hero.
- **Do** retain full landscape framing above the mobile reading area and verify chapter/control clearance.
- **Do** preserve inert hidden chapters, visible keyboard focus and the complete static reader.
- **Do** treat the implementation review as recorded evidence and actual-phone review as still pending.

### Don't:

- **Don't** overwrite the root design system or extend these hero-local rules to unrelated sections.
- **Don't** crop the mobile film into portrait, change the supplied character, or add unrequested film edits.
- **Don't** replace live text with generated glass lettering or describe the imagined scene as documentary proof.
- **Don't** retime captions with wall-clock animation or shorten the stage as a spacing optimization.
- **Don't** invent achievements, private data, new identity claims or whole-site component rules.
