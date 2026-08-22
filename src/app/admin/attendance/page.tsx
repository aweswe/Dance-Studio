import { Suspense } from 'react'
import { Card } from '@/components/ui/card'

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-blk tracking-wide">Attendance</h2>
        <p className="text-mu font-body text-sm mt-1">Monitor daily attendance records across all batches.</p>
      </div>

      <Card className="p-12 text-center text-mu bg-light border-dashed">
        <p>Attendance tracking module is under construction.</p>
        <p className="text-sm mt-2">Filter by batch and date to view student attendance soon.</p>
      </Card>
    </div>
  )
}
