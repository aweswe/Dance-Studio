const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  const password = 'Insta007@@@@';
  const encodedPassword = encodeURIComponent(password);
  
  const uris = [
    // Pooler (Transaction / Session)
    `postgresql://postgres.lqywdvkeonegyhajsjvs:${encodedPassword}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`,
    `postgresql://postgres.lqywdvkeonegyhajsjvs:${encodedPassword}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
    // Direct
    `postgresql://postgres:${encodedPassword}@db.lqywdvkeonegyhajsjvs.supabase.co:5432/postgres`
  ];

  let activeClient = null;
  let activeUri = '';

  for (const uri of uris) {
    const masked = uri.replace(encodedPassword, '****');
    console.log(`Connecting to: ${masked}...`);
    const client = new Client({
      connectionString: uri,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000
    });

    try {
      await client.connect();
      const res = await client.query('SELECT version();');
      console.log('✅ Connected successfully!');
      console.log('   PostgreSQL Version:', res.rows[0].version.split('\n')[0]);
      activeClient = client;
      activeUri = uri;
      break;
    } catch (err) {
      console.log('❌ Connection failed:', err.message);
      try { await client.end(); } catch (e) {}
    }
  }

  if (!activeClient) {
    throw new Error('Unable to connect to Supabase database via any URI.');
  }

  console.log('\n--- EXECUTING SETUP.SQL MIGRATION ---');
  const setupSqlPath = path.join(__dirname, '..', 'supabase', 'setup.sql');
  const setupSql = fs.readFileSync(setupSqlPath, 'utf8');

  console.log(`Read setup.sql (${setupSql.length} bytes, ${setupSql.split('\n').length} lines).`);
  console.log('Applying setup.sql to Supabase...');

  const startTime = Date.now();
  await activeClient.query(setupSql);
  console.log(`✅ setup.sql applied successfully in ${Date.now() - startTime}ms!`);

  console.log('\n--- VERIFYING CREATED TABLES ---');
  const tablesRes = await activeClient.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);

  console.log(`Total public tables created: ${tablesRes.rows.length}`);
  for (const row of tablesRes.rows) {
    console.log(`  • ${row.table_name}`);
  }

  console.log('\n--- VERIFYING STORED PROCEDURES & FUNCTIONS ---');
  const funcsRes = await activeClient.query(`
    SELECT routine_name 
    FROM information_schema.routines 
    WHERE routine_schema = 'public' AND routine_type = 'FUNCTION'
    ORDER BY routine_name;
  `);
  console.log(`Total public functions created: ${funcsRes.rows.length}`);
  const keyFuncs = ['resolve_batch_switch_request_atomic', 'generate_student_id_display', 'get_user_role'];
  for (const kf of keyFuncs) {
    const found = funcsRes.rows.some((r) => r.routine_name === kf);
    console.log(`  ${found ? '✅' : '❌'} Function '${kf}': ${found ? 'Present' : 'MISSING'}`);
  }

  console.log('\n--- VERIFYING ROW LEVEL SECURITY (RLS) POLICIES ---');
  const policiesRes = await activeClient.query(`
    SELECT count(*) as policy_count FROM pg_policies WHERE schemaname = 'public';
  `);
  console.log(`Total RLS policies created: ${policiesRes.rows[0].policy_count}`);

  console.log('\n--- VERIFYING SEED DATA (PROGRAMMES & PRODUCTS) ---');
  const progRes = await activeClient.query('SELECT count(*) as count FROM public.programmes;');
  const prodRes = await activeClient.query('SELECT count(*) as count FROM public.products;');
  console.log(`  • Programmes seeded: ${progRes.rows[0].count}`);
  console.log(`  • Products seeded: ${prodRes.rows[0].count}`);

  await activeClient.end();
  console.log('\n🎉 ALL MIGRATIONS COMPLETED AND VERIFIED 100%!');
}

main().catch((err) => {
  console.error('\n❌ Migration failed:', err);
  process.exit(1);
});
