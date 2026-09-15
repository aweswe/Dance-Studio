'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatTime, formatCurrency } from '@/lib/utils/format';
import { Calendar, Clock, ArrowRightLeft, CreditCard, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { ACADEMY } from '@/lib/utils/constants';
import { loadRazorpayScript, openRazorpayCheckout } from '@/lib/razorpay/checkout';
import { joinWaitlist, requestBatchSwitch, cancelBatchSwitchRequest } from '@/actions/enrollment';

const PAYMENTS_ENABLED = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

export interface LiveBatch {
  id: string;
  name?: string | null;
  days: string[] | null;
  time_start: string | null;
  time_end: string | null;
  capacity: number;
  enrolled_count: number | null;
  status: string | null;
  programme_id: string;
}

export interface LiveProgramme {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  fees_monthly: number | null;
  image?: string;
  batches: LiveBatch[];
}

export interface PendingSwitchRequest {
  id: string;
  requested_batch_id: string;
  note: string | null;
  status: string;
  created_at: string;
}

const IMAGE_BY_SLUG: Record<string, string> = {
  kuchipudi: '/images/kuchipudi/kuchipudi-natyarambham-posture.jpg',
  'kids-dance': '/images/studio-training/group-circle-drill.jpg',
  'adults-dance': '/images/studio-training/contemporary-conditioning.jpg',
  'mind-body-fitness': '/images/studio-training/floorwork-stretch.jpg',
};

function spotsLeft(b: LiveBatch): number {
  return Math.max(0, (b.capacity || 0) - (b.enrolled_count || 0));
}

function isBatchFull(b: LiveBatch): boolean {
  return b.status === 'full' || spotsLeft(b) <= 0;
}

function batchTitle(b: LiveBatch): string {
  return b.name || `${(b.days || []).join(' · ')} ${formatTime(b.time_start || '')}`;
}

interface StudentClassesViewProps {
  currentStudent: {
    id?: string;
    batch_id?: string | null;
    batch?: { id?: string; days?: string[]; time_start?: string; time_end?: string } | null;
    programme?: { name?: string; slug?: string } | null;
  };
  feePaid?: boolean;
  programmes: LiveProgramme[];
  pendingSwitch?: PendingSwitchRequest | null;
}

export function StudentClassesView({ currentStudent, feePaid, programmes, pendingSwitch }: StudentClassesViewProps) {
  const router = useRouter();
  const currentBatchId = currentStudent?.batch_id || currentStudent?.batch?.id;
  const isEnrolled = Boolean(currentBatchId);

  const activeProgramme = programmes.find((p) => p.batches.some((b) => b.id === currentBatchId));
  const activeBatch = activeProgramme?.batches.find((b) => b.id === currentBatchId);

  const defaultProg = programmes.find((p) => p.batches.some((b) => !isBatchFull(b))) || programmes[0];
  const [selectedProgrammeId, setSelectedProgrammeId] = useState(defaultProg?.id || '');
  const selectedProgramme = programmes.find((p) => p.id === selectedProgrammeId) || defaultProg;
  const availableBatches = selectedProgramme?.batches.filter((b) => b.status !== 'paused') || [];
  const [selectedBatchId, setSelectedBatchId] = useState(() => availableBatches.find((b) => !isBatchFull(b))?.id || availableBatches[0]?.id || '');
  const selectedBatch = availableBatches.find((b) => b.id === selectedBatchId);

  const [switchBatchId, setSwitchBatchId] = useState('');
  const [switchNote, setSwitchNote] = useState('');
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const switchTargetProgrammes = useMemo(
    () => programmes.filter((p) => p.batches.some((b) => b.id !== currentBatchId && b.status !== 'paused')),
    [programmes, currentBatchId],
  );

  const requestedBatchLabel = useMemo(() => {
    if (!pendingSwitch) return null;
    for (const p of programmes) {
      const b = p.batches.find((x) => x.id === pendingSwitch.requested_batch_id);
      if (b) return `${p.name} · ${batchTitle(b)}`;
    }
    return 'Requested batch';
  }, [pendingSwitch, programmes]);

  async function handleEnrolPay() {
    if (!selectedProgramme || !selectedBatch) {
      setMessage({ type: 'err', text: 'Pick a programme and batch first.' });
      return;
    }
    if (isBatchFull(selectedBatch)) {
      setMessage({ type: 'err', text: 'This batch is full — join the waitlist instead.' });
      return;
    }

    if (!PAYMENTS_ENABLED) {
      window.open(ACADEMY.whatsapp, '_blank', 'noopener,noreferrer');
      setMessage({ type: 'err', text: 'Online pay is unavailable. We opened WhatsApp so you can enrol with the studio.' });
      return;
    }

    setBusy('pay');
    setMessage(null);
    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programmeId: selectedProgramme.id,
          batchId: selectedBatch.id,
          plan: 'monthly',
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage({
          type: 'err',
          text: data.message || data.error || 'Could not start payment. Try WhatsApp or contact the studio.',
        });
        setBusy('');
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setMessage({ type: 'err', text: 'Could not load the payment window.' });
        setBusy('');
        return;
      }

      openRazorpayCheckout({
        orderId: data.order_id,
        amount: data.amount,
        description: `Enrol — ${selectedProgramme.name}`,
        onSuccess: () => {
          setBusy('');
          router.refresh();
        },
        onFailure: (msg) => {
          setBusy('');
          setMessage({ type: 'err', text: msg });
        },
        onDismiss: () => setBusy(''),
      });
    } catch {
      setBusy('');
      setMessage({ type: 'err', text: 'Something went wrong. Please try again.' });
    }
  }

  async function handleWaitlist(batchId: string) {
    setBusy(`wait-${batchId}`);
    setMessage(null);
    const res = await joinWaitlist(batchId);
    setBusy('');
    if (res.success) {
      setMessage({ type: 'ok', text: 'You are on the waitlist. The studio will contact you when a spot opens.' });
    } else {
      setMessage({ type: 'err', text: res.error || 'Could not join waitlist.' });
    }
  }

  async function handleSwitchRequest() {
    if (!switchBatchId) {
      setMessage({ type: 'err', text: 'Choose the batch you want to switch to.' });
      return;
    }
    setBusy('switch');
    setMessage(null);
    const res = await requestBatchSwitch(switchBatchId, switchNote);
    setBusy('');
    if (res.success) {
      setSwitchNote('');
      setSwitchBatchId('');
      router.refresh();
    } else {
      setMessage({ type: 'err', text: res.error || 'Could not submit request.' });
    }
  }

  async function handleCancelSwitch() {
    if (!pendingSwitch) return;
    setBusy('cancel-switch');
    const res = await cancelBatchSwitchRequest(pendingSwitch.id);
    setBusy('');
    if (res.success) router.refresh();
    else setMessage({ type: 'err', text: res.error || 'Could not cancel request.' });
  }

  function selectProgramme(progId: string) {
    setSelectedProgrammeId(progId);
    const prog = programmes.find((p) => p.id === progId);
    const batches = prog?.batches.filter((b) => b.status !== 'paused') || [];
    const first = batches.find((b) => !isBatchFull(b)) || batches[0];
    setSelectedBatchId(first?.id || '');
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`flex gap-2 items-start rounded-xl border p-3 text-sm ${
            message.type === 'ok'
              ? 'border-success/30 bg-success/10 text-ink'
              : 'border-danger/30 bg-danger/10 text-danger'
          }`}
        >
          {message.type === 'ok' ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
          <span>{message.text}</span>
        </div>
      )}

      {isEnrolled && activeProgramme && activeBatch ? (
        <Card>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="blue">Your class</Badge>
              <Badge variant={feePaid ? 'green' : 'outline'} className={feePaid ? '' : 'border-danger text-danger'}>
                {feePaid ? 'Fees paid' : 'Fees due'}
              </Badge>
            </div>
            <h2 className="font-anton text-2xl md:text-3xl text-ink tracking-tight">{activeProgramme.name}</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-ink-2 pt-1">
              <span className="flex items-center gap-1.5 text-ink">
                <Calendar className="w-3.5 h-3.5 text-bl" strokeWidth={1.5} />
                {(activeBatch.days || []).join(', ')}
              </span>
              <span className="flex items-center gap-1.5 text-ink">
                <Clock className="w-3.5 h-3.5 text-bl" strokeWidth={1.5} />
                {formatTime(activeBatch.time_start || '')} – {formatTime(activeBatch.time_end || '')}
              </span>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="space-y-1 border-bl/30 bg-bl/5">
          <p className="text-sm font-semibold text-ink">Choose a class and pay once to enrol</p>
          <p className="text-sm text-ink-2">Pick a programme and batch below, then pay online. Your spot is confirmed after payment.</p>
        </Card>
      )}

      {pendingSwitch && (
        <Card className="border-bl/30 bg-bl/5 space-y-3">
          <div className="flex items-start gap-2">
            <ArrowRightLeft className="w-4 h-4 text-bl shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-ink">Switch request pending</p>
              <p className="text-sm text-ink-2 mt-1">
                You asked to move to <span className="font-medium text-ink">{requestedBatchLabel}</span>. The studio will confirm shortly.
              </p>
              {pendingSwitch.note && (
                <p className="text-xs text-ink-3 mt-1">Your note: {pendingSwitch.note}</p>
              )}
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" disabled={busy === 'cancel-switch'} onClick={handleCancelSwitch}>
            {busy === 'cancel-switch' ? 'Cancelling…' : 'Cancel request'}
          </Button>
        </Card>
      )}

      {isEnrolled && !pendingSwitch && (
        <Card className="space-y-4">
          <div>
            <h3 className="font-anton text-lg text-ink tracking-tight">Request a batch switch</h3>
            <p className="text-sm text-ink-2 mt-1">
              Already enrolled? Pick a new batch and send a request — the studio will approve the move.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-medium text-ink-2 block">Switch to</label>
            <select
              value={switchBatchId}
              onChange={(e) => setSwitchBatchId(e.target.value)}
              className="w-full min-h-11 rounded-xl border border-line bg-canvas-muted px-3 text-sm text-ink focus:outline-none focus:border-bl/50 focus:ring-2 focus:ring-bl/20"
            >
              <option value="">Select batch…</option>
              {switchTargetProgrammes.map((prog) => (
                <optgroup key={prog.id} label={prog.name}>
                  {prog.batches
                    .filter((b) => b.id !== currentBatchId && b.status !== 'paused')
                    .map((b) => (
                      <option key={b.id} value={b.id} disabled={isBatchFull(b)}>
                        {batchTitle(b)} · {formatTime(b.time_start || '')}–{formatTime(b.time_end || '')}
                        {isBatchFull(b) ? ' (Full)' : ''}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>

            <textarea
              value={switchNote}
              onChange={(e) => setSwitchNote(e.target.value)}
              placeholder="Optional note — e.g. timing conflict, level change…"
              rows={2}
              className="w-full rounded-xl border border-line bg-canvas-muted px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-bl/50 focus:ring-2 focus:ring-bl/20 resize-none"
            />

            <Button type="button" onClick={handleSwitchRequest} disabled={busy === 'switch' || !switchBatchId} isLoading={busy === 'switch'}>
              Submit switch request
            </Button>
          </div>
        </Card>
      )}

      <div>
        <h3 className="font-anton text-xl text-ink tracking-tight">
          {isEnrolled ? 'Other programmes & batches' : 'Programmes'}
        </h3>
        <p className="text-[12px] text-ink-3 mt-1">
          {isEnrolled ? 'Browse the full timetable.' : 'Select a batch, then enrol and pay.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programmes.map((prog) => {
          const enrolledHere = prog.batches.some((b) => b.id === currentBatchId);
          const isSelected = !isEnrolled && selectedProgrammeId === prog.id;

          return (
            <div
              key={prog.id}
              className={cn(
                'rounded-[20px] overflow-hidden border bg-surface-card shadow-lift flex flex-col',
                enrolledHere ? 'border-bl' : isSelected ? 'border-bl/60 ring-1 ring-bl/20' : 'border-line',
              )}
            >
              <button
                type="button"
                onClick={() => !isEnrolled && selectProgramme(prog.id)}
                className={cn('text-left', !isEnrolled && 'cursor-pointer')}
                disabled={isEnrolled}
              >
                <div className="relative h-44 w-full overflow-hidden outline outline-1 outline-black/10 dark:outline-white/10">
                  <Image
                    src={prog.image || IMAGE_BY_SLUG[prog.slug] || '/images/studio-training/group-circle-drill.jpg'}
                    alt={prog.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-surface-card/90 text-ink border border-line">
                      ₹{prog.fees_monthly}/mo
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-anton text-xl text-white tracking-tight">{prog.name}</p>
                  </div>
                </div>
              </button>

              <div className="p-5 space-y-4 flex-1">
                {prog.description && (
                  <p className="text-sm text-ink-2 leading-relaxed line-clamp-3">{prog.description}</p>
                )}
                {prog.batches.length > 0 ? (
                  <ul className="space-y-2">
                    {prog.batches.map((b) => {
                      const isYours = b.id === currentBatchId;
                      const full = isBatchFull(b);
                      const selected = !isEnrolled && selectedProgrammeId === prog.id && selectedBatchId === b.id;

                      return (
                        <li key={b.id}>
                          <button
                            type="button"
                            disabled={isEnrolled || b.status === 'paused'}
                            onClick={() => {
                              if (isEnrolled) return;
                              selectProgramme(prog.id);
                              setSelectedBatchId(b.id);
                            }}
                            className={cn(
                              'w-full text-left rounded-xl border px-3 py-2.5 text-sm transition-colors',
                              isYours ? 'border-bl bg-bl/5 text-ink' : selected ? 'border-bl bg-bl/5' : 'border-line text-ink-2',
                              !isEnrolled && b.status !== 'paused' && 'hover:border-bl/40 cursor-pointer',
                              (isEnrolled || b.status === 'paused') && 'cursor-default',
                            )}
                          >
                            <p className="font-medium text-ink">
                              {batchTitle(b)}
                              {isYours ? ' · Your batch' : ''}
                            </p>
                            <p className="text-[12px] text-ink-3 mt-0.5">
                              {formatTime(b.time_start || '')} – {formatTime(b.time_end || '')} ·{' '}
                              {full ? 'Full' : `${spotsLeft(b)} open`}
                            </p>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-ink-2">No batches published yet.</p>
                )}

                {!isEnrolled && isSelected && selectedBatch && (
                  <div className="pt-2 border-t border-line space-y-2">
                    <p className="text-xs text-ink-2">
                      First month: <span className="font-semibold text-ink">{formatCurrency(selectedProgramme?.fees_monthly || 0)}</span>
                    </p>
                    {isBatchFull(selectedBatch) ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={busy === `wait-${selectedBatch.id}`}
                        onClick={() => handleWaitlist(selectedBatch.id)}
                      >
                        {busy === `wait-${selectedBatch.id}` ? 'Joining…' : 'Join waitlist'}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className="w-full"
                        disabled={busy === 'pay'}
                        onClick={handleEnrolPay}
                      >
                        {busy === 'pay' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Opening payment…
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" /> Enrol & pay
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
