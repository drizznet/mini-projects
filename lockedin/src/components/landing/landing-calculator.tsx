"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, CheckCircle2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { BRAND } from "@/lib/brand";

export function LandingCalculator() {
  const [targetHours, setTargetHours] = useState<number>(6);

  // Calculate deep work blocks based on target hours
  const deepWorkHours = (targetHours * 0.65).toFixed(1);
  const bufferHours = (targetHours * 0.2).toFixed(1);
  const reviewHours = (targetHours * 0.15).toFixed(1);
  const suggestedSessions = Math.max(1, Math.round(Number(deepWorkHours) * 60 / 50));

  return (
    <section id="calculator" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm">
        <div className="aurora pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Calculator className="size-3.5" />
              Focus Budget Calculator
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Test Your Daily Focus Capacity
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Most professionals overestimate what they can focus on in a day. Drag the slider to see how {BRAND.name} structures realistic attention budgets.
            </p>

            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Target Daily Focus
                </span>
                <span className="font-mono text-xl font-bold text-primary">
                  {targetHours} {targetHours === 1 ? "hour" : "hours"}
                </span>
              </div>
              <Slider
                aria-label="Daily available hours"
                value={[targetHours]}
                min={2}
                max={12}
                step={0.5}
                onValueChange={(val) => setTargetHours(val[0] ?? 6)}
                className="py-2"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                <span>2 hrs (Light)</span>
                <span>6 hrs (Standard)</span>
                <span>12 hrs (Sprint)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-border bg-card-elevated/70 p-5 space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <span className="text-xs font-semibold flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-primary" />
                  Recommended Block Allocation
                </span>
                <span className="text-xs font-mono text-primary font-medium">
                  ~{suggestedSessions} sessions (50 min each)
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-background/80 border border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-primary" />
                    <span className="font-medium">Deep Work (Core Projects)</span>
                  </div>
                  <span className="font-mono font-semibold">{deepWorkHours} hrs</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-background/80 border border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-health-on-track" />
                    <span className="font-medium">Admin & Communication</span>
                  </div>
                  <span className="font-mono font-semibold">{bufferHours} hrs</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-background/80 border border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-health-slipping" />
                    <span className="font-medium">Planning & Reflection</span>
                  </div>
                  <span className="font-mono font-semibold">{reviewHours} hrs</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  Illustrative budget split
                </span>
                <Button size="sm" variant="subtle" className="h-8 text-xs" asChild>
                  <Link href="/plan">
                    Create your plan
                    <ArrowRight className="size-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
