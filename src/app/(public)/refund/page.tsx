import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/public/legal-page';
import { ACADEMY, SITE_URL } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: 'Refund, Cancellation & Return Policy | Rhythmzz Academy of Dance',
  description: `Official Refund, Cancellation, and Return policies for products, studio hire, and class services at ${ACADEMY.name}.`,
  alternates: { canonical: `${SITE_URL}/refund` },
};

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund &amp; Return Policy"
      description="Refund, Cancellation, and Return Policy · Effective Date: 1st January 2025 · Last Updated: October 2026."
    >
      <LegalSection title="1. Refund and Cancellation Policy">
        <p>
          This refund and cancellation policy outlines how you can cancel or seek a refund for a product / service that you have purchased through the Platform:
        </p>
        <ul className="list-decimal pl-5 space-y-2 mt-2">
          <li>
            Cancellations will only be considered if the request is made within <strong>1 day</strong> of placing the order. However, cancellation requests may not be entertained if the orders have been communicated to such sellers / merchant(s) listed on the Platform and they have initiated the process of shipping them, or the product is out for delivery. In such an event, you may choose to reject the product at the doorstep.
          </li>
          <li>
            <strong>Rhythmzz Academy of Dance</strong> does not accept cancellation requests for perishable items like flowers, eatables, etc. However, the refund / replacement can be made if the user establishes that the quality of the product delivered is not good.
          </li>
          <li>
            In case of receipt of damaged or defective items, please report to our customer service team. The request would be entertained once the seller / merchant listed on the Platform has checked and determined the same at its own end. This should be reported within <strong>1 day</strong> of receipt of products.
          </li>
          <li>
            In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within <strong>1 day</strong> of receiving the product. The customer service team after looking into your complaint will take an appropriate decision.
          </li>
          <li>
            In case of complaints regarding products that come with a warranty from the manufacturers, please refer the issue to them directly.
          </li>
          <li>
            In case of any refunds approved by <strong>Rhythmzz Academy of Dance</strong>, it will take <strong>7 days</strong> for the refund to be processed to you.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Return &amp; Exchange Policy">
        <p>
          We offer refund / exchange within the first <strong>7 days</strong> from the date of your purchase. If 7 days have passed since your purchase, you will not be offered a return, exchange or refund of any kind.
        </p>
        <p className="font-semibold text-slate-950 mt-2">
          In order to become eligible for a return or an exchange:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-1 text-slate-800">
          <li>The purchased item should be unused and in the same condition as you received it.</li>
          <li>The item must have original packaging.</li>
          <li>If the item was purchased on a sale, then the item may not be eligible for a return / exchange.</li>
        </ul>
        <p className="mt-2">
          Further, only such items are replaced by us (based on an exchange request), if such items are found defective or damaged.
        </p>
        <p>
          You agree that there may be a certain category of products / items that are exempted from returns or refunds. Such categories of products would be identified to you at the time of purchase.
        </p>
        <p>
          For exchange / return accepted request(s) (as applicable), once your returned product / item is received and inspected by us, we will send you an email to notify you about receipt of the returned / exchanged product. Further, if the same has been approved after the quality check at our end, your request (i.e. return / exchange) will be processed in accordance with our policies.
        </p>
      </LegalSection>

      <LegalSection title="3. Academy Class Fees &amp; Free Trials">
        <p>
          <strong>Trials:</strong> The first trial class is on us. No payment is collected for a trial session, so there is no fee to refund.
        </p>
        <p className="mt-2">
          <strong>Class Fees:</strong> Monthly, quarterly, or annual fees are paid for a confirmed seat in a scheduled batch. If you cancel before the paid term starts and the student has not attended a paid class, we refund the fee minus any applicable gateway processing charges. Once the term has started, fees are not refunded for unused sessions, absence, travel, or change of schedule.
        </p>
      </LegalSection>

      <LegalSection title="4. Studio Rental Cancellations">
        <p>
          To cancel a studio rental booking, inform the studio at least <strong>24 hours</strong> before the scheduled booking for a full refund minus gateway charges. Same-day cancellations are non-refundable unless the studio cannot be made available due to unforeseen circumstances on our end.
        </p>
      </LegalSection>

      <LegalSection title="5. Failed or Duplicate Payments &amp; Processing Timeline">
        <p>
          If PhonePe, UPI, or your bank deducts money but the transaction is not confirmed on the Platform, WhatsApp{' '}
          <a href={`tel:${ACADEMY.phone}`} className="font-bold text-sky-900 underline hover:text-black">
            {ACADEMY.phoneDisplay}
          </a>{' '}
          or email{' '}
          <a href={`mailto:${ACADEMY.email}`} className="font-bold text-sky-900 underline hover:text-black">
            {ACADEMY.email}
          </a>{' '}
          with your transaction ID / UTR number.
        </p>
        <p className="mt-2">
          All approved refunds are credited back to the original source payment instrument within <strong>7 days</strong>.
        </p>
      </LegalSection>

      <LegalSection title="6. How to Request a Refund or Return">
        <p>
          To submit a cancellation, return, or refund inquiry, contact our team:
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
          <p><strong>Address:</strong> {ACADEMY.address.full}</p>
          <p><strong>Desk Hours:</strong> Monday – Friday (09:00 – 18:00 IST)</p>
        </div>
      </LegalSection>
    </LegalPage>
  );
}
