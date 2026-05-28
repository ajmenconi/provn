import { Agent } from '@/types/agent';
import { gradeAccent } from '@/lib/gradeAccent';
import SourceLabel from './SourceLabel';
import SectionHeader from './SectionHeader';

// ── Design tokens ─────────────────────────────────────────────────────────────

const CARD    = { background: '#1A1D2E', border: '1px solid #2D3148' } as const;
const C_SEC   = '#94A3B8';
const C_TER   = '#4B5563';
const C_INTERP = '#CBD5E1';

// ── Format helpers ────────────────────────────────────────────────────────────

function fmtPrice(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `$${m % 1 === 0 ? m : m.toFixed(1)}M`;
  }
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

function fmtBand(low: number, high: number): string {
  return `${fmtPrice(low)}–${fmtPrice(high)}`;
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
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// ── House icon ────────────────────────────────────────────────────────────────

function HouseIcon({ filled, accent }: { filled: boolean; accent: string }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        d="M12 3 2 12h3v9h5v-5h4v5h5v-9h3L12 3z"
        fill={filled ? accent : 'rgba(255,255,255,0.07)'}
        stroke={filled ? accent : 'rgba(255,255,255,0.14)'}
        strokeWidth="0.5"
      />
    </svg>
  );
}

// ── Stat card shell ───────────────────────────────────────────────────────────

function Fact({
  icon, label, value, sub, source,
}: {
  icon:    React.ReactNode;
  label:   string;
  value:   React.ReactNode;
  sub?:    string;
  source?: string;
}) {
  return (
    <div className="rounded-2xl p-4 sm:p-5 flex flex-col gap-2" style={CARD}>
      <div className="flex items-center gap-2">
        {icon}
        {/* Card label: 13px / semibold / white */}
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{label}</p>
      </div>
      <div className="leading-snug" style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 600 }}>{value}</div>
      {sub && (
        <p className="leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>{sub}</p>
      )}
      {source && <SourceLabel source={source} />}
    </div>
  );
}

// ── Icon helper ───────────────────────────────────────────────────────────────

function Icon({ d, color = '#94A3B8' }: { d: string; color?: string }) {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

const PATHS = {
  target:    'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 4a6 6 0 1 1 0 12A6 6 0 0 1 12 6zm0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  calendar:  'M6.75 3v1.5M17.25 3v1.5M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
  person:    'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z',
  building:  'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
  trophy:    'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z',
  tree:      'M12 3v1m0 16v1M3 12h1m16 0h1M5.636 5.636l.707.707M17.657 17.657l.707.707M17.657 6.343l-.707.707M5.636 18.364l.707-.707M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7Z',
  camera:    'M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z',
  play:      'm15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z',
  cube:      'm21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
  home:      'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
  briefcase: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 14.15V9.406c0-1.08.768-2.014 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0',
};

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  agent: Agent;
}

export default function ConsumerQuickFacts({ agent }: Props) {
  const accent = gradeAccent(agent.provnLetterGrade);
  const mq     = agent.mediaQuality;
  const mc     = agent.marketConsistency;

  const saleColor = recencyColor(agent.mostRecentSaleDate);
  const saleAge   = recencyLabel(agent.mostRecentSaleDate);
  const saleDate  = formatSaleDate(agent.mostRecentSaleDate);

  const googleReview = agent.reviewPlatforms.find((p) => p.platform === 'Google');
  const closedOf10   = mc ? Math.round((mc.listingsClosedLast12 / mc.listingsTakenLast12) * 10) : null;

  return (
    <section className="flex flex-col gap-4">

      <SectionHeader className="mb-1">At a Glance</SectionHeader>

      {/* ── 1. DRE Disciplinary Record ── */}
      {agent.disciplinaryRecord === 'clean' ? (
        <div
          className="flex items-center gap-3 px-4 sm:px-5 py-4 rounded-2xl"
          style={{ background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.25)' }}
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#10b981' }}>
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white" style={{ fontSize: '14px' }}>No disciplinary actions on record — DRE verified</p>
            <p className="mt-0.5 leading-relaxed" style={{ fontSize: '12px', color: '#10b981', lineHeight: 1.6 }}>
              California Department of Real Estate · License #{agent.licenseNumber} · Most consumers never check this
            </p>
          </div>
          <span
            className="uppercase px-2.5 py-1 rounded-full shrink-0"
            style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.30)', letterSpacing: '0.05em' }}
          >
            Clean Record
          </span>
        </div>
      ) : (
        <div
          className="flex items-start gap-3 px-4 sm:px-5 py-4 rounded-2xl"
          style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.30)' }}
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: '#ef4444' }}>
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white" style={{ fontSize: '14px' }}>Disciplinary action on record — DRE public database</p>
            {agent.disciplinaryDetails && (
              <p className="mt-0.5 leading-relaxed" style={{ fontSize: '12px', color: '#ef4444', lineHeight: 1.6 }}>{agent.disciplinaryDetails}</p>
            )}
            <p className="mt-1 leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>Source: California DRE · License #{agent.licenseNumber}</p>
          </div>
        </div>
      )}

      {/* ── 2. Price Range Match + Most Recent Sale ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">

        {/* Price Range — most prominent */}
        <div
          className="rounded-2xl p-4 sm:p-5 flex flex-col gap-3"
          style={{
            background: `rgba(16,185,129,0.07)`,
            border: `1px solid rgba(16,185,129,0.22)`,
            borderLeft: `3px solid ${accent}`,
          }}
        >
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth={1.8}>
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" fill={accent} />
            </svg>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>Price Range Match</p>
          </div>
          <p className="font-black text-white leading-tight" style={{ fontSize: '28px' }}>
            Sold{' '}
            <span style={{ color: accent }}>{agent.activePriceBandCount} homes</span>{' '}
            in the {fmtBand(agent.activePriceBandLow, agent.activePriceBandHigh)} range
          </p>
          <p className="leading-relaxed" style={{ fontSize: '13px', color: C_SEC, lineHeight: 1.5 }}>
            in {agent.primaryCounty} County — their most active price band
          </p>
          <SourceLabel source="Source: MLS transaction history" />
        </div>

        {/* Most Recent Sale */}
        <div
          className="rounded-2xl p-4 sm:p-5 flex flex-col gap-3"
          style={{ background: '#1A1D2E', border: `1px solid ${saleColor}30` }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Icon d={PATHS.calendar} color={saleColor} />
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>Most Recent Sale</p>
            </div>
            <span
              className="uppercase px-2.5 py-1 rounded-full"
              style={{ fontSize: '11px', fontWeight: 800, background: `${saleColor}15`, color: saleColor, border: `1px solid ${saleColor}30`, letterSpacing: '0.05em' }}
            >
              {saleAge}
            </span>
          </div>
          <div>
            <p className="font-black text-white tabular-nums" style={{ fontSize: '30px' }}>{fmtPrice(agent.mostRecentSalePrice)}</p>
            <p className="mt-0.5" style={{ fontSize: '13px', fontWeight: 600, color: C_SEC }}>
              {agent.mostRecentSaleCity} · {saleDate}
            </p>
          </div>
          <p className="leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>
            {daysSince(agent.mostRecentSaleDate) <= 60
              ? 'Closed recently — current market knowledge is high'
              : daysSince(agent.mostRecentSaleDate) <= 180
              ? 'Active this year — market knowledge is current'
              : 'No recent closing — verify current activity before hiring'}
          </p>
          <SourceLabel source="Source: MLS" />
        </div>
      </div>

      {/* ── 3. Quick fact grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">

        <Fact
          icon={<Icon d={PATHS.briefcase} color={accent} />}
          label="Who you work with"
          value={
            agent.soloOrTeam === 'solo'
              ? <>Solo agent — you work directly with <span className="font-black" style={{ color: accent }}>{agent.name.split(' ')[0]}</span></>
              : <>{agent.teamSize}-person team</>
          }
          sub={agent.soloOrTeam === 'team' ? 'Transactions may be handled by team members' : undefined}
          source="Agent-submitted · Brokerage-verified"
        />

        <Fact
          icon={<Icon d={PATHS.building} color={accent} />}
          label="Brokerage tenure"
          value={<>With <span className="font-black text-white">{agent.brokerageName.split(' ')[0]}</span> for {agent.brokerageTenureYears} years</>}
          sub="Stability signal — agents who move frequently often take clients with them"
          source="Source: DRE license history"
        />

        <Fact
          icon={<Icon d={PATHS.home} color={accent} />}
          label="Active right now"
          value={
            agent.activeListingsCount === 0
              ? 'No homes currently listed'
              : <>Marketing <span className="font-black" style={{ color: accent }}>{agent.activeListingsCount} homes</span> right now</>
          }
          sub={agent.activeListingsCount > 12 ? 'High volume — confirm they have bandwidth' : undefined}
          source="Source: Live MLS data"
        />

        <Fact
          icon={<Icon d={PATHS.trophy} color={accent} />}
          label="Highest sale ever"
          value={<>Highest sale: <span className="font-black" style={{ color: accent }}>{fmtPrice(agent.highestSalePrice)}</span></>}
          sub="Has closed at this price point before"
          source="Source: MLS career history"
        />

        <Fact
          icon={<Icon d={PATHS.tree} color={accent} />}
          label="Community roots"
          value={<><span className="font-black" style={{ color: accent }}>{agent.yearsInLocalMarket}-year</span> {agent.primaryCounty} County resident</>}
          sub="Community depth — separate from years licensed"
          source="Agent-submitted · cross-referenced with property records"
        />

        {googleReview && (
          <div className="rounded-2xl p-4 sm:p-5 flex flex-col gap-2" style={CARD}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>Google Reviews</p>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-black text-white tabular-nums" style={{ fontSize: '30px' }}>{googleReview.score.toFixed(1)}</span>
              <span className="font-bold" style={{ fontSize: '14px', color: '#f59e0b' }}>★</span>
            </div>
            <p style={{ fontSize: '13px', color: C_SEC }}>{googleReview.reviewCount} Google reviews</p>
            <SourceLabel source="Source: Google Places" />
          </div>
        )}
      </div>

      {/* ── 4. Media stats row ── */}
      {mq && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl p-4 sm:p-5 flex flex-col gap-2" style={CARD}>
            <div className="flex items-center gap-2">
              <Icon d={PATHS.camera} color={accent} />
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>Listing Photos</p>
            </div>
            <p className="font-black text-white" style={{ fontSize: '30px' }}>{mq.photosPerListingAgent}</p>
            <p className="leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>
              photos per listing — county average is {mq.photosPerListingMarket}
            </p>
            <SourceLabel source="Source: MLS media count analysis" />
          </div>

          <div className="rounded-2xl p-4 sm:p-5 flex flex-col gap-2" style={CARD}>
            <div className="flex items-center gap-2">
              <Icon d={PATHS.play} color={accent} />
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>Video Tours</p>
            </div>
            <p className="font-black tabular-nums" style={{ fontSize: '30px', color: accent }}>{mq.videoOnlyRate}%</p>
            <p className="leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>
              of listings include video — county average is {mq.marketVideoOnlyRate}%
            </p>
            <SourceLabel source="Source: MLS media type flags" />
          </div>

          <div className="rounded-2xl p-4 sm:p-5 flex flex-col gap-2" style={CARD}>
            <div className="flex items-center gap-2">
              <Icon d={PATHS.cube} color={accent} />
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>3D Walkthroughs</p>
            </div>
            <p className="font-black tabular-nums" style={{ fontSize: '30px', color: accent }}>{mq.threeDTourRate}%</p>
            <p className="leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>
              of listings include 3D — county average is {mq.marketThreeDTourRate}%
            </p>
            <SourceLabel source="Source: MLS media type flags" />
          </div>
        </div>
      )}

      {/* ── 5. Listings conversion (house icon grid) ── */}
      {closedOf10 !== null && (
        <div
          className="rounded-2xl p-4 sm:p-5 flex flex-col gap-3"
          style={{ background: '#1A1D2E', border: `1px solid #2D3148`, borderLeft: `3px solid ${accent}` }}
        >
          <div className="flex items-center gap-2">
            <Icon d={PATHS.home} color={accent} />
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>Listings Taken vs Sold</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 10 }, (_, i) => (
              <HouseIcon key={i} filled={i < closedOf10} accent={accent} />
            ))}
          </div>
          <p className="font-bold text-white" style={{ fontSize: '14px' }}>
            Sells{' '}
            <span className="font-black" style={{ color: accent }}>
              {closedOf10} out of every 10
            </span>{' '}
            listings they take
          </p>
          <p className="leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>
            {mc!.listingsClosedLast12} of {mc!.listingsTakenLast12} listings from the last 12 months closed with this agent · Source: MLS 36-month history
          </p>
        </div>
      )}
    </section>
  );
}
