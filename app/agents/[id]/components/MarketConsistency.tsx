/**
 * MarketConsistency — measures whether the agent is actively engaged
 * in the current market or operating part-time.
 *
 * Sections:
 *  1. 36-month closing timeline (color-coded monthly bars)
 *  2. Longest gap callout with optional tough-market context
 *  3. Full-time indicator (briefcase / clock icon)
 *  4. Listings taken vs closed (house icon grid)
 *  5. Market re-entry rate (expired → competitor)
 *  6. Last closing date (recency proxy for market knowledge)
 */
import { Agent, MarketConsistency as MC, MonthActivityStatus } from '@/types/agent';
import { gradeAccent } from '@/lib/gradeAccent';
import SourceLabel from './SourceLabel';
import SectionHeader from './SectionHeader';

// ── Status colors ─────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<MonthActivityStatus, string> = {
  closed: '#10b981',   // emerald — had a closing
  active: '#f59e0b',   // amber   — active but no close
  none:   '#1f2937',   // dark gray — no recorded activity
};

const STATUS_BORDER: Record<MonthActivityStatus, string> = {
  closed: '#059669',
  active: '#d97706',
  none:   '#374151',
};

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ── Full-time level ───────────────────────────────────────────────────────────

function fullTimeConfig(avg: number) {
  if (avg >= 12) return { label: 'Full-time dedicated', color: '#10b981', useBriefcase: true  };
  if (avg >= 4)  return { label: 'Active agent',        color: '#3b82f6', useBriefcase: true  };
  return              { label: 'Part-time activity level', color: '#f59e0b', useBriefcase: false };
}

// ── Date helpers ──────────────────────────────────────────────────────────────

function recencyLabel(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 60) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months !== 1 ? 's' : ''} ago`;
}

function formatMonthYear(iso: string): string {
  const d = new Date(iso);
  return `${MONTH_ABBR[d.getMonth()]} ${d.getFullYear()}`;
}

// ── House icon (reused from FallThrough pattern) ──────────────────────────────

function HouseIcon({ filled, accent }: { filled: boolean; accent: string }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        d="M12 3 2 12h3v9h5v-5h4v5h5v-9h3L12 3z"
        fill={filled ? accent : 'rgba(255,255,255,0.07)'}
        stroke={filled ? accent : 'rgba(255,255,255,0.15)'}
        strokeWidth="0.5"
      />
    </svg>
  );
}

// ── Stat panel shell ──────────────────────────────────────────────────────────

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl p-4 flex flex-col gap-3 ${className}`}
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #2D3148' }}
    >
      {children}
    </div>
  );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{children}</p>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  agent: Agent;
}

export default function MarketConsistency({ agent }: Props) {
  const mc: MC | undefined = agent.marketConsistency;
  if (!mc) return null;

  const accent   = gradeAccent(agent.provnLetterGrade);
  const ftConfig = fullTimeConfig(mc.avgTransactionsLast3Years);

  // Listings ratio: scale to out-of-10
  const closedOutOf10 = Math.round((mc.listingsClosedLast12 / mc.listingsTakenLast12) * 10);

  // Gap flag threshold (> 3 months)
  const gapFlagged = mc.longestGapMonths > 3;

  // Year boundary positions for timeline labels
  const years: { label: string; index: number }[] = [];
  mc.monthlyActivity.forEach((m, i) => {
    if (m.month === 1 || i === 0) {
      years.push({ label: String(m.year), index: i });
    }
  });

  return (
    <section
      className="rounded-2xl p-6"
      style={{ background: '#1A1D2E', border: '1px solid #2D3148' }}
    >
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <SectionHeader className="mb-1">Market Consistency</SectionHeader>
          <p className="text-white font-bold text-lg leading-snug">
            Active market engagement — last 36 months
          </p>
        </div>
        {/* Full-time badge */}
        <span
          className="text-xs font-black px-3 py-1.5 rounded-full shrink-0"
          style={{ backgroundColor: `${ftConfig.color}22`, color: ftConfig.color, border: `1px solid ${ftConfig.color}44` }}
        >
          {ftConfig.label}
        </span>
      </div>

      {/* ── 36-month timeline ── */}
      <div className="mb-6">
        <p className="text-xs font-bold text-gray-400 mb-3">Closing consistency — last 36 months</p>

        {/* Month bars */}
        <div className="flex gap-0.5">
          {mc.monthlyActivity.map((m, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: '28px',
                backgroundColor: STATUS_COLOR[m.status],
                border: `1px solid ${STATUS_BORDER[m.status]}`,
                minWidth: 0,
              }}
              title={`${MONTH_ABBR[m.month - 1]} ${m.year}: ${m.status}`}
            />
          ))}
        </div>

        {/* Year labels below — positioned at proportional offsets */}
        <div className="relative mt-1.5" style={{ height: '16px' }}>
          {years.map(({ label, index }) => (
            <span
              key={label}
              className="absolute text-[10px] text-gray-600 font-semibold"
              style={{ left: `${(index / mc.monthlyActivity.length) * 100}%` }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4">
          {([['closed', 'Closing that month'], ['active', 'Active, no close'], ['none', 'No activity']] as const).map(
            ([status, desc]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: STATUS_COLOR[status], border: `1px solid ${STATUS_BORDER[status]}` }}
                />
                <span className="text-[10px] text-gray-500">{desc}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

        {/* Longest gap */}
        <Panel>
          <PanelLabel>Longest period without a closing</PanelLabel>
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-4xl font-black tabular-nums"
              style={{ color: gapFlagged ? '#f59e0b' : accent }}
            >
              {mc.longestGapMonths}
            </span>
            <span className="text-base text-gray-400">months</span>
            {gapFlagged && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 ml-1">
                Flagged
              </span>
            )}
          </div>
          {gapFlagged && mc.marketContextNote && (
            <p className="text-[11px] text-gray-500 leading-snug border-l-2 border-amber-600/40 pl-2.5 italic">
              {mc.marketContextNote}
            </p>
          )}
          <SourceLabel source="Source: MLS closing history"/>
        </Panel>

        {/* Full-time indicator */}
        <Panel>
          <PanelLabel>Market engagement level</PanelLabel>
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${ftConfig.color}20`, border: `1.5px solid ${ftConfig.color}40` }}
            >
              {ftConfig.useBriefcase ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={ftConfig.color} strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 14.15V9.406c0-1.08.768-2.014 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={ftConfig.color} strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-base font-black" style={{ color: ftConfig.color }}>{ftConfig.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Avg {mc.avgTransactionsLast3Years} deals/yr · last 3 years
              </p>
            </div>
          </div>
          <SourceLabel source="Source: MLS transaction history"/>
        </Panel>

        {/* Listings taken vs closed */}
        <Panel>
          <PanelLabel>Listings taken vs closed (last 12 months)</PanelLabel>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <HouseIcon key={i} filled={i < closedOutOf10} accent={accent} />
            ))}
          </div>
          <p className="text-sm font-bold text-white/80">
            Closes{' '}
            <span style={{ color: accent }}>{closedOutOf10} out of every 10</span>{' '}
            listings taken
          </p>
          <p className="text-[11px] text-gray-500">
            {mc.listingsClosedLast12} of {mc.listingsTakenLast12} listings closed with same agent
          </p>
          <SourceLabel source="Source: MLS listing history"/>
        </Panel>

        {/* Market re-entry rate */}
        <Panel>
          <PanelLabel>Expired listings → competitor agent</PanelLabel>
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-4xl font-black tabular-nums"
              style={{ color: mc.expiredToCompetitorPct <= 15 ? accent : '#ef4444' }}
            >
              {mc.expiredToCompetitorPct}%
            </span>
            {mc.expiredToCompetitorPct <= 15 && (
              <span
                className="text-[10px] font-black px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}
              >
                Low
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 leading-snug">
            of expired or withdrawn listings re-listed with a different agent within 90 days
          </p>
          <p className="text-[11px] text-gray-600 italic">Lower is better — indicates sellers chose to stay</p>
          <SourceLabel source="Source: MLS history"/>
        </Panel>

        {/* Last closing */}
        <Panel className="sm:col-span-2">
          <PanelLabel>Current market activity</PanelLabel>
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${accent}20`, border: `1.5px solid ${accent}40` }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={accent} strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v1.5M17.25 3v1.5M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-base leading-snug">
                Last closed transaction:{' '}
                <span style={{ color: accent }}>{recencyLabel(mc.lastClosingDate)}</span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{formatMonthYear(mc.lastClosingDate)}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed border-l-2 border-gray-700 pl-2.5">
            Recency of activity is a direct proxy for current market knowledge. An agent who closed
            last month knows what buyers are doing right now.
          </p>
          <SourceLabel source="Source: MLS closing history"/>
        </Panel>

      </div>

      {/* Source footer */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: '#2D3148' }}>
        <SourceLabel source="Source: MLS transaction and listing history · Provn-verified" />
      </div>
    </section>
  );
}
