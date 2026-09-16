import { FAQAccordion } from '@/components/public/faq-accordion';
import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import { sectionPad } from '@/lib/ui/section-layout';

interface FAQSectionProps {
  faqs: { question: string; answer: string }[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <HomepageSection className={sectionPad}>
      <div className="flex flex-col items-center">
        <HomepageSectionHeading
          eyebrow="Questions parents ask"
          title="Frequently Asked Questions"
          className="mb-7 sm:mb-8 max-w-2xl text-center mx-auto"
        />
        <FAQAccordion faqs={faqs} />
      </div>
    </HomepageSection>
  );
}
