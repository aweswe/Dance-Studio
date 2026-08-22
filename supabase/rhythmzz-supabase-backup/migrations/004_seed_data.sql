-- 004_seed_data.sql

-- Insert Programmes
INSERT INTO programmes (id, name, slug, description, includes, fees_monthly, fees_quarterly, age_group, is_active, sort_order)
VALUES 
    (gen_random_uuid(), 'Kids Dance', 'kids-dance', 'Fun and energetic dance styles for children.', ARRAY['Hip Hop', 'Bollywood', 'Contemporary'], 1500, 4000, '5-12 years', true, 1),
    (gen_random_uuid(), 'Adults Dance', 'adults-dance', 'A variety of dance forms for adults to learn and enjoy.', ARRAY['Hip Hop', 'Bollywood', 'Salsa', 'Contemporary'], 2000, 5500, '13+ years', true, 2),
    (gen_random_uuid(), 'Mind & Body Fitness', 'mind-body-fitness', 'Fitness programs to keep you healthy and active.', ARRAY['Yoga', 'Zumba', 'Pilates'], 1800, 5000, 'All ages', true, 3),
    (gen_random_uuid(), 'Kuchipudi Classical', 'kuchipudi-classical', 'Traditional Indian classical dance form.', ARRAY['Foundation', 'Intermediate', 'Advanced Modules'], 2500, 7000, 'All ages', true, 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert Batches (assuming we don't have instructor IDs, setting to null, and linking to programmes via subqueries)
INSERT INTO batches (programme_id, days, time_start, time_end, capacity, status)
SELECT id, ARRAY['Monday', 'Wednesday', 'Friday'], '17:00:00', '18:00:00', 20, 'active'
FROM programmes WHERE slug = 'kids-dance';

INSERT INTO batches (programme_id, days, time_start, time_end, capacity, status)
SELECT id, ARRAY['Tuesday', 'Thursday', 'Saturday'], '18:30:00', '19:30:00', 25, 'active'
FROM programmes WHERE slug = 'adults-dance';

INSERT INTO batches (programme_id, days, time_start, time_end, capacity, status)
SELECT id, ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], '06:00:00', '07:00:00', 30, 'active'
FROM programmes WHERE slug = 'mind-body-fitness';

INSERT INTO batches (programme_id, days, time_start, time_end, capacity, status)
SELECT id, ARRAY['Saturday', 'Sunday'], '10:00:00', '12:00:00', 15, 'active'
FROM programmes WHERE slug = 'kuchipudi-classical';

-- Insert Site Content
INSERT INTO site_content (content_key, content_value)
VALUES 
    ('stats', '{"students_trained": 5000, "years_active": 15, "programmes_count": 4, "awards_count": 3}'::jsonb),
    ('banner', '{}'::jsonb),
    ('faq', '[
        {"question": "What age groups do you cater to?", "answer": "We have classes for kids (5-12 years) and adults (13+ years)."},
        {"question": "Do I need prior dance experience?", "answer": "Not at all! We have beginner classes for all programmes."},
        {"question": "How do I pay the fees?", "answer": "You can pay online via Razorpay or offline via Cash/UPI."},
        {"question": "Can I switch batches later?", "answer": "Yes, batch transfers are subject to availability."},
        {"question": "What is the dress code?", "answer": "Comfortable workout clothes and clean indoor shoes/barefoot depending on the style."},
        {"question": "Do you provide certificates?", "answer": "Yes, especially for our Kuchipudi Classical programme after completing modules."},
        {"question": "Is there a registration fee?", "answer": "There is a one-time registration fee of Rs. 500 for new students."}
    ]'::jsonb)
ON CONFLICT (content_key) DO UPDATE SET content_value = EXCLUDED.content_value;
