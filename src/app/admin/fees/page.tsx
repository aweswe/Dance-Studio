import { Suspense } from 'react'
import { FeeTable } from '@/components/admin/fee-table'
import { WhoOwes, WhoOwesStudent } from '@/components/admin/who-owes'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { TableSkeleton } from '@/components/ui/skeleton'
import { createServerSupabase } from '@/lib/supabase/server'
import { isMonthCovered, monthlyAmount } from '@/lib/fees/ledger'

export default async function FeesPage() {
  const supabase = await createServerSupabase()

  const { data: payments } = await supabase
    .from('fee_payments')
    .select('id, amount, source, notes, paid_at, for_month, student:students(name)')
    .order('paid_at', { ascending: false })
    .limit(100)

  const { data: students } = await supabase
    .from('students')
    .select('id, name, phone, status, programme:programmes(name, fees_monthly)')
    .order('name')

  // Who owes: active students whose current month is uncovered.
  const now = new Date()
  const ledgerPayments = await supabase
    .from('fee_payments')
    .select('student_id, for_month, paid_at')

  const paymentsByStudent = new Map<string, { for_month: string | null; paid_at: string }[]>()
  for (const p of (ledgerPayments.data ?? []) as any[]) {
    const list = paymentsByStudent.get(p.student_id) ?? []
    list.push(p)
    paymentsByStudent.set(p.student_id, list)
  }

  const whoOwes: WhoOwesStudent[] = ((students ?? []) as any[])
    .filter((s) => s.status === 'active' && s.phone)
    .filter((s) => !isMonthCovered(paymentsByStudent.get(s.id) ?? [], now))
    .map((s) => ({
      id: s.id,
      name: s.name,
      phone: s.phone,
      programmeName: s.programme?.name ?? '—',
      amount: monthlyAmount(s.programme?.fees_monthly),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-blk tracking-wide">Fees & Payments</h2>
          <p className="text-mu font-body text-sm mt-1">Manage transactions, track pending fees, and log offline payments.</p>
        </div>
        <a href="/api/export?type=payments">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            <span>Export Records</span>
          </Button>
        </a>
      </div>

      <WhoOwes students={whoOwes} />

      <Suspense fallback={<TableSkeleton rows={6} columns={5} />}>
        <FeeTable initialPayments={(payments ?? []) as any[]} students={(students ?? []) as any[]} />
      </Suspense>
    </div>
  )
}
