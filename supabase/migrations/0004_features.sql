-- 006_features.sql
-- Batches display name, gallery storage bucket, student notices RLS.

-- 1. batches.name — display label rendered across the UI
ALTER TABLE batches ADD COLUMN IF NOT EXISTS name TEXT;

-- Backfill names for the seeded batches (fixed UUIDs = app defaults)
UPDATE batches b
SET name = v.name
FROM (VALUES
  ('a1b2c3d4-4101-4000-8000-000000000001'::uuid, 'Kids Dance · Mon–Wed 5–6 PM'),
  ('a1b2c3d4-4102-4000-8000-000000000002'::uuid, 'Kids Dance · Mon–Wed 6–7 PM'),
  ('a1b2c3d4-4103-4000-8000-000000000003'::uuid, 'Adults Dance · Mon–Wed 7–8 PM'),
  ('a1b2c3d4-4104-4000-8000-000000000004'::uuid, 'Adults Dance · Mon–Wed 8–9 PM'),
  ('a1b2c3d4-4105-4000-8000-000000000005'::uuid, 'Mind & Body Fitness · Mon–Fri 9:30–10:30 AM'),
  ('a1b2c3d4-4106-4000-8000-000000000006'::uuid, 'Kuchipudi · Fri–Sat 6:30–7:30 PM')
) AS v(id, name)
WHERE b.id = v.id AND b.name IS NULL;

-- 2. Gallery storage bucket (public read; admin uploads via server action)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('gallery', 'gallery', true, 10485760, ARRAY['image/jpeg','image/png','image/webp','video/mp4'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY gallery_storage_public_read ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY gallery_storage_authenticated_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery');
CREATE POLICY gallery_storage_authenticated_update ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'gallery');
CREATE POLICY gallery_storage_authenticated_delete ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery');

-- 3. Students can read broadcasts scoped to them (all / their programme / their batch)
CREATE POLICY broadcast_logs_students_read ON broadcast_logs FOR SELECT USING (
    public.get_user_role() = 'student'
    AND (
        recipients->>'scope' = 'all'
        OR (recipients->>'scope' = 'programme' AND (recipients->>'scopeId')::uuid IN (
            SELECT programme_id FROM students WHERE auth_id = (SELECT auth.uid()) AND programme_id IS NOT NULL
        ))
        OR (recipients->>'scope' = 'batch' AND (recipients->>'scopeId')::uuid IN (
            SELECT batch_id FROM students WHERE auth_id = (SELECT auth.uid()) AND batch_id IS NOT NULL
        ))
    )
);
