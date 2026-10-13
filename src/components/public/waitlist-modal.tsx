'use client';

import { useState } from 'react';
import { X, CheckCircle2, Clock, Users, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { submitWaitlistRequest } from '@/actions/waitlist';
import { whatsappLink } from '@/lib/utils/format';
import { WhatsAppIcon } from '@/components/public/whatsapp-icon';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgramme?: string;
}

const PROGRAMME_OPTIONS = [
  'Kids Dance (Ages 3.5 – 12 yrs)',
  'Adults Commercial & Expressive (Ages 13+ yrs)',
  'Gymnastics & Tumbling (Ages 3.5 – 12 yrs)',
  'Kuchipudi Classical Certification (IAO Accredited)',
  'Kathak Classical Certification (Gandharva Mahavidyalaya)',
  'Mind & Body Fitness (Morning Wellness Cohort)',
  'Annual Full-Access Pass',
];

export function WaitlistModal({
  isOpen,
  onClose,
  defaultProgramme = 'Upcoming Certification Courses',
}: WaitlistModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [programme, setProgramme] = useState(defaultProgramme);
  const [preferredTiming, setPreferredTiming] = useState('Flexible / Any Open Slot');
  const [notes, setNotes] = useState('');

  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState<{
    queuePosition: number;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrorMsg('');

    try {
      const res = await submitWaitlistRequest({
        name,
        phone,
        email: email || undefined,
        programme,
        preferredTiming: preferredTiming || undefined,
        notes: notes || undefined,
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to submit waitlist request. Please try again.');
        return;
      }

      setSuccessData({
        queuePosition: res.queuePosition || 1,
        message: res.message || 'You are on the waitlist!',
      });
    } catch {
      setErrorMsg('A network error occurred. Please try again or WhatsApp us directly.');
    } finally {
      setBusy(false);
    }
  }

  const expediteWaHref = whatsappLink(
    `Hi Rhythmzz! I just joined the waitlist for ${programme} (Name: ${name}, Phone: ${phone}). Please let me know as soon as a slot opens up.`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-md bg-white border border-neutral-200 shadow-2xl p-6 sm:p-7 text-neutral-900 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-md text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Close waitlist modal"
        >
          <X className="w-5 h-5" />
        </button>

        {successData ? (
          /* SUCCESS STATE */
          <div className="text-center py-4 space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-md bg-sky-100 text-[#0284c7] font-mono text-xs font-extrabold uppercase tracking-wider mb-2">
                Queue Position #{successData.queuePosition} Confirmed
              </span>
              <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-neutral-950">
                You&apos;re On The Waitlist!
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-md mx-auto leading-relaxed">
                {successData.message}
              </p>
            </div>

            <div className="p-4 rounded-md bg-neutral-50 border border-neutral-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between text-neutral-600">
                <span>Selected Track:</span>
                <strong className="text-neutral-900">{programme}</strong>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Applicant:</span>
                <strong className="text-neutral-900">{name}</strong>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Contact Number:</span>
                <strong className="text-neutral-900">{phone}</strong>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              <a
                href={expediteWaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-xs"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                <span>Notify Desk on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-md bg-neutral-950 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <form onSubmit={handleSubmit} className="space-y-4">
            <header className="pr-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
                <Clock className="w-3 h-3" />
                <span>Batch Priority Queue</span>
              </div>
              <h3
                id="waitlist-title"
                className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-neutral-950 leading-tight"
              >
                Join Programme Waitlist
              </h3>
              <p className="text-xs text-neutral-600 font-medium mt-1 leading-relaxed">
                When full batches open new spots or upcoming certification cohorts launch, waitlist applicants receive first-priority enrolment notices.
              </p>
            </header>

            {errorMsg && (
              <div className="p-3 rounded-md bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md border border-neutral-300 bg-white text-xs sm:text-sm text-neutral-900 focus:outline-hidden focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                    WhatsApp Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md border border-neutral-300 bg-white text-xs sm:text-sm text-neutral-900 focus:outline-hidden focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                    Email Address <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md border border-neutral-300 bg-white text-xs sm:text-sm text-neutral-900 focus:outline-hidden focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Interested Programme / Track
                </label>
                <select
                  value={programme}
                  onChange={(e) => setProgramme(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md border border-neutral-300 bg-white text-xs sm:text-sm text-neutral-900 focus:outline-hidden focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7]"
                >
                  {PROGRAMME_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Preferred Timing
                </label>
                <select
                  value={preferredTiming}
                  onChange={(e) => setPreferredTiming(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md border border-neutral-300 bg-white text-xs sm:text-sm text-neutral-900 focus:outline-hidden focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7]"
                >
                  <option value="Flexible / Any Open Slot">Flexible / Any Open Slot</option>
                  <option value="Weekday Evenings (5 PM – 7 PM)">Weekday Evenings (5 PM – 7 PM)</option>
                  <option value="Weekday Late Evenings (7 PM – 9 PM)">Weekday Late Evenings (7 PM – 9 PM)</option>
                  <option value="Weekend Mornings / Afternoons">Weekend Mornings / Afternoons</option>
                  <option value="Morning Wellness (9:30 AM – 10:30 AM)">Morning Wellness (9:30 AM – 10:30 AM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Additional Notes or Questions <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us about prior dance experience, age of student, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-md border border-neutral-300 bg-white text-xs text-neutral-900 focus:outline-hidden focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={busy}
                className="w-full py-3.5 px-6 rounded-md bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm cursor-pointer disabled:opacity-70"
              >
                {busy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering spot...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm My Waitlist Spot</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero spam · We only message when an authentic vacancy is open</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
