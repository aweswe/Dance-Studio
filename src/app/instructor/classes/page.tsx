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
    .eq("auth_id", user.id)
    .single();

  if (!instructorData) redirect(ROUTES.home);
  const instructor = instructorData as any;

  const { data: batches } = await supabase
    .from("batches")
    .select("*, students(id, name, student_id_display)")
    .eq("instructor_id", instructor.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-[2px] mb-2">My Classes</h1>
        <p className="text-mu">Manage your assigned batches and view enrolled students.</p>
      </div>

      <div className="space-y-4">
        {batches?.length ? (
          (batches as any[]).map((batch) => (
            <BatchCard key={batch.id} batch={batch} />
          ))
        ) : (
          <p className="text-mu">You have no assigned classes.</p>
        )}
      </div>
    </div>
  );
}
