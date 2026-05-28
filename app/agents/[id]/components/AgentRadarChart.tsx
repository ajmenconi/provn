'use client';

/**
 * AgentRadarChart — rebuilt with 6 independently verifiable axes.
 *
 * All axes are derived from MLS data, public records, or platform-measured
 * activity only — no survey data, no self-reported unverifiable metrics.
 *
 * Features:
 *  • Toggle: vs County Average | vs Top 10%
 *  • Benchmark rendered as a filled semi-transparent polygon (not a dashed line)
 *    so the area between agent and benchmark is visually obvious
 *  • Score dots with numbers on each axis for scores ≥ 60
 *  • Six stat cards (2×3 grid) below the chart showing raw data + percentile
 *  • Mobile: tap any axis label to open a bottom sheet with explanation + source
 */

import { useState } from 'react';
import { AgentRadarData } from '@/types/agent';

// ── Types ─────────────────────────────────────────────────────────────────────

type BenchmarkMode = 'county' | 'top10';
type AxisKey      = keyof AgentRadarData;

// ── Chart geometry ────────────────────────────────────────────────────────────

const CX = 280;   // SVG center x
const CY = 228;   // SVG center y (nudged down for top-label headroom)
const R  = 138;   // max radar radius (px)
const LR = 190;   // label anchor distance from center (px)

interface AxisDef {
  key:     AxisKey;
  angle:   number;              // degrees, 0=right, −90=up
  label:   string[];            // display lines
  anchor:  'middle' | 'start' | 'end';
  ldy:     number;              // extra y nudge for multi-line centering
  tooltip: string;
}

const AXES: AxisDef[] = [
  {
    key:     'fiveStarReviews',
    angle:   -90,
    label:   ['Five Star', 'Reviews'],
    anchor:  'middle',
    ldy:     -8,
    tooltip: 'Percentile rank based on 5-star review rate and volume across Google, Zillow, Realtor.com, and Homes.com compared to Sonoma County agents.',
  },
  {
    key:     'localMarketExpertise',
    angle:   -30,
    label:   ['Local Market', 'Expertise'],
    anchor:  'start',
    ldy:     -6,
    tooltip: 'Measures both the range of neighborhoods served and the depth of experience within each — rewards true local specialists over generalists.',
  },
  {
    key:     'careerVolume',
    angle:   30,
    label:   ['Career', 'Volume'],
    anchor:  'start',
    ldy:     0,
    tooltip: 'Total career sales volume ranked against all active Sonoma County agents — top 5% means they outsell 95% of agents in the market.',
  },
  {
    key:     'skinInTheGame',
    angle:   90,
    label:   ['Skin in', 'the Game'],
    anchor:  'middle',
    ldy:     10,
    tooltip: 'Based on verified personal and LLC property ownership from county assessor records — agents who own property have real financial stake in the market they advise on.',
  },
  {
    key:     'successfulOutcomes',
    angle:   150,
    label:   ['Successful', 'Outcomes'],
    anchor:  'end',
    ldy:     0,
    tooltip: 'Measures what percentage of listings this agent has ever taken eventually sold — rewards persistence and problem-solving over clean markets only.',
  },
  {
    key:     'expertiseDepth',
    angle:   210,
    label:   ['Expertise', 'Depth'],
    anchor:  'end',
    ldy:     -6,
    tooltip: 'Weighted score of specialized transaction types — complex transactions like probate, trust sales, and 1031 exchanges count more than standard residential sales.',
  },
];

const GRID_LEVELS = [0.25, 0.50, 0.75, 1.0];

// ── Math helpers ──────────────────────────────────────────────────────────────

function toRad(deg: number)   { return (deg * Math.PI) / 180; }

function polarXY(angleDeg: number, dist: number) {
  const a = toRad(angleDeg);
  return { x: CX + dist * Math.cos(a), y: CY + dist * Math.sin(a) };
}

/** Build SVG polygon points string from per-axis radius fractions (0–1) */
function svgPts(fracs: number[]): string {
  return AXES.map((ax, i) => {
    const p = polarXY(ax.angle, fracs[i] * R);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(' ');
}

// ── Percentile helpers ────────────────────────────────────────────────────────

function topLabel(percentile: number): string {
  const b = 100 - percentile;
  if (b <= 1)  return 'Top 1%';
  if (b <= 3)  return 'Top 3%';
  if (b <= 5)  return 'Top 5%';
  if (b <= 10) return 'Top 10%';
  if (b <= 20) return 'Top 20%';
  if (b <= 30) return 'Top 30%';
  return `Top ${b}%`;
}

function badgeHex(percentile: number): string {
  const b = 100 - percentile;
  if (b <= 5)  return '#10b981'; // emerald
  if (b <= 15) return '#3b82f6'; // blue
  if (b <= 30) return '#f59e0b'; // amber
  return '#6b7280';              // gray
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  radarData:  AgentRadarData;
  accent:     string;
  agentName:  string;
  countyName: string;
}

export default function AgentRadarChart({ radarData, accent, agentName, countyName }: Props) {
  const [benchmark,  setBenchmark]  = useState<BenchmarkMode>('county');
  const [activeAxis, setActiveAxis] = useState<AxisKey | null>(null);

  const firstName = agentName.split(' ')[0];

  // Overall ranking: average percentile across all 6 axes
  const avgPercentile  = Math.round(AXES.reduce((s, ax) => s + radarData[ax.key].percentile, 0) / AXES.length);
  const overallTopPct  = 100 - avgPercentile;
  const overallColor   = overallTopPct <= 5 ? accent : overallTopPct <= 15 ? '#3b82f6' : '#f59e0b';
  const benchLabel = benchmark === 'county'
    ? `${countyName} County Average`
    : 'Top 10%';

  // Polygon fraction arrays
  const agentFracs  = AXES.map(ax => radarData[ax.key].score          / 100);
  const countyFracs = AXES.map(ax => radarData[ax.key].countyMedian   / 100);
  const top10Fracs  = AXES.map(ax => radarData[ax.key].top10Threshold / 100);
  const benchFracs  = benchmark === 'county' ? countyFracs : top10Fracs;

  // Benchmark polygon styling
  const benchFill   = benchmark === 'county'
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(251,191,36,0.11)';
  const benchStroke = benchmark === 'county'
    ? 'rgba(255,255,255,0.28)'
    : 'rgba(251,191,36,0.55)';

  const activeAxisDef  = activeAxis ? AXES.find(a => a.key === activeAxis) : null;
  const activeAxisData = activeAxis ? radarData[activeAxis]                 : null;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#1A1D2E', border: '1px solid #2D3148' }}>

      {/* ── Header + benchmark toggle ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-1">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: '#4B5563' }}>
            Strength Profile · Provn Verified
          </p>
          <p className="text-white font-black text-xl leading-snug">
            How {firstName} Compares
          </p>
        </div>

        {/* Toggle */}
        <div
          className="flex gap-1 p-1 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.07)' }}
        >
          {(['county', 'top10'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setBenchmark(mode)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap"
              style={{
                backgroundColor: benchmark === mode ? accent : 'transparent',
                color:            benchmark === mode ? '#fff' : 'rgba(255,255,255,0.38)',
              }}
            >
              {mode === 'county' ? 'vs County Average' : 'vs Top 10%'}
            </button>
          ))}
        </div>
      </div>

      {/* ── SVG radar chart ────────────────────────────────────────────────── */}
      <div className="px-2">
        <svg
          viewBox="0 0 560 470"
          className="w-full"
          role="img"
          aria-label={`Radar chart comparing ${agentName} to ${benchLabel}`}
        >
          {/* Background */}
          <rect width="560" height="470" fill="#1A1D2E" />

          {/* Grid hexagons */}
          {GRID_LEVELS.map(level => (
            <polygon
              key={level}
              points={svgPts(AXES.map(() => level))}
              fill="none"
              stroke={level === 1.0 ? 'rgba(255,255,255,0.11)' : 'rgba(255,255,255,0.05)'}
              strokeWidth={level === 1.0 ? 1.2 : 0.8}
            />
          ))}

          {/* Grid level numbers (top axis, tucked just right) */}
          {GRID_LEVELS.slice(0, -1).map(level => {
            const p = polarXY(-90, level * R);
            return (
              <text key={level} x={p.x + 5} y={p.y + 3.5}
                fontSize="7.5" fill="rgba(255,255,255,0.16)" fontWeight="700">
                {Math.round(level * 100)}
              </text>
            );
          })}

          {/* Axis spoke lines */}
          {AXES.map(ax => {
            const tip = polarXY(ax.angle, R);
            return (
              <line key={ax.key}
                x1={CX} y1={CY}
                x2={tip.x.toFixed(1)} y2={tip.y.toFixed(1)}
                stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            );
          })}

          {/* ── Benchmark polygon (filled area, not a line) ── */}
          <polygon
            points={svgPts(benchFracs)}
            fill={benchFill}
            stroke={benchStroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* ── Agent polygon ── */}
          <polygon
            points={svgPts(agentFracs)}
            fill={`${accent}24`}
            stroke={accent}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* ── Agent score dots ── */}
          {AXES.map((ax, i) => {
            const score = radarData[ax.key].score;
            const pt    = polarXY(ax.angle, agentFracs[i] * R);
            const big   = score >= 60;
            return (
              <g key={ax.key}>
                {big ? (
                  <>
                    {/* Glow */}
                    <circle cx={pt.x.toFixed(1)} cy={pt.y.toFixed(1)}
                      r="19" fill={`${accent}18`} />
                    {/* Circle */}
                    <circle cx={pt.x.toFixed(1)} cy={pt.y.toFixed(1)}
                      r="14" fill="#0d1117" stroke={accent} strokeWidth="2" />
                    {/* Score */}
                    <text x={pt.x.toFixed(1)} y={(pt.y + 4.5).toFixed(1)}
                      textAnchor="middle" fontSize="10.5" fontWeight="900" fill={accent}>
                      {score}
                    </text>
                  </>
                ) : (
                  <>
                    <circle cx={pt.x.toFixed(1)} cy={pt.y.toFixed(1)}
                      r="6" fill={accent} opacity="0.25" />
                    <circle cx={pt.x.toFixed(1)} cy={pt.y.toFixed(1)}
                      r="3.5" fill={accent} />
                  </>
                )}
              </g>
            );
          })}

          {/* Center dot */}
          <circle cx={CX} cy={CY} r="3" fill="rgba(255,255,255,0.15)" />

          {/* ── Axis labels (tappable on mobile, hover tooltip on desktop) ── */}
          {AXES.map(ax => {
            const lp  = polarXY(ax.angle, LR);
            const lh  = 13.5;  // line height px
            // center multiple lines vertically
            const by  = lp.y + ax.ldy - ((ax.label.length - 1) * lh) / 2;
            return (
              <g
                key={ax.key}
                onClick={() => setActiveAxis(ax.key)}
                style={{ cursor: 'pointer' }}
                role="button"
                aria-label={`${ax.label.join(' ')} — tap to learn more`}
              >
                <title>{ax.tooltip}</title>
                {ax.label.map((line, j) => (
                  <text
                    key={j}
                    x={lp.x.toFixed(1)}
                    y={(by + j * lh).toFixed(1)}
                    textAnchor={ax.anchor}
                    fontSize="10.5"
                    fontWeight="700"
                    fill="rgba(255,255,255,0.72)"
                    className="select-none"
                  >
                    {line}
                  </text>
                ))}
                {/* Mobile "tap" hint — tiny dot under last line */}
                <circle
                  cx={ax.anchor === 'end'   ? (lp.x - 4).toFixed(1)
                    : ax.anchor === 'start' ? (lp.x + 4).toFixed(1)
                    : lp.x.toFixed(1)}
                  cy={(by + ax.label.length * lh - 1).toFixed(1)}
                  r="2.5"
                  fill={accent}
                  opacity="0.55"
                  className="sm:hidden"
                />
              </g>
            );
          })}

          {/* ── Legend ── */}
          <g transform="translate(14,452)">
            <rect x="0" y="-5.5" width="9" height="9" rx="1.5" fill={accent} opacity="0.75" />
            <text x="13" y="3" fontSize="9.5" fill="rgba(255,255,255,0.42)" fontWeight="700">
              {firstName}
            </text>
            <rect x="72" y="-5.5" width="9" height="9" rx="1.5" fill={benchStroke} />
            <text x="85" y="3" fontSize="9.5" fill="rgba(255,255,255,0.42)" fontWeight="700">
              {benchLabel}
            </text>
          </g>
        </svg>
      </div>

      {/* ── Overall ranking summary ───────────────────────────────────────── */}
      <div className="px-5 pb-5 pt-0 text-center">
        <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.50)' }}>
          Ranked in the{' '}
          <span className="font-black text-base" style={{ color: overallColor }}>
            top {overallTopPct}%
          </span>{' '}
          of {countyName} County agents overall
        </p>
        <p className="text-[10px] mt-1.5" style={{ color: '#4B5563' }}>
          Source: MLS · CA DRE · Google / Zillow / Realtor.com · Provn platform — all axes independently verifiable
        </p>
      </div>

      {/* ── Mobile bottom sheet ───────────────────────────────────────────── */}
      {activeAxis && activeAxisDef && activeAxisData && (
        <div className="fixed inset-0 z-50 sm:hidden flex items-end">
          {/* Scrim */}
          <div
            className="absolute inset-0 bg-black/65"
            onClick={() => setActiveAxis(null)}
          />
          {/* Sheet */}
          <div
            className="relative w-full rounded-t-3xl px-6 pt-4 pb-safe-bottom max-h-[68vh] overflow-y-auto"
            style={{ background: '#1A1D2E', paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          >
            {/* Drag handle */}
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

            <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#94A3B8' }}>
              {activeAxisDef.label.join(' ')}
            </p>

            <p className="text-xl font-black text-white leading-snug mb-3">
              {activeAxisData.rawValue}
            </p>

            <span
              className="inline-flex items-center gap-1.5 text-sm font-black px-3 py-1.5 rounded-full mb-4"
              style={{
                backgroundColor: `${badgeHex(activeAxisData.percentile)}22`,
                color:           badgeHex(activeAxisData.percentile),
                border:          `1px solid ${badgeHex(activeAxisData.percentile)}44`,
              }}
            >
              {topLabel(activeAxisData.percentile)}
              <span className="text-xs font-normal text-white/38">
                of {countyName} County agents
              </span>
            </span>

            <p className="text-sm text-white/80 leading-relaxed mb-4">
              {activeAxisData.plainEnglish}
            </p>

            <div className="border-l-2 pl-3 mb-5" style={{ borderColor: '#2D3148' }}>
              <p className="text-[11px] leading-relaxed italic" style={{ color: '#94A3B8' }}>
                {activeAxisDef.tooltip}
              </p>
            </div>

            <p className="text-[10px] mb-5" style={{ color: '#4B5563' }}>
              Source: MLS · CA DRE · Provn Platform
            </p>

            <button
              onClick={() => setActiveAxis(null)}
              className="w-full py-3 rounded-xl text-sm font-bold"
              style={{ background: 'rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.55)' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
