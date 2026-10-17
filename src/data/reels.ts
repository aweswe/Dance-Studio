import { getPublicSupabase } from '@/lib/supabase/public';
import { ACADEMY } from '@/lib/utils/constants';

export interface PublicReel {
  id: string;
  title: string;
  videoSrc: string;
  href: string;
  isPlaceholder?: boolean;
}

/** Static fallback when DB is empty or Supabase is not configured. */
export const FALLBACK_REELS: PublicReel[] = [
  { id: 'r1', title: 'VIP walk — Divya choreo', videoSrc: '/reels/r1.mp4', href: ACADEMY.socials.instagram },
  { id: 'r2', title: 'Maahi — studio routine', videoSrc: '/reels/r2.mp4', href: ACADEMY.socials.instagram },
  { id: 'r3', title: 'Maha Shivratri — classical offering', videoSrc: '/reels/r3.mp4', href: ACADEMY.socials.instagram },
  { id: 'r4', title: 'Choreo & song — studio cut', videoSrc: '/reels/r4.mp4', href: ACADEMY.socials.instagram },
  { id: 'r5', title: 'Freestyle popping', videoSrc: '/reels/r5.mp4', href: ACADEMY.socials.instagram },
  { id: 'r6', title: 'Lights, camera, naach! — bol mitthi with swag', videoSrc: '/reels/r6.mp4', href: ACADEMY.socials.instagram },
];

/**
 * Ensures the homepage reel strip always maintains exactly 6 reels:
 * - 0 reels in DB: Returns 6 default studio fallback reels.
 * - 1 reel uploaded: Returns 1 uploaded reel + 5 placeholders (total 6 reels).
 * - 2 reels uploaded: Returns 2 uploaded reels + 4 placeholders (total 6 reels).
 * - 3-5 reels uploaded: Supplements remaining slots with placeholders up to 6 reels.
 * - 6+ reels uploaded: Displays 6 uploaded reels with 0 placeholders.
 */
export function populateReelPlaceholders(
  uploadedReels: PublicReel[],
  fallbackReels: PublicReel[] = FALLBACK_REELS
): PublicReel[] {
  const uploadedCount = uploadedReels.length;
  if (uploadedCount === 0) return fallbackReels.slice(0, 6);

  const neededPlaceholders = Math.max(0, 6 - uploadedCount);

  if (neededPlaceholders > 0) {
    const placeholders: PublicReel[] = fallbackReels.slice(0, neededPlaceholders).map((fb, i) => ({
      ...fb,
      id: `placeholder-${fb.id}-${i}`,
      isPlaceholder: true,
    }));
    return [...uploadedReels, ...placeholders];
  }

  return uploadedReels.slice(0, 6);
}

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

    const uploadedReels: PublicReel[] = data.map((row, idx) => {
      let videoSrc = row.video_url;
      // Safeguard: Never stream raw MP4s from Supabase Storage CDN to prevent quota breach
      if (videoSrc && videoSrc.includes('supabase.co/storage/v1/object/public/reels/')) {
        videoSrc = `/reels/r${(idx % 6) + 1}.mp4`;
      }
      return {
        id: row.id,
        title: row.title,
        videoSrc: videoSrc || `/reels/r${(idx % 6) + 1}.mp4`,
        href: row.href || ACADEMY.socials.instagram,
      };
    });

    return populateReelPlaceholders(uploadedReels);
  } catch {
    return FALLBACK_REELS;
  }
}
