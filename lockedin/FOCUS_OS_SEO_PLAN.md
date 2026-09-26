# Focus OS SEO Plan

> **Project:** lockIn — Personal Focus OS  
> **Scope:** Public landing page and SEO foundation  
> **Status:** Planning

## Goal

Make the Focus OS landing page easy to understand, discover, share, and crawl while keeping the application frontend-only.

## SEO has two parts

### Next.js implementation

- Metadata
- Canonical URLs
- Open Graph and social previews
- Robots rules
- Sitemap
- Icons and web manifest
- Structured data
- Route-level indexing rules

### SEO fundamentals

- Clear search intent
- Useful landing-page content
- Correct heading structure
- Accessible links and controls
- Fast page loading
- Mobile usability
- Crawlable public content
- Accurate page previews

---

## Phase 1 — Define the SEO strategy ✅

- [x] Confirm the product name: **lockIn**
- [x] Define the primary audience
- [x] Define the main search intent
- [x] Choose the primary landing-page action
- [x] Separate public routes from private app routes

### Initial positioning

**Product:** A personal focus and attention management system.

**Search themes:**

- Personal focus system
- Focus planner
- Deep work tracker
- Attention management
- Focus session timer
- Daily focus planning

**Primary call to action:** Open the app.

**Public page:** `/`

**Private or app pages:**

- `/dashboard`
- `/plan`
- `/focus`
- `/focus/session`
- `/sessions`
- `/analytics`
- `/settings`
- `/goals`
- `/categories`
- `/focus-items`
- `/login`

These decisions are encoded in `src/lib/seo.ts` so the metadata, robots, and
sitemap implementation can reuse the same route policy.

---

## Phase 2 — Improve document metadata ✅

### Files

- `src/app/layout.tsx`
- `src/app/page.tsx`

### Tasks

- [x] Add `metadataBase`
- [x] Create a clear title template
- [x] Write a search-focused landing-page title
- [x] Write a concise description of approximately 150–160 characters
- [x] Add a canonical URL
- [x] Add Open Graph title, description, URL, site name, type, and image
- [x] Add Twitter card metadata
- [x] Add author, creator, and publisher information where appropriate
- [x] Add locale information
- [x] Keep theme color and color scheme accurate
- [x] Avoid keyword stuffing

### Current gap

The site URL is configured through `NEXT_PUBLIC_SITE_URL`, with a local fallback
for development. Shareable brand assets are tracked in Phase 3.

---

## Phase 3 — Add shareable brand assets ✅

### Files to consider

- `public/assets/brand/lockin-logo-v1.png`
- `src/app/opengraph-image.tsx`
- `src/app/twitter-image.tsx`
- `src/app/icon.tsx`
- `src/app/apple-icon.tsx`
- `src/app/manifest.ts`

### Tasks

- [x] Create an Open Graph image
- [x] Decide whether Twitter needs a separate image
- [x] Refine the application icon
- [x] Add an Apple touch icon if needed
- [x] Add a web manifest
- [x] Generate a reusable `lockIn` logo asset for SEO and social surfaces
- [x] Use readable text at social preview sizes
- [x] Keep branding consistent with the landing page

### Open Graph image content

- lockIn branding
- “Protect your attention” or the final product headline
- One short product description
- High contrast
- Readable text at small preview sizes

### Implementation notes

The landing page now uses a generated `public/og-image.png` for Open Graph and
Twitter previews, with the same lockIn colors and headline. It also has
generated route fallbacks, an Apple icon, and a web manifest. The route images
use the same `SocialCard` component so the previews stay consistent.

The reusable logo source is `public/assets/brand/lockin-logo-v1.png`. Phase 3
implementation should use this asset, or a rasterized derivative of its mark,
where generated SEO surfaces need the actual brand identity: `SocialCard`, the
application icon, the Apple icon, and any future favicon or manifest icon
variants. Keep the exact product styling as `lockIn` with a lowercase `l` and
capital `I`; do not use `lockedIN` or the previous padlock/keyhole mark.

---

## Phase 4 — Control crawling and indexing

### Files

- `src/app/robots.ts`
- `src/app/sitemap.ts`

### Robots tasks

- [ ] Allow crawlers to access `/`
- [ ] Disallow private application routes
- [ ] Add the sitemap URL
- [ ] Confirm the rules do not block required public assets

### Sitemap tasks

- [ ] Include `/`
- [ ] Add future public marketing pages only when they exist
- [ ] Exclude dashboard and user-specific routes
- [ ] Use the final production URL

---

## Phase 5 — Add structured data

### Recommended schema types

- [ ] `WebSite`
- [ ] `SoftwareApplication`
- [ ] `Organization` if there is a confirmed organization identity
- [ ] `FAQPage` only if the visible FAQ qualifies

### Rules

- [ ] Structured data must match visible page content
- [ ] Do not claim ratings, reviews, pricing, or features that do not exist
- [ ] Keep JSON-LD server-rendered
- [ ] Validate the final JSON-LD output

---

## Phase 6 — Improve landing-page content structure

### Current strengths

- The page has one main `<h1>`
- The page has separate `<h2>` sections
- The page includes a visible FAQ
- The page has clear calls to action

### Tasks

- [ ] Keep exactly one clear `<h1>`
- [ ] Make the hero explain what Focus OS is within one sentence
- [ ] Explain how Focus OS differs from a task manager
- [ ] Use descriptive `<h2>` headings
- [ ] Make feature cards useful as text, not only visual blocks
- [ ] Keep the workflow section concise and concrete
- [ ] Keep FAQ answers visible in the page HTML
- [ ] Use descriptive link text
- [ ] Keep the final call to action clear
- [ ] Ensure essential content is available without client-side JavaScript

---

## Phase 7 — Accessibility and media SEO

- [ ] Add meaningful `alt` text to informative images
- [ ] Mark decorative icons as hidden from screen readers
- [ ] Check keyboard navigation
- [ ] Check visible focus states
- [ ] Verify color contrast
- [ ] Verify button and link names
- [ ] Check heading order
- [ ] Support reduced motion preferences
- [ ] Test the layout on small screens
- [ ] Keep `<html lang="en">` correct

---

## Phase 8 — Performance and Core Web Vitals

- [ ] Keep the landing page mostly server-rendered
- [ ] Avoid unnecessary client components
- [ ] Use `next/image` when real images are introduced
- [ ] Keep font loading efficient
- [ ] Prevent layout shifts
- [ ] Make hero content visible quickly
- [ ] Reduce unnecessary JavaScript on the public page
- [ ] Test mobile performance
- [ ] Check Largest Contentful Paint
- [ ] Check Cumulative Layout Shift
- [ ] Check Interaction to Next Paint

---

## Phase 9 — Private-route SEO policy

### Tasks

- [ ] Set app routes to `noindex, nofollow` where appropriate
- [ ] Add clear titles to app pages
- [ ] Avoid public canonical URLs for user-specific content
- [ ] Prevent dashboard data from appearing in search results
- [ ] Decide whether `/login` should be indexable or noindex

### Recommended policy

Keep the landing page indexable. Keep user-specific application screens out of search results.

---

## Phase 10 — Verification

### Metadata

- [ ] Confirm the page title in the rendered HTML
- [ ] Confirm the description is present
- [ ] Confirm the canonical URL is absolute and correct
- [ ] Confirm Open Graph URLs are absolute
- [ ] Confirm the social image loads

### Crawlability

- [ ] Confirm `/robots.txt` exists
- [ ] Confirm `/sitemap.xml` exists
- [ ] Confirm only public routes appear in the sitemap
- [ ] Confirm private routes are not indexable

### Content and accessibility

- [ ] Confirm the page has one `<h1>`
- [ ] Confirm heading order is logical
- [ ] Confirm links have useful names
- [ ] Confirm images have appropriate alternative text
- [ ] Confirm mobile layout works

### Performance

- [ ] Run Lighthouse SEO checks
- [ ] Run Lighthouse accessibility checks
- [ ] Run Lighthouse performance checks
- [ ] Review Core Web Vitals
- [ ] Test a production build before launch

---

## Implementation order

1. Confirm the production site URL and final SEO copy.
2. Improve root and landing-page metadata.
3. Add canonical and Open Graph metadata.
4. Add `robots.ts` and `sitemap.ts`.
5. Add Open Graph image generation.
6. Add manifest and icon refinements.
7. Add JSON-LD.
8. Add noindex rules for private routes.
9. Refine headings, copy, links, and accessibility.
10. Complete SEO, accessibility, and performance verification.

---

## Definition of done

- [ ] The landing page has complete metadata
- [ ] Social sharing produces a branded preview
- [ ] The site has a valid robots file
- [ ] The site has a valid sitemap
- [ ] Private app routes are excluded from indexing
- [ ] Structured data matches visible content
- [ ] The landing page has clear, useful copy
- [ ] The page is accessible by keyboard and screen reader
- [ ] Mobile performance is acceptable
- [ ] Lighthouse reports no major SEO or accessibility issues

---

## Official Next.js references

- [Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Metadata and Open Graph images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Metadata file conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
- [robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [sitemap.xml](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Web manifest](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest)
- [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist)
