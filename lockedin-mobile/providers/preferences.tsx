import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { FocusBackdrop } from "@/lib/theme";

const KEY = "lockin:preferences";

type Preferences = {
  focusBackdrop: FocusBackdrop;
  displayName: string;
};

const defaults: Preferences = {
  focusBackdrop: "gradient",
  displayName: "there",
};

type PreferencesContextValue = {
  prefs: Preferences;
  setFocusBackdrop: (value: FocusBackdrop) => void;
  hydrated: boolean;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(defaults);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    void AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) {
        try {
          setPrefs({ ...defaults, ...JSON.parse(raw) });
        } catch {
          /* keep defaults */
        }
      }
      setHydrated(true);
    });
  }, []);

  const persist = useCallback((next: Preferences) => {
    setPrefs(next);
    void AsyncStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const value = useMemo(
    () => ({
      prefs,
      hydrated,
      setFocusBackdrop: (focusBackdrop: FocusBackdrop) =>
        persist({ ...prefs, focusBackdrop }),
    }),
    [prefs, hydrated, persist],
  );

  return (
    <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}
