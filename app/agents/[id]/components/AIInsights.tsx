import { Agent, ConsistencyRating } from '@/types/agent';
import { ScoreBreakdown, SCORE_WEIGHTS } from '@/lib/scoring';
import SourceLabel from './SourceLabel';
import SectionHeader from './SectionHeader';

// ── Design tokens ─────────────────────────────────────────────────────────────

const INNER    = { background: '#0A0F1E', border: '1px solid #1E2A3A' } as const;
const C_SEC    = '#94A3B8';
const C_TER    = '#4B5563';
const C_INTERP = '#CBD5E1';

// ── Helpers ───────────────────────────────────────────────────────────────────

function subScoreColor(score: number) {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
}

const BREAKDOWN_LABELS: Record<keyof ScoreBreakdown, string> = {
  transactionPerformance: 'Transaction Performance',
  skinInTheGame:          'Skin in the Game',
  clientOutcomes:         'Client Outcomes',
  expertise:              'Local Market Expertise',
  responsiveness:         'Responsiveness',
  marketIntelligence:     'Market Intelligence',
};

function consistencyColor(rating: ConsistencyRating) {
  if (rating === 'Highly consistent') return '#10b981';
  if (rating === 'Moderate variance') return '#f59e0b';
  return '#ef4444';
}

interface Props {
  agent:     Agent;
  breakdown: ScoreBreakdown;
}

export default function AIInsights({ agent, breakdown }: Props) {
  const waveColor = consistencyColor(agent.consistencyRating);

  return (
    <section
      className="rounded-2xl p-4 sm:p-5"
      style={{ background: '#0F1628', border: '1px solid #1E2A3A', borderRadius: '16px' }}
    >
      <div className="flex items-center gap-3 mb-5">
        <SectionHeader className="mb-0">Provn Intelligence</SectionHeader>
        <span
          className="font-black px-3 py-1 rounded-full"
          style={{ fontSize: '11px', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.30)', letterSpacing: '0.05em' }}
        >
          AI Generated
        </span>
      </div>

      {/* Score breakdown */}
      <div className="rounded-2xl p-3 sm:p-4 mb-5" style={INNER}>
        <p className="uppercase mb-4" style={{ fontSize: '11px', fontWeight: 600, color: C_TER, letterSpacing: '0.1em' }}>Score Breakdown</p>
        <div className="space-y-4">
          {(Object.keys(breakdown) as Array<keyof ScoreBreakdown>).map((key) => {
            const score  = breakdown[key];
            const weight = Math.round(SCORE_WEIGHTS[key] * 100);
            const color  = subScoreColor(score);
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{BREAKDOWN_LABELS[key]}</span>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: '12px', color: C_SEC }}>{weight}% weight</span>
                    <span className="font-black tabular-nums w-8 text-right" style={{ fontSize: '20px', color }}>{score}</span>
                  </div>
                </div>
                <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: '#1E2A3A' }}>
                  <div className="h-2 rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4" style={{ fontSize: '11px', color: C_TER }}>Verified by Provn · Computed from verified data sources</p>
      </div>

      {/* Plain-English summary lines */}
      <div className="space-y-3 pt-1">
        <p className="leading-relaxed" style={{ fontSize: '13px', color: C_INTERP, lineHeight: 1.6 }}>
          <span className="font-semibold text-white">Writing style:</span> {agent.writingStyleSummary}
        </p>
        <p className="leading-relaxed" style={{ fontSize: '13px', color: C_INTERP, lineHeight: 1.6 }}>
          <span className="font-semibold text-white">Consistency:</span>{' '}
          <span className="font-semibold" style={{ color: waveColor }}>{agent.consistencyRating}</span>
          {' '}— based on variance in MLS performance metrics over 3 years
        </p>
        <p className="leading-relaxed" style={{ fontSize: '13px', color: C_INTERP, lineHeight: 1.6 }}>
          <span className="font-semibold text-white">Best match for:</span> {agent.clientTypeMatch}
        </p>
        <SourceLabel source="Source: Provn AI · MLS Data · Public bio & listing copy" />
      </div>
    </section>
  );
}
