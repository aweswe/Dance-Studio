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
    .eq("auth_id", user.id)
    .single();

  if (!instructorData) redirect(ROUTES.home);
  const instructor = instructorData as any;

  const { data: batches } = await supabase
    .from("batches")
    .select("id, days, time_start, time_end, students(id, name)")
    .eq("instructor_id", instructor.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-[2px] mb-2">Mark Attendance</h1>
        <p className="text-mu">Select a batch and date to record student attendance.</p>
      </div>

      <AttendanceMarker batches={(batches || []) as any} initialBatchId={batch} />
    </div>
  );
}
