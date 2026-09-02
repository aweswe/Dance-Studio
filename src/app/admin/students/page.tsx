import { Suspense } from 'react'
import { StudentTable } from '@/components/admin/student-table'
import { AddStudentModal } from '@/components/admin/add-student-modal'
import { getStudentsAction } from '@/actions/students'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { TableSkeleton } from '@/components/ui/skeleton'
import { createServerSupabase } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic';

export default async function StudentsPage() {
  // Initial fetch for the first page
  let initialData = { data: [] as any[], nextCursor: null as string | null };
  try {
    const res = await getStudentsAction({ limit: 10, cursor: null });
    if (res && Array.isArray(res.data)) {
      initialData = res;
    }
  } catch (err) {
    console.error('Error fetching initial students:', err);
  }

  const supabase = await createServerSupabase();
  const [{ data: programmes }, { data: batches }] = await Promise.all([
    supabase.from('programmes').select('id, name').order('name'),
    supabase.from('batches').select('id, name, programme:programmes(name)').order('name'),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-ink tracking-wide">Students</h2>
          <p className="text-ink-2 font-body text-sm mt-1">Manage enrollments, statuses, and profiles.</p>
        </div>
        <div className="flex items-center gap-3">
          <AddStudentModal
            programmes={(programmes ?? []) as { id: string; name: string }[]}
            batches={(batches ?? []) as any[]}
          />
          <a href="/api/export?type=students">
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              <span>Export CSV</span>
            </Button>
          </a>
        </div>
      </div>

      <Suspense fallback={<TableSkeleton rows={8} columns={6} />}>
        <StudentTable initialData={initialData} />
      </Suspense>
    </div>
  )
}
