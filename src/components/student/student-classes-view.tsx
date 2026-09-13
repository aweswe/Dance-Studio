import Image from "next/image";
import { formatTime } from "@/lib/utils/format";
import { Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ACADEMY } from "@/lib/utils/constants";

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
  if (b.status === "full" || left <= 0) return "Full";
  if (left <= 3) return `${left} spots left`;
  return `${left} open`;
}

interface StudentClassesViewProps {
  currentStudent: {
    batch_id?: string | null;
    batch?: { id?: string; days?: string[]; time_start?: string; time_end?: string } | null;
    programme?: { name?: string; slug?: string } | null;
  };
  feePaid?: boolean;
  programmes: LiveProgramme[];
}

export function StudentClassesView({ currentStudent, feePaid, programmes }: StudentClassesViewProps) {
  const currentBatchId = currentStudent?.batch_id || currentStudent?.batch?.id;
  const activeProgramme = programmes.find((p) => p.batches.some((b) => b.id === currentBatchId));
  const activeBatch = activeProgramme?.batches.find((b) => b.id === currentBatchId);

  return (
    <div className="space-y-6">
      {activeProgramme && activeBatch ? (
        <Card>
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
        </Card>
      ) : (
        <Card className="space-y-2">
          <p className="text-sm text-ink-2">No batch assigned yet.</p>
          <p className="text-sm text-ink-3">The studio will confirm your programme and schedule after enrolment.</p>
        </Card>
      )}

      <Card className="bg-canvas-muted border-line">
        <p className="text-sm text-ink-2">
          Schedule changes, batch moves, and waitlist requests are handled by the studio — not self-serve in the portal.
        </p>
        <a
          href={ACADEMY.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex mt-3 text-sm font-semibold text-bl hover:text-bl-deep"
        >
          WhatsApp the studio →
        </a>
      </Card>

      <div>
        <h3 className="font-anton text-xl text-ink tracking-tight">Programmes</h3>
        <p className="text-[12px] text-ink-3 mt-1">Studio timetable — for reference only.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programmes.map((prog) => {
          const enrolledHere = prog.batches.some((b) => b.id === currentBatchId);

          return (
            <div
              key={prog.id}
              className={`rounded-[20px] overflow-hidden border bg-surface-card shadow-lift flex flex-col ${
                enrolledHere ? "border-bl" : "border-line"
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
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-surface-card/90 text-ink border border-line">
                    ₹{prog.fees_monthly}/mo
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-anton text-xl text-white tracking-tight">{prog.name}</p>
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1">
                {prog.description && (
                  <p className="text-sm text-ink-2 leading-relaxed line-clamp-3">{prog.description}</p>
                )}
                {prog.batches.length > 0 ? (
                  <ul className="space-y-2">
                    {prog.batches.map((b) => {
                      const isYours = b.id === currentBatchId;
                      return (
                        <li
                          key={b.id}
                          className={`rounded-xl border px-3 py-2.5 text-sm ${
                            isYours ? "border-bl bg-bl/5 text-ink" : "border-line text-ink-2"
                          }`}
                        >
                          <p className="font-medium text-ink">
                            {b.name || `${(b.days || []).join(" · ")} ${formatTime(b.time_start || "")}`}
                            {isYours ? " · Your batch" : ""}
                          </p>
                          <p className="text-[12px] text-ink-3 mt-0.5">
                            {formatTime(b.time_start || "")} – {formatTime(b.time_end || "")} · {spotsLabel(b)}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-ink-2">No batches published yet.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
