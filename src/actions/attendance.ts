"use server";

import { createAdminSupabase, createServerSupabase } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/supabase/guards";
import { getLinkedInstructor } from "@/lib/auth/instructor";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/** Verify user is admin, or instructor who owns this batch.
 *  Returns the instructor's row ID when applicable so the caller can set `marked_by`.
 */
async function assertCanManageBatch(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
  batchId: string,
): Promise<{ ok: true; instructorId: string | null } | { ok: false; error: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const role = await getUserRole(supabase);
  if (role === "admin") return { ok: true, instructorId: null };

  if (role === "instructor") {
    const instructor = await getLinkedInstructor(supabase, user);
    if (!instructor) return { ok: false, error: "Instructor profile not linked" };
    const { data: batch } = await supabase
      .from("batches")
      .select("id")
      .eq("id", batchId)
      .eq("instructor_id", instructor.id)
      .maybeSingle();
    if (!batch) return { ok: false, error: "You can only mark attendance for your own batches" };
    return { ok: true, instructorId: instructor.id };
  }

  return { ok: false, error: "Only admin or instructor can mark attendance" };
}

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

  const auth = await assertCanManageBatch(supabase, parsed.data.batchId);
  if (!auth.ok) return { success: false, error: auth.error };

  const inserts = parsed.data.records.map((r) => ({
    batch_id: parsed.data.batchId,
    date: parsed.data.date,
    student_id: r.studentId,
    status: r.status,
    marked_by: auth.instructorId,
  }));

  const admin = createAdminSupabase();
  const { error } = await admin.from("attendance").upsert(inserts, {
    onConflict: "student_id,batch_id,date",
    ignoreDuplicates: false,
  });

  if (error) {
    console.error("Error marking attendance:", error);
    return { success: false, error: error.message };
  }

  try {
    const { sendWhatsAppTemplate } = await import("@/lib/whatsapp/client");
    const { WHATSAPP_TEMPLATES } = await import("@/lib/whatsapp/templates");
    for (const r of parsed.data.records.filter((x) => x.status === "absent")) {
      const { data: streak } = await admin.rpc("check_consecutive_absences", {
        p_student_id: r.studentId,
        p_threshold: 3,
      });
      if (!streak) continue;
      const { data: st } = await admin
        .from("students")
        .select("name, phone, programme:programmes(name)")
        .eq("id", r.studentId)
        .maybeSingle();
      const s = st as any;
      if (s?.phone) {
        await sendWhatsAppTemplate({
          phone: s.phone,
          templateName: WHATSAPP_TEMPLATES.absenceCheckIn.name,
          variables: WHATSAPP_TEMPLATES.absenceCheckIn.variables({
            studentName: s.name,
            absenceCount: "3",
            programmeName: s.programme?.name || "Rhythmzz",
          }),
        });
      }
    }
  } catch (err) {
    console.error("absence check-in failed", err);
  }

  revalidatePath("/admin/attendance");
  revalidatePath("/instructor/attendance");
  revalidatePath("/student/attendance");
  return { success: true };
}

/**
 * Attendance report for a batch on a given date:
 * the roster joined against what was marked, plus summary counts.
 * Accessible by admin (any batch) or instructor (own batches only).
 */
export async function getAttendanceReport(batchId: string, date: string) {
  const supabase = await createServerSupabase();
  const auth = await assertCanManageBatch(supabase, batchId);
  if (!auth.ok) return { success: false, error: auth.error };

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
    .neq("status", "left")
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

export async function markStudentAsLeft(studentId: string) {
  const supabase = await createServerSupabase();
  const role = await getUserRole(supabase);
  if (role !== "admin" && role !== "instructor") {
    return { success: false, error: "Not authorized" };
  }

  const admin = createAdminSupabase();

  // Update student status to 'left' and unassign from batch
  const { error: studentErr } = await admin
    .from("students")
    .update({ status: "left", batch_id: null })
    .eq("id", studentId);

  if (studentErr) {
    return { success: false, error: studentErr.message };
  }

  // If there are any pending platform_leave requests, mark them approved
  await admin
    .from("leave_requests")
    .update({ status: "approved" })
    .eq("student_id", studentId)
    .eq("kind", "platform_leave")
    .eq("status", "pending");

  revalidatePath("/admin/attendance");
  revalidatePath("/instructor/attendance");
  revalidatePath("/admin/students");
  revalidatePath("/admin/leave-requests");
  revalidatePath("/admin");
  return { success: true };
}

