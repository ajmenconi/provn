import { Agent } from '@/types/agent';
import SourceLabel from './SourceLabel';

function formatVolume(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function Delta({
  value,
  isGoodWhenPositive,
  unit = '',
}: {
  value: number;
  isGoodWhenPositive: boolean;
  unit?: string;
}) {
  const positive = value >= 0;
  const good = positive === isGoodWhenPositive;
  const sign = positive ? '+' : '';
  return (
    <span className={`text-sm font-semibold ${good ? 'text-emerald-600' : 'text-red-500'}`}>
      {sign}{value.toFixed(1)}{unit}
    </span>
  );
}

interface MetricCardProps {
  label: string;
  agentValue: string;
  marketValue: string;
  marketLabel: string;
  delta?: React.ReactNode;
  source: string;
  flag?: string;
}

function MetricCard({ label, agentValue, marketValue, marketLabel, delta, source, flag }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-black text-gray-900 mt-1">{agentValue}</p>
      {delta && <div className="mt-0.5">{delta}</div>}
      <p className="text-xs text-gray-400 mt-1">
        {marketLabel}: <span className="font-medium text-gray-500">{marketValue}</span>
      </p>
      {flag && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1 mt-2">
          ⚠ {flag}
        </p>
      )}
      <SourceLabel source={source} />
    </div>
  );
}

interface Props {
  agent: Agent;
}

export default function PerformanceMetrics({ agent }: Props) {
  const volumeDelta = agent.volumeLast12Months - agent.volumePrior12Months;
  const volumeTrend = volumeDelta >= 0 ? '▲' : '▼';
  const trendColor = volumeDelta >= 0 ? 'text-emerald-600' : 'text-red-500';

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 mb-3">Performance Metrics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          label="Sale Price / List Price"
          agentValue={`${agent.salePriceToListRatio.toFixed(1)}%`}
          marketValue={`${agent.salePriceToListRatioMarket.toFixed(1)}%`}
          marketLabel="Market avg"
          delta={
            <Delta
              value={agent.salePriceToListRatio - agent.salePriceToListRatioMarket}
              isGoodWhenPositive={true}
              unit="%"
            />
          }
          source="Source: MLS Data"
        />

        <MetricCard
          label="Avg Days on Market"
          agentValue={`${agent.avgDaysOnMarket} days`}
          marketValue={`${agent.marketMedianDaysOnMarket} days`}
          marketLabel="Market median"
          delta={
            <Delta
              value={agent.avgDaysOnMarket - agent.marketMedianDaysOnMarket}
              isGoodWhenPositive={false}
              unit=" days"
            />
          }
          source="Source: MLS Data"
        />

        <MetricCard
          label="Price Reduction Rate"
          agentValue={`${agent.priceReductionRate.toFixed(1)}%`}
          marketValue={`${agent.marketPriceReductionRate.toFixed(1)}%`}
          marketLabel="Market avg"
          delta={
            <Delta
              value={agent.priceReductionRate - agent.marketPriceReductionRate}
              isGoodWhenPositive={false}
              unit="%"
            />
          }
          flag="Key honesty signal — lower means fewer overpriced listings"
          source="Source: MLS Data"
        />

        <MetricCard
          label="Fall-Through Rate"
          agentValue={`${agent.fallThroughRate.toFixed(1)}%`}
          marketValue={`${agent.marketFallThroughRate.toFixed(1)}%`}
          marketLabel="Market avg"
          delta={
            <Delta
              value={agent.fallThroughRate - agent.marketFallThroughRate}
              isGoodWhenPositive={false}
              unit="%"
            />
          }
          source="Source: MLS Data"
        />

        <MetricCard
          label="Career Transactions"
          agentValue={agent.totalCareerTransactions.toLocaleString()}
          marketValue="—"
          marketLabel="Market avg"
          source="Source: MLS Data"
        />

        {/* Volume trajectory */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Volume Trajectory
          </p>
          <p className="text-2xl font-black text-gray-900 mt-1">
            {formatVolume(agent.volumeLast12Months)}
          </p>
          <p className={`text-sm font-semibold mt-0.5 ${trendColor}`}>
            {volumeTrend} {formatVolume(Math.abs(volumeDelta))} vs prior year
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Prior 12 mo:{' '}
            <span className="font-medium text-gray-500">
              {formatVolume(agent.volumePrior12Months)}
            </span>
          </p>
          <SourceLabel source="Source: MLS Data" />
        </div>
      </div>
    </section>
  );
}
