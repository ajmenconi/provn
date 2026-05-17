import { Agent, ConsistencyRating, ResponseGrade } from '@/types/agent';
import { ScoreBreakdown, SCORE_WEIGHTS } from '@/lib/scoring';
import SourceLabel from './SourceLabel';

function responseGradeColor(grade: ResponseGrade): string {
  if (grade === 'Under 1 hour') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (grade === 'Same day') return 'bg-blue-100 text-blue-700 border-blue-200';
  if (grade === 'Next day') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-red-100 text-red-700 border-red-200';
}

function consistencyColor(rating: ConsistencyRating): string {
  if (rating === 'Highly consistent') return 'text-emerald-600';
  if (rating === 'Moderate variance') return 'text-amber-600';
  return 'text-red-500';
}

function subScoreColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-400';
  return 'bg-red-500';
}

const BREAKDOWN_LABELS: Record<keyof ScoreBreakdown, string> = {
  transactionPerformance: 'Transaction Performance',
  skinInTheGame:          'Skin in the Game',
  clientOutcomes:         'Client Outcomes',
  expertise:              'Expertise',
  responsiveness:         'Responsiveness',
  marketIntelligence:     'Market Intelligence',
};

interface Props {
  agent: Agent;
  breakdown: ScoreBreakdown;
}

export default function AIInsights({ agent, breakdown }: Props) {
  return (
    <section className="bg-slate-900 rounded-xl p-5 text-white">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xs font-semibold bg-violet-600 text-white px-2.5 py-1 rounded-full">
          AI Generated
        </span>
        <h2 className="text-lg font-bold text-white">Provn Intelligence</h2>
      </div>

      {/* Score breakdown */}
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Score Breakdown
        </p>
        <div className="space-y-3">
          {(Object.keys(breakdown) as Array<keyof ScoreBreakdown>).map((key) => {
            const score = breakdown[key];
            const weight = Math.round(SCORE_WEIGHTS[key] * 100);
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-300 font-medium">
                    {BREAKDOWN_LABELS[key]}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{weight}% weight</span>
                    <span className="text-sm font-bold text-white w-8 text-right">{score}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${subScoreColor(score)}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-600 mt-3">Verified by Provn · Computed from verified data sources</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Writing style */}
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Writing Style Analysis
          </p>
          <p className="text-sm text-white leading-relaxed">{agent.writingStyleSummary}</p>
          <SourceLabel source="Source: Provn AI · Public bio & listing copy analysis" />
        </div>

        {/* Response grade */}
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Response Pattern
          </p>
          <span
            className={`inline-block text-sm font-bold px-3 py-1.5 rounded-full border ${responseGradeColor(agent.responseGrade)}`}
          >
            {agent.responseGrade}
          </span>
          <p className="text-xs text-slate-500 mt-2">
            Measured via blind mystery shopper cadence — agent is not aware of test timing
          </p>
          <SourceLabel source="Verified by Provn · Mystery shopper data" />
        </div>

        {/* Consistency score */}
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Consistency Score
          </p>
          <p className={`text-lg font-bold ${consistencyColor(agent.consistencyRating)}`}>
            {agent.consistencyRating}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Measures variance in performance metrics over the last 3 years
          </p>
          <SourceLabel source="Source: MLS Data · Provn Analysis" />
        </div>

        {/* Client type match */}
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Client Type Match
          </p>
          <p className="text-sm text-white leading-relaxed">{agent.clientTypeMatch}</p>
          <SourceLabel source="Source: Provn AI · MLS transaction history analysis" />
        </div>
      </div>
    </section>
  );
}
