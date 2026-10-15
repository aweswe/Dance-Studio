-- Migration 0020: Supabase Keep-Alive Heartbeat
-- Creates a lightweight heartbeat table, touch function, and scheduled daily pg_cron job
-- to record daily database activity and prevent the 7-day free tier pause.

CREATE TABLE IF NOT EXISTS public.supabase_keepalive (
  id INT PRIMARY KEY DEFAULT 1,
  last_ping_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  ping_count BIGINT NOT NULL DEFAULT 1,
  source TEXT DEFAULT 'automated'
);

-- Insert singleton row if missing
INSERT INTO public.supabase_keepalive (id, last_ping_at, ping_count, source)
VALUES (1, timezone('utc'::text, now()), 1, 'initial_setup')
ON CONFLICT (id) DO NOTHING;

-- Function to touch the keepalive record
CREATE OR REPLACE FUNCTION public.touch_supabase_keepalive(p_source TEXT DEFAULT 'cron')
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_now TIMESTAMPTZ := timezone('utc'::text, now());
BEGIN
  INSERT INTO public.supabase_keepalive (id, last_ping_at, ping_count, source)
  VALUES (1, v_now, 1, p_source)
  ON CONFLICT (id) DO UPDATE
  SET
    last_ping_at = EXCLUDED.last_ping_at,
    ping_count = public.supabase_keepalive.ping_count + 1,
    source = EXCLUDED.source;

  RETURN v_now;
END;
$$;

-- Enable RLS
ALTER TABLE public.supabase_keepalive ENABLE ROW LEVEL SECURITY;

-- Allow public read of keepalive status
DROP POLICY IF EXISTS "Public can view keepalive status" ON public.supabase_keepalive;
CREATE POLICY "Public can view keepalive status"
  ON public.supabase_keepalive
  FOR SELECT
  TO public
  USING (true);

-- Schedule via pg_cron if pg_cron extension is available
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
  ) THEN
    -- Unschedule existing job if already created
    BEGIN
      PERFORM cron.unschedule('daily-supabase-keepalive');
    EXCEPTION WHEN OTHERS THEN
      -- No-op if didn't exist
    END;

    -- Run daily at 00:00 UTC (05:30 AM IST)
    PERFORM cron.schedule(
      'daily-supabase-keepalive',
      '0 0 * * *',
      'SELECT public.touch_supabase_keepalive(''pg_cron'');'
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- If pg_cron isn't enabled or permissions differ, fail gracefully
    RAISE NOTICE 'pg_cron schedule skipped: %', SQLERRM;
END $$;
