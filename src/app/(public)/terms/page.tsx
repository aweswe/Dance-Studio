import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage, LegalSection } from '@/components/public/legal-page';
import { ACADEMY, SITE_URL, ROUTES } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: 'Terms & Conditions & Student Portal Agreement | Rhythmzz Academy of Dance',
  description: `Official Student Portal Terms and Conditions for students, parents, and studio operations at ${ACADEMY.name}.`,
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & conditions"
      description="Student Portal Agreement & Studio Operational Guidelines · Effective Date: 1st January 2025 · Last Updated: September 2026."
    >
      <div className="p-4 rounded-md bg-amber-500/10 border border-amber-500/30 text-ink text-xs sm:text-sm space-y-2 mb-6">
        <p className="font-bold text-amber-900 dark:text-amber-400">
          Faculty, Instructors &amp; Guest Trainers:
        </p>
        <p className="text-ink-2">
          If you are an instructor or trainer at Rhythmzz, please review the dedicated{' '}
          <Link href={ROUTES.instructorTerms} className="font-bold text-bl underline hover:text-bl-deep">
            Instructor Terms &amp; Conditions &rarr;
          </Link>{' '}
          governing trainer onboarding, revenue tiers, attendance logging, and brand obligations.
        </p>
      </div>

      <LegalSection title="1. About the Portal & Studio">
        <p>
          The Rhythmzz Student Portal (&ldquo;Portal&rdquo;) is an official digital platform provided by{' '}
          <strong>{ACADEMY.name}</strong>, located at {ACADEMY.address.full}, Telangana, India.
        </p>
        <p className="mt-2 text-ink-2">The Portal allows students and parents to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-ink-2">
          <li>View class schedules, batch timings, and studio updates</li>
          <li>Track attendance records marked by assigned instructors</li>
          <li>Receive event announcements and official studio notifications</li>
          <li>Access fee payment history, billing ledger, and official receipts</li>
          <li>View class updates, curriculum progress, and trainer assessment notes</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Account Registration & Access">
        <p>
          2.1 Each student or parent / guardian is required to create a single account using accurate, verified, and current information.
        </p>
        <p className="mt-2">
          2.2 You are solely responsible for maintaining the confidentiality of your login credentials. Do not share your password with anyone.
        </p>
        <p className="mt-2">
          2.3 {ACADEMY.name} reserves the right to suspend or terminate any account found to be misused, shared, or registered with inaccurate information.
        </p>
        <p className="mt-2">
          2.4 If you suspect unauthorized access to your account, notify us immediately at{' '}
          <a href={`mailto:${ACADEMY.email}`} className="text-bl underline">{ACADEMY.email}</a> or call{' '}
          <a href={`tel:${ACADEMY.phone}`} className="text-bl underline">{ACADEMY.phoneDisplay}</a>.
        </p>
      </LegalSection>

      <LegalSection title="3. Attendance & Class Records">
        <p>
          3.1 Attendance records displayed on the Portal are marked by your assigned instructor and are considered final and accurate unless disputed within <strong>7 days</strong> of the record date.
        </p>
        <p className="mt-2">
          3.2 To raise a discrepancy or clarify attendance, contact the studio manager or your instructor directly through official desk channels.
        </p>
        <p className="mt-2">
          3.3 Attendance data is maintained for internal academic progression, certification prerequisites, and administrative purposes only.
        </p>
      </LegalSection>

      <LegalSection title="4. Fees, Payments & Automatic Late Fee Policy">
        <p>
          4.1 Fee information displayed on the Portal is for reference and verified tracking. All payments must be made directly to the studio via UPI, cash, authorized payment methods on the website, or official links shared directly by the academy desk.
        </p>
        <p className="mt-2">
          4.2 <strong>Due Date:</strong> Monthly fees are due on or before the <strong>7th of each calendar month</strong>, without exception. Quarterly fees must be paid in full and in advance at the start of each quarterly term.
        </p>
        <div className="mt-3 p-3.5 rounded-md bg-red-500/10 border border-red-500/30 text-xs sm:text-sm text-ink leading-relaxed">
          <strong className="text-red-600 block mb-1">4.3 Strict Late Fee Policy:</strong>
          If fees are not paid by the <strong>7th of the month</strong>, a late fee will be applied automatically to your account. This late fee is system-generated and <strong>cannot be waived, reversed, or reset under any circumstances</strong> once applied — regardless of the reason for delayed payment. No exceptions will be made.
        </div>
        <p className="mt-2">
          4.4 Non-payment of fees beyond a reasonable grace period may result in temporary suspension of Portal access and class participation until all outstanding dues, including any applicable late fees, are fully settled.
        </p>
        <p className="mt-2">
          4.5 <strong>Refunds:</strong> {ACADEMY.name} does not offer refunds on tuition fees paid, except in circumstances where a class batch was cancelled by the academy with no alternative session or makeup slot provided.
        </p>
      </LegalSection>

      <LegalSection title="5. Conduct & Studio Etiquette">
        <p>
          5.1 Students and guardians are expected to behave respectfully toward all instructors, staff, and fellow students — both inside the studio facilities and within digital Portal communications.
        </p>
        <p className="mt-2">
          5.2 Any misuse of the Portal, including abusive messages, unsubstantiated complaints, or unauthorized sharing of proprietary content, will result in immediate suspension of Portal access.
        </p>
        <p className="mt-2">
          5.3 Students must arrive at least 5–10 minutes early, wear appropriate dance/workout attire with clean indoor footwear or bare feet, and strictly follow instructor safety protocols.
        </p>
      </LegalSection>

      <LegalSection title="6. Notifications & Official Communications">
        <p>
          6.1 By registering on the Portal, you consent to receiving class updates, schedule alerts, emergency cancellations, and announcements from {ACADEMY.name} via the Portal, WhatsApp, and email.
        </p>
        <p className="mt-2">
          6.2 You may opt out of promotional broadcasts at any time by contacting us directly. However, mandatory operational communications (schedule updates, fee reminders, batch changes) cannot be opted out of while actively enrolled.
        </p>
      </LegalSection>

      <LegalSection title="7. Privacy & Media Consent">
        <p>
          7.1 Personal information collected during registration (student name, age, contact numbers, medical notes, attendance) is stored securely and utilized solely for managing your enrolment and academy administration.
        </p>
        <p className="mt-2">
          7.2 We do not sell, rent, or trade your personal data to any third party under any circumstances.
        </p>
        <p className="mt-2">
          7.3 <strong>Media Consent:</strong> Photos or video recordings captured during studio training, recitals, or community showcases may be featured on Rhythmzz official social channels (@rhythmzzdance.live) and website for pedagogical and promotional showcases. If you or your minor child prefer not to be photographed, please inform studio management in writing at enrolment.
        </p>
      </LegalSection>

      <LegalSection title="8. Intellectual Property">
        <p>
          8.1 All choreography, training syllabi, music cuts, instructional videos, and curriculum frameworks developed at {ACADEMY.name} remain the exclusive intellectual property of the academy and may not be reproduced, re-taught commercially, or published externally without prior written authorization.
        </p>
      </LegalSection>

      <LegalSection title="9. Limitation of Liability & Medical Disclaimer">
        <p>
          9.1 Dance and acrobatics involve strenuous physical exertion. Participation is undertaken at the student&apos;s own risk. {ACADEMY.name} and its instructors will not be held liable for any accidental injury, physical strain, or loss of personal belongings.
        </p>
        <p className="mt-2">
          9.2 It is the student or parent&apos;s explicit responsibility to notify the instructor and management of any pre-existing medical conditions, cardiovascular concerns, injuries, or physical restrictions prior to commencing any class.
        </p>
      </LegalSection>

      <LegalSection title="10. Governing Law & Jurisdiction">
        <p>
          10.1 These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in Hyderabad / Secunderabad, Telangana.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact & Studio Management">
        <p>
          For questions, billing clarifications, or administrative assistance:
        </p>
        <div className="mt-3 text-sm text-ink-2 space-y-1">
          <p><strong>{ACADEMY.name}</strong></p>
          <p>{ACADEMY.address.full}</p>
          <p>Phone: <a href={`tel:${ACADEMY.phone}`} className="text-bl font-semibold">{ACADEMY.phoneDisplay}</a></p>
          <p>Email: <a href={`mailto:${ACADEMY.email}`} className="text-bl font-semibold">{ACADEMY.email}</a></p>
          <p>Founder &amp; Artistic Director: Nitish Kumar</p>
          <p>Studio Manager: Swapna Sujit</p>
        </div>
      </LegalSection>
    </LegalPage>
  );
}
