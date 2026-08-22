import { Suspense } from 'react'
import { BlogEditor } from '@/components/admin/blog-editor'

export default function BlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-blk tracking-wide">Blog Posts</h2>
        <p className="text-mu font-body text-sm mt-1">Write and publish articles for the academy blog.</p>
      </div>

      <Suspense fallback={<div>Loading blog...</div>}>
        <BlogEditor />
      </Suspense>
    </div>
  )
}
