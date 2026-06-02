import Link from 'next/link';
import { placeholderAgent } from './placeholder';
import { scoreAgent } from '@/lib/scoring';
import AgentHeader from './components/AgentHeader';
import HeroSocialProof from './components/HeroSocialProof';
import BeyondRealEstate from './components/BeyondRealEstate';
import HowTheyCompare from './components/HowTheyCompare';
import PerformanceSnapshot from './components/PerformanceSnapshot';
import MarketActivity from './components/MarketActivity';
import SkinInTheGame from './components/SkinInTheGame';
import MarketIntelligence from './components/MarketIntelligence';
import ExpertiseBadges from './components/ExpertiseBadges';
import AIInsights from './components/AIInsights';
import PremiumSection from './components/PremiumSection';
import FadeIn from './components/FadeIn';

interface PageProps {
  params: Promise<{ id: string }>;
}

// ── Between-section divider ───────────────────────────────────────────────────
// Subtle 1px line with breathing room above and below so the eye knows
// where one section ends and the next begins.

function Divider() {
  return (
    <div
      className="mt-6 sm:mt-8 border-t"
      style={{ borderColor: '#1E2A3A' }}
      aria-hidden="true"
    />
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

// ── Top nav bar ───────────────────────────────────────────────────────────────

function NavBar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10"
      style={{
        height: '60px',
        backgroundColor: '#080D1A',
        borderBottom: '1px solid #1E2A3A',
      }}
    >
      {/* Left: Provn wordmark */}
      <Link href="/" className="flex items-center gap-2">
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', flexShrink: 0 }} />
        <span style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>Provn</span>
      </Link>

      {/* Right: nav links */}
      <div className="flex items-center gap-5">
        <Link href="/agents" style={{ fontSize: '14px', color: '#94A3B8' }}>
          Find an agent
        </Link>
        <Link href="/login" style={{ fontSize: '14px', color: '#94A3B8' }}>
          Agent login
        </Link>
        <Link
          href="/match/buyer"
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#FFFFFF',
            backgroundColor: '#10B981',
            padding: '8px 18px',
            borderRadius: '8px',
          }}
        >
          Get matched
        </Link>
      </div>
    </nav>
  );
}

export default async function AgentProfilePage({ params }: PageProps) {
  await params;
  const agent = placeholderAgent;
  const { composite, letterGrade, breakdown } = scoreAgent(agent);
  const scoredAgent = { ...agent, provnScore: composite, provnLetterGrade: letterGrade };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#080D1A' }}>

      {/* ── Nav bar ── */}
      <NavBar />

      {/* ── 1. HERO — name, score, brokerage, hero stat, license badges ── */}
      <div
        style={{
          backgroundColor: '#080D1A',
          borderBottom: '1px solid #1E2A3A',
          paddingTop: '60px',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 lg:py-14">
          <AgentHeader agent={scoredAgent} />
        </div>
      </div>

      {/* ── 2–10. Profile body ───────────────────────────────────────────── */}
      {/*
        Section order mirrors the consumer decision journey:
          who is this person → can I trust them → are they good at their job
          → do they fit my situation

        Each section is separated by a single 1px #2D3148 divider + breathing
        room so the eye registers a page-turn without heavy visual separation.
      */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pb-16">

        {/* ── 2. Social Proof — first trust signal ── */}
        <div className="pt-8">
          <FadeIn>
            <HeroSocialProof agent={scoredAgent} />
          </FadeIn>
        </div>

        {/* ── 3. How They Compare — radar chart vs county ── */}
        <Divider />
        <div className="pt-6 sm:pt-8">
          <FadeIn delay={20}>
            <HowTheyCompare agent={scoredAgent} />
          </FadeIn>
        </div>

        {/* ── 4. Performance Snapshot — stats in large type ── */}
        <Divider />
        <div className="pt-6 sm:pt-8">
          <FadeIn delay={40}>
            <PerformanceSnapshot agent={scoredAgent} />
          </FadeIn>
        </div>

        {/* ── 5. Market Activity — marketing quality + consistency timeline ── */}
        <Divider />
        <div className="pt-6 sm:pt-8">
          <FadeIn delay={60}>
            <MarketActivity agent={scoredAgent} />
          </FadeIn>
        </div>

        {/* ── 6. Skin in the Game + Local Market Expertise — side by side ── */}
        <Divider />
        <div className="pt-6 sm:pt-8">
          <FadeIn delay={80}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkinInTheGame agent={scoredAgent} />
              <MarketIntelligence agent={scoredAgent} />
            </div>
          </FadeIn>
        </div>

        {/* ── 7. Expertise Depth — specialty badges ── */}
        <Divider />
        <div className="pt-6 sm:pt-8">
          <FadeIn delay={100}>
            <ExpertiseBadges agent={scoredAgent} />
          </FadeIn>
        </div>

        {/* ── 8. Provn Intelligence — AI insights ── */}
        <Divider />
        <div className="pt-6 sm:pt-8">
          <FadeIn delay={120}>
            <AIInsights agent={scoredAgent} breakdown={breakdown} />
          </FadeIn>
        </div>

        {/* ── 9. Beyond Real Estate — personal story before premium ── */}
        <Divider />
        <div className="pt-6 sm:pt-8">
          <FadeIn delay={140}>
            <BeyondRealEstate agent={scoredAgent} />
          </FadeIn>
        </div>

        {/* ── 10. Premium — video + win stories (paid agents only) ── */}
        <Divider />
        <div className="pt-6 sm:pt-8">
          <FadeIn delay={160}>
            <PremiumSection agent={scoredAgent} />
          </FadeIn>
        </div>

      </main>
    </div>
  );
}
