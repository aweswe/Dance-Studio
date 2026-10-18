import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/public/legal-page';
import { ACADEMY, SITE_URL } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | Rhythmzz Academy of Dance',
  description: `Official Shipping and Delivery Policy for physical gear orders and service fulfillment at ${ACADEMY.name}.`,
  alternates: { canonical: `${SITE_URL}/shipping` },
};

export default function ShippingPage() {
  return (
    <LegalPage
      title="Shipping &amp; delivery"
      description="Shipping and Service Delivery Guidelines · Effective Date: 1st January 2025 · Last Updated: October 2026."
    >
      <LegalSection title="1. Shipping Policy">
        <p>
          The orders for the user are shipped through registered domestic courier companies and/or speed post only.
        </p>
        <p>
          Orders are shipped within <strong>7 days</strong> from the date of the order and/or payment or as per the delivery date agreed at the time of order confirmation and delivering of the shipment, subject to courier company / post office norms.
        </p>
        <p>
          <strong>Platform Owner</strong> shall not be liable for any delay in delivery by the courier company / postal authority.
        </p>
        <p>
          Delivery of all orders will be made to the address provided by the buyer at the time of purchase.
        </p>
        <p>
          Delivery of our services will be confirmed on your email ID as specified at the time of registration.
        </p>
        <p>
          If there are any shipping cost(s) levied by the seller or the Platform Owner (as the case be), the same is not refundable.
        </p>
      </LegalSection>

      <LegalSection title="2. Rhythmzz Dance Gear &amp; Merchandise Orders">
        <p>
          For physical products purchased through our store (official dance hoodies, practice apparel, classical accessories, ghungroos, and dance wear), items are carefully inspected and securely packaged prior to handover to domestic courier partners or India Speed Post.
        </p>
        <p className="mt-2">
          Tracking references and dispatch alerts are shared via SMS, WhatsApp, and email once the package is dispatched.
        </p>
      </LegalSection>

      <LegalSection title="3. Academy Class Sessions &amp; Studio Hire Delivery">
        <p>
          Dance tuition, fitness classes, and studio rental are digital and in-person service bookings delivered at our registered studio facility:
        </p>
        <div className="mt-2 p-4 rounded-lg bg-slate-50 border-2 border-slate-200 text-xs sm:text-sm font-medium text-slate-900 space-y-1">
          <p><strong>Studio Location:</strong> {ACADEMY.address.full}</p>
          <p><strong>Service Confirmation:</strong> Immediate digital confirmation via WhatsApp desk and email upon verified booking.</p>
          <p><strong>Access Start:</strong> On the confirmed class batch commencement date or reserved studio hire slot time.</p>
        </div>
      </LegalSection>

      <LegalSection title="4. Shipping Support &amp; Delivery Questions">
        <p>
          For order tracking, delivery status, or service schedule queries, contact our desk:
        </p>
        <div className="mt-3 p-4 rounded-lg border-2 border-slate-200 bg-slate-50 space-y-1.5 text-xs sm:text-sm font-medium text-slate-900">
          <p><strong>Rhythmzz Academy of Dance</strong></p>
          <p>
            <strong>Phone / WhatsApp:</strong>{' '}
            <a href={`tel:${ACADEMY.phone}`} className="font-bold text-sky-900 underline hover:text-black">
              {ACADEMY.phoneDisplay}
            </a>
          </p>
          <p>
            <strong>Email:</strong>{' '}
            <a href={`mailto:${ACADEMY.email}`} className="font-bold text-sky-900 underline hover:text-black">
              {ACADEMY.email}
            </a>
          </p>
          <p><strong>Support Hours:</strong> Monday – Friday (09:00 – 18:00 IST)</p>
        </div>
      </LegalSection>
    </LegalPage>
  );
}
