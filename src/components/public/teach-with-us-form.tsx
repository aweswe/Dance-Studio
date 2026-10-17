'use client';

import { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ACADEMY } from '@/lib/utils/constants';
import { normalizeIndianPhone, whatsappLink } from '@/lib/utils/format';

export function TeachWithUsForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [styles, setStyles] = useState('');
  const [experience, setExperience] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !styles.trim() || !portfolio.trim()) return;

    const cleanedPhone = normalizeIndianPhone(phone);
    const waText = [
      'Hi Rhythmzz! Faculty application submitted via website.',
      `Name: ${name.trim()}`,
      `Phone: ${cleanedPhone}`,
      email.trim() ? `Email: ${email.trim()}` : null,
      `Styles / Disciplines: ${styles.trim()}`,
      experience.trim() ? `Experience: ${experience.trim()}` : null,
      `Portfolio/Instagram: ${portfolio.trim()}`,
      message.trim() ? `Notes: ${message.trim()}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    setSubmitted(true);
    window.open(whatsappLink(waText), '_blank');
  };

  if (submitted) {
    return (
      <div className="rounded-md border border-line bg-surface p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-bl/10 text-bl flex items-center justify-center mx-auto">
          <CheckCircle2 size={24} />
        </div>
        <h3 className="font-anton text-2xl uppercase tracking-tight text-ink">
          Application Received
        </h3>
        <p className="text-sm text-ink-2 max-w-md mx-auto leading-relaxed">
          Thank you for applying to teach at Rhythmzz Academy of Dance. Our team will review your
          profile and contact you via WhatsApp shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md border border-line bg-surface p-6 sm:p-8 space-y-4 shadow-sm"
    >
      <div className="space-y-1">
        <label className="text-[11px] font-bold uppercase tracking-wider text-ink block">
          Full Name *
        </label>
        <Input
          type="text"
          required
          placeholder="e.g. Rahul Sharma"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-ink block">
            WhatsApp Mobile *
          </label>
          <Input
            type="tel"
            required
            placeholder="e.g. 90529 80859"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-ink block">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="e.g. rahul@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-ink block">
            Dance Styles *
          </label>
          <Input
            type="text"
            required
            placeholder="e.g. Hip Hop, Contemporary, Kuchipudi"
            value={styles}
            onChange={(e) => setStyles(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-ink block">
            Years of Experience
          </label>
          <Input
            type="text"
            placeholder="e.g. 5+ years"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold uppercase tracking-wider text-ink block">
          Instagram / Video Link *
        </label>
        <Input
          type="text"
          required
          placeholder="https://instagram.com/yourhandle or YouTube video"
          value={portfolio}
          onChange={(e) => setPortfolio(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold uppercase tracking-wider text-ink block">
          Tell us about yourself
        </label>
        <textarea
          rows={3}
          placeholder="Brief summary of your training, teaching style, and availability..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-bl focus:border-bl/50"
        />
      </div>

      <div className="pt-2">
        <Button type="submit" variant="primary" className="w-full">
          Submit Faculty Application
          <ArrowUpRight size={14} className="ml-1" />
        </Button>
      </div>
    </form>
  );
}
