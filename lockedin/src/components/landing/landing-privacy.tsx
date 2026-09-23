"use client";

import { Database, Download, Lock, ShieldCheck } from "lucide-react";

const PRIVACY_POINTS = [
  {
    icon: Lock,
    title: "100% Local-First",
    description:
      "All your focus sessions, goals, and history live in your browser's local storage by default. No data leaves your machine unless you want it to.",
  },
  {
    icon: Download,
    title: "Full Data Ownership",
    description:
      "Export your complete focus state as clean JSON anytime. No vendor lock-in, no hidden data formats.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Mandatory Signups",
    description:
      "Start planning and running sessions immediately without creating an account or giving an email address.",
  },
  {
    icon: Database,
    title: "Stored in This Browser",
    description:
      "Your workspace stays on this device. Export a backup before clearing browser data; cross-device sync isn't available yet.",
  },
];

export function LandingPrivacy() {
  return (
    <section id="privacy" className="landing-tint border-t border-border py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
            Data Architecture & Sovereignty
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Your Attention Data Belongs to You
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Focus systems shouldn't sell your data or lock your productivity history behind corporate paywalls.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRIVACY_POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="landing-lift flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-xs"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {point.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
