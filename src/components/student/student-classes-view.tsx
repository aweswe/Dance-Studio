"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { assignStudentBatch } from "@/actions/profile";
import { loadRazorpayScript, openRazorpayCheckout } from "@/lib/razorpay/checkout";
import {
  Calendar,
  Clock,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface BatchSlot {
  id: string;
  name: string;
  days: string[];
  time: string;
  spots: string;
}

export interface ProgrammeCard {
  id: string;
  name: string;
  slug: string;
  fee: number;
  image: string;
  description: string;
  batches: BatchSlot[];
}

const PROGRAMMES: ProgrammeCard[] = [
  {
    id: "a1b2c3d4-4004-4000-8000-000000000004",
    name: "Kuchipudi Classical Dance",
    slug: "kuchipudi",
    fee: 2000,
    image: "/images/kuchipudi/kuchipudi-natyarambham-posture.jpg",
    description: "Traditional Aharya, Adavus, Tala rhythm and Certified Mudra training.",
    batches: [
      {
        id: "a1b2c3d4-4106-4000-8000-000000000006",
        name: "Weekend Master Batch (Fri & Sat)",
        days: ["Friday", "Saturday"],
        time: "6:30 PM - 7:30 PM",
        spots: "3 spots open",
      },
    ],
  },
  {
    id: "a1b2c3d4-4001-4000-8000-000000000001",
    name: "Kids Dance Foundation",
    slug: "kids-dance",
    fee: 2000,
    image: "/images/studio-training/group-circle-drill.jpg",
    description: "Hip Hop, Bollywood foundation, rhythm drills, coordination & stage confidence.",
    batches: [
      {
        id: "a1b2c3d4-4101-4000-8000-000000000001",
        name: "Batch A · Mon–Wed · 5:00 PM – 6:00 PM",
        days: ["Monday", "Tuesday", "Wednesday"],
        time: "5:00 PM - 6:00 PM",
        spots: "Filling fast",
      },
      {
        id: "a1b2c3d4-4102-4000-8000-000000000002",
        name: "Batch B · Mon–Wed · 6:00 PM – 7:00 PM",
        days: ["Monday", "Tuesday", "Wednesday"],
        time: "6:00 PM - 7:00 PM",
        spots: "Open",
      },
    ],
  },
  {
    id: "a1b2c3d4-4002-4000-8000-000000000002",
    name: "Adults Contemporary & Street",
    slug: "adults-dance",
    fee: 2500,
    image: "/images/studio-training/contemporary-conditioning.jpg",
    description: "Contemporary movement, lyrical hip hop, grooves, alignment & expressive choreography.",
    batches: [
      {
        id: "a1b2c3d4-4103-4000-8000-000000000003",
        name: "Evening Batch A · Mon–Wed · 7:00 PM – 8:00 PM",
        days: ["Monday", "Tuesday", "Wednesday"],
        time: "7:00 PM - 8:00 PM",
        spots: "Fast filling",
      },
      {
        id: "a1b2c3d4-4104-4000-8000-000000000004",
        name: "Evening Batch B · Mon–Wed · 8:00 PM – 9:00 PM",
        days: ["Monday", "Tuesday", "Wednesday"],
        time: "8:00 PM - 9:00 PM",
        spots: "Open",
      },
    ],
  },
  {
    id: "a1b2c3d4-4003-4000-8000-000000000003",
    name: "Mind & Body Fitness / Zumba",
    slug: "mind-body-fitness",
    fee: 2500,
    image: "/images/studio-training/floorwork-stretch.jpg",
    description: "High energy daily morning Zumba, cardio endurance, body conditioning & flexibility.",
    batches: [
      {
        id: "a1b2c3d4-4105-4000-8000-000000000005",
        name: "Morning Fitness Routine · Mon–Fri · 9:30 AM – 10:30 AM",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        time: "9:30 AM - 10:30 AM",
        spots: "Open daily",
      },
    ],
  },
];

interface StudentClassesViewProps {
  currentStudent: any;
  feePaid?: boolean;
}

export function StudentClassesView({ currentStudent, feePaid }: StudentClassesViewProps) {
  const router = useRouter();
  const currentBatchId = currentStudent?.batch_id || currentStudent?.batch?.id;

  // Selected batch for each programme (defaults to currently enrolled batch or first batch)
  const [selectedBatches, setSelectedBatches] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    PROGRAMMES.forEach((p) => {
      const match = p.batches.find((b) => b.id === currentBatchId);
      initial[p.id] = match ? match.id : p.batches[0]?.id;
    });
    return initial;
  });

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Find currently active batch & programme
  const activeProgramme = PROGRAMMES.find((p) => p.batches.some((b) => b.id === currentBatchId));
  const activeBatch = activeProgramme?.batches.find((b) => b.id === currentBatchId);

  // Handle batch assignment (for students whose fees are paid)
  async function handleAssignBatch(programmeId: string) {
    const batchId = selectedBatches[programmeId];
    if (!batchId) return;

    setActionLoading(`assign-${programmeId}`);
    setStatusMessage(null);
    try {
      const res = await assignStudentBatch(batchId);
      if (!res.success) throw new Error(res.error || "Failed to update batch");
      setStatusMessage({ type: "success", text: "Schedule updated! Your live timetable is active." });
      router.refresh();
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error selecting batch",
      });
    } finally {
      setActionLoading(null);
    }
  }

  // Handle Online Razorpay Payment & Enrolment
  async function handlePayAndEnrol(programme: ProgrammeCard) {
    const batchId = selectedBatches[programme.id] || programme.batches[0]?.id;
    setActionLoading(`pay-${programme.id}`);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programmeId: programme.id,
          batchId: batchId,
          amount: programme.fee,
          name: currentStudent.name,
          phone: currentStudent.phone,
          email: currentStudent.email,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || data.error || "Could not initialize payment.");
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Could not load Razorpay window. Please try again.");
      }

      openRazorpayCheckout({
        orderId: data.order_id,
        amount: data.amount,
        description: `${programme.name} — Monthly Tuition`,
        prefill: {
          name: currentStudent.name,
          email: currentStudent.email || undefined,
          contact: currentStudent.phone || undefined,
        },
        onSuccess: async () => {
          if (batchId) {
            await assignStudentBatch(batchId);
          }
          setStatusMessage({
            type: "success",
            text: `Payment of ₹${programme.fee} successful! You are enrolled in ${programme.name}.`,
          });
          router.refresh();
        },
        onFailure: (msg) => {
          setStatusMessage({ type: "error", text: msg || "Payment was not completed." });
        },
        onDismiss: () => {
          setActionLoading(null);
        },
      });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error processing payment",
      });
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${
            statusMessage.type === "success"
              ? "bg-green/15 text-green border border-green/30"
              : "bg-danger/15 text-danger border border-danger/30"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Currently Enrolled Active Banner */}
      {activeProgramme && activeBatch && (
        <Card className="p-6 md:p-8 border-bl/40 bg-gradient-to-br from-surface via-surface/95 to-bl/5 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="blue" className="px-3 py-1 font-bold">
                  Enrolled Class
                </Badge>
                <Badge variant={feePaid ? "green" : "outline"} className={feePaid ? "" : "border-danger text-danger"}>
                  Fee: {feePaid ? "Paid ✓" : "Due"}
                </Badge>
              </div>
              <h2 className="font-display text-2xl md:text-3xl text-ink">
                {activeProgramme.name}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-ink-2 pt-1">
                <span className="flex items-center gap-1.5 font-medium text-ink">
                  <Calendar className="w-3.5 h-3.5 text-bl" />
                  {activeBatch.days.join(", ")}
                </span>
                <span className="flex items-center gap-1.5 font-medium text-ink">
                  <Clock className="w-3.5 h-3.5 text-bl" />
                  {activeBatch.time}
                </span>
              </div>
            </div>

            {!feePaid && (
              <button
                type="button"
                onClick={() => handlePayAndEnrol(activeProgramme)}
                disabled={actionLoading !== null}
                className="bg-bl hover:bg-bl-deep text-white font-semibold text-xs tracking-[1.5px] uppercase px-6 py-3.5 rounded-lg transition-all shadow-md active:scale-[0.98] flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" /> Pay Monthly Fee (₹{activeProgramme.fee})
              </button>
            )}
          </div>
        </Card>
      )}

      {/* Section Header */}
      <div>
        <h3 className="font-display text-2xl text-ink tracking-wide">Dance Programmes & Class Schedules</h3>
        <p className="text-xs text-ink-2">Select your preferred timing from the dropdown on any class.</p>
      </div>

      {/* 4 Clean Discipline Cards with Timing Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROGRAMMES.map((prog) => {
          const selectedBatchId = selectedBatches[prog.id] || prog.batches[0]?.id;
          const selectedBatch = prog.batches.find((b) => b.id === selectedBatchId) || prog.batches[0];
          const isCurrentBatch = selectedBatchId === currentBatchId;
          const isAssigning = actionLoading === `assign-${prog.id}`;
          const isPaying = actionLoading === `pay-${prog.id}`;

          return (
            <div
              key={prog.id}
              className={`rounded-2xl overflow-hidden border bg-surface flex flex-col justify-between transition-all duration-300 ${
                isCurrentBatch
                  ? "border-bl ring-2 ring-bl/30 shadow-[0_10px_30px_rgba(43,180,216,0.15)]"
                  : "border-line hover:border-line-strong hover:shadow-lg"
              }`}
            >
              {/* Photo Banner */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={prog.image}
                  alt={prog.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blk/90 via-blk/40 to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-blk/80 text-white backdrop-blur-sm border border-white/10">
                    {prog.slug === "kuchipudi" ? "Classical" : prog.slug === "mind-body-fitness" ? "Fitness" : "Western / Contemporary"}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-md bg-bl text-white shadow-md">
                    ₹{prog.fee}/mo
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-lg font-bold text-white leading-tight drop-shadow">
                    {prog.name}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <p className="text-xs text-ink-2 leading-relaxed">
                    {prog.description}
                  </p>

                  {/* Timing Dropdown Menu */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-ink flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-bl" /> Select Class Timings
                    </label>
                    <select
                      value={selectedBatchId}
                      onChange={(e) => {
                        setSelectedBatches((prev) => ({
                          ...prev,
                          [prog.id]: e.target.value,
                        }));
                      }}
                      className="w-full bg-canvas-muted-2 border border-line rounded-xl p-3 text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-bl transition-all cursor-pointer"
                    >
                      {prog.batches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.spots})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Slot Information Pill */}
                  {selectedBatch && (
                    <div className="p-3 rounded-xl bg-canvas-muted border border-line-subtle text-xs text-ink space-y-1">
                      <p className="font-semibold text-bl-ink flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-bl" />
                        {selectedBatch.days.join(", ")}
                      </p>
                      <p className="text-ink-2">
                        Timings: {selectedBatch.time}
                      </p>
                    </div>
                  )}
                </div>

                {/* Single Contextual Action Button */}
                <div className="pt-4 border-t border-line">
                  {isCurrentBatch ? (
                    <div className="w-full py-3.5 rounded-xl bg-green/15 text-green border border-green/30 text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Active Class Batch
                    </div>
                  ) : feePaid ? (
                    <button
                      type="button"
                      onClick={() => handleAssignBatch(prog.id)}
                      disabled={actionLoading !== null}
                      className="w-full bg-bl hover:bg-bl-deep text-white font-semibold text-xs tracking-[1.5px] uppercase py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isAssigning ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Confirm This Schedule Slot <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePayAndEnrol(prog)}
                      disabled={actionLoading !== null}
                      className="w-full bg-bl hover:bg-bl-deep text-white font-semibold text-xs tracking-[1.5px] uppercase py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isPaying ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" /> Enrol & Pay Online (₹{prog.fee})
                        </>
                      )}
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
