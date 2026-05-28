/**
 * PerformanceSnapshot — six highest-signal stats in large type.
 * Consumer reads this section as: "are they good at their job?"
 *
 * Stats (in order of consumer relevance):
 *  1. Most Recent Sale       — recency of market activity
 *  2. Listings Closed        — ratio of taken → closed (trust signal)
 *  3. Highest Sale Ever      — ceiling this agent has operated at
 *  4. Years in Market        — local-market depth
 *  5. Total Sales Volume     — career dollar production + percentile rank
 *  6. Local Market Tenure    — professional tenure + community roots
 *
 * DRE disciplinary banner sits above the grid — it's the first
 * hard fact a consumer should see before the numbers.
 *
 * Grid: 1-col mobile → 2-col tablet → 3-col desktop
 */
import { Agent } from '@/types/agent';
import { gradeAccent } from '@/lib/gradeAccent';
import SourceLabel from './SourceLabel';
import SectionHeader from './SectionHeader';

// ── Design tokens ─────────────────────────────────────────────────────────────

const CARD     = { background: '#1A1D2E', border: '1px solid #2D3148' } as const;
const C_SEC    = '#94A3B8';
const C_TER    = '#4B5563';
const C_INTERP = '#CBD5E1';

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtPrice(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `$${m % 1 === 0 ? m : m.toFixed(1)}M`;
  }
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

function recencyLabel(iso: string): string {
  const d = daysSince(iso);
  if (d < 60)  return `${d} days ago`;
  const m = Math.floor(d / 30);
  return `${m} month${m !== 1 ? 's' : ''} ago`;
}

function recencyColor(iso: string): string {
  const d = daysSince(iso);
  if (d <= 60)  return '#10b981';
  if (d <= 180) return '#f59e0b';
  return '#ef4444';
}

function formatSaleDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// ── Stat card shell ───────────────────────────────────────────────────────────

function StatCard({
  label,
  icon,
  value,
  valueSuffix,
  context,
  accent,
  badge,
  source,
}: {
  label:        string;
  icon?:        React.ReactNode;
  value:        React.ReactNode;
  valueSuffix?: React.ReactNode;
  context:      React.ReactNode;
  accent:       string;
  badge?:       React.ReactNode;
  source:       string;
}) {
  return (
    <div className="rounded-2xl p-4 sm:p-5 flex flex-col gap-3" style={CARD}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {icon && <div className="shrink-0">{icon}</div>}
          <p className="leading-snug" style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{label}</p>
        </div>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>
      <div className="flex items-end gap-2 leading-none">
        <span className="font-black tabular-nums" style={{ fontSize: '52px', lineHeight: 1, color: accent }}>
          {value}
        </span>
        {valueSuffix && (
          <span className="font-black pb-1.5" style={{ fontSize: '24px', color: `${accent}80` }}>
            {valueSuffix}
          </span>
        )}
      </div>
      <p className="leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>
        {context}
      </p>
      <SourceLabel source={source} />
    </div>
  );
}

// ── DRE Record banner ─────────────────────────────────────────────────────────

function DREBanner({ agent }: { agent: Agent }) {
  if (agent.disciplinaryRecord === 'clean') {
    return (
      <div
        className="flex items-center gap-3 px-4 sm:px-5 py-3.5 rounded-2xl"
        style={{ background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.25)' }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#10b981' }}>
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white" style={{ fontSize: '14px' }}>
            No disciplinary actions on record
          </p>
          <p className="leading-relaxed" style={{ fontSize: '12px', color: '#10b981', lineHeight: 1.5 }}>
            CA DRE verified · License #{agent.licenseNumber} · Most consumers never check this
          </p>
        </div>
        <span
          className="uppercase px-2.5 py-1 rounded-full shrink-0"
          style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.30)', letterSpacing: '0.05em' }}
        >
          Clean
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex items-start gap-3 px-4 sm:px-5 py-3.5 rounded-2xl"
      style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.30)' }}
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#ef4444' }}>
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white" style={{ fontSize: '14px' }}>
          Disciplinary action on record — DRE public database
        </p>
        {agent.disciplinaryDetails && (
          <p className="mt-0.5 leading-relaxed" style={{ fontSize: '12px', color: '#ef4444', lineHeight: 1.5 }}>{agent.disciplinaryDetails}</p>
        )}
      </div>
    </div>
  );
}

// ── Recency badge ─────────────────────────────────────────────────────────────

function RecencyBadge({ iso }: { iso: string }) {
  const color = recencyColor(iso);
  return (
    <span
      className="uppercase px-2.5 py-1 rounded-full"
      style={{ fontSize: '11px', fontWeight: 800, background: `${color}15`, color, border: `1px solid ${color}30`, letterSpacing: '0.05em' }}
    >
      {recencyLabel(iso)}
    </span>
  );
}

// ── Percentile badge (for volume + other ranked stats) ────────────────────────

function PercentileBadge({ percentile }: { percentile: number }) {
  const topPct = 100 - percentile;
  const color  = percentile >= 75 ? '#10b981' : percentile >= 50 ? '#f59e0b' : '#6b7280';
  const label  =
    topPct <= 1  ? 'Top 1%'  :
    topPct <= 3  ? 'Top 3%'  :
    topPct <= 5  ? 'Top 5%'  :
    topPct <= 10 ? 'Top 10%' :
    topPct <= 25 ? 'Top 25%' :
    topPct <= 50 ? 'Top 50%' :
                   `Top ${topPct}%`;
  return (
    <span
      className="uppercase px-2.5 py-1 rounded-full"
      style={{ fontSize: '11px', fontWeight: 800, background: `${color}15`, color, border: `1px solid ${color}30`, letterSpacing: '0.05em' }}
    >
      {label}
    </span>
  );
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────

function BarChartIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20V13m5 7V9m5 11V4m5 16V10" />
    </svg>
  );
}

function MapPinIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C_INTERP} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

interface Props {
  agent: Agent;
}

export default function PerformanceSnapshot({ agent }: Props) {
  const accent      = gradeAccent(agent.provnLetterGrade);
  const mc          = agent.marketConsistency;
  const closedOf10  = mc ? Math.round((mc.listingsClosedLast12 / mc.listingsTakenLast12) * 10) : null;
  const yearsActive = new Date().getFullYear() - agent.activeInCountySince;

  // Box 5 — volume percentile (from radar data if available)
  const volumePercentile = agent.radarData?.careerVolume?.percentile ?? null;
  const volumeAccent     =
    volumePercentile !== null
      ? (volumePercentile >= 75 ? '#10b981' : volumePercentile >= 50 ? '#f59e0b' : '#6b7280')
      : accent;

  // Box 6 — local market knowledge (social-media-verified residency)
  const SOCIAL_META: Record<string, { label: string; color: string; short: string }> = {
    instagram: { label: 'Instagram', color: '#E1306C', short: 'IG' },
    linkedin:  { label: 'LinkedIn',  color: '#0A66C2', short: 'in' },
  };

  // Find the best local-residency card — prefer ones with social verification
  const LOCAL_KEYWORDS = ['native', 'local', 'neighbor', 'resident', 'born', 'raised', 'lives'];
  const localCard =
    agent.personalCards?.find(c => {
      const txt = `${c.label} ${c.value}`.toLowerCase();
      return LOCAL_KEYWORDS.some(kw => txt.includes(kw)) && c.verifiedVia;
    }) ??
    agent.personalCards?.find(c => {
      const txt = `${c.label} ${c.value}`.toLowerCase();
      return LOCAL_KEYWORDS.some(kw => txt.includes(kw));
    }) ??
    null;

  const socialMeta         = localCard?.verifiedVia ? SOCIAL_META[localCard.verifiedVia] : null;
  const socialVerification = agent.socialVerifications?.find(
    v => v.platform === localCard?.verifiedVia && v.connected,
  ) ?? null;
  const localYears         = agent.yearsInLocalMarket ?? null;
  const residentSinceYear  = localYears ? new Date().getFullYear() - localYears : null;

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader>Performance Snapshot</SectionHeader>

      {/* DRE record — first hard fact */}
      <DREBanner agent={agent} />

      {/* 6-stat grid: 1-col mobile → 2-col tablet → 3-col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* ── 1. Most Recent Sale ─────────────────────────────────── */}
        <StatCard
          label="Most Recent Sale"
          value={fmtPrice(agent.mostRecentSalePrice)}
          badge={<RecencyBadge iso={agent.mostRecentSaleDate} />}
          context={
            <>
              {agent.mostRecentSaleCity} · {formatSaleDate(agent.mostRecentSaleDate)}.{' '}
              {daysSince(agent.mostRecentSaleDate) <= 60
                ? 'Closed recently — current market knowledge is high.'
                : daysSince(agent.mostRecentSaleDate) <= 180
                ? 'Active this year — market knowledge is current.'
                : 'No recent closing — verify current activity before hiring.'}
            </>
          }
          accent={accent}
          source="Source: MLS"
        />

        {/* ── 2. Listings Taken vs Closed ─────────────────────────── */}
        {closedOf10 !== null ? (
          <StatCard
            label="Listings Taken vs Closed"
            value={closedOf10}
            valueSuffix="/10"
            context={
              <>
                Closes {closedOf10} out of every 10 listings they take.{' '}
                {mc!.listingsClosedLast12} of {mc!.listingsTakenLast12} listings from the last
                12 months closed with this agent.
              </>
            }
            accent={closedOf10 >= 8 ? '#10b981' : closedOf10 >= 6 ? '#f59e0b' : '#ef4444'}
            source="Source: MLS 12-month history"
          />
        ) : (
          <StatCard
            label="Listings Taken vs Closed"
            value="—"
            context="Insufficient data to compute. Ask the agent directly."
            accent={C_SEC}
            source="Source: MLS"
          />
        )}

        {/* ── 3. Highest Sale Ever ────────────────────────────────── */}
        <StatCard
          label="Highest Sale Ever"
          value={fmtPrice(agent.highestSalePrice)}
          context="Has closed at this price point before — confirms they can operate at this level of the market."
          accent={accent}
          source="Source: MLS career history"
        />

        {/* ── 4. Years Active in County ───────────────────────────── */}
        <StatCard
          label={`Years Active in ${agent.primaryCounty} County`}
          value={yearsActive}
          context={
            <>
              Active as an agent in this specific county since {agent.activeInCountySince}.{' '}
              Local market depth beyond years licensed.
            </>
          }
          accent={accent}
          source="Source: CA DRE · MLS History"
        />

        {/* ── 5. Total Sales Volume ───────────────────────────────── */}
        <StatCard
          label="Total Sales Volume"
          icon={<BarChartIcon color={volumeAccent} />}
          value={fmtPrice(agent.totalCareerVolume)}
          badge={volumePercentile !== null ? <PercentileBadge percentile={volumePercentile} /> : undefined}
          context={
            <>
              {volumePercentile !== null && (
                <>
                  Top {100 - volumePercentile}% of {agent.primaryCounty} County agents by volume.{' '}
                </>
              )}
              Total value of all homes sold throughout their career.
            </>
          }
          accent={volumeAccent}
          source="Source: MLS career production data"
        />

        {/* ── 6. Local Market Knowledge ───────────────────────────── */}
        <StatCard
          label="Local Market Knowledge"
          icon={<MapPinIcon color={accent} />}
          value={localYears ?? '—'}
          valueSuffix={localYears ? 'yrs' : undefined}
          badge={
            socialMeta ? (
              <span
                className="uppercase px-2.5 py-1 rounded-full"
                style={{
                  fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em',
                  background: `${socialMeta.color}15`,
                  color: socialMeta.color,
                  border: `1px solid ${socialMeta.color}30`,
                }}
              >
                via {socialMeta.label}
              </span>
            ) : undefined
          }
          context={
            <span className="flex flex-col gap-1.5">
              {localCard ? (
                <span>
                  {localCard.value}.
                  {residentSinceYear && ` Resident since ${residentSinceYear}.`}
                  {socialVerification && (
                    <> Confirmed via {socialMeta!.label}{' '}
                      <span style={{ color: socialMeta!.color }}>@{socialVerification.handle}</span>.
                    </>
                  )}
                </span>
              ) : residentSinceYear ? (
                <span>
                  {agent.primaryCounty} County resident since {residentSinceYear}.
                </span>
              ) : (
                <span>Community tenure not verified.</span>
              )}
              <span
                className="flex items-center gap-1.5 pt-1.5"
                style={{ borderTop: '1px solid #2D3148' }}
              >
                <HomeIcon />
                <span>How long they have lived in the communities they sell.</span>
              </span>
            </span>
          }
          accent={localYears ? accent : C_SEC}
          source={
            socialMeta
              ? `Source: ${socialMeta.label} · Agent-verified`
              : 'Source: Agent-submitted'
          }
        />

      </div>
    </section>
  );
}
