"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Settings, Sparkles } from "lucide-react";

import { BrandLockup, BrandMark } from "@/components/brand/logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useFocusData } from "@/hooks/use-focus-data";
import { clearLocalAuthSession } from "@/lib/auth";
import { NAV_SECTIONS } from "@/lib/navigation";
import { dailySessionsForDate } from "@/lib/selectors";
import { cn } from "@/lib/utils";

/** Shared sidebar body for the fixed desktop rail and mobile sheet. */
export function SidebarContent({
  onNavigate,
  mobile = false,
}: {
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const { state } = useSidebar();
  const collapsed = !mobile && state === "collapsed";
  const pathname = usePathname();
  const router = useRouter();
  const { state: focusState, todayKey, recommendations } = useFocusData({ tickMs: 60_000 });
  const todayCount = dailySessionsForDate(focusState, todayKey).length;
  const recommendation = recommendations[0];

  return (
    <div className="flex h-full flex-col">
      <div className={`flex items-center border-b border-sidebar-border py-4 ${collapsed ? "justify-center px-2" : "justify-between px-4"}`}>
        {collapsed ? <BrandMark className="size-8" /> : <BrandLockup />}
        {!mobile ? (
          <SidebarTrigger />
        ) : null}
      </div>

      <ScrollArea className={`min-w-0 flex-1 overflow-x-hidden ${collapsed ? "px-2" : "px-3"}`}>
        <div className="flex min-h-full w-full min-w-0 max-w-full flex-col overflow-x-hidden">
          <nav className="space-y-1 pb-4">
          {NAV_SECTIONS.flatMap((section) => section.items)
            .filter((item) => item.href !== "/settings")
            .map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    aria-label={collapsed ? item.label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-2.5 rounded-lg py-2 text-sm transition-colors",
                      collapsed ? "justify-center px-2" : "px-2.5",
                      active
                        ? "bg-primary/12 text-primary shadow-sm ring-1 ring-primary/15"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:shadow-xs",
                    )}
                  >
                    {active ? (
                      <span className="absolute top-2 bottom-2 -left-1 w-px rounded-full bg-primary/45" />
                    ) : null}
                    <item.icon className="size-4 shrink-0" />
                    <span
                      aria-hidden={collapsed}
                      className={cn(
                        "min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 ease-in-out",
                        collapsed
                          ? "max-w-0 opacity-0"
                          : "max-w-40 opacity-100",
                      )}
                    >
                      {item.label}
                    </span>
                    {item.href === "/dashboard" && todayCount > 0 ? (
                      <span
                        className={cn(
                          "flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold leading-none text-primary-foreground",
                          collapsed
                            ? "absolute right-0.5 top-0.5 min-w-4 px-1"
                            : "ml-auto",
                        )}
                      >
                        {todayCount}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
          </nav>
        </div>
      </ScrollArea>

      <div className={`space-y-3 border-t border-sidebar-border py-4 ${collapsed ? "px-2" : "px-4"}`}>
        {!collapsed && recommendation ? (
          <Link
            href={`/focus?item=${recommendation.item.id}&minutes=${recommendation.suggestedMinutes}`}
            onClick={onNavigate}
            className="block rounded-xl border border-primary/20 bg-primary/6 p-3 transition-colors hover:bg-primary/10"
          >
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
              <Sparkles className="size-3" />
              Workspace AI recommendation
            </p>
            <p className="mt-2 truncate text-sm font-semibold">{recommendation.item.name}</p>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{recommendation.goalTitle}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">Focus for {recommendation.suggestedMinutes} min →</p>
          </Link>
        ) : collapsed ? (
          <Link
            href={recommendation ? `/focus?item=${recommendation.item.id}&minutes=${recommendation.suggestedMinutes}` : "/dashboard"}
            onClick={onNavigate}
            aria-label="Workspace AI recommendation"
            title="Workspace AI recommendation"
            className="mx-auto grid size-9 place-items-center rounded-lg text-primary transition-colors hover:bg-secondary/60"
          >
            <Sparkles className="size-4" />
          </Link>
        ) : null}

        <div className="border-t border-sidebar-border/70 pt-3">
          <Link
            href="/settings"
            onClick={onNavigate}
            aria-label={collapsed ? "Settings" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-lg py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground",
              collapsed ? "justify-center px-2" : "px-2.5",
            )}
            title={collapsed ? "Settings" : undefined}
          >
            <Settings className="size-4 shrink-0" />
            <span
              aria-hidden={collapsed}
              className={cn(
                "min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 ease-in-out",
                collapsed ? "max-w-0 opacity-0" : "max-w-32 opacity-100",
              )}
            >
              Settings
            </span>
          </Link>
          <button
            type="button"
            onClick={() => {
              clearLocalAuthSession();
              router.replace("/login");
            }}
            aria-label={collapsed ? "Log out" : undefined}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
              collapsed ? "justify-center px-2" : "px-2.5",
            )}
            title={collapsed ? "Log out" : undefined}
          >
            <LogOut className="size-4 shrink-0" />
            <span
              aria-hidden={collapsed}
              className={cn(
                "min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 ease-in-out",
                collapsed ? "max-w-0 opacity-0" : "max-w-32 opacity-100",
              )}
            >
              Log out
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
