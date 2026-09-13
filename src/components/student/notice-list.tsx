"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils/format";
import { markNoticeRead } from "@/actions/studio";

interface Notice {
  id: string;
  message: string;
  message_te?: string | null;
  message_hi?: string | null;
  sent_at: string;
  template_name?: string | null;
  recipients?: { scope?: string; scopeId?: string } | null;
}

const NOTICE_TITLES: Record<string, { en: string; te: string; hi: string }> = {
  enrolment_welcome: { en: "Welcome to Rhythmzz", te: "రిథమ్జ్‌కు స్వాగతం", hi: "रिदम्ज़ में स्वागत है" },
  payment_receipt: { en: "Payment Receipt", te: "చెల్లింపు రశీదు", hi: "भुगतान रसीद" },
  fee_reminder: { en: "Fee Reminder", te: "ఫీజు రిమైండర్", hi: "फीस रिमाइंडर" },
  absence_checkin: { en: "Attendance Update", te: "హాజరు నవీకరణ", hi: "उपस्थिति अपडेट" },
  admin_broadcast: { en: "Academy Notice", te: "అకాడమీ నోటీసు", hi: "अकादमी सूचना" },
  class_reminder: { en: "Class tomorrow", te: "రేపటి క్లాస్", hi: "कल की क्लास" },
};

export function NoticeList({
  notices,
  programmeId,
  batchId,
  readIds,
}: {
  notices: Notice[];
  programmeId?: string | null;
  batchId?: string | null;
  readIds?: string[];
}) {
  const [lang, setLang] = useState<"en" | "te" | "hi">("en");
  const read = new Set(readIds || []);

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
        <EmptyState title="No notices yet" description="Academy announcements and fee reminders will show up here." />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["en", "te", "hi"] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={`text-[11px] uppercase tracking-wider px-3 py-1 rounded-md border ${lang === l ? "border-ink bg-ink text-white" : "border-line text-ink-2"}`}
          >
            {l === "en" ? "English" : l === "te" ? "తెలుగు" : "हिन्दी"}
          </button>
        ))}
      </div>
      {visible.map((notice) => {
        const titles = (notice.template_name && NOTICE_TITLES[notice.template_name]) || NOTICE_TITLES.admin_broadcast;
        const body =
          lang === "te" && notice.message_te
            ? notice.message_te
            : lang === "hi" && notice.message_hi
              ? notice.message_hi
              : notice.message;
        const unread = !read.has(notice.id);
        return (
          <div key={notice.id} onMouseEnter={() => unread && markNoticeRead(notice.id)}>
          <Card
            className={unread ? "border-bl/40" : ""}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">
                {titles[lang]}
                {unread && <span className="ml-2 text-[10px] uppercase text-bl">New</span>}
              </h3>
              <span className="text-xs text-ink-2">{formatDate(notice.sent_at)}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{body}</p>
          </Card>
          </div>
        );
      })}
    </div>
  );
}
