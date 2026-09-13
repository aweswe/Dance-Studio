import { createServerSupabase, createAdminSupabase } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const ACTIVE_STUDENT_COOKIE = "rhythmzz_student_id";

export interface CurrentStudentResult {
  student: any;
  siblings: any[];
  user: any;
  isDemo: boolean;
}

function last10(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits.slice(-10) || null;
}

/**
 * Resolves the signed-in parent/student. Never auto-creates an active
 * roster row — unpaid Google/email visitors stay off the admin list
 * until onboarding, payment, or staff confirm them.
 */
export async function getCurrentStudent(): Promise<CurrentStudentResult> {
  const supabase = await createServerSupabase();
  let user: any = null;

  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    console.error("getCurrentStudent getUser failed", err);
  }

  if (user) {
    const admin = createAdminSupabase();
    const phone = last10(user.phone || user.user_metadata?.phone);

    const orConditions = [
      `auth_id.eq.${user.id}`,
      user.email ? `email.ilike.${user.email}` : null,
      phone ? `phone.eq.${phone}` : null,
    ].filter(Boolean).join(",");

    const { data: matchedRows } = await (admin as any)
      .from("students")
      .select("*, programme:programmes(*), batch:batches(*)")
      .or(orConditions)
      .order("created_at", { ascending: false });

    const siblings: any[] = matchedRows ?? [];

    for (const row of siblings) {
      if (row.auth_id !== user.id) {
        await (admin as any).from("students").update({ auth_id: user.id }).eq("id", row.id);
        row.auth_id = user.id;
      }
    }

    const cookieStore = await cookies();
    const preferredId = cookieStore.get(ACTIVE_STUDENT_COOKIE)?.value;
    const student =
      siblings.find((r) => r.id === preferredId) ||
      siblings.find((r) => r.programme_id || r.batch_id) ||
      siblings[0] ||
      null;

    return { student, siblings, user, isDemo: false };
  }

  const isDev = process.env.NODE_ENV !== "production";
  const cookieStore = await cookies();
  const hasBypass = isDev && cookieStore.get("bypass_student")?.value === "true";

  if (hasBypass && !user) {
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
        siblings: [fallbackStudent],
        user: {
          id: fallbackStudent.id,
          phone: `+91${fallbackStudent.phone}`,
          email: fallbackStudent.email || "aarav.sharma@testdance.in",
        },
        isDemo: true,
      };
    }
  }

  return { student: null, siblings: [], user: null, isDemo: false };
}
