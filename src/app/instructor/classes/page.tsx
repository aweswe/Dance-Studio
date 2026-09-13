import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { getLinkedInstructor } from "@/lib/auth/instructor";
import { BatchCard } from "@/components/instructor/batch-card";

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
    .eq("instructor_id", instructor.id);

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-2">Your assigned batches.</p>

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
