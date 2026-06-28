# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Serve the production build locally
```

No linter or test runner is configured — TypeScript (`tsc`) is the only static check (`npx tsc --noEmit`).

## Stack

- **Next.js 16 (App Router)** · React 19 · TypeScript · Tailwind CSS 4
- **GSAP + ScrollTrigger** — scroll-scrubbed animation timeline in `Showcase`
- **Lenis** — physics smooth scroll, driven by `gsap.ticker` (not its own RAF)
- **Framer Motion** — declarative motion elsewhere
- **Vercel Analytics + Speed Insights** — injected in `layout.tsx`

## Brand & positioning

- **Public brand:** Ming Creatives (`ming.creatives` wordmark)
- **Person:** Perming Gwee (international) / Gwee Per Ming (Malaysia order)
- **Primary hook:** Awwwards-level 3D animated websites for brands and portfolios
- **Secondary:** Generative AI development
- **Primary CTA:** WhatsApp — `https://wa.me/message/DFUGF3HXISNEF1`
- **Logo:** `public/logo-resized.png` — crystal "M" icon, used in Navbar beside the wordmark

All copy (title, description, job title, keywords, expertise) derives from `src/lib/seo.ts`. Edit there first; components consume `SITE.*` so nothing else needs touching.

## Architecture

### Page structure (`src/app/page.tsx`)

The single route is a statically prerendered RSC with `export const revalidate = 3600` (ISR). It fetches S3 media listings at build time via `getShowcaseMedia()` and passes the URLs as props so the browser never needs a fetch waterfall.

Three sections render in order: `<Hero>` → `<Showcase>` → `<NextSection>`.

### SEO / AEO / GEO layer

All metadata lives in one place — edit `src/lib/seo.ts` and every surface updates automatically:

| File | Role |
|---|---|
| `src/lib/seo.ts` | Single source of truth — `SITE` object drives everything below |
| `src/app/layout.tsx` | Consumes `SITE` for Next.js `Metadata` (title, OG, Twitter Card, keywords, canonical) |
| `src/components/seo/JsonLd.tsx` | Injects `schema.org/Person` JSON-LD with `knowsAbout`, `sameAs`, `alternateName` — core AEO/GEO signal |
| `src/app/sitemap.ts` | Generates `/sitemap.xml` from `SITE.url` |
| `src/app/robots.ts` | Generates `/robots.txt` |
| `src/app/manifest.ts` | Web app manifest |
| `src/app/opengraph-image.tsx` | OG image via Next.js file convention (auto-injected, cache-busted) |

### UI components

**Navbar** (`src/components/ui/Navbar.tsx`) — fixed pill nav, scrolled state adds backdrop blur. Shows: logo + wordmark → nav links → "Let's talk" WhatsApp CTA.

**Button** (`src/components/ui/Button.tsx`) — `variant` (`primary` | `secondary`), `showArrow`, `target`, `rel` props. Use `target="_blank" rel="noopener noreferrer"` for external links.

**Footer** (`src/components/sections/Footer.tsx`) — 3-column layout: brand + social icons + © | Explore links | Start a project CTA (WhatsApp). Description and brand name sourced from `SITE`.

### Section 1 — Hero (`src/components/sections/Hero.tsx`)

Scroll-scrubbed canvas frame sequence (169 JPGs). `useImagePreloader` blocks the loading overlay until every frame loads.

**Annotation cards** — defined in `src/lib/hero.ts` as `ANNOTATIONS[]`. Each card has `show`/`hide` scroll-progress thresholds, `eyebrow`, `title`, `body`, and optional `position` (`left` | `center` | `right`). Edit copy there; Hero.tsx renders them generically.

**Hero text** — eyebrow, h1, description, and CTA buttons are hardcoded in `Hero.tsx` (~line 242). The secondary CTA links directly to WhatsApp.

### Section 2 — Showcase (`src/components/sections/Showcase/`)

A tall "stage" (`STAGE_VH = 320vh`) with one pinned viewport driven by a single GSAP scrub timeline. Three stacked layers:

| Layer | Component | Role |
|---|---|---|
| 1 | `ImageField` | Organic radial-burst image/video tile emitter (own rAF loop) |
| 2 | `HeroText` | Overlay text that exits during the "hinge" phase |
| 3 | `VideoStage` | Full-bleed video carousel with hover zones + mini-preview |

All scroll-phase constants (phase boundaries, `PHASES`, `REVEAL`, `HOVER`, `PARALLAX`, `CAROUSEL`, `FIELD`) live in `src/lib/showcase.ts`. Edit constants there to tune animation timing; no component logic change needed.

**Adding carousel slides:** drop `.mp4`/`.webm` files into the `video/` S3 prefix — listed automatically in alphabetical filename order (`01-name.mp4`, `02-name.mp4`, …).

**Adding image-field tiles:** drop images or short looping clips into `temp_pictures/` — picked up on the next ISR revalidation (≤1 h).

### Media offload (S3 + CloudFront)

All heavy media (hero frames, showcase tiles, carousel clips) lives in a private S3 bucket served through CloudFront:

- `NEXT_PUBLIC_MEDIA_BASE` — CloudFront domain, inlined at build. Unset → falls back to `/public` (local dev, no setup needed).
- `src/lib/media.ts` — `mediaUrl(path)` prepends the base.
- `src/lib/hero.ts` — `frameSrc(i)` generates versioned frame URLs (`/frames/<FRAMES_VERSION>/frame_XXXX.jpg`). **Frame paths are versioned** (`FRAMES_VERSION`) because the files are uploaded `immutable` — replacing frames in-place never reaches cached browsers. Bump the version constant and upload to a new S3 prefix.
- `src/lib/showcase-media.ts` — server-only; does a SigV4-signed `ListObjectsV2` for `temp_pictures/` (tiles) and `video/` (carousel clips). Missing AWS creds → returns empty lists gracefully.
- `src/app/api/media/route.ts` — thin wrapper for the same listing (Node.js runtime, `revalidate=3600`).

### Smooth scroll integration

`SmoothScrollProvider` wraps the app and wires Lenis → GSAP in two steps:
1. `lenis.on("scroll", ScrollTrigger.update)` — keeps ScrollTrigger in sync.
2. `gsap.ticker.add(onTick)` — drives Lenis from the GSAP RAF so both share one clock.

Reduced-motion (`prefers-reduced-motion: reduce`) skips Lenis entirely and collapses the Showcase scrub to a static state.

## Environment variables

| Variable | Side | Purpose |
|---|---|---|
| `NEXT_PUBLIC_MEDIA_BASE` | client (inlined at build) | CloudFront domain, no trailing slash |
| `S3_REGION` | server | Bucket region |
| `S3_BUCKET` | server | Bucket name |
| `S3_ACCESS_KEY_ID` | server | Read-only IAM key (s3:ListBucket only) |
| `S3_SECRET_ACCESS_KEY` | server | Corresponding secret |
| `S3_TILES_PREFIX` | server | Default: `temp_pictures/` |
| `S3_VIDEO_PREFIX` | server | Default: `video/` |

See `DEPLOYMENT.md` for the full AWS + Vercel setup guide.
