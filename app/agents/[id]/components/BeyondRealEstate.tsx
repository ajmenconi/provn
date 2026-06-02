import { Agent, PersonalCard, SocialPlatform } from '@/types/agent';
import { gradeAccent } from '@/lib/gradeAccent';
import SectionHeader from './SectionHeader';

// ── Design tokens ─────────────────────────────────────────────────────────────

const C_SEC    = '#94A3B8';
const C_TER    = '#4B5563';
const C_INTERP = '#CBD5E1';

// ── Platform badge helpers ────────────────────────────────────────────────────

const PLATFORM_META: Record<SocialPlatform, { label: string; color: string; short: string }> = {
  instagram: { label: 'Instagram', color: '#E1306C', short: 'IG' },
  linkedin:  { label: 'LinkedIn',  color: '#0A66C2', short: 'in' },
};

function PlatformChip({ platform, handle }: { platform: SocialPlatform; handle: string }) {
  const meta = PLATFORM_META[platform];
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="w-5 h-5 rounded flex items-center justify-center text-white font-black shrink-0"
        style={{ backgroundColor: meta.color, fontSize: '8px' }}
      >
        {meta.short}
      </span>
      <span style={{ fontSize: '13px', fontWeight: 600, color: C_SEC }}>{handle}</span>
    </span>
  );
}

function VerifiedLine({ platform }: { platform: SocialPlatform }) {
  const meta = PLATFORM_META[platform];
  return (
    <span className="flex items-center justify-center gap-1 mt-1">
      <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="6" fill={meta.color} />
        <path d="M3.5 6l1.7 1.7L8.5 4.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontSize: '11px', fontWeight: 600, color: meta.color }}>
        via {meta.label}
      </span>
    </span>
  );
}

// ── Individual card tile ──────────────────────────────────────────────────────

function CardTile({ card, verified }: { card: PersonalCard; verified: boolean }) {
  return (
    <div
      className="relative flex-none w-36 snap-start md:w-auto flex flex-col items-center text-center gap-1.5 p-4 rounded-2xl"
      style={{ background: '#0F1628', border: '1px solid #1E2A3A', borderRadius: '12px' }}
    >
      {/* Verified badge — top-right corner */}
      {verified && card.verifiedVia && (
        <div className="absolute top-2 right-2">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="8" fill={PLATFORM_META[card.verifiedVia].color} />
            <path d="M4.5 8l2.3 2.3 4.7-4.6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* Emoji in a dark circle */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
        style={{ background: '#1A1D2E', borderRadius: '50%' }}
      >
        <span className="text-2xl leading-none" role="img" aria-label={card.label}>
          {card.emoji}
        </span>
      </div>

      {/* Label */}
      <p className="font-semibold text-white leading-tight" style={{ fontSize: '13px' }}>{card.label}</p>

      {/* Value */}
      <p className="leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>{card.value}</p>

      {/* Verified attribution */}
      {verified && card.verifiedVia && (
        <VerifiedLine platform={card.verifiedVia} />
      )}
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

interface Props {
  agent: Agent;
}

export default function BeyondRealEstate({ agent }: Props) {
  if (!agent.personalCards || agent.personalCards.length === 0) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const accent = gradeAccent(agent.provnLetterGrade);
  const connectedPlatforms = (agent.socialVerifications ?? []).filter((v) => v.connected);

  function isVerified(card: PersonalCard): boolean {
    if (!card.verifiedVia) return false;
    return connectedPlatforms.some((v) => v.platform === card.verifiedVia);
  }

  return (
    <section
      className="rounded-2xl p-4 sm:p-5 flex flex-col gap-5"
      style={{ background: '#0F1628', border: '1px solid #1E2A3A', borderRadius: '16px' }}
    >
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <SectionHeader className="mb-1">Beyond Real Estate</SectionHeader>
          <p className="mt-1 leading-relaxed" style={{ fontSize: '13px', color: C_SEC, lineHeight: 1.5 }}>
            Personal details the agent has chosen to share
          </p>
        </div>

        {/* Connected social platforms */}
        {connectedPlatforms.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 sm:shrink-0">
            <span className="uppercase" style={{ fontSize: '11px', fontWeight: 600, color: C_TER, letterSpacing: '0.08em' }}>Connected:</span>
            {connectedPlatforms.map((v) => (
              <PlatformChip key={v.platform} platform={v.platform} handle={v.handle} />
            ))}
          </div>
        )}
      </div>

      {/* Card scroll / grid */}
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible md:pb-0 xl:grid-cols-5">
        {agent.personalCards.map((card) => (
          <CardTile key={`${card.label}-${card.value}`} card={card} verified={isVerified(card)} />
        ))}
      </div>

      {/* Disclaimer */}
      <p className="leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>
        Personal details are self-reported by the agent and included at their discretion.
        Social verification confirms account ownership only — Provn does not access or display any social content.
      </p>
    </section>
  );
}
