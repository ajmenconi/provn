import { Agent } from '@/types/agent';
import { gradeAccent } from '@/lib/gradeAccent';
import AgentRadarChart from './AgentRadarChart';
import SectionHeader from './SectionHeader';

interface Props {
  agent: Agent;
}

export default function HowTheyCompare({ agent }: Props) {
  if (!agent.radarData) return null;
  const accent = gradeAccent(agent.provnLetterGrade);

  return (
    <section>
      <SectionHeader>How They Compare</SectionHeader>
      <AgentRadarChart
        radarData={agent.radarData}
        accent={accent}
        agentName={agent.name}
        countyName={agent.primaryCounty}
      />
    </section>
  );
}
