"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils/format";
import { updateBatchSchedule } from "@/actions/classes";
import { CheckCircle2, ChevronDown, ChevronUp, Clock, Users } from "lucide-react";

interface BatchProps {
  batch: any;
}

export function BatchCard({ batch }: BatchProps) {
  const [expanded, setExpanded] = useState(false);
  const [timeStart, setTimeStart] = useState(batch.time_start || "17:00:00");
  const [timeEnd, setTimeEnd] = useState(batch.time_end || "18:00:00");
  const [isUpdating, setIsUpdating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUpdateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setSavedSuccess(false);
    try {
      const res = await updateBatchSchedule(batch.id, {
        time_start: timeStart,
        time_end: timeEnd,
      });
      if (res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="transition-all duration-200">
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer focus-visible:focus-ring active:scale-[0.98]"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-anton text-xl uppercase tracking-tight text-ink">{batch.name}</h3>
            <Badge variant="blue">{batch.status}</Badge>
          </div>
          <p className="text-sm text-ink-2">
            {Array.isArray(batch.days) ? batch.days.join(", ") : batch.days} | {formatTime(timeStart)} – {formatTime(timeEnd)}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-ink-2">
            <Users size={16} />
            <span>
              {batch.enrolled_count}/{batch.capacity} Students
            </span>
          </div>
          <div className="text-ink-2">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-6 pt-6 border-t border-line space-y-6">
          {/* Schedule Update Form */}
          <div className="p-4 rounded-md border border-line bg-canvas-muted/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-bl" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                  Update Class Schedule Timings
                </h4>
              </div>
              <span className="text-[10px] text-ink-3">
                Changes reflect live on student dashboard
              </span>
            </div>

            <form onSubmit={handleUpdateSchedule} className="flex flex-wrap items-end gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-ink-3 block">Start Time</label>
                <input
                  type="time"
                  value={timeStart.slice(0, 5)}
                  onChange={(e) => setTimeStart(`${e.target.value}:00`)}
                  className="px-3 py-1.5 rounded-md border border-line bg-canvas text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-bl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-ink-3 block">End Time</label>
                <input
                  type="time"
                  value={timeEnd.slice(0, 5)}
                  onChange={(e) => setTimeEnd(`${e.target.value}:00`)}
                  className="px-3 py-1.5 rounded-md border border-line bg-canvas text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-bl"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={isUpdating}
                className="h-8 px-4 text-xs font-bold"
              >
                {isUpdating ? "Saving..." : "Update Schedule Time"}
              </Button>

              {savedSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                  <CheckCircle2 size={14} />
                  <span>Schedule updated!</span>
                </div>
              )}
            </form>
          </div>

          {/* Student Roster */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Student Roster</h4>
            {batch.students && batch.students.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {batch.students.map((student: any) => (
                  <div
                    key={student.id}
                    className="p-3 bg-canvas border border-line rounded-md flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-canvas-muted border border-line flex items-center justify-center font-semibold text-xs">
                      {student.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold truncate">{student.name}</p>
                      <p className="text-xs text-ink-2 truncate">{student.student_id_display}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-2">No students enrolled yet.</p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
