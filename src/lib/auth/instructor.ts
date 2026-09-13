import type { createServerSupabase } from "@/lib/supabase/server";

type ServerClient = Awaited<ReturnType<typeof createServerSupabase>>;

/** Resolve the instructor row linked to this login. Never falls back to an unrelated row. */
export async function getLinkedInstructor(
  supabase: ServerClient,
  user: { id: string; email?: string | null } | null,
) {
  if (!user) return null;
  const { data: byAuth } = await supabase
    .from("instructors")
    .select("id, name, email, auth_id")
    .eq("auth_id", user.id)
    .maybeSingle();
  if (byAuth) return byAuth;
  if (user.email) {
    const { data: byEmail } = await supabase
      .from("instructors")
      .select("id, name, email, auth_id")
      .ilike("email", user.email)
      .maybeSingle();
    return byEmail;
  }
  return null;
}
