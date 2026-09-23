import { LEGACY_STORAGE_KEYS, STORAGE_KEY } from "./constants";
import type { FocusState } from "./types";

/** Persistence boundary for the frontend-only Focus OS experience. */
export interface FocusRepository {
  load(): Promise<FocusState | null>;
  save(state: FocusState): Promise<void>;
  clear(): Promise<void>;
}

/** Store the complete demo state in the browser for the current frontend preview. */
export function createLocalRepository(): FocusRepository {
  return {
    async load() {
      try {
        const raw =
          window.localStorage.getItem(STORAGE_KEY) ??
          LEGACY_STORAGE_KEYS.map((key) => window.localStorage.getItem(key)).find(
            Boolean,
          );
        if (!raw) return null;
        const state = JSON.parse(raw) as FocusState;
        if (!window.localStorage.getItem(STORAGE_KEY)) {
          window.localStorage.setItem(STORAGE_KEY, raw);
          for (const key of LEGACY_STORAGE_KEYS) {
            window.localStorage.removeItem(key);
          }
        }
        return state;
      } catch {
        return null;
      }
    },
    async save(state) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        for (const key of LEGACY_STORAGE_KEYS) {
          window.localStorage.removeItem(key);
        }
      } catch {
        // Quota exceeded or private mode: keep running from memory.
      }
    },
    async clear() {
      window.localStorage.removeItem(STORAGE_KEY);
      for (const key of LEGACY_STORAGE_KEYS) {
        window.localStorage.removeItem(key);
      }
    },
  };
}
