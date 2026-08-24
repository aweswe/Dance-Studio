import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { InstructorSidebar } from "@/components/instructor/sidebar";
import { ROUTES } from "@/lib/utils/constants";

export const dynamic = 'force-dynamic';

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.adminLogin);
  }

  const { data: instructorData } = await supabase
    .from("instructors")
    .select("name")
    .eq("auth_id", user.id)
    .single();

  if (!instructorData) {
    redirect(ROUTES.home);
  }

  const instructor = instructorData as any;

  return (
    <div className="min-h-screen bg-light flex">
      <InstructorSidebar instructorName={instructor.name || "Instructor"} />
      <div className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto mt-12 md:mt-0">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
