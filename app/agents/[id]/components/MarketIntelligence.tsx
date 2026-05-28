import { Agent } from '@/types/agent';
import { gradeAccent } from '@/lib/gradeAccent';
import SourceLabel from './SourceLabel';
import SectionHeader from './SectionHeader';

const C_SEC    = '#94A3B8';
const C_TER    = '#4B5563';
const C_INTERP = '#CBD5E1';

interface Props {
  agent: Agent;
}

export default function MarketIntelligence({ agent }: Props) {
  const accent       = gradeAccent(agent.provnLetterGrade);
  const topZip       = agent.zipSpecializations[0];
  const isSpecialist = topZip && topZip.percentage >= 50;

  return (
    <section
      className="rounded-2xl p-4 sm:p-5 flex flex-col gap-5"
      style={{ background: '#1A1D2E', border: '1px solid #2D3148' }}
    >
      <SectionHeader>Market Intelligence</SectionHeader>

      {/* Tenure */}
      <div>
        <p className="uppercase mb-1.5" style={{ fontSize: '11px', fontWeight: 600, color: C_TER, letterSpacing: '0.08em' }}>Market Tenure</p>
        <p className="font-black text-white" style={{ fontSize: '22px' }}>
          Active in {agent.primaryCounty} County since{' '}
          <span style={{ color: accent }}>{agent.activeInCountySince}</span>
        </p>
        <SourceLabel source="Source: CA DRE · MLS History" />
      </div>

      {/* Off-market deals */}
      <div>
        <p className="uppercase mb-1.5" style={{ fontSize: '11px', fontWeight: 600, color: C_TER, letterSpacing: '0.08em' }}>Off-Market Deals</p>
        <p className="font-black text-white tabular-nums" style={{ fontSize: '36px' }}>{agent.offMarketDealCount}</p>
        <p className="mt-1 leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>
          Transactions with zero MLS days on market — indicates off-market sourcing ability
        </p>
        <SourceLabel source="Source: MLS Data" />
      </div>

      {/* Hyperlocal specialization */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="uppercase" style={{ fontSize: '11px', fontWeight: 600, color: C_TER, letterSpacing: '0.08em' }}>Hyperlocal Specialization</p>
          <span
            className="font-semibold px-3 py-1 rounded-full"
            style={{ fontSize: '13px', backgroundColor: `${accent}18`, color: accent, border: `1.5px solid ${accent}40` }}
          >
            {isSpecialist ? 'Specialist' : 'Generalist'}
          </span>
        </div>
        <div className="space-y-2.5">
          {agent.zipSpecializations.map((zip) => (
            <div key={zip.zip}>
              <div className="flex justify-between mb-1" style={{ fontSize: '13px' }}>
                <span className="font-semibold text-white">
                  {zip.label}{' '}
                  <span style={{ color: C_TER }}>({zip.zip})</span>
                </span>
                <span className="font-black text-white">{zip.percentage}%</span>
              </div>
              <div className="w-full rounded-full h-2.5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${zip.percentage}%`,
                    backgroundColor: accent,
                    opacity: 0.4 + (zip.percentage / 100) * 0.6,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <SourceLabel source="Source: MLS Data" />
      </div>
    </section>
  );
}
