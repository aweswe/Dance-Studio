-- ══ Payment order policies: anon checkout + student portal checkout ══
-- payment_orders was admin-only. These open exactly the two checkout
-- paths the app needs:
--   • enrol flow (anonymous visitor): create an order with no student row
--   • student portal: a logged-in student pays their own month
-- Rows remain invisible to both roles (no SELECT policy) — the order id
-- travels in the Razorpay checkout, and fulfilment runs as service_role.

DROP POLICY IF EXISTS payment_orders_anon_insert ON payment_orders;
CREATE POLICY payment_orders_anon_insert ON payment_orders FOR INSERT TO anon
  WITH CHECK (student_id IS NULL);

DROP POLICY IF EXISTS payment_orders_student_insert ON payment_orders;
CREATE POLICY payment_orders_student_insert ON payment_orders FOR INSERT TO authenticated
  WITH CHECK (
    public.get_user_role() = 'student'
    AND (
      student_id IS NULL
      OR student_id = (SELECT id FROM students WHERE auth_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS payment_orders_student_update ON payment_orders;
CREATE POLICY payment_orders_student_update ON payment_orders FOR UPDATE TO authenticated
  USING (
    public.get_user_role() = 'student'
    AND student_id = (SELECT id FROM students WHERE auth_id = auth.uid())
  );
