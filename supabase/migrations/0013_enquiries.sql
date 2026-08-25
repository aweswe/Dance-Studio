-- Enquiries from the public contact form.
-- Anon visitors may submit (app-side rate limited); admins read/update via RLS.

CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  source TEXT DEFAULT 'contact_form',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE enquiries IS 'Public contact-form enquiries, managed by admins';
COMMENT ON COLUMN enquiries.status IS 'new | contacted | closed';

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS enquiries_anon_insert ON enquiries;
CREATE POLICY enquiries_anon_insert ON enquiries
  FOR INSERT TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS enquiries_admin_all ON enquiries;
CREATE POLICY enquiries_admin_all ON enquiries
  FOR ALL TO authenticated
  USING (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');

-- Helpers: admin contact list + dashboard pending feed.
CREATE INDEX IF NOT EXISTS idx_enquiries_status_created ON enquiries (status, created_at DESC);
