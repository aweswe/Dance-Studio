import { Suspense } from 'react'
import { BlogEditor } from '@/components/admin/blog-editor'
import { ListRowSkeleton } from '@/components/ui/skeleton'

export default function BlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-blk tracking-wide">Blog Posts</h2>
        <p className="text-mu font-body text-sm mt-1">Write and publish articles for the academy blog.</p>
      </div>

      <Suspense fallback={
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <ListRowSkeleton key={i} />
          ))}
        </div>
      }>
        <BlogEditor />
      </Suspense>
    </div>
  )
}
