import { AttendanceReport } from '@/components/admin/attendance-report'
import { createServerSupabase } from '@/lib/supabase/server'

export default async function AttendancePage() {
  const supabase = await createServerSupabase()
  const { data: batches } = await supabase
    .from('batches')
    .select('id, name, programme:programmes(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-ink tracking-wide">Attendance</h2>
        <p className="text-ink-2 font-body text-sm mt-1">Monitor daily attendance records across all batches.</p>
      </div>

      <AttendanceReport batches={(batches ?? []) as any[]} />
    </div>
  )
}
