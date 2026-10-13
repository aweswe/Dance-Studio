import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES, ACADEMY } from '@/lib/utils/constants';
import { getLinkedInstructor } from '@/lib/auth/instructor';
import { PageHeader } from '@/components/ui/page-header';
import { ShieldCheck, Award, AlertCircle, FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Instructor Terms & Agreement | Rhythmzz Academy',
};

export default async function InstructorTermsPortalPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.adminLogin);

  const instructor = await getLinkedInstructor(supabase, user);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        label="Faculty Engagement"
        title="Instructor Terms & Conditions"
        description="Effective Date: 1st November 2026 · Applicable to all instructors, trainers, and guest faculty."
      />

      {/* Overview Card */}
      <div className="p-4 sm:p-5 rounded-md border border-line bg-surface space-y-3">
        <div className="flex items-center gap-2 text-bl font-semibold text-xs sm:text-sm">
          <ShieldCheck size={18} />
          <span>Formal Trainer Engagement Policy</span>
        </div>
        <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
          As a member of the Rhythmzz instructional faculty, your engagement is governed by these official Terms and Conditions. Please ensure all student attendance is logged on the same day as each session, official Rhythmzz gear is worn for all classes, and social media posting standards are upheld.
        </p>
      </div>

      {/* Tier Breakdown Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-anton text-lg sm:text-xl text-ink uppercase tracking-tight">
            Revenue Share Tier System
          </h2>
          <span className="text-[10px] font-mono uppercase bg-bl/10 text-bl px-2.5 py-1 rounded-md font-bold">
            Reviewed Monthly
          </span>
        </div>

        <div className="overflow-x-auto rounded-md border border-line bg-surface">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-canvas-muted text-ink font-bold border-b border-line">
                <th className="p-3">Tier</th>
                <th className="p-3">Monthly Bookings</th>
                <th className="p-3">Revenue Split</th>
                <th className="p-3">Key Benefits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-ink-2">
              <tr className="hover:bg-canvas-muted/40">
                <td className="p-3 font-bold text-ink">Starter</td>
                <td className="p-3">11 to 25 bookings</td>
                <td className="p-3 font-bold text-emerald-600">35%</td>
                <td className="p-3">Standard listing + dashboard access</td>
              </tr>
              <tr className="hover:bg-canvas-muted/40">
                <td className="p-3 font-bold text-ink">Pro</td>
                <td className="p-3">26 to 40 bookings</td>
                <td className="p-3 font-bold text-emerald-600">38%</td>
                <td className="p-3">Featured profile badge + early studio slot access</td>
              </tr>
              <tr className="hover:bg-canvas-muted/40">
                <td className="p-3 font-bold text-ink">Pro Plus</td>
                <td className="p-3">41 to 59 bookings</td>
                <td className="p-3 font-bold text-emerald-600">40%</td>
                <td className="p-3">Priority studio scheduling + marketing spotlight</td>
              </tr>
              <tr className="hover:bg-canvas-muted/40 bg-amber-500/5">
                <td className="p-3 font-bold text-amber-700 dark:text-amber-400">Elite</td>
                <td className="p-3 font-semibold">60+ bookings</td>
                <td className="p-3 font-bold text-emerald-600">45%</td>
                <td className="p-3">Co-branded content + gear sponsorship + 100% fee of 2 students</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-ink-2">
          <div className="p-3.5 rounded-md border border-line bg-surface space-y-1">
            <p className="font-bold text-ink">Micro-Batches (&lt;10 Bookings)</p>
            <p>Flat ₹400 per class payout to protect instructor earnings on low-occupancy slots.</p>
          </div>
          <div className="p-3.5 rounded-md border border-line bg-surface space-y-1">
            <p className="font-bold text-ink">Monthly Payout Date</p>
            <p>Disbursed on the 10th of every month via bank transfer or verified UPI.</p>
          </div>
        </div>
      </section>

      {/* Key Obligations Checklist */}
      <section className="space-y-3">
        <h2 className="font-anton text-lg sm:text-xl text-ink uppercase tracking-tight">
          Core Faculty Obligations
        </h2>

        <div className="space-y-2.5 text-xs sm:text-sm text-ink-2">
          <div className="p-3.5 rounded-md border border-line bg-surface">
            <strong className="text-ink">1. Official Branded Gear:</strong> Mandatory wearing of official Rhythmzz Academy gear during all studio sessions, workshops, and partner events.
          </div>
          <div className="p-3.5 rounded-md border border-line bg-surface">
            <strong className="text-ink">2. Social Media Standard:</strong> Post minimum 2 posts or 1 reel per week highlighting studio work, tagging <span className="font-mono text-bl">@rhythmzzdance.live</span>.
          </div>
          <div className="p-3.5 rounded-md border border-line bg-surface">
            <strong className="text-ink">3. Daily Attendance &amp; My Log:</strong> Mark student attendance and your teaching log on the Portal on the day of each class.
          </div>
          <div className="p-3.5 rounded-md border border-line bg-surface">
            <strong className="text-ink">4. Non-Solicitation (12 Months):</strong> Instructors may not facilitate students to book or pay outside the official Rhythmzz platform.
          </div>
          <div className="p-3.5 rounded-md border border-red-500/30 bg-red-500/5 text-red-700 dark:text-red-400">
            <strong>5. Short-Notice Cancellations:</strong> Cancellations with less than 6 hours&apos; notice incur a ₹200 deduction from your payout.
          </div>
        </div>
      </section>

      <div className="pt-4 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-ink-3">
        <span>{ACADEMY.name} Faculty Agreement</span>
        <Link
          href={ROUTES.instructorTerms}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-bl hover:text-bl-deep font-semibold underline"
        >
          <span>Open Full Legal Document</span>
          <ExternalLink size={12} />
        </Link>
      </div>
    </div>
  );
}
