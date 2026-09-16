'use client'

import { useRealtime } from '@/hooks/use-realtime'
import { formatCurrency } from '@/lib/utils/format'
import { useState } from 'react'
import { MetricStrip } from '@/components/ui/metric-strip'

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
  pending_dropouts: number
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

  const rows = Array.isArray(data.batch_occupancy) ? data.batch_occupancy : []
  const batchOccupancyPct = rows.length > 0
    ? Math.round(rows.reduce((sum, r) => sum + (r.occupancy_percentage ?? 0), 0) / rows.length)
    : 0

  const enrolmentsDelta = data.enrollments_this_month - (data.enrollments_last_month ?? 0)

  const dropouts = data.pending_dropouts ?? 0
  const churnPct = data.active_students > 0
    ? Math.round((dropouts / data.active_students) * 100)
    : 0

  return (
    <MetricStrip
      items={[
        {
          label: 'Students',
          value: String(data.active_students ?? 0),
        },
        {
          label: 'New this month',
          value: String(data.enrollments_this_month ?? 0),
          hint: enrolmentsDelta === 0 ? 'Same as last month' : `${enrolmentsDelta > 0 ? '+' : ''}${enrolmentsDelta} vs last`,
        },
        {
          label: 'Fees in',
          value: formatCurrency(data.revenue_this_month ?? 0),
          hint: 'This month',
        },
        {
          label: 'Attendance',
          value: `${Math.round(data.avg_attendance_this_week ?? 0)}%`,
          hint: 'This week',
        },
        {
          label: 'Occupancy',
          value: `${batchOccupancyPct}%`,
          hint: rows.length > 0 ? `${rows.length} batches` : undefined,
        },
        {
          label: 'Leaving',
          value: dropouts > 0 ? `${churnPct}%` : '—',
          hint: dropouts > 0 ? `${dropouts} pending` : 'No requests',
        },
      ]}
    />
  )
}
