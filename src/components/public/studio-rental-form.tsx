'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/input';

export function StudioRentalForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTimeStart: '',
    preferredTimeEnd: '',
  });

  const setField = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/studio-rental', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      setLoading(false);
      setSuccess(true);
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-canvas-muted p-8 rounded-card text-center border border-green/20">
        <div className="w-16 h-16 bg-green/10 text-green rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="heading-display text-2xl mb-2">Request Received</h3>
        <p className="text-ink-2">We&apos;ll get back to you shortly to confirm your booking.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 text-[11px] font-bold uppercase tracking-wider text-bl-ink hover:text-bl transition-colors rounded-sm focus-visible:focus-ring"
        >
          Book Another Slot
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bento-card p-8 md:p-10 shadow-lg flex flex-col gap-5">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block mb-1">
          Instant Slot Request
        </div>
        <h3 className="heading-urban text-2xl sm:text-3xl text-ink mb-1">REQUEST A BOOKING</h3>
      </div>

      <Input
        label="Full Name"
        type="text"
        required
        value={form.name}
        onChange={setField('name')}
        placeholder="Enter your name"
      />

      <Input
        label="Phone Number"
        type="tel"
        required
        value={form.phone}
        onChange={setField('phone')}
        placeholder="Enter phone number"
      />

      <Input
        label="Email (optional)"
        type="email"
        value={form.email}
        onChange={setField('email')}
        placeholder="Enter email address"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Preferred Date"
          type="date"
          required
          value={form.preferredDate}
          onChange={setField('preferredDate')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Start Time"
          type="time"
          required
          value={form.preferredTimeStart}
          onChange={setField('preferredTimeStart')}
        />
        <Input
          label="End Time"
          type="time"
          required
          value={form.preferredTimeEnd}
          onChange={setField('preferredTimeEnd')}
        />
      </div>

      {error && (
        <p className="text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg p-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={cn(
          "btn-peach mt-2 py-4 text-xs font-black tracking-[2px] uppercase shadow-md cursor-pointer w-full",
          loading && "opacity-70 cursor-not-allowed",
        )}
      >
        {loading ? 'Submitting...' : 'Submit Request ──→'}
      </button>

      <p className="text-[10px] font-mono text-ink-3 text-center mt-1">
        Submitting this form does not charge your card. Our studio team will call to confirm slot availability.
      </p>
    </form>
  );
}
