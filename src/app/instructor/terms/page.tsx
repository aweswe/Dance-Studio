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
      <div className="p-5 rounded-lg border-2 border-slate-200 bg-white space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-sky-950 font-bold text-sm">
          <ShieldCheck size={18} className="text-sky-800" />
          <span>Formal Trainer Engagement Policy</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
          As a member of the Rhythmzz instructional faculty, your engagement is governed by these official Terms and Conditions. Please ensure all student attendance is logged on the same day as each session, official Rhythmzz gear is worn for all classes, and social media posting standards are upheld.
        </p>
      </div>

      {/* Tier Breakdown Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-anton text-lg sm:text-xl text-slate-950 uppercase tracking-tight">
            Revenue Share Tier System
          </h2>
          <span className="text-[10px] font-mono uppercase bg-slate-950 text-white px-2.5 py-1 rounded-md font-bold">
            Reviewed Monthly
          </span>
        </div>

        <div className="w-full overflow-x-auto rounded-lg border-2 border-slate-200 bg-white shadow-sm scrollbar-thin">
          <table className="w-full min-w-[500px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-950 font-bold border-b-2 border-slate-300">
                <th className="p-3">Tier</th>
                <th className="p-3">Monthly Bookings</th>
                <th className="p-3">Revenue Split</th>
                <th className="p-3">Key Benefits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-950">Starter</td>
                <td className="p-3">11 to 25 bookings</td>
                <td className="p-3 font-extrabold text-emerald-800">35%</td>
                <td className="p-3">Standard listing + dashboard access</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-950">Pro</td>
                <td className="p-3">26 to 40 bookings</td>
                <td className="p-3 font-extrabold text-emerald-800">38%</td>
                <td className="p-3">Featured profile badge + early studio slot access</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-950">Pro Plus</td>
                <td className="p-3">41 to 59 bookings</td>
                <td className="p-3 font-extrabold text-emerald-800">40%</td>
                <td className="p-3">Priority studio scheduling + marketing spotlight</td>
              </tr>
              <tr className="bg-slate-900 text-white border-t-2 border-slate-950">
                <td className="p-3 font-black text-[#FDE68A] flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-white/15 text-[#FDE68A] text-[10px] font-black uppercase">Elite</span>
                </td>
                <td className="p-3 font-bold text-white">60+ bookings</td>
                <td className="p-3 font-black text-emerald-400">45%</td>
                <td className="p-3 font-medium text-slate-200">Co-branded content + gear sponsorship + 100% fee of 2 students</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-800 font-medium">
          <div className="p-3.5 rounded-md border-2 border-slate-200 bg-white space-y-1 shadow-2xs">
            <p className="font-bold text-slate-950">Micro-Batches (&lt;10 Bookings)</p>
            <p>Flat ₹400 per class payout to protect instructor earnings on low-occupancy slots.</p>
          </div>
          <div className="p-3.5 rounded-md border-2 border-slate-200 bg-white space-y-1 shadow-2xs">
            <p className="font-bold text-slate-950">Monthly Payout Date</p>
            <p>Disbursed on the 10th of every month via bank transfer or verified UPI.</p>
          </div>
        </div>
      </section>

      {/* Key Obligations Checklist */}
      <section className="space-y-3">
        <h2 className="font-anton text-lg sm:text-xl text-slate-950 uppercase tracking-tight">
          Core Faculty Obligations
        </h2>

        <div className="space-y-2.5 text-xs sm:text-sm text-slate-800 font-medium">
          <div className="p-3.5 rounded-md border-2 border-slate-200 bg-white shadow-2xs">
            <strong className="text-slate-950">1. Official Branded Gear:</strong> Mandatory wearing of official Rhythmzz Academy gear during all studio sessions, workshops, and partner events.
          </div>
          <div className="p-3.5 rounded-md border-2 border-slate-200 bg-white shadow-2xs">
            <strong className="text-slate-950">2. Social Media Standard:</strong> Post minimum 2 posts or 1 reel per week highlighting studio work, tagging <span className="font-mono text-slate-950 font-bold bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded">@rhythmzzdance.live</span>.
          </div>
          <div className="p-3.5 rounded-md border-2 border-slate-200 bg-white shadow-2xs">
            <strong className="text-slate-950">3. Daily Attendance &amp; My Log:</strong> Mark student attendance and your teaching log on the Portal on the day of each class.
          </div>
          <div className="p-3.5 rounded-md border-2 border-slate-200 bg-white shadow-2xs">
            <strong className="text-slate-950">4. Non-Solicitation (12 Months):</strong> Instructors may not facilitate students to book or pay outside the official Rhythmzz platform.
          </div>
          <div className="p-3.5 rounded-md border-2 border-red-300 bg-red-50 text-red-950 font-medium shadow-2xs">
            <strong className="text-red-950">5. Short-Notice Cancellations:</strong> Cancellations with less than 6 hours&apos; notice incur a ₹200 deduction from your payout.
          </div>
        </div>
      </section>

      <div className="pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700 font-medium">
        <span>{ACADEMY.name} Faculty Agreement</span>
        <Link
          href={ROUTES.instructorTerms}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-sky-900 hover:text-black font-bold underline"
        >
          <span>Open Full Legal Document</span>
          <ExternalLink size={12} />
        </Link>
      </div>
    </div>
  );
}
