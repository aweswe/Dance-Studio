import { Suspense } from 'react'
import { AnalyticsCards } from '@/components/admin/analytics-cards'
import { createServerSupabase } from '@/lib/supabase/server'
import { StatCardSkeleton } from '@/components/ui/skeleton'



async function getAnalytics() {
  const supabase = await createServerSupabase()
  const { data, error } = await supabase.rpc('get_dashboard_analytics')
  
  if (error || !data) {
    return {
      active_students: 0,
      monthly_enrolments: 0,
      monthly_revenue: 0,
      attendance_rate: 0,
      batch_occupancy: 0
    }
  }
  return data
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
