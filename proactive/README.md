# lockIn

A personal focus and attention management system — not a task manager. Plan a
daily focus budget, run deep-work sessions with a preparation ritual, log every
interruption, and measure focus quality over time.

Standalone Next.js app (sibling of `meeva/` and `hospital-invoices/`). Runs at
[http://localhost:4500](http://localhost:4500).

```bash
cd proactive
pnpm install
pnpm dev
```

Marketing site is `/`. The app starts at `/dashboard`.

## Stack

| Concern    | Choice                                                  |
| ---------- | ------------------------------------------------------- |
| Framework  | Next.js 15 App Router, React 19, TypeScript strict       |
| Styling    | Tailwind CSS v4 (CSS-first), tokens in `src/app/globals.css` |
| Components | shadcn/ui primitives, local to this app                  |
| Charts     | Recharts                                                 |
| State      | React reducer + `FocusRepository` (localStorage default)  |
| Backend    | Supabase-ready (dormant until env vars are set)          |

## Concepts

```
Category → Goal → Focus Item → Focus Session
```

- **Categories** are top-level areas of attention (Learning, Client Work, Main Job).
- **Goals** are destinations measured in hours (Learn C# and .NET → 120h).
- **Focus items** are the concrete work you sit down to do (Dependency injection module).
- **Daily plans** allocate hours across focus items for a given day.
- **Sessions** are timed blocks against one focus item, with pauses, a rating and a reflection.

## The focus score

A day's score is four normalised signals, weighted (see `SCORE_WEIGHTS` in
`src/lib/constants.ts`):

| Component           | Weight | Meaning                                          |
| ------------------- | -----: | ------------------------------------------------ |
| Time adherence      |   0.40 | Focused hours delivered ÷ hours planned (capped)  |
| Session completion  |   0.25 | Sessions finished rather than abandoned           |
| Consistency         |   0.15 | Planned items actually touched                    |
| Distraction control |   0.20 | Inverse of unplanned interruptions per hour       |

The score drives the adaptive colour system in `src/lib/health.ts`: green
(excellent) → blue (on track) → yellow (slipping) → orange (behind) → red
(critical). Widgets read their palette from that mapping rather than hardcoding
colours, so the whole dashboard shifts hue with performance.

**Focus debt** is the running `planned − actual` gap. Positive means you owe
hours; the cumulative chart falls back toward zero as you repay it.

## Architecture

```
src/
  app/                    / landing; (app)/ dashboard, plan, focus, sessions,
                          categories, goals, focus-items, analytics, settings
  components/
    ui/                   shadcn primitives (local to this app)
    brand/                logo lockup
    landing/              marketing page
    charts/               Recharts wrappers + shared axis/tooltip styling
    layout/               sidebar, topbar, active-session bar, shell
    dashboard/ focus/ plan/ sessions/ goals/ items/ categories/
    shared/               PageHeader, StatCard, badges, ProgressRing, EmptyState
  hooks/
    use-focus-data.ts     single entry point for every derived number
    use-now.ts            ticking clock for live timers
  lib/
    brand.ts              product name and tagline
    types.ts              domain model (mirrors the SQL schema)
    seed.ts               deterministic 8-week demo history
    analytics.ts          scores, debt, patterns, streaks, insights
    recommend.ts          "what should I focus on next?" engine
    health.ts             adaptive colour system
    store/                reducer + provider
    supabase/             client, repository, row mappers
supabase/schema.sql       tables, RLS policies, reporting view
```

Two rules worth knowing before editing:

1. **Nothing derived is persisted.** Session elapsed time is computed from
   `startedAt`, `pausedMs` and `pausedAt`, so refreshes and closed laptops cannot
   desynchronise a running timer. Same for every metric on the dashboard.
2. **App pages mount only after hydration.** `AppShell` withholds children until the
   store has loaded, because seed data and all day keys depend on the viewer's
   local calendar — which the server cannot compute.

## Demo data

First load seeds a deterministic eight-week history (seeded PRNG, fixed seed) so
charts, streaks and "best day" insights stay stable while developing. Regenerate
or clear it from **Settings → Data**, which also exports the full state as JSON.

## Enabling Supabase

1. Apply `supabase/schema.sql` (`supabase db push`, or paste into the SQL editor).
2. Copy `.env.example` to `.env.local` and fill in the URL and anon key.
3. Construct the repository with the signed-in user and pass it to the provider:

```tsx
const client = getSupabaseClient();
const repository = client ? createSupabaseRepository(client, user.id) : undefined;

<FocusStoreProvider repository={repository}>{children}</FocusStoreProvider>;
```

Row-level security scopes every table by `user_id`, and a partial unique index
enforces at most one open session per user. The focus score deliberately stays in
TypeScript so its weights live in exactly one reviewable place.
