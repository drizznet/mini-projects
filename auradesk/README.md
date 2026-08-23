# AuraDesk — Next.js Template

Aesthetic e-commerce starter built with Next.js 16, shadcn, and a layered architecture designed to be cloned for future projects.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Documentation

| Doc | Contents |
|-----|----------|
| [**docs/STRUCTURE.md**](docs/STRUCTURE.md) | Full folder layout, patterns for theming, design system, data fetching, and API integration |
| [**AGENTS.md**](AGENTS.md) | Short context for AI agents working in this repo |

## Structure (summary)

```
src/
├── app/              Routes + API handlers
├── components/
│   ├── layout/       Navbar, footer
│   ├── features/     Domain UI (cart, home, theme, …)
│   └── ui/           shadcn primitives
├── config/           site.ts, env.ts
├── context/          Client global state
├── lib/
│   ├── api/          HTTP client + endpoints
│   └── data/         Repositories + seed data
├── providers/        AppProviders wrapper
└── types/            Shared TypeScript types
```

## New project checklist

1. Update `src/config/site.ts` (name, routes, keys)
2. Retheme `src/app/globals.css`
3. Replace seed data in `src/lib/data/seed/`
4. Build features in `src/components/features/`
5. Wire repositories to your API when ready

## Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run lint     # ESLint
```
