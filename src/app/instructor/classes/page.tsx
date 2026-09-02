import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { BatchCard } from "@/components/instructor/batch-card";

export const metadata = {
  title: "My Classes | Instructor Dashboard",
};

export default async function ClassesPage() {
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
    .select("*, students(id, name, student_id_display)")
    .eq("instructor_id", instructorId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-[2px] mb-2">My Classes</h1>
        <p className="text-ink-2">Manage your assigned batches and view enrolled students.</p>
      </div>

      <div className="space-y-4">
        {batches?.length ? (
          (batches as any[]).map((batch) => (
            <BatchCard key={batch.id} batch={batch} />
          ))
        ) : (
          <p className="text-ink-2">You have no assigned classes.</p>
        )}
      </div>
    </div>
  );
}
