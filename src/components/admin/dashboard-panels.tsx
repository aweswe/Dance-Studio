'use client'

import { useRef } from 'react'
import { Card } from '@/components/ui/card'
import { useRealtime } from '@/hooks/use-realtime'
import { useRouter } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils/format'

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

interface NewEnquiry {
  id: string
  name: string
  phone: string
}

interface DashboardPanelsProps {
  revenueSeries: RevenuePoint[]
  batchAttendance: BatchAttendanceRow[]
  pendingRentals: PendingRental[]
  newEnquiries: NewEnquiry[]
  unmarkedToday: UnmarkedBatch[]
}

/** Debounced router.refresh() — attendance marking inserts N rows at once. */
function useDebouncedRefresh(ms = 1500) {
  const router = useRouter()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  return () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => router.refresh(), ms)
  }
}

export function DashboardPanels({
  revenueSeries,
  batchAttendance,
  pendingRentals,
  newEnquiries,
  unmarkedToday,
}: DashboardPanelsProps) {
  const refresh = useDebouncedRefresh()

  useRealtime({
    table: 'studio_rentals',
    event: 'INSERT',
    onEvent: () => refresh(),
  })
  useRealtime({
    table: 'attendance',
    event: 'INSERT',
    onEvent: () => refresh(),
  })
  useRealtime({
    table: 'fee_payments',
    event: 'INSERT',
    onEvent: () => refresh(),
  })
  useRealtime({
    table: 'enquiries',
    event: 'INSERT',
    onEvent: () => refresh(),
  })

  const maxTotal = Math.max(...revenueSeries.map((p) => p.total), 1)
  const CHART_H = 140
  const CHART_W = 360
  const BAR_W = 40
  const GAP = (CHART_W - revenueSeries.length * BAR_W) / (revenueSeries.length + 1)
  const deskClear = pendingRentals.length === 0 && unmarkedToday.length === 0 && newEnquiries.length === 0

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
      <Card className="p-5 sm:p-6 xl:col-span-2">
        <h3 className="font-anton text-xl text-ink tracking-tight">Fees, last six months</h3>
        <p className="text-[12px] text-ink-3 mt-1 mb-5">Online and desk collections</p>

        <svg viewBox={`0 0 ${CHART_W} ${CHART_H + 40}`} className="w-full" role="img" aria-label="Revenue by month bar chart">
          {[0.25, 0.5, 0.75, 1].map((f) => {
            const y = CHART_H - f * CHART_H
            return (
              <g key={f}>
                <line x1={0} x2={CHART_W} y1={y} y2={y} stroke="var(--line)" strokeDasharray="4 4" />
                <text x={0} y={y - 4} fontSize={10} fill="var(--ink-3)">
                  {formatCurrency(Math.round(maxTotal * f))}
                </text>
              </g>
            )
          })}

          {revenueSeries.map((p, i) => {
            const h = Math.max((p.total / maxTotal) * CHART_H, p.total > 0 ? 4 : 2)
            const x = GAP + i * (BAR_W + GAP)
            return (
              <g key={p.key}>
                <rect
                  x={x}
                  y={CHART_H - h}
                  width={BAR_W}
                  height={h}
                  rx={4}
                  fill={p.total > 0 ? 'var(--bl)' : 'var(--line)'}
                >
                  <title>{`${p.label}: ${formatCurrency(p.total)}`}</title>
                </rect>
                <text
                  x={x + BAR_W / 2}
                  y={CHART_H - h - 6}
                  fontSize={10}
                  textAnchor="middle"
                  fill="var(--ink)"
                  fontWeight={600}
                >
                  {p.total > 0 ? `₹${p.total >= 1000 ? `${(p.total / 1000).toFixed(1)}k` : p.total}` : ''}
                </text>
                <text x={x + BAR_W / 2} y={CHART_H + 18} fontSize={11} textAnchor="middle" fill="var(--ink-3)">
                  {p.label}
                </text>
              </g>
            )
          })}
        </svg>
      </Card>

      <Card className="p-5 sm:p-6">
        <h3 className="font-anton text-xl text-ink tracking-tight">Desk</h3>
        <p className="text-[12px] text-ink-3 mt-1 mb-5">Waiting on you</p>

        <div className="space-y-2">
          {deskClear && (
            <p className="text-sm text-ink-2 py-6 text-center">Nothing waiting.</p>
          )}

          {pendingRentals.map((r) => (
            <a
              key={r.id}
              href="/admin/studio-rental"
              className="block rounded-xl bg-canvas-muted border border-line p-3 hover:bg-canvas-muted-2 focus-visible:focus-ring"
            >
              <p className="text-sm font-medium text-ink">Rental · {r.name}</p>
              <p className="text-[12px] text-ink-3">{formatDate(r.preferred_date, 'long')}</p>
            </a>
          ))}

          {unmarkedToday.map((b) => (
            <a
              key={b.id}
              href={`/admin/attendance?batch=${b.id}`}
              className="block rounded-xl bg-canvas-muted border border-line p-3 hover:bg-canvas-muted-2 focus-visible:focus-ring"
            >
              <p className="text-sm font-medium text-ink">{b.programmeName} · {b.name}</p>
              <p className="text-[12px] text-ink-3">Attendance not marked</p>
            </a>
          ))}

          {newEnquiries.map((e) => (
            <a
              key={e.id}
              href="/admin/enquiries"
              className="block rounded-xl bg-canvas-muted border border-line p-3 hover:bg-canvas-muted-2 focus-visible:focus-ring"
            >
              <p className="text-sm font-medium text-ink">{e.name}</p>
              <p className="text-[12px] text-ink-3">{e.phone}</p>
            </a>
          ))}
        </div>
      </Card>

      <Card className="p-5 sm:p-6 xl:col-span-3">
        <h3 className="font-anton text-xl text-ink tracking-tight">Attendance this month</h3>
        <p className="text-[12px] text-ink-3 mt-1 mb-5">Present ÷ marks recorded</p>

        {batchAttendance.length === 0 ? (
          <p className="text-sm text-ink-2 py-4">No marks this month yet.</p>
        ) : (
          <div className="space-y-4">
            {batchAttendance.map((b) => (
              <div key={b.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="sm:w-52 shrink-0 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{b.programmeName}</p>
                  <p className="text-[12px] text-ink-3 truncate">{b.name}</p>
                </div>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-1 h-2 rounded-full bg-canvas-muted-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${b.rate >= 80 ? 'bg-green' : b.rate >= 60 ? 'bg-gold' : 'bg-danger'}`}
                      style={{ width: `${Math.max(b.rate, 2)}%` }}
                    />
                  </div>
                  <p className="w-20 shrink-0 text-right tabular-nums">
                    <span className="font-anton text-lg text-ink tracking-tight">{b.rate}%</span>
                    <span className="block text-[11px] text-ink-3">{b.marked} marks</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
