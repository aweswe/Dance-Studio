import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentStudent } from "@/lib/auth/student";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { StudentClassesView } from "@/components/student/student-classes-view";
import {
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  UserCheck,
  Bell,
  ReceiptText,
} from "lucide-react";

export const metadata = {
  title: "Student Dashboard | Rhythmzz Academy",
};

export default async function StudentDashboardPage() {
  const supabase = await createServerSupabase();
  const { student, user } = await getCurrentStudent();

  if (!student) redirect(ROUTES.login);

  // Fetch attendance summary
  const { data: attendanceSummary } = await (supabase as any)
    .rpc("get_student_attendance_summary", { p_student_id: student.id });

  const attSummary = attendanceSummary as any;
  const hasAttendance = (attSummary?.total_classes || 0) > 0;
  const attendancePercentage = hasAttendance
    ? Math.round((attSummary.present_count / attSummary.total_classes) * 100)
    : 0;

  // Fee status from the latest payment
  const { data: payments } = await supabase
    .from("fee_payments")
    .select("id, paid_at, amount")
    .eq("student_id", student.id)
    .order("paid_at", { ascending: false })
    .limit(1);

  const now = new Date();
  const lastPaid = payments?.[0] ? new Date((payments[0] as any).paid_at) : null;
  const latestPayment = payments?.[0] as any;
  const feePaid =
    !!lastPaid &&
    lastPaid.getFullYear() === now.getFullYear() &&
    lastPaid.getMonth() === now.getMonth();

  // Discipline image thumbnail
  const progSlug = student.programme?.slug;
  const progImage =
    progSlug === "kuchipudi"
      ? "/images/kuchipudi/kuchipudi-natyarambham-posture.jpg"
      : progSlug === "kids-dance"
      ? "/images/studio-training/group-circle-drill.jpg"
      : progSlug === "adults-dance"
      ? "/images/studio-training/contemporary-conditioning.jpg"
      : "/images/studio-training/floorwork-stretch.jpg";

  const studentFirstName = student.name?.split(" ")[0] || "Dancer";

  const hasEnrolledBatch = Boolean(student.batch_id || student.programme_id || student.batch || student.programme);

  return (
    <div className="space-y-8 pb-10">
      {/* Visual Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-surface via-surface/90 to-canvas-muted-2 border border-line p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-bold uppercase tracking-[2px] px-3 py-1 rounded-full bg-bl/15 text-bl border border-bl/30">
                Student Portal
              </span>
              <span className="text-xs text-ink-2">
                {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl text-ink tracking-wide">
              Welcome back, <span className="text-bl">{studentFirstName}</span>!
            </h1>
            <p className="text-sm text-ink-2 max-w-xl leading-relaxed">
              {hasEnrolledBatch
                ? `You are scheduled for ${student.batch?.name || student.programme?.name}. Keep dancing and growing!`
                : "Welcome to Rhythmzz Academy! Choose your preferred dance batch below to start your journey."}
            </p>
          </div>

          {student.programme && (
            <div className="flex items-center gap-3 bg-surface/80 border border-line rounded-xl p-3 backdrop-blur-sm self-start md:self-auto">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-line-subtle shadow-sm">
                <Image src={progImage} alt="Programme" fill className="object-cover" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-bl-ink">Enrolled Discipline</p>
                <p className="text-sm font-semibold text-ink">{student.programme.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3 Visual Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Attendance with Visual Progress */}
        <Card className="p-6 relative overflow-hidden group hover:border-bl/40 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-ink-2 uppercase tracking-widest font-semibold">Attendance Record</p>
              <div className="flex items-baseline gap-2 mt-1">
                {hasAttendance ? (
                  <>
                    <span className="font-display text-4xl text-ink">{attendancePercentage}%</span>
                    <span className="text-xs text-ink-2 font-medium">({attSummary?.present_count}/{attSummary?.total_classes} classes)</span>
                  </>
                ) : (
                  <span className="font-display text-2xl text-ink-2">0 Classes</span>
                )}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-bl/10 text-bl flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-line/40 h-2 rounded-full overflow-hidden mb-4">
            <div
              className="bg-bl h-full rounded-full transition-all duration-500"
              style={{ width: `${hasAttendance ? Math.min(attendancePercentage, 100) : 0}%` }}
            />
          </div>

          <Link
            href={`${ROUTES.student}/attendance`}
            className="text-xs font-semibold text-bl-ink hover:text-bl flex items-center gap-1.5 transition-colors"
          >
            Full Attendance Sheet <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Card>

        {/* Metric 2: Current Batch Slot with Visual Image */}
        <Card className="p-6 relative overflow-hidden group hover:border-bl/40 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs text-ink-2 uppercase tracking-widest font-semibold">Active Class Batch</p>
              <h3 className="font-display text-xl text-ink mt-1 line-clamp-1">
                {student.batch?.name || (hasEnrolledBatch ? "Batch Assigned" : "Not Enrolled Yet")}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="text-xs text-ink-2 space-y-1 mb-4">
            <p className="flex items-center gap-1.5 font-medium text-ink">
              <Clock className="w-3.5 h-3.5 text-bl" />
              {student.batch ? `${student.batch.days?.join(", ")}` : (hasEnrolledBatch ? "Schedule loading..." : "No active batch")}
            </p>
            {student.batch && (
              <p className="text-ink-2">
                {student.batch.time_start?.slice(0, 5)} – {student.batch.time_end?.slice(0, 5)}
              </p>
            )}
          </div>

          <Link
            href={hasEnrolledBatch ? `${ROUTES.student}/schedule` : `${ROUTES.student}/classes`}
            className="text-xs font-semibold text-bl-ink hover:text-bl flex items-center gap-1.5 transition-colors"
          >
            {hasEnrolledBatch ? "Weekly Class Schedule" : "Browse & Join Batch"} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Card>

        {/* Metric 3: Fee Status with Receipt & Pay Link */}
        <Card className="p-6 relative overflow-hidden group hover:border-bl/40 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs text-ink-2 uppercase tracking-widest font-semibold">Monthly Fee Ledger</p>
              <div className="flex items-center gap-2 mt-1">
                {!hasEnrolledBatch ? (
                  <Badge variant="outline" className="text-xs py-0.5 px-2 text-ink-2 border-line-strong">
                    Not Enrolled
                  </Badge>
                ) : (
                  <Badge
                    variant={feePaid ? "green" : "outline"}
                    className={feePaid ? "text-xs py-1 px-2.5 font-bold" : "text-xs py-1 px-2.5 border-danger text-danger font-bold"}
                  >
                    {feePaid ? "Paid ✓" : "Due"}
                  </Badge>
                )}
                {latestPayment && feePaid && (
                  <span className="text-xs text-ink-2">₹{latestPayment.amount}</span>
                )}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green/10 text-green flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs text-ink-2 mb-4 leading-relaxed">
            {!hasEnrolledBatch
              ? "Enroll in a batch to view your monthly fee structure and payment options."
              : feePaid
              ? "This month is fully covered. Thank you!"
              : "Next tuition instalment is due. Pay online with instant receipt."}
          </p>

          <Link
            href={hasEnrolledBatch ? `${ROUTES.student}/fees` : `${ROUTES.student}/classes`}
            className="text-xs font-semibold text-bl-ink hover:text-bl flex items-center gap-1.5 transition-colors"
          >
            {!hasEnrolledBatch
              ? "Choose Programme & Batch"
              : feePaid
              ? "View Official Tax Receipt"
              : "Pay Monthly Tuition"} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Card>
      </div>

      {/* Quick Shortcuts Bar */}
      <div className="space-y-3">
        <h2 className="font-display text-xl tracking-[1px] text-ink">Quick Shortcuts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href={`${ROUTES.student}/classes`}
            className="p-4 rounded-xl border border-line bg-surface hover:border-bl hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-bl/10 text-bl flex items-center justify-center group-hover:bg-bl group-hover:text-white transition-colors shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink uppercase tracking-wider truncate">Classes & Batches</p>
                <p className="text-[11px] text-ink-2 truncate">Join or switch batch</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-ink-2 group-hover:text-bl group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>

          <Link
            href={`${ROUTES.student}/fees`}
            className="p-4 rounded-xl border border-line bg-surface hover:border-bl hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green/10 text-green flex items-center justify-center group-hover:bg-green group-hover:text-white transition-colors shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink uppercase tracking-wider truncate">Fee Ledger</p>
                <p className="text-[11px] text-ink-2 truncate">Receipts & payments</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-ink-2 group-hover:text-green group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>

          <Link
            href={`${ROUTES.student}/attendance`}
            className="p-4 rounded-xl border border-line bg-surface hover:border-bl hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-colors shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink uppercase tracking-wider truncate">Attendance</p>
                <p className="text-[11px] text-ink-2 truncate">Monthly presence %</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-ink-2 group-hover:text-gold group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>

          <Link
            href={`${ROUTES.student}/notices`}
            className="p-4 rounded-xl border border-line bg-surface hover:border-bl hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink uppercase tracking-wider truncate">Notices</p>
                <p className="text-[11px] text-ink-2 truncate">Holidays & updates</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-ink-2 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        </div>
      </div>

      {/* Main Interactive Classes & Batches View */}
      <div className="pt-2">
        <StudentClassesView currentStudent={student} feePaid={feePaid} />
      </div>
    </div>
  );
}

