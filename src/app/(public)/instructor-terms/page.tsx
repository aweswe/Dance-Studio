import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage, LegalSection } from '@/components/public/legal-page';
import { ACADEMY, SITE_URL, ROUTES } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: 'Instructor Terms & Conditions | Rhythmzz Academy of Dance',
  description: 'Official Instructor Agreement, Trainer Obligations, Pay Structure, and Tier Policies at Rhythmzz Academy of Dance.',
  alternates: { canonical: `${SITE_URL}/instructor-terms` },
};

export default function InstructorTermsPage() {
  return (
    <LegalPage
      title="Instructor Terms & Conditions"
      description="Official Trainer Agreement & Engagement Policy · Effective Date: 1st November 2026 · Applicable to All Instructors, Trainers & Guest Faculty."
    >
      <div className="p-5 rounded-lg bg-slate-950 text-white border-l-4 border-bl space-y-2 mb-6 shadow-md">
        <p className="font-bold text-bl text-xs font-mono uppercase tracking-wider">
          Instructor Portal Integration
        </p>
        <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed">
          By signing the faculty agreement or clicking &ldquo;I Agree&rdquo; on the Rhythmzz Instructor Portal, you confirm that you have read, understood, and agreed to be bound by these Terms and Conditions in full. This document forms part of your formal engagement with Rhythmzz Academy of Dance.
        </p>
      </div>

      <LegalSection title="Part A — Trainer Rules & Obligations">
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-ink text-sm sm:text-base">A1. Onboarding Requirements</h4>
            <p className="mt-1 text-ink-2">
              All new trainers must complete the following before Portal access is activated and classes commence:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs sm:text-sm text-ink-2">
              <li>
                <strong>A1.1 Professional Profile:</strong> A complete instructor profile must be created on the Rhythmzz website including bio, specialty areas, a video reel (video reel can be completed within 30 days of joining), and assigned class schedule.
              </li>
              <li>
                <strong>A1.2 Official Gear:</strong> All trainers must wear official Rhythmzz Academy of Dance branded gear during every class without exception — at the studio, partner venues, masterclasses, or external showcases under the Rhythmzz banner. This is a non-negotiable studio standard.
              </li>
              <li>
                <strong>A1.3 Identity Verification:</strong> Trainers must submit a valid Aadhaar card and PAN card for identity verification and tax compliance prior to their first payout being processed.
              </li>
              <li>
                <strong>A1.4 Trainer Agreement:</strong> A signed copy of this agreement must be submitted to the Studio Manager before conducting your first class. Digital confirmation via the Instructor Portal is equally binding.
              </li>
              <li>
                <strong>A1.5 Background Verification:</strong> Rhythmzz Academy of Dance reserves the right to conduct background verification checks in the interest of student and minor safety.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-ink text-sm sm:text-base">A2. Social Media & Brand Obligations</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs sm:text-sm text-ink-2">
              <li>
                <strong>A2.1 Minimum Posting Requirement:</strong> All trainers are required to share a minimum of <strong>2 posts or 1 reel per week</strong> on social media highlighting their training work at Rhythmzz. All posts must tag <span className="font-mono text-slate-950 font-bold bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded">@rhythmzzdance.live</span>.
              </li>
              <li>
                <strong>A2.2 Brand Standards:</strong> All public content in which a trainer identifies as a Rhythmzz instructor must reflect positively on the academy. Content deemed offensive, controversial, or contrary to studio values may result in formal warning or suspension.
              </li>
              <li>
                <strong>A2.3 Proprietary Content:</strong> Trainers must not utilize Rhythmzz branded logos, student assets, or instructional frameworks for personal promotion outside the academy without written approval.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-ink text-sm sm:text-base">A3. Attendance, Scheduling & Class Conduct</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs sm:text-sm text-ink-2">
              <li>
                <strong>A3.1 Student Attendance Marking:</strong> Trainers must mark student attendance accurately on the Portal on the same day as each session. Backdated edits require written authorization from the Studio Manager.
              </li>
              <li>
                <strong>A3.2 Daily My Log:</strong> Trainers must log their own teaching hours and class notes through the <em>My Log</em> section of the Instructor Portal on the day of each class.
              </li>
              <li>
                <strong>A3.3 Punctuality:</strong> Trainers must arrive at the studio at least <strong>10 minutes prior</strong> to scheduled class start time.
              </li>
              <li>
                <strong>A3.4 Schedule Changes:</strong> Timing adjustments must be routed through the Portal with a minimum of <strong>24 hours&apos; advance notice</strong> to students via the portal announcement broadcast.
              </li>
              <li>
                <strong>A3.5 Batch Creation:</strong> Creation of new batches or cancellation of existing ones requires approval from Nitish Kumar (Founder &amp; Artistic Director) or the Studio Manager.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-ink text-sm sm:text-base">A4. Student Data, Confidentiality & Minor Safety</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs sm:text-sm text-ink-2">
              <li>
                <strong>A4.1 Confidentiality:</strong> All student information accessed via the Portal (names, phone numbers, attendance, fees) is strictly confidential and may not be exported or shared.
              </li>
              <li>
                <strong>A4.2 Minor Photography:</strong> Photos or videos of minors may not be published publicly without verified parental consent. All media must be uploaded through the Portal.
              </li>
            </ul>
          </div>
        </div>
      </LegalSection>

      <LegalSection title="Part B — Trainer Benefits & Pay Structure">
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-ink text-sm sm:text-base">B1. Revenue Share & Monthly Payouts</h4>
            <p className="mt-1 text-xs sm:text-sm text-ink-2">
              B1.1 Trainers are compensated on a verified revenue-share model based on platform student bookings. Payouts are processed on the <strong>10th of each month</strong> for the preceding month&apos;s completed classes.
            </p>
            <p className="mt-1 text-xs sm:text-sm text-ink-2">
              B1.2 Deductions: Applicable TDS under Section 194J of the Income Tax Act, 1961, and short-notice cancellation penalties (Clause C3) are deducted prior to disbursement via bank transfer or UPI.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-ink text-sm sm:text-base">B2. Trainer Tier System</h4>
            <p className="text-xs text-ink-2 mb-3">
              Tiers are reviewed monthly based on verified active monthly student bookings. Upgrades take effect on the 1st of each month.
            </p>

            <div className="w-full overflow-x-auto rounded-lg border-2 border-slate-200 shadow-sm scrollbar-thin">
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
                    <td className="p-3">Standard profile listing + dashboard access</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-950">Pro</td>
                    <td className="p-3">26 to 40 bookings</td>
                    <td className="p-3 font-extrabold text-emerald-800">38%</td>
                    <td className="p-3">Featured profile badge + early studio slot booking</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-950">Pro Plus</td>
                    <td className="p-3">41 to 59 bookings</td>
                    <td className="p-3 font-extrabold text-emerald-800">40%</td>
                    <td className="p-3">Priority studio scheduling + prominent marketing spotlight</td>
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

            <div className="mt-3 space-y-1.5 text-xs text-ink-2">
              <p>
                <strong>B2.1 Micro-Batches (&lt;10 Bookings):</strong> For classes with fewer than 10 students, compensation is paid at a flat <strong>₹400 per class</strong> rather than percentage split to protect instructor compensation on low-occupancy slots.
              </p>
              <p>
                <strong>B2.2 Elite Student Bonus:</strong> The 100% fee waiver for 2 students applies to the value of the last 2 new bookings in the trainer&apos;s batch, conditional on maintaining 60+ active bookings continuously.
              </p>
              <p>
                <strong>B2.4 Grace Period:</strong> If a Pro or Elite trainer drops below their threshold by 5 or fewer bookings in a month, a 1-month grace period applies prior to tier adjustment.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-ink text-sm sm:text-base">B3. Standard Trainer Benefits</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs sm:text-sm text-ink-2">
              <li><strong>Zero Rent Overhead:</strong> Studio floor space at Neredmet and partner branches is fully provided by the academy with zero rental deduction.</li>
              <li><strong>Built-in Student Pipeline:</strong> All new enrolments and trial leads are routed directly to faculty batches via platform marketing.</li>
              <li><strong>Portfolio Listing:</strong> Dedicated faculty showcase profile with bio, video reel, and live timetable on the official website.</li>
              <li><strong>Official Uniform:</strong> Branded academy uniform kit provided upon successful onboarding.</li>
              <li><strong>Quarterly Performance Bonuses:</strong> Available for trainers maintaining high retention and positive student feedback.</li>
            </ul>
          </div>
        </div>
      </LegalSection>

      <LegalSection title="Part C — Policies & Enforcement">
        <div className="space-y-3 text-xs sm:text-sm text-ink-2">
          <div>
            <strong className="text-ink block">C1. Non-Solicitation Policy</strong>
            <p className="mt-1">
              Trainers are strictly prohibited from approaching or facilitating any Rhythmzz student to book, attend, or pay for private or external classes outside the platform — whether through direct UPI, cash, or third-party apps. This clause remains binding for <strong>12 months</strong> following engagement conclusion.
            </p>
          </div>

          <div>
            <strong className="text-ink block">C2. Platform Integrity & Zero Fraud</strong>
            <p className="mt-1">
              Every class conducted under the Rhythmzz name must be booked and logged on the Portal. Any falsification of attendance or creation of fraudulent student profiles will result in immediate termination and legal forfeiture of outstanding dues.
            </p>
          </div>

          <div>
            <strong className="text-ink block">C3. Cancellation Policy & Penalty</strong>
            <p className="mt-1">
              Trainer-initiated cancellations with less than <strong>6 hours&apos; notice</strong> incur an automatic <strong>₹200 penalty</strong> deducted from the monthly payout to compensate for student inconvenience. Three or more short-notice cancellations in a month will trigger formal review and temporary profile suspension.
            </p>
          </div>
        </div>
      </LegalSection>

      <LegalSection title="Part D — Legal & Studio Administration">
        <div className="space-y-2 text-xs sm:text-sm text-ink-2">
          <p>
            <strong>D1. Independent Contractor:</strong> Engagement is that of an independent contractor with professional performance standards.
          </p>
          <p>
            <strong>D2. Governing Law:</strong> Governed by the laws of India, under exclusive jurisdiction of the courts in Hyderabad / Secunderabad, Telangana.
          </p>
          <div className="mt-4 pt-3 border-t border-line">
            <p className="font-bold text-ink">Administrative Contacts:</p>
            <p>Nitish Kumar — Founder &amp; Artistic Director</p>
            <p>Swapna Sujit — Studio Manager</p>
            <p>{ACADEMY.address.full}</p>
            <p>Phone: <a href={`tel:${ACADEMY.phone}`} className="text-bl font-semibold">{ACADEMY.phoneDisplay}</a></p>
            <p>Email: <a href={`mailto:${ACADEMY.email}`} className="text-bl font-semibold">{ACADEMY.email}</a></p>
          </div>
        </div>
      </LegalSection>
    </LegalPage>
  );
}
