import { Suspense } from 'react'
import { RentalCalendar } from '@/components/admin/rental-calendar'
import { CardSkeleton } from '@/components/ui/skeleton'

export default function StudioRentalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-blk tracking-wide">Studio Rental</h2>
        <p className="text-mu font-body text-sm mt-1">Manage external studio bookings and internal time blocks.</p>
      </div>

      <Suspense fallback={<CardSkeleton />}>
        <RentalCalendar />
      </Suspense>
    </div>
  )
}
