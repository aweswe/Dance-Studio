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
  { num: 1, label: 'Foundation',          desc: 'Posture, mandala stance & basic adugulu' },
  { num: 2, label: 'Basic Technique',     desc: 'Core adavus, 28 hastas & tala counting' },
  { num: 3, label: 'Intermediate',        desc: 'Footwork, jathi recitation & Gejje Pooja' },
  { num: 4, label: 'Advanced',            desc: 'Repertoire items & Navarasas abhinaya' },
  { num: 5, label: 'Pre-Rangapravesham',  desc: 'Full recital preparation & item mastery' },
  { num: 6, label: 'Rangapravesham',      desc: 'Solo classical stage debut — live orchestra', milestone: true },
  { num: 7, label: 'Post-Rangapravesham', desc: 'Artistic mastery, choreography & teaching' },
];

/* ─────────────────────────────────────────────────────────
   DESKTOP — Full winding road SVG (1000 × 520 viewBox)
   The road is the hero. Labels sit beside milestone dots.
───────────────────────────────────────────────────────── */

// Waypoints where each stage dot sits on the road (x, y) in viewBox coords
const DESKTOP_POINTS: [number, number][] = [
  [100, 100],     // Stage 1 — top-left
  [340, 100],     // Stage 2
  [580, 100],     // Stage 3
  [820, 100],     // Stage 4 — top-right
  [820, 380],     // Stage 5 — bottom-right
  [500, 380],     // Stage 6 — bottom-center (milestone)
  [180, 380],     // Stage 7 — bottom-left
];

// Smooth racetrack oval: straight top → wide right curve → straight bottom
const DESKTOP_ROAD = `
  M 100,100
  L 820,100
  C 970,100 970,380 820,380
  L 180,380
`;

function DesktopRoadMap() {
  return (
    <div className="hidden lg:block relative max-w-5xl mx-auto" style={{ height: 520 }}>
      <svg
        viewBox="0 0 1000 520"
        fill="none"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ── Road layers ── */}

        {/* Outer road edge — dark shoulder */}
        <path
          d={DESKTOP_ROAD}
          stroke="var(--canvas-muted-2)"
          strokeWidth="54"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Road surface — warm gold */}
        <path
          d={DESKTOP_ROAD}
          stroke="var(--gold)"
          strokeWidth="38"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeOpacity="0.8"
        />

        {/* Inner road — slightly lighter */}
        <path
          d={DESKTOP_ROAD}
          stroke="var(--gold)"
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeOpacity="0.55"
        />

        {/* Center lane dashes */}
        <path
          d={DESKTOP_ROAD}
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="18 14"
          strokeDashoffset="0"
          fill="none"
          strokeOpacity="0.7"
        />

        {/* ── Stage dots along the road ── */}
        {DESKTOP_POINTS.map(([cx, cy], i) => {
          const stage = STAGES[i];
          const r = stage.milestone ? 22 : 16;
          return (
            <g key={i}>
              {/* Outer glow for milestone */}
              {stage.milestone && (
                <circle cx={cx} cy={cy} r={30} fill="var(--gold)" fillOpacity="0.2" />
              )}
              {/* Dot circle */}
              <circle
                cx={cx} cy={cy} r={r}
                fill={stage.milestone ? 'var(--blk)' : 'var(--surface)'}
                stroke={stage.milestone ? 'var(--gold)' : 'var(--line-strong)'}
                strokeWidth={stage.milestone ? 3 : 2}
              />
              {/* Number inside dot */}
              <text
                x={cx} y={cy + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={stage.milestone ? 13 : 11}
                fontWeight="800"
                fontFamily="var(--font-anton), Anton, sans-serif"
                fill={stage.milestone ? 'var(--gold)' : 'var(--ink-2)'}
                letterSpacing="0.05em"
              >
                {String(stage.num).padStart(2, '0')}
              </text>
            </g>
          );
        })}
      </svg>

      {/* ── Text labels positioned absolutely ── */}
      {DESKTOP_POINTS.map(([x, y], i) => {
        const stage = STAGES[i];
        // Determine label position relative to dot
        // Top row (0-3): labels below the dot
        // Bottom row (4-6): labels above the dot (or beside)
        const isTop = i < 4;
        const pctX = (x / 1000) * 100;
        const pctY = (y / 520) * 100;

        return (
          <div
            key={i}
            className="absolute text-center"
            style={{
              left: `${pctX}%`,
              top: isTop ? `${pctY + 7}%` : `${pctY - 16}%`,
              transform: 'translateX(-50%)',
              width: stage.milestone ? 180 : 150,
            }}
          >
            {stage.milestone && (
              <span
                className="inline-block text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded mb-1"
                style={{ background: 'var(--gold)', color: 'var(--blk)' }}
              >
                Debut Milestone
              </span>
            )}
            <h4
              className="font-anton text-xs sm:text-sm uppercase tracking-wide leading-tight"
              style={{ color: 'var(--ink)' }}
            >
              {stage.label}
            </h4>
            <p
              className="text-[10px] leading-snug mt-0.5"
              style={{ color: 'var(--ink-3)' }}
            >
              {stage.desc}
            </p>
          </div>
        );
      })}

      {/* CTA at the end of the road */}
      <div
        className="absolute"
        style={{
          left: `${(140 / 1000) * 100}%`,
          top: `${((340 + 44) / 520) * 100}%`,
          transform: 'translateX(-50%)',
        }}
      >
        <Link
          href={enrolHref({ programme: 'kuchipudi', intent: 'trial' })}
          className="inline-flex items-center justify-center py-2 px-4 rounded text-[11px] font-extrabold uppercase tracking-wider transition-colors shadow-2xs"
          style={{ background: 'var(--blk)', color: 'var(--wh)' }}
        >
          Book Trial Class
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MOBILE — Vertical winding road SVG (200 × 900 viewBox)
   Same concept: road is the hero, labels float beside it.
───────────────────────────────────────────────────────── */

const MOBILE_POINTS: [number, number][] = [
  [50, 60],      // Stage 1
  [150, 160],    // Stage 2
  [50, 280],     // Stage 3
  [150, 390],    // Stage 4
  [50, 500],     // Stage 5
  [100, 630],    // Stage 6 — milestone, center
  [150, 760],    // Stage 7
];

const MOBILE_ROAD = `
  M 50,60
  C 200,60 200,160 150,160
  C 100,160 0,200 50,280
  C 100,340 200,340 150,390
  C 100,440 0,440 50,500
  C 100,560 150,590 100,630
  C 50,670 100,730 150,760
`;

function MobileRoadMap() {
  return (
    <div className="block lg:hidden relative mx-auto" style={{ maxWidth: 360, height: 850 }}>
      <svg
        viewBox="0 0 200 900"
        fill="none"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Road shoulder */}
        <path
          d={MOBILE_ROAD}
          stroke="var(--canvas-muted-2)"
          strokeWidth="36"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Road surface */}
        <path
          d={MOBILE_ROAD}
          stroke="var(--gold)"
          strokeWidth="22"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeOpacity="0.8"
        />
        {/* Inner road */}
        <path
          d={MOBILE_ROAD}
          stroke="var(--gold)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeOpacity="0.55"
        />
        {/* Center dashes */}
        <path
          d={MOBILE_ROAD}
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="10 10"
          fill="none"
          strokeOpacity="0.7"
        />

        {/* Stage dots */}
        {MOBILE_POINTS.map(([cx, cy], i) => {
          const stage = STAGES[i];
          const r = stage.milestone ? 18 : 13;
          return (
            <g key={i}>
              {stage.milestone && (
                <circle cx={cx} cy={cy} r={24} fill="var(--gold)" fillOpacity="0.2" />
              )}
              <circle
                cx={cx} cy={cy} r={r}
                fill={stage.milestone ? 'var(--blk)' : 'var(--surface)'}
                stroke={stage.milestone ? 'var(--gold)' : 'var(--line-strong)'}
                strokeWidth={stage.milestone ? 2.5 : 1.5}
              />
              <text
                x={cx} y={cy + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={stage.milestone ? 11 : 9}
                fontWeight="800"
                fontFamily="var(--font-anton), Anton, sans-serif"
                fill={stage.milestone ? 'var(--gold)' : 'var(--ink-2)'}
              >
                {String(stage.num).padStart(2, '0')}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Mobile text labels — positioned beside each dot */}
      {MOBILE_POINTS.map(([x, y], i) => {
        const stage = STAGES[i];
        // Alternate labels left/right of the road
        const isLeft = x < 100;
        const pctY = (y / 900) * 100;

        return (
          <div
            key={i}
            className="absolute"
            style={{
              top: `${pctY}%`,
              ...(isLeft
                ? { left: `${((x + 24) / 200) * 100}%`, textAlign: 'left' as const }
                : { right: `${((200 - x + 24) / 200) * 100}%`, textAlign: 'right' as const }),
              transform: 'translateY(-50%)',
              width: 140,
            }}
          >
            {stage.milestone && (
              <span
                className="inline-block text-[8px] font-mono font-black uppercase tracking-widest px-1.5 py-0.5 rounded mb-0.5"
                style={{ background: 'var(--gold)', color: 'var(--blk)' }}
              >
                Debut
              </span>
            )}
            <h4
              className="font-anton text-[11px] sm:text-xs uppercase tracking-wide leading-tight"
              style={{ color: 'var(--ink)' }}
            >
              {stage.label}
            </h4>
            <p
              className="text-[9px] leading-snug mt-0.5"
              style={{ color: 'var(--ink-3)' }}
            >
              {stage.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   Exported component
───────────────────────────────────────── */
export function KuchipudiRoadMap() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <p className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: 'var(--ink-3)' }}>
          Learning Pathway
        </p>
        <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight" style={{ color: 'var(--ink)' }}>
          The Kuchipudi Roadmap
        </h3>
      </div>

      <DesktopRoadMap />
      <MobileRoadMap />
    </div>
  );
}
