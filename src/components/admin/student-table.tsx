'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, MoreVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { usePagination } from '@/hooks/use-pagination'
import { getStudentsAction } from '@/actions/students'
import { formatDate } from '@/lib/utils/format'

interface Student extends Record<string, unknown> {
  id: string
  name?: string
  phone: string
  status: string
  created_at: string
  batch?: {
    name: string | null
    days: string[]
    programme: {
      name: string
    }
  } | null
}

interface StudentTableProps {
  initialData: {
    data: Student[]
    nextCursor: string | null
  }
}

export function StudentTable({ initialData }: StudentTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const { items: data, isLoading, loadMore, hasMore } = usePagination<Student>({
    fetcher: async (cursor, limit) => {
      const res = await getStudentsAction({ limit, cursor: cursor ?? undefined, search, status: statusFilter !== 'all' ? statusFilter : undefined })
      return (res?.data as Student[]) || []
    },
    limit: 10,
    cursorField: 'created_at',
  })

  const displayData = data.length > 0 ? data : initialData.data

  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-black/[.07] overflow-hidden">
      <div className="p-4 border-b border-black/[.07] flex flex-col sm:flex-row gap-4 justify-between items-center bg-light/50">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mu" size={18} />
          <Input 
            placeholder="Search name or phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-sm text-mu font-medium">
            <Filter size={16} /> Filter:
          </div>
          <Select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Status', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-light border-b border-black/[.07]">
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-mu uppercase">Name</th>
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-mu uppercase">Phone</th>
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-mu uppercase">Programme & Batch</th>
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-mu uppercase">Join Date</th>
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-mu uppercase">Status</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[.05]">
            {displayData.map((student) => (
              <tr 
                key={student.id} 
                className="hover:bg-light transition-colors cursor-pointer"
                onClick={() => router.push(`/admin/students/${student.id}`)}
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-blk">{student.name}</div>
                </td>
                <td className="px-6 py-4 text-sm text-mu">{student.phone}</td>
                <td className="px-6 py-4">
                  {student.batch ? (
                    <div>
                      <div className="text-sm font-medium text-blk">{student.batch.programme?.name}</div>
                      <div className="text-xs text-mu">
                        {student.batch.name || student.batch.days?.join(', ')}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-mu italic">No batch</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-mu">
                  {formatDate(student.created_at)}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={student.status === 'active' ? 'green' : 'default'}>
                    {student.status.toUpperCase()}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-mu hover:text-blk transition-colors rounded-full hover:bg-black/5">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {displayData.length === 0 && !isLoading && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-mu">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {hasMore && (
        <div className="p-4 border-t border-black/[.07] flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => loadMore()}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
}
