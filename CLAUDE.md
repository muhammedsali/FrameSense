# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- **Development server**: `npm run dev` (runs on http://localhost:3000)
- **Build**: `npm run build`
- **Start production**: `npm start`
- **Lint**: `npm run lint`

## Project Architecture

This is a **Next.js 15** portfolio website built with **TypeScript** and **Tailwind CSS v4**, using the App Router. It's a single-page app — all sections live in `src/app/page.tsx` as stacked section components.

### Key Technologies
- **Framework**: Next.js 15 with App Router, React 19
- **Styling**: Tailwind CSS v4 (PostCSS plugin), Tailwind Merge, clsx
- **Animations**: Framer Motion, GSAP (`@gsap/react`)
- **Particles**: react-tsparticles + tsparticles-slim (star background in root layout)
- **UI**: shadcn/ui structure (Radix UI primitives, `components.json` with "new-york" style)
- **Icons**: Lucide React

### Page Sections (in render order)
`Navigation → HeroSection → SkillsSection → ProjectsSection → BlogSection → ContactSection`

All section components are under `src/components/` and are `"use client"` due to animations.

### Data Layer

**`src/lib/api.ts`** — shared utilities used by client components:
- `fetchGitHubRepos(username)` — calls GitHub API directly with 5-minute ISR revalidation
- `fetchMediumPosts()` — calls the internal `/api/medium` route
- `getTechColor(tech)` — maps language names to Tailwind gradient classes
- `stripHtml(html)` / `truncateText(text, max)` — content helpers

**`src/lib/linkedin.ts`** — LinkedIn fetch helpers:
- `fetchLinkedInUserPosts(urn, page)` — calls internal `/api/linkedin` route
- `getAllLinkedInUserPosts(urn)` — paginates through all posts

### API Routes

| Route | Purpose | External service |
|---|---|---|
| `GET /api/medium` | Parses Medium RSS feed via `rss-parser` | `medium.com/feed/@balabandoganay` |
| `GET /api/linkedin?urn=&page=` | Proxies LinkedIn scraper API | RapidAPI `fresh-linkedin-scraper-api` |

The LinkedIn route requires `RAPIDAPI_KEY` in environment variables.

### Styling System
- Tailwind CSS v4 configured via `postcss.config.mjs` (no `tailwind.config.js` needed for v4)
- `cn()` helper in `src/lib/utils.ts` for conditional class merging
- Path alias: `@/*` → `./src/*`

### Development Notes
- No test suite configured — linting (`next lint`) is the only automated check
- The `data/` directory referenced in older docs no longer exists; data is fetched at runtime
- `next.config.ts` is currently empty (no custom config)
