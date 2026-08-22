"use client";

import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format";

interface Notice {
  id: string;
  message: string;
  sent_at: string;
}

export function NoticeList({ notices }: { notices: Notice[] }) {
  if (notices.length === 0) {
    return (
      <Card>
        <p className="text-mu">No notices found.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {notices.map((notice) => (
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
