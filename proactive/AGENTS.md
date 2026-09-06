# lockIn

Personal focus and attention system. Plan a daily focus budget, run deep-work
sessions, log interruptions, and measure focus quality over time.

Standalone Next.js app at `proactive/` (folder name is historical) — not the Nx
`drizznet` workspace.

## Positioning

**Is:** a personal focus OS. Categories → goals → focus items → timed sessions.
Product name is **lockIn** (`lockIn by meeva`).

**Is not:** a task manager, a team product, or part of the company frontpage.

Marketing is `/`. The app is `/dashboard` and the rest of `(app)/`.

## Persistence

No database by default. State lives in `localStorage` (`lockin:state`). Older
keys (`proactive:state`, `focus-os:state`) are migrated on load.
Supabase is optional — only when `NEXT_PUBLIC_SUPABASE_*` is set.

## Brand assets

Drop licensed files in `public/assets/` (see the README there). Until they land,
the chevron mark and Inter stay in use.

## Stack

Next.js 15 App Router, React 19, Tailwind 4, local shadcn primitives, Recharts.
Run: `pnpm dev` (port 4500).
