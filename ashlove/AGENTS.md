# Ashlove Care — Contributor Guide

## Project overview

Ashlove Care is a single-page nursing consultation website. It is designed to feel warm, reassuring, and personal while making it easy for prospective clients to request a consultation.

The active application lives in `src/`:

- `src/routes/index.tsx` — the complete Ashlove landing page and its UI interactions.
- `src/routes/__root.tsx` — the minimal TanStack Router root layout.
- `src/main.tsx` — application bootstrap and router setup.
- `src/index.css` — global font, Tailwind, and base styles.
- `src/themes/health-love.css` — the base Health / Love Design System behavior and default token file.
- `src/themes/green-blue.css`, `lavender-mist.css`, and `sunlit-clay.css` — alternate token files. `src/index.css` imports the active theme.

Do not reintroduce the previous task-tracker, projects, dashboard, timer, or shadcn component implementation.

## Commands

Use Node.js 24 or later.

```bash
npm run dev -- --host 0.0.0.0
pnpm run build
```

The production build runs TypeScript checking before Vite bundling. Run it after meaningful changes.

## Design direction

- Preserve the Ashlove visual language: deep forest green (`#173c36`), soft cream, sage, coral, and peach accents.
- Change the theme by swapping the one theme import in `src/index.css`. Do not add a runtime theme toggle unless specifically requested.
- Keep the tone calm, compassionate, clear, and human. Avoid clinical jargon or overly sales-focused language.
- The logo treatment is lowercase `ashlove`, with coral used for `love`.
- Prefer rounded, generous layouts and strong typographic hierarchy. The current serif display style is intentional.
- Maintain responsive behavior. Check both narrow mobile and desktop layouts when changing sections or navigation.
- The floating navigation pill should appear only after the main header scrolls out of view.

## Implementation notes

- Use the existing Tailwind utility style; avoid adding a component library for simple UI changes.
- Keep all primary navigation as smooth in-page scrolling.
- The booking form is currently a front-end interaction only. Do not imply that it sends appointments or medical information until a real, secure backend integration exists.
- Use supplied or properly licensed images. Preserve meaningful `alt` text.

## Healthcare content guardrails

- Do not add diagnoses, treatment claims, emergency advice, or guarantees of outcomes.
- Keep consultation language general and avoid presenting the site as a substitute for urgent or emergency care.
- If adding a live booking or contact workflow, use the client’s verified contact details and a privacy-conscious provider.

## Scope and hygiene

- Do not commit generated caches such as `.tanstack/`, build output, or `node_modules/`.
- Keep dependencies minimal. Remove unused packages when replacing a feature.
- Make focused changes and avoid modifying files outside the Ashlove app unless specifically requested.
