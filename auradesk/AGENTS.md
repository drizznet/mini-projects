<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AuraDesk — Agent Context

> **Full structure guide:** [`docs/STRUCTURE.md`](docs/STRUCTURE.md)

## What this is

A **reusable Next.js e-commerce template** (currently branded AuraDesk). Use it as a base for future client projects.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · shadcn (Base UI) · Framer Motion · Geist fonts

## Key rules

1. **Pages stay thin** — compose from `components/features/<feature>/`
2. **Shared UI at `components/` root** — navbar, footer, product-card
3. **Feature-specific UI in `components/features/<feature>/`** — one folder per feature
4. **Feature context co-located** — e.g. `features/cart/cart-context.tsx`
5. **Data via repositories** — `lib/data/*.repository.ts`, never import seed in pages
6. **Theming via CSS vars** — edit `app/globals.css`, not components
7. **Config in one place** — `config/site.ts`

## Features

| Folder | Contents |
|--------|----------|
| `features/home/` | hero, trust badges, featured products, shop-everywhere |
| `features/shop/` | filters, product grid |
| `features/cart/` | context, sheet, button |
| `features/wishlist/` | context, sheet, toggle, button |
| `features/theme/` | context, selector |

Run `npm run dev` to develop, `npm run lint` before finishing.
