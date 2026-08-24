"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/lib/utils/format";
import { useState } from "react";
import { ChevronDown, ChevronUp, Users } from "lucide-react";

interface BatchProps {
  batch: any;
}

export function BatchCard({ batch }: BatchProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="transition-all duration-200">
      <div 
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-display text-2xl">{batch.name}</h3>
            <Badge variant="blue">{batch.status}</Badge>
          </div>
          <p className="text-sm text-mu">
            {batch.days.join(", ")} | {formatTime(batch.time_start)} - {formatTime(batch.time_end)}
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-mu">
            <Users size={16} />
            <span>{batch.enrolled_count}/{batch.capacity} Students</span>
          </div>
          <div className="text-mu">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-6 pt-6 border-t border-black/5">
          <h4 className="font-semibold text-sm mb-3">Student Roster</h4>
          {batch.students && batch.students.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {batch.students.map((student: any) => (
                <div key={student.id} className="p-3 bg-black/5 rounded-lg flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-xs">
                    {student.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold truncate">{student.name}</p>
                    <p className="text-xs text-mu truncate">{student.student_id_display}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-mu">No students enrolled yet.</p>
          )}
        </div>
      )}
    </Card>
  );
}
