// Builds supabase/setup.sql from the backup migrations + reference-corrected seed data.
// Run: node scripts/build-setup-sql.js
const fs = require('fs');
const path = require('path');
const M = 'supabase/rhythmzz-supabase-backup/migrations/';
const read = (f) => fs.readFileSync(path.join(M, f), 'utf8');

const header = `-- ════════════════════════════════════════════════════════════════
-- Rhythmzz Academy — Supabase setup (combined)
-- Run ONCE in Supabase Dashboard → SQL Editor → New query → paste all → Run.
-- Safe to re-run: everything is idempotent (IF NOT EXISTS / guards).
-- Seed data matches the locked reference: fees, ages, slugs, batch
-- windows, 7 FAQs, 3 testimonials. Programme/batch UUIDs mirror the
-- app's built-in defaults so enrol submissions stay consistent.
-- ════════════════════════════════════════════════════════════════

`;

const roleColumn = `-- Missing column: instructors.role (the app selects it)
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS role TEXT;

`;

const seed = `-- ══ Seed: programmes (reference fees & ages, fixed UUIDs = app defaults) ══
INSERT INTO programmes (id, name, slug, description, includes, fees_monthly, fees_quarterly, age_group, is_active, sort_order)
VALUES
  ('a1b2c3d4-4001-4000-8000-000000000001', 'Kids Dance', 'kids-dance', 'Bollywood, Hip Hop and Contemporary training for children aged 5 and above — technique, rhythm and stage confidence, taught step by step.', ARRAY['Bollywood & Hip Hop routines','Basic technique & rhythm training','Stage performance opportunities','Annual recital participation','Confidence & coordination building'], 2000, 5000, '5+ Years', true, 1),
  ('a1b2c3d4-4002-4000-8000-000000000002', 'Adults Dance', 'adults-dance', 'Bollywood, Hip Hop, Contemporary and choreography for adults aged 16 and above — from first steps to full performance pieces.', ARRAY['Bollywood choreography & trending tracks','Hip Hop foundations & isolation drills','Contemporary movement & expression','Freestyle & musicality development','No prior dance experience required'], 2500, 6500, '16+ Years', true, 2),
  ('a1b2c3d4-4003-4000-8000-000000000003', 'Mind & Body Fitness', 'mind-body-fitness', 'Zumba, Yoga, Pilates, HIIT and strength training — one hour every weekday morning to build stamina, flexibility and core strength.', ARRAY['Zumba — high-calorie-burn dance fitness','Hatha & Vinyasa Yoga for flexibility','Core conditioning & posture alignment','Breathwork & guided stress relief','Suitable for all fitness levels'], 2500, 6500, '16+ Years', true, 3),
  ('a1b2c3d4-4004-4000-8000-000000000004', 'Kuchipudi Classical', 'kuchipudi', 'Level-based classical Kuchipudi training — Foundation through Advanced — adavus, jathis, hastas and abhinaya taught the traditional way.', ARRAY['Structured curriculum: Foundation → Intermediate → Advanced','Adavus (basic steps) & Jathis (rhythmic patterns)','Asamyuta & Samyuta Hastas (hand gestures)','Abhinaya (facial expression & storytelling)','Stage performance & Arangetram preparation'], 2000, 5000, '5+ Years', true, 4)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, includes = EXCLUDED.includes,
  fees_monthly = EXCLUDED.fees_monthly, fees_quarterly = EXCLUDED.fees_quarterly,
  age_group = EXCLUDED.age_group, sort_order = EXCLUDED.sort_order;

-- ══ Seed: instructors (fixed UUIDs, guarded by name) ══
INSERT INTO instructors (id, name, role, bio, certifications, is_active)
SELECT v.* FROM (VALUES
  ('a1b2c3d4-5001-4000-8000-000000000001'::uuid, 'Nitish', 'Founder & Artistic Director', 'Founder of Rhythmzz Academy. 15+ years of teaching, 5,000+ students trained in Bollywood, Hip Hop and Contemporary. ISPTD-certified; represented India at the nATFEST International Contemporary Dance Festival, Sri Lanka 2017.', ARRAY['ISPTD Certified','nATFEST International Festival, Sri Lanka 2017','15+ Years Teaching Experience'], true),
  ('a1b2c3d4-5002-4000-8000-000000000002'::uuid, 'Deepak', 'Kids Dance Instructor', 'Leads the Kids Dance programme — Bollywood and Hip Hop fundamentals, choreography and stage confidence for children aged 5 and above. Mon–Wed, 5 to 7 PM.', ARRAY['Bollywood & Hip Hop Specialist'], true),
  ('a1b2c3d4-5003-4000-8000-000000000003'::uuid, 'Kajal', 'Kids Dance Instructor', 'Kids Dance instructor — 6 to 7 PM batch, Mon–Wed.', ARRAY['Kids Dance Specialist'], true),
  ('a1b2c3d4-5004-4000-8000-000000000004'::uuid, 'Pranith', 'Adults Dance Instructor', 'Adults Dance instructor — 8 to 9 PM batch, Mon–Wed.', ARRAY['Bollywood Choreography'], true),
  ('a1b2c3d4-5005-4000-8000-000000000005'::uuid, 'Shailaja', 'Mind & Body Fitness Instructor', 'Runs the Mind & Body Fitness programme — Zumba, Yoga, Pilates, HIIT and strength training every weekday morning, 9:30 to 10:30 AM.', ARRAY['Zumba Certified','Yoga Instructor'], true),
  ('a1b2c3d4-5006-4000-8000-000000000006'::uuid, 'Srusti', 'Kuchipudi Classical Instructor', 'Certified Kuchipudi instructor guiding students from Foundation to Advanced level through adavus, jathis, hastas and abhinaya. Fri–Sat, 6:30 to 7:30 PM.', ARRAY['Certified Kuchipudi Instructor'], true)
) AS v(id, name, role, bio, certifications, is_active)
WHERE NOT EXISTS (SELECT 1 FROM instructors i WHERE i.name = v.name);

-- ══ Seed: batches (reference windows, fixed UUIDs = app defaults) ══
INSERT INTO batches (id, name, programme_id, instructor_id, days, time_start, time_end, capacity, enrolled_count, status)
SELECT v.* FROM (VALUES
  ('a1b2c3d4-4101-4000-8000-000000000001'::uuid, 'Kids Dance · Mon–Wed 5–6 PM', 'a1b2c3d4-4001-4000-8000-000000000001'::uuid, 'a1b2c3d4-5002-4000-8000-000000000002'::uuid, ARRAY['Monday','Tuesday','Wednesday'], '17:00:00'::time, '18:00:00'::time, 25, 16, 'active'::batch_status),
  ('a1b2c3d4-4102-4000-8000-000000000002'::uuid, 'Kids Dance · Mon–Wed 6–7 PM', 'a1b2c3d4-4001-4000-8000-000000000001'::uuid, 'a1b2c3d4-5003-4000-8000-000000000003'::uuid, ARRAY['Monday','Tuesday','Wednesday'], '18:00:00'::time, '19:00:00'::time, 25, 15, 'active'::batch_status),
  ('a1b2c3d4-4103-4000-8000-000000000003'::uuid, 'Adults Dance · Mon–Wed 7–8 PM', 'a1b2c3d4-4002-4000-8000-000000000002'::uuid, 'a1b2c3d4-5001-4000-8000-000000000001'::uuid, ARRAY['Monday','Tuesday','Wednesday'], '19:00:00'::time, '20:00:00'::time, 30, 20, 'active'::batch_status),
  ('a1b2c3d4-4104-4000-8000-000000000004'::uuid, 'Adults Dance · Mon–Wed 8–9 PM', 'a1b2c3d4-4002-4000-8000-000000000002'::uuid, 'a1b2c3d4-5004-4000-8000-000000000004'::uuid, ARRAY['Monday','Tuesday','Wednesday'], '20:00:00'::time, '21:00:00'::time, 30, 14, 'active'::batch_status),
  ('a1b2c3d4-4105-4000-8000-000000000005'::uuid, 'Mind & Body Fitness · Mon–Fri 9:30–10:30 AM', 'a1b2c3d4-4003-4000-8000-000000000003'::uuid, 'a1b2c3d4-5005-4000-8000-000000000005'::uuid, ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday'], '09:30:00'::time, '10:30:00'::time, 25, 15, 'active'::batch_status),
  ('a1b2c3d4-4106-4000-8000-000000000006'::uuid, 'Kuchipudi · Fri–Sat 6:30–7:30 PM', 'a1b2c3d4-4004-4000-8000-000000000004'::uuid, 'a1b2c3d4-5006-4000-8000-000000000006'::uuid, ARRAY['Friday','Saturday'], '18:30:00'::time, '19:30:00'::time, 15, 8, 'active'::batch_status)
) AS v(id, name, programme_id, instructor_id, days, time_start, time_end, capacity, enrolled_count, status)
WHERE NOT EXISTS (SELECT 1 FROM batches b WHERE b.id = v.id);

-- ══ Seed: site content (stats + reference FAQs + testimonials) ══
-- Key names match the app's data layer: getStats() reads stats_% scalar rows,
-- getFAQs() reads 'faqs', getTestimonials() reads 'testimonials'.
DELETE FROM site_content WHERE content_key IN ('faq', 'stats'); -- drop any legacy keys
INSERT INTO site_content (content_key, content_value)
VALUES
  ('stats_students', '"5000+"'::jsonb),
  ('stats_years', '"15+"'::jsonb),
  ('stats_programmes', '"4"'::jsonb),
  ('stats_awards', '"3"'::jsonb),
  ('faqs', $json$[
    {"question": "Where are dance classes near Sainikpuri?", "answer": "Rhythmzz Academy of Dance is at Neredmet X Road Bus Stop, just 8 to 12 minutes from Sainikpuri by drive. We offer Kids Dance, Adults Dance, Mind and Body Fitness and Kuchipudi Classical. Call +91 90529 80859 to book a free trial."},
    {"question": "Is there a free trial class for dance classes in Secunderabad?", "answer": "Yes. Rhythmzz Academy of Dance offers one free trial class for all new students. No registration fee. Call or WhatsApp +91 90529 80859 to book your trial class."},
    {"question": "What are the dance class fees at Rhythmzz Academy?", "answer": "Kids Dance: 2000 rupees per month or 5000 rupees per quarter. Adults Dance: 2500 rupees per month or 6500 rupees per quarter. Mind and Body Fitness: 2500 rupees per month or 6500 rupees per quarter. Kuchipudi Classical: 2000 rupees per month or 5000 rupees per quarter. No registration fee."},
    {"question": "Does Rhythmzz offer Kuchipudi classes near AS Rao Nagar?", "answer": "Yes. Rhythmzz Academy of Dance offers certified Kuchipudi Classical Dance classes at Neredmet X Road, about 10 to 14 minutes from AS Rao Nagar. Classes run every Friday and Saturday 6:30 to 7:30 PM. Taught by Srusti, a certified Kuchipudi instructor."},
    {"question": "Are there Zumba classes near Neredmet?", "answer": "Yes. Rhythmzz Academy of Dance offers Zumba as part of the Mind and Body Fitness programme at Neredmet X Road, Secunderabad. Classes run Monday to Friday, 9:30 to 10:30 AM. 2500 rupees per month."},
    {"question": "Can I rent a dance studio in Secunderabad?", "answer": "Yes. Rhythmzz Academy of Dance offers studio rental at Neredmet X Road, Secunderabad. Rates are 1000 rupees per hour on weekdays and 1500 rupees per hour on weekends. The studio is fully air-conditioned with mirrors, a dance floor, and a sound system. WhatsApp +91 90529 80859 to check availability."},
    {"question": "Which areas does Rhythmzz Academy serve?", "answer": "Rhythmzz Academy of Dance at Neredmet X Road serves students from Sainikpuri, AS Rao Nagar, Yapral, Malkajgiri, Hastinapuri, Kapra and surrounding areas in Secunderabad and East Hyderabad. Most students are within 15 minutes by drive."}
  ]$json$::jsonb),
  ('testimonials', $json$[
    {"name": "Pooja Reddy", "quote": "Rhythmzz is more than a dance studio — it's a family. Nitish Sir's energy is contagious and the technique training is unmatched in Secunderabad.", "programme": "Adults Dance", "rating": 5},
    {"name": "Suresh & Deepa", "quote": "Our 7-year-old daughter was shy before joining the kids batch. Now she leads performances with absolute confidence. Truly grateful!", "programme": "Kids Dance", "rating": 5},
    {"name": "Ananya Sharma", "quote": "The Kuchipudi training under traditional guidance is rigorous yet so nurturing. Beautiful studio atmosphere and excellent discipline.", "programme": "Kuchipudi Classical", "rating": 5}
  ]$json$::jsonb)
ON CONFLICT (content_key) DO UPDATE SET content_value = EXCLUDED.content_value;

-- ══ Admin user — run AFTER creating the admin login in Authentication ══
-- In Supabase Dashboard: Authentication → Add user → Email + Password.
-- Then copy the new user's UUID and run:
--   INSERT INTO public.users (id, role) VALUES ('<paste-auth-uid>', 'admin')
--   ON CONFLICT (id) DO UPDATE SET role = 'admin';
`;

const realtime = `-- ══ Realtime: live updates for dashboards ══
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE attendance; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE fee_payments; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE studio_rentals; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE students; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
`;

// Postgres has no IF NOT EXISTS for triggers or policies, so make the
// migration statements re-runnable: drop-then-create per statement.
// Table names may be schema-qualified (storage.objects), hence [\w.].
const idempotize = (sql) =>
  sql
    .replace(/^CREATE TRIGGER (\w+) (.+?) ON ([\w.]+) (.+)$/gm,
      'DROP TRIGGER IF EXISTS $1 ON $3;\nCREATE TRIGGER $1 $2 ON $3 $4')
    .replace(/^CREATE POLICY (\w+) ON ([\w.]+) (.+)$/gm,
      'DROP POLICY IF EXISTS $1 ON $2;\nCREATE POLICY $1 ON $2 $3');

const out = idempotize(
  header +
    read('001_create_tables.sql') +
    '\n' +
    roleColumn +
    read('002_create_indexes.sql') +
    '\n' +
    read('003_rls_policies.sql') +
    '\n' +
    read('006_features.sql') + // adds batches.name before the seed inserts it
    '\n' +
    seed +
    read('005_functions.sql') +
    '\n' +
    realtime
);
fs.writeFileSync('supabase/setup.sql', out);
console.log('written supabase/setup.sql,', out.length, 'bytes');
