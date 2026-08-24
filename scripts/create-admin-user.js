// Creates the default admin auth user + public.users role row.
// Run: node scripts/create-admin-user.js
// Override with ADMIN_EMAIL / ADMIN_PASSWORD env vars.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Parse .env.local manually (no dotenv dependency)
const envPath = path.join(__dirname, '..', '.env.local');
const env = {};
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('.env.local missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const email = process.env.ADMIN_EMAIL || 'admin@rhythmzz.in';
const password = process.env.ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url');

async function main() {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let userId;
  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createErr) {
    if (createErr.message.includes('already')) {
      const { data: existing } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const found = existing?.users?.find((u) => u.email === email);
      if (!found) {
        console.error('User exists but not found by email:', createErr.message);
        process.exit(1);
      }
      userId = found.id;
      console.log('User already exists — reusing', email);
    } else {
      console.error('createUser failed:', createErr.message);
      process.exit(1);
    }
  } else {
    userId = created.user.id;
  }

  const { error: upsertErr } = await supabase
    .from('users')
    .upsert({ id: userId, role: 'admin' }, { onConflict: 'id' });
  if (upsertErr) {
    console.error('users upsert failed:', upsertErr.message);
    process.exit(1);
  }

  console.log('Admin ready:');
  console.log('  email:    ', email);
  console.log('  password: ', password);
  console.log('  role:      admin (users.id ' + userId + ')');
  console.log('Change the password in Supabase Dashboard → Authentication after first login.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
