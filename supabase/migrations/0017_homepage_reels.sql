-- Homepage reels (max 6 portrait MP4s) + storage bucket + durable rate-limit hits

CREATE TABLE IF NOT EXISTS homepage_reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  storage_path TEXT,
  href TEXT NOT NULL DEFAULT 'https://www.instagram.com/rhythmzzdance.live',
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  width INT,
  height INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE homepage_reels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS homepage_reels_public_read ON homepage_reels;
CREATE POLICY homepage_reels_public_read ON homepage_reels FOR SELECT
  USING (is_visible = true OR public.get_user_role() = 'admin');

DROP POLICY IF EXISTS homepage_reels_admin_all ON homepage_reels;
CREATE POLICY homepage_reels_admin_all ON homepage_reels FOR ALL
  USING (public.get_user_role() = 'admin');

GRANT ALL ON TABLE public.homepage_reels TO anon, authenticated, service_role;

-- Portrait reel videos — admin uploads via service role (20 MB cap)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('reels', 'reels', true, 20971520, ARRAY['video/mp4'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS reels_storage_public_read ON storage.objects;
CREATE POLICY reels_storage_public_read ON storage.objects FOR SELECT
  USING (bucket_id = 'reels');

-- Durable rate-limit fallback (service role only — no public policies)
CREATE TABLE IF NOT EXISTS rate_limit_hits (
  id BIGSERIAL PRIMARY KEY,
  bucket_key TEXT NOT NULL,
  hit_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rate_limit_hits_key_time ON rate_limit_hits (bucket_key, hit_at DESC);

ALTER TABLE rate_limit_hits ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.rate_limit_hits TO service_role;
GRANT USAGE, SELECT ON SEQUENCE rate_limit_hits_id_seq TO service_role;
