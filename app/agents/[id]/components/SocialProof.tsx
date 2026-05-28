import { Agent } from '@/types/agent';
import { gradeAccent } from '@/lib/gradeAccent';
import SourceLabel from './SourceLabel';

// ── Stars ─────────────────────────────────────────────────────────────────────

function Stars({ score, max = 5 }: { score: number; max?: number }) {
  const filled = Math.round((score / max) * 5);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < filled ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" />
        </svg>
      ))}
    </div>
  );
}

// ── Platform config ───────────────────────────────────────────────────────────

const PLATFORM_CONFIG: Record<string, { bg: string; text: string; short: string }> = {
  'Google':      { bg: '#4285F4', text: '#fff', short: 'G' },
  'Zillow':      { bg: '#006AFF', text: '#fff', short: 'Z' },
  'Realtor.com': { bg: '#D92228', text: '#fff', short: 'R' },
  'Homes.com':   { bg: '#7B2FBE', text: '#fff', short: 'H' },
};

// ── Keyword theme colors ──────────────────────────────────────────────────────

const THEME_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-emerald-100 text-emerald-800',
  'bg-violet-100 text-violet-800',
  'bg-amber-100 text-amber-800',
  'bg-pink-100 text-pink-800',
];

// ── Section ───────────────────────────────────────────────────────────────────

interface Props {
  agent: Agent;
}

export default function SocialProof({ agent }: Props) {
  const accent = gradeAccent(agent.provnLetterGrade);

  return (
    <section
      className="bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 p-5 sm:p-6"
      style={{ borderLeftColor: accent }}
    >
      <h2 className="text-2xl font-black text-gray-900 mb-5">⭐ Social Proof</h2>

      {/* Main row: composite score + platform breakdown */}
      <div className="flex flex-col sm:flex-row gap-6">

        {/* Composite score — dominant left column */}
        <div className="flex flex-col gap-2 sm:pr-6 sm:border-r sm:border-gray-100 shrink-0">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Composite Score</p>
          <div className="flex items-baseline gap-2">
            <span
              className="font-black text-gray-900 tabular-nums leading-none"
              style={{ fontSize: '72px', lineHeight: 1 }}
            >
              {agent.weightedCompositeScore.toFixed(2)}
            </span>
            <span className="text-2xl font-light text-gray-300 mb-1">/ 5</span>
          </div>
          <Stars score={agent.weightedCompositeScore} />
          <p className="text-sm text-gray-600 mt-1">
            <span className="text-xl font-black text-gray-900 tabular-nums">
              {agent.totalVerifiedReviewCount.toLocaleString()}
            </span>{' '}
            verified reviews
          </p>
          <SourceLabel source="Verified by Provn · Google, Zillow, Realtor.com, Homes.com" />
        </div>

        {/* Right column: platform mini-cards + Provn survey */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {/* Platform scores 2×2 grid */}
          <div className="grid grid-cols-2 gap-2">
            {agent.reviewPlatforms.map((p) => {
              const cfg = PLATFORM_CONFIG[p.platform] ?? { bg: '#6b7280', text: '#fff', short: p.platform[0] };
              return (
                <div
                  key={p.platform}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                  style={{ backgroundColor: `${cfg.bg}10`, border: `1.5px solid ${cfg.bg}28` }}
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black shrink-0"
                    style={{ backgroundColor: cfg.bg, fontSize: '10px' }}
                  >
                    {cfg.short}
                  </span>
                  <div>
                    <p className="text-base font-black text-gray-900 leading-none tabular-nums">
                      {p.score.toFixed(1)}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{p.reviewCount} reviews</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Provn Verified Survey — inline */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">
            <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-blue-700">Provn Verified Survey</p>
              <p className="text-[11px] text-blue-500 leading-snug">Independent score · issued 90 days post-close</p>
            </div>
            <p className="text-2xl font-black text-blue-700 tabular-nums shrink-0">
              {agent.postCloseSurveyScore.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Keyword theme pills */}
      <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-100">
        {agent.reviewKeywordThemes.map((theme, i) => (
          <span
            key={theme}
            className={`text-sm font-bold px-4 py-1.5 rounded-full ${THEME_COLORS[i % THEME_COLORS.length]}`}
          >
            {theme}
          </span>
        ))}
      </div>
    </section>
  );
}
