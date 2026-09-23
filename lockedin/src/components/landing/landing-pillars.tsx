"use client";

import { CheckSquare, Clock, Flame, Sliders } from "lucide-react";
import { BRAND } from "@/lib/brand";

const PILLARS = [
  {
    icon: Sliders,
    step: "Pillar 01",
    title: "Daily Budgeting",
    description:
      "Decide how many deep work hours you have today. Distribute them across priority goals before opening Slack or email.",
    tag: "Planning",
  },
  {
    icon: CheckSquare,
    step: "Pillar 02",
    title: "Pre-Flight Ritual",
    description:
      "Run a customizable 30-second checklist (close browser tabs, silence notifications, grab water) before every session.",
    tag: "Preparation",
  },
  {
    icon: Clock,
    step: "Pillar 03",
    title: "Shielded Focus Blocks",
    description:
      "Lock into single-task sessions with floating session islands. Pause with designated reasons so interruptions are explicitly recorded.",
    tag: "Execution",
  },
  {
    icon: Flame,
    step: "Pillar 04",
    title: "Focus Health & Score",
    description:
      "Quantify focus consistency, completion rate, and distraction control into an objective daily health score.",
    tag: "Analytics",
  },
];

export function LandingPillars() {
  return (
    <section id="pillars" className="border-y border-border/80 bg-primary/[0.04] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
            System Architecture
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            The 4 Pillars of High-Output Focus
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {BRAND.name} is engineered around cognitive science principles: reduce friction, enforce single-tasking, and measure friction points.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group relative flex flex-col items-center text-center justify-between rounded-2xl border border-border bg-background p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-5" />
                    </span>
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                      {pillar.tag}
                    </span>
                  </div>
                  <p className="mt-4 font-mono text-xs text-primary font-semibold">
                    {pillar.step}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
