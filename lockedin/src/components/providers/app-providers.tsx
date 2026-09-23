"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            gcTime: 5 * 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

/** Ignore legacy palette selections and normalize only the theme setting. */
function ThemeSync() {
  const { state, hydrated, actions } = useFocusStore();

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.removeAttribute("data-theme");
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
      meta.content = "#ffffff";
    });
  }, []);

  useEffect(() => {
    if (hydrated && state.settings.theme !== "light") {
      actions.updateSettings({ theme: "light" });
    }
  }, [hydrated, state.settings.theme, actions]);

  return null;
}
