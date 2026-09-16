import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/public/legal-page';
import { ACADEMY, SITE_URL } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | Rhythmzz Academy of Dance',
  description: `How ${ACADEMY.name} delivers classes and studio bookings. Required for online payment verification.`,
  alternates: { canonical: `${SITE_URL}/shipping` },
};

export default function ShippingPage() {
  return (
    <LegalPage
      title="Shipping & delivery"
      description="Last updated 16 September 2026. We do not ship physical goods. This page is for payment-gateway verification."
    >
      <LegalSection title="What you are buying">
        <p>
          Online payments on this website are for dance or fitness class fees, or for hire of the studio at{' '}
          {ACADEMY.address.full}. No merchandise, kits, or parcels are dispatched by courier.
        </p>
      </LegalSection>
      <LegalSection title="How the service is delivered">
        <p>
          Classes are delivered in person at the academy during the confirmed batch days and times. Studio rental is
          delivered as access to the room for the booked hour(s). There is no shipping time, tracking number, or
          delivery PIN beyond attending the studio.
        </p>
      </LegalSection>
      <LegalSection title="When access starts">
        <p>
          After a successful Razorpay or UPI payment, the desk confirms the batch or slot on WhatsApp, usually the same
          day if it is not a class hour. The paid term starts on the date we confirm, not on a courier delivery date.
        </p>
      </LegalSection>
      <LegalSection title="Questions">
        <p>
          WhatsApp {ACADEMY.phoneDisplay} or email {ACADEMY.email} if a payment succeeded and you have not received a
          batch confirmation.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
