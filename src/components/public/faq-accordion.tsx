'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { homepageControlRadius } from '@/lib/ui/homepage-cta';
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
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-2.5">
      {parsedFaqs.map((faq, i) => {
        const isOpen = openIndex === i;
        const buttonId = `faq-button-${i}`;
        const panelId = `faq-panel-${i}`;
        return (
          <div
            key={i}
            className={cn(
              'border border-line overflow-hidden bg-surface',
              homepageControlRadius,
            )}
          >
            <button
              type="button"
              id={buttonId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full text-left px-4 sm:px-5 py-3.5 sm:py-4 flex justify-between items-center gap-4 hover:bg-canvas-muted/50 transition-colors cursor-pointer focus-visible:focus-ring min-h-11"
              onClick={() => toggle(i)}
            >
              <h4 className="font-semibold text-sm text-ink pr-4 leading-snug">{faq.question}</h4>
              <ChevronDown
                className={cn('shrink-0 text-ink-2 transition-transform duration-300', isOpen ? 'rotate-180' : 'rotate-0')}
                size={18}
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              className={cn(
                'overflow-hidden transition-all duration-300 ease-in-out',
                isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
              )}
            >
              <p className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 text-sm text-ink-2 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
