"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { assignStudentBatch } from "@/actions/profile";
import { joinWaitlist } from "@/actions/studio";
import { loadRazorpayScript, openRazorpayCheckout } from "@/lib/razorpay/checkout";
import { formatTime } from "@/lib/utils/format";
import {
  Calendar,
  Clock,
  CheckCircle2,
  CreditCard,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface LiveBatch {
  id: string;
  name?: string | null;
  days: string[] | null;
  time_start: string | null;
  time_end: string | null;
  capacity: number;
  enrolled_count: number | null;
  status: string | null;
  programme_id: string;
}

export interface LiveProgramme {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  fees_monthly: number | null;
  image?: string;
  batches: LiveBatch[];
}

const IMAGE_BY_SLUG: Record<string, string> = {
  kuchipudi: "/images/kuchipudi/kuchipudi-natyarambham-posture.jpg",
  "kids-dance": "/images/studio-training/group-circle-drill.jpg",
  "adults-dance": "/images/studio-training/contemporary-conditioning.jpg",
  "mind-body-fitness": "/images/studio-training/floorwork-stretch.jpg",
};

function spotsLabel(b: LiveBatch): string {
  const left = Math.max(0, (b.capacity || 0) - (b.enrolled_count || 0));
  if (b.status === "full" || left <= 0) return "Waitlist";
  if (left <= 3) return `${left} spots left`;
  return `${left} open`;
}

interface StudentClassesViewProps {
  currentStudent: any;
  feePaid?: boolean;
  programmes: LiveProgramme[];
}

export function StudentClassesView({ currentStudent, feePaid, programmes }: StudentClassesViewProps) {
  const router = useRouter();
  const currentBatchId = currentStudent?.batch_id || currentStudent?.batch?.id;

  const [selectedBatches, setSelectedBatches] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    programmes.forEach((p) => {
      const match = p.batches.find((b) => b.id === currentBatchId);
      initial[p.id] = match ? match.id : p.batches[0]?.id;
    });
    return initial;
  });

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const activeProgramme = programmes.find((p) => p.batches.some((b) => b.id === currentBatchId));
  const activeBatch = activeProgramme?.batches.find((b) => b.id === currentBatchId);

  async function handleAssignBatch(programmeId: string) {
    const batchId = selectedBatches[programmeId];
    if (!batchId) return;
    setActionLoading(`assign-${programmeId}`);
    setStatusMessage(null);
    try {
      const res = await assignStudentBatch(batchId);
      if (!res.success) throw new Error(res.error || "Failed to update batch");
      setStatusMessage({ type: "success", text: "Schedule updated." });
      router.refresh();
    } catch (err) {
      setStatusMessage({ type: "error", text: err instanceof Error ? err.message : "Error selecting batch" });
    } finally {
      setActionLoading(null);
    }
  }

  async function handleWaitlist(batchId: string) {
    setActionLoading(`wait-${batchId}`);
    const res = await joinWaitlist(batchId);
    setStatusMessage(
      res.success
        ? { type: "success", text: "You're on the waitlist. We'll WhatsApp you when a seat opens." }
        : { type: "error", text: res.error || "Could not join waitlist" },
    );
    setActionLoading(null);
  }

  async function handlePayAndEnrol(programme: LiveProgramme) {
    const batchId = selectedBatches[programme.id] || programme.batches[0]?.id;
    setActionLoading(`pay-${programme.id}`);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programmeId: programme.id,
          batchId,
          name: currentStudent.name,
          phone: currentStudent.phone,
          email: currentStudent.email,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || "Could not initialize payment.");
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Could not load Razorpay window.");
      openRazorpayCheckout({
        orderId: data.order_id,
        amount: data.amount,
        description: `${programme.name} — Monthly tuition`,
        prefill: {
          name: currentStudent.name,
          email: currentStudent.email || undefined,
          contact: currentStudent.phone || undefined,
        },
        onSuccess: () => {
          setStatusMessage({ type: "success", text: `Payment successful. You're in ${programme.name}.` });
          router.refresh();
        },
        onFailure: (msg) => setStatusMessage({ type: "error", text: msg || "Payment was not completed." }),
        onDismiss: () => setActionLoading(null),
      });
    } catch (err) {
      setStatusMessage({ type: "error", text: err instanceof Error ? err.message : "Error processing payment" });
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            statusMessage.type === "success"
              ? "bg-green/15 text-green border border-green/30"
              : "bg-danger/15 text-danger border border-danger/30"
          }`}
        >
          {statusMessage.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {activeProgramme && activeBatch && (
        <Card>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="blue">Your class</Badge>
                <Badge variant={feePaid ? "green" : "outline"} className={feePaid ? "" : "border-danger text-danger"}>
                  {feePaid ? "Fees paid" : "Fees due"}
                </Badge>
              </div>
              <h2 className="font-anton text-2xl md:text-3xl text-ink tracking-tight">{activeProgramme.name}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-ink-2 pt-1">
                <span className="flex items-center gap-1.5 text-ink">
                  <Calendar className="w-3.5 h-3.5 text-bl" strokeWidth={1.5} />
                  {(activeBatch.days || []).join(", ")}
                </span>
                <span className="flex items-center gap-1.5 text-ink">
                  <Clock className="w-3.5 h-3.5 text-bl" strokeWidth={1.5} />
                  {formatTime(activeBatch.time_start || "")} – {formatTime(activeBatch.time_end || "")}
                </span>
              </div>
            </div>
            {!feePaid && (
              <button
                type="button"
                onClick={() => handlePayAndEnrol(activeProgramme)}
                disabled={actionLoading !== null}
                className="inline-flex items-center justify-center gap-2 min-h-11 bg-bl hover:bg-bl-deep text-white font-semibold text-sm px-4 rounded-xl focus-visible:focus-ring active:scale-[0.96]"
              >
                <CreditCard className="w-4 h-4" strokeWidth={1.5} /> Pay ₹{activeProgramme.fees_monthly}
              </button>
            )}
          </div>
        </Card>
      )}

      <div>
        <h3 className="font-anton text-xl text-ink tracking-tight">Programmes</h3>
        <p className="text-[12px] text-ink-3 mt-1">Seats from the studio timetable.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programmes.map((prog) => {
          const selectedBatchId = selectedBatches[prog.id] || prog.batches[0]?.id;
          const selectedBatch = prog.batches.find((b) => b.id === selectedBatchId) || prog.batches[0];
          const isCurrentBatch = selectedBatchId === currentBatchId;
          const isFull = selectedBatch && (selectedBatch.status === "full" || spotsLabel(selectedBatch) === "Waitlist");

          return (
            <div
              key={prog.id}
              className={`rounded-[20px] overflow-hidden border bg-surface-card shadow-lift flex flex-col ${
                isCurrentBatch ? "border-bl" : "border-line"
              }`}
            >
              <div className="relative h-44 w-full overflow-hidden outline outline-1 outline-black/10 dark:outline-white/10">
                <Image
                  src={prog.image || IMAGE_BY_SLUG[prog.slug] || "/images/studio-training/group-circle-drill.jpg"}
                  alt={prog.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-surface-card/90 text-ink border border-line">₹{prog.fees_monthly}/mo</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-anton text-xl text-white tracking-tight">{prog.name}</p>
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {prog.description && <p className="text-sm text-ink-2 leading-relaxed line-clamp-3">{prog.description}</p>}
                  {prog.batches.length > 0 ? (
                    <select
                      value={selectedBatchId}
                      onChange={(e) => setSelectedBatches((prev) => ({ ...prev, [prog.id]: e.target.value }))}
                      className="w-full min-h-11 bg-canvas-muted border border-line rounded-xl px-3 text-sm text-ink"
                    >
                      {prog.batches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name || `${(b.days || []).join(" · ")} ${formatTime(b.time_start || "")}`} ({spotsLabel(b)})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-ink-2">No batches published yet.</p>
                  )}
                </div>

                <div className="pt-4 border-t border-line">
                  {isCurrentBatch ? (
                    <p className="w-full min-h-11 rounded-xl bg-canvas-muted text-ink-2 text-sm text-center inline-flex items-center justify-center">
                      This is your class
                    </p>
                  ) : isFull ? (
                    <button
                      type="button"
                      onClick={() => selectedBatch && handleWaitlist(selectedBatch.id)}
                      disabled={actionLoading !== null}
                      className="w-full min-h-11 border border-line-strong text-ink font-medium text-sm rounded-xl focus-visible:focus-ring active:scale-[0.96]"
                    >
                      {actionLoading === `wait-${selectedBatch?.id}` ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Join waitlist"}
                    </button>
                  ) : feePaid ? (
                    <button
                      type="button"
                      onClick={() => handleAssignBatch(prog.id)}
                      disabled={actionLoading !== null}
                      className="w-full min-h-11 bg-bl text-white font-semibold text-sm rounded-xl hover:bg-bl-deep focus-visible:focus-ring active:scale-[0.96]"
                    >
                      {actionLoading === `assign-${prog.id}` ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Confirm this slot"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePayAndEnrol(prog)}
                      disabled={actionLoading !== null}
                      className="w-full min-h-11 bg-bl text-white font-semibold text-sm rounded-xl hover:bg-bl-deep focus-visible:focus-ring active:scale-[0.96]"
                    >
                      {actionLoading === `pay-${prog.id}` ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : `Enrol & pay · ₹${prog.fees_monthly}`}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
