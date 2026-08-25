'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { CheckCircle2, XCircle, CalendarOff, UserMinus } from 'lucide-react'
import { getAttendanceReport } from '@/actions/attendance'

interface BatchOption {
  id: string
  name: string | null
  programme: { name: string } | null
}

interface ReportStudent {
  id: string
  name: string
  student_id_display: string | null
  status: string | null
}

interface Report {
  success: boolean
  error?: string
  roster?: ReportStudent[]
  marked?: { student_id: string | null; status: 'present' | 'absent' | 'leave' }[]
  counts?: { present: number; absent: number; leave: number }
  unmarked?: ReportStudent[]
}

const today = () => new Date().toISOString().slice(0, 10)

export function AttendanceReport({ batches }: { batches: BatchOption[] }) {
  const [batchId, setBatchId] = useState('')
  const [date, setDate] = useState(today())
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<Report | null>(null)

  const load = async () => {
    if (!batchId) return
    setLoading(true)
    const res = await getAttendanceReport(batchId, date)
    setReport(res)
    setLoading(false)
  }

  const markedMap = new Map((report?.marked ?? []).map((m) => [m.student_id, m.status]))
  const statusBadge = (status: 'present' | 'absent' | 'leave') =>
    status === 'present' ? (
      <Badge variant="green"><CheckCircle2 size={12} className="inline mr-1" />PRESENT</Badge>
    ) : status === 'absent' ? (
      <Badge variant="default"><XCircle size={12} className="inline mr-1" />ABSENT</Badge>
    ) : (
      <Badge variant="gold"><CalendarOff size={12} className="inline mr-1" />LEAVE</Badge>
    )

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm text-ink-2 mb-1">Batch</label>
            <Select
              value={batchId}
              onChange={(e) => { setBatchId(e.target.value); setReport(null) }}
              placeholder="Select a batch"
              options={batches.map((b) => ({
                value: b.id,
                label: `${b.programme?.name ?? ''} — ${b.name ?? ''}`.trim(),
              }))}
            />
          </div>
          <div>
            <label className="block text-sm text-ink-2 mb-1">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <Button onClick={load} disabled={!batchId || loading}>
            {loading ? 'Loading...' : 'View Report'}
          </Button>
        </div>
      </Card>

      {report && !report.success && (
        <Card className="p-6 text-sm text-danger">{report.error}</Card>
      )}

      {report && report.success && report.counts && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-6 text-center">
              <p className="font-display text-3xl text-green">{report.counts.present}</p>
              <p className="text-xs font-display tracking-[2px] text-ink-2 uppercase mt-1">Present</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="font-display text-3xl text-danger">{report.counts.absent}</p>
              <p className="text-xs font-display tracking-[2px] text-ink-2 uppercase mt-1">Absent</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="font-display text-3xl text-gold">{report.counts.leave}</p>
              <p className="text-xs font-display tracking-[2px] text-ink-2 uppercase mt-1">On Leave</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="font-display text-3xl text-ink-2">{report.unmarked?.length ?? 0}</p>
              <p className="text-xs font-display tracking-[2px] text-ink-2 uppercase mt-1">Unmarked</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-display text-xl text-ink mb-4 flex items-center gap-2">
              <UserMinus size={18} className="text-bl" /> Roster
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-canvas-muted border-b border-line">
                    <th scope="col" className="px-6 py-4 text-xs font-display tracking-[2px] text-ink-2 uppercase">Student</th>
                    <th scope="col" className="px-6 py-4 text-xs font-display tracking-[2px] text-ink-2 uppercase">ID</th>
                    <th scope="col" className="px-6 py-4 text-xs font-display tracking-[2px] text-ink-2 uppercase">Status</th>
                    <th scope="col" className="px-6 py-4 text-xs font-display tracking-[2px] text-ink-2 uppercase">Marked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-subtle">
                  {(report.roster ?? []).map((s) => {
                    const mark = markedMap.get(s.id)
                    return (
                      <tr key={s.id} className="hover:bg-canvas-muted transition-colors">
                        <td className="px-6 py-4 font-medium text-ink">{s.name}</td>
                        <td className="px-6 py-4 text-sm text-ink-2">{s.student_id_display}</td>
                        <td className="px-6 py-4">
                          <Badge variant={s.status === 'active' ? 'green' : 'default'}>
                            {(s.status ?? 'unknown').toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          {mark ? statusBadge(mark) : <span className="text-sm text-ink-2 italic">Not marked</span>}
                        </td>
                      </tr>
                    )
                  })}
                  {(report.roster ?? []).length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-ink-2">
                        No students in this batch.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
