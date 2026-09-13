import { createAdminSupabase } from '@/lib/supabase/server';
import { ReelsManager } from '@/components/admin/reels-manager';
import type { HomepageReelRow } from '@/lib/reels/constants';

export default async function AdminReelsPage() {
  const admin = createAdminSupabase();
  const { data: items } = await admin
    .from('homepage_reels')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-ink tracking-wide">Homepage reels</h2>
        <p className="text-ink-2 text-sm mt-1">
          Watch the Movement strip — portrait MP4 only, six slots max.
        </p>
      </div>
      <ReelsManager initialItems={(items ?? []) as HomepageReelRow[]} />
    </div>
  );
}
