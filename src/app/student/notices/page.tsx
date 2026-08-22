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
    .select("id, programme_id")
    .eq("auth_id", user.id)
    .single();

  if (!student) redirect(ROUTES.home);

  // Fetch notices (broadcast_logs). In a real app we might filter based on recipients.
  // We'll just fetch recent broadcast logs.
  const { data: notices } = await supabase
    .from("broadcast_logs")
    .select("*")
    .order("sent_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-[2px] mb-2">Notices</h1>
        <p className="text-mu">Updates and announcements from Rhythmzz Academy.</p>
      </div>

      <NoticeList notices={(notices || []) as any} />
    </div>
  );
}
