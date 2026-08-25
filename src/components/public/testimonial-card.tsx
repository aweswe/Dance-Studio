import { Star } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight';

interface TestimonialCardProps {
  testimonial: any; // Ideally typed
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { name = 'Student', quote, text, rating = 5, programme } = testimonial || {};
  // Defaults use `quote`; legacy rows may carry `text`.
  const quoteText = quote ?? text ?? 'Great experience!';

  return (
    <SpotlightCard
      tone="pale"
      className="bg-surface p-8 rounded-2xl border border-line h-full flex flex-col"
    >
      <div className="flex gap-1 mb-4 text-gold">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill={i < rating ? "currentColor" : "none"} strokeWidth={i < rating ? 0 : 1} />
        ))}
      </div>
      <p className="text-sm text-ink leading-[1.78] mb-6 italic">&quot;{quoteText}&quot;</p>
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
