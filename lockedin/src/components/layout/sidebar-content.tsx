"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame } from "lucide-react";

import { BrandLockup } from "@/components/brand/logo";
import { HealthBadge } from "@/components/shared/badges";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFocusData } from "@/hooks/use-focus-data";
import { healthFromScore } from "@/lib/health";
import { NAV_SECTIONS } from "@/lib/navigation";
import { cn, formatHours } from "@/lib/utils";

/** Shared sidebar body for the fixed desktop rail and mobile sheet. */
export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { today, streaks, summary7 } = useFocusData({ tickMs: 60_000 });
  const health = healthFromScore(today.focusScore);
  const dayProgress =
    today.plannedHours > 0
      ? Math.min(100, (today.actualHours / today.plannedHours) * 100)
      : 0;

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <BrandLockup />
      </div>

      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-6 pb-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="space-y-1">
              <p className="px-2.5 pb-1 text-[10px] font-semibold tracking-widest text-muted-foreground/70 uppercase">
                {section.label}
              </p>
              {section.items.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                    )}
                  >
                    {active ? (
                      <span className="absolute top-1.5 bottom-1.5 -left-1 w-0.5 rounded-full bg-primary" />
                    ) : null}
                    <item.icon className="size-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="space-y-3 border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Today
          </span>
          <HealthBadge score={today.focusScore} showScore={false} />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between text-xs">
            <span className="tabular font-medium">
              {formatHours(today.actualHours)}
            </span>
            <span className="tabular text-muted-foreground">
              of {formatHours(today.plannedHours)}
            </span>
          </div>
          <Progress value={dayProgress} indicatorClassName={health.fill} />
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Flame className="size-3 text-health-behind" />
            {streaks.currentStreak}-day streak
          </span>
          <span className="tabular">
            {formatHours(summary7.actualHours)} / 7d
          </span>
        </div>
      </div>
    </div>
  );
}
