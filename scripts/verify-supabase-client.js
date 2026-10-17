const { createClient } = require('@supabase/supabase-js');

async function testSupabase() {
  const url = 'https://lqywdvkeonegyhajsjvs.supabase.co';
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeXdkdmtlb25lZ3loYWpzanZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMjQwMTQsImV4cCI6MjEwNzgwMDAxNH0.Gcs4qA0p5XG6o6rRJfY6yRC9YazzwnR3M6BWgU-0gxM';
  const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeXdkdmtlb25lZ3loYWpzanZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjIyNDAxNCwiZXhwIjoyMTA3ODAwMDE0fQ.VAtHpZiBzaD4VvDvEaFbH3VZaDyZ1zsuYb2XL2DHMhg';

  console.log('--- TESTING PUBLIC ANON CLIENT ---');
  const anonClient = createClient(url, anonKey);

  const { data: progs, error: progErr } = await anonClient
    .from('programmes')
    .select('id, name, slug, is_active')
    .eq('is_active', true);

  if (progErr) {
    console.error('❌ Anon client programmes query failed:', progErr.message);
  } else {
    console.log(`✅ Anon client fetched ${progs.length} active programmes:`);
    progs.forEach(p => console.log(`   - ${p.name} (/${p.slug})`));
  }

  const { data: prods, error: prodErr } = await anonClient
    .from('products')
    .select('id, name, price, category')
    .eq('is_active', true);

  if (prodErr) {
    console.error('❌ Anon client products query failed:', prodErr.message);
  } else {
    console.log(`✅ Anon client fetched ${prods.length} active products:`);
    prods.slice(0, 3).forEach(p => console.log(`   - ${p.name} (₹${p.price}) [${p.category}]`));
  }

  console.log('\n--- TESTING SERVICE ROLE CLIENT ---');
  const adminClient = createClient(url, serviceKey);

  const { data: batches, error: batchErr } = await adminClient
    .from('batches')
    .select('id, name, capacity, enrolled_count, status');

  if (batchErr) {
    console.error('❌ Service role batches query failed:', batchErr.message);
  } else {
    console.log(`✅ Service role fetched ${batches.length} batches:`);
    batches.forEach(b => console.log(`   - ${b.name}: ${b.enrolled_count}/${b.capacity} (${b.status})`));
  }

  const { count: waitlistCount, error: waitErr } = await adminClient
    .from('batch_waitlist')
    .select('*', { count: 'exact', head: true });

  if (waitErr) {
    console.error('❌ Service role batch_waitlist query failed:', waitErr.message);
  } else {
    console.log(`✅ Service role verified batch_waitlist table accessible (count: ${waitlistCount})`);
  }

  console.log('\n--- VERIFYING ATOMIC STORED PROCEDURE ---');
  const { data: rpcRes, error: rpcErr } = await adminClient.rpc(
    'resolve_batch_switch_request_atomic',
    {
      p_request_id: '00000000-0000-0000-0000-000000000000',
      p_decision: 'approved'
    }
  );
  if (rpcErr) {
    console.error('❌ RPC execution failed:', rpcErr.message);
  } else {
    console.log('✅ RPC resolve_batch_switch_request_atomic executed successfully! Response:', rpcRes);
  }
}

testSupabase().catch(console.error);
