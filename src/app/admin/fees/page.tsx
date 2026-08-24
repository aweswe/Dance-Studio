import { Suspense } from 'react'
import { FeeTable } from '@/components/admin/fee-table'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { TableSkeleton } from '@/components/ui/skeleton'
import { createServerSupabase } from '@/lib/supabase/server'

export default async function FeesPage() {
  const supabase = await createServerSupabase()

  const { data: payments } = await supabase
    .from('fee_payments')
    .select('id, amount, source, notes, paid_at, student:students(name)')
    .order('paid_at', { ascending: false })
    .limit(100)

  const { data: students } = await supabase
    .from('students')
    .select('id, name, phone')
    .order('name')

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

      <Suspense fallback={<TableSkeleton rows={6} columns={5} />}>
        <FeeTable initialPayments={(payments ?? []) as any[]} students={(students ?? []) as any[]} />
      </Suspense>
    </div>
  )
}
