const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runAllMigrations() {
  const uri = 'postgresql://postgres.lqywdvkeonegyhajsjvs:Insta007%40%40%40%40@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';
  
  const client = new Client({
    connectionString: uri,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('✅ Connected to Supabase PostgreSQL database.');

  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`Found ${files.length} migration files in supabase/migrations:\n`);

  const results = [];

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    const start = Date.now();

    try {
      await client.query(sql);
      const duration = Date.now() - start;
      console.log(`  ✅ [APPLIED] ${file} (${duration}ms)`);
      results.push({ file, status: 'APPLIED', duration });
    } catch (err) {
      console.log(`  ❌ [FAILED]  ${file} — Error: ${err.message}`);
      results.push({ file, status: 'FAILED', error: err.message });
    }
  }

  console.log('\n--- VERIFYING FINAL OBJECTS IN SUPABASE ---');

  // Verify all public tables
  const tablesRes = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);

  console.log(`Total public tables: ${tablesRes.rows.length}`);
  tablesRes.rows.forEach(r => console.log(`  • ${r.table_name}`));

  // Check supabase_keepalive table
  const keepaliveRes = await client.query(`
    SELECT * FROM public.supabase_keepalive LIMIT 1;
  `).catch(() => ({ rows: [] }));
  console.log(`\nsupabase_keepalive row:`, keepaliveRes.rows);

  await client.end();

  const failed = results.filter(r => r.status === 'FAILED');
  if (failed.length > 0) {
    console.log(`\n⚠️  ${failed.length} migration(s) failed.`);
    process.exit(1);
  } else {
    console.log(`\n🎉 ALL ${results.length} MIGRATION FILES SUCCESSFULLY APPLIED & VERIFIED!`);
  }
}

runAllMigrations().catch(err => {
  console.error('Migration runner error:', err);
  process.exit(1);
});
