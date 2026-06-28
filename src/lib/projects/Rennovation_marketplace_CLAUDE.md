# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**RenoWise (Fasa Renovate)** — A full-stack marketplace platform connecting homeowners with renovation contractors. Homeowners can browse listings, favorite companies, and chat with service providers. Contractors can manage company profiles, portfolios, and job applications.

## Commands

```bash
npm run dev       # Start dev server (includes Node inspector on port 9229)
npm run build     # Production build (TypeScript/ESLint errors are suppressed)
npm run lint      # Run ESLint
npm run start     # Start production server
```

### Database (Prisma + MongoDB)

```bash
npx prisma generate          # Regenerate Prisma client (auto-runs on postinstall)
npx prisma migrate dev       # Run migrations
npx prisma db push           # Push schema changes to DB without migration
npx prisma db seed           # Seed with fake data (runs prisma/seed.ts via tsx)
```

## Architecture

### Routing (Next.js 14 App Router)

- `app/(dashboard)/` — all authenticated pages share a dashboard layout
  - `(routes)/(auth)/` — login, register, forgot-password
  - `(routes)/(root)/` — home/landing page
  - `(routes)/listing/` — browse renovation listings
  - `(routes)/company/` — company profiles and portfolios
  - `(routes)/profile/` — user profile management
  - `(routes)/recommendation/` — AI-powered service recommendations
  - `app/(chat)/chat/` — real-time messaging
- `app/api/` — REST API routes (Next.js route handlers)
- `pages/api/` — legacy API directory (only used for UploadThing's router)

### Data Layer

- **Database**: MongoDB via Prisma ORM (`lib/prismadb.ts` exports a singleton client)
- **Key models**: `User`, `Listing`, `Application`, `Conversation`/`ChatMessage`, `Review`, `Portfolio`
- **Application lifecycle**: `UNKNOWN → DEPOSIT_PAYMENT → TO_SERVICE → SERVICE_COMPLETED → PAYMENT_DONE → COMPLETED`
- **Full-text search**: Enabled on `Listing.title` and `Portfolio.title`
- **Favorites**: Stored as arrays of ObjectId strings directly on the `User` model

### Authentication

NextAuth v4 with the Prisma adapter. Session provider wraps the app in `providers/auth-provider.tsx`. Email verification uses a token-based `ActivateToken` model.

### Real-time Chat

Pusher handles WebSocket connections. `lib/pusher.ts` exports both server-side and client-side instances. `providers/notification-provider.tsx` subscribes to Pusher channels and drives in-app notifications. `lib/sound-manager.ts` plays notification sounds with a 1-second debounce and localStorage opt-in/opt-out.

### File Uploads

UploadThing handles all file storage. Config in `lib/uploadthing.ts`; the route handler lives in `pages/api/uploadthing.ts`.

### AI Features

OpenAI API powers the recommendation engine (`app/api/recommendation/`). PDF documents are processed with `pdf-parse`/`pdf2json`/`pdfjs-dist` (the latter runs client-side; server components treat it as an external package via `next.config.js`).

### State & UI

- **Zustand** for client-side global state (modals via `hooks/useModal.ts`)
- **Providers**: `modal-provider`, `theme-provider`, `notification-provider`, `toaster-provider` — all composed in `app/layout.tsx`
- **Server actions** in `actions/` for common reads (current user, listings, favorites, ratings)
- **Component library**: shadcn/ui (`components/ui/`) + Radix UI primitives + Framer Motion for animations
- **Theming**: Dark/light mode via class, custom brand colors (`primary: #788DAA`, `teal: #25A5C1`)

### Key Conventions

- Path alias `@/*` resolves to the project root
- `isCompany` boolean on `User` distinguishes contractor accounts from homeowner accounts
- API routes follow the pattern `app/api/<domain>/[id]/route.ts`
- shadcn components go in `components/ui/`; domain-specific components co-locate under their route's `_components/` folder

## Environment Variables

```
DATABASE_URL
NEXTAUTH_SECRET
MAILGUN_DOMAIN / MAILGUN_API_KEY
UPLOADTHING_SECRET / UPLOADTHING_APP_ID
PUSHER_APP_ID / NEXT_PUBLIC_PUSHER_APP_KEY / PUSHER_APP_SECRET / NEXT_PUBLIC_PUSHER_CLUSTER
OPENAI_API_KEY
```
