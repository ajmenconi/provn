import { Agent, AutoBadge, ManualBadge } from '@/types/agent';
import SourceLabel from './SourceLabel';
import SectionHeader from './SectionHeader';

const C_SEC    = '#94A3B8';
const C_TER    = '#4B5563';
const C_INTERP = '#CBD5E1';

// ── Icon paths ────────────────────────────────────────────────────────────────

const ICONS: Record<string, string> = {
  sparkles:  'M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.745 3.745 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z',
  trending:  'M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941',
  leaf:      'M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.249 2.249 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25',
  building:  'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z',
  truck:     'M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
  key:       'M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z',
  scale:     'M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97Zm-12.75 0L3.504 15.696c-.122.499.106 1.028.589 1.202a5.989 5.989 0 0 0 2.031.352 5.989 5.989 0 0 0 2.031-.352c.483-.174.711-.703.59-1.202L6 4.97Z',
  tag:       'M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z M6 6h.008v.008H6V6Z',
  badge:     'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
};

// ── Badge style map ───────────────────────────────────────────────────────────

interface BadgeStyle { icon: string; iconColor: string; bg: string; border: string; }

const AUTO_BADGE_STYLES: Record<string, BadgeStyle> = {
  'Luxury ($1M+)':      { icon: 'sparkles', iconColor: '#f59e0b', bg: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.20)'   },
  'Investment / 1031':  { icon: 'trending', iconColor: '#8b5cf6', bg: 'rgba(139,92,246,0.08)',   border: 'rgba(139,92,246,0.20)'   },
  'Vineyard / Land':    { icon: 'leaf',     iconColor: '#10b981', bg: 'rgba(16,185,129,0.08)',   border: 'rgba(16,185,129,0.20)'   },
  'New Construction':   { icon: 'building', iconColor: '#3b82f6', bg: 'rgba(59,130,246,0.08)',   border: 'rgba(59,130,246,0.20)'   },
  'Relocation':         { icon: 'truck',    iconColor: '#f97316', bg: 'rgba(249,115,22,0.08)',   border: 'rgba(249,115,22,0.20)'   },
  'Multifamily':        { icon: 'building', iconColor: '#14b8a6', bg: 'rgba(20,184,166,0.08)',   border: 'rgba(20,184,166,0.20)'   },
  'First-Time Buyers':  { icon: 'key',      iconColor: '#ec4899', bg: 'rgba(236,72,153,0.08)',   border: 'rgba(236,72,153,0.20)'   },
  'Probate / Trust':    { icon: 'scale',    iconColor: '#94a3b8', bg: 'rgba(148,163,184,0.08)',  border: 'rgba(148,163,184,0.20)'  },
  'Short Sale':         { icon: 'tag',      iconColor: '#ef4444', bg: 'rgba(239,68,68,0.08)',    border: 'rgba(239,68,68,0.20)'    },
};

const DEFAULT_STYLE: BadgeStyle = {
  icon: 'badge', iconColor: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.20)',
};

function BadgeIcon({ name, color }: { name: string; color: string }) {
  const d = ICONS[name] ?? ICONS.badge;
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

function AutoBadgeCard({ badge, index }: { badge: AutoBadge; index: number }) {
  const style = AUTO_BADGE_STYLES[badge.category] ?? DEFAULT_STYLE;
  return (
    <div
      className="flex flex-col items-center gap-2 p-4 sm:p-5 rounded-2xl"
      style={{
        background: '#1A1D2E',
        border: '1px solid #2D3148',
        borderLeft: `3px solid ${style.iconColor}`,
        animation: `badge-pop 0.4s ease-out ${index * 0.07}s both`,
      }}
    >
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center"
        style={{ background: '#2D3148' }}
      >
        <BadgeIcon name={style.icon} color={style.iconColor} />
      </div>
      <div className="text-center">
        <p className="font-semibold text-white leading-tight" style={{ fontSize: '13px' }}>{badge.category}</p>
        <p className="mt-0.5" style={{ fontSize: '12px', color: C_INTERP }}>{badge.transactionCount} deals</p>
      </div>
    </div>
  );
}

function ManualBadgeCard({ badge, index }: { badge: ManualBadge; index: number }) {
  return (
    <div
      className="flex flex-col items-center gap-2 p-4 sm:p-5 rounded-2xl"
      style={{
        background: '#1A1D2E',
        border: '1px solid #2D3148',
        borderLeft: '3px solid #8b5cf6',
        animation: `badge-pop 0.4s ease-out ${index * 0.07}s both`,
      }}
    >
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center"
        style={{ background: '#2D3148' }}
      >
        <BadgeIcon name="badge" color="#8b5cf6" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-white leading-tight" style={{ fontSize: '13px' }}>{badge.label}</p>
        <p className="mt-0.5" style={{ fontSize: '12px', color: C_INTERP }}>{badge.verificationSource}</p>
      </div>
    </div>
  );
}

interface Props {
  agent: Agent;
}

export default function ExpertiseBadges({ agent }: Props) {
  return (
    <section
      className="rounded-2xl p-4 sm:p-5"
      style={{ background: '#1A1D2E', border: '1px solid #2D3148' }}
    >
      <SectionHeader>Local Market Expertise</SectionHeader>

      {agent.autoBadges.length > 0 && (
        <div className="mb-6">
          <p className="uppercase mb-3" style={{ fontSize: '11px', fontWeight: 600, color: C_TER, letterSpacing: '0.08em' }}>
            Verified Transaction Specialties
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {agent.autoBadges.map((badge, i) => (
              <AutoBadgeCard key={badge.category} badge={badge} index={i} />
            ))}
          </div>
          <p className="mt-2 leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>
            Each badge requires 5+ verified transactions · Source: MLS Data
          </p>
        </div>
      )}

      {agent.manualBadges.length > 0 && (
        <div>
          <p className="uppercase mb-3" style={{ fontSize: '11px', fontWeight: 600, color: C_TER, letterSpacing: '0.08em' }}>
            Provn-Verified Background
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {agent.manualBadges.map((badge, i) => (
              <ManualBadgeCard key={badge.label} badge={badge} index={i} />
            ))}
          </div>
          <p className="mt-2 leading-relaxed" style={{ fontSize: '12px', color: C_INTERP, lineHeight: 1.6 }}>
            Documentation on file · Verified by Provn
          </p>
        </div>
      )}
    </section>
  );
}
