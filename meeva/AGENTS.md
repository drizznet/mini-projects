# Meeva — Agent Context

Meeva is an **independent software company** and the **reusable base project** in this workspace. Duplicate this folder for later freelance client work. Keep the structure; swap brand, theme, and feature folders.

## What this is

- **Company:** Meeva — software company headquarters.
- **Purpose:** A public house for Meeva products. Some are new. Some replace existing tools. Do not pitch the company as “alternatives only.”
- **Products do not live in this repo.** List them in `src/config/site.ts` (`products`). Each item can point at an external landing page and/or access URL.
- **Do not invent** live or coming-soon catalog entries until asked.

**Is:** the company site, marketplace, and coming-soon list.

**Is not:** the product apps, Ashlove, AuraDesk, or Proactive.

## Pages

| Path | Role |
|------|------|
| `/` | Company hero |
| `/marketplace` | Store of **Live** products |
| `/marketplace/$slug` | Details, then the access / landing link |
| `/soon` | Shareable list of **Coming soon** products |
| `/soon/$slug` | Details, landing link if any, early access or launch notify |

## Stack

Vite 8 · React 19 · TypeScript · TanStack Router · Tailwind v4 · Phosphor icons · GSAP · Framer Motion · Manrope + Instrument Serif (optional PP Neue Montreal in `public/assets/fonts/`).

Run from `meeva/`: `pnpm dev` (port **4400**). Use Node.js 24+. After meaningful changes: `pnpm run build`.

## Layout

```
src/
├── routes/                 # Thin pages
├── components/             # Chrome
│   └── features/           # home, marketplace, soon
├── config/site.ts          # Brand + products[]
├── lib/products.ts
└── themes/hq.css
```

1. Pages stay thin.
2. Brand and product copy live in `config/site.ts`.
3. Theme via `themes/hq.css`. Keep the existing logo lockup.
4. Early-access form is front-end only until a real list exists.

## Adding a product later

Push an object into `products` with `status: 'Live'` or `'Coming soon'`. Optional `landingUrl` and `accessUrl`. Do not add sibling folders from this workspace unless asked.

## Scope

- Stay inside `meeva/` unless asked otherwise.
- Do not commit `.tanstack/`, `dist/`, or `node_modules/`.
