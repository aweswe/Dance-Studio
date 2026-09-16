import { FAQAccordion } from '@/components/public/faq-accordion';
import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';

interface FAQSectionProps {
  faqs: { question: string; answer: string }[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <HomepageSection className="py-16 sm:py-24">
      <div className="flex flex-col items-center">
        <HomepageSectionHeading
          eyebrow="Questions parents ask"
          title="FAQ"
          className="mb-7 sm:mb-8 max-w-2xl text-center mx-auto"
        />
        <FAQAccordion faqs={faqs} />
      </div>
    </HomepageSection>
  );
}
