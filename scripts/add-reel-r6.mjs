#!/usr/bin/env node
/** Upload public/reels/r6.mp4 and register as the 6th homepage reel. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function loadEnvLocal() {
  const envPath = path.join(root, '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const TITLE = 'Lights, camera, naach! — bol mitthi with swag';
const HREF = 'https://www.instagram.com/rhythmzzdance.live';
const local = path.join(root, 'public/reels/r6.mp4');

const headers = { apikey: key, Authorization: `Bearer ${key}` };

async function main() {
  if (!fs.existsSync(local)) {
    console.error(`Missing ${local}`);
    process.exit(1);
  }

  const existingRes = await fetch(
    `${url}/rest/v1/homepage_reels?select=id,title,sort_order&order=sort_order.asc`,
    { headers },
  );
  const existing = await existingRes.json();
  if (!Array.isArray(existing)) {
    console.error('Could not read homepage_reels:', existing);
    process.exit(1);
  }

  console.log(`Current reels (${existing.length}):`);
  for (const row of existing) console.log(`  ${row.sort_order}. ${row.title} (${row.id})`);

  if (existing.length >= 6) {
    console.error('All 6 slots full — delete or replace a reel in Admin → Reels first.');
    process.exit(1);
  }

  const sortOrder = existing.length > 0 ? Math.max(...existing.map((r) => r.sort_order)) + 1 : 1;
  const storagePath = `r6-bol-mitthi-${Date.now()}.mp4`;
  const body = fs.readFileSync(local);

  console.log(`Uploading ${local} → reels/${storagePath} (${(body.length / 1024 / 1024).toFixed(2)} MB)...`);

  const up = await fetch(`${url}/storage/v1/object/reels/${storagePath}`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'video/mp4', 'x-upsert': 'true' },
    body,
  });
  if (!up.ok) {
    console.error('Upload failed:', await up.text());
    process.exit(1);
  }

  const publicUrl = `${url}/storage/v1/object/public/reels/${storagePath}`;
  const ins = await fetch(`${url}/rest/v1/homepage_reels`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify({
      title: TITLE,
      video_url: publicUrl,
      storage_path: storagePath,
      href: HREF,
      sort_order: sortOrder,
      is_visible: true,
      width: 720,
      height: 1280,
    }),
  });

  const inserted = await ins.json();
  if (!ins.ok) {
    console.error('Insert failed:', inserted);
    await fetch(`${url}/storage/v1/object/reels/${storagePath}`, {
      method: 'DELETE',
      headers,
    });
    process.exit(1);
  }

  console.log(`Done — reel #${sortOrder} added: "${TITLE}"`);
  console.log(JSON.stringify(inserted, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
