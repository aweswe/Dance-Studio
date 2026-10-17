const { Client } = require('pg');

async function audit() {
  const client = new Client({
    connectionString: 'postgresql://postgres.lqywdvkeonegyhajsjvs:Insta007%40%40%40%40@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);

  console.log('--- ALL 26 LIVE SUPABASE TABLES ---');
  for (const r of res.rows) {
    try {
      const countRes = await client.query('SELECT count(*) FROM public.' + r.table_name);
      console.log('  ✓ ' + r.table_name.padEnd(26) + ' -> Rows: ' + countRes.rows[0].count);
    } catch (e) {
      console.log('  ✓ ' + r.table_name.padEnd(26) + ' -> (RLS / Protected: ' + e.message + ')');
    }
  }

  // Check functions
  const funcRes = await client.query(`
    SELECT routine_name 
    FROM information_schema.routines 
    WHERE routine_schema = 'public' AND routine_type = 'FUNCTION'
    ORDER BY routine_name;
  `);
  console.log('\n--- FUNCTIONS IN PUBLIC SCHEMA (' + funcRes.rows.length + ' total) ---');
  for (const f of funcRes.rows) {
    console.log('  ✓ ' + f.routine_name);
  }

  // Check triggers
  const trigRes = await client.query(`
    SELECT trigger_name, event_object_table 
    FROM information_schema.triggers 
    WHERE trigger_schema = 'public'
    ORDER BY event_object_table, trigger_name;
  `);
  console.log('\n--- TRIGGERS IN PUBLIC SCHEMA (' + trigRes.rows.length + ' total) ---');
  for (const t of trigRes.rows) {
    console.log('  ✓ ' + t.trigger_name + ' on ' + t.event_object_table);
  }

  await client.end();
}

audit().catch(console.error);
