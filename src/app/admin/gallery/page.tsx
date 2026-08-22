import { Suspense } from 'react'
import { GalleryManager } from '@/components/admin/gallery-manager'

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-blk tracking-wide">Gallery</h2>
        <p className="text-mu font-body text-sm mt-1">Upload, tag, and reorder photos displayed on the website.</p>
      </div>

      <Suspense fallback={<div>Loading gallery...</div>}>
        <GalleryManager />
      </Suspense>
    </div>
  )
}
