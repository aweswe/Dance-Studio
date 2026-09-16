"use client";

import { useState, useTransition } from "react";
import { acknowledgePlatformLeave } from "@/actions/studio";
import { Check, X } from "lucide-react";

interface AcknowledgeLeaveProps {
  id: string;
}

export function AcknowledgeLeaveButtons({ id }: AcknowledgeLeaveProps) {
  const [done, setDone] = useState<"approved" | "declined" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (done) {
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-md ${done === "approved" ? "bg-danger/10 text-danger" : "bg-canvas-muted text-ink-3"}`}>
        {done === "approved" ? "Access revoked" : "Declined"}
      </span>
    );
  }

  function act(status: "approved" | "declined") {
    setError(null);
    startTransition(async () => {
      const res = await acknowledgePlatformLeave(id, status);
      if (res.success) setDone(status);
      else setError(res.error || "Failed");
    });
  }

  return (
    <div className="flex items-center gap-2">
      {error && <p className="text-xs text-danger">{error}</p>}
      <button
        onClick={() => act("declined")}
        disabled={isPending}
        title="Decline — keep access"
        className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-line text-ink-2 hover:bg-canvas-muted disabled:opacity-50 transition-colors"
      >
        <X className="w-3.5 h-3.5" /> Decline
      </button>
      <button
        onClick={() => act("approved")}
        disabled={isPending}
        title="Approve — revoke access"
        className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-danger text-white hover:bg-danger/85 disabled:opacity-50 transition-colors"
      >
        <Check className="w-3.5 h-3.5" /> Revoke access
      </button>
    </div>
  );
}
