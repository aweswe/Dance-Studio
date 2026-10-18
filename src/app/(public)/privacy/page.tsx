import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/public/legal-page';
import { ACADEMY, SITE_URL } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy | Rhythmzz Academy of Dance',
  description: `Official Privacy Policy and data protection practices of ${ACADEMY.name} and platform https://rhythmzzdance.com/.`,
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      description={`Official Privacy Policy and Data Protection Framework · Effective Date: 1st January 2025 · Last Updated: October 2026. ${ACADEMY.name}, Sainikpuri / Neredmet, Hyderabad.`}
    >
      <LegalSection title="1. Introduction">
        <p>
          This Privacy Policy describes how <strong>Rhythmzz Academy of Dance</strong> and its affiliates (collectively &ldquo;Rhythmzz Academy of Dance&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) collect, use, share, protect or otherwise process your information / personal data through our website Platform{' '}
          <a href="https://rhythmzzdance.com/" target="_blank" rel="noopener noreferrer" className="font-bold text-sky-900 underline hover:text-black">
            https://rhythmzzdance.com/
          </a>{' '}
          (hereinafter referred to as &lsquo;Platform&rsquo;).
        </p>
        <p>
          Please note that you may be able to browse certain sections of the Platform without registering with us. We do not offer any product/service under this Platform outside India and your personal data will primarily be stored and processed in India.
        </p>
        <p>
          By visiting this Platform, providing your information or availing any product/service offered on the Platform, you expressly agree to be bound by the terms and conditions of this Privacy Policy, the Terms of Use and the applicable service/product terms and conditions, and agree to be governed by the laws of India including but not limited to the laws applicable to data protection and privacy. If you do not agree please do not use or access our Platform.
        </p>
      </LegalSection>

      <LegalSection title="2. Collection of Information">
        <p>
          We collect your personal data when you use our Platform, services or otherwise interact with us during the course of our relationship and related information provided from time to time.
        </p>
        <p>
          Some of the information that we may collect includes but is not limited to personal data / information provided to us during sign-up/registering or using our Platform such as name, date of birth, address, telephone/mobile number, email ID and/or any such information shared as proof of identity or address.
        </p>
        <p>
          Some of the sensitive personal data may be collected with your consent, such as your bank account or credit or debit card or other payment instrument information or biometric information such as your facial features or physiological information (in order to enable use of certain features when opted for, available on the Platform) etc., all of the above being in accordance with applicable law(s).
        </p>
        <p>
          You always have the option to not provide information, by choosing not to use a particular service or feature on the Platform. We may track your behaviour, preferences, and other information that you choose to provide on our Platform. This information is compiled and analysed on an aggregated basis.
        </p>
        <p>
          We will also collect your information related to your transactions on Platform and such third-party business partner platforms. When such a third-party business partner collects your personal data directly from you, you will be governed by their privacy policies. We shall not be responsible for the third-party business partner&apos;s privacy practices or the content of their privacy policies, and we request you to read their privacy policies prior to disclosing any information.
        </p>
        <div className="p-4 rounded-md border-2 border-red-300 bg-red-50 text-xs sm:text-sm text-slate-900 leading-relaxed">
          <strong className="text-red-900 font-bold block mb-1">Important Phishing &amp; Fraud Advisory:</strong>
          If you receive an email or a call from a person/association claiming to be Rhythmzz Academy of Dance seeking any personal data like debit/credit card PIN, net-banking or mobile banking password, we request you to never provide such information. If you have already revealed such information, report it immediately to an appropriate law enforcement agency.
        </div>
      </LegalSection>

      <LegalSection title="3. Usage of Personal Data">
        <p>
          We use personal data to provide the services you request. To the extent we use your personal data to market to you, we will provide you the ability to opt-out of such uses.
        </p>
        <p>
          We use your personal data to assist sellers and business partners in handling and fulfilling orders; enhancing customer experience; to resolve disputes; troubleshoot problems; inform you about online and offline offers, products, services, and updates; customise your experience; detect and protect us against error, fraud and other criminal activity; enforce our terms and conditions; conduct marketing research, analysis and surveys; and as otherwise described to you at the time of collection of information.
        </p>
        <p>
          You understand that your access to these products/services may be affected in the event permission is not provided to us.
        </p>
      </LegalSection>

      <LegalSection title="4. Sharing of Information">
        <p>
          We may share your personal data internally within our group entities, our other corporate entities, and affiliates to provide you access to the services and products offered by them. These entities and affiliates may market to you as a result of such sharing unless you explicitly opt-out.
        </p>
        <p>
          We may disclose personal data to third parties such as sellers, business partners, third party service providers including logistics partners, prepaid payment instrument issuers, third-party reward programs and other payment providers opted by you (including PhonePe and authorized UPI payment gateways). These disclosures may be required for us to provide you access to our services and products offered to you, to comply with our legal obligations, to enforce our user agreement, to facilitate our marketing and advertising activities, to prevent, detect, mitigate, and investigate fraudulent or illegal activities related to our services.
        </p>
        <p>
          We may disclose personal and sensitive personal data to government agencies or other authorised law enforcement agencies if required to do so by law or in the good faith belief that such disclosure is reasonably necessary to respond to subpoenas, court orders, or other legal process.
        </p>
        <p>
          We may disclose personal data to law enforcement offices, third party rights owners, or others in the good faith belief that such disclosure is reasonably necessary to: enforce our Terms of Use or Privacy Policy; respond to claims that an advertisement, posting or other content violates the rights of a third party; or protect the rights, property or personal safety of our users or the general public.
        </p>
      </LegalSection>

      <LegalSection title="5. Security Precautions">
        <p>
          To protect your personal data from unauthorised access or disclosure, loss or misuse we adopt reasonable security practices and procedures. Once your information is in our possession or whenever you access your account information, we adhere to our security guidelines to protect it against unauthorised access and offer the use of a secure server.
        </p>
        <p>
          However, the transmission of information is not completely secure for reasons beyond our control. By using the Platform, the users accept the security implications of data transmission over the internet and the World Wide Web which cannot always be guaranteed as completely secure, and therefore, there would always remain certain inherent risks regarding use of the Platform.
        </p>
        <p>
          Users are responsible for ensuring the protection of login and password records for their account.
        </p>
      </LegalSection>

      <LegalSection title="6. Data Deletion and Retention">
        <p>
          You have an option to delete your account by visiting your profile and settings on our Platform; this action would result in you losing all information related to your account. You may also write to us at the contact information provided below to assist you with these requests.
        </p>
        <p>
          We may in event of any pending grievance, claims, pending shipments or any other services refuse or delay deletion of the account. Once the account is deleted, you will lose access to the account.
        </p>
        <p>
          We retain your personal data information for a period no longer than is required for the purpose for which it was collected or as required under any applicable law. However, we may retain data related to you if we believe it may be necessary to prevent fraud or future abuse or for other legitimate purposes. We may continue to retain your data in anonymised form for analytical and research purposes.
        </p>
      </LegalSection>

      <LegalSection title="7. Your Rights">
        <p>
          You may access, rectify, and update your personal data directly through the functionalities provided on the Platform or by writing to our Grievance Officer.
        </p>
      </LegalSection>

      <LegalSection title="8. Consent &amp; Withdrawal">
        <p>
          By visiting our Platform or by providing your information, you consent to the collection, use, storage, disclosure and otherwise processing of your information on the Platform in accordance with this Privacy Policy. If you disclose to us any personal data relating to other people, you represent that you have the authority to do so and permit us to use the information in accordance with this Privacy Policy.
        </p>
        <p>
          You, while providing your personal data over the Platform or any partner platforms or establishments, consent to us (including our other corporate entities, affiliates, lending partners, technology partners, marketing channels, business partners and other third parties) to contact you through SMS, instant messaging apps, call and/or e-mail for the purposes specified in this Privacy Policy.
        </p>
        <p>
          You have an option to withdraw your consent that you have already provided by writing to the Grievance Officer at the contact information provided below. Please mention &ldquo;Withdrawal of consent for processing personal data&rdquo; in the subject line of your communication. We may verify such requests before acting on your request. However, please note that your withdrawal of consent will not be retrospective and will be in accordance with the Terms of Use, this Privacy Policy, and applicable laws. In the event you withdraw consent given to us under this Privacy Policy, we reserve the right to restrict or deny the provision of our services for which we consider such information to be necessary.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to this Privacy Policy">
        <p>
          Please check our Privacy Policy periodically for changes. We may update this Privacy Policy to reflect changes to our information practices. We may alert / notify you about the significant changes to the Privacy Policy, in the manner as may be required under applicable laws.
        </p>
      </LegalSection>

      <LegalSection title="10. Grievance Officer &amp; Contact Information">
        <p>
          In accordance with the Information Technology Act, 2000 and the Rules made there under, the name and contact details of the Grievance Officer are provided below:
        </p>
        <div className="mt-3 p-4 rounded-lg border-2 border-slate-200 bg-slate-50 space-y-1.5 text-xs sm:text-sm font-medium text-slate-900">
          <p><strong>Name of the Officer:</strong> Studio Grievance Officer</p>
          <p><strong>Designation:</strong> Grievance Officer</p>
          <p><strong>Name and Address of Company:</strong> Rhythmzz Academy of Dance, Plot 597, 3rd Floor, Above Jawed Habib, Defence Colony, Jawahar Nagar, Sainikpuri / Neredmet, Secunderabad, Hyderabad, Telangana 500094, India</p>
          <p>
            <strong>Phone:</strong>{' '}
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
          <p><strong>Operating Hours:</strong> Monday – Friday (09:00 – 18:00 IST)</p>
        </div>
      </LegalSection>
    </LegalPage>
  );
}
