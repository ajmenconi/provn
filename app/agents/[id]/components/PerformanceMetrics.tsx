import { Agent } from '@/types/agent';
import { gradeAccent } from '@/lib/gradeAccent';
import AgentRadarChart from './AgentRadarChart';
import SourceLabel from './SourceLabel';
import SectionHeader from './SectionHeader';

// ── Design tokens ─────────────────────────────────────────────────────────────

const CARD    = { background: '#1A1D2E', border: '1px solid #2D3148' } as const;
const C_SEC   = '#94A3B8';
const C_TER   = '#4B5563';
const C_INTERP = '#CBD5E1';
const TRACK   = 'rgba(255,255,255,0.08)';

// ── Card shell ────────────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-4 sm:p-5 flex flex-col gap-3" style={CARD}>
      {children}
    </div>
  );
}

// Card label: 13px / semibold / white
function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
      {children}
    </p>
  );
}

// Compare bar rows
function CompareBar({
  label, value, scale, color, isAgent,
}: {
  label: string; value: number; scale: number; color: string; isAgent: boolean;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1" style={{ fontSize: '13px' }}>
        <span style={{ color: isAgent ? '#fff' : C_SEC, fontWeight: isAgent ? 600 : 400 }}>{label}</span>
        <span style={{ color: isAgent ? '#fff' : C_SEC, fontWeight: isAgent ? 700 : 400 }}>{value.toFixed(1)}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: TRACK }}>
        <div className="h-full rounded-full" style={{ width: `${(value / scale) * 100}%`, backgroundColor: isAgent ? color : 'rgba(255,255,255,0.20)' }} />
      </div>
    </div>
  );
}

// ── 1. Years of experience ────────────────────────────────────────────────────

function YearsExperienceCard({ agent, accent }: { agent: Agent; accent: string }) {
  const issueYear = new Date(agent.licenseIssueDate).getFullYear();
  const years     = new Date().getFullYear() - issueYear;

  return (
    <Card>
      <CardLabel>Years of Experience</CardLabel>
      <div className="flex flex-col items-center py-3 gap-3">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${accent}18`, border: `2px solid ${accent}40` }}
        >
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke={accent} strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v1.5M17.25 3v1.5M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-black text-white tabular-nums" style={{ fontSize: '48px', lineHeight: 1 }}>{years}</p>
          <p className="mt-1" style={{ fontSize: '13px', color: C_SEC, fontWeight: 600 }}>years licensed</p>
          <p className="mt-1 leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>
            Licensed since {issueYear} · {agent.licenseType}
          </p>
        </div>
      </div>
      <SourceLabel source="Source: CA DRE" />
    </Card>
  );
}

// ── 2. SP/LP dual bars ────────────────────────────────────────────────────────

function SPLPCard({ agent, accent }: { agent: Agent; accent: string }) {
  const isAbove  = agent.salePriceToListRatio >= agent.salePriceToListRatioMarket;
  const delta    = (agent.salePriceToListRatio - agent.salePriceToListRatioMarket).toFixed(1);
  const scale    = Math.max(agent.salePriceToListRatio, agent.salePriceToListRatioMarket, 100) * 1.02;
  const barColor = isAbove ? accent : '#ef4444';

  return (
    <Card>
      <CardLabel>Sale Price / List Price</CardLabel>
      <div>
        <p className="font-black leading-none tabular-nums" style={{ fontSize: '48px', color: barColor }}>
          {isAbove ? '+' : ''}{delta}%
        </p>
        <p className="mt-1 leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>
          {isAbove ? 'above asking on average' : 'below asking on average'}
        </p>
      </div>
      <div className="space-y-2 pt-1">
        <CompareBar label="This agent" value={agent.salePriceToListRatio}       scale={scale} color={barColor} isAgent={true}  />
        <CompareBar label="Market avg" value={agent.salePriceToListRatioMarket} scale={scale} color={barColor} isAgent={false} />
      </div>
      <SourceLabel source="Source: MLS Data" />
    </Card>
  );
}

// ── 3. Price reduction ────────────────────────────────────────────────────────

function PriceReductionCard({ agent, accent }: { agent: Agent; accent: string }) {
  const rate       = agent.priceReductionRate;
  const marketRate = agent.marketPriceReductionRate;
  const n          = Math.max(2, Math.round(100 / rate));
  const marketN    = Math.max(2, Math.round(100 / marketRate));
  const color      = rate < 8 ? '#10b981' : rate < 18 ? '#f59e0b' : '#ef4444';
  const headline   = rate < 8 ? 'Rarely reduces prices' : rate < 18 ? 'Sometimes reduces prices' : 'Often reduces prices';

  return (
    <Card>
      <CardLabel>Price Reductions</CardLabel>
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
        style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}
      >
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <p className="font-bold leading-relaxed" style={{ fontSize: '11px', color: '#f59e0b', lineHeight: 1.5 }}>
          Fewer reductions = more accurate pricing upfront
        </p>
      </div>
      <div className="flex flex-col gap-2 py-1">
        <p className="font-black leading-tight" style={{ fontSize: '22px', color }}>{headline}</p>
        <p className="leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>
          About <span className="font-black text-white" style={{ fontSize: '18px' }}>1 in {n}</span> listings end up with a price cut
        </p>
      </div>
      <p className="leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>
        County agents: about 1 in {marketN} on average
      </p>
      <SourceLabel source="Source: MLS Data" />
    </Card>
  );
}

// ── 4. Fall-through house grid ────────────────────────────────────────────────

function HouseIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        d="M12 3 2 12h3v9h5v-5h4v5h5v-9h3L12 3z"
        fill={filled ? '#ef4444' : 'rgba(255,255,255,0.07)'}
        stroke={filled ? '#dc2626' : 'rgba(255,255,255,0.14)'}
        strokeWidth="0.5"
      />
    </svg>
  );
}

function FallThroughCard({ agent, accent }: { agent: Agent; accent: string }) {
  const TOTAL     = 20;
  const agentRed  = Math.max(1, Math.round(agent.fallThroughRate / 5));
  const marketRed = Math.max(1, Math.round(agent.marketFallThroughRate / 5));
  const isGood    = agent.fallThroughRate < agent.marketFallThroughRate;

  return (
    <Card>
      <CardLabel>Fall-Through Rate</CardLabel>
      <div>
        <p className="font-black leading-none tabular-nums" style={{ fontSize: '48px', color: isGood ? accent : '#ef4444' }}>
          {agent.fallThroughRate.toFixed(1)}%
        </p>
        <p className="mt-1 leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>
          {isGood ? 'of contracts — below county average' : 'of contracts don\'t close'}
        </p>
      </div>
      <div className="space-y-3">
        {[
          { label: 'This agent', red: agentRed,  isAgent: true  },
          { label: 'Market avg', red: marketRed, isAgent: false },
        ].map(({ label, red, isAgent }) => (
          <div key={label}>
            <p className="mb-1.5" style={{ fontSize: '13px', color: isAgent ? '#fff' : C_SEC, fontWeight: isAgent ? 600 : 400 }}>{label}</p>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: TOTAL }, (_, i) => <HouseIcon key={i} filled={i < red} />)}
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '11px', color: C_TER }}>Each house = 5% of deals</p>
      <SourceLabel source="Source: MLS Data" />
    </Card>
  );
}

// ── 5. Market Cycles Navigated ────────────────────────────────────────────────

const INNER = { background: 'rgba(255,255,255,0.04)', border: '1px solid #2D3148' } as const;

function SeverityPill({ severity }: { severity: 'severe' | 'moderate' }) {
  return severity === 'severe' ? (
    <span style={{ fontSize: '11px', fontWeight: 800 }} className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-400/30 uppercase tracking-wide">
      Severe
    </span>
  ) : (
    <span style={{ fontSize: '11px', fontWeight: 800 }} className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wide">
      Moderate
    </span>
  );
}

function MarketCyclesCard({ agent, accent }: { agent: Agent; accent: string }) {
  const cycles = agent.marketCycleTransactions;
  if (!cycles || cycles.length === 0) return null;

  const issueYear      = new Date(agent.licenseIssueDate).getFullYear();
  const careerYears    = Math.max(new Date().getFullYear() - issueYear, 1);
  const careerAvgPerYr = agent.totalCareerTransactions / careerYears;

  return (
    <div className="rounded-2xl p-4 sm:p-5 col-span-full" style={{ background: '#1A1D2E', border: '1px solid #2D3148' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="mb-1 uppercase" style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.1em' }}>
            Market Cycles Navigated
          </p>
          <p className="font-bold text-white leading-snug" style={{ fontSize: '17px' }}>
            {cycles.length} national downturns — still closing deals
          </p>
        </div>
        <span
          className="font-black px-3 py-1.5 rounded-full shrink-0"
          style={{ fontSize: '13px', backgroundColor: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}
        >
          {cycles.reduce((s, c) => s + c.transactionCount, 0)} deals during downturns
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cycles.map((cycle) => {
          const cycleYears    = cycle.endYear - cycle.startYear + 1;
          const cycleAvgPerYr = cycle.transactionCount / cycleYears;
          const ratio         = Math.min(cycleAvgPerYr / careerAvgPerYr, 1.2);
          const barPct        = Math.round(ratio * 100);

          return (
            <div key={cycle.cycleName} className="rounded-xl p-3 sm:p-4 flex flex-col gap-3" style={INNER}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-black text-white leading-tight" style={{ fontSize: '14px' }}>{cycle.cycleName}</p>
                  <p className="mt-0.5" style={{ fontSize: '12px', color: C_SEC }}>{cycle.years}</p>
                </div>
                <SeverityPill severity={cycle.severity} />
              </div>
              <p className="leading-relaxed border-l-2 pl-2.5" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6, borderColor: '#2D3148', fontStyle: 'italic' }}>
                {cycle.nationalContext}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-black tabular-nums" style={{ fontSize: '30px', color: accent }}>
                  {cycle.transactionCount}
                </span>
                <span style={{ fontSize: '13px', color: C_SEC }}>deals closed</span>
              </div>
              <div>
                <div className="flex justify-between mb-1.5" style={{ fontSize: '11px' }}>
                  <span style={{ color: C_TER, fontWeight: 600 }}>Activity vs career avg</span>
                  <span style={{ color: ratio >= 0.7 ? accent : C_SEC, fontWeight: 700 }}>
                    {barPct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: TRACK }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(barPct, 100)}%`, backgroundColor: ratio >= 0.7 ? accent : '#4b5563' }}
                  />
                </div>
              </div>
              {cycle.notes && (
                <p className="leading-relaxed" style={{ fontSize: '11px', color: C_INTERP, lineHeight: 1.6 }}>{cycle.notes}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t" style={{ borderColor: '#2D3148' }}>
        <SourceLabel source="Source: National Association of Realtors · Case-Shiller · Federal Reserve · MLS transaction history" />
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

interface Props {
  agent:      Agent;
  breakdown?: unknown;
}

export default function PerformanceMetrics({ agent }: Props) {
  const accent = gradeAccent(agent.provnLetterGrade);
  return (
    <section>
      <SectionHeader>Performance Metrics</SectionHeader>

      {agent.radarData && (
        <div className="mb-4">
          <AgentRadarChart
            radarData={agent.radarData}
            accent={accent}
            agentName={agent.name}
            countyName={agent.primaryCounty}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <YearsExperienceCard agent={agent} accent={accent} />
        <SPLPCard            agent={agent} accent={accent} />
        <PriceReductionCard  agent={agent} accent={accent} />
        <FallThroughCard     agent={agent} accent={accent} />
        <MarketCyclesCard    agent={agent} accent={accent} />
      </div>
    </section>
  );
}
