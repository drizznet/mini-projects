# Meeva — Agent Context

This folder hosts **drizz.dev** (freelance portfolio) and **Meeva** (software-company headquarters). It remains the reusable base to duplicate for freelance client work: keep the structure; swap brand, theme, and feature folders.

## What this is

- **Root (`/`):** Drizz — freelance software developer, open to work. Copy lives in `src/config/portfolio.ts`. Theme: `src/themes/portfolio.css`.
- **Company (`/meeva`):** Meeva — the public house for Meeva products. Some are new. Some replace existing tools. Do not pitch the company as “alternatives only.”
- **Products do not live in this repo.** List them in `src/config/site.ts` (`products`). Each item can point at an external landing page and/or access URL.
- **Do not invent** live or coming-soon catalog entries until asked.

**Is:** the Drizz portfolio, the Meeva company site, marketplace, and coming-soon list.

**Is not:** the product apps, Ashlove, AuraDesk, or lockIn.

## Pages

| Path | Role |
|------|------|
| `/` | Drizz portfolio |
| `/meeva` | Meeva company hero |
| `/marketplace` | Store of **Live** products |
| `/marketplace/$slug` | Details, then the access / landing link |
| `/soon` | Shareable list of **Coming soon** products |
| `/soon/$slug` | Details, landing link if any, early access or launch notify |

## Stack

Vite 8 · React 19 · TypeScript · TanStack Router · Tailwind v4 · Phosphor icons · GSAP · Framer Motion · Space Grotesk (portfolio) · Manrope + Instrument Serif (Meeva; optional PP Neue Montreal in `public/assets/fonts/`).

Run from `meeva/`: `pnpm dev` (port **4400**). Use Node.js 24+. After meaningful changes: `pnpm run build`. If 4400 is taken, use `--port 4500`.

## Layout

```
src/
├── routes/                 # Thin pages
├── components/             # Chrome
│   └── features/           # portfolio, home (Meeva hero), marketplace, soon
├── config/site.ts          # Meeva brand + products[]
├── config/portfolio.ts     # Drizz copy
└── themes/                 # portfolio.css + hq.css
```

1. Pages stay thin.
2. Portfolio copy lives in `config/portfolio.ts`. Meeva brand and product copy live in `config/site.ts`.
3. Theme via `themes/portfolio.css` (root) and `themes/hq.css` (`/meeva` and catalog). Keep the existing Meeva logo lockup.
4. Early-access form is front-end only until a real list exists.

## Adding a product later

Push an object into `products` with `status: 'Live'` or `'Coming soon'`. Optional `landingUrl` and `accessUrl`. Do not add sibling folders from this workspace unless asked.

## Scope

- Stay inside `meeva/` unless asked otherwise.
- Do not commit `.tanstack/`, `dist/`, or `node_modules/`.
