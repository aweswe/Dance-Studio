"use client";

import { useState } from "react";
import Image from "next/image";
import { assignStudentBatch } from "@/actions/profile";
import { Loader2, CheckCircle2, Sparkles, Clock, Calendar, Users, ArrowRight } from "lucide-react";

interface BatchOption {
  id: string;
  programmeName: string;
  programmeSlug: string;
  batchName: string;
  days: string[];
  time: string;
  fee: number;
  image: string;
  description: string;
  spotsLeft: string;
}

const AVAILABLE_BATCHES: BatchOption[] = [
  {
    id: "a1b2c3d4-4106-4000-8000-000000000006",
    programmeName: "Kuchipudi Classical",
    programmeSlug: "kuchipudi",
    batchName: "Kuchipudi Classical · Weekend Master",
    days: ["Fri", "Sat"],
    time: "6:30 PM - 7:30 PM",
    fee: 2000,
    image: "/images/kuchipudi/kuchipudi-natyarambham-posture.jpg",
    description: "Traditional Aharya & Tala training with certified certification.",
    spotsLeft: "3 spots open",
  },
  {
    id: "a1b2c3d4-4101-4000-8000-000000000001",
    programmeName: "Kids Dance",
    programmeSlug: "kids-dance",
    batchName: "Kids Foundation · Batch A",
    days: ["Mon", "Tue", "Wed"],
    time: "5:00 PM - 6:00 PM",
    fee: 2000,
    image: "/images/studio-training/group-circle-drill.jpg",
    description: "Hip Hop, Bollywood & rhythm drills for ages 5-14.",
    spotsLeft: "Few spots left",
  },
  {
    id: "a1b2c3d4-4102-4000-8000-000000000002",
    programmeName: "Kids Dance",
    programmeSlug: "kids-dance",
    batchName: "Kids Foundation · Batch B",
    days: ["Mon", "Tue", "Wed"],
    time: "6:00 PM - 7:00 PM",
    fee: 2000,
    image: "/images/studio-training/studio-technique.jpg",
    description: "Evening choreography, stage presence & musicality.",
    spotsLeft: "Open",
  },
  {
    id: "a1b2c3d4-4103-4000-8000-000000000003",
    programmeName: "Adults Dance",
    programmeSlug: "adults-dance",
    batchName: "Adults Contemporary · Batch A",
    days: ["Mon", "Tue", "Wed"],
    time: "7:00 PM - 8:00 PM",
    fee: 2500,
    image: "/images/studio-training/contemporary-conditioning.jpg",
    description: "Contemporary flow, lyrical hip hop & styling.",
    spotsLeft: "Fast filling",
  },
  {
    id: "a1b2c3d4-4104-4000-8000-000000000004",
    programmeName: "Adults Dance",
    programmeSlug: "adults-dance",
    batchName: "Adults Street & Lyrical · Batch B",
    days: ["Mon", "Tue", "Wed"],
    time: "8:00 PM - 9:00 PM",
    fee: 2500,
    image: "/images/studio-training/studio-leaps.jpg",
    description: "Intense choreography, street grooves & technique.",
    spotsLeft: "Open",
  },
  {
    id: "a1b2c3d4-4105-4000-8000-000000000005",
    programmeName: "Mind & Body Fitness",
    programmeSlug: "mind-body-fitness",
    batchName: "Zumba & Fitness · Morning Routine",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    time: "9:30 AM - 10:30 AM",
    fee: 2500,
    image: "/images/studio-training/floorwork-stretch.jpg",
    description: "High energy Zumba, body conditioning & flexibility.",
    spotsLeft: "Open daily",
  },
];

export function BatchPicker({ onBatchAssigned }: { onBatchAssigned?: () => void }) {
  const [selectedBatchId, setSelectedBatchId] = useState<string>(AVAILABLE_BATCHES[0].id);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const selectedBatch = AVAILABLE_BATCHES.find((b) => b.id === selectedBatchId);

  async function handleConfirm() {
    if (!selectedBatchId) return;
    setLoading(true);
    setError("");
    try {
      const res = await assignStudentBatch(selectedBatchId);
      if (!res.success) throw new Error(res.error || "Failed to assign batch");
      setSuccess(true);
      if (onBatchAssigned) {
        onBatchAssigned();
      } else {
        setTimeout(() => window.location.reload(), 1200);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error selecting batch");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-bl/15 border border-bl/40 rounded-xl p-8 text-center animate-fade-in shadow-[0_0_30px_rgba(43,180,216,0.2)]">
        <div className="w-14 h-14 rounded-full bg-bl/20 text-bl flex items-center justify-center mx-auto mb-3 border border-bl/40 shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-display text-2xl text-ink mb-1">Class Enrolment Confirmed!</h3>
        <p className="text-sm text-ink-2 max-w-md mx-auto">
          You are now enrolled in <span className="text-bl font-semibold">{selectedBatch?.batchName}</span>. Activating your class schedule...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-line-subtle">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-bl/15 flex items-center justify-center text-bl">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-xl text-ink">Choose Your Dance Discipline & Schedule</h3>
            <p className="text-xs text-ink-2">Select a class slot to join your weekly batch immediately</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-bl-ink px-2.5 py-1 rounded bg-bl/10 border border-bl/20 self-start sm:self-auto">
          Instant Activation
        </span>
      </div>

      {/* Visual Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AVAILABLE_BATCHES.map((b) => {
          const isSelected = selectedBatchId === b.id;
          return (
            <div
              key={b.id}
              onClick={() => setSelectedBatchId(b.id)}
              className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border ${
                isSelected
                  ? "border-bl ring-2 ring-bl/50 shadow-[0_10px_30px_rgba(43,180,216,0.25)] scale-[1.02] bg-surface"
                  : "border-line hover:border-line-strong hover:shadow-lg bg-surface/70"
              }`}
            >
              {/* Photo Banner with Badges */}
              <div className="relative h-36 w-full overflow-hidden">
                <Image
                  src={b.image}
                  alt={b.batchName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blk/90 via-blk/40 to-transparent" />
                
                {/* Top Discipline Tag */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blk/80 text-white backdrop-blur-sm border border-white/10">
                    {b.programmeName}
                  </span>
                </div>

                {/* Top Right Fee Pill */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-bl text-white shadow-md">
                    ₹{b.fee}/mo
                  </span>
                </div>

                {/* Bottom Left Batch Title */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <p className="text-sm font-semibold text-white leading-tight drop-shadow">
                    {b.batchName}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <p className="text-xs text-ink-2 line-clamp-2 leading-relaxed">
                  {b.description}
                </p>

                {/* Schedule details */}
                <div className="pt-2 border-t border-line-subtle space-y-1.5 text-xs text-ink">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-bl" />
                    <span className="font-medium">{b.days.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-bl" />
                    <span>{b.time}</span>
                  </div>
                </div>

                {/* Radio selection indicator */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-ink-2 font-medium flex items-center gap-1">
                    <Users className="w-3 h-3 text-gold" /> {b.spotsLeft}
                  </span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    isSelected ? "bg-bl border-bl text-white" : "border-line group-hover:border-ink-2"
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

      {/* Selected Action Sticky Bar */}
      <div className="p-4 rounded-xl bg-canvas-muted-2 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <p className="text-xs text-ink-2 uppercase tracking-wider font-semibold">Selected Class</p>
          <p className="font-semibold text-base text-ink">
            {selectedBatch?.batchName}
          </p>
          <p className="text-xs text-bl-ink font-medium">
            {selectedBatch?.days.join(", ")} &bull; {selectedBatch?.time}
          </p>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading || !selectedBatchId}
          className="bg-bl hover:bg-bl-deep text-white font-semibold text-xs tracking-[2px] uppercase py-3.5 px-8 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Confirm & Join Batch <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
