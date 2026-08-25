import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { NoticeList } from "@/components/student/notice-list";

export const metadata = {
  title: "Notices | Student Dashboard",
};

export default async function NoticesPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.login);

  const { data: student } = await supabase
    .from("students")
    .select("id, programme_id, batch_id")
    .eq("auth_id", user.id)
    .single();

  if (!student) redirect(ROUTES.home);

  // RLS (`broadcast_logs_students_read`) returns only scoped broadcasts;
  // the client filter below is belt-and-braces for legacy rows.
  const { data: notices } = await supabase
    .from("broadcast_logs")
    .select("*")
    .order("sent_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-[2px] mb-2">Notices</h1>
        <p className="text-ink-2">Updates and announcements from Rhythmzz Academy.</p>
      </div>

      <NoticeList
        notices={(notices || []) as any}
        programmeId={(student as any).programme_id}
        batchId={(student as any).batch_id}
      />
    </div>
  );
}
