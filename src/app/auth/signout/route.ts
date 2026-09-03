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
  return handleSignOut(request);
}

export async function GET(request: Request) {
  return handleSignOut(request);
}

async function handleSignOut(request: Request) {
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
      .maybeSingle();
    role = (profile as { role?: string } | null)?.role ?? null;
  }

  await supabase.auth.signOut();

  // Resolve public origin safely on Vercel
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  const origin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  // Crucial: Use status 303 (See Other) so the browser redirects via GET to /
  // Default status 307 preserves the POST method, causing "HTTP ERROR 405" on /
  const res = NextResponse.redirect(new URL("/", origin), 303);
  res.cookies.delete("bypass_student");
  return res;
}
