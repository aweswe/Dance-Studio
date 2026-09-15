import { } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight';

interface TestimonialCardProps {
  testimonial: any;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { name = 'Student', quote, text, programme } = testimonial || {};
  const quoteText = quote ?? text ?? 'Great experience!';

  return (
    <SpotlightCard
      tone="pale"
      className="bg-surface p-7 rounded-2xl border border-line h-full flex flex-col justify-between hover:border-line-strong transition-all duration-200"
    >
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green/10 text-green-ink border border-green/20 text-[11px] font-mono font-medium mb-4">
          
          <span>Verified Academy Review</span>
        </div>
        <p className="text-sm text-ink leading-[1.78] mb-6 italic">&quot;{quoteText}&quot;</p>
      </div>
      <div className="flex items-center gap-3 mt-auto">
        <div className="w-10 h-10 rounded-full bg-canvas-muted-2 flex items-center justify-center text-ink font-bold text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <h5 className="text-xs font-bold text-ink uppercase tracking-wider">{name}</h5>
          <p className="text-[10px] text-ink-2 uppercase tracking-widest">{programme ?? 'Rhythmzz Student'}</p>
        </div>
      </div>
    </SpotlightCard>
  );
}
