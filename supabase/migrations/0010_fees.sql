-- ══ Fee ledger: monthly coverage ══
-- for_month marks which calendar month a payment covers. Backfill assumes
-- each historical payment covered its paid_at month (note when real data
-- needs correcting).
ALTER TABLE fee_payments ADD COLUMN IF NOT EXISTS for_month DATE NULL;
UPDATE fee_payments SET for_month = date_trunc('month', paid_at)::date WHERE for_month IS NULL;
CREATE INDEX IF NOT EXISTS idx_fee_payments_student_month ON fee_payments (student_id, for_month);

-- ══ Family-accounts prerequisite: drop phone uniqueness ══
-- Two siblings may share a parent's phone number. The non-unique
-- idx_students_phone (0002) already exists, so lookups stay fast.
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_phone_key;
