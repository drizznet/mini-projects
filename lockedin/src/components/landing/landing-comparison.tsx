"use client";

import { Check, X } from "lucide-react";
import { BRAND } from "@/lib/brand";

const COMPARISONS = [
  {
    feature: "Core Focus",
    taskManager: "Endless backlog of todo items",
    lockIn: "Daily time budget allocated to top goals",
  },
  {
    feature: "Execution Model",
    taskManager: "Context-switching between dozens of open tabs",
    lockIn: "Single active session with full distraction logging",
  },
  {
    feature: "Priority Sorting",
    taskManager: "Manual ordering or arbitrary deadline urgency",
    lockIn: "Algorithmic recommendation by budget & staleness",
  },
  {
    feature: "Interruption Handling",
    taskManager: "Ignored until deadlines slip",
    lockIn: "Categorised pause log to diagnose focus leaks",
  },
  {
    feature: "Data Privacy",
    taskManager: "Forced account signup & cloud lock-in",
    lockIn: "100% Local-first, private in-browser storage",
  },
];

export function LandingComparison() {
  return (
    <section id="comparison" className="border-y border-border bg-card/40 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
            Why Shift Paradigms
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for Attention, Not Unlimited Backlogs
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Task managers encourage collecting tasks. {BRAND.name} forces intentional allocation so you protect your energy for high-impact deep work.
          </p>
        </div>

      <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-border bg-muted/40 p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:grid">
          <div>Dimension</div>
          <div className="text-muted-foreground/80">Traditional Task Manager</div>
          <div className="text-primary font-bold flex items-center gap-1.5">
            <span>{BRAND.name} Focus OS</span>
          </div>
        </div>

        <div className="divide-y divide-border">
          {COMPARISONS.map((item) => (
            <div
              key={item.feature}
              className="grid grid-cols-1 md:grid-cols-3 p-4 sm:p-5 gap-3 md:gap-4 items-center hover:bg-muted/20 transition-colors"
            >
              <div className="text-sm font-semibold text-foreground">
                {item.feature}
              </div>
              <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                <span className="mt-0.5 rounded-full bg-destructive/10 p-0.5 text-destructive shrink-0">
                  <X className="size-3.5" />
                </span>
                <span>{item.taskManager}</span>
              </div>
              <div className="flex items-start gap-2 text-xs sm:text-sm font-medium text-foreground bg-primary/5 md:bg-transparent p-2.5 md:p-0 rounded-xl">
                <span className="mt-0.5 rounded-full bg-primary/15 p-0.5 text-primary shrink-0">
                  <Check className="size-3.5" />
                </span>
                <span>{item.lockIn}</span>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
