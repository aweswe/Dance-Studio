'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Phone, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { usePagination } from '@/hooks/use-pagination'
import { getStudentsAction } from '@/actions/students'
import { formatDate, telLink } from '@/lib/utils/format'

interface Student extends Record<string, unknown> {
  id: string
  name?: string
  phone: string
  status: string
  created_at: string
  auth_id?: string | null
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

  // Seeded from the server's first page — Load More continues from nextCursor,
  // and search/filter changes (refreshKey) reset + refetch page 1 debounced.
  const { items: data, isLoading, loadMore, hasMore, error } = usePagination<Student>({
    fetcher: async (cursor, limit) => {
      const res = await getStudentsAction({ limit, cursor: cursor ?? undefined, search, status: statusFilter !== 'all' ? statusFilter : undefined })
      return (res?.data as Student[]) || []
    },
    limit: 10,
    cursorField: 'created_at',
    initialItems: initialData.data,
    initialCursor: initialData.nextCursor,
    refreshKey: `${search}|${statusFilter}`,
  })

  return (
    <div className="bg-surface rounded-card border border-line overflow-hidden">
      <div className="p-4 border-b border-line flex flex-col sm:flex-row gap-4 justify-between items-center bg-canvas-muted/50">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-2" size={18} />
          <Input
            placeholder="Search name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-sm text-ink-2 font-medium">
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

      {error && (
        <div className="mx-4 mt-4 px-4 py-3 rounded-lg bg-danger/10 border border-danger/30 text-sm text-danger">
          Could not load students: {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-canvas-muted border-b border-line">
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-ink-2 uppercase">Name</th>
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-ink-2 uppercase">Phone</th>
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-ink-2 uppercase">Programme & Batch</th>
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-ink-2 uppercase">Join Date</th>
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-ink-2 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-subtle">
            {data.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-canvas-muted transition-colors cursor-pointer"
                onClick={() => router.push(`/admin/students/${student.id}`)}
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-ink flex items-center gap-2">
                    {student.name}
                    {student.auth_id && (
                      <Badge variant="green" className="text-[10px] px-2 py-0.5">PORTAL</Badge>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-ink-2">
                  <div className="flex items-center gap-1">
                    <span>{student.phone}</span>
                    {/* Click-to-call / WhatsApp — stop propagation so the row nav doesn't fire */}
                    <a
                      href={telLink(student.phone)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Call ${student.name ?? 'student'}`}
                      className="p-1 rounded text-ink-2 hover:text-bl hover:bg-canvas-muted-2 transition-colors"
                    >
                      <Phone size={13} />
                    </a>
                    <a
                      href={`https://wa.me/91${student.phone.replace(/\D/g, '').replace(/^91/, '')}`}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`WhatsApp ${student.name ?? 'student'}`}
                      className="p-1 rounded text-ink-2 hover:text-green hover:bg-canvas-muted-2 transition-colors"
                    >
                      <MessageCircle size={13} />
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {student.batch ? (
                    <div>
                      <div className="text-sm font-medium text-ink">{student.batch.programme?.name}</div>
                      <div className="text-xs text-ink-2">
                        {student.batch.name || student.batch.days?.join(', ')}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-ink-2 italic">No batch</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-ink-2">
                  {formatDate(student.created_at)}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={student.status === 'active' ? 'green' : 'default'}>
                    {student.status.toUpperCase()}
                  </Badge>
                </td>
              </tr>
            ))}
            {data.length === 0 && !isLoading && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-ink-2">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="p-4 border-t border-line flex justify-center">
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
