'use client'

import { useRealtime } from '@/hooks/use-realtime'
import { Users, TrendingUp, IndianRupee, UserCheck, LayoutGrid } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/format'
import { useState } from 'react'
import { SpotlightCard } from '@/components/ui/spotlight'
import { KpiNumber } from '@/components/ui/kpi-number'

export interface BatchOccupancyRow {
  batch_id: string
  programme_name: string
  capacity: number
  enrolled: number
  occupancy_percentage: number
}

export interface AnalyticsData {
  active_students: number
  enrollments_this_month: number
  enrollments_last_month: number
  revenue_this_month: number
  avg_attendance_this_week: number
  batch_occupancy: BatchOccupancyRow[]
}

interface AnalyticsCardsProps {
  initialData: AnalyticsData
}

export function AnalyticsCards({ initialData }: AnalyticsCardsProps) {
  const [data, setData] = useState<AnalyticsData>(initialData)

  useRealtime({
    table: 'students',
    event: 'INSERT',
    onEvent: (payload) => {
      if (payload.eventType === 'INSERT') {
        setData(prev => ({
          ...prev,
          active_students: prev.active_students + 1,
          enrollments_this_month: prev.enrollments_this_month + 1
        }))
      }
    }
  })

  // Batch Occupancy card = average occupancy across batches
  const rows = Array.isArray(data.batch_occupancy) ? data.batch_occupancy : []
  const batchOccupancyPct = rows.length > 0
    ? Math.round(rows.reduce((sum, r) => sum + (r.occupancy_percentage ?? 0), 0) / rows.length)
    : 0

  const enrolmentsDelta = data.enrollments_this_month - (data.enrollments_last_month ?? 0)

  const cards = [
    {
      title: 'Active Students',
      value: (data.active_students ?? 0).toString(),
      icon: Users,
      color: 'text-bl'
    },
    {
      title: 'New Enrolments',
      value: (data.enrollments_this_month ?? 0).toString(),
      subtitle: enrolmentsDelta >= 0
        ? `This Month (+${enrolmentsDelta} vs last)`
        : `This Month (${enrolmentsDelta} vs last)`,
      icon: TrendingUp,
      color: 'text-green'
    },
    {
      title: 'Revenue',
      value: formatCurrency(data.revenue_this_month ?? 0),
      subtitle: 'This Month',
      icon: IndianRupee,
      color: 'text-gold'
    },
    {
      title: 'Attendance Rate',
      value: `${Math.round(data.avg_attendance_this_week ?? 0)}%`,
      subtitle: 'This Week',
      icon: UserCheck,
      color: 'text-purp'
    },
    {
      title: 'Batch Occupancy',
      value: `${batchOccupancyPct}%`,
      subtitle: rows.length > 0 ? `Across ${rows.length} batches` : undefined,
      icon: LayoutGrid,
      color: 'text-ink'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <SpotlightCard
          key={i}
          tone="pale"
          className="h-full bg-surface rounded-card border border-line p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-body text-sm font-medium text-ink-2">{card.title}</h3>
            <card.icon size={20} className={card.color} />
          </div>
          <div className="flex items-baseline gap-2">
            <KpiNumber value={card.value} className="text-4xl text-ink" />
            {card.subtitle && (
              <span className="font-body text-xs text-ink-2">{card.subtitle}</span>
            )}
          </div>
        </SpotlightCard>
      ))}
    </div>
  )
}
