import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  Check,
  Gauge,
  Shield,
  Sparkles,
  Timer,
} from "lucide-react";

import { BrandLockup } from "@/components/brand/logo";
import { LandingCalculator } from "@/components/landing/landing-calculator";
import { LandingComparison } from "@/components/landing/landing-comparison";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingPillars } from "@/components/landing/landing-pillars";
import { LandingPrivacy } from "@/components/landing/landing-privacy";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingMotion } from "@/components/landing/landing-motion";
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
    <LandingMotion>
    <div className="min-h-svh bg-background text-foreground">

      <main>
        <LandingHero />

        {/* Product Preview Section */}
        <section id="product" className="px-4 py-12 sm:px-6 sm:py-20">
          <div className="workspace-showcase relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-primary/10 px-5 py-10 sm:rounded-[2.5rem] sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full border border-primary/10" aria-hidden="true" />
            <div className="relative mb-10 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
              <div><p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.2em] text-primary"><span className="h-px w-7 bg-primary/40" />Your day, in focus</p><h2 className="mt-5 max-w-lg text-3xl leading-[1.1] font-semibold tracking-[-.04em] sm:text-5xl">A place for your plans.<br /><span className="text-chart-1">Space for your mind.</span></h2></div>
              <div><p className="max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">Bring your priorities into one calm view. See what matters, what you have time for, and where to begin.</p><a href="/dashboard" className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold hover:text-chart-1">Build your day<ArrowRight className="size-4" /></a></div>
            </div>
            <ProductPreview />
            <div className="relative mt-7 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground"><p className="flex items-center gap-2"><Shield className="size-3.5 text-primary" />A little structure. A lot less noise.</p><span className="font-mono text-[10px]">A sample day in lockIn</span></div>
          </div>
        </section>

        {/* Why lockIn Section */}
        <section className="landing-tint border-y border-border/70 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
                Why {BRAND.name}
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Fewer widgets. One screen. The next hour.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                The dashboard is today — planned work on the left, a ranked next
                action on the right. History, charts, and goals stay one click away.
              </p>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature) => (
                <li
                  key={feature.title}
                  className="landing-lift flex flex-col items-center text-center rounded-2xl border border-border bg-background p-6 shadow-xs hover:border-primary/30"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
                    <feature.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Focus OS vs Task Manager Comparison */}
        <LandingComparison />

        {/* 4 Pillars of High-Output Focus */}
        <LandingPillars />

        {/* Interactive Budget Calculator */}
        <LandingCalculator />

        {/* How It Works Section */}
        <section
          id="how"
          className="surface-ink border-y border-border py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
                How it works
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Three moves. Then you sit down.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                Designed to minimize setup friction so you get straight to work.
              </p>
            </div>
            <ol className="mt-12 grid gap-8 md:grid-cols-3">
              {STEPS.map((item) => (
                <li key={item.step} className="landing-lift flex flex-col items-center text-center rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary/15 font-mono text-sm font-bold text-primary">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Data Architecture & Privacy */}
        <LandingPrivacy />

        {/* FAQ Section */}
        <section id="faq" className="border-t border-border bg-muted/20 py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center mb-10">
              <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
                FAQ
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Before you lock in.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                Short answers to common questions about lockIn.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
              <LandingFaq />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="surface-ink relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center sm:px-12">
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
    </LandingMotion>
  );
}

function ProductPreview() {
  return (
    <div className="workspace-preview relative overflow-hidden rounded-2xl border border-primary/10 bg-card sm:rounded-3xl">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">in</span><span className="text-xs font-semibold">Your workspace <span className="mx-2 text-border">/</span><span className="font-normal text-muted-foreground">Today</span></span></div>
        <span className="rounded-full bg-muted px-3 py-1 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">Preview</span>
      </div>
      <div className="px-5 pt-6 sm:px-7 sm:pt-8"><p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Your intention</p><p className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">Make meaningful progress. Leave room to breathe.</p></div>
      <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-5">
        <div className="space-y-5 rounded-2xl border border-border bg-background p-5 sm:p-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold">Today&apos;s planned work</p>
            <span className="text-[11px] text-muted-foreground">3 items</span>
          </div>
          {[
            { name: "Write the architecture note", done: 1.2, plan: 2 },
            { name: "Ship the onboarding flow", done: 0.4, plan: 1.5 },
            { name: "Review last week's debt", done: 0, plan: 0.5 },
          ].map((row) => (
            <div key={row.name} className="space-y-3">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="min-w-0 leading-relaxed">{row.name}</span>
                <span className="shrink-0 tabular-nums text-[10px] text-muted-foreground">
                  {row.done}h / {row.plan}h
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.min(100, (row.done / row.plan) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col rounded-2xl border border-primary/15 bg-muted p-5 sm:p-6 lg:col-span-2">
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <Timer className="size-3.5 text-primary" />
            Next up
          </p>
          <p className="mt-4 text-lg font-semibold tracking-tight">Write the architecture note</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Highest remaining budget · untouched for 18 hours
          </p>
          <div className="mt-5 flex items-center gap-2 text-[10px] text-muted-foreground"><Check className="size-3.5 text-primary" />One clear next step</div>
          <Button size="sm" className="mt-5 h-10 w-full rounded-xl" asChild><Link href="/dashboard">Plan your first session<ArrowRight className="size-3.5" /></Link></Button>
        </div>
      </div>
    </div>
  );
}
