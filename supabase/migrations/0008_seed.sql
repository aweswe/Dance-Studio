-- ══ Seed: programmes (reference fees & ages, fixed UUIDs = app defaults) ══
INSERT INTO programmes (id, name, slug, description, includes, fees_monthly, fees_quarterly, age_group, is_active, sort_order)
VALUES
  ('a1b2c3d4-4001-4000-8000-000000000001', 'Kids Dance', 'kids-dance', 'Bollywood, Hip Hop and Contemporary training for children aged 5 and above — technique, rhythm and stage confidence, taught step by step.', ARRAY['Bollywood & Hip Hop routines','Basic technique & rhythm training','Stage performance opportunities','Annual recital participation','Confidence & coordination building'], 2000, 5000, '5+ Years', true, 1),
  ('a1b2c3d4-4002-4000-8000-000000000002', 'Adults Dance', 'adults-dance', 'Bollywood, Hip Hop, Contemporary and choreography for adults aged 13 and above — from first steps to full performance pieces.', ARRAY['Bollywood choreography & trending tracks','Hip Hop foundations & isolation drills','Contemporary movement & expression','Freestyle & musicality development','No prior dance experience required'], 2500, 6500, '13+ Years', true, 2),
  ('a1b2c3d4-4003-4000-8000-000000000003', 'Mind & Body Fitness', 'mind-body-fitness', 'Zumba, Yoga, Pilates, HIIT and strength training — one hour every weekday morning to build stamina, flexibility and core strength.', ARRAY['Zumba — high-calorie-burn dance fitness','Hatha & Vinyasa Yoga for flexibility','Core conditioning & posture alignment','Breathwork & guided stress relief','Suitable for all fitness levels'], 2500, 6500, '13+ Years', true, 3),
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
    {
        "name": "Vidya M",
        "quote": "Training with the fitness faculty here has been such a refreshing experience. They don't just count reps; they genuinely understand people, their bodies, their limitations, and their goals. What makes Rhythmzz stand out is their ability to push you beyond your comfort zone while still making you feel supported and confident. Her sessions are thoughtfully planned, never monotonous, and pay close attention to technique and form. I’ve noticed not just physical changes, but also a better sense of strength, discipline, and confidence.",
        "programme": "Adults Fitness & Dance · Secunderabad",
        "rating": 5,
        "category": "student",
        "highlight": "Fitness & Form"
    },
    {
        "name": "Meghna Menon",
        "quote": "Wonderful experience! The instructors are very good in their respective fields of dance and the management was very friendly, patient, and explained everything from A to Z. I joined here as a student and now it's been years of attending Rhythmzz — this has become more than a dance group for me, it's like my second home.",
        "programme": "Adults Dance · Secunderabad",
        "rating": 5,
        "category": "student",
        "highlight": "Second Home"
    },
    {
        "name": "A J",
        "quote": "Awesome experience at Rhythmzz! I enrolled my son when he was 5 and it's been a year now. I can see a real transformation in my child, slowly learning and growing. The studio looks great with an awesome instructor who has great bonding with kids and knows how to deal with children of different age groups. Classes start with proper warm-up and stretching exercises which helps them in dance. My son enjoys his dance class and productively uses his evening time instead of spending it on mobile or TV. Happy Mom and Happy Son!",
        "programme": "Parents · Kids Dance (Age 5)",
        "rating": 5,
        "category": "parent",
        "highlight": "Kids Confidence"
    },
    {
        "name": "Johannah Sparshica",
        "quote": "Rhythmzz Academy of Dance is really the best platform where you transform yourself — firstly with dance, then your personality and overall confidence! Lovely instructors, friendly people, various dance forms, the location is so convenient behind Neredmet bus stop, and the batch timings are very suitable. Loved it!",
        "programme": "Student · Dance & Personality",
        "rating": 5,
        "category": "student",
        "highlight": "Transformation"
    },
    {
        "name": "Datla Sowdeepya",
        "quote": "Classical dance classes are amazing! The instructor is very patient, meticulous with mudras and footwork, and ensures every student grasps the rhythmic nuances and padabhedas. Love dancing here every week.",
        "programme": "Classical Kathak · Secunderabad",
        "rating": 5,
        "category": "student",
        "highlight": "Classical Arts"
    },
    {
        "name": "Karimulla Baba Shaik",
        "quote": "Best academy to join. They maintain strict hygiene and safety precautions with clean wooden flooring. The faculties are very interactive, patient, and encouraging with beginners. Thank you Rhythmzz!",
        "programme": "Adults Dance · Studio Member",
        "rating": 5,
        "category": "student",
        "highlight": "Hygiene & Safety"
    },
    {
        "name": "Shruthi Saneri",
        "quote": "The best place to learn dance in Secunderabad! The instructors are more like family to me. I love the way they break down complex choreography into simple, digestible counts so anyone can pick it up with ease.",
        "programme": "Dance Student · Secunderabad",
        "rating": 5,
        "category": "student",
        "highlight": "Family Vibe"
    },
    {
        "name": "Priya Sharma",
        "quote": "Rhythmzz Academy of Dance is fantastic! My 7-year-old daughter is learning classical dance here, and the dedication and individual attention given to each child is remarkable. Her rhythm sense, stage confidence, and posture have improved tremendously. Highly recommend for kids!",
        "programme": "Parents · Kids Dance (Age 7)",
        "rating": 5,
        "category": "parent",
        "highlight": "Discipline"
    },
    {
        "name": "Rajesh Kumar",
        "quote": "Best dance studio in Sainikpuri. The infrastructure is top-notch with professional sprung wooden flooring and full-length mirrors. I joined the adult Zumba and weekend fitness batches, and the calorie burn and energy are incredible.",
        "programme": "Adults Fitness & Zumba · Sainikpuri",
        "rating": 5,
        "category": "student",
        "highlight": "High Energy"
    },
    {
        "name": "Ananya Reddy",
        "quote": "Amazing place to learn western and contemporary dance. The choreographers are very patient and professional. The studio ambience, acoustic sound system, and lighting make every rehearsal feel like a live stage performance.",
        "programme": "Western & Contemporary · Secunderabad",
        "rating": 5,
        "category": "student",
        "highlight": "Stage Ambience"
    },
    {
        "name": "Karthik Rao",
        "quote": "Joined for adult hip-hop and choreography classes. Great batches, well-structured curriculum, and very friendly desk management. The fee structure is very reasonable for the quality of training provided.",
        "programme": "Adults Hip-Hop & Choreography",
        "rating": 5,
        "category": "student",
        "highlight": "Urban Beats"
    },
    {
        "name": "Sneha Latha",
        "quote": "My son has been attending the kids' creative movement and Bollywood batch for 6 months now. His confidence has grown tremendously. The studio maintains high standards of discipline, child safety, and stage readiness.",
        "programme": "Parents · Kids Creative Movement",
        "rating": 5,
        "category": "parent",
        "highlight": "Stage Readiness"
    },
    {
        "name": "Vikramaditya Varma",
        "quote": "Professional management and exceptional training quality. The classical dance training here is authentic, rigorous, and deeply inspiring. Proud to have my children enrolled at Rhythmzz.",
        "programme": "Parents · Classical Dance Lineage",
        "rating": 5,
        "category": "parent",
        "highlight": "Authentic Lineage"
    },
    {
        "name": "Divya Nambiar",
        "quote": "The yoga and fitness sessions are extremely rejuvenating. Clean studio space, wonderful acoustics, and expert trainers who focus on proper posture, breathing, and flexibility.",
        "programme": "Yoga & Mind-Body Fitness",
        "rating": 5,
        "category": "student",
        "highlight": "Flexibility & Posture"
    },
    {
        "name": "Manish Gupta",
        "quote": "Used the studio rental for a professional choreography video shoot. The ambient DMX club lighting, sprung wooden floor, and 45-foot mirror array were perfect. The desk staff was punctual and very helpful.",
        "programme": "Studio Rental & Video Production",
        "rating": 5,
        "category": "student",
        "highlight": "Sprung Floor"
    },
    {
        "name": "Swathi Rao",
        "quote": "One of the finest dance academies in Secunderabad. Structured grading, transparent fee policies, and wonderful annual recitals organized for students to showcase their talent on real auditorium stages.",
        "programme": "Diploma Student · Secunderabad",
        "rating": 5,
        "category": "student",
        "highlight": "Annual Recitals"
    },
    {
        "name": "Rahul Varma",
        "quote": "Fantastic vibe! The instructors make even complete beginners feel comfortable. I started with zero dance experience and now I can comfortably groove in sync without feeling awkward or hesitant.",
        "programme": "Beginners Adults Dance · Sainikpuri",
        "rating": 5,
        "category": "student",
        "highlight": "Beginner Friendly"
    },
    {
        "name": "Meena Sundaram",
        "quote": "Exceptional academy! The classical training under traditional guru guidance is outstanding. My daughter loves going to class every single week and looks forward to every session.",
        "programme": "Parents · Classical Foundations",
        "rating": 5,
        "category": "parent",
        "highlight": "Traditional Art"
    },
    {
        "name": "Sandeep Goud",
        "quote": "Very well maintained studio near Neredmet X Road. Ample parking, air-conditioned practice rooms, and dedicated batch timings. Top marks for studio cleanliness, sound quality, and floor shock absorption!",
        "programme": "Adults Dance · Neredmet Studio",
        "rating": 5,
        "category": "student",
        "highlight": "Studio Acoustics"
    },
    {
        "name": "Nikhila Reddy",
        "quote": "The sibling discount plan made it very affordable for both my kids to learn dance together. Excellent customer service from the academy desk and very respectful trainers.",
        "programme": "Parents · Sibling Dance Package",
        "rating": 5,
        "category": "parent",
        "highlight": "Sibling Value"
    },
    {
        "name": "Tarun Sharma",
        "quote": "Top-class audio equipment and wooden flooring that absorbs impact properly. Safe on joints during rigorous jumps and turns. Best rehearsal space in the twin cities.",
        "programme": "Contemporary Dance · Rehearsal Member",
        "rating": 5,
        "category": "student",
        "highlight": "Joint Safety"
    },
    {
        "name": "Lavanya Prasad",
        "quote": "Very structured curriculum with regular progress updates and event participation opportunities. They actually teach dance technique rather than just random song steps.",
        "programme": "Parents · Kids Dance (Age 8)",
        "rating": 5,
        "category": "parent",
        "highlight": "Structured Learning"
    },
    {
        "name": "Naveen Kumar",
        "quote": "Joined the weekend adult batch. Great way to de-stress after a hectic work week. Highly skilled trainers, great crowd, and a welcoming community atmosphere.",
        "programme": "Weekend Adults Batch · Sainikpuri",
        "rating": 5,
        "category": "student",
        "highlight": "Stress Relief"
    },
    {
        "name": "Blue Stone",
        "quote": "Good place for all who love dancing to learn properly. Centrally located and easily reachable behind Neredmet X Road bus stop. Dedicated instructors round the clock from Monday to Friday with structured learning assured.",
        "programme": "Dance Member · Neredmet X Road",
        "rating": 4,
        "category": "student",
        "highlight": "Central Location"
    }
]$json$::jsonb)
ON CONFLICT (content_key) DO UPDATE SET content_value = EXCLUDED.content_value;

-- ══ Admin user — run AFTER creating the admin login in Authentication ══
-- In Supabase Dashboard: Authentication → Add user → Email + Password.
-- Then copy the new user's UUID and run:
--   INSERT INTO public.users (id, role) VALUES ('<paste-auth-uid>', 'admin')
--   ON CONFLICT (id) DO UPDATE SET role = 'admin';
