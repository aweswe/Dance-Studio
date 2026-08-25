import { Suspense } from 'react'
import { AnalyticsCards, type AnalyticsData } from '@/components/admin/analytics-cards'
import { DashboardPanels } from '@/components/admin/dashboard-panels'
import { createServerSupabase } from '@/lib/supabase/server'
import { StatCardSkeleton } from '@/components/ui/skeleton'

const EMPTY_ANALYTICS: AnalyticsData = {
  active_students: 0,
  enrollments_this_month: 0,
  enrollments_last_month: 0,
  revenue_this_month: 0,
  avg_attendance_this_week: 0,
  batch_occupancy: [],
}

async function getAnalytics(): Promise<AnalyticsData> {
  const supabase = await createServerSupabase()
  const { data, error } = await supabase.rpc('get_dashboard_analytics')

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

  return {
    revenueSeries,
    batchAttendance,
    pendingRentals: (pendingRentals ?? []) as PendingRental[],
    newEnquiries: ((newEnquiries ?? []) as { id: string; name: string; phone: string }[]),
    unmarkedToday,
  }
}

export default async function AdminDashboardPage() {
  const [initialData, panels] = await Promise.all([getAnalytics(), getPanelsData()])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl text-blk tracking-wide">Overview</h2>
        <p className="text-mu font-body text-sm mt-1">Welcome back. Here is what is happening today.</p>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      }>
        <AnalyticsCards initialData={initialData} />
      </Suspense>

      <DashboardPanels
        revenueSeries={panels.revenueSeries}
        batchAttendance={panels.batchAttendance}
        pendingRentals={panels.pendingRentals}
        newEnquiries={panels.newEnquiries}
        unmarkedToday={panels.unmarkedToday}
      />
    </div>
  )
}
