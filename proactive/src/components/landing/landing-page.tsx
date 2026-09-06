import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  Gauge,
  Shield,
  Sparkles,
  Timer,
} from "lucide-react";

import { BrandLockup } from "@/components/brand/logo";
import { LandingFaq } from "@/components/landing/landing-faq";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

const FEATURES = [
  {
    icon: CalendarRange,
    title: "Daily focus budget",
    body: "Allocate hours across the work that actually matters — not a task list, a plan for your attention.",
  },
  {
    icon: Shield,
    title: "Protected sessions",
    body: "One thing at a time. A short ritual, a timer, and an honest log of every interruption.",
  },
  {
    icon: Gauge,
    title: "Focus health",
    body: "A score you can explain: adherence, completion, consistency, and distraction control.",
  },
  {
    icon: Sparkles,
    title: "What to do next",
    body: `When the day gets noisy, ${BRAND.name} ranks remaining work by budget, priority, and staleness.`,
  },
];

const STEPS = [
  {
    step: "01",
    title: "Plan the day",
    body: "Set an intention and split today's hours across a few focus items.",
  },
  {
    step: "02",
    title: "Protect the session",
    body: "Start a timed block. Pause only with a reason. Finish with a rating.",
  },
  {
    step: "03",
    title: "See the truth",
    body: "Watch remaining hours, streak, and health update as you work.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <BrandLockup href="/" showSubtitle={false} />
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground sm:flex">
            <a href="#product" className="transition-colors hover:text-foreground">
              Product
            </a>
            <a href="#how" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </a>
          </nav>
          <Button size="sm" asChild>
            <Link href="/dashboard">
              Open app
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="aurora pointer-events-none absolute inset-0" />
          <div className="surface-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-[11px] font-medium tracking-wide text-primary uppercase">
              Personal focus system
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl sm:leading-[1.05]">
              {BRAND.headline}
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              {BRAND.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Open {BRAND.name}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="subtle" asChild>
                <a href="#how">See how it works</a>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Runs in your browser. No account required to start.
            </p>
          </div>
        </section>

        <section id="product" className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
          <ProductPreview />
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
              Why {BRAND.name}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Fewer widgets. One screen. The next hour.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              The dashboard is today — planned work on the left, a ranked next
              action on the right. History, charts, and goals stay one click away.
            </p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <li
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-primary/12 text-primary">
                  <feature.icon className="size-4" />
                </span>
                <h3 className="mt-4 text-sm font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {feature.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="how"
          className="border-y border-border bg-card/40 py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Three moves. Then you sit down.
            </h2>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {STEPS.map((item) => (
                <li key={item.step} className="relative">
                  <p className="font-mono text-xs text-primary">{item.step}</p>
                  <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
            <div>
              <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
                FAQ
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Before you lock in.
              </h2>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground sm:text-base">
                Short answers. The rest is in the app.
              </p>
            </div>
            <LandingFaq />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center sm:px-12">
            <div className="aurora pointer-events-none absolute inset-0" />
            <div className="relative">
              <h2 className="text-3xl font-semibold tracking-tight">
                Start today&apos;s plan.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                Open the app, set a budget, and protect the first session. The
                rest of {BRAND.name} follows from that.
              </p>
              <Button size="lg" className="mt-8" asChild>
                <Link href="/dashboard">
                  Enter {BRAND.name}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
          <BrandLockup href="/" showSubtitle={false} />
          <p className="text-xs text-muted-foreground">{BRAND.tagline}</p>
        </div>
      </footer>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-health-critical/80" />
        <span className="size-2.5 rounded-full bg-health-slipping/80" />
        <span className="size-2.5 rounded-full bg-health-excellent/80" />
        <span className="ml-3 text-[11px] text-muted-foreground">
          {BRAND.name} · Today
        </span>
      </div>
      <div className="grid gap-4 p-4 lg:grid-cols-5">
        <div className="space-y-3 rounded-xl border border-border/80 bg-card-elevated/50 p-4 lg:col-span-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold">Today&apos;s planned work</p>
            <span className="text-[11px] text-muted-foreground">3 items</span>
          </div>
          {[
            { name: "Write the architecture note", done: 1.2, plan: 2 },
            { name: "Ship the onboarding flow", done: 0.4, plan: 1.5 },
            { name: "Review last week's debt", done: 0, plan: 0.5 },
          ].map((row) => (
            <div key={row.name} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="truncate">{row.name}</span>
                <span className="tabular text-muted-foreground">
                  {row.done}h / {row.plan}h
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.min(100, (row.done / row.plan) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-primary/25 bg-primary/6 p-4 lg:col-span-2">
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <Timer className="size-3.5 text-primary" />
            Next up
          </p>
          <p className="mt-3 text-sm font-semibold">Write the architecture note</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Highest remaining budget · untouched for 18 hours
          </p>
          <div className="mt-4 inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground">
            Focus for 50 min
          </div>
        </div>
      </div>
    </div>
  );
}
