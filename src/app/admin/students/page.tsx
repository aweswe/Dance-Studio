import { Suspense } from 'react'
import { StudentTable } from '@/components/admin/student-table'
import { getStudentsAction } from '@/actions/students'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'



export default async function StudentsPage() {
  // Initial fetch for the first page
  const initialData = await getStudentsAction({ limit: 10, cursor: null })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-blk tracking-wide">Students</h2>
          <p className="text-mu font-body text-sm mt-1">Manage enrollments, statuses, and profiles.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download size={16} />
          <span>Export CSV</span>
        </Button>
      </div>

      <Suspense fallback={<div>Loading students...</div>}>
        <StudentTable initialData={initialData} />
      </Suspense>
    </div>
  )
}
