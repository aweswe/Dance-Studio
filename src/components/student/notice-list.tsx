"use client";

import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format";

interface Notice {
  id: string;
  message: string;
  sent_at: string;
  recipients?: { scope?: string; scopeId?: string } | null;
}

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
        <p className="text-mu">No notices found.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {visible.map((notice) => (
        <Card key={notice.id}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">Academy Notice</h3>
            <span className="text-xs text-mu">{formatDate(notice.sent_at)}</span>
          </div>
          <p className="text-sm whitespace-pre-wrap">{notice.message}</p>
        </Card>
      ))}
    </div>
  );
}
