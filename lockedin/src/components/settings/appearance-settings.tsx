"use client";

import { Palette } from "lucide-react";

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
          <p className="mt-1 text-sm text-muted-foreground">Default shadcn · Light</p>
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
