"use client";

import * as React from "react";
import { PanelLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SidebarContextValue = {
  state: "expanded" | "collapsed";
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const value = React.useMemo<SidebarContextValue>(
    () => ({
      state: open ? "expanded" : "collapsed",
      toggleSidebar: () => setOpen((current) => !current),
    }),
    [open],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used inside SidebarProvider");
  return context;
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  return (
    <aside
      data-state={state}
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden overflow-hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-in-out lg:flex lg:flex-col",
        state === "expanded" ? "w-64" : "w-16",
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggleSidebar, state } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={className}
      onClick={toggleSidebar}
      aria-label={state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
      title={state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
    >
      <PanelLeft className="size-4" />
    </Button>
  );
}

export function SidebarHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-16 items-center border-b border-sidebar-border px-3">{children}</div>;
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">{children}</div>;
}

export function SidebarFooter({ children }: { children: React.ReactNode }) {
  return <div className="border-t border-sidebar-border p-3">{children}</div>;
}

export function SidebarGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}

export function SidebarGroupLabel({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  return state === "expanded" ? (
    <p className="px-2.5 pb-1 text-[10px] font-semibold tracking-widest text-muted-foreground/70 uppercase">
      {children}
    </p>
  ) : null;
}

export function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <nav className="space-y-6">{children}</nav>;
}

export function SidebarMenuItem({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
