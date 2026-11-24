-- 0023_phonepe_payments.sql
-- Add PhonePe Payment Gateway support to enum, orders, and fee records

-- 1. Safely add 'phonepe' to payment_source enum
DO $$
BEGIN
    ALTER TYPE payment_source ADD VALUE IF NOT EXISTS 'phonepe';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add PhonePe transaction tracking columns to payment_orders
ALTER TABLE payment_orders
    ADD COLUMN IF NOT EXISTS phonepe_transaction_id TEXT,
    ADD COLUMN IF NOT EXISTS gateway_provider TEXT DEFAULT 'phonepe';

CREATE INDEX IF NOT EXISTS idx_payment_orders_phonepe_txn
    ON payment_orders(phonepe_transaction_id);

CREATE INDEX IF NOT EXISTS idx_payment_orders_gateway_provider
    ON payment_orders(gateway_provider);

-- 3. Add PhonePe transaction ID to fee_payments
ALTER TABLE fee_payments
    ADD COLUMN IF NOT EXISTS phonepe_transaction_id TEXT;

CREATE INDEX IF NOT EXISTS idx_fee_payments_phonepe_txn
    ON fee_payments(phonepe_transaction_id);
