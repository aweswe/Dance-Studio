import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { getLinkedInstructor } from "@/lib/auth/instructor";
import { BatchCard } from "@/components/instructor/batch-card";
import { Calendar } from "lucide-react";

export const metadata = {
  title: "My Classes | Instructor Dashboard",
};

export default async function ClassesPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.adminLogin);

  const instructor = await getLinkedInstructor(supabase, user);
  if (!instructor) {
    return (
      <div>
        <p className="text-sm text-ink-2">Ask the front desk to link this login to an instructor.</p>
      </div>
    );
  }

  const { data: batches } = await supabase
    .from("batches")
    .select("*, students(id, name, student_id_display)")
    .eq("instructor_id", instructor.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-anton text-2xl uppercase tracking-tight text-ink">My Assigned Classes</h1>
          <p className="text-sm text-ink-2 mt-0.5">
            Configure schedule timings and manage rosters for batches assigned to you.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {batches && batches.length > 0 ? (
          (batches as any[]).map((batch) => (
            <BatchCard key={batch.id} batch={batch} />
          ))
        ) : (
          <div className="p-8 rounded-md border border-line bg-surface text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-canvas-muted border border-line mx-auto flex items-center justify-center text-ink-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-anton text-lg uppercase tracking-tight text-ink">
              No Batches Assigned Yet
            </h3>
            <p className="text-xs sm:text-sm text-ink-2 max-w-md mx-auto">
              Batches are created and assigned to instructors by the studio administration. Once the admin links you to a batch, you can set up class timings and mark attendance here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
