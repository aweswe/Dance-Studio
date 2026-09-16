"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { submitPlatformLeave } from "@/actions/studio";
import { AlertTriangle, LogOut } from "lucide-react";

interface PlatformLeaveFormProps {
  /** Pass an existing pending request date if one already exists */
  existingPendingDate?: string | null;
}

export function LeaveAcademyForm({ existingPendingDate }: PlatformLeaveFormProps) {
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (existingPendingDate || submitted) {
    return (
      <div className="rounded-xl border border-gold/40 bg-gold/5 p-6 text-center space-y-2">
        <p className="text-sm font-semibold text-ink">Your withdrawal request is pending</p>
        <p className="text-sm text-ink-2">
          The team has been notified and will reach out to you soon. If you change your mind, please contact the academy directly.
        </p>
        {existingPendingDate && (
          <p className="text-[11px] text-ink-3">Submitted on {existingPendingDate}</p>
        )}
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!confirmed) {
      setError("Please check the confirmation box before submitting.");
      return;
    }
    setError(null);
    setBusy(true);
    const res = await submitPlatformLeave(reason);
    setBusy(false);
    if (res.success) {
      setSubmitted(true);
    } else {
      setError(res.error || "Could not submit. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Warning banner */}
      <div className="flex gap-3 rounded-lg border border-danger/30 bg-danger/5 p-4">
        <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
        <div className="text-sm text-ink-2 space-y-1.5">
          <p className="font-semibold text-ink">This can only be submitted once</p>
          <p>Once the admin reviews your request, <strong className="text-ink">your access will be permanently revoked</strong> — you won't be able to log in or use this platform anymore.</p>
        </div>
      </div>

      {/* Reason — mandatory */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-ink-2" htmlFor="leave-reason">
          Why do you want to leave? <span className="text-danger">*</span>
        </label>
        <textarea
          id="leave-reason"
          required
          minLength={10}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Relocating to another city, schedule conflicts, financial reasons…"
          className="w-full border border-line rounded-lg px-4 py-3 text-sm bg-canvas min-h-[120px] resize-none focus:outline-none focus:border-bl/50 focus:ring-2 focus:ring-bl/20 placeholder:text-ink-3"
        />
        <p className="text-[11px] text-ink-3">
          Your feedback helps us improve. ({reason.trim().length}/10 min)
        </p>
      </div>

      {/* Confirmation checkbox */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-line accent-bl"
        />
        <span className="text-sm text-ink-2 group-hover:text-ink transition-colors">
          I understand that submitting this form will notify the Rhythmzz Academy team that I wish to withdraw from the programme.
        </span>
      </label>

      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}

      <Button
        type="submit"
        disabled={busy || !reason.trim() || reason.trim().length < 10 || !confirmed}
        isLoading={busy}
        className="w-full !bg-danger hover:!bg-danger/90 text-white gap-2"
      >
        <LogOut className="w-4 h-4" />
        Submit withdrawal request
      </Button>
    </form>
  );
}
