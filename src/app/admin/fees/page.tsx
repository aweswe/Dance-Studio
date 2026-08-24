import { Suspense } from 'react'
import { FeeTable } from '@/components/admin/fee-table'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { TableSkeleton } from '@/components/ui/skeleton'

export default function FeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-blk tracking-wide">Fees & Payments</h2>
          <p className="text-mu font-body text-sm mt-1">Manage transactions, track pending fees, and log offline payments.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download size={16} />
          <span>Export Records</span>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton rows={6} columns={5} />}>
        <FeeTable />
      </Suspense>
    </div>
  )
}
