'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface ScheduleFilterProps {
  batches: any[];
}

export function ScheduleFilter({ batches }: ScheduleFilterProps) {
  const [activeDay, setActiveDay] = useState<string>('All');
  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Process batches based on days
  // Just a basic implementation, need more logic depending on actual data structure
  const filteredBatches = activeDay === 'All' 
    ? batches 
    : batches.filter(b => b.days?.includes(activeDay));

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-8">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={cn(
              "text-[11px] tracking-[1.5px] uppercase py-2 px-4.5 bg-transparent border rounded text-mu cursor-pointer transition-all",
              activeDay === day ? "bg-blk text-white border-blk" : "border-[#DDD] hover:bg-blk hover:text-white hover:border-blk"
            )}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="grid gap-8">
        {/* Render filtered batches here grouped by day or just list them */}
        <div className="day-block">
          {filteredBatches.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredBatches.map((batch, i) => (
                <div key={i} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-bold">{batch.programme?.name}</h4>
                    <p className="text-sm text-gray-500">{batch.days?.join(', ')} • {batch.time_start} - {batch.time_end}</p>
                    <p className="text-xs text-gray-400">By {batch.instructor?.name}</p>
                  </div>
                  <div className="bg-bl/10 text-bl text-xs px-2 py-1 rounded">
                    {batch.capacity - batch.enrolled_count} slots left
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-mu text-sm">No batches found for {activeDay}.</p>
          )}
        </div>
      </div>
    </div>
  );
}
