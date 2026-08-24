import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Plain-POST sign-out used by the dashboard sidebars
 * (<form action="/auth/signout" method="post">).
 * Reads the role BEFORE clearing the session so admins/instructors
 * land back on the admin login, students on the student login.
 */
export async function POST(request: Request) {
  const supabase = await createServerSupabase();

  let role: string | null = null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    role = (profile as { role?: string } | null)?.role ?? null;
  }

  await supabase.auth.signOut();

  const target = role === "admin" || role === "instructor" ? "/admin-login" : "/login";
  return NextResponse.redirect(new URL(target, request.url));
}
