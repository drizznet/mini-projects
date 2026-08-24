"use client";

import type { ReactNode } from "react";

import { ActiveSessionBar } from "@/components/layout/active-session-bar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { SidebarContent } from "@/components/layout/sidebar-content";
import { Skeleton } from "@/components/ui/skeleton";
import { useFocusStore } from "@/lib/store/focus-store";

/**
 * Application chrome: fixed sidebar rail, topbar and the routed content column.
 *
 * Children are withheld until the store has hydrated. Seed data and every
 * metric are keyed to the viewer's local calendar day, which the server cannot
 * compute, so mounting pages before hydration would guarantee a mismatch.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { hydrated } = useFocusStore();

  return (
    <div className="flex min-h-svh">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        {hydrated ? <SidebarContent /> : <SidebarSkeleton />}
      </aside>

      <div className="flex h-svh min-w-0 flex-1 flex-col lg:pl-64">
        {hydrated ? (
          <>
            <AppTopbar />
            <ActiveSessionBar />
          </>
        ) : (
          <div className="h-14 shrink-0 border-b border-border" />
        )}

        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
          {hydrated ? (
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          ) : (
            <ContentSkeleton />
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="space-y-6 p-5">
      <Skeleton className="h-8 w-40" />
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    </div>
  );
}

function ContentSkeleton() {
  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-4">
      <Skeleton className="h-40 w-full rounded-2xl" />
      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-5">
        <Skeleton className="h-72 lg:col-span-3" />
        <Skeleton className="h-72 lg:col-span-2" />
      </div>
    </div>
  );
}
