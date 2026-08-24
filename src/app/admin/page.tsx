import { Suspense } from 'react'
import { AnalyticsCards, type AnalyticsData } from '@/components/admin/analytics-cards'
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

export default async function AdminDashboardPage() {
  const initialData = await getAnalytics()

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
    </div>
  )
}
