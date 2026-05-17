# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Provn is a real estate agent scoring and matching platform. Consumers find the best agent based on verified data. Agents earn placement through performance, not ad spend.

## Commands

- `npm run dev` — start dev server on port 3000
- `npm run build` — production build
- `npm run db:push` — push Prisma schema to database

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: Clerk
- **Hosting**: Vercel
- **Maps**: Mapbox or Google Maps API
- **Styling**: Tailwind CSS
- **Language**: TypeScript (strict — no `any` types)

## Architecture

This is a Next.js App Router project. Key architectural boundaries:

- **Agent profiles** — read-only scored data; agents cannot edit scored fields
- **Scoring engine** — all scored data must carry a verified source label; scoring is computed server-side, not user-submitted
- **Consumer-facing search** — filter and comparison interfaces built for consumers, not agents
- **Review aggregation** — reviews pulled from verified external sources, not agent-submitted
- **Referral tracking** — agreement flow with audit trail

## Build Order (feature priority)

1. Agent profile pages with scoring display
2. Consumer search and filter interface
3. Agent comparison mode (side by side)
4. Scoring algorithm engine
5. Review aggregation layer
6. Referral tracking and agreement flow

## Conventions

- Mobile-first design on all UI
- No agent-editable fields on scored data
- All scored data must display a verified source label
- Keep components small and focused
