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

/** Keep the document palette in sync with the persisted workspace preference. */
function ThemeSync() {
  const { state, hydrated } = useFocusStore();

  useEffect(() => {
    const dark = hydrated && state.settings.theme === "dark";
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
      meta.content = dark ? "#17121a" : "#faf9f5";
    });
  }, [hydrated, state.settings.theme]);

  return null;
}
