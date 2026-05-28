import { Agent } from '@/types/agent';
import { gradeAccent } from '@/lib/gradeAccent';
import SourceLabel from './SourceLabel';
import SectionHeader from './SectionHeader';

const C_SEC    = '#94A3B8';
const C_TER    = '#4B5563';
const C_INTERP = '#CBD5E1';

function formatValue(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${(n / 1_000).toFixed(0)}K`;
}

interface Props {
  agent: Agent;
}

export default function SkinInTheGame({ agent }: Props) {
  const stackCount   = Math.min(agent.propertiesOwnedCount, 5);
  const MAX_YEARS    = 20;
  const ownershipPct = Math.min(agent.yearsOfContinuousOwnership / MAX_YEARS, 1) * 100;
  const accent       = gradeAccent(agent.provnLetterGrade);

  return (
    <section
      className="rounded-2xl p-4 sm:p-5 flex flex-col gap-5"
      style={{ background: '#1A1D2E', border: '1px solid #2D3148' }}
    >
      <SectionHeader>Skin in the Game</SectionHeader>

      {/* Ownership verified badge */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: agent.propertyOwnershipVerified ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)' }}
        >
          {agent.propertyOwnershipVerified ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.745 3.745 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={C_TER} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div>
          <p className="font-semibold text-white" style={{ fontSize: '14px' }}>
            Property Ownership{' '}
            <span style={{ color: agent.propertyOwnershipVerified ? '#10b981' : C_TER }}>
              {agent.propertyOwnershipVerified ? 'Verified' : 'Not Verified'}
            </span>
          </p>
          <SourceLabel source="Source: County Assessor Records" />
        </div>
      </div>

      {/* Property card stack */}
      <div>
        <p className="uppercase mb-3" style={{ fontSize: '11px', fontWeight: 600, color: C_TER, letterSpacing: '0.08em' }}>Property Portfolio</p>
        <div className="relative h-28 flex items-center justify-center">
          {Array.from({ length: stackCount }, (_, i) => {
            const isFront = i === stackCount - 1;
            const offset  = (stackCount - 1 - i) * 6;
            const rotate  = (i - Math.floor(stackCount / 2)) * 3;
            return (
              <div
                key={i}
                className="absolute w-44 h-24 rounded-xl flex flex-col items-center justify-center gap-1"
                style={{
                  background:   isFront ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)',
                  border:       isFront ? '1px solid rgba(16,185,129,0.35)' : '1px solid #2D3148',
                  transform:    `rotate(${rotate}deg) translateY(${-offset}px)`,
                  zIndex:       i,
                }}
              >
                {isFront && (
                  <>
                    <svg className="w-6 h-6" fill="#10b981" viewBox="0 0 24 24">
                      <path d="M12 3 2 12h3v9h5v-5h4v5h5v-9h3L12 3z" />
                    </svg>
                    <p className="font-black text-white" style={{ fontSize: '14px' }}>
                      {formatValue(agent.portfolioValueMin)}–{formatValue(agent.portfolioValueMax)}
                    </p>
                    <p style={{ fontSize: '13px', color: C_SEC }}>{agent.propertiesOwnedCount} properties</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <SourceLabel source="Source: County Assessor / LLC Records" />
      </div>

      {/* Ownership timeline */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="font-semibold text-white" style={{ fontSize: '13px' }}>Owner for {agent.yearsOfContinuousOwnership} years</span>
          <span style={{ fontSize: '13px', color: C_TER }}>{MAX_YEARS} yr max</span>
        </div>
        <div className="h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full rounded-full flex items-center justify-end pr-2"
            style={{ width: `${ownershipPct}%`, backgroundColor: accent }}
          >
            <span className="font-black text-white leading-none" style={{ fontSize: '11px' }}>{agent.yearsOfContinuousOwnership}yr</span>
          </div>
        </div>
        <SourceLabel source="Source: County Assessor Records" />
      </div>

      {/* Battle scar */}
      {agent.battleScar && (
        <div
          className="rounded-xl p-3 sm:p-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #2D3148' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke={C_TER} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <p className="uppercase" style={{ fontSize: '11px', fontWeight: 600, color: C_TER, letterSpacing: '0.08em' }}>Battle Scar — Self-Disclosed</p>
          </div>
          <blockquote className="leading-relaxed" style={{ fontSize: '13px', color: C_INTERP, lineHeight: 1.6, fontStyle: 'italic' }}>
            {agent.battleScar}
          </blockquote>
          <SourceLabel source="Agent-submitted · Unverified" />
        </div>
      )}
    </section>
  );
}
