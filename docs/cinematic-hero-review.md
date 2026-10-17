# Cinematic hero review

Branch: `codex/cinematic-film-hero`.
Base: `origin/deployment-s3-vercel-enhanced`, commit `ea9ad6aa5fba148efa2e3efe5da7dfd679aef992` (latest fetched S3 enhancement branch when work began).
Review scope: replace only the homepage hero; keep Collections, Services, engineering, experience, archive, FAQ and contact sections in their existing order. No production merge, domain assignment, S3 upload or Vercel settings change is part of this implementation.

## Current refinement — 17 October 2026

The implementation below records the initial review version. This refinement supersedes its visible corner captions, chapter-pill controls and new-film scroll distances:

- The navbar is inert and hidden through the film, including the ending index. It fades/slides into view once Collections enters the viewport by 32px, and hides on return to the hero. A resize observer recalculates this after switching reading modes.
- The corner studio strapline and bottom artwork caption are removed as requested. The source remains AI-generated artwork; no documentary-portrait claim is added.
- The opening identity starts hidden behind an interactive foreground layer. The actual opening image supplies a gold-bead color matte; flexible textured strands move independently from a softly focused room plate. Pointer position bends the strands, a native button opens/closes them for touch and keyboard, and scrolling also opens them. Canvas work sleeps at rest, skips hidden documents and stops after the opening. It is not a cloth-physics simulation or a modification to the source video.
- The room plate covers the opening interval and blends into the original film by 2.5s. The later cushion/TV/passenger transitions and 01–04 cue times remain unchanged. Both MP4 files are unchanged.
- A single bottom streaming-style rail replaces both the top progress line and chapter-pill menu. It is a native keyboard/touch range with a 44px interaction height, chapter tick marks, a decoded-frame elapsed clock, and Read without motion alongside it.
- At the user's explicit request for slower playback, this film-only hero now uses 1320vh desktop, 1140vh at <=1024px, and 950vh at <=768px. Usable scroll travel grows from 460/390/320vh to 1220/1040/850vh, about 2.65 times the previous preview. The old global 560/490/420vh defaults and Lenis wheelMultiplier 1, touchMultiplier 1.1 and lerp 0.1 remain unchanged. This is slower scroll mapping, not a claim of measured perceptual parity with the former 169-frame film.
- Build and TypeScript checks pass. The final desktop 1920x1080 and mobile 390x844 renders, keyboard curtain opening, range End/Home, ending Collections route and navbar reveal were checked on a local production build. Computed film section heights are 14256px and 8018px respectively. No horizontal overflow was found in these views. Actual pointer movement and real-device Safari/Instagram-browser performance still need human review; the browser harness does not expose a hover operation.

Current screenshots: `.impeccable/review/curtain-refinement/`. No production settings or shared S3 media were changed.

### Finish pass — corrections and verification

- **Fixed: stale curtain state after the reader.** Opening the curtain, entering Read without motion and returning previously left the trigger reading “Close the curtain” (`aria-expanded="true"`) over a closed, remounted curtain. Hero now resets the trigger state and reveal amount whenever static mode begins (reader or reduced motion), so the film always returns closed and labelled “Draw the curtain”. Focus behavior is unchanged: entering focuses `hero-reading-heading`; returning focuses the visible Read without motion button with no scroll jump.
- **Fixed: landscape-phone collisions.** At 844x390 the centered trigger overlapped the introduction paragraph, the opening actions overlapped the timeline, and chapter 03's heading clipped above the viewport. A `(max-height: 500px)` adaptation top-aligns the opening (scroll prompt hidden), moves the curtain control to the free top-right corner, and compacts chapter and index type. Desktop, tablet and portrait-mobile rules are unchanged.
- **Pointer movement now exercised.** A scripted headless Chromium session (Playwright, real `mouse.move` events) swept the pointer across the desktop curtain: strands opened to 0.9 and the introduction reached full opacity, then closed to 0 on pointer leave.
- **Checked on the final local production build:** desktop 1920x1080 (hero 14256px), tablet 900x1024 (11674px), mobile 390x844 (8018px), landscape 844x390; no horizontal overflow. Keyboard Enter and mobile tap open the curtain; open → reader → return → reopen works on desktop and mobile. Range End reaches 00:15 / 00:15 with the navbar hidden; the navbar becomes visible and interactive in Collections and hides again on reversing into the hero. Reduced motion shows the reader without requesting the film. Build, `npx tsc --noEmit` and `git diff --check` pass.
- **Console:** the only errors are 404s for `/_vercel/insights` and `/_vercel/speed-insights` scripts, expected outside Vercel. In reduced-motion emulation a React hydration warning (#418) appeared intermittently; it traces to framer-motion `useReducedMotion` in sections outside this branch's scope (Services, FAQ, Engineering), not the hero, and was left untouched.
- **Still unverified:** physical iPhone Safari / Instagram in-app browser behavior and performance, and real touch-screen feel. Tablet widths keep cover-fit framing (scene edges cropped), unlike portrait mobile's full landscape framing. This pass is a bounded self-review, not an independent approval.

Finish-pass screenshots use the `final-` prefix in `.impeccable/review/curtain-refinement/` (desktop closed/hover/returned/ending, mobile returned, landscape open and 4s/6s/9s/14.95s chapters).

### Feedback round — curtain brightness, timeline labels, pacing curve

User feedback on the preview: the closed curtain looked darker than the film, the opened introduction hid the room behind a dark field, the timeline's chapter/clock labels should appear only on hover, the opening took four to five scrolls before the film began, and the glass “ming” lettering should get about two scrolls before 04 Explore.

- **Curtain matches the film.** `poster.webp` was frame 0, still inside the film's fade-up (average luma 39 against about 80 a quarter-second later). It is replaced by `opening.webp`, frame 8 (0.27s) from the supplied source: fully bright, with the curtain still closed. This frame is the hero still, loading/failure image and curtain source. Beads are extracted at full strength, the plate is unblurred while closed (up to 3px as strands part), and both canvases use the film's 45% framing. Closed, the canvas now recomposes the film frame.
- **Room stays visible when opened.** The opening scrim dropped from 68% to 38% centre opacity and fades to transparent. A two-layer text shadow keeps the copy legible, and buttons carry no shadow.
- **Timeline labels on hover.** The fixed chapter label and clock are gone. A scrub tip shows the chapter and time only while the rail is hovered, keyboard-focused or dragged. A mouse previews the hovered position; otherwise the tip sits at the thumb. `aria-valuetext` now includes the chapter name.
- **Pacing curve (user-requested).** Section heights stay 1320/1140/950vh and Lenis is unchanged. Scroll now maps to film time through the piecewise-linear `HERO_PACING`:
  - 0–2.5s (curtain and opening): 8.5% of travel, about 104vh on desktop, down from about 203vh.
  - 12.2–13.4s (glass lettering): 13%.
  - 04 Explore moved from 12.95s to 13.4s, so the lettering holds the screen alone for about 150vh (previously about 53vh).
  - The cushion, TV and passenger section keeps roughly its earlier rate.
  - Timeline jumps use the inverse curve.
- **Spacing.** At 1920x982 “Scroll to step inside” sat right on top of the curtain control. The opening's bottom padding grew, and heights at or below 700px (from 650px) hide the scroll prompt; 1366x660 previously touched.
- **Verified** with headless Chromium on a local production build:
  - The real pointer sweep opens the curtain to 0.9.
  - The tip is hidden at rest, reads “02 · The studio / 00:06 / 00:15” when hovering 40% along the rail, and hides again on leave.
  - Pacing samples land on the curve (8.5% → 2.50s; 75.9% → 12.20s; 88.9% → 13.40s), and Explore stays hidden until after 13.4s.
  - Range End still reaches 15s, and the reader round trip returns closed.
  - Intro/control clearance holds at 1920x982, 1440x900, 1366x768, 1280x720, 1366x660 and 1024x768; portrait mobile and landscape were also checked.
  - The earlier regression suite (navbar reveal/reverse, mobile tap, reader focus) still passes, with no horizontal overflow.
  - Build and `tsc` pass. The only console item remains the out-of-scope framer-motion #418 under reduced motion.
- **Unverified:** physical iPhone Safari / Instagram behavior, and how “one scroll” feels on the user's own trackpad or mouse. The curve's scroll lengths are measured in vh, not gestures.

Screenshots: `v2-` prefix in `.impeccable/review/curtain-refinement/`.

## Film and live content

The film is Ming's supplied `hf_20261017_041740_2fe5f4c1-8436-4c2f-b484-7a33b69d8210.mp4`. All 450 frames retain the original order and 30fps timing. Two silent H.264 encodes (1080p desktop, 720p mobile) add frequent keyframes for seeking. No zooms, fades, cuts or face changes were added to the film. Any ambiguity in the generated glass lettering or character remains in the supplied source.

The introductory identity, corner studio branding, numbering, headings, paragraphs, buttons and ending links are DOM elements. The film is decorative and labelled as an AI-created imagined scene. Text transitions follow the most recently decoded video frame, not a separately running timer. Pausing scroll lets visitors read; reversing scroll reverses the same story.

| Chapter | Source-film interval | Content and route |
| --- | --- | --- |
| Opening | 0–2.45s | Gwee Per Ming; production AI and creative work; AI Products / studio routes |
| 01 About me | 2.90–4.95s | Malaysian CS graduate and production AI/software work → Experience |
| 02 The studio | 5.05–6.35s | Ming Creatives, immersive sites, apps, 3D and generative-AI creative work → Collections |
| 03 Production AI | 7.35–10.55s | Current SITE introduction, agent/data work → AI Products |
| 04 Explore | 12.95s to end (13.4s since the feedback round) | Collections, Services, AI Products, Experience, Side Project; studio inquiry |

The in-between moments intentionally leave the artwork unobstructed, including the TV portal and passenger/light transition. Cue intervals are maintained in `src/lib/hero-story.ts`; readable copy is tailored from the existing `SITE` identity and public portfolio facts. No new metrics, awards or employer-held roles were introduced.

## Motion and accessibility

- Existing `.scroll-animation` distances stay 560vh desktop, 490vh at widths <=1024px and 420vh at widths <=768px. The source video is mapped linearly over that same travel distance; there is no added wheel/touch multiplier or second interpolation loop.
- Existing Lenis wheelMultiplier 1, touchMultiplier 1.1 and lerp 0.1 are unchanged.
- Chapter buttons jump through the same Lenis owner. Hidden chapters are inert and aria-hidden, removing their links from the keyboard order.
- Mobile uses the complete landscape image instead of a portrait crop that removes the television, passenger or final wordmark. The lower area holds the copy and chapter controls.
- Read without motion shows all four chapters in document order and unloads the video. The reduced-motion media query selects this layout without a video download. No-JavaScript visitors receive the same static reading layout.
- A poster remains available during loading or failure; retry and static-reading controls handle media errors.

## Verification

- `npm run build` passed, including Next.js TypeScript and static route generation.
- `npx tsc --noEmit` passed after route type regeneration. An initial invocation saw stale `.next/types` references to a prototype route from the previous checkout; rebuilding regenerated the correct route types.
- Desktop 1920x1080, tablet 900x1024 and mobile 390x844 layouts inspected. Computed section heights were approximately 6048px, 5018px and 3545px, matching the original viewport-unit rules (fractional viewport rounding applies).
- All four desktop and mobile chapter controls reached the corresponding source times with a single visible overlay. Ending internal-link targets exist.
- The ending AI Products link was clicked and reached its section, with the heading positioned below the navigation (112px from the viewport top).
- Keyboard Enter tests on desktop and mobile confirmed that reading mode focuses its heading and returning restores focus to the visible Read without motion control without an extra scroll jump.
- After the batched responsive fixes, no horizontal overflow was found. Static reader showed all four chapters, stopped video loading and focused its heading. Browser console captured no warnings or errors.
- Local film requests support HTTP 206 byte ranges. Poster and film use versioned paths in `public/hero/studio-journey-v1/`, independent of the existing CloudFront configuration.
- Real-device Safari/Instagram-browser testing remains a user review item; the local checks used a Chromium browser at phone dimensions.

Screenshots are local review evidence under `.impeccable/review/cinematic-hero/`; unrelated existing review files are not part of the commit. The mechanical design detector produced advisory color/type-ramp findings for the custom cinematic overlay treatment. Its results do not replace the independent finish review.

Independent finish review disposition: ready for branch handoff. Its one required fix, restoring keyboard focus after leaving the static reader, was implemented and verified on desktop and mobile. This review does not certify an actual production deployment or physical-device Safari behavior.

## Before a future production merge

Review the supplied film's ending, the four chapter cue points, mobile full-scene framing, chapter links, and the static reading mode. Confirm behavior on an actual phone. Keep this as a branch/preview until Ming approves it.

The read-only Vercel CLI project inspection returned `main` as the configured production branch even though the maintained S3 enhancement code lives on `deployment-s3-vercel-enhanced`. This implementation follows the requested latest S3 code base and does not change deployment configuration. Verify the intended production release path separately before merging/promoting anything.

### Curtain button removed

At the user's request the “Draw the curtain” / “Close the curtain” button was removed as redundant, along with its state, controller methods and styles. The curtain now opens two ways. A fine pointer reveals it to 0.9 on hover. Scrolling opens it fully by 1.3s of film time (about 54vh on desktop), which covers touch and keyboard (Space, Page Down, arrows). One Page Down lands on the opening; two pass it, because the opening fades by 2.45s. Read without motion remains the static alternative. Spacing added only to clear the button was reverted: desktop opening bottom padding is back to 150px, and the short-desktop rule to (max-height: 650px) with the scroll prompt shown.

Verified with headless Chromium on a local production build:
- Hover opens to 0.9 and pointer leave closes.
- Two Page Downs open the curtain fully.
- Mobile and landscape scroll to 1.3s opens it with the introduction visible.
- The reader round trip returns closed, with focus on Read without motion.
- The opened introduction clears the toolbar at 1920x982, 1440x900, 1366x768, 1280x720, 1366x640, 1024x768 and 844x390.
- No console errors other than local analytics 404s.

Screenshots: `v3-` prefix.
