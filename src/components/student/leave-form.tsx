"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requestLeave } from "@/actions/studio";

export function LeaveForm() {
  const [date, setDate] = useState("");
  const [kind, setKind] = useState<"leave" | "makeup">("leave");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await requestLeave({ date, kind, notes });
    setMsg(res.success ? "Request sent to the academy." : res.error || "Could not submit");
    setBusy(false);
  }

  return (
    <Card className="p-6 max-w-lg">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-ink-2">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-sm bg-canvas"
          />
        </div>
        <div className="flex gap-2">
          {(["leave", "makeup"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase border ${kind === k ? "border-bl bg-bl/10 text-bl" : "border-line"}`}
            >
              {k === "leave" ? "Leave" : "Makeup class"}
            </button>
          ))}
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Reason (optional)"
          className="w-full border border-line rounded-xl px-3 py-2 text-sm min-h-[80px] bg-canvas"
        />
        <Button type="submit" disabled={busy} isLoading={busy}>
          Submit request
        </Button>
        {msg && <p className="text-sm text-ink-2">{msg}</p>}
      </form>
    </Card>
  );
}
