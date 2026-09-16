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

interface DropoutRequest {
  id: string
  studentName: string
  reason: string
  date: string
  studentId: string
}

interface DashboardPanelsProps {
  revenueSeries: RevenuePoint[]
  batchAttendance: BatchAttendanceRow[]
  pendingRentals: PendingRental[]
  newEnquiries: NewEnquiry[]
  unmarkedToday: UnmarkedBatch[]
  dropoutRequests: DropoutRequest[]
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
  dropoutRequests,
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
  const PAD_TOP = 36
  const PAD_LEFT = 52
  const PAD_BOTTOM = 28
  const CHART_H = 120
  const CHART_W = 360
  const SVG_W = PAD_LEFT + CHART_W
  const SVG_H = PAD_TOP + CHART_H + PAD_BOTTOM
  const BAR_W = 40
  const GAP = (CHART_W - revenueSeries.length * BAR_W) / (revenueSeries.length + 1)
  const chartBase = PAD_TOP + CHART_H

  function barValueLabel(h: number) {
    const above = chartBase - h - 8
    if (above >= PAD_TOP + 4) return { y: above, fill: 'var(--ink)' as const }
    return { y: chartBase - h / 2 + 4, fill: '#fff' as const }
  }
  const deskClear = pendingRentals.length === 0 && unmarkedToday.length === 0 && newEnquiries.length === 0 && dropoutRequests.length === 0

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
      <Card className="p-5 sm:p-6 xl:col-span-2">
        <h3 className="font-anton text-xl text-ink tracking-tight">Fees, last six months</h3>
        <p className="text-[12px] text-ink-3 mt-1 mb-5">Online and desk collections</p>

        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full overflow-visible"
          role="img"
          aria-label="Revenue by month bar chart"
        >
          {[0.25, 0.5, 0.75, 1].map((f) => {
            const y = chartBase - f * CHART_H
            return (
              <g key={f}>
                <line x1={PAD_LEFT} x2={SVG_W} y1={y} y2={y} stroke="var(--line)" strokeDasharray="4 4" />
                <text x={0} y={y + 4} fontSize={10} fill="var(--ink-3)">
                  {formatCurrency(Math.round(maxTotal * f))}
                </text>
              </g>
            )
          })}

          {revenueSeries.map((p, i) => {
            const h = Math.max((p.total / maxTotal) * CHART_H, p.total > 0 ? 4 : 2)
            const x = PAD_LEFT + GAP + i * (BAR_W + GAP)
            const label = barValueLabel(h)
            const valueText = p.total > 0 ? `₹${p.total >= 1000 ? `${(p.total / 1000).toFixed(1)}k` : p.total}` : ''
            return (
              <g key={p.key}>
                <rect
                  x={x}
                  y={chartBase - h}
                  width={BAR_W}
                  height={h}
                  rx={4}
                  fill={p.total > 0 ? 'var(--bl)' : 'var(--line)'}
                >
                  <title>{`${p.label}: ${formatCurrency(p.total)}`}</title>
                </rect>
                {valueText && (
                  <text
                    x={x + BAR_W / 2}
                    y={label.y}
                    fontSize={10}
                    textAnchor="middle"
                    fill={label.fill}
                    fontWeight={600}
                  >
                    {valueText}
                  </text>
                )}
                <text x={x + BAR_W / 2} y={chartBase + 18} fontSize={11} textAnchor="middle" fill="var(--ink-3)">
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
              className="block rounded-md bg-canvas-muted border border-line p-3 hover:bg-canvas-muted-2 focus-visible:focus-ring"
            >
              <p className="text-sm font-medium text-ink">Rental · {r.name}</p>
              <p className="text-[12px] text-ink-3">{formatDate(r.preferred_date, 'long')}</p>
            </a>
          ))}

          {unmarkedToday.map((b) => (
            <a
              key={b.id}
              href={`/admin/attendance?batch=${b.id}`}
              className="block rounded-md bg-canvas-muted border border-line p-3 hover:bg-canvas-muted-2 focus-visible:focus-ring"
            >
              <p className="text-sm font-medium text-ink">{b.programmeName} · {b.name}</p>
              <p className="text-[12px] text-ink-3">Attendance not marked</p>
            </a>
          ))}

          {newEnquiries.map((e) => (
            <a
              key={e.id}
              href="/admin/enquiries"
              className="block rounded-md bg-canvas-muted border border-line p-3 hover:bg-canvas-muted-2 focus-visible:focus-ring"
            >
              <p className="text-sm font-medium text-ink">{e.name}</p>
              <p className="text-[12px] text-ink-3">{e.phone}</p>
            </a>
          ))}

          {dropoutRequests.map((d) => (
            <a
              key={d.id}
              href="/admin/leave-requests"
              className="block rounded-md border border-danger/30 bg-danger/5 p-3 hover:bg-danger/10 focus-visible:focus-ring"
            >
              <p className="text-sm font-medium text-ink">{d.studentName} · Leaving</p>
              <p className="text-[12px] text-ink-3 line-clamp-2 mt-0.5">{d.reason}</p>
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
