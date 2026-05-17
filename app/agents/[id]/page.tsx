import { placeholderAgent } from './placeholder';
import { scoreAgent } from '@/lib/scoring';
import AgentHeader from './components/AgentHeader';
import PerformanceMetrics from './components/PerformanceMetrics';
import SkinInTheGame from './components/SkinInTheGame';
import ExpertiseBadges from './components/ExpertiseBadges';
import MarketIntelligence from './components/MarketIntelligence';
import AIInsights from './components/AIInsights';
import SocialProof from './components/SocialProof';
import PremiumSection from './components/PremiumSection';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AgentProfilePage({ params }: PageProps) {
  await params; // resolves id — swap for real DB fetch once data layer is wired
  const agent = placeholderAgent;
  const { composite, letterGrade, breakdown } = scoreAgent(agent);
  const scoredAgent = { ...agent, provnScore: composite, provnLetterGrade: letterGrade };

  return (
    <div className="min-h-screen bg-gray-50">
      <AgentHeader agent={scoredAgent} />
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <PerformanceMetrics agent={scoredAgent} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkinInTheGame agent={scoredAgent} />
          <MarketIntelligence agent={scoredAgent} />
        </div>
        <ExpertiseBadges agent={scoredAgent} />
        <AIInsights agent={scoredAgent} breakdown={breakdown} />
        <SocialProof agent={scoredAgent} />
        <PremiumSection agent={scoredAgent} />
      </main>
    </div>
  );
}
