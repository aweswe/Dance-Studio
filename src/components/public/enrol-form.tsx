'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  CreditCard,
  Sparkles,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/lib/utils/constants';
import { enrolFormSchema } from '@/lib/validators/enrol';
import { formatCurrency, formatTime, whatsappLink, normalizeIndianPhone } from '@/lib/utils/format';
import { loadRazorpayScript, openRazorpayCheckout } from '@/lib/razorpay/checkout';
import { Spinner } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

const PAYMENTS_ENABLED = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

interface EnrolFormProps {
  programmes?: any[];
  batches?: any[];
  /** Programme slug to preselect (from ?programme= query param). */
  defaultProgramme?: string;
}

type FormStatus = 'editing' | 'submitting' | 'success' | 'error' | 'degraded';

function batchLabel(batch: any): string {
  const days = Array.isArray(batch?.days) ? batch.days.join(' · ') : (batch?.days ?? '');
  const time = batch?.time_start && batch?.time_end
    ? `${formatTime(batch.time_start)} – ${formatTime(batch.time_end)}`
    : '';
  return [days, time].filter(Boolean).join(' · ');
}

export function EnrolForm({ programmes = [], batches = [], defaultProgramme }: EnrolFormProps) {
  const preselected = programmes.find((p) => p.slug === defaultProgramme) || programmes[0];

  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string>(preselected?.id ?? '');
  const selectedProgramme = programmes.find((p) => p.id === selectedProgrammeId) || programmes[0];

  const filteredBatches = batches.filter(
    (b) => b.programme?.slug === selectedProgramme?.slug || b.programme_id === selectedProgramme?.id,
  );

  const [selectedBatchId, setSelectedBatchId] = useState<string>(() => filteredBatches[0]?.id ?? '');
  const selectedBatch = batches.find((b) => b.id === selectedBatchId) || filteredBatches[0];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bookingMode, setBookingMode] = useState<'pay' | 'trial'>('pay');

  const [status, setStatus] = useState<FormStatus>('editing');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState('');
  const settledRef = useRef(false);

  const normalizedPhone = normalizeIndianPhone(phone);

  const waMessage = [
    "Hi Rhythmzz! I'd like to book my free trial class.",
    `Name: ${name}`,
    `Programme: ${selectedProgramme?.name ?? ''}`,
    `Batch: ${batchLabel(selectedBatch)}`,
    `Phone: ${normalizedPhone}`,
  ].join('\n');

  // When programme changes, auto-select first batch of that programme
  function handleSelectProgramme(progId: string) {
    setSelectedProgrammeId(progId);
    const newProgramme = programmes.find((p) => p.id === progId);
    const newBatches = batches.filter(
      (b) => b.programme?.slug === newProgramme?.slug || b.programme_id === newProgramme?.id,
    );
    if (newBatches.length > 0) {
      setSelectedBatchId(newBatches[0].id);
    }
  }

  async function handleEnrolSubmit(e: React.FormEvent) {
    e.preventDefault();

    const batchToUse = selectedBatchId || filteredBatches[0]?.id || '';

    const validation = enrolFormSchema.safeParse({
      name: name.trim(),
      phone: normalizedPhone,
      email: email.trim(),
      programmeId: selectedProgrammeId || selectedProgramme?.id,
      batchId: batchToUse,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const field = String(issue.path[0] ?? '');
        if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setErrorMsg('');

    // If user selected Free Trial (Pay Later), redirect to WhatsApp with pre-filled message
    if (bookingMode === 'trial') {
      window.open(whatsappLink(waMessage), '_blank');
      return;
    }

    // Direct Online Enrolment + Instant Razorpay Payment
    setStatus('submitting');

    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programmeId: selectedProgrammeId || selectedProgramme?.id,
          batchId: batchToUse,
          name: name.trim(),
          phone: normalizedPhone,
          email: email.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 503 || data.error === 'PAYMENTS_UNAVAILABLE') {
          setStatus('degraded');
          return;
        }
        setStatus('error');
        setErrorMsg(data.message || data.error || 'Could not start payment. Please try again.');
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setStatus('degraded');
        return;
      }

      settledRef.current = false;
      openRazorpayCheckout({
        orderId: data.order_id,
        amount: data.amount,
        description: `${selectedProgramme?.name ?? 'Dance Class'} — First Month Fee`,
        prefill: {
          name: validation.data.name,
          email: validation.data.email || undefined,
          contact: normalizedPhone,
        },
        onSuccess: () => {
          settledRef.current = true;
          setStatus('success');
        },
        onFailure: (message) => {
          settledRef.current = true;
          setStatus('error');
          setErrorMsg(message);
        },
        onDismiss: () => {
          if (!settledRef.current) setStatus('editing');
        },
      });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Payment error occurred.');
    }
  }

  // ---------- Success Screen ----------
  if (status === 'success') {
    return (
      <div className="bg-surface p-8 md:p-10 rounded-2xl border border-line shadow-2xl max-w-lg mx-auto w-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 rounded-full bg-green/15 text-green flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <CheckCircle2 size={36} />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[2px] text-green">Payment Confirmed</span>
          <h3 className="heading-display text-3xl text-ink">WELCOME TO RHYTHMZZ!</h3>
          <p className="text-xs text-ink-2">
            Your enrolment is complete and your student dashboard is ready.
          </p>
        </div>

        <div className="bg-canvas-muted rounded-xl p-4 text-xs text-ink space-y-2 text-left border border-line-subtle">
          <div className="flex justify-between items-center py-1 border-b border-line-subtle">
            <span className="text-ink-2">Dance Programme:</span>
            <span className="font-bold text-ink">{selectedProgramme?.name}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-line-subtle">
            <span className="text-ink-2">Schedule:</span>
            <span className="font-semibold text-bl-ink">{batchLabel(selectedBatch)}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-ink-2">Student Name:</span>
            <span className="font-medium text-ink">{name}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <a
            href={ROUTES.student}
            className="w-full text-center text-xs font-semibold tracking-[1.5px] uppercase px-6 py-4 bg-bl text-white hover:bg-bl-deep transition-all rounded-xl shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Open Student Dashboard <ArrowRight size={16} />
          </a>
          <Link
            href={ROUTES.home}
            className="text-center text-xs font-semibold text-ink-2 hover:text-ink transition-colors py-2"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // ---------- WhatsApp Degraded Mode ----------
  if (status === 'degraded' || !PAYMENTS_ENABLED) {
    return (
      <div className="bg-surface p-8 rounded-2xl border border-line max-w-lg mx-auto w-full space-y-6">
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-full bg-green/15 text-green flex items-center justify-center mx-auto">
            <MessageSquare size={24} />
          </div>
          <h3 className="heading-display text-2xl text-ink">BOOK ON WHATSAPP</h3>
          <p className="text-xs text-ink-2 leading-relaxed">
            Reserve your free trial spot instantly on WhatsApp — no registration fee required.
          </p>
        </div>

        <div className="bg-canvas-muted rounded-xl p-4 text-xs text-ink-2 space-y-1.5 border border-line-subtle">
          <p><span className="font-semibold text-ink">Student:</span> {name || '—'}</p>
          <p><span className="font-semibold text-ink">Programme:</span> {selectedProgramme?.name ?? '—'}</p>
          <p><span className="font-semibold text-ink">Schedule:</span> {batchLabel(selectedBatch) || '—'}</p>
        </div>

        <a
          href={whatsappLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-xs font-semibold tracking-[1.5px] uppercase px-6 py-3.5 bg-green text-white hover:opacity-90 transition-all rounded-xl shadow-md active:scale-[0.98]"
        >
          Confirm Free Trial on WhatsApp
        </a>
      </div>
    );
  }

  // ---------- Single-View Streamlined Form ----------
  return (
    <div className="bg-surface p-6 md:p-8 rounded-2xl border border-line shadow-xl max-w-xl mx-auto w-full space-y-6">
      {/* Mode Switcher: Enrol Now vs Free Trial */}
      <div className="flex p-1 rounded-xl bg-canvas-muted border border-line text-xs font-semibold">
        <button
          type="button"
          onClick={() => setBookingMode('pay')}
          className={cn(
            "flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2",
            bookingMode === 'pay'
              ? "bg-bl text-white shadow-sm font-bold"
              : "text-ink-2 hover:text-ink"
          )}
        >
          <CreditCard size={14} /> Pay &amp; Enrol Online
        </button>
        <button
          type="button"
          onClick={() => setBookingMode('trial')}
          className={cn(
            "flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2",
            bookingMode === 'trial'
              ? "bg-surface text-ink border border-line shadow-sm font-bold"
              : "text-ink-2 hover:text-ink"
          )}
        >
          <Sparkles size={14} /> Book Free Trial (Pay Later)
        </button>
      </div>

      <form onSubmit={handleEnrolSubmit} className="space-y-5" noValidate>
        {/* 1. Select Dance Discipline */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-ink flex items-center justify-between">
            <span>1. Choose Programme</span>
            {selectedProgramme && (
              <span className="text-bl font-semibold">
                {formatCurrency(selectedProgramme.fees_monthly)}/month
              </span>
            )}
          </label>

          <div className="grid grid-cols-2 gap-2.5">
            {programmes.map((p) => {
              const isSelected = p.id === (selectedProgrammeId || selectedProgramme?.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectProgramme(p.id)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between",
                    isSelected
                      ? "border-bl bg-bl/10 shadow-sm"
                      : "border-line bg-canvas-muted hover:border-line-strong hover:bg-canvas-muted/80"
                  )}
                >
                  <div>
                    <p className={cn("text-xs font-bold leading-tight", isSelected ? "text-bl-ink" : "text-ink")}>
                      {p.name}
                    </p>
                    <p className="text-[10px] text-ink-2 mt-0.5">{p.age_group || 'All Ages'}</p>
                  </div>
                  <p className="text-[11px] font-bold text-ink mt-2">
                    {formatCurrency(p.fees_monthly)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Select Batch / Timing Slot */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
            <Clock size={14} className="text-bl" />
            <span>2. Select Class Timings</span>
          </label>

          {filteredBatches.length > 0 ? (
            <select
              value={selectedBatchId || filteredBatches[0]?.id}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full bg-canvas-muted border border-line rounded-xl p-3 text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-bl transition-all cursor-pointer"
            >
              {filteredBatches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name || batchLabel(b)}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-xs text-ink-2 bg-canvas-muted rounded-xl p-3 border border-line">
              Batch timings confirmed upon registration.
            </p>
          )}

          {selectedBatch && (
            <div className="p-2.5 rounded-lg bg-canvas-muted/60 border border-line-subtle flex items-center justify-between text-[11px] text-ink-2">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-bl" /> {selectedBatch.days?.join(', ')}
              </span>
              <span>
                {formatTime(selectedBatch.time_start)} – {formatTime(selectedBatch.time_end)}
              </span>
            </div>
          )}
        </div>

        {/* 3. Student Details (Minimal 2-3 fields) */}
        <div className="space-y-3 pt-1">
          <label className="text-xs font-bold uppercase tracking-wider text-ink">
            3. Student Information
          </label>

          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Full Name of Student"
              error={errors.name}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
            />

            <Input
              type="tel"
              placeholder="Mobile Number (e.g. 98888 12345 or +91)"
              error={errors.phone}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
              }}
            />

            <Input
              type="email"
              placeholder="Email Address (for official receipt, optional)"
              error={errors.email}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
            />
          </div>
        </div>

        {/* Error Notification */}
        {status === 'error' && (
          <div className="flex gap-2.5 items-start bg-danger/10 border border-danger/30 rounded-xl p-3.5 text-xs text-danger leading-relaxed">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {bookingMode === 'pay' ? (
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full text-xs font-semibold tracking-[1.5px] uppercase py-4 bg-bl text-white hover:bg-bl-deep transition-all rounded-xl shadow-lg active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {status === 'submitting' ? (
                <>
                  <Spinner className="w-4 h-4" /> Processing...
                </>
              ) : (
                <>
                  <CreditCard size={16} /> Enrol &amp; Pay Online ({formatCurrency(selectedProgramme?.fees_monthly ?? 2000)})
                </>
              )}
            </button>
          ) : (
            <button
              type="submit"
              className="w-full text-xs font-semibold tracking-[1.5px] uppercase py-4 bg-green text-white hover:opacity-95 transition-all rounded-xl shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} /> Confirm Free Trial on WhatsApp &rarr;
            </button>
          )}

          <p className="text-[11px] text-center text-ink-2 mt-2.5 flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} className="text-green" /> 100% Secure Checkout · Instant Student Portal Access
          </p>
        </div>
      </form>
    </div>
  );
}
