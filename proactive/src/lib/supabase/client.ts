import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Optional Supabase browser client.
 *
 * The MVP runs entirely on localStorage; Supabase is wired but dormant. Set
 * `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` and this
 * returns a real client, which `createSupabaseRepository` then uses.
 *
 * Returns `null` (rather than throwing) when unconfigured so the app keeps
 * working offline and callers can fall back to the local repository.
 *
 * @example
 * const client = getSupabaseClient();
 * const repo = client ? createSupabaseRepository(client, userId) : null;
 */
let cached: SupabaseClient | null | undefined;

export function getSupabaseClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  cached =
    url && anonKey
      ? createClient(url, anonKey, {
          auth: { persistSession: true, autoRefreshToken: true },
        })
      : null;

  return cached;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
