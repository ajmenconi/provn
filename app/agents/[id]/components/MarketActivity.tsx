import { Agent, MediaQuality, PhotographyGrade, MarketConsistency as MC, MonthActivityStatus } from '@/types/agent';
import { gradeAccent } from '@/lib/gradeAccent';
import SourceLabel from './SourceLabel';
import SectionHeader from './SectionHeader';

// ── Design tokens ─────────────────────────────────────────────────────────────

const INNER   = { background: 'rgba(255,255,255,0.04)', border: '1px solid #2D3148' } as const;
const C_SEC   = '#94A3B8';
const C_TER   = '#4B5563';
const C_INTERP = '#CBD5E1';
const TRACK   = 'rgba(255,255,255,0.08)';

// ── Sub-section header ────────────────────────────────────────────────────────

function SubHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="shrink-0 rounded-full" style={{ width: '2px', height: '12px', backgroundColor: '#94A3B8' }} />
      <p className="uppercase" style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.1em' }}>
        {children}
      </p>
    </div>
  );
}

// Panel label inside small stat panels (card-title level)
function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{children}</p>
  );
}

// ── Shared compare bar ────────────────────────────────────────────────────────

function CompareBar({
  agentVal, marketVal, maxVal, accent, formatFn,
}: {
  agentVal:  number;
  marketVal: number;
  maxVal:    number;
  accent:    string;
  formatFn?: (n: number) => string;
}) {
  const fmt = formatFn ?? ((n: number) => `${n}`);
  return (
    <div className="space-y-1.5">
      {[
        { label: 'This agent', val: agentVal,  isAgent: true  },
        { label: 'Market avg', val: marketVal, isAgent: false },
      ].map(({ label, val, isAgent }) => (
        <div key={label}>
          <div className="flex justify-between mb-1" style={{ fontSize: '13px' }}>
            <span style={{ color: isAgent ? '#fff' : C_SEC, fontWeight: isAgent ? 600 : 400 }}>{label}</span>
            <span style={{ color: isAgent ? '#fff' : C_SEC, fontWeight: isAgent ? 700 : 400 }}>{fmt(val)}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: TRACK }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min((val / maxVal) * 100, 100)}%`,
                backgroundColor: isAgent ? accent : 'rgba(255,255,255,0.20)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Marketing Quality sub-section ─────────────────────────────────────────────

const PHOTO_GRADE_CONFIG: Record<PhotographyGrade, { label: string; color: string; bg: string }> = {
  'Excellent':    { label: 'Excellent',    color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
  'Professional': { label: 'Professional', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  'Standard':     { label: 'Standard',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  'Basic':        { label: 'Basic',        color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
};

const MEDIA_GRADE_COLOR: Record<string, string> = {
  'A+': '#10b981', 'A': '#10b981', 'B+': '#3b82f6', 'B': '#3b82f6', 'C': '#f59e0b',
};

function MarketingQuality({ mq, accent }: { mq: MediaQuality; accent: string }) {
  const gradeColor = MEDIA_GRADE_COLOR[mq.overallGrade] ?? accent;
  const photoCfg   = PHOTO_GRADE_CONFIG[mq.photographyGrade];

  return (
    <div>
      {/* DOM callout banner */}
      <div
        className="flex items-center gap-4 px-4 sm:px-5 py-3.5 rounded-xl mb-5"
        style={{ background: `${gradeColor}18`, border: `1px solid ${gradeColor}35` }}
      >
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke={gradeColor} strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
        </svg>
        <p className="font-bold leading-relaxed" style={{ fontSize: '13px', color: gradeColor, lineHeight: 1.5 }}>
          Listings with professional media sell{' '}
          <span className="text-white">{mq.mediaFasterDays} days faster</span>{' '}
          on average — based on this agent&apos;s own MLS history
        </p>
        <div className="ml-auto flex flex-col items-center shrink-0" style={{ minWidth: '52px' }}>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: `${gradeColor}22`, border: `2px solid ${gradeColor}60` }}
          >
            <span className="font-black" style={{ fontSize: '20px', color: gradeColor }}>{mq.overallGrade}</span>
          </div>
          <p className="mt-0.5 uppercase" style={{ fontSize: '11px', fontWeight: 600, color: C_TER, letterSpacing: '0.05em' }}>Overall</p>
        </div>
      </div>

      {/* Four metric panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Photography */}
        <div className="rounded-xl p-3 sm:p-4 flex flex-col gap-3" style={INNER}>
          <PanelLabel>Photography</PanelLabel>
          <span className="self-start font-black px-3 py-1 rounded-full" style={{ fontSize: '13px', backgroundColor: photoCfg.bg, color: photoCfg.color, border: `1px solid ${photoCfg.color}40` }}>
            {photoCfg.label}
          </span>
          <CompareBar
            agentVal={mq.photosPerListingAgent}
            marketVal={mq.photosPerListingMarket}
            maxVal={Math.max(mq.photosPerListingAgent, mq.photosPerListingMarket) * 1.1}
            accent={accent}
            formatFn={(n) => `${n} photos`}
          />
          {mq.hasTwilightShots && (
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: accent }}>
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
              </svg>
              <span style={{ fontSize: '12px', color: C_INTERP }}>Twilight shots included</span>
            </div>
          )}
          <SourceLabel source="AI-analyzed from MLS listing history" />
        </div>

        {/* Video / Virtual Tour */}
        <div className="rounded-xl p-3 sm:p-4 flex flex-col gap-3" style={INNER}>
          <PanelLabel>Video / Virtual Tour</PanelLabel>
          <div>
            <p className="font-black tabular-nums" style={{ fontSize: '30px', color: accent }}>{mq.videoTourRate}%</p>
            <p className="mt-0.5 leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>
              of listings include a video walkthrough or Matterport 3D tour
            </p>
          </div>
          <CompareBar agentVal={mq.videoTourRate} marketVal={mq.marketVideoTourRate} maxVal={100} accent={accent} formatFn={(n) => `${n}%`} />
          <SourceLabel source="AI-analyzed from MLS listing history" />
        </div>

        {/* Drone / Aerial */}
        <div className="rounded-xl p-3 sm:p-4 flex flex-col gap-3" style={INNER}>
          <PanelLabel>Drone / Aerial</PanelLabel>
          <div>
            <div className="flex items-baseline gap-1.5">
              <p className="font-black tabular-nums" style={{ fontSize: '30px', color: accent }}>{mq.droneFootageRate}%</p>
              {mq.droneFootageRate > mq.marketDroneRate && (
                <span className="font-black px-2 py-0.5 rounded-full uppercase"
                  style={{ fontSize: '11px', backgroundColor: `${accent}22`, color: accent, border: `1px solid ${accent}44`, letterSpacing: '0.05em' }}>
                  Above avg
                </span>
              )}
            </div>
            <p className="mt-0.5 leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>
              of qualifying listings include aerial photography
            </p>
          </div>
          <CompareBar agentVal={mq.droneFootageRate} marketVal={mq.marketDroneRate} maxVal={100} accent={accent} formatFn={(n) => `${n}%`} />
          <SourceLabel source="AI-analyzed from MLS listing history" />
        </div>

        {/* Listing Description */}
        <div className="rounded-xl p-3 sm:p-4 flex flex-col gap-3" style={INNER}>
          <PanelLabel>Listing Descriptions</PanelLabel>
          <div className="flex items-baseline gap-2">
            <span className="font-black" style={{ fontSize: '30px', color: accent }}>{mq.descriptionGrade}</span>
            <span style={{ fontSize: '13px', color: C_SEC }}>{mq.descriptionSummary}</span>
          </div>
          <CompareBar
            agentVal={mq.avgDescriptionWords}
            marketVal={mq.marketAvgWords}
            maxVal={Math.max(mq.avgDescriptionWords, mq.marketAvgWords) * 1.1}
            accent={accent}
            formatFn={(n) => `${n} words`}
          />
          <SourceLabel source="AI-analyzed from MLS listing history" />
        </div>
      </div>
    </div>
  );
}

// ── Activity Consistency sub-section ─────────────────────────────────────────

const STATUS_COLOR: Record<MonthActivityStatus, string> = {
  closed: '#10b981',
  active: '#f59e0b',
  none:   '#1f2937',
};

const STATUS_BORDER: Record<MonthActivityStatus, string> = {
  closed: '#059669',
  active: '#d97706',
  none:   '#374151',
};

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function fullTimeConfig(avg: number) {
  if (avg >= 12) return { label: 'Full-time dedicated', color: '#10b981', useBriefcase: true  };
  if (avg >= 4)  return { label: 'Active agent',        color: '#3b82f6', useBriefcase: true  };
  return              { label: 'Part-time activity level', color: '#f59e0b', useBriefcase: false };
}

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

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl p-3 sm:p-4 flex flex-col gap-3 ${className}`} style={INNER}>
      {children}
    </div>
  );
}

function ActivityConsistency({ mc, accent }: { mc: MC; accent: string }) {
  const ftConfig      = fullTimeConfig(mc.avgTransactionsLast3Years);
  const closedOutOf10 = Math.round((mc.listingsClosedLast12 / mc.listingsTakenLast12) * 10);
  const gapFlagged    = mc.longestGapMonths > 3;

  const years: { label: string; index: number }[] = [];
  mc.monthlyActivity.forEach((m, i) => {
    if (m.month === 1 || i === 0) years.push({ label: String(m.year), index: i });
  });

  return (
    <div>
      {/* Full-time badge */}
      <div className="flex items-center justify-between mb-4">
        <p style={{ fontSize: '13px', color: C_SEC }}>Closing consistency — last 36 months</p>
        <span
          className="font-black px-3 py-1.5 rounded-full shrink-0"
          style={{ fontSize: '13px', backgroundColor: `${ftConfig.color}22`, color: ftConfig.color, border: `1px solid ${ftConfig.color}44` }}
        >
          {ftConfig.label}
        </span>
      </div>

      {/* 36-month timeline */}
      <div className="mb-5">
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
        <div className="relative mt-1.5" style={{ height: '16px' }}>
          {years.map(({ label, index }) => (
            <span
              key={label}
              className="absolute"
              style={{ left: `${(index / mc.monthlyActivity.length) * 100}%`, fontSize: '11px', fontWeight: 600, color: C_TER }}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3">
          {([['closed', 'Closing that month'], ['active', 'Active, no close'], ['none', 'No activity']] as const).map(
            ([status, desc]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: STATUS_COLOR[status], border: `1px solid ${STATUS_BORDER[status]}` }} />
                <span style={{ fontSize: '11px', color: C_TER }}>{desc}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <Panel>
          <PanelLabel>Longest gap without a closing</PanelLabel>
          <div className="flex items-baseline gap-1.5">
            <span className="font-black tabular-nums" style={{ fontSize: '36px', color: gapFlagged ? '#f59e0b' : accent }}>
              {mc.longestGapMonths}
            </span>
            <span style={{ fontSize: '13px', color: C_SEC }}>months</span>
            {gapFlagged && (
              <span className="font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 ml-1" style={{ fontSize: '11px' }}>
                Flagged
              </span>
            )}
          </div>
          {gapFlagged && mc.marketContextNote && (
            <p className="leading-relaxed border-l-2 pl-2.5" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6, borderColor: 'rgba(245,158,11,0.40)', fontStyle: 'italic' }}>
              {mc.marketContextNote}
            </p>
          )}
          <SourceLabel source="Source: MLS closing history" />
        </Panel>

        <Panel>
          <PanelLabel>Market engagement level</PanelLabel>
          <div className="flex items-center gap-3">
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
              <p className="font-black" style={{ fontSize: '15px', color: ftConfig.color }}>{ftConfig.label}</p>
              <p className="mt-0.5" style={{ fontSize: '13px', color: C_SEC }}>
                Avg {mc.avgTransactionsLast3Years} deals/yr · last 3 years
              </p>
            </div>
          </div>
          <SourceLabel source="Source: MLS transaction history" />
        </Panel>

        <Panel>
          <PanelLabel>Listings taken vs closed (last 12 mo)</PanelLabel>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <HouseIcon key={i} filled={i < closedOutOf10} accent={accent} />
            ))}
          </div>
          <p className="font-bold text-white" style={{ fontSize: '14px' }}>
            Closes{' '}
            <span style={{ color: accent }}>{closedOutOf10} out of every 10</span>{' '}
            listings taken
          </p>
          <p className="leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>
            {mc.listingsClosedLast12} of {mc.listingsTakenLast12} listings closed with same agent
          </p>
          <SourceLabel source="Source: MLS listing history" />
        </Panel>

        <Panel>
          <PanelLabel>Expired → competitor agent</PanelLabel>
          <div className="flex items-baseline gap-1.5">
            <span className="font-black tabular-nums" style={{ fontSize: '36px', color: mc.expiredToCompetitorPct <= 15 ? accent : '#ef4444' }}>
              {mc.expiredToCompetitorPct}%
            </span>
            {mc.expiredToCompetitorPct <= 15 && (
              <span className="font-black px-2 py-0.5 rounded-full"
                style={{ fontSize: '11px', backgroundColor: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}>
                Low
              </span>
            )}
          </div>
          <p className="leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>
            of expired or withdrawn listings re-listed with a different agent within 90 days — lower is better
          </p>
          <SourceLabel source="Source: MLS history" />
        </Panel>

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
              <p className="font-bold text-white" style={{ fontSize: '15px' }}>
                Last closed transaction:{' '}
                <span style={{ color: accent }}>{recencyLabel(mc.lastClosingDate)}</span>
              </p>
              <p className="mt-0.5" style={{ fontSize: '13px', color: C_SEC }}>{formatMonthYear(mc.lastClosingDate)}</p>
            </div>
          </div>
          <p className="leading-relaxed border-l-2 pl-2.5" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6, borderColor: '#2D3148' }}>
            Recency of activity is a direct proxy for current market knowledge. An agent who closed
            last month knows what buyers are doing right now.
          </p>
          <SourceLabel source="Source: MLS closing history" />
        </Panel>
      </div>

      <div className="mt-4 pt-4 border-t" style={{ borderColor: '#2D3148' }}>
        <SourceLabel source="Source: MLS transaction and listing history · Provn-verified" />
      </div>
    </div>
  );
}

// ── Combined section ──────────────────────────────────────────────────────────

interface Props {
  agent: Agent;
}

export default function MarketActivity({ agent }: Props) {
  const mq     = agent.mediaQuality;
  const mc     = agent.marketConsistency;
  const accent = gradeAccent(agent.provnLetterGrade);

  if (!mq && !mc) return null;

  return (
    <section
      className="rounded-2xl p-4 sm:p-5"
      style={{ background: '#1A1D2E', border: '1px solid #2D3148' }}
    >
      <SectionHeader>Market Activity</SectionHeader>

      {mq && (
        <>
          <SubHeader>Marketing Quality</SubHeader>
          <MarketingQuality mq={mq} accent={accent} />
        </>
      )}

      {mq && mc && (
        <div className="my-7 border-t" style={{ borderColor: '#2D3148' }} />
      )}

      {mc && (
        <>
          <SubHeader>Activity Consistency</SubHeader>
          <ActivityConsistency mc={mc} accent={accent} />
        </>
      )}
    </section>
  );
}
