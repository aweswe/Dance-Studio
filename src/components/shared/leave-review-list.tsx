"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { reviewLeaveRequest } from "@/actions/studio";
import { useRouter } from "next/navigation";

interface LeaveRow {
  id: string;
  date: string;
  kind: string;
  status: string;
  notes: string | null;
  student?: { name: string } | null;
}

export function LeaveReviewList({ requests }: { requests: LeaveRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  if (requests.length === 0) {
    return <p className="text-sm text-ink-2">No pending leave or makeup requests.</p>;
  }

  return (
    <div className="space-y-3">
      {requests.map((r) => (
        <Card key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="font-medium text-ink">{r.student?.name || "Student"} · {r.kind} · {r.date}</p>
            {r.notes && <p className="text-xs text-ink-2 mt-1">{r.notes}</p>}
            <p className="text-[10px] uppercase tracking-wider text-ink-3 mt-1">{r.status}</p>
          </div>
          {r.status === "pending" && (
            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={busy === r.id}
                onClick={async () => {
                  setBusy(r.id);
                  await reviewLeaveRequest(r.id, "approved");
                  setBusy(null);
                  router.refresh();
                }}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={busy === r.id}
                onClick={async () => {
                  setBusy(r.id);
                  await reviewLeaveRequest(r.id, "declined");
                  setBusy(null);
                  router.refresh();
                }}
              >
                Decline
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
