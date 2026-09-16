"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { getAttendanceReport, markAttendance, markStudentAsLeft } from "@/actions/attendance";
import { Check, X, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Student {
  id: string;
  name: string;
}

interface Batch {
  id: string;
  name?: string | null;
  days?: string[] | null;
  students: Student[];
}

interface AttendanceMarkerProps {
  batches: Batch[];
  initialBatchId?: string;
}

function batchLabel(batch: Batch) {
  return batch.name || (Array.isArray(batch.days) ? batch.days.join(", ") : "Batch");
}

export function AttendanceMarker({ batches, initialBatchId }: AttendanceMarkerProps) {
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    () =>
      initialBatchId && batches.some((b) => b.id === initialBatchId)
        ? initialBatchId
        : batches[0]?.id || "",
  );
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);

  const selectedBatch = batches.find((b) => b.id === selectedBatchId);
  const rawStudents = useMemo(() => selectedBatch?.students ?? [], [selectedBatch]);
  const [removedStudentIds, setRemovedStudentIds] = useState<string[]>([]);

  const students = useMemo(
    () => rawStudents.filter((s) => !removedStudentIds.includes(s.id)),
    [rawStudents, removedStudentIds],
  );

  const studentKey = useMemo(() => students.map((s) => s.id).join("|"), [students]);
  const defaults = useMemo(
    () =>
      Object.fromEntries(
        (studentKey ? studentKey.split("|").filter(Boolean) : []).map((id) => [id, "present" as const]),
      ) as Record<string, "present" | "absent">,
    [studentKey],
  );
  const loadKey = `${selectedBatchId}|${date}|${studentKey}`;

  const [savedMarks, setSavedMarks] = useState<{
    key: string;
    value: Record<string, "present" | "absent">;
  } | null>(null);
  const attendance = savedMarks?.key === loadKey ? savedMarks.value : defaults;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pendingLeaveOut, setPendingLeaveOut] = useState<Student | null>(null);
  const [leaveOutBusy, setLeaveOutBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!selectedBatchId) return;

    (async () => {
      const res = await getAttendanceReport(selectedBatchId, date);
      if (cancelled || !res.success) return;
      const next = { ...defaults };
      for (const m of res.marked ?? []) {
        if (m.student_id && (m.status === "present" || m.status === "absent")) {
          next[m.student_id] = m.status;
        }
      }
      setSavedMarks({ key: loadKey, value: next });
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedBatchId, date, studentKey, defaults, loadKey]);

  const handleStatusChange = (studentId: string, status: "present" | "absent") => {
    setSavedMarks({
      key: loadKey,
      value: { ...attendance, [studentId]: status },
    });
  };

  const handleSubmit = async () => {
    if (!selectedBatchId) return;

    setIsSubmitting(true);
    setMessage(null);

    const records = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      status,
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

  const confirmLeaveOut = async () => {
    if (!pendingLeaveOut) return;
    setLeaveOutBusy(true);
    setMessage(null);

    const res = await markStudentAsLeft(pendingLeaveOut.id);
    setLeaveOutBusy(false);

    if (res.success) {
      setRemovedStudentIds((prev) => [...prev, pendingLeaveOut.id]);
      setMessage({
        type: "success",
        text: `"${pendingLeaveOut.name}" marked as leave out student (status: left, unassigned from batch).`,
      });
      setPendingLeaveOut(null);
    } else {
      setMessage({
        type: "error",
        text: res.error || "Failed to mark student as leave out.",
      });
      setPendingLeaveOut(null);
    }
  };

  if (batches.length === 0) {
    return <Card><p className="text-ink-2">No batches found. Create a class first.</p></Card>;
  }

  return (
    <Card>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2">Select Batch</label>
          <select
            className="w-full p-3 rounded-md border border-line bg-surface focus-visible:focus-ring"
            value={selectedBatchId}
            onChange={(e) => {
              setSelectedBatchId(e.target.value);
              setRemovedStudentIds([]);
            }}
          >
            {batches.map((b) => (
              <option key={b.id} value={b.id}>{batchLabel(b)}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2">Date</label>
          <input
            type="date"
            className="w-full p-3 rounded-md border border-line bg-surface focus-visible:focus-ring"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-md mb-6 ${message.type === "success" ? "bg-green/10 text-green" : "bg-danger/10 text-danger-deep"}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-3 mb-8">
        {students.length > 0 ? (
          students.map((student) => (
            <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-canvas-muted-2 rounded-md gap-4">
              <span className="font-medium text-ink">{student.name}</span>

              <div className="flex flex-wrap items-center gap-3">
                {/* Present / Absent toggle only */}
                <div className="flex bg-surface rounded-md border border-line overflow-hidden w-full sm:w-auto">
                  <button
                    type="button"
                    className={cn(
                      "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold transition-colors focus-visible:focus-ring active:scale-[0.98]",
                      attendance[student.id] === "present" ? "bg-green text-white" : "hover:bg-canvas-muted-2 text-ink-2"
                    )}
                    onClick={() => handleStatusChange(student.id, "present")}
                  >
                    <Check size={16} /> Present
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold transition-colors border-l border-line focus-visible:focus-ring active:scale-[0.98]",
                      attendance[student.id] === "absent" ? "bg-danger text-white" : "hover:bg-canvas-muted-2 text-ink-2"
                    )}
                    onClick={() => handleStatusChange(student.id, "absent")}
                  >
                    <X size={16} /> Absent
                  </button>
                </div>

                {/* Option to mark as leave out student */}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-xs text-red-600 hover:text-red-700 hover:bg-red-500/10 border border-red-500/30 flex items-center justify-center gap-1.5 w-full sm:w-auto"
                  title="Mark student as leave out (abandoning / left the platform)"
                  onClick={() => setPendingLeaveOut(student)}
                >
                  <UserMinus size={14} /> Leave out student
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-ink-2 text-center py-4">No active students in this batch.</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={students.length === 0}>
          Submit Attendance
        </Button>
      </div>

      <ConfirmModal
        isOpen={!!pendingLeaveOut}
        title="Mark as Leave Out Student?"
        description={`Are you sure you want to mark "${pendingLeaveOut?.name}" as a leave out student? Their status will be set to 'left', they will be unassigned from this batch, and their portal access will be revoked.`}
        confirmLabel="Confirm Leave Out"
        danger
        busy={leaveOutBusy}
        onConfirm={confirmLeaveOut}
        onClose={() => setPendingLeaveOut(null)}
      />
    </Card>
  );
}
