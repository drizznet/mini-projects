/**
 * SEO strategy for the public Focus OS experience.
 *
 * Keep these decisions in one place so metadata, robots, and sitemap work can
 * reuse the same public/private route policy as the product evolves.
 */
export const SEO_STRATEGY = {
  primaryAudience:
    "People who want to plan focused work, protect deep-work sessions, and understand where their attention goes.",
  primarySearchIntent:
    "Find a personal focus system for daily planning, deep work, and attention tracking.",
  searchThemes: [
    "personal focus system",
    "focus planner",
    "deep work tracker",
    "attention management",
    "focus session timer",
    "daily focus planning",
  ],
  primaryCallToAction: "Open the app",
  publicRoutes: ["/"] as const,
  privateRoutes: [
    "/dashboard",
    "/plan",
    "/focus",
    "/focus/session",
    "/sessions",
    "/analytics",
    "/settings",
    "/goals",
    "/categories",
    "/focus-items",
    "/login",
  ] as const,
} as const;

/**
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment when the production
 * domain is known. The local fallback keeps metadata valid during development.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3500";
