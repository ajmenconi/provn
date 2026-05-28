'use client';

/**
 * Provn marketing landing page — Direction A: Provocation
 * Route: /
 * Primary accent: #E63946 red. Dark #0A0A0A throughout.
 * 7 sections: Hero · Problem · ProvnDiff · Score · Education · CTA · Footer
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ── Design tokens ─────────────────────────────────────────────────────────────

const BG       = '#0A0A0A';
const BG_ALT   = '#0F0F0F';
const BG_CARD  = '#141414';
const BD       = '#2D2D2D';
const RED      = '#E63946';
const C_SEC    = '#94A3B8';
const C_INTERP = '#CBD5E1';
const C_TER    = '#4B5563';
const GREEN    = '#10B981';

// ── Smooth scroll ─────────────────────────────────────────────────────────────

function useSmoothScroll() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = ''; };
  }, []);
}

// ── FadeIn on scroll ──────────────────────────────────────────────────────────

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.62s ease ${delay}ms, transform 0.62s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Score bar ─────────────────────────────────────────────────────────────────

function ScoreBar({
  label,
  source,
  pct,
  delay = 0,
}: {
  label: string;
  source: string;
  pct: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setFilled(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ marginBottom: '26px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '16px',
          marginBottom: '7px',
        }}
      >
        <span style={{ color: '#ffffff', fontWeight: 600, fontSize: '13px', flexShrink: 0 }}>
          {label}
        </span>
        <span
          style={{
            color: C_TER,
            fontSize: '11px',
            textAlign: 'right',
            lineHeight: 1.35,
          }}
        >
          {source}
        </span>
      </div>
      <div
        style={{
          height: '4px',
          borderRadius: '999px',
          background: '#1c1c1c',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: '999px',
            background: `linear-gradient(90deg, ${GREEN}, #34d399)`,
            width: filled ? `${pct}%` : '0%',
            transition: `width 1.15s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function ChevronDown({ color = RED }: { color?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ animation: 'chevron-pulse 2s ease-in-out infinite' }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function PersonQuestionIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke={RED}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10" cy="7" r="4" />
      <path d="M6 21v-2a6 6 0 0 1 8-5.6" />
      <path d="M19 14a2 2 0 0 0-4 0c0 1.5 2 2 2 2" />
      <path d="M19 19h.01" />
    </svg>
  );
}

function MapPinDollarIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke={RED}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s-7-6.5-7-11a7 7 0 1 1 14 0c0 4.5-7 11-7 11z" />
      <path d="M12 8v1m0 6v-1" />
      <path d="M10.5 10a1.5 1.5 0 0 0 3 0 1.5 1.5 0 0 0-3 0z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke={RED}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={GREEN}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={RED}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={GREEN}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={GREEN}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
    </svg>
  );
}

function ArrowRightIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 12h15m0 0-5.625-5.625M19.5 12l-5.625 5.625" />
    </svg>
  );
}

// ── Fixed nav ─────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: '#080D1A',
        borderBottom: '1px solid #1E2A3A',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(24px, 4vw, 48px)',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Wordmark with green dot */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: GREEN,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: '20px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            Provn
          </span>
        </Link>

        {/* Right nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link
            href="/match/buyer"
            style={{ color: C_SEC, fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}
          >
            Find an agent
          </Link>
          <Link
            href="/login"
            style={{ color: C_SEC, fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}
          >
            Agent login
          </Link>
          <Link
            href="/match/buyer"
            style={{
              background: GREEN,
              color: '#ffffff',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Get matched
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ── Section 1: Card Flip Hero ─────────────────────────────────────────────────

function ScoreRing({
  score,
  color,
  grade,
  glow = false,
}: {
  score: number;
  color: string;
  grade: string;
  glow?: boolean;
}) {
  const R = 34;
  const circ = 2 * Math.PI * R;
  const offset = circ * (1 - score / 100);
  return (
    <div
      style={{
        position: 'relative',
        width: 80,
        height: 80,
        margin: '0 auto 12px',
        filter: glow ? 'drop-shadow(0 0 8px rgba(16,185,129,0.6))' : 'none',
      }}
    >
      <svg width={80} height={80} viewBox="0 0 80 80">
        <circle cx={40} cy={40} r={R} fill="none" stroke="#2D2D2D" strokeWidth={6} />
        <circle
          cx={40}
          cy={40}
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 40 40)"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 22, fontWeight: 900, color, lineHeight: 1 }}>{grade}</span>
        <span style={{ fontSize: 10, color: C_SEC, marginTop: 2 }}>{score}/100</span>
      </div>
    </div>
  );
}

type ActivityColor = 'green' | 'red' | 'gray';

function ActivityBar({ pattern }: { pattern: ActivityColor[] }) {
  return (
    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 120 }}>
      {pattern.map((c, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: 2,
            background: c === 'green' ? '#10B981' : c === 'red' ? '#EF4444' : '#2D2D2D',
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

interface CardData {
  avatarUrl: string;
  avatarBorder: string;
  avatarShadow: string;
  name: string;
  agentTitle: string;
  brokerage: string;
  stars: string;
  borderColor: string;
  shadowColor: string;
  bgGradient: string;
  score: number;
  grade: string;
  scoreColor: string;
  glow: boolean;
  rows: { label: string; value: string; color: string }[];
  activityPattern: ActivityColor[];
  pillBg: string;
  pillBorderColor: string;
  pillText: string;
  pillTextColor: string;
}

const CARD_DATA: CardData[] = [
  // Left — Tara Reynolds (amber · C+ coaster)
  {
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
    avatarBorder: '#F59E0B',
    avatarShadow: '0 0 12px rgba(245,158,11,0.3)',
    name: 'Tara Reynolds',
    agentTitle: 'REALTOR® · 11 Years',
    brokerage: 'Keller Williams · Petaluma',
    stars: '4.9 stars · 34 reviews',
    borderColor: '#F59E0B',
    shadowColor: 'rgba(245,158,11,0.12)',
    bgGradient: 'linear-gradient(145deg, #1A1500, #1A1D2E)',
    score: 58,
    grade: 'C+',
    scoreColor: '#F59E0B',
    glow: false,
    rows: [
      { label: 'Licensed', value: '11 years', color: '#CBD5E1' },
      { label: 'Career transactions', value: '94 total', color: '#CBD5E1' },
      { label: 'Last sale', value: '4 months ago', color: '#F59E0B' },
      { label: 'Price reductions', value: '4 of last 10 listings', color: '#F59E0B' },
      { label: 'Property owned', value: '1 — primary residence only', color: '#F59E0B' },
    ],
    activityPattern: ['green','green','gray','green','gray','gray','green','green','gray','green','gray','green'],
    pillBg: '#1A1200',
    pillBorderColor: 'rgba(245,158,11,0.4)',
    pillText: '⚠ Inconsistent activity — not aligned with your price range',
    pillTextColor: '#F59E0B',
  },
  // Middle — James Miller (red · C novice)
  {
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
    avatarBorder: '#EF4444',
    avatarShadow: '0 0 12px rgba(239,68,68,0.3)',
    name: 'James Miller',
    agentTitle: 'REALTOR® · 2 Years',
    brokerage: 'Century 21 · Santa Rosa',
    stars: '4.8 stars · 11 reviews',
    borderColor: '#EF4444',
    shadowColor: 'rgba(239,68,68,0.15)',
    bgGradient: 'linear-gradient(145deg, #1A0D0D, #1A1D2E)',
    score: 41,
    grade: 'C',
    scoreColor: '#EF4444',
    glow: false,
    rows: [
      { label: 'Licensed', value: '2 years', color: '#EF4444' },
      { label: 'Career transactions', value: '8 total', color: '#EF4444' },
      { label: 'Last sale', value: '9 months ago', color: '#F59E0B' },
      { label: 'Price reductions', value: '6 of last 8 listings', color: '#EF4444' },
      { label: 'Property owned', value: 'None verified', color: '#EF4444' },
    ],
    activityPattern: ['red','red','gray','gray','red','red','gray','gray','red','gray','gray','gray'],
    pillBg: '#2D0A0A',
    pillBorderColor: 'rgba(239,68,68,0.4)',
    pillText: '⚠ High risk — limited experience in current market',
    pillTextColor: '#EF4444',
  },
  // Right — Sarah Chen (green · A+ pro)
  {
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
    avatarBorder: '#10B981',
    avatarShadow: '0 0 12px rgba(16,185,129,0.3)',
    name: 'Sarah Chen',
    agentTitle: 'BROKER · 19 Years',
    brokerage: 'Compass · Healdsburg',
    stars: '4.9 stars · 147 reviews',
    borderColor: '#10B981',
    shadowColor: 'rgba(16,185,129,0.2)',
    bgGradient: 'linear-gradient(145deg, #0A1F12, #0F1628)',
    score: 94,
    grade: 'A+',
    scoreColor: '#10B981',
    glow: true,
    rows: [
      { label: 'Licensed', value: '19 years', color: '#10B981' },
      { label: 'Career transactions', value: '312 total', color: '#10B981' },
      { label: 'Last sale', value: '3 weeks ago', color: '#10B981' },
      { label: 'Price reductions', value: '1 of last 10 listings', color: '#10B981' },
      { label: 'Property owned', value: '4 properties · $2.1M portfolio', color: '#10B981' },
    ],
    activityPattern: ['green','green','green','green','green','green','green','green','green','green','green','green'],
    pillBg: '#0A2A1A',
    pillBorderColor: '#10B981',
    pillText: '✓ Top 5% Sonoma County · Currently active · Verified owner',
    pillTextColor: '#10B981',
  },
];

function FlipCard({
  data,
  isFlipped,
  onFlip,
}: {
  data: CardData;
  isFlipped: boolean;
  onFlip: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches);
  }, []);

  const tiltTransform = !isFlipped && hovered && !isTouch ? 'rotateY(8deg)' : 'rotateY(0deg)';
  const flipTransform = isFlipped ? 'rotateY(180deg)' : tiltTransform;

  return (
    <div
      onClick={onFlip}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 300,
        height: 420,
        perspective: '1000px',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {/* Flip container */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
          transform: flipTransform,
          transition: isFlipped
            ? 'transform 0.7s cubic-bezier(0.4, 0.0, 0.2, 1)'
            : 'transform 0.3s ease',
        }}
      >
        {/* ── FRONT FACE ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 20,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'linear-gradient(145deg, #1A1D2E, #0F1117)',
            border: '1px solid #2D3148',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 24px',
            boxSizing: 'border-box',
          }}
        >
          {/* Avatar */}
          <img
            src={data.avatarUrl}
            alt={data.name}
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              objectFit: 'cover',
              objectPosition: 'center top',
              border: `3px solid ${data.avatarBorder}`,
              boxShadow: data.avatarShadow,
              marginBottom: 10,
              flexShrink: 0,
              display: 'block',
            }}
          />

          {/* Name */}
          <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>
            {data.name}
          </div>

          {/* Agent title */}
          <div style={{ fontSize: 11, color: '#94A3B8', letterSpacing: '0.05em', marginBottom: 4 }}>
            {data.agentTitle}
          </div>

          {/* Brokerage */}
          <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 12 }}>
            {data.brokerage}
          </div>

          {/* Divider */}
          <div style={{ width: '100%', height: 1, background: '#2D3148', marginBottom: 14 }} />

          {/* Stars */}
          <div style={{ fontSize: 18, color: '#F59E0B', marginBottom: 4 }}>&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 14 }}>{data.stars}</div>

          {/* Blurred data pills */}
          <div style={{ width: '100%', marginBottom: 10 }}>
            {[
              'Licensed X years · X transactions',
              'Property ownership · portfolio value',
              'Price reduction rate · last sale date',
            ].map((text, i) => (
              <div
                key={i}
                style={{
                  background: '#1E2330',
                  borderRadius: 8,
                  padding: '8px 12px',
                  marginBottom: 8,
                  filter: 'blur(4px)',
                  fontSize: 12,
                  color: '#CBD5E1',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                {text}
              </div>
            ))}
          </div>

          {/* Tap to reveal */}
          <div style={{ fontSize: 11, color: '#4B5563', fontStyle: 'italic', marginBottom: 6 }}>
            Tap to reveal · Tap again to compare
          </div>

          {/* Lock icon pulse */}
          <div
            style={{
              fontSize: 16,
              marginBottom: 12,
              animation: 'lock-pulse 2s ease-in-out infinite',
              display: 'inline-block',
            }}
          >
            &#128274;
          </div>

          {/* Blurred score bar */}
          <div style={{ width: '100%' }}>
            <div
              style={{
                fontSize: 11,
                color: '#4B5563',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}
            >
              PROVN SCORE — HIDDEN
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 999,
                background: '#94A3B8',
                filter: 'blur(6px)',
              }}
            />
          </div>
        </div>

        {/* ── BACK FACE ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 20,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: data.bgGradient,
            border: `2px solid ${data.borderColor}`,
            boxShadow: `0 8px 40px ${data.shadowColor}`,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            boxSizing: 'border-box',
            overflowY: 'hidden',
          }}
        >
          {/* Agent header */}
          <div style={{ textAlign: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>{data.name}</div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>{data.brokerage}</div>
          </div>

          {/* Score ring */}
          <ScoreRing score={data.score} color={data.scoreColor} grade={data.grade} glow={data.glow} />

          {/* Stat rows */}
          <div style={{ width: '100%', flex: 1 }}>
            {data.rows.map((row, i) => (
              <div key={i}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '5px 0',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 11, color: '#94A3B8', flexShrink: 0 }}>{row.label}</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: row.color,
                      textAlign: 'right',
                    }}
                  >
                    {row.value}
                  </span>
                </div>
                <div style={{ height: 1, background: '#2D2D2D' }} />
              </div>
            ))}

            {/* Activity row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '5px 0',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 11, color: '#94A3B8', flexShrink: 0 }}>Active last 36 mo</span>
              <ActivityBar pattern={data.activityPattern} />
            </div>
          </div>

          {/* Verdict pill */}
          <div
            style={{
              background: data.pillBg,
              border: `1px solid ${data.pillBorderColor}`,
              borderRadius: 8,
              padding: '8px 10px',
              textAlign: 'center',
              marginTop: 8,
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, color: data.pillTextColor, lineHeight: 1.4, display: 'block' }}>
              {data.pillText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardFlipSection() {
  const [flipped, setFlipped] = useState([false, false, false]);
  const [showReveal, setShowReveal] = useState(false);
  const allFlipped = flipped.every(Boolean);

  useEffect(() => {
    if (allFlipped) {
      const t = setTimeout(() => setShowReveal(true), 300);
      return () => clearTimeout(t);
    } else {
      setShowReveal(false);
    }
  }, [allFlipped]);

  const handleFlip = (i: number) => {
    setFlipped(prev => {
      const next = [...prev];
      next[i] = !next[i]; // toggle — flip forward and back
      return next;
    });
  };

  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #080D1A 0%, #0A0F1E 50%, #080D1A 100%)',
        padding: '100px clamp(24px, 4vw, 48px)',
        overflow: 'hidden',
      }}
    >
      {/* Keyframes injected via style tag so Tailwind v4 cannot purge them */}
      <style>{`
        @keyframes tap-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.9); }
        }
        @keyframes lock-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes dot-ping {
          0% { transform: scale(1); opacity: 1; }
          80%, 100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes reveal-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .flip-card { width: calc(100vw - 48px) !important; }
        }
      `}</style>

      {/* Eyebrow pill */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <span
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #0F2A1A, #1A1F35)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 20,
            padding: '6px 16px',
            fontSize: 12,
            color: '#94A3B8',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 600,
          }}
        >
          ✦ CAN YOU TELL THEM APART?
        </span>
      </div>

      {/* Primary headline */}
      <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 24px' }}>
        <h2
          style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          <span style={{ display: 'block', color: '#ffffff' }}>
            One of these real estate agents will make you $75,000.
          </span>
          <span
            style={{
              display: 'block',
              background: 'linear-gradient(135deg, #10B981, #06B6D4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Two will cost you $75,000.
          </span>
        </h2>
      </div>

      {/* Subheadline */}
      <p
        style={{
          textAlign: 'center',
          fontSize: 18,
          color: '#94A3B8',
          maxWidth: 580,
          margin: '0 auto 0',
          lineHeight: 1.7,
        }}
      >
        They all have five stars. They all call themselves specialists. Every one will tell you they
        are the best agent for your situation. Without Provn, you have no way to know if that is
        true. Go ahead — try to pick the right one.
      </p>

      {/* Tap instruction + finger icon */}
      <div
        style={{
          textAlign: 'center',
          marginTop: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 14, color: '#10B981' }}>
          Tap each card to see what Provn reveals.
        </span>
        <span
          style={{
            fontSize: 18,
            display: 'inline-block',
            animation: 'tap-pulse 1.5s ease-in-out infinite',
          }}
        >
          &#128070;
        </span>
      </div>

      {/* Progress dots */}
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <div
          style={{
            fontSize: 11,
            color: '#4B5563',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 12,
          }}
        >
          FLIP ALL THREE TO SEE THE FULL PICTURE
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          {flipped.map((f, i) => (
            <div key={i} style={{ position: 'relative', width: 16, height: 16 }}>
              {/* Ping ring */}
              {f && (
                <div
                  key={`ping-${i}`}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: '#10B981',
                    animation: 'dot-ping 0.7s ease-out forwards',
                  }}
                />
              )}
              {/* Dot */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: f ? 'none' : '2px solid #2D3148',
                  background: f ? '#10B981' : 'transparent',
                  transition: 'background 0.3s, border 0.3s',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Card row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          flexWrap: 'wrap',
          marginTop: 56,
          maxWidth: 1100,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {CARD_DATA.map((card, i) => (
          <FlipCard
            key={i}
            data={card}
            isFlipped={flipped[i]}
            onFlip={() => handleFlip(i)}
          />
        ))}
      </div>

      {/* Reveal payoff — appears only after all three cards flipped */}
      {showReveal && (
        <div
          style={{
            textAlign: 'center',
            maxWidth: 700,
            margin: '80px auto 0',
            animation: 'reveal-fade-up 0.6s ease forwards',
          }}
        >
          <h3
            style={{
              fontSize: 'clamp(24px, 4vw, 40px)',
              fontWeight: 800,
              color: '#ffffff',
              margin: '0 0 4px',
              lineHeight: 1.2,
            }}
          >
            The reviews told you almost nothing.
          </h3>
          <h3
            style={{
              fontSize: 'clamp(24px, 4vw, 40px)',
              fontWeight: 800,
              margin: '0 0 0',
              lineHeight: 1.2,
              background: 'linear-gradient(135deg, #10B981, #06B6D4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            The data tells you everything.
          </h3>

          <p
            style={{
              fontSize: 17,
              color: '#94A3B8',
              maxWidth: 560,
              margin: '16px auto 0',
              lineHeight: 1.7,
            }}
          >
            James and Tara have good reviews. So does Sarah. The difference is $125,000 in
            potential outcome — and it was invisible until now. Every market in America has
            the same three agents. Provn shows you which is which.
          </p>

          <p style={{ fontSize: 15, color: '#CBD5E1', marginTop: 12 }}>
            This is what it feels like to actually be informed.
          </p>

          <Link
            href="/match/buyer"
            style={{
              display: 'inline-block',
              marginTop: 32,
              background: '#10B981',
              color: '#ffffff',
              fontSize: 17,
              fontWeight: 700,
              padding: '16px 48px',
              borderRadius: 10,
              textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(16,185,129,0.35)',
            }}
          >
            Find your Provn agent
          </Link>

          <p style={{ fontSize: 13, color: '#4B5563', marginTop: 16 }}>
            Free for buyers and sellers · No account required · Matched by verified data
          </p>
        </div>
      )}
    </section>
  );
}


// ── Section 2: The problem nobody talks about ─────────────────────────────────

const PROBLEM_CARDS = [
  {
    Icon: PersonQuestionIcon,
    title: 'You are not taught what to ask',
    body: 'How many listings has this agent taken in the last 12 months? How many actually sold? What is their price reduction rate? What do they personally own in real estate? These questions never get asked because nobody told you they matter. Agents count on that.',
  },
  {
    Icon: MapPinDollarIcon,
    title: 'Local knowledge is not universal',
    body: 'An agent with 200 five-star reviews in Santa Rosa is not automatically the right agent for your Healdsburg vineyard property. A buyer specialist who crushes it at $600K may have no idea how to navigate a $1.8M negotiation. One size fits none in real estate — but you would never know that from a star rating.',
  },
  {
    Icon: ClockIcon,
    title: "Today’s market has no margin for error",
    body: "In a normalized market a mediocre agent costs you time. In today’s market they cost you the deal. Overpriced listings sit. Underqualified buyers lose offers. The difference between a good agent and the right agent is measurable in tens of thousands of dollars and months of your life.",
  },
];

function ProblemSection() {
  return (
    <section
      style={{
        background: BG,
        padding: '80px clamp(24px, 4vw, 48px)',
        borderTop: `1px solid ${BD}`,
      }}
    >
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <FadeIn>
          <h2
            style={{
              fontSize: 'clamp(26px, 4vw, 40px)',
              fontWeight: 800,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.2,
              marginBottom: '20px',
            }}
          >
            Nobody teaches you how to hire an agent.
            <br />That is not an accident.
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: C_SEC,
              textAlign: 'center',
              maxWidth: '600px',
              margin: '0 auto 60px',
              lineHeight: 1.7,
            }}
          >
            You are making the largest financial decision of your life. You will spend
            more time researching a refrigerator than the person you trust with hundreds
            of thousands of dollars. The industry built it that way on purpose.
          </p>
        </FadeIn>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {PROBLEM_CARDS.map((card, i) => (
            <FadeIn key={card.title} delay={i * 100}>
              <div
                style={{
                  background: BG_CARD,
                  border: `1px solid ${BD}`,
                  borderLeft: `3px solid ${RED}`,
                  borderRadius: '12px',
                  padding: '28px',
                  height: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <card.Icon />
                </div>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '12px',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {card.title}
                </h3>
                <p style={{ fontSize: '14px', color: C_SEC, lineHeight: 1.7 }}>
                  {card.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 3: What Provn does differently ────────────────────────────────────

const TABLE_ROWS: { bad: string; good: string }[] = [
  {
    bad: 'The agent you see first paid for that placement',
    good: 'Rankings are based entirely on verified transaction data and independent scoring',
  },
  {
    bad: "Buyer inquiries go to whoever bought the zip code — not the listing agent",
    good: 'You are matched to agents based on performance in your specific price range and neighborhood',
  },
  {
    bad: 'Reviews tell you if people liked their agent',
    good: 'Provn tells you if the agent is the right fit for your specific situation',
  },
  {
    bad: 'No data on price reductions, fall-through rates, or agent property ownership',
    good: 'All performance data is pulled from public records — agents cannot edit or influence their own score',
  },
  {
    bad: 'Agents pay monthly fees for premium placement',
    good: 'Agents cannot pay for status or placement — period',
  },
  {
    bad: 'Your contact information is sold to agents as a lead',
    good: 'Your information is only shared with agents you choose to contact',
  },
];

function ProvnDiffSection() {
  return (
    <section
      style={{
        background: BG_ALT,
        padding: '80px clamp(24px, 4vw, 48px)',
        borderTop: `1px solid ${BD}`,
        borderBottom: `1px solid ${BD}`,
      }}
    >
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <FadeIn>
          <h2
            style={{
              fontSize: 'clamp(30px, 4.5vw, 48px)',
              fontWeight: 900,
              color: '#ffffff',
              maxWidth: '800px',
              marginBottom: '16px',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
            }}
          >
            Agents cannot buy their way onto Provn.
          </h2>
          <p
            style={{
              fontSize: '20px',
              color: C_SEC,
              maxWidth: '560px',
              lineHeight: 1.6,
              marginBottom: '52px',
            }}
          >
            Every agent on this platform earned their placement through verified data.
            No exceptions.
          </p>
        </FadeIn>

        <FadeIn delay={80}>
          {/* Column headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '6px',
            }}
          >
            <div
              style={{
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <XIcon />
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: RED,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Every other platform
              </span>
            </div>
            <div
              style={{
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckIcon />
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: GREEN,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Provn
              </span>
            </div>
          </div>

          {/* Rows */}
          {TABLE_ROWS.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                background:
                  i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'transparent',
                borderRadius: '8px',
                marginBottom: '2px',
                alignItems: 'stretch',
              }}
            >
              <div
                style={{
                  padding: '16px 20px',
                  borderLeft: `2px solid rgba(230,57,70,0.3)`,
                }}
              >
                <p
                  style={{
                    fontSize: '14px',
                    color: C_TER,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {row.bad}
                </p>
              </div>
              <div
                style={{
                  padding: '16px 20px',
                  borderLeft: `2px solid rgba(16,185,129,0.3)`,
                }}
              >
                <p
                  style={{
                    fontSize: '14px',
                    color: C_INTERP,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {row.good}
                </p>
              </div>
            </div>
          ))}

          {/* Disclosure */}
          <p
            style={{
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 600,
              color: '#ffffff',
              maxWidth: '820px',
              margin: '40px auto 0',
              lineHeight: 1.65,
            }}
          >
            When you find your agent through Provn, a referral fee is paid by the
            agent at closing — not by you, never affecting your cost. You agree to these
            terms before seeing any matches. Full transparency, no surprises.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Decorative agent card ─────────────────────────────────────────────────────

function DecorativeAgentCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const r = 38;
  const circ = 2 * Math.PI * r; // ≈ 238.76
  const filled = (93 / 100) * circ;
  const dashOffset = circ - filled; // ≈ 16.5 when full

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      {/* Green glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '300px',
          height: '300px',
          background:
            'radial-gradient(ellipse, rgba(16,185,129,0.14) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      {/* Card */}
      <div
        style={{
          background: BG_CARD,
          border: `1px solid ${BD}`,
          borderRadius: '20px',
          padding: '32px',
          width: '100%',
          maxWidth: '340px',
          position: 'relative',
        }}
      >
        {/* Avatar + score ring */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          {/* Score ring */}
          <div
            style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}
          >
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              style={{ transform: 'rotate(-90deg)' }}
            >
              <circle
                cx="50" cy="50" r={r}
                fill="none"
                stroke="#1c1c1c"
                strokeWidth="7"
              />
              <circle
                cx="50" cy="50" r={r}
                fill="none"
                stroke={GREEN}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={visible ? dashOffset : circ}
                style={{
                  transition: 'stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1) 0.4s',
                }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              <span style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff' }}>
                93
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: GREEN, marginTop: '2px' }}>
                A+
              </span>
            </div>
          </div>

          {/* Name */}
          <div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.01em',
                marginBottom: '4px',
              }}
            >
              Sarah Chen
            </div>
            <div style={{ fontSize: '13px', color: C_SEC }}>
              Healdsburg · Compass
            </div>
          </div>
        </div>

        {/* Stat pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          {['$214M Career Vol.', '$468M Listed', '19 yrs licensed'].map((s) => (
            <div
              key={s}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${BD}`,
                fontSize: '11px',
                color: C_SEC,
                fontWeight: 600,
              }}
            >
              {s}
            </div>
          ))}
        </div>

        {/* Specialty badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {['Luxury', 'Vineyard', '1031'].map((b) => (
            <div
              key={b}
              style={{
                padding: '4px 10px',
                borderRadius: '999px',
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.3)',
                fontSize: '11px',
                color: GREEN,
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
            >
              {b}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Section 4: Provn Score ────────────────────────────────────────────────────

const SCORE_BARS = [
  {
    label: 'Five Star Reviews',
    source: 'Aggregated across Google, Zillow, Realtor.com, Homes.com — weighted by recency',
    pct: 80,
  },
  {
    label: 'Local Market Expertise',
    source: 'Breadth and depth of transactions across neighborhoods from MLS data',
    pct: 88,
  },
  {
    label: 'Career Volume',
    source: 'Total sales volume ranked against all active agents in the county',
    pct: 72,
  },
  {
    label: 'Skin in the Game',
    source: 'Verified property ownership from county assessor records',
    pct: 64,
  },
  {
    label: 'Successful Outcomes',
    source: 'Percentage of all listings ever taken that eventually sold',
    pct: 76,
  },
  {
    label: 'Expertise Depth',
    source: 'Weighted specialty transaction count — complex deals score higher',
    pct: 60,
  },
];

function ScoreSection() {
  return (
    <section
      style={{
        background: BG,
        padding: '80px clamp(24px, 4vw, 48px)',
        borderTop: `1px solid ${BD}`,
      }}
    >
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <FadeIn>
          <h2
            style={{
              fontSize: 'clamp(26px, 4vw, 40px)',
              fontWeight: 800,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.2,
              marginBottom: '60px',
            }}
          >
            Every agent has a Provn Score.
            <br />Here is what goes into it.
          </h2>
        </FadeIn>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '60px',
            alignItems: 'center',
          }}
        >
          {/* Bars */}
          <div>
            {SCORE_BARS.map((bar, i) => (
              <ScoreBar
                key={bar.label}
                label={bar.label}
                source={bar.source}
                pct={bar.pct}
                delay={i * 110}
              />
            ))}
          </div>

          {/* Decorative card */}
          <FadeIn delay={150}>
            <DecorativeAgentCard />
          </FadeIn>
        </div>

        <FadeIn delay={80}>
          <p
            style={{
              textAlign: 'center',
              fontSize: '13px',
              fontStyle: 'italic',
              color: C_SEC,
              marginTop: '48px',
              lineHeight: 1.6,
            }}
          >
            Agents cannot see the exact formula. The only way to improve a Provn score
            is to actually serve clients better.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Section 5: Consumer education ────────────────────────────────────────────

function EducationSection() {
  return (
    <section
      style={{
        background: BG_CARD,
        padding: '80px clamp(24px, 4vw, 48px)',
        borderTop: `1px solid ${BD}`,
        borderBottom: `1px solid ${BD}`,
      }}
    >
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <FadeIn>
          <h2
            style={{
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              fontWeight: 800,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.25,
              marginBottom: '28px',
            }}
          >
            Every buyer and seller is different.
            <br />The industry ignores this.
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: C_INTERP,
              textAlign: 'center',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.8,
            }}
          >
            A first-time buyer navigating their first offer needs a patient educator who
            understands financing, contingencies, and negotiation from a position of calm.
            A move-up seller who needs to sell before they can buy needs a tactician who
            can coordinate two transactions simultaneously without losing either one. A
            retired couple downsizing from a family home of 30 years needs someone who
            understands the emotional weight of that transaction as much as the financial
            one. These are not the same job. The same agent is not right for all three.
          </p>
          <p
            style={{
              fontSize: '16px',
              color: C_SEC,
              textAlign: 'center',
              maxWidth: '560px',
              margin: '16px auto 0',
              lineHeight: 1.7,
            }}
          >
            Provn matches you based on what you actually need — not who paid for the top
            slot in your zip code.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Section 6: CTA ────────────────────────────────────────────────────────────

function AgentSearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = query.trim();
      if (q) router.push(`/agents/search?q=${encodeURIComponent(q)}`);
    },
    [query, router]
  );

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', gap: '8px', maxWidth: '420px', width: '100%' }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Agent name or license #"
        style={{
          flex: 1,
          padding: '11px 16px',
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${BD}`,
          borderRadius: '8px',
          color: '#ffffff',
          fontSize: '14px',
          outline: 'none',
        }}
      />
      <button
        type="submit"
        style={{
          padding: '11px 20px',
          background: 'transparent',
          border: `1px solid ${BD}`,
          borderRadius: '8px',
          color: C_INTERP,
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Look up →
      </button>
    </form>
  );
}

const CTA_CARDS = [
  {
    Icon: KeyIcon,
    title: 'I want to buy',
    body: 'Get matched to the 3 highest-rated buyer agents for your search area and budget — based on verified data, not advertising.',
    cta: 'Find my agent',
    href: '/match/buyer',
  },
  {
    Icon: HomeIcon,
    title: 'I want to sell',
    body: 'Get matched to the 3 top listing agents for your home based on verified performance in your specific neighborhood and price range.',
    cta: 'Match me now',
    href: '/match/seller',
  },
];

function CTASection() {
  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #0A1F14 0%, #0A0A0A 100%)',
        padding: '100px clamp(24px, 4vw, 48px)',
        borderTop: `1px solid ${BD}`,
      }}
    >
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <FadeIn>
          <h2
            style={{
              fontSize: 'clamp(40px, 6vw, 64px)',
              fontWeight: 900,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              marginBottom: '20px',
            }}
          >
            Why gamble with the largest
            <br />purchase you will ever make?
          </h2>
          <p
            style={{
              fontSize: '20px',
              color: C_INTERP,
              textAlign: 'center',
              maxWidth: '560px',
              margin: '0 auto 56px',
              lineHeight: 1.65,
            }}
          >
            Ready to find your Provn Agent?
          </p>
        </FadeIn>

        {/* Flow cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          {CTA_CARDS.map((card, i) => (
            <FadeIn key={card.title} delay={i * 100}>
              <div
                style={{
                  background: '#0F1117',
                  border: `1px solid ${GREEN}`,
                  borderRadius: '16px',
                  padding: '32px',
                  height: '100%',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(16,185,129,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <card.Icon />
                </div>
                <h3
                  style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#ffffff',
                    marginBottom: '10px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: C_SEC,
                    lineHeight: 1.65,
                    marginBottom: '28px',
                    flex: 1,
                  }}
                >
                  {card.body}
                </p>
                <Link
                  href={card.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: GREEN,
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '15px',
                    borderRadius: '8px',
                    padding: '13px 24px',
                    textDecoration: 'none',
                  }}
                >
                  {card.cta} <ArrowRightIcon size={15} />
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Agent lookup */}
        <FadeIn delay={100}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <p style={{ fontSize: '14px', color: C_SEC, textAlign: 'center' }}>
              Already know your agent? Look them up.
            </p>
            <AgentSearchInput />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Section 7: Footer ─────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      style={{
        background: BG,
        borderTop: `1px solid ${BD}`,
        padding: '40px clamp(24px, 4vw, 48px) 0',
      }}
    >
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        {/* Main row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '40px',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingBottom: '40px',
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '6px',
              }}
            >
              Provn
            </div>
            <div style={{ fontSize: '13px', color: C_SEC }}>Know before you hire.</div>
          </div>

          {/* Nav links */}
          <div
            style={{
              display: 'flex',
              gap: '32px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {['How it works', 'For agents', 'About', 'Contact'].map((label) => (
              <Link
                key={label}
                href="#"
                style={{
                  color: C_SEC,
                  fontSize: '13px',
                  textDecoration: 'none',
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Agent claim */}
          <Link
            href="/agents/claim"
            style={{
              color: GREEN,
              fontSize: '13px',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Agent on Provn? Claim your profile.
          </Link>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: `1px solid ${BD}`,
            paddingTop: '20px',
            paddingBottom: '32px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '11px', color: C_TER, lineHeight: 1.6 }}>
            Provn scores are based on publicly available data and verified submissions.
            Provn is not affiliated with any brokerage or real estate portal. © 2026 Provn.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  useSmoothScroll();

  return (
    <div style={{ background: BG, color: '#ffffff' }}>
      <Nav />
      <CardFlipSection />
      <ProblemSection />
      <ProvnDiffSection />
      <ScoreSection />
      <EducationSection />
      <CTASection />
      <Footer />
    </div>
  );
}
