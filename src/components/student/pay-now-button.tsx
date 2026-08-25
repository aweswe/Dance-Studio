"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { loadRazorpayScript, openRazorpayCheckout } from '@/lib/razorpay/checkout';
import { Spinner } from '@/components/ui/skeleton';

interface PayNowButtonProps {
  amount: number;
}

/** Pays the logged-in student's current month via Razorpay. */
export function PayNowButton({ amount }: PayNowButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function pay() {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}', // portal flow — the server derives the student + programme
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          res.status === 503 || data.error === 'PAYMENTS_UNAVAILABLE'
            ? 'Online payments are not configured yet. Please pay over WhatsApp.'
            : (data.message || data.error || 'Could not start the payment. Please try again.'),
        );
        setBusy(false);
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError('Could not load the payment window. Please try again.');
        setBusy(false);
        return;
      }

      openRazorpayCheckout({
        orderId: data.order_id,
        amount: data.amount,
        description: 'Monthly fee — Rhythmzz Academy of Dance',
        onSuccess: () => {
          setBusy(false);
          router.refresh();
        },
        onFailure: (message) => {
          setBusy(false);
          setError(message);
        },
        onDismiss: () => setBusy(false),
      });
    } catch {
      setBusy(false);
      setError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="flex flex-col gap-2 items-start">
      <button
        onClick={pay}
        disabled={busy}
        className="inline-flex items-center justify-center gap-2 bg-bl text-wh font-semibold text-[11px] tracking-[2px] uppercase px-8 py-4 rounded hover:bg-bl/90 transition-colors disabled:opacity-60"
      >
        {busy && <Spinner className="w-4 h-4" />}
        {busy ? 'Opening payment…' : 'Pay Now'}
      </button>
      {error && (
        <div className="flex gap-2 items-start bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 leading-relaxed">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
