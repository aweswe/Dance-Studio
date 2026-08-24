'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface FAQAccordionProps {
  faqs: { question: string; answer: string }[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const parsedFaqs = Array.isArray(faqs) ? faqs : [];

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      {parsedFaqs.map((faq, i) => {
        const isOpen = openIndex === i;
        const buttonId = `faq-button-${i}`;
        const panelId = `faq-panel-${i}`;
        return (
          <div key={i} className="border border-black/10 rounded-xl overflow-hidden bg-white">
            <button
              type="button"
              id={buttonId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full text-left p-6 flex justify-between items-center gap-4 hover:bg-off/50 transition-colors cursor-pointer"
              onClick={() => toggle(i)}
            >
              <h4 className="font-semibold text-sm md:text-base text-blk pr-4">{faq.question}</h4>
              <ChevronDown
                className={cn("shrink-0 text-mu transition-transform duration-300", isOpen ? "rotate-180" : "rotate-0")}
                size={20}
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <p className="p-6 pt-0 text-sm text-mu leading-relaxed border-t border-transparent">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
