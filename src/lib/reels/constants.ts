export const MAX_HOMEPAGE_REELS = 6;
export const MAX_REEL_BYTES = 20 * 1024 * 1024;

export interface HomepageReelRow {
  id: string;
  title: string;
  video_url: string;
  storage_path: string | null;
  href: string;
  sort_order: number;
  is_visible: boolean;
  width: number | null;
  height: number | null;
}
