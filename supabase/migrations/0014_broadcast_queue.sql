-- WhatsApp broadcast queue.
-- sendBroadcast enqueues rows instead of sending synchronously; the Vercel
-- cron (/api/cron/broadcast, every 5 min) drains with retries (max 3 attempts).
-- Fee reminders (/api/cron/fee-reminders) reuse the same queue.

CREATE TABLE IF NOT EXISTS broadcast_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_phone TEXT NOT NULL,
  template_name TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  attempts INT DEFAULT 0,
  last_error TEXT,
  log_id UUID REFERENCES broadcast_logs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE broadcast_queue IS 'Outbound WhatsApp messages waiting to be sent by the cron drain';
COMMENT ON COLUMN broadcast_queue.status IS 'pending | sent | failed';
COMMENT ON COLUMN broadcast_queue.attempts IS 'Send attempts, up to 3, before the drain marks the row failed';

DROP TRIGGER IF EXISTS update_broadcast_queue_updated_at ON broadcast_queue;
CREATE TRIGGER update_broadcast_queue_updated_at BEFORE UPDATE ON broadcast_queue
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE broadcast_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS broadcast_queue_admin_all ON broadcast_queue;
CREATE POLICY broadcast_queue_admin_all ON broadcast_queue
  FOR ALL TO authenticated
  USING (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');

CREATE INDEX IF NOT EXISTS idx_broadcast_queue_status_created ON broadcast_queue (status, created_at);
