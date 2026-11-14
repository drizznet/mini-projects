# Redesign Drizz Portfolio with Dorbesh Design System & Color Palette

Transform the current Drizz portfolio (`/` route) to adopt the visual layout, aesthetic, color palette, typography hierarchy, and section styling of the **Dorbesh** portfolio template, while retaining Drizz's identity, copy, links, and content.

## User Review Required

> [!NOTE]
> All personal branding (**Drizz**, **DRZ.**, **drizz.dev**), copy from `src/config/portfolio.ts`, and navigation links to Meeva (`/meeva`, `/marketplace`, `/soon`) will be preserved. The visual design system, colors, and layout structures will be updated to match the Dorbesh template.

- **Theme Palette update**:
  - Primary Accent: `#448C74` (Dorbesh Emerald/Sage Green)
  - Surface & Card Backgrounds: `#121212` / `#181818` (Dark mode variant) or crisp `#ECF3F1` / `#FFFFFF` accents
  - Borders: `rgba(119, 119, 125, 0.2)` / `rgba(68, 140, 116, 0.25)`
  - Buttons: `#448C74` pill buttons (`border-radius: 15px`), hover states, and rotating arrow action links (`details-btn`).

## Proposed Changes

### Theme & Global Styles

#### [MODIFY] [portfolio.css](file:///Users/idrisifeoluwa/Desktop/mini-projects/meeva/src/themes/portfolio.css)
- Replace color tokens with Dorbesh color palette (`--primary-color: #448C74`, `--body-background: #0f1412`, surface tones, border variables).
- Define Dorbesh component classes: `.dorbesh-badge`, `.dorbesh-card`, `.details-btn`, `.dorbesh-btn`, `.dorbesh-timeline-node`.

---

### Portfolio Components

#### [MODIFY] [portfolio-nav.tsx](file:///Users/idrisifeoluwa/Desktop/mini-projects/meeva/src/components/features/portfolio/portfolio-nav.tsx)
- Re-style navigation bar matching Dorbesh top bar: logo `DRZ.`, nav links (`About`, `Services`, `Skills`, `Experience`, `Works`, `Process`, `Contact`, `Meeva HQ`), and CTA button ("Hire Me" / "Download CV").

#### [MODIFY] [hero.tsx](file:///Users/idrisifeoluwa/Desktop/mini-projects/meeva/src/components/features/portfolio/hero.tsx)
- Transform Hero section layout:
  - Dorbesh subtitle badge: `"Hello There! 👋"` & `"Available for Freelancing"` green status pill.
  - Large display H1 headline with highlighted green accent words.
  - Quick action buttons ("Hire Me", "Download Resume").

#### [MODIFY] [status-ticker.tsx](file:///Users/idrisifeoluwa/Desktop/mini-projects/meeva/src/components/features/portfolio/status-ticker.tsx)
- Update ticker ribbon to match Dorbesh stats/metrics ribbon styling.

#### [MODIFY] [competencies.tsx](file:///Users/idrisifeoluwa/Desktop/mini-projects/meeva/src/components/features/portfolio/competencies.tsx)
- Re-architect into **Quality Services** section matching Dorbesh service cards (card borders, service titles, descriptions, and rotating arrow detail buttons).

#### [MODIFY] [skill-cards.tsx](file:///Users/idrisifeoluwa/Desktop/mini-projects/meeva/src/components/features/portfolio/skill-cards.tsx)
- Update **Let's Explore My Skills** section: grid of skill items (TypeScript, React, Next.js, Node.js, Postgres) with Dorbesh card styling, level badges, and hover green accent borders.

#### [MODIFY] [experience.tsx](file:///Users/idrisifeoluwa/Desktop/mini-projects/meeva/src/components/features/portfolio/experience.tsx)
- Update **Experience & Education** timeline: vertical card structure with organization badges, dates, and bullet points.

#### [MODIFY] [work.tsx](file:///Users/idrisifeoluwa/Desktop/mini-projects/meeva/src/components/features/portfolio/work.tsx)
- Update **Works & Projects** section: project showcase grid (Meeva HQ, lockIn, Ashlove, AuraDesk) with category badges, description text, and view details action links.

#### [MODIFY] [pipeline.tsx](file:///Users/idrisifeoluwa/Desktop/mini-projects/meeva/src/components/features/portfolio/pipeline.tsx)
- Re-style **Work Process** steps (01 Listen, 02 Shape, 03 Build, 04 Stay) into Dorbesh step cards with green numbered headers.

#### [MODIFY] [contact.tsx](file:///Users/idrisifeoluwa/Desktop/mini-projects/meeva/src/components/features/portfolio/contact.tsx)
- Re-style **Contact CTA** section: "Are You Ready to kickstart your project with a touch of magic?" callout box, email trigger, and quick message form.

#### [MODIFY] [portfolio-page.tsx](file:///Users/idrisifeoluwa/Desktop/mini-projects/meeva/src/components/features/portfolio/portfolio-page.tsx)
- Assemble updated sections into cohesive full-page layout.

## Verification Plan

### Automated Verification
- Run `pnpm run build` from `/Users/idrisifeoluwa/Desktop/mini-projects/meeva` to ensure TypeScript compilation and Vite build pass without errors.
- Run `pnpm run lint` to confirm ESLint formatting.

### Manual Verification
- Verify layout and design on dev server (`http://localhost:4400`).
- Check responsive behavior across desktop and mobile screens.
- Verify smooth section navigation scrolling.
