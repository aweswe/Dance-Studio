-- ══ Realtime: live updates for dashboards ══
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE attendance; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE fee_payments; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE studio_rentals; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE students; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
