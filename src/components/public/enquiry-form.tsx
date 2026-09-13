'use client';

import { useState } from 'react';
import { submitEnquiry } from '@/actions/enquiries';
import { CheckCircle2, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function EnquiryForm() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setStatus('idle');
    setErrorMsg('');
    const res = await submitEnquiry({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });
    setBusy(false);
    if (res.success) {
      setStatus('sent');
      setForm({ name: '', phone: '', email: '', message: '' });
    } else {
      setStatus('error');
      setErrorMsg(res.error ?? 'Something went wrong. Please try again.');
    }
  };

  if (status === 'sent') {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="mx-auto mb-4 text-[#7C5CFC]" size={48} strokeWidth={1.5} />
        <h3 className="font-anton text-2xl text-ink tracking-wide mb-2">MESSAGE RECEIVED</h3>
        <p className="text-sm text-ink-2">
          We&apos;ll get back to you within 24 hours. For anything urgent, WhatsApp us directly.
        </p>
      </div>
    );
  }

  const textareaClass =
    'w-full bg-canvas border border-line rounded-2xl px-4 py-3 text-sm text-ink placeholder:text-ink-3 h-32 resize-none focus:outline-none focus:border-[#7C5CFC] focus:ring-2 focus:ring-[#7C5CFC]/20 transition-all';

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <Input
        id="enq-name"
        label="Name *"
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <Input
        id="enq-phone"
        label="Phone *"
        placeholder="10-digit mobile number"
        inputMode="numeric"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        required
      />
      <Input
        id="enq-email"
        label="Email (optional)"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <div>
        <label
          htmlFor="enq-message"
          className="text-[10px] font-mono tracking-[2px] uppercase text-ink-2 mb-2 block font-bold"
        >
          Message *
        </label>
        <textarea
          id="enq-message"
          className={textareaClass}
          placeholder="Tell us what you'd like to know — classes, timings, fees, trial session..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-danger">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="btn-sun w-full py-4 text-xs font-black tracking-[2px] uppercase gap-2 shadow-md cursor-pointer flex items-center justify-center transition-transform active:scale-[0.98]"
      >
        <Send size={14} /> {busy ? 'Sending...' : 'Send Message ──→'}
      </button>
    </form>
  );
}
