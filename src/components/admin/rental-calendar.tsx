'use client'

import { Card } from '@/components/ui/card'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'

export function RentalCalendar() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <div className="xl:col-span-3">
        <Card className="p-6 min-h-[600px] flex items-center justify-center bg-light border-dashed">
          <div className="text-center text-mu">
            <CalendarIcon size={48} className="mx-auto mb-4 opacity-50" />
            <p>Interactive calendar module coming soon.</p>
          </div>
        </Card>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-display text-xl text-blk">Pending Requests</h3>
        
        <Card className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-blk">Dance Practice</h4>
            <span className="text-xs font-medium text-gold bg-gold/10 px-2 py-1 rounded">PENDING</span>
          </div>
          <div className="space-y-1 mb-4 text-sm text-mu">
            <p>Rahul Sharma</p>
            <div className="flex items-center gap-1"><CalendarIcon size={12}/> Oct 24, 2026</div>
            <div className="flex items-center gap-1"><Clock size={12}/> 14:00 - 16:00</div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 text-xs py-2 bg-bl text-wh rounded-md hover:bg-bl/90 transition-colors">Approve</button>
            <button className="flex-1 text-xs py-2 border border-gray-200 text-blk rounded-md hover:bg-gray-50 transition-colors">Decline</button>
          </div>
        </Card>
      </div>
    </div>
  )
}
