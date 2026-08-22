"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markAttendance(
  batchId: string,
  date: string,
  records: { studentId: string; status: "present" | "absent" | "leave" }[]
) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const inserts = records.map(r => ({
    batch_id: batchId,
    date,
    student_id: r.studentId,
    status: r.status,
    marked_by: user?.id || null,
  }));

  // Upsert attendance
  const { error } = await (supabase as any).from("attendance").upsert(inserts, {
    onConflict: "student_id, date",
    ignoreDuplicates: false
  });

  if (error) {
    console.error("Error marking attendance:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/instructor/attendance");
  return { success: true };
}
