'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Loader2, Calendar, Clock, Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createInstructorBatch } from '@/actions/classes';

interface ProgrammeOption {
  id: string;
  name: string;
}

const ALL_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export function CreateInstructorBatchDialog({
  programmes,
}: {
  programmes: ProgrammeOption[];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [programmeId, setProgrammeId] = useState(programmes[0]?.id || '');
  const [days, setDays] = useState<string[]>(['Monday', 'Wednesday']);
  const [timeStart, setTimeStart] = useState('17:00');
  const [timeEnd, setTimeEnd] = useState('18:30');
  const [capacity, setCapacity] = useState('25');

  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleDay = (day: string) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter a batch name');
      return;
    }
    if (!programmeId) {
      setErrorMsg('Please select a programme');
      return;
    }
    if (days.length === 0) {
      setErrorMsg('Please select at least one day of the week');
      return;
    }

    setBusy(true);
    setErrorMsg('');

    try {
      const res = await createInstructorBatch({
        name: name.trim(),
        programmeId,
        days,
        timeStart: timeStart.includes(':') && timeStart.length === 5 ? `${timeStart}:00` : timeStart,
        timeEnd: timeEnd.includes(':') && timeEnd.length === 5 ? `${timeEnd}:00` : timeEnd,
        capacity: Number(capacity) || 25,
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to create batch');
        return;
      }

      setIsOpen(false);
      setName('');
      setDays(['Monday', 'Wednesday']);
      router.refresh();
    } catch {
      setErrorMsg('An error occurred while creating the batch');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5"
      >
        <Plus size={16} />
        <span>Add Class / Batch</span>
      </Button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg rounded-md bg-surface border border-line shadow-2xl p-6 text-ink max-h-[92vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-md text-ink-3 hover:text-ink hover:bg-canvas transition-colors"
            >
              <X size={18} />
            </button>

            <header className="mb-5">
              <h3 className="font-anton text-2xl uppercase tracking-tight text-ink">
                Create New Batch
              </h3>
              <p className="text-xs text-ink-2 mt-1">
                Add a new class roster or batch schedule to your instructor dashboard.
              </p>
            </header>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-md bg-danger/10 border border-danger/30 text-danger text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1">
                  Batch Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kids Contemporary & Foundations (Mon-Wed)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-line bg-canvas text-xs sm:text-sm text-ink focus:outline-hidden focus:ring-1 focus:ring-bl"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1">
                  Programme Track *
                </label>
                <select
                  value={programmeId}
                  onChange={(e) => setProgrammeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-line bg-canvas text-xs sm:text-sm text-ink focus:outline-hidden focus:ring-1 focus:ring-bl"
                >
                  {programmes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5">
                  Class Days *
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_DAYS.map((day) => {
                    const active = days.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer border ${
                          active
                            ? 'bg-bl text-white border-bl shadow-2xs'
                            : 'bg-canvas border-line text-ink-2 hover:border-ink/40'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-line bg-canvas text-xs sm:text-sm text-ink focus:outline-hidden focus:ring-1 focus:ring-bl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-line bg-canvas text-xs sm:text-sm text-ink focus:outline-hidden focus:ring-1 focus:ring-bl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1">
                  Student Capacity
                </label>
                <input
                  type="number"
                  min={5}
                  max={60}
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-line bg-canvas text-xs sm:text-sm text-ink focus:outline-hidden focus:ring-1 focus:ring-bl"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <Button type="submit" disabled={busy} className="flex-1">
                  {busy ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                  Save &amp; Activate Batch
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  disabled={busy}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
