'use client'

import { useRealtime } from '@/hooks/use-realtime'
import { Users, TrendingUp, IndianRupee, UserCheck, LayoutGrid } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/format'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'

interface AnalyticsData {
  active_students: number
  monthly_enrolments: number
  monthly_revenue: number
  attendance_rate: number
  batch_occupancy: number
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
          monthly_enrolments: prev.monthly_enrolments + 1
        }))
      }
    }
  })

  const cards = [
    {
      title: 'Active Students',
      value: data.active_students.toString(),
      icon: Users,
      color: 'text-bl'
    },
    {
      title: 'New Enrolments',
      value: data.monthly_enrolments.toString(),
      subtitle: 'This Month',
      icon: TrendingUp,
      color: 'text-green'
    },
    {
      title: 'Revenue',
      value: formatCurrency(data.monthly_revenue),
      subtitle: 'This Month',
      icon: IndianRupee,
      color: 'text-gold'
    },
    {
      title: 'Attendance Rate',
      value: `${Math.round(data.attendance_rate)}%`,
      icon: UserCheck,
      color: 'text-purp'
    },
    {
      title: 'Batch Occupancy',
      value: `${Math.round(data.batch_occupancy)}%`,
      icon: LayoutGrid,
      color: 'text-blk'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <Card key={i} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-body text-sm font-medium text-mu">{card.title}</h3>
            <card.icon size={20} className={card.color} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl text-blk">{card.value}</span>
            {card.subtitle && (
              <span className="font-body text-xs text-mu">{card.subtitle}</span>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
