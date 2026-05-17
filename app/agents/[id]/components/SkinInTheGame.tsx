import { Agent } from '@/types/agent';
import SourceLabel from './SourceLabel';

function formatValue(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${(n / 1_000).toFixed(0)}K`;
}

interface Props {
  agent: Agent;
}

export default function SkinInTheGame({ agent }: Props) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Skin in the Game</h2>

      {/* Ownership verified */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            agent.propertyOwnershipVerified
              ? 'bg-emerald-100 text-emerald-600'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          {agent.propertyOwnershipVerified ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Property Ownership{' '}
            {agent.propertyOwnershipVerified ? (
              <span className="text-emerald-600">Verified</span>
            ) : (
              <span className="text-gray-400">Not Verified</span>
            )}
          </p>
          <SourceLabel source="Source: County Assessor Records" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Properties Owned</p>
          <p className="text-2xl font-black text-gray-900 mt-0.5">{agent.propertiesOwnedCount}</p>
          <SourceLabel source="Source: County Assessor / LLC Records" />
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Portfolio Value</p>
          <p className="text-2xl font-black text-gray-900 mt-0.5">
            {formatValue(agent.portfolioValueMin)}–{formatValue(agent.portfolioValueMax)}
          </p>
          <SourceLabel source="Source: County Assessor Records" />
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Continuous Ownership</p>
          <p className="text-2xl font-black text-gray-900 mt-0.5">
            {agent.yearsOfContinuousOwnership} yrs
          </p>
          <SourceLabel source="Source: County Assessor Records" />
        </div>
      </div>

      {/* Battle scar */}
      {agent.battleScar && (
        <div className="border-l-4 border-slate-300 pl-4 mt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Battle Scar — Self-Disclosed
          </p>
          <blockquote className="text-sm text-gray-700 italic leading-relaxed">
            {agent.battleScar}
          </blockquote>
          <SourceLabel source="Agent-submitted · Unverified" />
        </div>
      )}
    </section>
  );
}
