// Builds supabase/setup.sql from canonical migrations (0001–0016).
// Run: node scripts/build-setup-sql.js
const fs = require('fs');
const path = require('path');
const CM = 'supabase/migrations/';
const readCanon = (f) => fs.readFileSync(path.join(CM, f), 'utf8');

const header = `-- ════════════════════════════════════════════════════════════════
-- Rhythmzz Academy — Supabase setup (combined)
-- Generated from supabase/migrations/0001–0016. Do not edit by hand.
-- Run ONCE in Supabase Dashboard → SQL Editor → paste all → Run.
-- Safe to re-run: IF NOT EXISTS / DROP POLICY IF EXISTS / guards.
-- NEVER apply supabase/rhythmzz-supabase-backup/ (stale fees/slugs).
-- ════════════════════════════════════════════════════════════════

`;

const FILES = [
  '0001_create_tables.sql',
  '0002_create_indexes.sql',
  '0003_rls_policies.sql',
  '0004_features.sql',
  '0005_functions.sql',
  '0006_security.sql',
  '0007_auth_provisioning.sql',
  '0008_seed.sql',
  '0009_realtime.sql',
  '0010_fees.sql',
  '0011_grants.sql',
  '0012_payment_policies.sql',
  '0013_enquiries.sql',
  '0014_broadcast_queue.sql',
  '0015_integrity.sql',
  '0016_admin_attendance.sql',
];

// Postgres has no IF NOT EXISTS for triggers or policies.
const idempotize = (sql) =>
  sql
    .replace(/^CREATE TRIGGER (\w+) (.+?) ON ([\w.]+) (.+)$/gm,
      'DROP TRIGGER IF EXISTS $1 ON $3;\nCREATE TRIGGER $1 $2 ON $3 $4')
    .replace(/^CREATE POLICY (\w+) ON ([\w.]+) (.+)$/gm,
      'DROP POLICY IF EXISTS $1 ON $2;\nCREATE POLICY $1 ON $2 $3');

const out = idempotize(header + FILES.map(readCanon).join('\n\n'));
fs.writeFileSync('supabase/setup.sql', out);
console.log('written supabase/setup.sql,', out.length, 'bytes');
