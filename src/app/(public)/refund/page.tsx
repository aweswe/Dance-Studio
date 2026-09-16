import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/public/legal-page';
import { ACADEMY, SITE_URL } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Rhythmzz Academy of Dance',
  description: `How cancellations and refunds work for class fees and studio rental at ${ACADEMY.name}.`,
  alternates: { canonical: `${SITE_URL}/refund` },
};

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund policy"
      description="Last updated 16 September 2026. Applies to online and desk payments for classes and studio hire."
    >
      <LegalSection title="Trials">
        <p>The first trial class is free. No payment is collected for a trial, so there is nothing to refund.</p>
      </LegalSection>
      <LegalSection title="Class fees">
        <p>
          Monthly or quarterly fees are for a confirmed seat in a batch. If you cancel before the paid term starts, and
          the student has not attended a paid class, we refund the fee minus any payment-gateway charges. Once the term
          has started, fees are not refunded for unused sessions, including absence, travel, or a change of mind.
        </p>
      </LegalSection>
      <LegalSection title="Failed or duplicate payments">
        <p>
          If Razorpay or UPI deducts money but the enrolment is not confirmed, WhatsApp {ACADEMY.phoneDisplay} with the
          payment ID. We refund duplicate or failed-enrolment amounts after the payment provider confirms the credit.
        </p>
      </LegalSection>
      <LegalSection title="Studio rental">
        <p>
          Cancel a hire slot at least 24 hours before the booking for a full refund minus gateway charges. Same-day
          cancellations are not refunded unless the studio cannot be used for a reason on our side.
        </p>
      </LegalSection>
      <LegalSection title="How to request">
        <p>
          Message WhatsApp {ACADEMY.phoneDisplay} or email {ACADEMY.email} with the student name, programme, and payment
          ID. Approved refunds are returned to the original payment method within 7–10 bank working days.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
