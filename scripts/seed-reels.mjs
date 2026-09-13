#!/usr/bin/env node
/** Upload public/reels/r1–r6.mp4 into homepage_reels + Supabase storage. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const titles = [
  'VIP walk — Divya choreo',
  'Maahi — studio routine',
  'Maha Shivratri — classical offering',
  'Choreo & song — studio cut',
  'Freestyle popping',
  'After Hours — Divya choreo',
];

const headers = { apikey: key, Authorization: `Bearer ${key}` };

async function main() {
  const existing = await fetch(`${url}/rest/v1/homepage_reels?select=id`, { headers });
  const rows = await existing.json();
  if (Array.isArray(rows) && rows.length > 0) {
    console.log(`Skipping — ${rows.length} reels already in DB`);
    return;
  }

  for (let i = 0; i < 6; i++) {
    const local = path.join(root, 'public/reels', `r${i + 1}.mp4`);
    if (!fs.existsSync(local)) {
      console.warn(`Missing ${local}, skip`);
      continue;
    }
    const storagePath = `seed-r${i + 1}-${Date.now()}.mp4`;
    const body = fs.readFileSync(local);

    const up = await fetch(`${url}/storage/v1/object/reels/${storagePath}`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'video/mp4', 'x-upsert': 'true' },
      body,
    });
    if (!up.ok) {
      console.error(`Upload failed r${i + 1}:`, await up.text());
      continue;
    }

    const publicUrl = `${url}/storage/v1/object/public/reels/${storagePath}`;
    const ins = await fetch(`${url}/rest/v1/homepage_reels`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({
        title: titles[i],
        video_url: publicUrl,
        storage_path: storagePath,
        href: 'https://www.instagram.com/rhythmzzdance.live',
        sort_order: i + 1,
        is_visible: true,
        width: 720,
        height: 1280,
      }),
    });
    console.log(`r${i + 1}: ${ins.ok ? 'OK' : await ins.text()}`);
  }
}

main().catch(console.error);
