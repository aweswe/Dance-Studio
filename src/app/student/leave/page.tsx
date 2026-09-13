import { LeaveForm } from "@/components/student/leave-form";
import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentStudent } from "@/lib/auth/student";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Leave & makeup | Student" };

export default async function LeavePage() {
  const supabase = await createServerSupabase();
  const { student } = await getCurrentStudent();
  if (!student) redirect(ROUTES.login);

  const { data: rows } = await supabase
    .from("leave_requests")
    .select("id, date, kind, status, notes")
    .eq("student_id", student.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-2">Tell the academy when you will miss a class, or request a makeup slot.</p>
      <LeaveForm />
      <div className="space-y-2">
        {(rows || []).map((r: any) => (
          <Card key={r.id} className="p-4 flex justify-between text-sm">
            <span>{r.kind} · {r.date}</span>
            <span className="text-xs text-ink-3 capitalize">{r.status}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
