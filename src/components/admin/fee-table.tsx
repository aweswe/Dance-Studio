'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Search, Plus, Bell } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { logOfflinePayment, sendFeeReminder } from '@/actions/fees'
import { formatCurrency, formatDate } from '@/lib/utils/format'

interface Payment {
  id: string
  amount: number
  source: string
  notes: string | null
  paid_at: string
  student: { name: string } | null
}

interface StudentOption {
  id: string
  name: string
  phone: string
}

export function FeeTable({
  initialPayments,
  students,
}: {
  initialPayments: Payment[]
  students: StudentOption[]
}) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')

  // Log payment modal
  const [isOpen, setIsOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)
  const [reminderState, setReminderState] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    studentId: '',
    amount: '',
    source: 'cash',
    notes: '',
  })

  const payments = initialPayments || []

  const filtered = payments.filter((p) => {
    const hay = `${p.student?.name ?? ''} ${p.notes ?? ''}`.toLowerCase()
    if (search && !hay.includes(search.toLowerCase())) return false
    if (sourceFilter !== 'all' && p.source !== sourceFilter) return false
    return true
  })

  const submit = async () => {
    setBusy(true)
    setFeedback(null)
    const res = await logOfflinePayment(form.studentId, Number(form.amount), form.source, form.notes)
    setBusy(false)
    if (res.success) {
      setFeedback({ ok: true, text: 'Payment logged' })
      setIsOpen(false)
      setForm({ studentId: '', amount: '', source: 'cash', notes: '' })
      router.refresh()
    } else {
      setFeedback({ ok: false, text: res.error ?? 'Could not log payment' })
    }
  }

  return (
    <div className="bg-wh rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-light/50">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mu" size={18} />
          <Input
            placeholder="Search student or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            options={[
              { label: 'All Sources', value: 'all' },
              { label: 'Cash', value: 'cash' },
              { label: 'UPI (Offline)', value: 'upi_offline' },
              { label: 'Razorpay', value: 'razorpay' },
            ]}
          />
          <Button className="flex items-center gap-2 whitespace-nowrap" onClick={() => setIsOpen(true)}>
            <Plus size={16} /> Log Payment
          </Button>
        </div>
      </div>

      {feedback && (
        <p className={`px-4 pt-3 text-sm ${feedback.ok ? 'text-green' : 'text-red-500'}`}>{feedback.text}</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-light border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-mu uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-mu uppercase">Student</th>
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-mu uppercase">Amount</th>
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-mu uppercase">Method</th>
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-mu uppercase">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-mu">
                  No payment records found.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-light/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-mu">{formatDate(p.paid_at)}</td>
                  <td className="px-6 py-4 font-medium text-blk">{p.student?.name || '—'}</td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(p.amount)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={p.source === 'razorpay' ? 'green' : p.source === 'upi_offline' ? 'blue' : 'default'}>
                      {p.source === 'upi_offline' ? 'UPI' : p.source.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-mu">{p.notes || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Fee reminders live per student — quick send from the student list */}
      {students.length > 0 && (
        <div className="border-t border-gray-100 p-4">
          <h4 className="text-xs font-display tracking-[2px] text-mu uppercase mb-3 flex items-center gap-2">
            <Bell size={14} /> Send Fee Reminder
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {students.slice(0, 20).map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <p className="text-xs text-mu">{s.phone}</p>
                </div>
                <Button
                  variant="outline"
                  className="shrink-0 text-xs"
                  disabled={!!reminderState[s.id]}
                  onClick={async () => {
                    setReminderState((m) => ({ ...m, [s.id]: 'sending' }))
                    const res = await sendFeeReminder(s.id)
                    setReminderState((m) => ({ ...m, [s.id]: res.success ? 'sent' : 'failed' }))
                  }}
                >
                  {reminderState[s.id] === 'sending' ? 'Sending...' : reminderState[s.id] === 'sent' ? '✓ Sent' : reminderState[s.id] === 'failed' ? 'Failed — retry' : 'Remind'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Log Offline Payment" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-mu mb-1">Student</label>
            <Select
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              placeholder="Select a student"
              options={students.map((s) => ({ value: s.id, label: `${s.name} (${s.phone})` }))}
            />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Amount (₹)</label>
            <Input
              type="number"
              min={1}
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Source</label>
            <Select
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              options={[
                { label: 'Cash', value: 'cash' },
                { label: 'UPI (Offline)', value: 'upi_offline' },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Notes</label>
            <Input
              placeholder="e.g., August fee, paid in cash"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={submit} disabled={busy}>
              {busy ? 'Saving...' : 'Log Payment'}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
