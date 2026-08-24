import { Suspense } from 'react'
import { GalleryManager } from '@/components/admin/gallery-manager'
import { Skeleton } from '@/components/ui/skeleton'

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-blk tracking-wide">Gallery</h2>
        <p className="text-mu font-body text-sm mt-1">Upload, tag, and reorder photos displayed on the website.</p>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      }>
        <GalleryManager />
      </Suspense>
    </div>
  )
}
