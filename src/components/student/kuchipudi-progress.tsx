"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Lock, Download } from "lucide-react";
import {
  KUCHIPUDI_LEVELS,
  KUCHIPUDI_LEVEL_LABELS,
  KUCHIPUDI_CURRICULUM,
  type KuchipudiLevel,
} from "@/lib/kuchipudi/curriculum";

interface ProgressData {
  current_level: string | null;
  modules_completed: string[] | null;
  certificate_urls: Record<string, string> | null;
}

export function KuchipudiProgress({ progress }: { progress: ProgressData | null }) {
  const currentLevel = progress?.current_level || "foundation";
  const completedModules: string[] = Array.isArray(progress?.modules_completed)
    ? (progress.modules_completed as string[])
    : [];

  // Stored levels may differ in case ("Foundation" vs "foundation")
  const currentIdx = Math.max(
    0,
    KUCHIPUDI_LEVELS.findIndex((l) => l === (currentLevel || "").toLowerCase()),
  );

  const certificates = progress?.certificate_urls || {};

  return (
    <div className="space-y-8">
      <Card>
        <p className="text-sm text-mu mb-1 uppercase tracking-widest font-semibold">Current Level</p>
        <h2 className="font-display text-4xl text-purp">
          {KUCHIPUDI_LEVEL_LABELS[(KUCHIPUDI_LEVELS[currentIdx] as KuchipudiLevel)]}
        </h2>

        <div className="mt-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-black/5 -translate-y-1/2 rounded-full"></div>
          <div className="relative flex justify-between">
            {KUCHIPUDI_LEVELS.map((level, idx) => {
              const isCompleted = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              return (
                <div key={level} className="flex flex-col items-center gap-2 bg-white px-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                    isCompleted ? "bg-purp text-white" : isCurrent ? "border-4 border-purp bg-white" : "bg-black/10"
                  }`}>
                    {isCompleted && <CheckCircle2 size={16} />}
                    {!isCompleted && !isCurrent && <Lock size={12} className="text-mu" />}
                  </div>
                  <span className={`text-xs font-semibold uppercase tracking-widest ${
                    isCurrent ? "text-purp" : isCompleted ? "text-blk" : "text-mu"
                  }`}>{KUCHIPUDI_LEVEL_LABELS[level]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <div>
        <h3 className="font-display text-2xl tracking-[2px] mb-4">Modules & Certificates</h3>

        {KUCHIPUDI_LEVELS.map((level, levelIdx) => {
          const modules = KUCHIPUDI_CURRICULUM[level];
          const levelDone = levelIdx < currentIdx;
          const levelCurrent = levelIdx === currentIdx;
          const levelLocked = levelIdx > currentIdx;

          return (
            <Card key={level} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-blk">{KUCHIPUDI_LEVEL_LABELS[level]}</h4>
                {levelDone && <Badge variant="purple">Completed</Badge>}
                {levelCurrent && <Badge variant="default">In Progress</Badge>}
                {levelLocked && <Badge variant="outline">Locked</Badge>}
              </div>

              <div className="space-y-1">
                {modules.map((module) => {
                  const isDone = completedModules.includes(module) || levelDone;
                  return (
                    <div
                      key={module}
                      className="flex items-center justify-between py-2 border-b border-black/5 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        {isDone ? (
                          <CheckCircle2 className="text-purp" size={20} />
                        ) : (
                          <Circle className={levelLocked ? "text-black/20" : "text-mu"} size={20} />
                        )}
                        <span className={`font-medium ${isDone ? "text-blk" : levelLocked ? "text-black/40" : "text-blk/80"}`}>
                          {module}
                        </span>
                      </div>
                      {isDone ? (
                        <Badge variant="purple">Completed</Badge>
                      ) : levelLocked ? (
                        <Badge variant="outline">Locked</Badge>
                      ) : (
                        <Badge variant="default">Not Started</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}

        <Card className="mt-4">
          {certificates && Object.keys(certificates).length > 0 ? (
            <div className="pt-2">
              <p className="text-sm text-mu mb-4 uppercase tracking-widest font-semibold">Your Certificates</p>
              <div className="flex flex-wrap gap-4">
                {Object.entries(certificates).map(([level, url]) => (
                  <a
                    key={level}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-black/[.18] text-blk hover:border-purp hover:text-purp text-[11px] font-semibold tracking-[2px] uppercase px-6 py-3 rounded transition-all"
                  >
                    <Download size={16} /> {level} Certificate
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-mu">Certificates are issued once you complete a level. 🎓</p>
          )}
        </Card>
      </div>
    </div>
  );
}
