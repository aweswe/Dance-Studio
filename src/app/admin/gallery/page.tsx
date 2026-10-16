import { Suspense } from 'react';
import { GalleryManager } from '@/components/admin/gallery-manager';
import { Skeleton } from '@/components/ui/skeleton';
import { createAdminSupabase } from '@/lib/supabase/server';
import { ALL_AUTHENTIC_GALLERY_IMAGES } from '@/data/gallery';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const supabase = createAdminSupabase();
  const { data: items } = await supabase
    .from('gallery')
    .select('*')
    .order('sort_order', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-ink tracking-wide">Gallery</h2>
        <p className="text-ink-2 font-body text-sm mt-1">
          Upload, manage, and view all website photos across your database and curated studio archives.
        </p>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-md" />
          ))}
        </div>
      }>
        <GalleryManager 
          initialItems={(items ?? []) as any[]} 
          archiveItems={ALL_AUTHENTIC_GALLERY_IMAGES}
        />
      </Suspense>
    </div>
  );
}
