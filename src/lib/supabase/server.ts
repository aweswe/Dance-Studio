import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Server-side Supabase client with cookie-based auth.
 * Use in Server Components, Route Handlers, and Server Actions.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key-for-build-prerendering",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method is called from a Server Component.
            // This can be ignored if middleware refreshes user sessions.
          }
        },
      },
    },
  );
}

/**
 * Admin Supabase client with service role key.
 * Bypasses RLS — use ONLY in API Route Handlers for trusted operations.
 * NEVER expose to the browser.
 */
export function createAdminSupabase() {
  return createSupabaseAdminClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key-for-build",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
