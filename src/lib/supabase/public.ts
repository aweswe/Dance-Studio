import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let publicClient: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Public, stateless Supabase client for cached public data fetching.
 * Does NOT access cookies(), making it 100% compatible with Next.js "use cache" and SSG.
 */
export function getPublicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If credentials are empty or pointing to dummy/mock URL, instantly return null to avoid 7-second timeouts
  if (!url || !key || url.includes('mock.supabase.co') || key === 'mock-key') {
    return null;
  }

  if (!publicClient) {
    publicClient = createClient<Database>(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return publicClient;
}
