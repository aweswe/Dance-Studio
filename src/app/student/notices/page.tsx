import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentStudent } from "@/lib/auth/student";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { NoticeList } from "@/components/student/notice-list";

export const metadata = {
  title: "Notices | Student Dashboard",
};

export default async function NoticesPage() {
  const supabase = await createServerSupabase();
  const { student, user } = await getCurrentStudent();

  if (!student) redirect(ROUTES.login);

  const { data: notices } = await supabase
    .from("broadcast_logs")
    .select("*")
    .order("sent_at", { ascending: false })
    .limit(20);

  const { data: reads } = user
    ? await supabase.from("notice_reads").select("log_id").eq("user_id", user.id)
    : { data: [] };

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-2">Updates from the studio. Switch language if you prefer Telugu or Hindi titles.</p>

      <NoticeList
        notices={(notices || []) as any}
        programmeId={(student as any).programme_id}
        batchId={(student as any).batch_id}
        readIds={((reads || []) as any[]).map((r) => r.log_id)}
      />
    </div>
  );
}
