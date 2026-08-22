import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let publicClient: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Public, stateless Supabase client for cached public data fetching.
 * Does NOT access cookies(), making it 100% compatible with Next.js "use cache" and SSG.
 */
export function getPublicSupabase() {
  if (!publicClient) {
    publicClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-key",
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }
  return publicClient;
}
