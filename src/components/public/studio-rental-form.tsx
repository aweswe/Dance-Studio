'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

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
      <div className="bg-light p-8 rounded-2xl text-center border border-green/20">
        <div className="w-16 h-16 bg-green/10 text-green rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="heading-display text-2xl mb-2">Request Received</h3>
        <p className="text-mu">We&apos;ll get back to you shortly to confirm your booking.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 text-[11px] font-bold uppercase tracking-wider text-bl"
        >
          Book Another Slot
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 flex flex-col gap-5">
      <h3 className="heading-display text-2xl mb-2">Request a Booking</h3>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-blk mb-2">Full Name</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={setField('name')}
          className="w-full p-4 border border-black/10 rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-blk mb-2">Phone Number</label>
        <input
          type="tel"
          required
          value={form.phone}
          onChange={setField('phone')}
          className="w-full p-4 border border-black/10 rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors"
          placeholder="Enter phone number"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-blk mb-2">Email <span className="text-mu normal-case">(optional)</span></label>
        <input
          type="email"
          value={form.email}
          onChange={setField('email')}
          className="w-full p-4 border border-black/10 rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors"
          placeholder="Enter email address"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-blk mb-2">Preferred Date</label>
          <input
            type="date"
            required
            value={form.preferredDate}
            onChange={setField('preferredDate')}
            className="w-full p-4 border border-black/10 rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-blk mb-2">Start Time</label>
          <input
            type="time"
            required
            value={form.preferredTimeStart}
            onChange={setField('preferredTimeStart')}
            className="w-full p-4 border border-black/10 rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-blk mb-2">End Time</label>
          <input
            type="time"
            required
            value={form.preferredTimeEnd}
            onChange={setField('preferredTimeEnd')}
            className="w-full p-4 border border-black/10 rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={cn(
          "mt-4 text-[11px] font-semibold tracking-[1.8px] uppercase px-8 py-4 bg-blk text-white transition-all rounded-lg",
          loading ? "opacity-70 cursor-not-allowed" : "hover:bg-black"
        )}
      >
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>

      <p className="text-[10px] text-mu text-center mt-2">
        Submitting this form does not confirm your booking. We will contact you to finalize.
      </p>
    </form>
  );
}
