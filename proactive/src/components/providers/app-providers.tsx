"use client";

import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";
import { FocusStoreProvider, useFocusStore } from "@/lib/store/focus-store";

/**
 * Root client providers.
 *
 * Order matters: the store must wrap `ThemeSync` (which reads settings) and any
 * page that calls `useFocusData`.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <FocusStoreProvider>
      <TooltipProvider>
        <ThemeSync />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast:
                "!bg-popover !text-popover-foreground !border-border !rounded-xl",
            },
          }}
        />
      </TooltipProvider>
    </FocusStoreProvider>
  );
}

/**
 * Mirrors the persisted theme preference onto <html>.
 *
 * The document ships with `class="dark"` so the dark default paints instantly;
 * this only has to do work when the user has opted into light mode.
 */
function ThemeSync() {
  const { state, hydrated } = useFocusStore();
  const theme = state.settings.theme;

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
  }, [theme, hydrated]);

  return null;
}
