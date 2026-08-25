"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { markAttendance } from "@/actions/attendance";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Student {
  id: string;
  name: string;
}

interface Batch {
  id: string;
  name: string;
  students: Student[];
}

interface AttendanceMarkerProps {
  batches: Batch[];
  initialBatchId?: string;
}

export function AttendanceMarker({ batches, initialBatchId }: AttendanceMarkerProps) {
  const [selectedBatchId, setSelectedBatchId] = useState<string>(initialBatchId || batches[0]?.id || "");
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const selectedBatch = batches.find(b => b.id === selectedBatchId);
  const students = selectedBatch?.students || [];

  const [attendance, setAttendance] = useState<Record<string, "present" | "absent" | "leave">>(
    students.reduce((acc, s) => ({ ...acc, [s.id]: "present" }), {})
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const handleStatusChange = (studentId: string, status: "present" | "absent" | "leave") => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBatchId = e.target.value;
    setSelectedBatchId(newBatchId);
    
    const newBatch = batches.find(b => b.id === newBatchId);
    if (newBatch) {
      setAttendance(newBatch.students.reduce((acc, s) => ({ ...acc, [s.id]: "present" }), {}));
    }
  };

  const handleSubmit = async () => {
    if (!selectedBatchId) return;
    
    setIsSubmitting(true);
    setMessage(null);

    const records = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      status
    }));

    try {
      const result = await markAttendance(selectedBatchId, date, records);
      if (result.success) {
        setMessage({ type: "success", text: "Attendance marked successfully." });
      } else {
        setMessage({ type: "error", text: result.error || "Failed to mark attendance." });
      }
    } catch {
      setMessage({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (batches.length === 0) {
    return <Card><p className="text-ink-2">You have no assigned classes.</p></Card>;
  }

  return (
    <Card>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2">Select Batch</label>
          <select
            className="w-full p-3 rounded-lg border border-line bg-surface focus-visible:focus-ring"
            value={selectedBatchId}
            onChange={handleBatchChange}
          >
            {batches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2">Date</label>
          <input
            type="date"
            className="w-full p-3 rounded-lg border border-line bg-surface focus-visible:focus-ring"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.type === "success" ? "bg-green/10 text-green" : "bg-danger/10 text-danger-deep"}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-3 mb-8">
        {students.length > 0 ? (
          students.map(student => (
            <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-canvas-muted-2 rounded-lg gap-4">
              <span className="font-medium">{student.name}</span>

              <div className="flex bg-surface rounded-lg border border-line overflow-hidden">
                <button
                  className={cn("flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold transition-colors focus-visible:focus-ring active:scale-[0.98]",
                    attendance[student.id] === "present" ? "bg-green text-white" : "hover:bg-canvas-muted-2"
                  )}
                  onClick={() => handleStatusChange(student.id, "present")}
                >
                  <Check size={16} /> Present
                </button>
                <button
                  className={cn("flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold transition-colors border-l border-r border-line focus-visible:focus-ring active:scale-[0.98]",
                    attendance[student.id] === "absent" ? "bg-danger text-white" : "hover:bg-canvas-muted-2"
                  )}
                  onClick={() => handleStatusChange(student.id, "absent")}
                >
                  <X size={16} /> Absent
                </button>
                <button
                  className={cn("flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold transition-colors focus-visible:focus-ring active:scale-[0.98]",
                    attendance[student.id] === "leave" ? "bg-gold text-black" : "hover:bg-canvas-muted-2"
                  )}
                  onClick={() => handleStatusChange(student.id, "leave")}
                >
                  <Minus size={16} /> Leave
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-ink-2 text-center py-4">No students found in this batch.</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={students.length === 0}>
          Submit Attendance
        </Button>
      </div>
    </Card>
  );
}
