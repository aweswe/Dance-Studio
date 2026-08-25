'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Search, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { logOfflinePayment } from '@/actions/fees'
import { formatCurrency, formatDate } from '@/lib/utils/format'

interface Payment {
  id: string
  amount: number
  source: string
  notes: string | null
  paid_at: string
  for_month: string | null
  student: { name: string } | null
}

interface StudentOption {
  id: string
  name: string
  phone: string
}

/** Current "YYYY-MM" for the modal's default month. */
function currentMonthValue(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/** "YYYY-MM-DD" → "Sep 2026". */
function monthLabel(for_month: string | null, paid_at: string): string {
  const d = new Date(for_month || paid_at);
  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
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

  const [form, setForm] = useState({
    studentId: '',
    amount: '',
    source: 'cash',
    notes: '',
    month: currentMonthValue(),
  })

  const payments = initialPayments || []

  const filtered = payments.filter((p) => {
    const hay = `${p.student?.name ?? ''} ${p.notes ?? ''}`.toLowerCase()
    if (search && !hay.includes(search.toLowerCase())) return false
    if (sourceFilter !== 'all' && p.source !== sourceFilter) return false
    return true
  })

  // Client-side pagination — the ledger can grow long; show 25 at a time.
  const [visibleCount, setVisibleCount] = useState(25)
  const visible = filtered.slice(0, visibleCount)

  const submit = async () => {
    setBusy(true)
    setFeedback(null)
    const res = await logOfflinePayment(
      form.studentId,
      Number(form.amount),
      form.source,
      form.notes,
      form.month,
    )
    setBusy(false)
    if (res.success) {
      setFeedback({ ok: true, text: 'Payment logged' })
      setIsOpen(false)
      setForm({ studentId: '', amount: '', source: 'cash', notes: '', month: currentMonthValue() })
      router.refresh()
    } else {
      setFeedback({ ok: false, text: res.error ?? 'Could not log payment' })
    }
  }

  return (
    <div className="bg-surface rounded-card border border-line overflow-hidden">
      <div className="p-4 border-b border-line bg-canvas-muted/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-2" size={18} />
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
        <p className={`px-4 pt-3 text-sm ${feedback.ok ? 'text-green-ink' : 'text-danger'}`}>{feedback.text}</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-canvas-muted border-b border-line">
              <th scope="col" className="px-6 py-4 text-xs font-display tracking-[2px] text-ink-2 uppercase">Date</th>
              <th scope="col" className="px-6 py-4 text-xs font-display tracking-[2px] text-ink-2 uppercase">Month</th>
              <th scope="col" className="px-6 py-4 text-xs font-display tracking-[2px] text-ink-2 uppercase">Student</th>
              <th scope="col" className="px-6 py-4 text-xs font-display tracking-[2px] text-ink-2 uppercase">Amount</th>
              <th scope="col" className="px-6 py-4 text-xs font-display tracking-[2px] text-ink-2 uppercase">Method</th>
              <th scope="col" className="px-6 py-4 text-xs font-display tracking-[2px] text-ink-2 uppercase">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-subtle">
            {visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-ink-2">
                  No payment records found.
                </td>
              </tr>
            ) : (
              visible.map((p) => (
                <tr key={p.id} className="hover:bg-canvas-muted transition-colors">
                  <td className="px-6 py-4 text-sm text-ink-2">{formatDate(p.paid_at)}</td>
                  <td className="px-6 py-4 text-sm text-ink-2">{monthLabel(p.for_month, p.paid_at)}</td>
                  <td className="px-6 py-4 font-medium text-ink">{p.student?.name || '—'}</td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(p.amount)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={p.source === 'razorpay' ? 'green' : p.source === 'upi_offline' ? 'blue' : 'default'}>
                      {p.source === 'upi_offline' ? 'UPI' : p.source.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-2">{p.notes || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {visibleCount < filtered.length && (
        <div className="p-4 border-t border-line flex justify-center">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((c) => c + 25)}
          >
            Show More ({filtered.length - visibleCount} remaining)
          </Button>
        </div>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Log Offline Payment" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-ink-2 mb-1">Student</label>
            <Select
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              placeholder="Select a student"
              options={students.map((s) => ({ value: s.id, label: `${s.name} (${s.phone})` }))}
            />
          </div>
          <div>
            <label className="block text-sm text-ink-2 mb-1">Amount (₹)</label>
            <Input
              type="number"
              min={1}
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-ink-2 mb-1">Source</label>
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
            <label className="block text-sm text-ink-2 mb-1">Covers Month</label>
            <Input
              type="month"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
            />
            <p className="text-xs text-ink-2 mt-1">Which month this payment covers in the ledger.</p>
          </div>
          <div>
            <label className="block text-sm text-ink-2 mb-1">Notes</label>
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
