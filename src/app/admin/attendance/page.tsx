import { AttendanceReport } from '@/components/admin/attendance-report'
import { AttendanceMarker } from '@/components/instructor/attendance-marker'
import { LeaveReviewList } from '@/components/shared/leave-review-list'
import { createServerSupabase } from '@/lib/supabase/server'

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ batch?: string }>
}) {
  const { batch } = await searchParams
  const supabase = await createServerSupabase()
  const { data: batches } = await supabase
    .from('batches')
    .select('id, name, days, time_start, time_end, programme:programmes(name), students(id, name, status)')
    .order('created_at', { ascending: false })

  const { data: leaves } = await supabase
    .from('leave_requests')
    .select('id, date, kind, status, notes, student:students(name)')
    .order('created_at', { ascending: false })
    .limit(40)

  const markerBatches = ((batches ?? []) as any[]).map((b) => ({
    id: b.id,
    name: b.name || `${(b.programme as any)?.name ?? ''} ${Array.isArray(b.days) ? b.days.join(', ') : ''}`.trim(),
    days: b.days,
    students: (b.students ?? []).filter((s: any) => s.status !== 'left'),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-ink tracking-wide">Attendance</h2>
        <p className="text-ink-2 font-body text-sm mt-1">
          Only academy admin can mark attendance. Instructors see a read-only roster in their portal.
        </p>
      </div>

      <AttendanceMarker batches={markerBatches} initialBatchId={batch} />

      <AttendanceReport batches={(batches ?? []) as any[]} />

      <div>
        <h3 className="font-display text-xl text-ink mb-3">Leave &amp; makeup</h3>
        <LeaveReviewList requests={(leaves ?? []) as any[]} />
      </div>
    </div>
  )
}
