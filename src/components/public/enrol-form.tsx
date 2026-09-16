'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Calendar,
  Clock,
  CreditCard,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { homepageCtaBrand, homepageCtaOutlineLight, homepageCtaPairButton, homepageCtaWhatsApp } from '@/lib/ui/homepage-cta';
import { ACADEMY, enrolHref, type EnrolIntent, ROUTES } from '@/lib/utils/constants';
import { enrolFormSchema } from '@/lib/validators/enrol';
import { formatCurrency, formatTime, whatsappLink, normalizeIndianPhone } from '@/lib/utils/format';
import { loadRazorpayScript, openRazorpayCheckout } from '@/lib/razorpay/checkout';
import { submitEnrolLead } from '@/actions/enquiries';
import { Spinner } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

const PAYMENTS_ENABLED = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

interface EnrolFormProps {
  programmes?: any[];
  batches?: any[];
  defaultProgramme?: string;
  intent?: EnrolIntent;
}

type FormStatus = 'editing' | 'submitting' | 'success' | 'error' | 'lead';

function batchLabel(batch: any): string {
  const days = Array.isArray(batch?.days) ? batch.days.join(' · ') : (batch?.days ?? '');
  const time = batch?.time_start && batch?.time_end
    ? `${formatTime(batch.time_start)} – ${formatTime(batch.time_end)}`
    : '';
  return [days, time].filter(Boolean).join(' · ');
}

export function EnrolForm({
  programmes = [],
  batches = [],
  defaultProgramme,
  intent = 'trial',
}: EnrolFormProps) {
  const bookingMode: EnrolIntent = intent;
  const preselected = programmes.find((p) => p.slug === defaultProgramme) || programmes[0];

  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string>(preselected?.id ?? '');
  const selectedProgramme = programmes.find((p) => p.id === selectedProgrammeId) || programmes[0];

  const filteredBatches = batches.filter(
    (b) => b.programme?.slug === selectedProgramme?.slug || b.programme_id === selectedProgramme?.id,
  );

  const [selectedBatchId, setSelectedBatchId] = useState<string>(() => filteredBatches[0]?.id ?? '');
  const selectedBatch = batches.find((b) => b.id === selectedBatchId) || filteredBatches[0];

  const [childName, setChildName] = useState('');
  const [parentName, setParentName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<'monthly' | 'quarterly'>('monthly');

  const [status, setStatus] = useState<FormStatus>('editing');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState('');
  const settledRef = useRef(false);

  const normalizedPhone = normalizeIndianPhone(phone);
  const isPay = bookingMode === 'pay';

  const fee = plan === 'quarterly'
    ? (selectedProgramme?.fees_quarterly || (selectedProgramme?.fees_monthly ?? 2000) * 3)
    : (selectedProgramme?.fees_monthly ?? 2000);

  const waMessage = [
    isPay
      ? "Hi Rhythmzz! I'd like to enrol and pay."
      : "Hi Rhythmzz! I'd like to book a free trial class.",
    `Student: ${childName}`,
    parentName ? `Parent: ${parentName}` : null,
    age ? `Age: ${age}` : null,
    `Programme: ${selectedProgramme?.name ?? ''}`,
    `Batch: ${batchLabel(selectedBatch)}`,
    isPay ? `Plan: ${plan === 'quarterly' ? 'Quarterly' : 'Monthly'} (${formatCurrency(fee)})` : null,
    `Phone: ${normalizedPhone}`,
  ].filter(Boolean).join('\n');

  const upiLink = isPay && ACADEMY.upiId
    ? `upi://pay?pa=${encodeURIComponent(ACADEMY.upiId)}&pn=${encodeURIComponent(ACADEMY.name)}&am=${fee}&cu=INR`
    : null;

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

  async function saveLead(mode: EnrolIntent) {
    return submitEnrolLead({
      childName: childName.trim(),
      parentName: parentName.trim() || undefined,
      age: age.trim() || undefined,
      phone: normalizedPhone,
      email: email.trim() || undefined,
      programmeName: selectedProgramme?.name,
      batchLabel: batchLabel(selectedBatch),
      mode,
    });
  }

  async function handleEnrolSubmit(e: React.FormEvent) {
    e.preventDefault();

    const batchToUse = selectedBatchId || filteredBatches[0]?.id || '';

    const validation = enrolFormSchema.safeParse({
      childName: childName.trim(),
      parentName: parentName.trim(),
      age: age.trim(),
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
    setStatus('submitting');

    if (!isPay) {
      const lead = await saveLead('trial');
      if (!lead.success) {
        setStatus('error');
        setErrorMsg(lead.error || 'Could not save your request.');
        return;
      }
      window.open(whatsappLink(waMessage), '_blank');
      setStatus('lead');
      return;
    }

    try {
      await saveLead('pay');

      if (!PAYMENTS_ENABLED) {
        window.open(whatsappLink(waMessage), '_blank');
        setStatus('lead');
        return;
      }

      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programmeId: selectedProgrammeId || selectedProgramme?.id,
          batchId: batchToUse,
          name: childName.trim(),
          phone: normalizedPhone,
          email: email.trim(),
          plan,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 503 || data.error === 'PAYMENTS_UNAVAILABLE') {
          window.open(whatsappLink(waMessage), '_blank');
          setStatus('lead');
          return;
        }
        setStatus('error');
        setErrorMsg(data.message || data.error || 'Could not start payment. Please try again.');
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        window.open(whatsappLink(waMessage), '_blank');
        setStatus('lead');
        return;
      }

      settledRef.current = false;
      openRazorpayCheckout({
        orderId: data.order_id,
        amount: data.amount,
        description: `${selectedProgramme?.name ?? 'Dance Class'} — ${plan === 'quarterly' ? 'Quarter' : 'First month'}`,
        prefill: {
          name: validation.data.childName,
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

  if (status === 'success' || status === 'lead') {
    const paid = status === 'success';
    return (
      <div className="bg-surface p-8 md:p-10 rounded-md border border-line shadow-2xl max-w-lg mx-auto w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-green/15 text-green flex items-center justify-center mx-auto">
          {paid ? <CheckCircle2 size={32} /> : <MessageSquare size={28} />}
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[2px] text-green">
            {paid ? 'Payment confirmed' : 'Request saved'}
          </span>
          <h3 className="font-anton text-3xl sm:text-4xl text-ink tracking-wide">
            {paid ? 'WELCOME TO RHYTHMZZ' : 'WE HAVE YOUR DETAILS'}
          </h3>
          <p className="text-xs text-ink-2 leading-relaxed">
            {paid
              ? 'Your first month is paid. Sign in with this mobile number on the student portal. If login fails, WhatsApp us and we will enable portal access.'
              : isPay
                ? 'The academy has this enrolment. Finish payment on WhatsApp or UPI if checkout did not open, and we will confirm your batch.'
                : 'The academy has this enquiry. Finish on WhatsApp if the chat did not open, and we will confirm your trial slot.'}
          </p>
        </div>

        <div className="bg-canvas-muted rounded-md p-4 text-xs text-ink space-y-2 text-left border border-line">
          <div className="flex justify-between py-1 border-b border-line">
            <span className="text-ink-2">Student</span>
            <span className="font-medium">{childName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-line">
            <span className="text-ink-2">Programme</span>
            <span className="font-bold">{selectedProgramme?.name}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-ink-2">Schedule</span>
            <span className="font-semibold text-bl">{batchLabel(selectedBatch)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {paid ? (
            <a
              href={ROUTES.login}
              className={cn(homepageCtaBrand, homepageCtaPairButton)}
            >
              Sign in to student portal <ArrowRight size={16} />
            </a>
          ) : (
            <a
              href={whatsappLink(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(homepageCtaWhatsApp, homepageCtaPairButton)}
            >
              Continue on WhatsApp
            </a>
          )}
          <Link href={ROUTES.home} className="text-center text-xs font-semibold text-ink-2 py-2">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bento-card rounded-md sm:rounded-md border border-line p-6 md:p-8 shadow-xl max-w-xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-md border border-line bg-canvas px-3 py-2 text-[11px] font-mono font-bold uppercase tracking-wider text-ink">
          {isPay ? <CreditCard size={14} /> : <MessageSquare size={14} />}
          {isPay ? 'Enrol & pay' : 'Free trial · WhatsApp'}
        </div>
        {isPay && (
          <Link
            href={enrolHref({ programme: selectedProgramme?.slug, intent: 'trial' })}
            className="text-[11px] font-semibold text-ink-2 hover:text-ink underline-offset-4 hover:underline"
          >
            Prefer a free trial first?
          </Link>
        )}
      </div>

      <form onSubmit={handleEnrolSubmit} className="space-y-5" noValidate>
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-ink flex items-center justify-between">
            <span>1. Choose programme</span>
            {isPay && selectedProgramme && (
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
                    "p-3 rounded-md border text-left transition-all flex flex-col justify-between cursor-pointer",
                    isSelected ? "border-bl bg-bl/10 shadow-sm" : "border-line bg-canvas hover:border-line-strong"
                  )}
                >
                  <p className={cn("text-xs font-bold leading-tight", isSelected ? "text-bl" : "text-ink")}>{p.name}</p>
                  <p className="text-[10px] text-ink-2 mt-0.5">{p.age_group || 'Ask the desk'}</p>
                  {isPay && (
                    <p className="text-[11px] font-mono font-bold text-ink mt-2">{formatCurrency(p.fees_monthly)}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
            <Clock size={14} className="text-bl" />
            <span>2. Class timings</span>
          </label>
          {filteredBatches.length > 0 ? (
            <select
              value={selectedBatchId || filteredBatches[0]?.id}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full bg-canvas-muted border border-line rounded-md p-3 text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-bl cursor-pointer"
            >
              {filteredBatches.map((b) => (
                <option key={b.id} value={b.id}>{b.name || batchLabel(b)}</option>
              ))}
            </select>
          ) : (
            <p className="text-xs text-ink-2 bg-canvas-muted rounded-md p-3 border border-line">
              Batch timings confirmed on registration.
            </p>
          )}
          {selectedBatch && (
            <div className="p-2.5 rounded-md bg-canvas-muted/60 border border-line-subtle flex items-center justify-between text-[11px] text-ink-2">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-bl" /> {selectedBatch.days?.join(', ')}
              </span>
              <span>{formatTime(selectedBatch.time_start)} – {formatTime(selectedBatch.time_end)}</span>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-1">
          <label className="text-xs font-bold uppercase tracking-wider text-ink">3. Who is joining</label>
          <Input
            type="text"
            placeholder="Student / child full name"
            error={errors.childName}
            value={childName}
            onChange={(e) => {
              setChildName(e.target.value);
              if (errors.childName) setErrors((prev) => ({ ...prev, childName: '' }));
            }}
          />
          <Input
            type="text"
            placeholder="Parent / guardian name (if booking for a child)"
            error={errors.parentName}
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Age (optional)"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <Input
            type="tel"
            placeholder="Mobile number (WhatsApp)"
            error={errors.phone}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
            }}
          />
          <Input
            type="email"
            placeholder="Email (optional, for receipts)"
            error={errors.email}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
          />
        </div>

        {isPay && (
          <div className="flex gap-2">
            {(['monthly', 'quarterly'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlan(p)}
                className={cn(
                  'flex-1 py-2 rounded-md text-[11px] font-bold uppercase tracking-wider border',
                  plan === p ? 'border-bl bg-bl/10 text-bl' : 'border-line text-ink-2'
                )}
              >
                {p === 'monthly' ? 'Monthly' : 'Quarterly'}
              </button>
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="flex gap-2.5 items-start bg-danger/10 border border-danger/30 rounded-md p-3.5 text-xs text-danger leading-relaxed">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="pt-2 space-y-2">
          {isPay && PAYMENTS_ENABLED ? (
            <button
              type="submit"
              disabled={status === 'submitting'}
              className={cn(homepageCtaBrand, homepageCtaPairButton, 'cursor-pointer disabled:opacity-60')}
            >
              {status === 'submitting' ? (
                <><Spinner className="w-4 h-4" /> Processing...</>
              ) : (
                <><CreditCard size={16} /> Enrol &amp; pay ({formatCurrency(fee)})</>
              )}
            </button>
          ) : isPay ? (
            <button
              type="submit"
              disabled={status === 'submitting'}
              className={cn(homepageCtaBrand, homepageCtaPairButton, 'cursor-pointer disabled:opacity-60')}
            >
              {status === 'submitting' ? (
                <><Spinner className="w-4 h-4" /> Saving...</>
              ) : (
                <><CreditCard size={16} /> Save &amp; pay via WhatsApp ({formatCurrency(fee)})</>
              )}
            </button>
          ) : (
            <button
              type="submit"
              disabled={status === 'submitting'}
              className={cn(homepageCtaWhatsApp, homepageCtaPairButton, 'cursor-pointer disabled:opacity-60')}
            >
              {status === 'submitting' ? (
                <><Spinner className="w-4 h-4" /> Saving...</>
              ) : (
                <><MessageSquare size={16} /> Book free trial on WhatsApp</>
              )}
            </button>
          )}
          {upiLink && (
            <a
              href={upiLink}
              className={cn(homepageCtaOutlineLight, homepageCtaPairButton)}
            >
              Open UPI app ({formatCurrency(fee)})
            </a>
          )}
          <p className="text-[11px] font-mono text-center text-ink-3 mt-3">
            {isPay
              ? PAYMENTS_ENABLED
                ? 'Secure checkout · Portal login uses this mobile number'
                : 'We save the enrolment and open WhatsApp so you can pay the academy'
              : 'We save the trial request even if WhatsApp does not open'}
          </p>
        </div>
      </form>
    </div>
  );
}
