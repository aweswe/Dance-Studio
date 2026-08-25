'use client'

import { useRef } from 'react'
import { Card } from '@/components/ui/card'
import { useRealtime } from '@/hooks/use-realtime'
import { useRouter } from 'next/navigation'
import { CalendarClock, ClipboardList, IndianRupee, Mail, UserCheck } from 'lucide-react'
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

  // Live-update the panels when new rentals arrive or attendance is marked.
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

  // ---------- Revenue bar chart (hand-rolled SVG, no chart lib) ----------
  const maxTotal = Math.max(...revenueSeries.map((p) => p.total), 1)
  const CHART_H = 140
  const CHART_W = 360
  const BAR_W = 40
  const GAP = (CHART_W - revenueSeries.length * BAR_W) / (revenueSeries.length + 1)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Revenue chart */}
      <Card className="p-6 xl:col-span-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
            <IndianRupee size={20} />
          </div>
          <div>
            <h3 className="font-display text-xl text-blk">Revenue — Last 6 Months</h3>
            <p className="text-xs text-mu">From the fee ledger (online + offline)</p>
          </div>
        </div>

        <svg viewBox={`0 0 ${CHART_W} ${CHART_H + 40}`} className="w-full" role="img" aria-label="Revenue by month bar chart">
          {[0.25, 0.5, 0.75, 1].map((f) => {
            const y = CHART_H - f * CHART_H
            return (
              <g key={f}>
                <line x1={0} x2={CHART_W} y1={y} y2={y} stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
                <text x={0} y={y - 4} fontSize={10} fill="#8a8a8a">
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
                  fill={p.total > 0 ? '#2BB4D8' : 'rgba(0,0,0,0.06)'}
                >
                  <title>{`${p.label}: ${formatCurrency(p.total)}`}</title>
                </rect>
                <text
                  x={x + BAR_W / 2}
                  y={CHART_H - h - 6}
                  fontSize={10}
                  textAnchor="middle"
                  fill="#2a2a2a"
                  fontWeight={600}
                >
                  {p.total > 0 ? `₹${p.total >= 1000 ? `${(p.total / 1000).toFixed(1)}k` : p.total}` : ''}
                </text>
                <text x={x + BAR_W / 2} y={CHART_H + 18} fontSize={11} textAnchor="middle" fill="#8a8a8a">
                  {p.label}
                </text>
              </g>
            )
          })}
        </svg>
      </Card>

      {/* Pending-items feed */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blp flex items-center justify-center text-bl">
            <ClipboardList size={20} />
          </div>
          <div>
            <h3 className="font-display text-xl text-blk">Needs Attention</h3>
            <p className="text-xs text-mu">Pending approvals and unmarked classes</p>
          </div>
        </div>

        <div className="space-y-3">
          {pendingRentals.length === 0 && unmarkedToday.length === 0 && newEnquiries.length === 0 && (
            <p className="text-sm text-mu py-4 text-center">Nothing pending. 🎉</p>
          )}

          {pendingRentals.map((r) => (
            <a
              key={r.id}
              href="/admin/studio-rental"
              className="flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/5 p-3 hover:bg-gold/10 transition-colors"
            >
              <CalendarClock size={16} className="text-gold mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blk">Rental request: {r.name}</p>
                <p className="text-xs text-mu">{formatDate(r.preferred_date, 'long')} — awaiting approval</p>
              </div>
            </a>
          ))}

          {unmarkedToday.map((b) => (
            <a
              key={b.id}
              href="/admin/attendance"
              className="flex items-start gap-3 rounded-lg border border-bl/20 bg-blp/30 p-3 hover:bg-blp/50 transition-colors"
            >
              <ClipboardList size={16} className="text-bl mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blk">{b.programmeName} — {b.name}</p>
                <p className="text-xs text-mu">Attendance not marked yet today</p>
              </div>
            </a>
          ))}

          {newEnquiries.map((e) => (
            <a
              key={e.id}
              href="/admin/enquiries"
              className="flex items-start gap-3 rounded-lg border border-purp/30 bg-purp/5 p-3 hover:bg-purp/10 transition-colors"
            >
              <Mail size={16} className="text-purp mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blk">Enquiry from {e.name}</p>
                <p className="text-xs text-mu">{e.phone} — awaiting reply</p>
              </div>
            </a>
          ))}
        </div>
      </Card>

      {/* Per-batch attendance rate */}
      <Card className="p-6 xl:col-span-3">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-green/10 flex items-center justify-center text-green">
            <UserCheck size={20} />
          </div>
          <div>
            <h3 className="font-display text-xl text-blk">Attendance This Month — By Batch</h3>
            <p className="text-xs text-mu">Present ÷ total marks recorded this month</p>
          </div>
        </div>

        {batchAttendance.length === 0 ? (
          <p className="text-sm text-mu py-4 text-center">No attendance marked this month yet.</p>
        ) : (
          <div className="space-y-4">
            {batchAttendance.map((b) => (
              <div key={b.id} className="flex items-center gap-4">
                <div className="w-56 shrink-0">
                  <p className="text-sm font-medium text-blk truncate">{b.programmeName}</p>
                  <p className="text-xs text-mu truncate">{b.name}</p>
                </div>
                <div className="flex-1 h-3 rounded-full bg-black/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${b.rate >= 80 ? 'bg-green' : b.rate >= 60 ? 'bg-gold' : 'bg-red-400'}`}
                    style={{ width: `${Math.max(b.rate, 2)}%` }}
                  />
                </div>
                <div className="w-24 text-right shrink-0">
                  <span className="font-display text-lg text-blk">{b.rate}%</span>
                  <span className="text-xs text-mu ml-1">({b.marked} marks)</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
