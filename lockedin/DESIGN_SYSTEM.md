# lockIn design system

> **Paused:** The app now uses only the default shadcn Neutral light theme.
> Custom themes and switching have been removed. The material below is retained
> as a historical reference for the later UI/design-system update, not current
> implementation guidance. Current tokens are in `src/app/globals.css`.

**Ink · Teal · Soft gray**  
Version 1.1 — September 2026

lockIn is a personal focus system. Its interface should feel calm, clear, and
precise. Give the work room to breathe, make the next action obvious, and keep
decoration away from reading and planning surfaces.

## Where to start

- **Visual guide:** `/design-system` in the app. Includes actual color tokens,
  type specimens, component examples, and an ink surface preview.
- **Source of truth:** `src/app/globals.css`. Change colors here first.
- **Shared components:** `src/components/ui/` and `src/components/shared/`.
- **Brand name and copy:** `src/lib/brand.ts`.
- **Focus health:** `src/lib/health.ts`. Keep its score bands and labels intact.

Use semantic classes such as `bg-card`, `text-foreground`, and `bg-primary`.
They adapt to the active theme. Do not introduce one-off teal hex values into
components. Fixed-color exports, such as the favicon and SVG illustration,
must be updated separately when the palette changes.

## 1. Color

### Workspace themes

Choose a theme in **Settings → Appearance**, or from the palette menu in the
app's top bar. Choices apply immediately and persist through the existing
localStorage settings. Teal is the default for new workspaces. Existing Light,
Dark, and System preferences remain valid; changing theme does not reset data.

| Theme | Canvas | Card | Primary / action text | Character |
| --- | --- | --- | --- | --- |
| Light | `#F8FAFC` | `#FFFFFF` | `#334155` / white | Neutral light workspace |
| Dark | `#0F172A` | `#1E293B` | `#E2E8F0` / ink | Neutral dark workspace |
| Teal | `#F8FAFC` | `#FFFFFF` | `#0F766E` / white | Original teal and mint palette |
| Dark Purple | `#171122` | `#231A33` | `#C4B5FD` / `#221336` | Violet canvas, lavender actions |
| System | Follows device | Follows device | Neutral Light or Dark | Updates when device preference changes |

`Settings.theme` stores `light`, `dark`, `teal`, `dark-purple`, or `system`.
`src/lib/themes.ts` defines the shared names and descriptions. `ThemeSync`
sets `html[data-theme]` and adds `.dark` for Dark, Dark Purple, or a dark System
preference. Portaled menus and dialogs inherit the palette from the document.

Dark Purple uses `#302440` elevated panels, `#C9BFD9` supporting text,
`#514064` borders, and `#3C2855` selected surfaces. It preserves semantic health
colors. Neutral modes use gray accents; neither is an alias for Teal.

Theme preview classes share the actual token declarations so previews remain
accurate when the active workspace palette changes. Fixed brand assets such as
the favicon and exported hero SVG keep their teal identity.

### Core palette

The tables below describe the **Teal base palette and its local ink surfaces**.
Named workspace themes override these semantic tokens as listed above.

| Color | Value | Role |
| --- | --- | --- |
| Soft gray | `#F8FAFC` | Main light canvas |
| White | `#FFFFFF` | Light cards and popovers |
| Ink | `#0F172A` | Main text, dark canvas, hero illustration |
| Slate | `#1E293B` | Dark cards and illustration panels |
| Teal | `#0F766E` | Primary actions and links on light surfaces |
| Pale mint | `#ECFDF5` | Alternate light sections |
| Aqua | `#5EEAD4` | Primary actions and graphics on ink surfaces |

Keep most of a screen neutral. Teal marks actions, selection, and progress.
Use mint to group sections, and ink for a few deliberate moments: the hero
visual, a process section, or the final call to action. Avoid saturating every card.

### Semantic tokens

| Token / Tailwind suffix | Light | Dark / ink surface | Use |
| --- | --- | --- | --- |
| `background` | `#F8FAFC` | `#0F172A` | Page canvas |
| `foreground` | `#0F172A` | `#F8FAFC` | Headings and body text |
| `card` | `#FFFFFF` | `#1E293B` | Contained content |
| `card-elevated` | `#F1F5F9` | `#253449` | Nested panels |
| `primary` | `#0F766E` | `#5EEAD4` | Main action, links, selection |
| `primary-foreground` | `#FFFFFF` | `#0F172A` | Text on the primary fill |
| `secondary` | `#E2E8F0` | `#334155` | Secondary controls |
| `muted-foreground` | `#475569` | `#CBD5E1` | Supporting text |
| `accent` | `#CCFBF1` | `#134E4A` | Selected or highlighted surfaces |
| `accent-foreground` | `#115E59` | `#99F6E4` | Text on accent surfaces |
| `surface-tint` | `#ECFDF5` | `#122E32` | Alternate sections |
| `border` | `#DBE3EC` | `#3B4B61` | Decorative separators |
| `input` | `#64748B` | `#94A3B8` | Visible control boundaries |
| `ring` | `#0F766E` | `#5EEAD4` | Keyboard focus |
| `destructive` | `#B91C1C` | `#FCA5A5` | Destructive actions and errors |
| `destructive-foreground` | `#FFFFFF` | `#0F172A` | Text on destructive fills |

`.dark` enables dark component styles. `.surface-ink` applies a dark token
set to a single section, even on a light page. It follows the selected palette:
ink/teal for Teal, neutral slate for Light/Dark/System, and violet for Dark Purple.
Use `text-primary-foreground` on filled actions; white text is unsuitable on aqua.

### Status and charts

Brand teal identifies actions. Status colors communicate a result and always
need a text label or icon as well.

| Health token | Meaning | Light | Dark |
| --- | --- | --- | --- |
| `health-excellent` | Excellent | `#15803D` | `#86EFAC` |
| `health-on-track` | On track | `#1D4ED8` | `#93C5FD` |
| `health-slipping` | Slightly behind | `#854D0E` | `#FDE047` |
| `health-behind` | Falling behind | `#C2410C` | `#FDBA74` |
| `health-critical` | Significantly behind | `#B91C1C` | `#FCA5A5` |

Use `HEALTH_STYLES` for health badges and `CHART_COLOR_VARS` for chart series.
The six chart hues are teal, blue, green, ochre, indigo, and orange. Include
labels, legends, or tooltips; do not rely on hue alone. Red is reserved for
errors, destructive actions, and critical health—not ordinary brand decoration.

## 2. Typography

**Inter** is the interface font. **JetBrains Mono** is for timers, measured
values, short technical labels, and code. Keep paragraphs in Inter.

| Role | Size | Weight / line height | Typical classes |
| --- | --- | --- | --- |
| Marketing hero | 36 → 60 px | 600 / 1.05–1.15 | `text-4xl sm:text-6xl font-semibold tracking-tight` |
| Section heading | 30 → 36 px | 600 / 1.2 | `text-3xl sm:text-4xl font-semibold` |
| App page title | 24 → 30 px | 600 / 1.25 | `text-2xl sm:text-3xl font-semibold` |
| Card title | 16–18 px | 600 / 1.4 | `text-base font-semibold` |
| Body | 14–16 px | 400 / 1.6 | `text-sm sm:text-base leading-relaxed` |
| Supporting label | 12–14 px | 400–500 / 1.5 | `text-xs text-muted-foreground` |
| Eyebrow | 11–12 px | 600 / 1.5 | `text-xs uppercase tracking-widest` |
| Timer | 36–48 px | 400–500 / 1.1 | `font-mono text-4xl tabular-nums` |

Prefer sentence case. Reserve uppercase for short eyebrows and tiny technical
labels. Keep long text left aligned and around 60–70 characters wide. Center
landing-page headings, introductions, and short feature cards. Essential
instructions should not use the tiny decorative labels found in hero artwork.

## 3. Space and layout

Use a 4 px spacing base. Common steps: **4, 8, 12, 16, 24, 32, 48, 64, 80, 96 px**.

| Relationship | Default |
| --- | --- |
| Icon to label | 8 px (`gap-2`) |
| Heading to description | 8–12 px |
| Related controls | 12–16 px |
| Card padding | 24 px; 16 px in compact app panels |
| Card grid gap | 24 px (`gap-6`) |
| Section padding | 64–80 px vertically; hero up to 96 px |
| Page gutters | 16 px mobile, 24 px from `sm` |
| Marketing container | 1152 px (`max-w-6xl`) |
| Centered section introduction | 672 px (`max-w-2xl`) |

Start with a single mobile column. Expand feature grids at `sm` (640 px) and
`lg` (1024 px), and process steps at `md` (768 px). Let controls wrap without
truncating their labels. Tables may scroll horizontally inside their own container.

## 4. Shape, borders, and elevation

The base radius is **10 px** (`--radius`). Derived radii are 6 px (`sm`),
8 px (`md`), 10 px (`lg`), 14 px (`xl`), 18 px (`2xl`), and 26 px (`3xl`).

- Inputs and small controls: `rounded-lg` or `rounded-md`.
- Cards: `rounded-2xl`, a 1 px border, and at most `shadow-xs`.
- Feature panels: `rounded-3xl`; the hero frame may use 32 px.
- Pills: `rounded-full`, used for short statuses or segmented choices.
- Reserve larger shadows for floating panels and the hero illustration.

Decorative borders can be quiet. Input boundaries and focus indicators must
remain distinct. A shadow must not be the only indication that a control exists.

## 5. Components and states

### Buttons

Use the shared `Button`. Give each action group one clear primary action.

| Variant | Purpose |
| --- | --- |
| `default` | Main action: Start session, Save plan |
| `secondary` / `subtle` | Supporting action |
| `outline` | Alternate path with visible boundary |
| `ghost` | Low-emphasis toolbar action |
| `destructive` | Delete or discard; explain consequences |
| `link` | Inline navigation |

Existing sizes are 32 px (`sm`), 36 px (default), and 44 px (`lg`). Prefer
44 px actions on mobile and give smaller controls adequate spacing. Preserve
hover, visible keyboard focus, pressed, and disabled states. When an async
action is pending, use a clear progress label and prevent duplicate submission.
Icons supplement a verb; icon-only buttons require an accessible name.

### Forms

Every input needs a visible label. Put units in the label or adjacent text.
Do not use placeholder text as a label. Keep help text close to the field.
Connect error text with `aria-describedby` and use `aria-invalid`.
Use `text-health-critical` for error text, so it adapts to dark surfaces.

### Cards and navigation

Cards group a single purpose: a plan, a session, a metric, or an explanation.
Keep the action close to its content. Selected navigation uses an accent fill
and an explicit active state such as `aria-current="page"`. Hover does not
replace the selected state. Plain informational cards are not keyboard controls.

### Empty, loading, and error states

An empty state says what belongs here and offers one relevant action. Loading
preserves the eventual layout. Errors explain what happened and how to recover.
Never imply that a preview or unsaved demo has changed the user's real plan.

## 6. Motion and illustration

| Motion | Duration | Purpose |
| --- | --- | --- |
| Quick feedback | 150 ms (`--motion-fast`) | Small state changes |
| UI transitions | 250 ms (`--motion-ui`) | Hover, elevation, selection |
| Scroll reveal | 650 ms (`--motion-reveal`) | A section entering view once |
| Decorative float | 7 seconds | Gentle movement in hero artwork |
| Timer orbit | 16 seconds | Runs only while the demo is running |

Use `--ease-out` for movement. Animate opacity and transforms where possible.
Never delay access to content behind an animation. Honor
`prefers-reduced-motion`; the landing page disables decoration and skips
scroll reveals. Keep app work surfaces still during focused work.

The illustration language uses thin aqua orbits, subtle grids, circuit paths,
and translucent slate panels. Keep glows behind artwork, not body text.
Use authentic product previews and label illustrative data clearly.

## 7. Readability and accessibility

Target at least 4.5:1 contrast for ordinary text, 3:1 for large text, and 3:1
for essential control boundaries and indicators. These are targets for each
actual pairing, not a claim that every existing screen has been audited.

- Use foreground/muted-foreground tokens rather than lowering text opacity.
- Use teal with white in light mode; aqua with ink in dark mode.
- Never put white text on pale mint or bright aqua.
- Keep semantic heading order, visible labels, keyboard access, and focus rings.
- Respect reduced motion and test zoom, small screens, and long labels.
- Label meaningful images; hide purely decorative icons from assistive tools.

## 8. Maintaining the system

1. Change the semantic token in `globals.css`.
2. Check light, dark, and local ink surfaces, including nested cards.
3. Update fixed assets in `public/assets/product/` and `src/app/icon.tsx` if needed.
4. Update this guide and `/design-system` if a rule or palette value changes.
5. Verify responsive layout, focus states, and contrast before release.

The visual guide is a reference, not a complete component test suite. This
theme update was reviewed statically; no build or browser verification was run.
