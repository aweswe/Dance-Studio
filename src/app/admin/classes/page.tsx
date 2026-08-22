import { Suspense } from 'react'
import { BatchManager } from '@/components/admin/batch-manager'
import { getProgrammesAction, getBatchesAction } from '@/actions/classes'
import { getInstructorsAction } from '@/actions/instructors'



export default async function ClassesPage() {
  // Fetch required data for batches and programmes
  const programmes = await getProgrammesAction()
  const batches = await getBatchesAction()
  const instructors = await getInstructorsAction()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-blk tracking-wide">Classes & Batches</h2>
        <p className="text-mu font-body text-sm mt-1">Manage all academy programmes and active batches.</p>
      </div>

      <Suspense fallback={<div>Loading classes data...</div>}>
        <BatchManager 
          initialProgrammes={programmes}
          initialBatches={batches}
          instructors={instructors}
        />
      </Suspense>
    </div>
  )
}
