import { Suspense } from 'react'
import { EnquiryList } from '@/components/admin/enquiry-list'
import { TableSkeleton } from '@/components/ui/skeleton'
import { createServerSupabase } from '@/lib/supabase/server'

export default async function EnquiriesPage() {
  const supabase = await createServerSupabase()
  const { data: enquiries } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-blk tracking-wide">Enquiries</h2>
        <p className="text-mu font-body text-sm mt-1">Messages from the website contact form.</p>
      </div>

      <Suspense fallback={<TableSkeleton rows={8} columns={5} />}>
        <EnquiryList initialEnquiries={(enquiries ?? []) as any[]} />
      </Suspense>
    </div>
  )
}
