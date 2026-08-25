// Builds supabase/setup.sql from the backup migrations + reference-corrected seed data.
// Run: node scripts/build-setup-sql.js
const fs = require('fs');
const path = require('path');
const M = 'supabase/rhythmzz-supabase-backup/migrations/';
// Seed + realtime live in supabase/migrations/ (single source of truth — the
// same files `supabase db push` applies), so the bootstrap can never drift.
const CM = 'supabase/migrations/';
const read = (f) => fs.readFileSync(path.join(M, f), 'utf8');
const readCanon = (f) => fs.readFileSync(path.join(CM, f), 'utf8');

const header = `-- ════════════════════════════════════════════════════════════════
-- Rhythmzz Academy — Supabase setup (combined)
-- Run ONCE in Supabase Dashboard → SQL Editor → New query → paste all → Run.
-- Safe to re-run: everything is idempotent (IF NOT EXISTS / guards).
-- Seed data matches the locked reference: fees, ages, slugs, batch
-- windows, 7 FAQs, 3 testimonials. Programme/batch UUIDs mirror the
-- app's built-in defaults so enrol submissions stay consistent.
-- ════════════════════════════════════════════════════════════════

`;

// Drift fix for the live DB, where instructors predates the role column.
// Fresh databases get it via 0001_create_tables.sql directly.
const roleColumn = `-- Missing column: instructors.role (the app selects it)
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS role TEXT;

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
    readCanon('0008_seed.sql') +
    read('005_functions.sql') +
    '\n' +
    read('007_security.sql') + // RPC lockdown + gallery write policies
    '\n' +
    read('008_auth_provisioning.sql') + // auto-provision public.users for every auth user
    '\n' +
    readCanon('0010_fees.sql') + // fee ledger for_month + drop students.phone uniqueness
    '\n' +
    readCanon('0011_grants.sql') + // anon/authenticated/service_role table grants (platform parity)
    '\n' +
    readCanon('0012_payment_policies.sql') + // anon + student payment_orders policies (Razorpay)
    '\n' +
    readCanon('0013_enquiries.sql') + // public enquiries table + policies
    '\n' +
    readCanon('0014_broadcast_queue.sql') + // WhatsApp queue drained by cron
    '\n' +
    readCanon('0009_realtime.sql')
);
fs.writeFileSync('supabase/setup.sql', out);
console.log('written supabase/setup.sql,', out.length, 'bytes');
