import { createServerSupabase, createAdminSupabase } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export interface CurrentStudentResult {
  student: any;
  user: any;
  isDemo: boolean;
}

/**
 * Retrieves the currently authenticated student, with automatic fallback / demo
 * bypass mode supporting Aarav Sharma (or the active demo student) when requested.
 */
export async function getCurrentStudent(): Promise<CurrentStudentResult> {
  const supabase = await createServerSupabase();
  let user: any = null;

  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {}

  if (user) {
    const admin = createAdminSupabase();

    // Fetch all student records that belong to this user (by auth_id, or by email, or by phone)
    const orConditions = [
      `auth_id.eq.${user.id}`,
      user.email ? `email.ilike.${user.email}` : null,
      user.phone ? `phone.eq.${user.phone.replace(/\D/g, '')}` : null,
    ].filter(Boolean).join(',');

    const { data: matchedRows } = await (admin as any)
      .from("students")
      .select("*, programme:programmes(*), batch:batches(*)")
      .or(orConditions)
      .order("created_at", { ascending: false });

    let student: any = null;

    if (matchedRows && matchedRows.length > 0) {
      // Prioritize the row that has an active programme_id or batch_id
      student = matchedRows.find((r: any) => r.programme_id || r.batch_id) || matchedRows[0];

      // Ensure the master row has the auth_id linked
      if (student.auth_id !== user.id) {
        await (admin as any).from("students").update({ auth_id: user.id }).eq("id", student.id);
        student.auth_id = user.id;
      }
    }

    // Only if NO match exists at all in the database, create one
    if (!student) {
      const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "New Student";
      const { data: newStudent } = await (admin as any).from("students").insert({
        auth_id: user.id,
        name: displayName,
        email: user.email || null,
        phone: user.phone || user.user_metadata?.phone || null,
        status: "active",
      }).select("*, programme:programmes(*), batch:batches(*)").single();

      if (newStudent) {
        student = newStudent;
      }
    }

    if (student) {
      return { student, user, isDemo: false };
    }

    return {
      student: {
        id: user.id,
        name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Student",
        email: user.email,
        phone: user.phone || null,
        programme: null,
        batch: null,
      },
      user,
      isDemo: false,
    };
  }

  // Check for demo bypass (only when NOT signed in and in dev mode)
  const isDev = process.env.NODE_ENV !== "production";
  const cookieStore = await cookies();
  const hasBypass = isDev && cookieStore.get("bypass_student")?.value === "true";

  if (hasBypass && !user) {
    // Fetch Aarav Sharma from database as the preview student
    const admin = createAdminSupabase();
    const { data: fallbackStudent } = await admin
      .from("students")
      .select("*, programme:programmes(*), batch:batches(*)")
      .or("phone.eq.9888812345,name.ilike.%Aarav%")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fallbackStudent) {
      return {
        student: fallbackStudent,
        user: {
          id: fallbackStudent.id,
          phone: `+91${fallbackStudent.phone}`,
          email: fallbackStudent.email || "aarav.sharma@testdance.in"
        },
        isDemo: true,
      };
    }
  }

  return { student: null, user: null, isDemo: false };
}
