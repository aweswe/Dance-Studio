import { LeaveAcademyForm } from "@/components/student/leave-form";
import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentStudent } from "@/lib/auth/student";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";

export const metadata = { title: "Leave Academy | Student" };

export default async function LeavePage() {
  const supabase = await createServerSupabase();
  const { student } = await getCurrentStudent();
  if (!student) redirect(ROUTES.login);

  // Check for an existing pending platform-leave request
  const { data: existing } = await supabase
    .from("leave_requests")
    .select("date, status")
    .eq("student_id", student.id)
    .eq("kind", "platform_leave")
    .eq("status", "pending")
    .maybeSingle();

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-lg font-semibold text-ink">Leave Rhythmzz Academy</h1>
        <p className="text-sm text-ink-2 mt-1">
          We're sorry to see you go. If you'd like to withdraw from the programme,
          tell us why — this helps us improve for everyone.
        </p>
      </div>

      <LeaveAcademyForm existingPendingDate={(existing as any)?.date ?? null} />
    </div>
  );
}
