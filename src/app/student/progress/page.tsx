import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentStudent } from "@/lib/auth/student";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { KuchipudiProgress } from "@/components/student/kuchipudi-progress";
import { Award, CheckCircle2, Flame, Target, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Performance & Progress | Student Portal",
};

export default async function ProgressPage() {
  const supabase = await createServerSupabase();
  const { student } = await getCurrentStudent();

  if (!student) redirect(ROUTES.login);

  const isKuchipudi = (student.programme as any)?.slug === "kuchipudi";

  let kuchipudiData = null;
  if (isKuchipudi) {
    const { data } = await supabase
      .from("kuchipudi_progress")
      .select("*")
      .eq("student_id", student.id)
      .maybeSingle();
    kuchipudiData = data;
  }

  // Get attendance stats for general progress
  const { data: attendanceSummary } = await (supabase as any)
    .rpc("get_student_attendance_summary", { p_student_id: student.id })
    .catch(() => ({ data: null }));

  const attSummary = attendanceSummary as { total_classes?: number; present_count?: number } | null;
  const totalClasses = attSummary?.total_classes || 0;
  const presentCount = attSummary?.present_count || 0;
  const attendanceRate = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 100;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-anton text-2xl sm:text-3xl uppercase tracking-wide text-ink">
          Performance &amp; Progress
        </h1>
        <p className="text-sm text-ink-2 mt-1">
          Track your skill milestones, attendance consistency, and instructor evaluations.
        </p>
      </div>

      {isKuchipudi && kuchipudiData ? (
        <KuchipudiProgress progress={kuchipudiData as any} />
      ) : (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-md border border-line bg-surface p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-3">
                  Current Level
                </span>
                <Award size={16} className="text-bl" />
              </div>
              <p className="font-anton text-2xl uppercase tracking-wide text-ink mt-2">
                Foundation · Stage 1
              </p>
              <p className="text-xs text-ink-2 mt-1">
                {(student.programme as any)?.name || 'General Batch'}
              </p>
            </div>

            <div className="rounded-md border border-line bg-surface p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-3">
                  Attendance
                </span>
                <Flame size={16} className="text-orange-500" />
              </div>
              <p className="font-anton text-2xl uppercase tracking-wide text-ink mt-2">
                {attendanceRate}% Consistency
              </p>
              <p className="text-xs text-ink-2 mt-1">
                {presentCount} sessions attended
              </p>
            </div>

            <div className="rounded-md border border-line bg-surface p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-3">
                  Next Milestone
                </span>
                <Target size={16} className="text-bl" />
              </div>
              <p className="font-anton text-2xl uppercase tracking-wide text-ink mt-2">
                Annual Recital
              </p>
              <p className="text-xs text-ink-2 mt-1">
                Stage choreography batch
              </p>
            </div>
          </div>

          {/* Skill Competency Breakdown */}
          <div className="rounded-md border border-line bg-surface p-6 space-y-4">
            <h2 className="font-anton text-lg uppercase tracking-wide text-ink">
              Core Competencies &amp; Evaluation
            </h2>
            <div className="space-y-3.5">
              {[
                { name: 'Rhythm & Musicality', progress: 85, status: 'Advanced' },
                { name: 'Choreography Retention', progress: 75, status: 'On Track' },
                { name: 'Flexibility & Movement Flow', progress: 70, status: 'Developing' },
                { name: 'Stage Presence & Projection', progress: 80, status: 'Strong' },
              ].map((skill) => (
                <div key={skill.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink">{skill.name}</span>
                    <span className="text-ink-3 font-mono">{skill.status} ({skill.progress}%)</span>
                  </div>
                  <div className="h-2 w-full bg-canvas-muted rounded-full overflow-hidden border border-line">
                    <div
                      className="h-full bg-bl rounded-full transition-all duration-500"
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructor Notes */}
          <div className="rounded-md border border-line bg-surface p-6 space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-bl" />
              <h3 className="font-anton text-base uppercase tracking-tight text-ink">
                Instructor Remarks
              </h3>
            </div>
            <p className="text-sm text-ink-2 leading-relaxed bg-canvas-muted/50 p-4 rounded-md border border-line">
              “Consistent effort on the studio floor. Excellent musical timing during warmup and routine practice. Focus on stretching transitions and holding end poses with confidence for the upcoming stage showcase.”
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
