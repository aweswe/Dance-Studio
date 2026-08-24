"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/guards";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const markAttendanceSchema = z.object({
  batchId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  records: z
    .array(
      z.object({
        studentId: z.string().uuid(),
        status: z.enum(["present", "absent", "leave"]),
      })
    )
    .min(1, "No records to save"),
});

export async function markAttendance(
  batchId: string,
  date: string,
  records: { studentId: string; status: "present" | "absent" | "leave" }[]
) {
  const supabase = await createServerSupabase();

  const parsed = markAttendanceSchema.safeParse({ batchId, date, records });
  if (!parsed.success) {
    return { success: false, error: "Invalid attendance data" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not signed in" };

  // marked_by FKs to instructors.id (not auth.users) — resolve it by auth_id
  const { data: instructor } = await supabase
    .from("instructors")
    .select("id")
    .eq("auth_id", user.id)
    .single();
  if (!instructor) return { success: false, error: "No instructor profile found" };

  // Batch ownership check (RLS enforces this too; fail cleanly instead)
  const { data: batch } = await supabase
    .from("batches")
    .select("instructor_id")
    .eq("id", parsed.data.batchId)
    .single();
  if (!batch) return { success: false, error: "Batch not found" };
  if (batch.instructor_id !== instructor.id) {
    return { success: false, error: "You do not teach this batch" };
  }

  const inserts = parsed.data.records.map((r) => ({
    batch_id: parsed.data.batchId,
    date: parsed.data.date,
    student_id: r.studentId,
    status: r.status,
    marked_by: instructor.id,
  }));

  // Upsert attendance
  const { error } = await supabase.from("attendance").upsert(inserts, {
    onConflict: "student_id, date",
    ignoreDuplicates: false,
  });

  if (error) {
    console.error("Error marking attendance:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/instructor/attendance");
  return { success: true };
}

/**
 * Admin read-only attendance report for a batch on a given date:
 * the roster joined against what was marked, plus summary counts.
 */
export async function getAttendanceReport(batchId: string, date: string) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) {
    return { success: false, error: "Not authorized" };
  }

  const parsed = z
    .object({
      batchId: z.string().uuid(),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
    })
    .safeParse({ batchId, date });
  if (!parsed.success) return { success: false, error: "Invalid report parameters" };

  const { data: roster, error: rosterErr } = await supabase
    .from("students")
    .select("id, name, student_id_display, status")
    .eq("batch_id", parsed.data.batchId)
    .order("name");
  if (rosterErr) return { success: false, error: rosterErr.message };

  const { data: attendance, error: attErr } = await supabase
    .from("attendance")
    .select("student_id, status")
    .eq("batch_id", parsed.data.batchId)
    .eq("date", parsed.data.date);
  if (attErr) return { success: false, error: attErr.message };

  const marked = new Map((attendance ?? []).map((a) => [a.student_id, a.status]));
  const counts = { present: 0, absent: 0, leave: 0 };
  for (const status of marked.values()) {
    if (status in counts) counts[status as keyof typeof counts]++;
  }

  return {
    success: true,
    roster: roster ?? [],
    marked: attendance ?? [],
    counts,
    unmarked: (roster ?? []).filter((s) => !marked.has(s.id)),
  };
}
