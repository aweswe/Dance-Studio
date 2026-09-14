'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { resolveBatchSwitchRequest } from '@/actions/enrollment';
import { formatDate, telLink } from '@/lib/utils/format';
import { ArrowRightLeft, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface SwitchRequestRow {
  id: string;
  note: string | null;
  admin_note: string | null;
  status: string;
  created_at: string;
  resolved_at: string | null;
  student: { id: string; name: string; phone: string | null } | null;
  current_batch: { name: string | null; days: string[] | null; time_start: string | null } | null;
  requested_batch: { name: string | null; days: string[] | null; time_start: string | null; programme?: { name: string } | null } | null;
}

function batchSummary(b: SwitchRequestRow['current_batch'], progName?: string | null) {
  if (!b) return '—';
  const days = Array.isArray(b.days) ? b.days.join(', ') : '';
  const label = b.name || days || 'Batch';
  return progName ? `${progName} · ${label}` : label;
}

function statusLabel(status: string, adminNote?: string | null) {
  if (status === 'declined' && adminNote === 'Cancelled by student') return 'CANCELLED';
  return status.toUpperCase();
}

export function SwitchRequestList({ initialRequests }: { initialRequests: SwitchRequestRow[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const requests = (initialRequests || []).filter((r) => filter === 'all' || r.status === 'pending');

  async function resolve(id: string, decision: 'approved' | 'declined') {
    setBusy((b) => ({ ...b, [id]: true }));
    setMessage(null);
    const res = await resolveBatchSwitchRequest(id, decision, notes[id]);
    setBusy((b) => ({ ...b, [id]: false }));
    if (res.success) {
      setMessage({
        type: 'ok',
        text: decision === 'approved' ? 'Switch approved — student moved to the new batch.' : 'Request declined.',
      });
      router.refresh();
    } else {
      setMessage({ type: 'err', text: res.error || 'Could not resolve request.' });
    }
  }

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`flex gap-2 items-start rounded-xl border p-3 text-sm ${
            message.type === 'ok'
              ? 'border-success/30 bg-success/10 text-ink'
              : 'border-danger/30 bg-danger/10 text-danger'
          }`}
        >
          {message.type === 'ok' ? (
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="flex gap-2">
        {(['pending', 'all'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors focus-visible:focus-ring active:scale-[0.98] ${
              filter === f ? 'bg-ink text-canvas border-ink' : 'border-line text-ink-2 hover:text-ink'
            }`}
          >
            {f === 'pending' ? 'Pending' : 'All'}
          </button>
        ))}
      </div>

      {requests.length === 0 ? (
        <Card className="text-sm text-ink-2">No switch requests{filter === 'pending' ? ' waiting' : ''}.</Card>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <Card key={r.id} className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-ink">{r.student?.name || 'Student'}</p>
                    <Badge variant={r.status === 'pending' ? 'gold' : r.status === 'approved' ? 'green' : 'default'}>
                      {statusLabel(r.status, r.admin_note)}
                    </Badge>
                  </div>
                  {r.student?.phone && (
                    <a href={telLink(r.student.phone)} className="inline-flex items-center gap-1 text-xs text-ink-2 hover:text-ink mt-1">
                      <Phone size={12} /> {r.student.phone}
                    </a>
                  )}
                  <p className="text-xs text-ink-3 mt-1">Requested {formatDate(r.created_at)}</p>
                </div>
                <ArrowRightLeft className="w-4 h-4 text-ink-3 shrink-0" />
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-line px-3 py-2 bg-canvas-muted/50">
                  <p className="text-[10px] uppercase tracking-wider text-ink-3 mb-1">Current</p>
                  <p className="text-ink">{batchSummary(r.current_batch)}</p>
                </div>
                <div className="rounded-xl border border-bl/30 px-3 py-2 bg-bl/5">
                  <p className="text-[10px] uppercase tracking-wider text-ink-3 mb-1">Requested</p>
                  <p className="text-ink">{batchSummary(r.requested_batch, r.requested_batch?.programme?.name)}</p>
                </div>
              </div>

              {r.note && <p className="text-sm text-ink-2">Student note: {r.note}</p>}
              {r.admin_note && r.status !== 'pending' && (
                <p className="text-xs text-ink-3">Admin note: {r.admin_note}</p>
              )}

              {r.status === 'pending' && (
                <div className="space-y-2 pt-1 border-t border-line">
                  <input
                    type="text"
                    value={notes[r.id] || ''}
                    onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                    placeholder="Optional note to student…"
                    className="w-full min-h-10 rounded-xl border border-line bg-canvas-muted px-3 text-sm text-ink placeholder:text-ink-3"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={busy[r.id]}
                      onClick={() => resolve(r.id, 'approved')}
                    >
                      Approve switch
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={busy[r.id]}
                      onClick={() => resolve(r.id, 'declined')}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
