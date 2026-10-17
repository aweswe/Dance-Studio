'use client';

import React from 'react';
import Link from 'next/link';
import { enrolHref } from '@/lib/utils/constants';

interface Stage {
  num: number;
  label: string;
  desc: string;
  milestone?: boolean;
}

const STAGES: Stage[] = [
  { num: 1, label: 'Foundation', desc: 'Sama posture, Teental (16 beats) Tatkar & Hastaks' },
  { num: 2, label: 'Elementary', desc: 'Speed variations, Chakkars, Tukda & Tihai' },
  { num: 3, label: 'Intermediate', desc: 'Drut Laya, Paran, Aamad, Jhaptal & Ektaal' },
  { num: 4, label: 'Advanced', desc: 'Layakari (Thah to Chaugun), Gat Nikas & Gat Bhaav' },
  { num: 5, label: 'Manch Pravesh', desc: 'Solo graduation debut with live classical orchestra', milestone: true },
];

/* ─────────────────────────────────────────────────────────
   DESKTOP — Racetrack SVG Progression (1000 × 360 viewBox)
───────────────────────────────────────────────────────── */

const DESKTOP_POINTS: [number, number][] = [
  [120, 100], // Stage 1 — top-left
  [500, 100], // Stage 2 — top-center
  [880, 100], // Stage 3 — top-right
  [680, 260], // Stage 4 — bottom-right
  [280, 260], // Stage 5 — bottom-left (milestone)
];

const DESKTOP_ROAD = `
  M 120,100
  L 880,100
  C 1000,100 1000,260 880,260
  L 280,260
`;

function DesktopRoadMap() {
  return (
    <div className="hidden lg:block relative max-w-5xl mx-auto" style={{ height: 380 }}>
      <svg
        viewBox="0 0 1000 360"
        fill="none"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Outer road edge */}
        <path
          d={DESKTOP_ROAD}
          stroke="var(--line)"
          strokeWidth="48"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Road surface */}
        <path
          d={DESKTOP_ROAD}
          stroke="var(--canvas-muted)"
          strokeWidth="36"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Brand progress line */}
        <path
          d={DESKTOP_ROAD}
          stroke="var(--bl)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="14 12"
          fill="none"
          strokeOpacity="0.8"
        />

        {/* Stage dots along the road */}
        {DESKTOP_POINTS.map(([cx, cy], i) => {
          const stage = STAGES[i];
          const r = stage.milestone ? 24 : 17;
          return (
            <g key={i}>
              {stage.milestone && (
                <circle cx={cx} cy={cy} r={32} fill="var(--bl)" fillOpacity="0.15" />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={stage.milestone ? 'var(--bl)' : 'var(--surface)'}
                stroke={stage.milestone ? 'var(--bl-deep)' : 'var(--line-strong)'}
                strokeWidth={stage.milestone ? 3 : 2}
              />
              <text
                x={cx}
                y={cy + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={stage.milestone ? 13 : 11}
                fontWeight="800"
                fontFamily="var(--font-anton), Anton, sans-serif"
                fill={stage.milestone ? 'var(--canvas)' : 'var(--ink)'}
                letterSpacing="0.05em"
              >
                {String(stage.num).padStart(2, '0')}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Text labels positioned absolutely */}
      {DESKTOP_POINTS.map(([x, y], i) => {
        const stage = STAGES[i];
        const isTop = i < 3;
        const pctX = (x / 1000) * 100;
        const pctY = (y / 360) * 100;

        return (
          <div
            key={i}
            className="absolute z-10 pointer-events-none"
            style={{
              left: `${pctX}%`,
              top: `${pctY}%`,
              transform: isTop
                ? 'translate(-50%, -105%)'
                : 'translate(-50%, 45%)',
              width: 220,
            }}
          >
            <div
              className={`text-center p-2.5 rounded-md border ${
                stage.milestone
                  ? 'bg-surface border-bl/50 shadow-md ring-1 ring-bl/20'
                  : 'bg-surface/90 border-line shadow-2xs backdrop-blur-xs'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className="font-anton text-xs uppercase tracking-wide text-ink">
                  {stage.label}
                </span>
                {stage.milestone && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-bl text-slate-950 font-black uppercase">
                    Milestone
                  </span>
                )}
              </div>
              <p className="text-[11px] text-ink-2 leading-tight font-medium">
                {stage.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MOBILE / TABLET — Vertical Sequential Progression
───────────────────────────────────────────────────────── */

function MobileRoadMap() {
  return (
    <div className="lg:hidden relative pl-8 space-y-6">
      <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-line-strong border-l border-dashed border-bl/60" />
      {STAGES.map((stage) => (
        <div key={stage.num} className="relative flex items-start gap-4">
          <div
            className={`absolute -left-8 w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-black shrink-0 ${
              stage.milestone
                ? 'bg-bl text-slate-950 shadow-xs ring-2 ring-bl/30'
                : 'bg-surface border border-line-strong text-ink'
            }`}
          >
            {String(stage.num).padStart(2, '0')}
          </div>
          <div
            className={`flex-1 p-4 rounded-md border ${
              stage.milestone
                ? 'bg-surface border-bl/40 shadow-sm'
                : 'bg-surface border-line shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-anton text-sm uppercase tracking-wide text-ink">
                {stage.label}
              </span>
              {stage.milestone && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-bl text-slate-950 font-bold uppercase">
                  Milestone
                </span>
              )}
            </div>
            <p className="text-xs text-ink-2 leading-relaxed font-medium">
              {stage.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function KathakRoadMap() {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-bl block mb-1">
          PROGRESSIVE LEARNING PATHWAY
        </span>
        <h3 className="font-anton text-2xl sm:text-3xl text-ink uppercase tracking-wide">
          The Kathak Dancer&apos;s Roadmap
        </h3>
        <p className="text-xs sm:text-sm text-ink-2 font-medium mt-1">
          From first Tatkar footwork on Teental to the celebrated Manch Pravesh solo stage debut with live classical percussion.
        </p>
      </div>

      <DesktopRoadMap />
      <MobileRoadMap />

      <div className="text-center pt-4">
        <Link
          href={enrolHref({ programme: 'classical-dance', intent: 'trial' })}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider bg-bl text-slate-950 hover:bg-bl-deep transition-colors shadow-xs"
        >
          Book Your Introductory Class
        </Link>
      </div>
    </div>
  );
}
