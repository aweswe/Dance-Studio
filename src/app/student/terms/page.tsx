import { getCurrentStudent } from '@/lib/auth/student';
import { redirect } from 'next/navigation';
import { ROUTES, ACADEMY } from '@/lib/utils/constants';
import { ShieldCheck, Calendar, AlertTriangle, FileText } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Student Portal Terms & Conditions | Rhythmzz Academy',
};

export default async function StudentTermsPage() {
  const { student } = await getCurrentStudent();
  if (!student) redirect(ROUTES.login);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="border-b-2 border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-sky-950 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldCheck size={16} className="text-sky-800" />
          <span>Student Portal Agreement</span>
        </div>
        <h1 className="font-anton text-2xl sm:text-3xl text-slate-950 uppercase tracking-tight">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
          Effective Date: 1st January 2025 · Last Updated: September 2026 · Applicable to all students &amp; guardians
        </p>
      </header>

      {/* Highlights Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-lg border-2 border-slate-200 bg-white flex items-start gap-3 shadow-sm">
          <Calendar className="w-5 h-5 text-sky-800 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold text-slate-950">Fee Due Date: 7th of Every Month</p>
            <p className="text-slate-700 mt-0.5 font-medium leading-relaxed">
              Monthly tuition is payable on or before the 7th. Quarterly plans are due in advance.
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-lg border-2 border-red-300 bg-red-50 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold text-red-950">Strict Late Fee Policy</p>
            <p className="text-slate-800 mt-0.5 font-medium leading-relaxed">
              Late fees apply automatically after the 7th and cannot be waived or reversed under any circumstances.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 text-sm text-slate-800 font-medium">
        <section className="rounded-lg border-2 border-slate-200 bg-white p-5 sm:p-6 space-y-2 shadow-2xs">
          <h2 className="font-bold text-slate-950 text-base">1. About the Portal</h2>
          <p className="text-xs sm:text-sm leading-relaxed">
            The Rhythmzz Student Portal is the official administrative tool of {ACADEMY.name} (Neredmet X Road, Secunderabad). It provides verified access to your class schedule, batch rosters, same-day instructor attendance logs, payment history, and academy announcements.
          </p>
        </section>

        <section className="rounded-lg border-2 border-slate-200 bg-white p-5 sm:p-6 space-y-2 shadow-2xs">
          <h2 className="font-bold text-slate-950 text-base">2. Attendance Records & 7-Day Window</h2>
          <p className="text-xs sm:text-sm leading-relaxed">
            Class attendance is marked directly by your assigned dance or fitness coach. Attendance logs are considered final unless a discrepancy is reported to the studio manager within <strong>7 days</strong> of the session date.
          </p>
        </section>

        <section className="rounded-lg border-2 border-slate-200 bg-white p-5 sm:p-6 space-y-2 shadow-2xs">
          <h2 className="font-bold text-slate-950 text-base">3. Tuition & Non-Waivable Late Fees</h2>
          <p className="text-xs sm:text-sm leading-relaxed">
            Fees are due on or before the 7th of each month. In accordance with Section 4.3 of the studio rules, any payment delayed past the 7th will automatically trigger a system-generated late fee. Because this is hardcoded for operational consistency across all 3,000+ enrolled students, desk staff have no ability to waive or reset it.
          </p>
          <p className="text-xs sm:text-sm leading-relaxed mt-2">
            No refunds are issued for missed or voluntary dropouts. If the academy cancels a batch with no replacement slot, a prorated credit is granted.
          </p>
        </section>

        <section className="rounded-lg border-2 border-slate-200 bg-white p-5 sm:p-6 space-y-2 shadow-2xs">
          <h2 className="font-bold text-slate-950 text-base">4. Studio Conduct & Medical Safety</h2>
          <p className="text-xs sm:text-sm leading-relaxed">
            Physical exercise is undertaken at your own risk. Please inform your trainer of any pre-existing medical condition, pain, or injury prior to class. Clean indoor shoes or bare feet are required on the dance floors.
          </p>
        </section>

        <section className="rounded-lg border-2 border-slate-200 bg-white p-5 sm:p-6 space-y-2 shadow-2xs">
          <h2 className="font-bold text-slate-950 text-base">5. Privacy & Photography</h2>
          <p className="text-xs sm:text-sm leading-relaxed">
            Student details are stored securely and never shared with third parties. Showcase routines, recitals, and class photos may be published to @rhythmzzdance.live for community showcases. Contact the studio desk if you require photography opt-out for minor students.
          </p>
        </section>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-700 font-medium">
          <span>{ACADEMY.name} · Secunderabad</span>
          <Link href={ROUTES.terms} target="_blank" className="text-sky-900 underline hover:text-sky-950 font-bold">
            View Full Public Document &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
