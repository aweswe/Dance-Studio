import { Suspense } from 'react';
import { createServerSupabase } from '@/lib/supabase/server';
import { SwitchRequestList } from '@/components/admin/switch-request-list';
import { TableSkeleton } from '@/components/ui/skeleton';

export default async function SwitchRequestsPage() {
  const supabase = await createServerSupabase();
  const { data: requests, error } = await supabase
    .from('batch_switch_requests')
    .select(
      `
      id,
      note,
      admin_note,
      status,
      created_at,
      resolved_at,
      student:student_id ( id, name, phone ),
      current_batch:current_batch_id ( name, days, time_start ),
      requested_batch:requested_batch_id ( name, days, time_start, programme:programme_id ( name ) )
    `,
    )
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-ink tracking-wide">Batch switch requests</h2>
        <p className="text-ink-2 font-body text-sm mt-1">
          Students request batch changes after enrolment — approve to move them on the roster.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
          Could not load switch requests: {error.message}. Ensure migration 0018 is applied on Supabase.
        </div>
      )}

      <Suspense fallback={<TableSkeleton rows={6} columns={4} />}>
        <SwitchRequestList initialRequests={(requests ?? []) as any[]} />
      </Suspense>
    </div>
  );
}
