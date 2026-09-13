import { getPublicSupabase } from '@/lib/supabase/public';
import { ACADEMY } from '@/lib/utils/constants';

export interface PublicReel {
  id: string;
  title: string;
  videoSrc: string;
  href: string;
}

/** Static fallback when DB is empty or Supabase is not configured. */
const FALLBACK_REELS: PublicReel[] = [
  { id: 'r1', title: 'VIP walk — Divya choreo', videoSrc: '/reels/r1.mp4', href: ACADEMY.socials.instagram },
  { id: 'r2', title: 'Maahi — studio routine', videoSrc: '/reels/r2.mp4', href: ACADEMY.socials.instagram },
  { id: 'r3', title: 'Maha Shivratri — classical offering', videoSrc: '/reels/r3.mp4', href: ACADEMY.socials.instagram },
  { id: 'r4', title: 'Choreo & song — studio cut', videoSrc: '/reels/r4.mp4', href: ACADEMY.socials.instagram },
  { id: 'r5', title: 'Freestyle popping', videoSrc: '/reels/r5.mp4', href: ACADEMY.socials.instagram },
  { id: 'r6', title: 'After Hours — Divya choreo', videoSrc: '/reels/r6.mp4', href: ACADEMY.socials.instagram },
];

export async function getHomepageReels(limit = 6): Promise<PublicReel[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return FALLBACK_REELS;

  try {
    const { data, error } = await supabase
      .from('homepage_reels')
      .select('id, title, video_url, href')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })
      .limit(limit);

    if (error || !data?.length) return FALLBACK_REELS;

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      videoSrc: row.video_url,
      href: row.href || ACADEMY.socials.instagram,
    }));
  } catch {
    return FALLBACK_REELS;
  }
}
