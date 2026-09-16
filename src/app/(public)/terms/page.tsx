import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/public/legal-page';
import { ACADEMY, SITE_URL } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Rhythmzz Academy of Dance',
  description: `Terms for classes, studio rental, and online fee payments at ${ACADEMY.name}.`,
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & conditions"
      description={`Last updated 16 September 2026. By enrolling or paying online you agree to these terms.`}
    >
      <LegalSection title="The academy">
        <p>
          {ACADEMY.name} teaches dance and fitness at {ACADEMY.address.full}. Phone {ACADEMY.phoneDisplay}. Email{' '}
          {ACADEMY.email}.
        </p>
      </LegalSection>
      <LegalSection title="Enrolment">
        <p>
          A free trial does not guarantee a seat. A student is enrolled when fees for the month or quarter are paid and
          the desk confirms the batch. Parents or adult students are responsible for accurate age, medical notes, and
          emergency contact details.
        </p>
      </LegalSection>
      <LegalSection title="Fees and classes">
        <p>
          Monthly and quarterly fees are as published on the site or confirmed on WhatsApp. There is no registration
          fee. Missed classes are not automatically extended; message the desk if you will be away. Recitals, costumes,
          and exam fees are extra unless stated.
        </p>
      </LegalSection>
      <LegalSection title="Studio and conduct">
        <p>
          Indoor dance shoes or bare feet only. Follow instructor direction. Rhythmzz may refuse or discontinue a
          booking for unsafe behaviour or unpaid fees. Studio rental is a separate booking with its own slot rules.
        </p>
      </LegalSection>
      <LegalSection title="Online payment">
        <p>
          Paying through Razorpay or UPI is an offer to buy the selected programme term. A GST-style receipt is issued
          after the academy confirms the payment. Failed or cancelled checkouts do not enrol the student.
        </p>
      </LegalSection>
      <LegalSection title="Liability">
        <p>
          Dance involves physical activity. Students train at their own risk. Inform us of injury or medical limits
          before class. These terms are governed by the laws of India; courts in Hyderabad / Secunderabad have
          jurisdiction.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
