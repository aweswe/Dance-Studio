import { Suspense } from 'react'
import { RentalCalendar } from '@/components/admin/rental-calendar'

export default function StudioRentalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-blk tracking-wide">Studio Rental</h2>
        <p className="text-mu font-body text-sm mt-1">Manage external studio bookings and internal time blocks.</p>
      </div>

      <Suspense fallback={<div>Loading calendar...</div>}>
        <RentalCalendar />
      </Suspense>
    </div>
  )
}
