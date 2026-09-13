#!/usr/bin/env node
/**
 * End-to-end smoke: public routes, auth gates, DB tables from migration 0017.
 */
const BASE = process.env.E2E_BASE || 'http://localhost:3000';

const PUBLIC_ROUTES = [
  '/',
  '/programmes',
  '/programmes/commercial-expressive',
  '/programmes/classical-dance',
  '/schedule',
  '/enrol',
  '/contact',
  '/gallery',
  '/blog',
  '/syllabus',
  '/syllabus/kuchipudi',
  '/syllabus/kathak',
  '/events',
  '/events/annual-day',
  '/studio-rental',
  '/about',
];

const PROTECTED = [
  { path: '/admin', expectRedirect: '/admin-login' },
  { path: '/student', expectRedirect: '/login' },
  { path: '/instructor', expectRedirect: '/admin-login' },
];

async function checkRoute(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual' });
  const ok = opts.expectRedirect
    ? res.status >= 300 && res.status < 400 && (res.headers.get('location') || '').includes(opts.expectRedirect)
    : res.status === 200;
  return { path, status: res.status, ok, location: res.headers.get('location') };
}

async function checkDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { skipped: true };

  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  const tables = ['homepage_reels', 'events', 'batches', 'programmes', 'broadcast_logs'];
  const counts = {};

  for (const table of tables) {
    const res = await fetch(`${url}/rest/v1/${table}?select=id&limit=1`, {
      headers: { ...headers, Prefer: 'count=exact' },
    });
    counts[table] = res.ok ? res.headers.get('content-range')?.split('/')[1] ?? '?' : `err:${res.status}`;
  }
  return { skipped: false, counts };
}

async function main() {
  console.log(`E2E smoke against ${BASE}\n`);

  let failed = 0;

  console.log('=== Public routes ===');
  for (const path of PUBLIC_ROUTES) {
    const r = await checkRoute(path);
    console.log(`${r.ok ? '✓' : '✗'} ${path} → ${r.status}`);
    if (!r.ok) failed++;
  }

  console.log('\n=== Auth gates ===');
  for (const { path, expectRedirect } of PROTECTED) {
    const r = await checkRoute(path, { expectRedirect });
    console.log(`${r.ok ? '✓' : '✗'} ${path} → ${r.status} ${r.location || ''}`);
    if (!r.ok) failed++;
  }

  console.log('\n=== Admin API pages (expect 200 when logged out — shell only) ===');
  for (const path of ['/admin/reels', '/admin/events', '/admin/classes']) {
    const r = await checkRoute(path, { expectRedirect: '/admin-login' });
    console.log(`${r.ok ? '✓' : '✗'} ${path} gated`);
    if (!r.ok) failed++;
  }

  console.log('\n=== Database ===');
  const db = await checkDb();
  if (db.skipped) {
    console.log('(skipped — no Supabase env in shell)');
  } else {
    for (const [t, c] of Object.entries(db.counts)) {
      console.log(`  ${t}: ${c} rows`);
    }
  }

  console.log(`\n${failed === 0 ? 'ALL PASS' : `${failed} FAILED`}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
