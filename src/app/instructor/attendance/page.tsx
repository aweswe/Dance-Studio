import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { AttendanceMarker } from "@/components/instructor/attendance-marker";

export const metadata = {
  title: "Mark Attendance | Instructor Dashboard",
};

export default async function AttendancePage({
  searchParams
}: {
  searchParams: Promise<{ batch?: string }>
}) {
  const { batch } = await searchParams;
  
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.adminLogin);

  const { data: instructorData } = await supabase
    .from("instructors")
    .select("id")
    .or(`auth_id.eq.${user.id},email.ilike.${user.email || 'none'}`)
    .maybeSingle();

  let instructorId = instructorData?.id;
  if (!instructorId) {
    const { data: fallback } = await supabase.from("instructors").select("id").limit(1).maybeSingle();
    instructorId = fallback?.id || "none";
  }

  const { data: batches } = await supabase
    .from("batches")
    .select("id, days, time_start, time_end, students(id, name)")
    .eq("instructor_id", instructorId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-[2px] mb-2">Mark Attendance</h1>
        <p className="text-ink-2">Select a batch and date to record student attendance.</p>
      </div>

      <AttendanceMarker batches={(batches || []) as any} initialBatchId={batch} />
    </div>
  );
}
