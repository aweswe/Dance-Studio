"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Download } from "lucide-react";

interface ProgressData {
  current_level: string;
  modules_completed: any[];
  certificate_urls: Record<string, string>;
}

export function KuchipudiProgress({ progress }: { progress: ProgressData | null }) {
  if (!progress) {
    return (
      <Card>
        <p className="text-mu">Your progress data is not available yet.</p>
      </Card>
    );
  }

  const levels = ["Foundation", "Intermediate", "Advanced"];
  const currentIdx = levels.indexOf(progress.current_level);

  return (
    <div className="space-y-8">
      <Card>
        <p className="text-sm text-mu mb-1 uppercase tracking-widest font-semibold">Current Level</p>
        <h2 className="font-display text-4xl text-purp">{progress.current_level}</h2>
        
        <div className="mt-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-black/5 -translate-y-1/2 rounded-full"></div>
          <div className="relative flex justify-between">
            {levels.map((level, idx) => {
              const isCompleted = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              return (
                <div key={level} className="flex flex-col items-center gap-2 bg-white px-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                    isCompleted ? "bg-purp text-white" : isCurrent ? "border-4 border-purp bg-white" : "bg-black/10"
                  }`}>
                    {isCompleted && <CheckCircle2 size={16} />}
                  </div>
                  <span className={`text-xs font-semibold uppercase tracking-widest ${
                    isCurrent ? "text-purp" : isCompleted ? "text-blk" : "text-mu"
                  }`}>{level}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <div>
        <h3 className="font-display text-2xl tracking-[2px] mb-4">Modules & Certificates</h3>
        <Card>
          <div className="space-y-4">
            {/* Example static modules based on current level */}
            <div className="flex items-center justify-between py-2 border-b border-black/5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-purp" size={20} />
                <span className="font-medium">Basics & Footwork</span>
              </div>
              <Badge variant="purple">Completed</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-black/5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-purp" size={20} />
                <span className="font-medium">Hand Gestures (Mudras)</span>
              </div>
              <Badge variant="purple">Completed</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Circle className="text-mu" size={20} />
                <span className="font-medium text-mu">Jathis & Items</span>
              </div>
              <Badge variant="default">In Progress</Badge>
            </div>
          </div>
          
          {progress.certificate_urls && Object.keys(progress.certificate_urls).length > 0 && (
            <div className="mt-8 pt-6 border-t border-black/5">
              <p className="text-sm text-mu mb-4 uppercase tracking-widest font-semibold">Your Certificates</p>
              <div className="flex flex-wrap gap-4">
                {Object.entries(progress.certificate_urls).map(([level, url]) => (
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
          )}
        </Card>
      </div>
    </div>
  );
}
