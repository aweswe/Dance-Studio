import { Suspense } from 'react'
import { RentalCalendar } from '@/components/admin/rental-calendar'
import { CardSkeleton } from '@/components/ui/skeleton'
import { createServerSupabase } from '@/lib/supabase/server'

export default async function StudioRentalPage() {
  const supabase = await createServerSupabase()
  const { data: rentals } = await supabase
    .from('studio_rentals')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-ink tracking-wide">Studio Rental</h2>
        <p className="text-ink-2 font-body text-sm mt-1">Review and confirm external studio booking requests.</p>
      </div>

      <Suspense fallback={<CardSkeleton />}>
        <RentalCalendar initialRentals={(rentals ?? []) as any[]} />
      </Suspense>
    </div>
  )
}
