"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadRazorpayScript, openRazorpayCheckout } from '@/lib/razorpay/checkout';

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
      <Button
        onClick={pay}
        disabled={busy}
        isLoading={busy}
        className="px-8 py-4 rounded"
      >
        {busy ? 'Opening payment…' : 'Pay Now'}
      </Button>
      {error && (
        <div className="flex gap-2 items-start bg-danger/10 border border-danger/30 rounded-lg p-3 text-xs text-danger leading-relaxed">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
