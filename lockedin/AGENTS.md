# lockIn

Personal focus and attention system. Turn meaningful goals into daily time
commitments, run focused sessions, and measure the difference between planned
and actual attention over time.

Standalone Next.js app at `proactive/` (folder name is historical) — not the Nx
`drizznet` workspace.

## Positioning

**Is:** a personal focus OS that connects goals, daily commitments, focused
sessions, breaks, and progress analytics.
Product name is **lockIn** (`lockIn by meeva`).

**Is not:** a task manager, a team product, or part of the company frontpage.

## Product direction

The product vision is to help people consistently invest time in goals that
matter by turning intention into a daily commitment that can be started,
measured, and reviewed.

The primary product loop is:

```
Goal → Daily Commitment → Focus Session → Focus/Break Events → Daily Result → Goal Progress → Analytics
```

The product sits between a goal planner, a focus timer, and a lightweight
execution system. Focused time committed to a goal is the primary unit of
value. The experience should open on today's commitment, make starting or
resuming a session low friction, keep break time honest, and make planned
versus actual time easy to understand.

The current frontend preview still uses categories, focus items, and local
daily plans to support the existing screens. Those are transitional structures
that should map toward daily commitments as the product model evolves.

Marketing is `/`. The app is `/dashboard` and the rest of `(app)/`.

## Persistence

Focus workspace state currently lives in `localStorage` (`lockin:state`). Older
keys (`proactive:state`, `focus-os:state`) are migrated on load. Authentication
and profile data use the sibling `server/` API; focus data remains local until
the goal and daily-commitment persistence model is introduced.

## Brand assets

Drop licensed files in `public/assets/` (see the README there). Until they land,
the chevron mark and Inter stay in use.

## Stack

Next.js 15 App Router, React 19, Tailwind 4, local shadcn primitives, Recharts.
Run: `pnpm dev` (port 4500).
