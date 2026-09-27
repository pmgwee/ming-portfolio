---
name: Ming Creatives Portfolio
description: A cinematic portfolio that makes engineering evidence readable and creative work immersive.
colors:
  night: "#07080c"
  raised-surface: "#101219"
  foreground: "#f4f4f5"
  secondary-text: "#d4d4d8"
  quiet-text: "#a1a1aa"
  accent: "#c7d2fe"
  dispatch-paper: "#e7ebec"
  dispatch-ink: "#141a20"
typography:
  display:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "clamp(3.25rem, 6.2vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 4.25rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  surface: "16px"
  inset: "12px"
  control: "9999px"
spacing:
  compact: "8px"
  default: "16px"
  group: "24px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.night}"
    rounded: "{rounded.control}"
    padding: "10px 20px"
  button-secondary:
    backgroundColor: "{colors.night}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "10px 20px"
  evidence-surface:
    backgroundColor: "{colors.dispatch-paper}"
    textColor: "{colors.dispatch-ink}"
    rounded: "{rounded.inset}"
    padding: "28px"
---

# Design System: Ming Creatives Portfolio

## Overview

**Creative North Star: "The Working Studio"**

A near-black studio surface gives visual work its cinematic setting. When the page presents engineering evidence, a cool, light document surface brings the result into focus. The contrast between those materials lets a visitor read an actual outcome before exploring the process behind it.

The composition remains spacious and typographic. Dense interfaces are reserved for demonstrations; project and experience sections return to clear editorial rows. The same site can feel precise for recruiters and expressive for creative clients without changing identity halfway through.

**Key Characteristics:**
- Large, plain-language headings in Geist Sans with generous surrounding space.
- Dark charcoal surfaces, restrained cool-indigo controls, and a light evidence surface.
- A wide reading grid for projects and experience; immersive motion in the creative sequence.
- Strong visible focus states and readable static content when motion is reduced.

## Colors

Night (`#07080c`) is the page ground. Raised Surface (`#101219`) holds the interactive workbench. Foreground (`#f4f4f5`) and Secondary Text (`#d4d4d8`) carry the reading hierarchy; Quiet Text (`#a1a1aa`) is for supporting labels only. Accent (`#c7d2fe`) marks interactive states and small moments of emphasis. Dispatch Paper (`#e7ebec`) and Dispatch Ink (`#141a20`) belong to readable artifact panels.

**The Evidence Contrast Rule.** Use the light surface for an output a visitor should inspect. Keep surrounding controls dark so the result has one clear focal point.

## Typography

Geist Sans is the primary voice. The display is bold and compact, capped at 6rem with tracking no tighter than -0.04em. Section headlines step down visibly from the display. Body copy uses a comfortable line height and generally stays within 65–75 characters. Geist Mono is reserved for code, measured values, and small numeric indices where alignment matters.

## Layout

The page uses a centered container capped at 1400px, with 24px side padding on small screens and 40px from the medium breakpoint. The first viewport puts identity beside a tangible output on desktop. On mobile, identity leads and the output follows without a miniature desktop sidebar. Engineering and Experience use two-column editorial rows at medium widths; content stacks in natural reading order below that. Main sections have roughly 96–128px vertical padding.

**The Result First Rule.** On constrained screens, the proof artifact appears before supporting source detail. Supporting context remains available through labelled controls.

## Elevation & Depth

Dark surfaces separate mostly through tonal changes and fine borders. The main workbench uses a broad downward shadow (`0 25px 80px rgba(0,0,0,0.32)`). The light output uses a smaller structural shadow (`0 12px 36px rgba(0,0,0,0.14)`). The creative card sequence retains its existing layered shadow and image depth.

## Shapes

Primary panels use 16px corners; inset artifacts use 12px. Buttons and small status controls are pills. Editorial project rows rely on horizontal rules and whitespace rather than repeated card containers. The navigation keeps its existing rounded floating silhouette.

## Components

### Buttons

The primary button is light on dark, 44px or taller, with a small action arrow where direction helps. The secondary button is dark with a quiet light border. Both have clear hover and keyboard focus states.

### Interactive workbench

The workbench has one dark outer frame and a lighter output surface. A short tab strip switches between result, source notes, and operating explanation. All controls are semantic buttons; arrow keys move between tabs. Every sample surface identifies its data as illustrative and its account connections as inactive.

### Project rows

Each row starts with a linked project title, a plain-language task, one verifiable signal, and a case-study route. A decorative hover preview may add visual character, but the row's meaning and proof remain available without hover.

### Creative sequences

The Side Project card morph and Collections image/video showcase remain the expressive chapters. The 3D room sequence belongs with creative work, loads its frames as the section approaches, and has a static or reduced-motion reading path.

## Do's and Don'ts

### Do:
- **Do** make the outcome the largest visual element inside a product demonstration.
- **Do** label sample content and distinguish it from real operating status.
- **Do** use concise project summaries before deeper architecture and proof.
- **Do** preserve accessible text and navigation through every motion sequence.

### Don't:
- **Don't** make decorative concept art stand in for a product screenshot or benchmark.
- **Don't** use the bright output treatment for every card; it marks an inspectable artifact.
- **Don't** let long animation delay the first engineering evidence.
