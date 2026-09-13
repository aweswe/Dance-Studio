'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { KATHAK_SYLLABUS } from '@/data/kathak-syllabus';
import { cn } from '@/lib/utils/cn';

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="space-y-2 text-sm text-ink-2 leading-relaxed">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="text-[#7C5CFC] shrink-0">·</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function KathakSyllabusLevels() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-10">
      <ol className="divide-y divide-line border-y border-line">
        {KATHAK_SYLLABUS.levels.map((item) => {
          const isOpen = open === item.level;
          return (
            <li key={item.level}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.level)}
                className="w-full flex items-start gap-4 py-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-mono text-[11px] text-ink-3 w-8 shrink-0 pt-1">
                  {String(item.level).padStart(2, '0')}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="font-anton text-lg sm:text-xl uppercase tracking-tight text-ink block">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#7C5CFC] mt-1 block">
                    {item.stage}
                  </span>
                  {!isOpen && (
                    <span className="text-sm text-ink-2 mt-2 block line-clamp-2">{item.focus}</span>
                  )}
                </span>
                <ChevronDown
                  size={16}
                  className={cn('text-ink-3 shrink-0 mt-1 transition-transform', isOpen && 'rotate-180')}
                />
              </button>
              {isOpen && (
                <div className="pl-12 pr-2 pb-6 space-y-5 max-w-xl">
                  <p className="text-sm text-ink leading-relaxed">{item.focus}</p>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-ink-3 mb-2">
                      On the floor
                    </p>
                    <BulletList items={item.technical} />
                  </div>
                  {item.theory.length > 0 && (
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-ink-3 mb-2">
                        Theory & repertoire
                      </p>
                      <BulletList items={item.theory} />
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {KATHAK_SYLLABUS.outcomes.map(({ title, text }) => (
          <div key={title} className="rounded-2xl border border-line p-5">
            <p className="font-anton text-base uppercase tracking-tight text-ink mb-1">{title}</p>
            <p className="text-sm text-ink-2 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
