import { Agent } from '@/types/agent';
import SourceLabel from './SourceLabel';

function StarScore({ score, max }: { score: number; max: number }) {
  const pct = (score / max) * 100;
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="absolute inset-y-0 left-0 bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-bold text-gray-900">{score.toFixed(1)}</span>
    </div>
  );
}

function formatReviewDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

interface Props {
  agent: Agent;
}

export default function SocialProof({ agent }: Props) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Social Proof</h2>

      {/* Composite score */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6 pb-5 border-b border-gray-100">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Weighted Composite
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-black text-gray-900">
              {agent.weightedCompositeScore.toFixed(2)}
            </span>
            <span className="text-lg text-gray-400">/ 5.0</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {agent.totalVerifiedReviewCount.toLocaleString()} verified reviews across all platforms
          </p>
          <SourceLabel source="Verified by Provn · Aggregated from Google, Zillow, Realtor.com, Homes.com" />
        </div>

        <div className="sm:ml-auto text-sm text-gray-500">
          Most recent review:{' '}
          <span className="font-semibold text-gray-700">
            {formatReviewDate(agent.mostRecentReviewDate)}
          </span>
        </div>
      </div>

      {/* Platform breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {agent.reviewPlatforms.map((p) => (
          <div key={p.platform}>
            <p className="text-xs font-semibold text-gray-500">{p.platform}</p>
            <StarScore score={p.score} max={p.maxScore} />
            <p className="text-xs text-gray-400 mt-0.5">{p.reviewCount} reviews</p>
            <SourceLabel source={`Source: ${p.platform}`} />
          </div>
        ))}
      </div>

      {/* Keyword themes */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Top Review Themes
        </p>
        <div className="flex flex-wrap gap-2">
          {agent.reviewKeywordThemes.map((theme) => (
            <span
              key={theme}
              className="text-sm font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full"
            >
              {theme}
            </span>
          ))}
        </div>
        <SourceLabel source="Source: Provn AI · Keyword extraction from all platform reviews" />
      </div>

      {/* Post-close survey */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
              Provn Verified Post-Close Survey
            </p>
            <p className="text-xs text-blue-500 mt-0.5">
              Platform-issued 90 days after closing · Carries additional weight
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-blue-800">
              {agent.postCloseSurveyScore.toFixed(1)}
            </span>
            <span className="text-sm text-blue-400"> / 5</span>
          </div>
        </div>
        <SourceLabel source="Verified by Provn · Direct client outreach post-close" />
      </div>
    </section>
  );
}
