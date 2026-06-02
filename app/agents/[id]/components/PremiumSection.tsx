import { Agent } from '@/types/agent';
import { gradeAccent, gradeGradient } from '@/lib/gradeAccent';
import SaleMap from './SaleMap';
import SourceLabel from './SourceLabel';
import SectionHeader from './SectionHeader';

const CARD    = { background: '#0F1628', border: '1px solid #1E2A3A', borderRadius: '16px' } as const;
const INNER   = { background: '#0A0F1E', border: '1px solid #1E2A3A' } as const;
const C_SEC   = '#94A3B8';
const C_TER   = '#4B5563';
const C_INTERP = '#CBD5E1';

interface Props {
  agent: Agent;
}

export default function PremiumSection({ agent }: Props) {
  if (!agent.isPremium) return null;

  const accent   = gradeAccent(agent.provnLetterGrade);
  const gradient = gradeGradient(agent.provnLetterGrade);

  return (
    <section>
      {/* Premium header rule */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-black px-3 py-1 rounded-full shrink-0" style={{ backgroundColor: '#f59e0b', color: '#1c1000' }}>
          Premium Profile
        </span>
        <div className="h-px flex-1" style={{ backgroundColor: '#1E2A3A' }} />
      </div>

      <div className="space-y-4">

        {/* ── Video thumbnail ─────────────────────────────────────── */}
        {agent.introVideoUrl && (
          <div className="rounded-2xl p-5" style={CARD}>
            <SectionHeader className="mb-3">Agent Introduction</SectionHeader>

            {/* 16:9 thumbnail placeholder */}
            <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <div className="absolute inset-0" style={{ background: gradient }} />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'radial-gradient(ellipse at 30% 35%, rgba(255,255,255,0.22) 0%, transparent 55%),' +
                    'radial-gradient(ellipse at 75% 65%, rgba(0,0,0,0.12) 0%, transparent 55%)',
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-2/5"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)' }}
              />
              <div className="absolute top-4 left-4">
                <span className="text-[11px] font-black text-white bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  Provn Premium
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="text-[11px] font-semibold text-white bg-white/20 backdrop-blur-sm border border-white/30 px-2.5 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="flex items-center justify-center rounded-full border-2 border-white/50 bg-white/20 backdrop-blur-sm"
                  style={{ width: '72px', height: '72px' }}
                >
                  <svg className="w-8 h-8 text-white ml-1.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="text-xs font-bold text-white/60 bg-black/25 px-2 py-0.5 rounded">— : —</span>
              </div>
              <div className="absolute bottom-4 right-4 text-right max-w-xs">
                <p className="text-base font-black text-white leading-tight drop-shadow-sm">
                  {agent.name}&apos;s Agent Introduction
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{agent.brokerageName}</p>
              </div>
            </div>

            <div className="mt-3">
              <SourceLabel source="Agent-submitted · Approved by Provn" />
            </div>
          </div>
        )}

        {/* ── Win stories ──────────────────────────────────────────── */}
        {agent.winStories.length > 0 && (
          <div className="rounded-2xl p-4 sm:p-5" style={CARD}>
            <SectionHeader className="mb-4">Verified Win Stories</SectionHeader>
            <div className="space-y-4">
              {agent.winStories.map((story, i) => (
                <div key={i} className="rounded-xl p-3 sm:p-4" style={INNER}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      className="font-semibold px-2.5 py-1 rounded-full"
                      style={{ fontSize: '13px', backgroundColor: `${accent}12`, color: accent, border: `1px solid ${accent}30` }}
                    >
                      {story.dealType}
                    </span>
                    {story.clientVerified && (
                      <span className="shrink-0 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ fontSize: '12px', color: '#10B981', background: '#0A1F12', border: '1px solid rgba(16,185,129,0.4)' }}>
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Client Verified
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold" style={{ fontSize: '13px', color: '#FFFFFF' }}>Challenge: </span>
                      <span className="leading-relaxed" style={{ fontSize: '13px', color: C_INTERP, lineHeight: 1.6 }}>{story.challenge}</span>
                    </div>
                    <div>
                      <span className="font-semibold" style={{ fontSize: '13px', color: '#FFFFFF' }}>Outcome: </span>
                      <span className="leading-relaxed" style={{ fontSize: '13px', color: C_INTERP, lineHeight: 1.6 }}>{story.outcome}</span>
                    </div>
                  </div>
                  <div
                    className="mt-3 pt-3 flex items-center justify-between border-t"
                    style={{ borderColor: '#1E2A3A' }}
                  >
                    <span style={{ fontSize: '13px', color: C_SEC }}>Transaction value</span>
                    <span className="font-black text-white" style={{ fontSize: '22px' }}>{story.dollarImpact}</span>
                  </div>
                  <SourceLabel source="Agent-submitted · Client confirmation on file · Verified by Provn" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Featured Market — SVG sale map ──────────────────────── */}
        {agent.featuredNeighborhood && (
          <div className="rounded-2xl p-4 sm:p-5" style={CARD}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <SectionHeader className="mb-1">Featured Market</SectionHeader>
                <p className="mt-0.5 leading-relaxed" style={{ fontSize: '13px', color: C_SEC, lineHeight: 1.5 }}>
                  Past sale locations across {agent.primaryCounty} County
                </p>
              </div>
              <span
                className="font-semibold px-3 py-1.5 rounded-full shrink-0"
                style={{ fontSize: '13px', backgroundColor: `${accent}12`, color: accent, border: `1.5px solid ${accent}30` }}
              >
                📍 {agent.featuredNeighborhood}
              </span>
            </div>

            <SaleMap agent={agent} accent={accent} />

            <div className="mt-3">
              <SourceLabel source="Source: MLS Data · Zillow · Agent transaction history · Provn-verified" />
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
