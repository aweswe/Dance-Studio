import { Suspense } from 'react'
import { AnalyticsCards, type AnalyticsData } from '@/components/admin/analytics-cards'
import { DashboardPanels } from '@/components/admin/dashboard-panels'
import { createServerSupabase } from '@/lib/supabase/server'
import { PageHeader } from '@/components/ui/page-header'

const EMPTY_ANALYTICS: AnalyticsData = {
  active_students: 0,
  enrollments_this_month: 0,
  enrollments_last_month: 0,
  revenue_this_month: 0,
  avg_attendance_this_week: 0,
  batch_occupancy: [],
  pending_dropouts: 0,
}

async function getAnalytics(): Promise<AnalyticsData> {
  const supabase = await createServerSupabase()
  const [{ data, error }, { count: dropoutCount }] = await Promise.all([
    supabase.rpc('get_dashboard_analytics'),
    supabase
      .from('leave_requests')
      .select('id', { count: 'exact', head: true })
      .eq('kind', 'platform_leave')
      .eq('status', 'pending'),
  ])

  if (error || !data) {
    console.error('get_dashboard_analytics failed:', error)
    return EMPTY_ANALYTICS
  }

  const d = data as any
  return {
    active_students: d.active_students ?? 0,
    enrollments_this_month: d.enrollments_this_month ?? 0,
    enrollments_last_month: d.enrollments_last_month ?? 0,
    revenue_this_month: d.revenue_this_month ?? 0,
    avg_attendance_this_week: d.avg_attendance_this_week ?? 0,
    batch_occupancy: Array.isArray(d.batch_occupancy) ? d.batch_occupancy : [],
    pending_dropouts: dropoutCount ?? 0,
  }
}

interface RevenuePoint {
  key: string
  label: string
  total: number
}

interface BatchAttendanceRow {
  id: string
  name: string
  programmeName: string
  rate: number
  marked: number
}

interface PendingRental {
  id: string
  name: string
  preferred_date: string
}

interface UnmarkedBatch {
  id: string
  name: string
  programmeName: string
}

interface DropoutRequest {
  id: string
  studentName: string
  reason: string
  date: string
  studentId: string
}

async function getPanelsData() {
  const supabase = await createServerSupabase()
  const now = new Date()

  // --- Revenue: last 6 months, aggregated from the fee ledger ---
  const { data: payments } = await supabase
    .from('fee_payments')
    .select('amount, paid_at, for_month')

  const revenueSeries: RevenuePoint[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const total = (payments ?? [])
      .map((p) => p as { amount: number; paid_at: string; for_month: string | null })
      .filter((p) => ((p.for_month ?? p.paid_at) || '').slice(0, 7) === key)
      .reduce((sum, p) => sum + (p.amount ?? 0), 0)
    revenueSeries.push({
      key,
      total,
      label: d.toLocaleDateString('en-IN', { month: 'short' }),
    })
  }

  // --- Attendance this month, per batch ---
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  const [{ data: attendance }, { data: batches }] = await Promise.all([
    supabase.from('attendance').select('batch_id, status').gte('date', monthStart),
    supabase.from('batches').select('id, name, days, programme:programmes(name)').eq('status', 'active'),
  ])

  const batchAttendance: BatchAttendanceRow[] = (batches ?? [])
    .map((b) => b as { id: string; name: string | null; days: string[] | null; programme: { name: string } | null })
    .map((b) => {
      const rows = (attendance ?? []).filter(
        (a) => (a as { batch_id: string | null }).batch_id === b.id,
      )
      const present = rows.filter((a) => (a as { status: string }).status === 'present').length
      return {
        id: b.id,
        name: b.name || b.days?.join(', ') || 'Batch',
        programmeName: b.programme?.name ?? '',
        rate: rows.length > 0 ? Math.round((present / rows.length) * 100) : 0,
        marked: rows.length,
      }
    })
    .filter((r) => r.marked > 0)
    .sort((a, b) => b.rate - a.rate)

  // --- Pending rentals ---
  const { data: pendingRentals } = await supabase
    .from('studio_rentals')
    .select('id, name, preferred_date')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  // --- New contact-form enquiries ---
  const { data: newEnquiries } = await supabase
    .from('enquiries')
    .select('id, name, phone')
    .eq('status', 'new')
    .order('created_at', { ascending: false })
    .limit(5)

  // --- Batches scheduled today with no attendance marked yet ---
  const todayKey = now.toISOString().slice(0, 10)
  const todayWeekday = now.toLocaleDateString('en-US', { weekday: 'long' })
  const { data: todaysAttendance } = await supabase
    .from('attendance')
    .select('batch_id')
    .eq('date', todayKey)

  const markedBatchIds = new Set((todaysAttendance ?? []).map((a) => (a as { batch_id: string }).batch_id))
  const unmarkedToday: UnmarkedBatch[] = (batches ?? [])
    .map((b) => b as { id: string; name: string | null; days: string[] | null; programme: { name: string } | null })
    .filter((b) => (b.days ?? []).includes(todayWeekday) && !markedBatchIds.has(b.id))
    .map((b) => ({
      id: b.id,
      name: b.name || b.days?.join(', ') || 'Batch',
      programmeName: b.programme?.name ?? '',
    }))

  // --- Pending platform-leave (dropout) requests ---
  const { data: dropoutRows } = await supabase
    .from('leave_requests')
    .select('id, date, notes, student:students(id, name)')
    .eq('kind', 'platform_leave')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(10)

  const dropoutRequests: DropoutRequest[] = (dropoutRows ?? []).map((r: any) => ({
    id: r.id,
    studentName: r.student?.name ?? 'Unknown',
    studentId: r.student?.id ?? '',
    reason: r.notes ?? '',
    date: r.date,
  }))

  return {
    revenueSeries,
    batchAttendance,
    pendingRentals: (pendingRentals ?? []) as PendingRental[],
    newEnquiries: ((newEnquiries ?? []) as { id: string; name: string; phone: string }[]),
    unmarkedToday,
    dropoutRequests,
  }
}

export default async function AdminDashboardPage() {
  const [initialData, panels] = await Promise.all([getAnalytics(), getPanelsData()])
  const waiting =
    panels.unmarkedToday.length + panels.pendingRentals.length + panels.newEnquiries.length + panels.dropoutRequests.length
  const deskLine =
    waiting === 0
      ? 'Nothing waiting at the desk.'
      : [
          panels.unmarkedToday.length ? `${panels.unmarkedToday.length} unmarked` : null,
          panels.pendingRentals.length ? `${panels.pendingRentals.length} rentals` : null,
          panels.newEnquiries.length ? `${panels.newEnquiries.length} enquiries` : null,
          panels.dropoutRequests.length ? `${panels.dropoutRequests.length} leaving` : null,
        ]
          .filter(Boolean)
          .join(' · ')

  return (
    <div className="space-y-8">
      <PageHeader label="Front desk" title="Today" description={deskLine} />

      <Suspense fallback={<div className="h-[5.75rem] rounded-md border border-line bg-surface-card shadow-lift animate-pulse" />}>
        <AnalyticsCards initialData={initialData} />
      </Suspense>

      <DashboardPanels
        revenueSeries={panels.revenueSeries}
        batchAttendance={panels.batchAttendance}
        pendingRentals={panels.pendingRentals}
        newEnquiries={panels.newEnquiries}
        unmarkedToday={panels.unmarkedToday}
        dropoutRequests={panels.dropoutRequests}
      />
    </div>
  )
}
