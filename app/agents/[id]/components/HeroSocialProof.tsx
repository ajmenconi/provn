import { Agent } from '@/types/agent';
import SourceLabel from './SourceLabel';
import SectionHeader from './SectionHeader';

// ── Design tokens ─────────────────────────────────────────────────────────────

const C_SEC    = '#94A3B8';
const C_TER    = '#4B5563';
const C_INTERP = '#CBD5E1';

// ── Stars ─────────────────────────────────────────────────────────────────────

function Stars({ score }: { score: number }) {
  const filled = Math.round(score);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} className="w-5 h-5" fill={i < filled ? '#fbbf24' : 'rgba(255,255,255,0.10)'} viewBox="0 0 24 24">
          <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" />
        </svg>
      ))}
    </div>
  );
}

// ── Platform config ───────────────────────────────────────────────────────────

// Letter badge dark backgrounds & accent colors per design system
const PLATFORM_CONFIG: Record<string, { bg: string; short: string; badgeBg: string; badgeColor: string }> = {
  'Google':      { bg: '#4285F4', short: 'G', badgeBg: '#1A0D0D', badgeColor: '#EF4444' },
  'Zillow':      { bg: '#006AFF', short: 'Z', badgeBg: '#1A1200', badgeColor: '#F59E0B' },
  'Realtor.com': { bg: '#D92228', short: 'R', badgeBg: '#1A0D0D', badgeColor: '#EF4444' },
  'Homes.com':   { bg: '#7B2FBE', short: 'H', badgeBg: '#0D0D1A', badgeColor: '#8B5CF6' },
};

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  agent: Agent;
}

export default function HeroSocialProof({ agent }: Props) {
  return (
    <div
      className="rounded-2xl p-4 sm:p-5 flex flex-col gap-4"
      style={{ background: '#0F1628', border: '1px solid #1E2A3A', borderRadius: '16px' }}
    >
      <SectionHeader className="mb-0">Social Proof</SectionHeader>

      {/* Composite score row */}
      <div className="flex items-end gap-3">
        <div>
          <span className="font-black text-white tabular-nums leading-none" style={{ fontSize: '56px', fontWeight: 900, lineHeight: 1 }}>
            {agent.weightedCompositeScore.toFixed(2)}
          </span>
          <span className="font-light ml-1.5" style={{ fontSize: '20px', color: C_TER }}>/ 5</span>
        </div>
        <div className="pb-2 flex flex-col gap-1">
          <Stars score={agent.weightedCompositeScore} />
          <p style={{ fontSize: '13px', color: C_SEC }}>
            <span className="font-black text-white" style={{ fontSize: '15px' }}>
              {agent.totalVerifiedReviewCount.toLocaleString()}
            </span>{' '}
            verified reviews
          </p>
        </div>
      </div>

      {/* Platform mini-cards — 2×2 grid */}
      <div className="grid grid-cols-2 gap-2">
        {agent.reviewPlatforms.map((p) => {
          const cfg = PLATFORM_CONFIG[p.platform] ?? { bg: '#6b7280', short: p.platform[0], badgeBg: '#1A1D2E', badgeColor: '#6b7280' };
          return (
            <div
              key={p.platform}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
              style={{ backgroundColor: '#0A0F1E', border: '1px solid #1E2A3A' }}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center font-black shrink-0"
                style={{ background: cfg.badgeBg, border: `2px solid ${cfg.badgeColor}`, color: cfg.badgeColor, fontSize: '11px' }}
              >
                {cfg.short}
              </span>
              <div>
                <p className="font-black text-white leading-none tabular-nums" style={{ fontSize: '16px' }}>
                  {p.score.toFixed(1)}
                </p>
                <p className="mt-0.5" style={{ fontSize: '11px', color: C_TER }}>{p.reviewCount} reviews</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Provn Verified Survey */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{ background: 'linear-gradient(135deg, #0A1F12, #0F1628)', border: '1px solid rgba(16,185,129,0.4)' }}
      >
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="font-semibold" style={{ fontSize: '13px', color: '#10B981' }}>Provn Verified Survey</p>
          <p className="leading-relaxed" style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.5 }}>
            Independent · issued 90 days post-close
          </p>
        </div>
        <p className="font-black tabular-nums shrink-0" style={{ fontSize: '24px', color: '#10B981' }}>
          {agent.postCloseSurveyScore.toFixed(1)}
        </p>
      </div>

      {/* Keyword pills */}
      <div className="flex flex-wrap gap-2">
        {agent.reviewKeywordThemes.map((theme) => (
          <span
            key={theme}
            className="font-semibold px-3 py-1.5 rounded-full"
            style={{ fontSize: '12px', backgroundColor: '#0A0F1E', border: '1px solid #1E2A3A', color: C_INTERP }}
          >
            {theme}
          </span>
        ))}
      </div>

      {/* Source */}
      <div className="pt-1 border-t" style={{ borderColor: '#1E2A3A' }}>
        <SourceLabel source="Provn-verified · Google, Zillow, Realtor.com, Homes.com" />
      </div>
    </div>
  );
}
