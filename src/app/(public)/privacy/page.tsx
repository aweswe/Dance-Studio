import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/public/legal-page';
import { ACADEMY, SITE_URL } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy | Rhythmzz Academy of Dance',
  description: `How ${ACADEMY.name} collects, uses, and protects student and parent information.`,
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      description={`Last updated 16 September 2026. ${ACADEMY.name}, ${ACADEMY.address.full}.`}
    >
      <LegalSection title="Who we are">
        <p>
          {ACADEMY.name} (“Rhythmzz”, “we”) runs dance and fitness classes at {ACADEMY.address.full}. Contact:{' '}
          <a className="text-bl underline-offset-2 hover:underline" href={`mailto:${ACADEMY.email}`}>
            {ACADEMY.email}
          </a>{' '}
          or {ACADEMY.phoneDisplay}.
        </p>
      </LegalSection>
      <LegalSection title="What we collect">
        <p>
          When you enquire, book a trial, enrol, rent the studio, RSVP to an event, or pay fees, we may collect name,
          student age, parent or guardian name, mobile number, email, programme and batch preference, and payment
          confirmation details from Razorpay or UPI. We do not store full card numbers on our servers.
        </p>
      </LegalSection>
      <LegalSection title="How we use it">
        <p>
          We use this information to confirm classes, send WhatsApp or email updates, issue GST-style receipts, run the
          student portal, process refunds, and meet accounting and legal requirements. We do not sell personal data.
        </p>
      </LegalSection>
      <LegalSection title="Payments">
        <p>
          Online payments are processed by Razorpay. Razorpay’s privacy terms apply to card, UPI, and net-banking data
          handled on their checkout. We only receive payment status, order ID, and payment ID needed to mark fees paid.
        </p>
      </LegalSection>
      <LegalSection title="Sharing">
        <p>
          We share data with instructors for batch lists, with payment and hosting providers as needed to run the site,
          and with authorities if required by law. Photos from classes or recitals are used on the website and social
          channels unless you ask us in writing not to.
        </p>
      </LegalSection>
      <LegalSection title="Retention and your rights">
        <p>
          Enrolment and payment records are kept for the period required under Indian tax and company rules. WhatsApp us
          or email {ACADEMY.email} to access, correct, or request deletion of data we are not required to keep.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
