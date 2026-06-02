/**
 * AgentHeader — hero content, centered group layout.
 *
 * Three flex-peers on desktop: photo · info block · score ring
 * All three centered in a max-w-[900px] container so they read
 * as a cohesive unit rather than stretching edge-to-edge.
 *
 * Mobile: stacks vertically, all center-aligned.
 * Desktop: horizontal row, items-start, gap-12 (48px) between peers.
 *
 * Opacity rule: NO text below 70% opacity anywhere in this component.
 * The gradient provides visual interest — legibility wins over subtlety.
 */
import { Agent } from '@/types/agent';
import { gradeAccent } from '@/lib/gradeAccent';
import ScoreRing from './ScoreRing';

function formatLicenseDate(issueDateStr: string): string {
  return new Date(issueDateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

function yearsLicensed(issueDateStr: string): number {
  return new Date().getFullYear() - new Date(issueDateStr).getFullYear();
}

function heroStat(agent: Agent): string {
  const domPct    = Math.round((1 - agent.avgDaysOnMarket / agent.marketMedianDaysOnMarket) * 100);
  const spLpDelta = +(agent.salePriceToListRatio - agent.salePriceToListRatioMarket).toFixed(1);
  const prPct     = Math.round((1 - agent.priceReductionRate / agent.marketPriceReductionRate) * 100);
  if (domPct >= 40)   return `Closes homes ${domPct}% faster than the ${agent.primaryCounty} County average`;
  if (spLpDelta >= 2) return `Gets sellers ${spLpDelta}% above asking — ${spLpDelta}pp ahead of the market`;
  if (prPct >= 40)    return `Price reduction rate ${prPct}% below the county average`;
  return `${agent.totalCareerTransactions}+ verified transactions in ${agent.primaryCounty} County`;
}

function topBadges(agent: Agent): string[] {
  const badges: string[] = [];
  const domPct    = Math.round((1 - agent.avgDaysOnMarket / agent.marketMedianDaysOnMarket) * 100);
  const spLpDelta = +(agent.salePriceToListRatio - agent.salePriceToListRatioMarket).toFixed(1);
  const prPct     = Math.round((1 - agent.priceReductionRate / agent.marketPriceReductionRate) * 100);
  if (domPct >= 30)    badges.push('Fast Closer');
  if (spLpDelta >= 1)  badges.push('Over-Ask Results');
  if (prPct >= 30)     badges.push('Accurate Pricer');
  if (agent.fallThroughRate < agent.marketFallThroughRate) badges.push('Low Fall-Throughs');
  if (agent.totalCareerTransactions >= 200) badges.push('200+ Deals');
  return badges.slice(0, 3);
}

const SOURCE_COPY: Record<string, string> = {
  'zillow':      'Photo via Zillow',
  'realtor.com': 'Photo via Realtor.com',
  'auto':        'Photo auto-matched',
  'custom':      'Custom photo',
};

interface Props {
  agent: Agent;
}

export default function AgentHeader({ agent }: Props) {
  const years      = yearsLicensed(agent.licenseIssueDate);
  const accent     = gradeAccent(agent.provnLetterGrade);
  const initials   = agent.name.split(' ').map((n) => n[0]).join('');
  const sourceCopy = agent.headshotSource ? SOURCE_COPY[agent.headshotSource] : null;
  const badges     = topBadges(agent);

  return (
    // Centered group — max 900px so elements stay close together
    <div className="max-w-[900px] mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12">

      {/* ── 1. PHOTO ──────────────────────────────────────────────────────── */}
      <div className="relative shrink-0">
        {agent.headshotUrl ? (
          <img
            src={agent.headshotUrl}
            alt={agent.name}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-white/25"
          />
        ) : (
          <div
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-white/25 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <span className="text-4xl font-black text-white select-none">{initials}</span>
          </div>
        )}
        {sourceCopy && (
          <div
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full whitespace-nowrap"
            style={{ backgroundColor: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(8px)' }}
          >
            {/* 📷 source label — kept at 75% minimum */}
            <p style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>
              📷 {sourceCopy}
            </p>
          </div>
        )}
      </div>

      {/* ── 2. INFO BLOCK ─────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3">

        {/* Name */}
        <div>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.30)' }}
          >
            {agent.name}
          </h1>
          {/* Brokerage / city */}
          <p className="text-sm mt-1.5" style={{ color: '#94A3B8' }}>
            {agent.brokerageName} &middot; {agent.primaryCity}, {agent.primaryCounty} County
          </p>
        </div>

        {/* License type · status · DRE number */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
          <span
            className="text-xs font-black px-3 py-1.5 rounded-full"
            style={
              agent.licenseType === 'Broker'
                ? { background: '#1A1400', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B' }
                : { background: '#0F1628', border: '1px solid #1E2A3A', color: '#CBD5E1' }
            }
          >
            {agent.licenseType}
          </span>

          <span
            className="text-xs font-black px-3 py-1.5 rounded-full"
            style={
              agent.licenseStatus === 'Active'
                ? { background: '#10b981', color: '#ffffff' }
                : { background: '#ef4444', color: '#ffffff' }
            }
          >
            {agent.licenseStatus}
          </span>

          {/* DRE number */}
          <span className="text-xs" style={{ color: '#94A3B8' }}>
            DRE#{' '}
            <a
              href="https://www2.dre.ca.gov/PublicASP/pplinfo.asp"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-white transition-colors"
            >
              {agent.licenseNumber}
            </a>
          </span>
        </div>

        {/* License vintage */}
        <p className="leading-relaxed" style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.6 }}>
          Licensed {formatLicenseDate(agent.licenseIssueDate)} &mdash;{' '}
          <span className="font-semibold" style={{ color: '#FFFFFF' }}>{years} years</span>
          <span className="block mt-0.5" style={{ color: '#4B5563', fontSize: '11px', fontStyle: 'italic' }}>
            Source: CA DRE
          </span>
        </p>

        {/* Top-3 performance mini-pills */}
        {badges.length > 0 && (
          <div className="flex flex-wrap justify-center lg:justify-start gap-1.5">
            {badges.map((badge) => (
              <span
                key={badge}
                className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: `${accent}20`,
                  color: '#ffffff',
                  border: `1px solid ${accent}50`,
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Language pills */}
        {agent.languages.length > 0 && (
          <div className="flex flex-wrap justify-center lg:justify-start gap-2">
            {agent.languages.map((lang) => (
              <span
                key={lang}
                className="text-xs font-medium px-3 py-1 rounded-full"
                style={{
                  background: '#0F1628',
                  color: '#CBD5E1',
                  border: '1px solid #1E2A3A',
                }}
              >
                {lang}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── 3. SCORE RING ─────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3 shrink-0 lg:pt-2">
        <ScoreRing score={agent.provnScore} grade={agent.provnLetterGrade} />
        <div className="text-center">
          {/* "Provn Score" label */}
          <p
            className="uppercase mb-2"
            style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', color: '#94A3B8' }}
          >
            Provn Score
          </p>
          {/* Hero stat */}
          <p
            className="leading-snug max-w-[220px]"
            style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.5 }}
          >
            {heroStat(agent)}
          </p>
          {/* "Verified by Provn" */}
          <p className="mt-1.5" style={{ fontSize: '11px', color: '#4B5563', fontStyle: 'italic' }}>
            Verified by Provn
          </p>
        </div>
      </div>

    </div>
  );
}
