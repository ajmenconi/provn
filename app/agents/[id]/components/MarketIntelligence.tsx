import { Agent } from '@/types/agent';
import SourceLabel from './SourceLabel';

interface Props {
  agent: Agent;
}

export default function MarketIntelligence({ agent }: Props) {
  const topZip = agent.zipSpecializations[0];
  const specialistThreshold = 60;
  const isSpecialist = topZip && topZip.percentage >= specialistThreshold;

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Market Intelligence</h2>

      {/* Tenure */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Market Tenure</p>
        <p className="text-lg font-bold text-gray-900 mt-0.5">
          Active in {agent.primaryCounty} County since {agent.activeInCountySince}
        </p>
        <SourceLabel source="Source: CA DRE · MLS History" />
      </div>

      {/* Off-market deals */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Off-Market Deals</p>
        <p className="text-2xl font-black text-gray-900 mt-0.5">{agent.offMarketDealCount}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          Transactions closed with zero MLS days on market — indicates off-market sourcing ability
        </p>
        <SourceLabel source="Source: MLS Data" />
      </div>

      {/* Hyperlocal specialization */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Hyperlocal Specialization
          </p>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isSpecialist
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {isSpecialist ? 'Specialist' : 'Generalist'}
          </span>
        </div>

        <div className="space-y-2">
          {agent.zipSpecializations.map((zip) => (
            <div key={zip.zip}>
              <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                <span className="font-medium">{zip.label} ({zip.zip})</span>
                <span className="font-semibold">{zip.percentage}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    zip.percentage >= 40
                      ? 'bg-blue-500'
                      : zip.percentage >= 20
                      ? 'bg-blue-400'
                      : 'bg-blue-300'
                  }`}
                  style={{ width: `${zip.percentage}%` }}
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
