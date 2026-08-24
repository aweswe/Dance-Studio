import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { ROUTES, PROGRAMME_THEMES } from '@/lib/utils/constants';
import { formatCurrency } from '@/lib/utils/format';

interface ProgrammeCardProps {
  programme: any; // Using any for simplicity in this task, should be properly typed from DB
  schedule?: { days: string; time: string; instructor?: string };
}

export function ProgrammeCard({ programme, schedule }: ProgrammeCardProps) {
  const theme = PROGRAMME_THEMES[programme.slug as keyof typeof PROGRAMME_THEMES] || PROGRAMME_THEMES['adults-dance'];
  const includes = Array.isArray(programme.includes) ? programme.includes : [];

  return (
    <div className={cn("rounded-2xl overflow-hidden relative", theme.card)}>
      {/* Accent Circle */}
      <div className={cn("absolute -top-5 -right-5 w-[120px] h-[120px] rounded-full opacity-10", theme.accent)} />
      
      {/* Recommended Badge (Optional logic) */}
      {programme.sort_order === 1 && (
        <div className={cn(
          "absolute top-5 right-5 text-[9px] tracking-[2px] uppercase font-bold py-1.5 px-3 rounded-full",
          programme.slug === 'adults-dance' ? "bg-gold text-black" : "bg-bl text-white"
        )}>
          Recommended
        </div>
      )}

      <div className="p-10 relative z-10">
        <div className={cn("inline-flex items-center gap-1.5 mb-4 text-[9px] tracking-[3px] uppercase font-bold py-1.5 px-3 rounded-full", theme.badge)}>
          {programme.age_group}
        </div>
        
        <h3 className="heading-display text-[34px] text-white mb-2">{programme.name}</h3>
        <p className="text-[11px] tracking-[2px] uppercase text-white/40 mb-5">{programme.description}</p>
        
        <ul className="list-none flex flex-col gap-1.5 mb-6">
          {includes.map((item: string, i: number) => (
            <li key={i} className="text-[13px] text-white/65 flex items-center gap-2">
              <span className={cn("text-[11px] font-bold shrink-0", theme.checkmark)}>✓</span>
              {item}
            </li>
          ))}
        </ul>

        {schedule && (
          <div className="bg-white/5 rounded-lg py-3 px-4 mb-5">
            <p className="text-[11px] text-white/50 mb-1 tracking-[0.5px]">Class schedule</p>
            <strong className="text-xs text-white/85 font-semibold block">
              {schedule.days} · {schedule.time}{schedule.instructor ? ` · by ${schedule.instructor}` : ''}
            </strong>
          </div>
        )}

        <div className="flex gap-3 flex-wrap mb-6">
          {programme.fees_monthly && (
            <div className={cn("rounded-lg py-2.5 px-4 text-center border", theme.chip)}>
              <div className="heading-display text-3xl text-white">{formatCurrency(programme.fees_monthly)}</div>
              <div className="text-[9px] tracking-[1.5px] uppercase text-white/40 mt-1">Monthly</div>
            </div>
          )}
          {programme.fees_quarterly && (
            <div className="bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-center">
              <div className="heading-display text-3xl text-white">{formatCurrency(programme.fees_quarterly)}</div>
              <div className="text-[9px] tracking-[1.5px] uppercase text-white/40 mt-1">Quarterly</div>
            </div>
          )}
        </div>
        
        <Link
          href={`${ROUTES.enrol}?programme=${programme.slug}`}
          className={cn("block w-full text-center text-[11px] font-semibold tracking-[2px] uppercase py-3.5 transition-all", theme.button)}
        >
          Enrol Now
        </Link>
      </div>
    </div>
  );
}
