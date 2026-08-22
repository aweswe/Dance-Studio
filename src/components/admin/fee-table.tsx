'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Plus, FileText } from 'lucide-react'

export function FeeTable() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const data: any[] = [] // Mock data

  return (
    <div className="bg-wh rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-light/50">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mu" size={18} />
          <Input 
            placeholder="Search student or transaction..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Payments', value: 'all' },
              { label: 'Completed', value: 'completed' },
              { label: 'Pending', value: 'pending' },
            ]}
          />
          <Button className="flex items-center gap-2 whitespace-nowrap">
            <Plus size={16} /> Log Payment
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-light border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-mu uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-mu uppercase">Student</th>
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-mu uppercase">Amount</th>
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-mu uppercase">Method</th>
              <th className="px-6 py-4 text-xs font-display tracking-[2px] text-mu uppercase">Status</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-mu">
                  No payment records found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
