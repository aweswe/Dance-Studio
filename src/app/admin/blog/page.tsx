import { Suspense } from 'react'
import { BlogEditor } from '@/components/admin/blog-editor'
import { ListRowSkeleton } from '@/components/ui/skeleton'
import { createServerSupabase } from '@/lib/supabase/server'

export default async function BlogPage() {
  const supabase = await createServerSupabase()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

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
        <BlogEditor initialPosts={(posts ?? []) as any[]} />
      </Suspense>
    </div>
  )
}
