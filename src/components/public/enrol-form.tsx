'use client';

import { useRef, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/lib/utils/constants';
import { enrolFormSchema } from '@/lib/validators/enrol';
import { formatCurrency, formatTime, whatsappLink } from '@/lib/utils/format';
import { Spinner } from '@/components/ui/skeleton';

const PAYMENTS_ENABLED = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

interface EnrolFormProps {
  programmes?: any[];
  batches?: any[];
  /** Programme slug to preselect (from ?programme= query param). */
  defaultProgramme?: string;
}

type FormStatus = 'editing' | 'submitting' | 'success' | 'error' | 'degraded';

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/** "Monday · Wednesday · 5:00 PM – 7:00 PM" */
function batchLabel(batch: any): string {
  const days = Array.isArray(batch?.days) ? batch.days.join(' · ') : (batch?.days ?? '');
  const time = batch?.time_start && batch?.time_end
    ? `${formatTime(batch.time_start)} – ${formatTime(batch.time_end)}`
    : '';
  return [days, time].filter(Boolean).join(' · ');
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function EnrolForm({ programmes = [], batches = [], defaultProgramme }: EnrolFormProps) {
  const preselected = programmes.find((p) => p.slug === defaultProgramme);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    programmeId: preselected?.id ?? '',
    batchId: '',
    name: '',
    email: '',
    phone: '',
  });
  const [status, setStatus] = useState<FormStatus>('editing');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState('');
  const settledRef = useRef(false);

  const selected = programmes.find((p) => p.id === formData.programmeId);
  const filteredBatches = batches.filter(
    (b) => b.programme?.slug === selected?.slug || b.programme_id === selected?.id,
  );
  const selectedBatch = batches.find((b) => b.id === formData.batchId);
  const phone = normalizePhone(formData.phone);

  const waMessage = [
    "Hi Rhythmzz! I'd like to book my free trial class.",
    `Name: ${formData.name}`,
    `Programme: ${selected?.name ?? ''}`,
    `Batch: ${batchLabel(selectedBatch)}`,
    `Phone: ${phone}`,
  ].join('\n');

  function setField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    const result = enrolFormSchema.safeParse({
      name: formData.name.trim(),
      phone,
      email: formData.email.trim(),
      programmeId: formData.programmeId,
      batchId: formData.batchId,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0] ?? '');
        if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrorMsg('');
    setStatus('submitting');

    const res = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        programmeId: formData.programmeId,
        batchId: formData.batchId,
        name: formData.name.trim(),
        phone,
        email: formData.email.trim(),
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      // 503 = keys missing on the server — fall back to WhatsApp booking.
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

    openRazorpayCheckout(data, result.data);
  }

  function openRazorpayCheckout(orderData: { order_id: string; amount: number }, payment: { name: string; email?: string }) {
    settledRef.current = false;

    const rzp = new (window as any).Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount * 100, // paise
      currency: 'INR',
      name: 'Rhythmzz Academy of Dance',
      description: `${selected?.name ?? 'Dance class'} — first month fees`,
      order_id: orderData.order_id,
      prefill: {
        name: payment.name,
        email: payment.email || undefined,
        contact: phone,
      },
      theme: { color: '#2BB4D8' },
      modal: {
        ondismiss: () => {
          // Fires on backdrop/Esc close — only reset if the payment didn't settle.
          if (!settledRef.current) setStatus('editing');
        },
      },
      handler: async (response: RazorpayResponse) => {
        settledRef.current = true;
        const verifyRes = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        if (verifyRes.ok) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMsg(
            'Your payment was received but verification failed. Please message us on WhatsApp — we will confirm your enrolment manually.',
          );
        }
      },
    });

    rzp.on('payment.failed', () => {
      settledRef.current = true;
      setStatus('error');
      setErrorMsg("Payment didn't go through. You can try again, or book on WhatsApp instead.");
    });

    rzp.open();
  }

  // ---------- Success screen ----------
  if (status === 'success') {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 max-w-lg mx-auto w-full text-center">
        <CheckCircle2 className="mx-auto mb-4 text-green" size={56} strokeWidth={1.5} />
        <h3 className="heading-display text-3xl text-blk mb-3">YOU&apos;RE IN!</h3>
        <p className="text-sm text-mu mb-2 leading-relaxed">
          Payment received — your batch is confirmed.
        </p>
        <p className="text-sm text-mu mb-8 leading-relaxed">
          Check WhatsApp on <span className="font-semibold text-blk">+91 90529 80859</span> for your
          student login link.
        </p>
        <a
          href={ROUTES.home}
          className="inline-block text-[11px] font-semibold tracking-[1.8px] uppercase px-8 py-3 bg-bl text-white hover:bg-[#22a0c4] transition-all"
        >
          Back to Home
        </a>
      </div>
    );
  }

  // ---------- WhatsApp degraded mode ----------
  if (status === 'degraded' || !PAYMENTS_ENABLED) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 max-w-lg mx-auto w-full">
        <h3 className="heading-display text-2xl text-blk mb-2">BOOK VIA WHATSAPP</h3>
        <p className="text-sm text-mu mb-6 leading-relaxed">
          Online payments are coming soon — book your free trial on WhatsApp instead.
          No registration fee.
        </p>
        <div className="bg-off rounded-lg p-4 text-sm text-mu mb-6 space-y-1">
          <p><span className="font-semibold text-blk">Name:</span> {formData.name || '—'}</p>
          <p><span className="font-semibold text-blk">Programme:</span> {selected?.name ?? '—'}</p>
          <p><span className="font-semibold text-blk">Batch:</span> {batchLabel(selectedBatch) || '—'}</p>
          <p><span className="font-semibold text-blk">Phone:</span> {phone || '—'}</p>
        </div>
        <a
          href={whatsappLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-[11px] font-semibold tracking-[1.8px] uppercase px-8 py-3.5 bg-green text-white hover:opacity-90 transition-all"
        >
          Book Your Free Trial on WhatsApp
        </a>
      </div>
    );
  }

  // ---------- Form ----------
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 max-w-lg mx-auto w-full">
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
              step >= s ? "bg-blk text-white" : "bg-off text-mu",
            )}>
              {s}
            </div>
            {s < 3 && <div className={cn("h-px w-10 sm:w-16 transition-colors", step > s ? "bg-blk" : "bg-off")} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        {step === 1 && (
          <div>
            <h3 className="heading-display text-2xl text-blk mb-4">Select Programme</h3>
            <select
              required
              className="w-full p-4 border border-black/10 rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors"
              value={formData.programmeId}
              onChange={(e) => setFormData((prev) => ({ ...prev, programmeId: e.target.value, batchId: '' }))}
            >
              <option value="">Choose a programme...</option>
              {programmes.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {selected && (
              <p className="text-xs text-mu mt-3">
                {formatCurrency(selected.fees_monthly)}/month · {formatCurrency(selected.fees_quarterly)}/quarter ·{' '}
                {selected.age_group}
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="heading-display text-2xl text-blk mb-4">Select Batch</h3>
            {filteredBatches.length > 0 ? (
              <select
                required
                className="w-full p-4 border border-black/10 rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors"
                value={formData.batchId}
                onChange={(e) => setField('batchId', e.target.value)}
              >
                <option value="">Choose a batch...</option>
                {filteredBatches.map((b) => (
                  <option key={b.id} value={b.id}>{batchLabel(b)}</option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-mu bg-off rounded-lg p-4">
                No active batches for this programme right now. Choose another programme or message us on WhatsApp.
              </p>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="heading-display text-2xl text-blk mb-4">Your Details</h3>
            <div className="bg-off rounded-lg p-4 text-xs text-mu mb-4 space-y-1">
              <p><span className="font-semibold text-blk">{selected?.name}</span> · {batchLabel(selectedBatch)}</p>
              {selected && (
                <p>First month: {formatCurrency(selected.fees_monthly)} — pay after your free trial class.</p>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  className={cn(
                    "w-full p-4 border rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors",
                    errors.name ? "border-red-400" : "border-black/10",
                  )}
                  value={formData.name}
                  onChange={(e) => setField('name', e.target.value)}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email Address (optional)"
                  className={cn(
                    "w-full p-4 border rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors",
                    errors.email ? "border-red-400" : "border-black/10",
                  )}
                  value={formData.email}
                  onChange={(e) => setField('email', e.target.value)}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number (10 digits)"
                  className={cn(
                    "w-full p-4 border rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors",
                    errors.phone ? "border-red-400" : "border-black/10",
                  )}
                  value={formData.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1.5">{errors.phone}</p>}
              </div>
            </div>
            {status === 'error' && (
              <div className="mt-4 flex gap-2.5 items-start bg-red-50 border border-red-200 rounded-lg p-4 text-xs text-red-700 leading-relaxed">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => { setStep(step - 1); setErrorMsg(''); }}
              className="text-[11px] font-semibold tracking-[1.8px] uppercase px-6 py-3 border border-black/20 text-blk hover:border-bl hover:text-bl transition-all"
            >
              Back
            </button>
          ) : <div />}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="text-[11px] font-semibold tracking-[1.8px] uppercase px-8 py-3 bg-bl text-white hover:bg-[#22a0c4] transition-all disabled:opacity-60 flex items-center gap-2"
          >
            {status === 'submitting' && <Spinner className="w-4 h-4" />}
            {step === 3 ? 'Confirm & Pay' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
}
