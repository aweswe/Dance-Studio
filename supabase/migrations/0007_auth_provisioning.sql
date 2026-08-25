-- ════════════════════════════════════════════════════════════════
-- 008_auth_provisioning.sql — keep public.users in sync with auth.users
--
-- Every role check in the app funnels through get_user_role(), which reads
-- public.users. Until now no trigger created that row, so any auth user
-- created outside the manual admin script (OTP sign-in, admin-created
-- student logins, Razorpay fulfilment) had no public.users row →
-- get_user_role() = NULL → treated as neither student nor admin.
-- This migration adds the standard Supabase handle_new_user trigger and
-- backfills every existing auth user.
-- ════════════════════════════════════════════════════════════════

-- Trigger function: create a student-role profile for every new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, role)
    VALUES (NEW.id, 'student')
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing auth users that have no public.users row yet
INSERT INTO public.users (id, role)
SELECT u.id, 'student'
FROM auth.users u
LEFT JOIN public.users pu ON pu.id = u.id
WHERE pu.id IS NULL;
