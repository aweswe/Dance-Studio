import { Suspense } from 'react'
import { InstructorManager } from '@/components/admin/instructor-manager'
import { getInstructorsAction } from '@/actions/instructors'
import { CardSkeleton } from '@/components/ui/skeleton'

export default async function InstructorsPage() {
  const instructors = await getInstructorsAction()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-ink tracking-wide">Instructors</h2>
        <p className="text-ink-2 font-body text-sm mt-1">Manage academy teaching staff and their assignments.</p>
      </div>

      <Suspense fallback={<CardSkeleton />}>
        <InstructorManager initialInstructors={instructors} />
      </Suspense>
    </div>
  )
}
