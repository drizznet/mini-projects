# Codebase Structure

This repo is a **Next.js App Router template** with a clear, repeatable layout. Use it as the starting point for new projects — swap seed data, config, and feature folders; keep the patterns.

## Directory map

```
src/
├── app/                          # Routes only — keep pages thin
│   ├── api/                      # Route handlers (BFF / proxy to backend)
│   ├── globals.css               # Design tokens + Tailwind theme
│   ├── layout.tsx                # Root shell: fonts, providers, layout chrome
│   └── (routes)/page.tsx         # Compose feature components; minimal logic
│
├── components/
│   ├── navbar.tsx                # Shared layout chrome
│   ├── footer.tsx
│   ├── product-card.tsx          # Shared across shop + home
│   ├── features/                 # Feature-specific UI (one folder per feature)
│   │   ├── cart/                 # cart-context, cart-sheet, cart-button
│   │   ├── home/                 # hero-section, trust-badges, featured-products, …
│   │   ├── shop/                 # shop-filters, product-grid
│   │   ├── theme/                # theme-context, theme-selector
│   │   └── wishlist/             # wishlist-context, wishlist-sheet, wishlist-toggle
│   └── ui/                       # Design system primitives (shadcn)
│
├── config/                       # App-wide constants (no React)
│   ├── site.ts                   # Brand name, routes, storage keys
│   └── env.ts                    # Environment variables
│
├── lib/
│   ├── api/                      # HTTP client + endpoint paths
│   ├── data/                     # Data access (repositories)
│   │   └── seed/                 # Static/mock data until API exists
│   └── utils.ts                  # cn() and shared helpers
│
├── providers/
│   └── app-providers.tsx         # Single mount point for all providers
│
└── types/                        # Shared TypeScript interfaces
```

---

## Layer responsibilities

| Layer | Purpose | Example |
|-------|---------|---------|
| **`app/`** | Routing, metadata, API routes | `shop/page.tsx` renders shop UI |
| **`components/` (root)** | Shared layout + cross-feature UI | `navbar.tsx`, `product-card.tsx` |
| **`components/features/<name>/`** | Everything specific to one feature | `wishlist/wishlist-sheet.tsx` |
| **`config/`** | Constants you change per project | `siteConfig.name` |
| **`components/features/*/`-context** | Feature client state co-located with UI | `cart/cart-context.tsx` |
| **`lib/data/`** | **Single place components/pages fetch data** | `getProducts()` |
| **`lib/api/`** | HTTP wrapper + endpoint map | `apiClient.get()` |
| **`types/`** | Shared shapes | `Product`, `UploadedAsset` |

**Rule:** Pages and components never import seed files directly. They go through `lib/data/*.repository.ts`.

---

## Theming

Tokens live in **`src/app/globals.css`**.

- `:root` / `[data-theme="light"]` — default warm light
- `[data-theme="dark"]` / `.dark` — dark mode
- `[data-theme="cozy"]` — third preset

To change the look for a new project, edit CSS variables (`--background`, `--primary`, etc.) — not individual components.

**Runtime switching:** `components/features/theme/theme-context.tsx` + `theme-selector.tsx`

- Persists to `localStorage` using `siteConfig.themeStorageKey`
- Sets `data-theme` on `<html>` and toggles `.dark` class

**Provider mount:** `src/providers/app-providers.tsx` → `layout.tsx`

---

## Design system

- **Primitives:** `src/components/ui/` (shadcn on Base UI)
- **Add components:** `npx shadcn@latest add <name>`
- **Class merging:** `cn()` from `src/lib/utils.ts`
- **Variants:** `class-variance-authority` in ui components
- **Icons:** `lucide-react`

Use semantic tokens in Tailwind: `bg-background`, `text-foreground`, `border-border`, `bg-primary`, etc.

---

## Data fetching pattern

Three stages — same interface, swap implementation:

### 1. Static seed (current)

```
types/product.ts          → shape
lib/data/seed/products.ts → mock array
lib/data/products.repository.ts → getProducts() returns seed
```

### 2. Next.js API route (ready)

```
app/api/products/route.ts  → GET handler
lib/data/products.repository.ts → apiClient.get(endpoints.products.list)
```

### 3. External backend

Set `NEXT_PUBLIC_API_URL` in `.env` and point `apiClient` at your server.

### Usage

**Server Component (preferred when possible):**
```tsx
import { getProducts } from '@/lib/data/products.repository'

export default async function Page() {
  const products = await getProducts()
  // ...
}
```

**Client Component (sync fallback):**
```tsx
import { getProductsSync } from '@/lib/data/products.repository'

const products = getProductsSync()
```

---

## API integration pattern

| File | Role |
|------|------|
| `lib/api/endpoints.ts` | All path strings in one place |
| `lib/api/client.ts` | `api()`, `apiClient.get/post`, `ApiError` |
| `config/env.ts` | `NEXT_PUBLIC_API_URL`, etc. |
| `app/api/**/route.ts` | Optional BFF layer before external API |

**Adding a new resource:**

1. Add type in `types/`
2. Add seed in `lib/data/seed/` (optional)
3. Add `*.repository.ts` in `lib/data/`
4. Add endpoint in `endpoints.ts`
5. Add route handler in `app/api/` if needed
6. Build UI in `components/features/<name>/`

---

## Client state (feature contexts)

Each feature that needs global client state keeps its context **inside its feature folder**:

| Feature | Context | Components |
|---------|---------|------------|
| Theme | `features/theme/theme-context.tsx` | `theme-selector.tsx` |
| Cart | `features/cart/cart-context.tsx` | `cart-sheet.tsx`, `cart-button.tsx` |
| Wishlist | `features/wishlist/wishlist-context.tsx` | `wishlist-sheet.tsx`, `wishlist-toggle.tsx` |

Register all providers in `providers/app-providers.tsx`.

---

## Starting a new project from this template

1. **`config/site.ts`** — name, description, routes, storage keys
2. **`app/layout.tsx`** — metadata (reads from `siteConfig`)
3. **`app/globals.css`** — brand colors / radius
4. **`types/` + `lib/data/seed/`** — your domain models
5. **`components/features/`** — replace or extend feature folders
6. **`components/layout/`** — navbar / footer links
7. Wire repositories to real API when backend is ready

---

## Scripts

```bash
npm run dev      # local development
npm run build    # production build
npm run lint     # ESLint
```

---

## Agent / AI notes

- Read **`AGENTS.md`** for project intent and stack.
- Read **`node_modules/next/dist/docs/`** before changing Next.js APIs (v16 breaking changes).
- Do not import from `lib/data/seed/` in pages — use repositories.
