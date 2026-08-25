-- ══ Default grants (platform parity) ══
-- Supabase's hosted platform grants table privileges to anon/authenticated/
-- service_role by default; local `supabase start` does not. RLS still gates
-- every row, so this mirrors platform behaviour exactly and keeps local and
-- production equal. Functions are NOT included: 0006_security revokes and
-- regrants each RPC explicitly, and a blanket ROUTINES grant would undo it.
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
