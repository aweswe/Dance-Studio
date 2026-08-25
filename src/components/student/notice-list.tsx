"use client";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils/format";

interface Notice {
  id: string;
  message: string;
  sent_at: string;
  template_name?: string | null;
  recipients?: { scope?: string; scopeId?: string } | null;
}

/** Titles per broadcast template so students see what kind of notice it is. */
const NOTICE_TITLES: Record<string, string> = {
  enrolment_welcome: "Welcome to Rhythmzz",
  payment_receipt: "Payment Receipt",
  fee_reminder: "Fee Reminder",
  absence_checkin: "Attendance Update",
  admin_broadcast: "Academy Notice",
  rental_confirmed: "Studio Rental Update",
  rental_cancelled: "Studio Rental Update",
};

export function NoticeList({
  notices,
  programmeId,
  batchId,
}: {
  notices: Notice[];
  programmeId?: string | null;
  batchId?: string | null;
}) {
  // Legacy rows without recipients metadata show to everyone; scoped rows
  // must match this student's programme or batch.
  const visible = (notices || []).filter((n) => {
    const r = n.recipients as any;
    if (!r || !r.scope) return true;
    if (r.scope === "all") return true;
    if (r.scope === "programme") return r.scopeId === programmeId;
    if (r.scope === "batch") return r.scopeId === batchId;
    return false;
  });

  if (visible.length === 0) {
    return (
      <Card>
        <EmptyState title="No notices found" />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {visible.map((notice) => (
        <Card key={notice.id}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">
              {(notice.template_name && NOTICE_TITLES[notice.template_name]) || "Academy Notice"}
            </h3>
            <span className="text-xs text-ink-2">{formatDate(notice.sent_at)}</span>
          </div>
          <p className="text-sm whitespace-pre-wrap">{notice.message}</p>
        </Card>
      ))}
    </div>
  );
}
