import { Agent } from '@/types/agent';
import SourceLabel from './SourceLabel';

interface Props {
  agent: Agent;
}

export default function ExpertiseBadges({ agent }: Props) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Expertise</h2>

      {/* Auto-generated badges */}
      {agent.autoBadges.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Verified Transaction Specialties
          </p>
          <div className="flex flex-wrap gap-3">
            {agent.autoBadges.map((badge) => (
              <div key={badge.category} className="flex flex-col items-start">
                <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {badge.category}
                </span>
                <span className="text-xs text-gray-400 mt-0.5 pl-1">
                  {badge.transactionCount} transactions · Source: MLS Data
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual verified badges */}
      {agent.manualBadges.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Provn-Verified Background
          </p>
          <div className="flex flex-wrap gap-3">
            {agent.manualBadges.map((badge) => (
              <div key={badge.label} className="flex flex-col items-start">
                <span className="inline-flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <svg className="w-3.5 h-3.5 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {badge.label}
                </span>
                <span className="text-xs text-gray-400 mt-0.5 pl-1">
                  {badge.detail && `${badge.detail} · `}{badge.verificationSource}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
