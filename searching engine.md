# SEO / AEO / GEO foundation for mingcreatives.com

## Context

The portfolio (Next.js 16 App Router, single route) currently has **almost no SEO infrastructure**: only a `title` + `description` in [layout.tsx](src/app/layout.tsx). In Google it ranks #1 for the brand "ming creatives" but (1) shows a generic globe instead of a favicon, (2) its snippet is auto-generated from page content rather than a controlled description, and (3) it has no presence in AI Overview as a defined entity. Root causes found during exploration:

- **Favicon:** [src/app/favicon.ico](src/app/favicon.ico) is **32×32** — below Google's 48px minimum, so Google rejects it.
- **No `metadataBase`, Open Graph/Twitter cards, canonical, robots directives, or `keywords`.**
- **No `sitemap.ts`, `robots.ts`, JSON-LD structured data, OG image, or `manifest`.** These are the core SEO/AEO/GEO levers and are all absent.

**Goal:** Build the complete on-site foundation so the site is fully crawlable, controls its own snippet/preview, and defines a clear "Ming Creatives" entity (Person + WebSite + sameAs) that Google's Knowledge Graph and AI Overviews can attach to.

**Decisions (from user):** Full foundation · user provides a square logo file · canonical = `https://www.mingcreatives.com`.

**Realistic expectations (not code — set with user):** Brand terms ("ming creatives", "ming 3d/website/portfolio") are achievable; generic "ming" is not realistically winnable via code (competes with MING watches, MING Labs, etc.). AI Overview *inclusion* as an entity is achievable via structured data + cross-web consistency; ranking #1 in AI Overview for generic "ming" is not. ~30% of results depend on off-site work (Search Console, recrawl, backlinks) the user must do — see checklist.

## Inputs needed from user (filled into `src/lib/seo.ts`; build works with placeholders/empty defaults)

- **Logo:** square PNG/SVG, ≥512px → becomes `src/app/icon.png` (+ `apple-icon.png` 180×180, + ≥48px `favicon.ico`).
- **Full name** for `Person` schema (or keep "Ming").
- **Social profile URLs** for `sameAs`: LinkedIn, GitHub, Instagram, X/Twitter, Dribbble/Awwwards, etc.
- **Location** (optional, e.g. Malaysia) and **X/Twitter handle** (optional).
- **Google Search Console verification token** (optional — can be added later).

## Implementation

### 1. Central SEO config — `src/lib/seo.ts` (new, single source of truth)
Export a `SITE` constant: `url`, `name` ("Ming Creatives"), `title` ("Ming Creatives — Creative Developer & 3D Web Portfolio"), keyword-rich `description` (~150–160 chars, brand-leading), `author`/`jobTitle`, `locale`, `keywords[]`, `sameAs[]`, optional `location`, `twitterHandle`, `gscVerification`. All user-supplied fields default to safe empty values so the build never breaks.

### 2. Enrich metadata — [src/app/layout.tsx](src/app/layout.tsx)
Expand the `metadata` export using `SITE`: `metadataBase: new URL(SITE.url)`, `title` (default + `template`), `description`, `keywords`, `authors`/`creator`, `alternates.canonical: "/"`, full `openGraph` (type/url/siteName/title/description/locale/images→`/opengraph-image`), `twitter` (summary_large_image), `robots` (index/follow + `googleBot` max-image-preview:large, max-snippet:-1), and `verification.google` (placeholder). Icons are auto-wired by file conventions (step 6).

### 3. JSON-LD structured data — `src/components/seo/JsonLd.tsx` (new), rendered in layout
A `<script type="application/ld+json">` with an `@graph`: **Person** (name, jobTitle, url, image, sameAs, optional address), **WebSite** (name, url, publisher→Person), and **ProfessionalService/Organization** for the "Ming Creatives" brand. This is the primary AEO/GEO lever — it defines the entity for Knowledge Graph + AI Overview. Built from `SITE` so it stays in sync.

### 4. `src/app/sitemap.ts` (new)
Next.js `MetadataRoute.Sitemap` convention → single entry for `SITE.url` (changeFrequency monthly, priority 1). Served at `/sitemap.xml`.

### 5. `src/app/robots.ts` (new)
Next.js `MetadataRoute.Robots` convention → allow all, reference `${SITE.url}/sitemap.xml`, set `host`. Served at `/robots.txt`.

### 6. Favicon + icons (user logo)
Place the logo as `src/app/icon.png` (≥512px square) and `src/app/apple-icon.png` (180×180); replace `src/app/favicon.ico` with a ≥48×48 version. Next auto-emits the `<link rel="icon">` tags. (If logo not yet supplied, stub and revisit — this is the fix for the missing-favicon problem, gated on Google recrawl.)

### 7. OG social image — `src/app/opengraph-image.tsx` (new)
Generate a 1200×630 branded card via `ImageResponse` from `next/og`: indigo→violet (`#6366f1`→`#8b5cf6`) gradient on `#07080c`, "Ming Creatives" + tagline. Keep fonts simple (default sans, or load Geist Mono from the `geist` package with fallback) to avoid build fragility. Drives the OG/Twitter `images`.

### 8. `src/app/manifest.ts` (new)
`MetadataRoute.Manifest`: name/short_name, `theme_color: "#07080c"`, background, `display: "standalone"`, icons referencing the icon files.

### 9. Optional on-page copy alignment — [src/components/sections/Hero.tsx](src/components/sections/Hero.tsx)
The current Google snippet ("…awwwards standard using Gen Ai. , 3D and engineering meet.") reads awkwardly because Google synthesizes it from the Hero `<h1>`/paragraph. Optionally tighten that paragraph so it leads with the brand + key terms and matches the new meta description — improves snippet quality (Q2). Visible-copy change, so confirm wording before applying.

## Off-site checklist (user actions — required for results, not code)

1. **Google Search Console:** verify `www.mingcreatives.com`, submit `sitemap.xml`, and use **URL Inspection → Request Indexing** to force a recrawl (speeds up favicon + description/snippet update; favicons can still take days–weeks).
2. **Bing Webmaster Tools:** same (Bing feeds some AI answers/Copilot).
3. **sameAs consistency:** every social profile (LinkedIn/GitHub/Instagram/etc.) links back to the site and uses the exact name "Ming Creatives".
4. **Backlinks:** list the site on Awwwards/Dribbble/Devpost/LinkedIn featured, etc. — the main lever for the harder keywords.

## Verification

- `npx tsc --noEmit` and `npm run build` pass (only static checks in repo).
- `npm run start`, then check: `/robots.txt`, `/sitemap.xml`, `/opengraph-image` (renders 1200×630), `/icon.png` and `/apple-icon.png` resolve; view-source shows OG/Twitter/canonical tags + the JSON-LD `<script>`.
- Validate JSON-LD in **Google Rich Results Test** / Schema.org validator; preview OG card in a social debugger.
- Post-deploy: confirm favicon/snippet update in Google after recrawl (lagging, days–weeks).
