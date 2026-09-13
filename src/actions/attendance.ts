"use server";

import { createAdminSupabase, createServerSupabase } from "@/lib/supabase/server";
import { getUserRole, isAdmin } from "@/lib/supabase/guards";
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

  const role = await getUserRole(supabase);
  if (role !== "admin") {
    return { success: false, error: "Only academy admin can mark attendance" };
  }

  const { data: batch } = await supabase
    .from("batches")
    .select("id")
    .eq("id", parsed.data.batchId)
    .single();
  if (!batch) return { success: false, error: "Batch not found" };

  const inserts = parsed.data.records.map((r) => ({
    batch_id: parsed.data.batchId,
    date: parsed.data.date,
    student_id: r.studentId,
    status: r.status,
    marked_by: null,
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
 * Admin attendance report for a batch on a given date:
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
