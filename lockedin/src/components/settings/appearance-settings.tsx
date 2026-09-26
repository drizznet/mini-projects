"use client";

import { Moon, Palette, Sun } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useFocusStore } from "@/lib/store/focus-store";
import { cn } from "@/lib/utils";
import { islandPosition, SESSION_ISLAND_POSITIONS } from "@/lib/session-island";

export function AppearanceSettings() {
  const { state: { settings }, actions } = useFocusStore();

  return (
    <Card id="appearance" className="scroll-mt-20">
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-2"><Palette className="size-4" />Appearance</CardTitle>
          <CardDescription>Workspace display preferences.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium">Theme</h3>
          <p className="mt-1 text-sm text-muted-foreground">Choose the workspace appearance.</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {([
              ["light", "Light", Sun],
              ["dark", "Dark", Moon],
            ] as const).map(([value, label, Icon]) => {
              const selected = settings.theme === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => actions.updateSettings({ theme: value })}
                  aria-pressed={selected}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    selected
                      ? "border-primary/45 bg-primary/12 text-primary"
                      : "border-border text-muted-foreground hover:bg-secondary/60",
                  )}
                >
                  <Icon className="size-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        <Separator />
        <div className="space-y-2.5">
          <div>
            <h3 className="text-sm font-medium">Active session display</h3>
            <p className="mt-1 text-xs text-muted-foreground">Choose where the persistent active-session reminder appears.</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {([
              ["floating", "Floating panel"],
              ["navbar", "Top navigation"],
            ] as const).map(([value, label]) => {
              const selected = (settings.sessionIslandDisplay ?? "floating") === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => actions.updateSettings({ sessionIslandDisplay: value })}
                  aria-pressed={selected}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    selected
                      ? "border-primary/45 bg-primary/12 text-primary"
                      : "border-border text-muted-foreground hover:bg-secondary/60",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        <Separator />
        <div className="space-y-2.5">
          <div>
            <h3 className="text-sm font-medium">Progress display</h3>
            <p className="mt-1 text-xs text-muted-foreground">Choose how progress appears across the workspace.</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {([
              ["ring", "Circular ring"],
              ["bar", "Horizontal bar"],
            ] as const).map(([value, label]) => {
              const selected = (settings.goalProgressDisplay ?? "ring") === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => actions.updateSettings({ goalProgressDisplay: value })}
                  aria-pressed={selected}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    selected
                      ? "border-primary/45 bg-primary/12 text-primary"
                      : "border-border text-muted-foreground hover:bg-secondary/60",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        <Separator />
        <div className="space-y-2.5">
          <div><h3 className="text-sm font-medium">Active session island</h3><p className="mt-1 text-xs text-muted-foreground">Choose a position, or drag the session bar by its handle. Your last position is saved. Corner positions may look similar on narrow screens.</p></div>
          <div className="grid grid-cols-3 gap-2">
            {SESSION_ISLAND_POSITIONS.map(({ value, label }) => {
              const selected = islandPosition(settings.sessionIslandPosition) === value;
              return <button key={value} type="button" onClick={() => actions.updateSettings({ sessionIslandPosition: value })} aria-pressed={selected} className={cn("flex min-h-11 items-center justify-center rounded-xl border px-2 py-2.5 text-center text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", selected ? "border-primary/45 bg-primary/12 text-primary" : "border-border text-muted-foreground hover:bg-secondary/60")}>{label}</button>;
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
