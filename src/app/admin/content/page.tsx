import { Suspense } from 'react'
import { ContentEditor } from '@/components/admin/content-editor'
import { CardSkeleton } from '@/components/ui/skeleton'

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-blk tracking-wide">Website Content</h2>
        <p className="text-mu font-body text-sm mt-1">Update global stats, FAQ, and site-wide announcements.</p>
      </div>

      <Suspense fallback={<CardSkeleton />}>
        <ContentEditor />
      </Suspense>
    </div>
  )
}
