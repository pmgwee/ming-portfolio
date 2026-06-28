# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Internify — an internship management system (CAT304 Group 38). Two user types share one codebase: **students** (browse listings/projects, build a project showcase, get AI recommendations) and **companies** (post and manage internship listings). Deployed at `https://internify-deploy.vercel.app`.

## Commands

```bash
npm ci                  # install (postinstall runs `prisma generate` automatically)
npx prisma generate     # regenerate Prisma client after editing schema.prisma
npm run dev             # dev server on http://localhost:3000
npm run build           # production build
npm run start           # serve production build
npm run lint            # next lint (eslint)
```

No test framework is configured.

## Required environment variables

`.env` and `.env.local` are gitignored and there is no `.env.example`. To run locally you need: `DATABASE_URL` (MongoDB), `NEXTAUTH_SECRET`, `OPENAI_API_KEY`, `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, and UploadThing credentials (`UPLOADTHING_SECRET`, `UPLOADTHING_APP_ID`). Vercel function timeout is configured to 30s in [vercel.json](vercel.json).

## Architecture

### Hybrid routing — NextAuth lives in the Pages Router
This is an App Router project (`app/`), but the NextAuth v4 handler and `authOptions` are defined in the **Pages Router** at [pages/api/auth/[...nextauth].ts](pages/api/auth/[...nextauth].ts). The shared `authOptions` is imported from there into [actions/getCurrentUser.ts](actions/getCurrentUser.ts), which is the single server-side entry point for "who is the current user" across the whole app. Preserve this import path rather than re-declaring `authOptions`.

Session strategy is JWT (not database sessions) with the credentials provider and bcrypt-hashed passwords. The `PrismaAdapter` is wired up but mostly used for account/session bookkeeping.

### Two App Router route groups with different shells
- [app/(dashboard)/](app/(dashboard)/) — the main student experience. [app/(dashboard)/layout.tsx](app/(dashboard)/layout.tsx) renders the fixed `Navbar` + `Sidebar` chrome; nested `(routes)` group holds all pages. Protected pages call `getCurrentUser()` and `redirect("/")` when there is no session — follow this guard pattern on any new page.
- [app/(company)/](app/(company)/) — the company portal, separate layout, no sidebar.

### Data access layer
Prisma singleton in [lib/prismadb.ts](lib/prismadb.ts) (caches on `globalThis` to avoid hot-reload connection storms). Two access patterns:
- **Server actions / async functions in [actions/](actions/)** (`getCurrentUser`, `getListings`, `getProjects`, `getDebounced`, favorites) — called directly from Server Components and pages. These are the read-side data fetchers.
- **Route handlers in [app/api/](app/api/)** — mutations and integrations (register, listing/project CRUD, favorites, recommendation, resume, uploadthing, password reset).

**Note:** `getCurrentUser`, `getListings`, and `getProjects` each contain an intentional `setTimeout(resolve, 500)` artificial delay used for demo loading states. Don't remove it without checking the UI loaders.

### Data model (MongoDB via Prisma)
[prisma/schema.prisma](prisma/schema.prisma) enables the `fullTextSearch` / `fullTextIndex` preview features and uses `@@fulltext([title])` on `Listing` and `Project` for title search. IDs are `@db.ObjectId` with `@map("_id")`. Key entities:
- `User` — `isCompany` distinguishes the two roles; favorites are stored as `favoriteListingIds` / `favoriteProjectIds` ObjectId arrays on the user (not a join table). `active` defaults false until email activation.
- `Listing` (company job posts) and `Project` (student showcase) — both have `isPublished` gating, a `categoryId`, and cascade-delete from their owning `User`.
- `Application` — one-to-one link between a `User` and a `Listing` (both `@unique`).
- `ActivateToken` — email-activation / password-reset tokens.

### Integrations
- **UploadThing** ([app/api/uploadthing/core.ts](app/api/uploadthing/core.ts)) defines `ourFileRouter` with separate endpoints for profile/listing/project images, project showcase (up to 4), and PDF résumés. Generated UI components come from [lib/uploadthing.ts](lib/uploadthing.ts); `OurFileRouter` is the shared type — import it from there, don't re-export.
- **OpenAI** (`gpt-3.5-turbo`, hardcoded) — [app/api/recommendation/route.ts](app/api/recommendation/route.ts) pulls published listings for a category, formats them as text, and asks the model to return one JSON-matched job; the route parses the model's free-text response into JSON (fragile — changes to the prompt or model may break parsing).
- **Mailgun** — sends the account-activation email from [app/api/register/route.ts](app/api/register/route.ts). The activation link **hardcodes the production URL** `https://internify-deploy.vercel.app`; update it if deploying to a different domain.

### Auth lifecycle
Registration → creates an inactive `User` + `ActivateToken` → Mailgun sends an activation link → `/api/register/activate/[token]` flips `user.active = true`. Login refuses inactive users with `"User is not activated yet"`. Forgot-password flow mirrors this via `/api/forgotPw` and `/api/forgotPw/reset/[token]`.

## Conventions

- UI primitives are shadcn/ui components in [components/ui/](components/ui/), configured via [components.json](components.json) (aliases `@/components` and `@/lib/utils`, Tailwind base color `slate`, CSS variables on). Add new ones with the shadcn CLI using these existing aliases.
- Page-local components live in `_components/` folders beside their page (App Router convention — these folders are excluded from routing).
- Forms use `react-hook-form` + `zod` (`@hookform/resolvers`); rich text uses `react-quill`; toasts use `react-hot-toast`.
