import { Suspense } from 'react'
import { ContentEditor } from '@/components/admin/content-editor'
import { CardSkeleton } from '@/components/ui/skeleton'
import { createServerSupabase } from '@/lib/supabase/server'

export default async function ContentPage() {
  const supabase = await createServerSupabase()

  const { data: rows } = await supabase
    .from('site_content')
    .select('content_key, content_value')
    .in('content_key', ['banner', 'stats_students', 'stats_years', 'stats_programmes', 'stats_awards', 'faqs'])

  const byKey = new Map<string, any>((rows ?? []).map((r: any) => [r.content_key, r.content_value]))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-blk tracking-wide">Website Content</h2>
        <p className="text-mu font-body text-sm mt-1">Update global stats, FAQ, and site-wide announcements.</p>
      </div>

      <Suspense fallback={<CardSkeleton />}>
        <ContentEditor
          initialBanner={byKey.get('banner') ?? null}
          initialStats={{
            students: byKey.get('stats_students') ?? '5000+',
            years: byKey.get('stats_years') ?? '15+',
            programmes: byKey.get('stats_programmes') ?? '4',
            awards: byKey.get('stats_awards') ?? '3',
          }}
          initialFaqs={Array.isArray(byKey.get('faqs')) ? byKey.get('faqs') : []}
        />
      </Suspense>
    </div>
  )
}
