import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Auth-layer defence for admin-only server actions.
 * RLS `*_admin_all` policies are the real gate; this gives a clean
 * 401-style refusal instead of a silent empty result when a non-admin
 * session calls an action directly.
 */
export async function isAdmin(
  supabase: SupabaseClient<Database>
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  return profile?.role === "admin";
}

export async function getUserRole(
  supabase: SupabaseClient<Database>
): Promise<"admin" | "instructor" | "student" | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role;
  if (role === "admin" || role === "instructor" || role === "student") return role;
  return null;
}
