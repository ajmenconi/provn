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
import AgentFlipCard from './components/AgentFlipCard';

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
    // On mobile (<768px) show immediately — skip IntersectionObserver
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: visible
          ? `opacity 0.6s ease, transform 0.6s ease`
          : 'none',
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

// ── Reading progress bar ──────────────────────────────────────────────────────

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 200,
        height: 3,
        background: 'linear-gradient(90deg, #10B981, #06B6D4)',
        width: `${progress}%`,
        transition: 'width 0.12s linear',
        pointerEvents: 'none',
      }}
    />
  );
}

// ── Reusable section eyebrow pill ─────────────────────────────────────────────

function EyebrowPill({ text }: { text: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 24 }}>
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
        {text}
      </span>
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
        className="nav-inner"
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
          <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
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
          </div>
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

const FLIP_CARDS = [
  {
    frontData: {
      name: 'Tara Reynolds',
      brokerage: 'Keller Williams · Petaluma',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
      avatarBorder: '#F59E0B',
      stars: 5,
      reviewCount: '4.9 stars · 34 reviews',
      title: 'REALTOR® · 11 Years',
    },
    backData: {
      grade: 'C+',
      score: 58,
      gradeColor: '#F59E0B',
      borderColor: '#F59E0B',
      glowColor: 'rgba(245,158,11,0.2)',
      outcomeBg: '#1A1200',
      stats: [
        { label: 'Licensed',            value: '11 years',          color: '#CBD5E1' },
        { label: 'Career transactions', value: '94 total',          color: '#CBD5E1' },
        { label: 'Last sale',           value: '4 months ago',      color: '#F59E0B' },
        { label: 'Price reductions',    value: '4 of last 10',      color: '#F59E0B' },
        { label: 'Property owned',      value: '1 — primary only',  color: '#F59E0B' },
      ],
      outcomeText: '⚠ Inconsistent activity — not aligned with your price range',
      outcomeColor: '#F59E0B',
    },
  },
  {
    frontData: {
      name: 'James Miller',
      brokerage: 'Century 21 · Santa Rosa',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
      avatarBorder: '#EF4444',
      stars: 5,
      reviewCount: '4.8 stars · 11 reviews',
      title: 'REALTOR® · 2 Years',
    },
    backData: {
      grade: 'C',
      score: 41,
      gradeColor: '#EF4444',
      borderColor: '#EF4444',
      glowColor: 'rgba(239,68,68,0.2)',
      outcomeBg: '#1A0D0D',
      stats: [
        { label: 'Licensed',            value: '2 years',           color: '#EF4444' },
        { label: 'Career transactions', value: '8 total',           color: '#EF4444' },
        { label: 'Last sale',           value: '9 months ago',      color: '#EF4444' },
        { label: 'Price reductions',    value: '6 of last 8',       color: '#EF4444' },
        { label: 'Property owned',      value: 'None verified',     color: '#EF4444' },
      ],
      outcomeText: '⚠ High risk — limited experience in current market',
      outcomeColor: '#EF4444',
    },
  },
  {
    frontData: {
      name: 'Sarah Chen',
      brokerage: 'Compass · Healdsburg',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
      avatarBorder: '#10B981',
      stars: 5,
      reviewCount: '4.9 stars · 147 reviews',
      title: 'BROKER · 19 Years',
    },
    backData: {
      grade: 'A+',
      score: 94,
      gradeColor: '#10B981',
      borderColor: '#10B981',
      glowColor: 'rgba(16,185,129,0.2)',
      outcomeBg: '#0A1F12',
      stats: [
        { label: 'Licensed',            value: '19 years',              color: '#10B981' },
        { label: 'Career transactions', value: '312 total',             color: '#10B981' },
        { label: 'Last sale',           value: '3 weeks ago',           color: '#10B981' },
        { label: 'Price reductions',    value: '1 of last 10',          color: '#10B981' },
        { label: 'Property owned',      value: '4 · $2.1M portfolio',   color: '#10B981' },
      ],
      outcomeText: '✓ Top 5% Sonoma County · Active · Verified owner',
      outcomeColor: '#10B981',
    },
  },
];

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

  const handleFlip = (index: number) => {
    setFlipped(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <section
      className="section-wrap card-flip-section"
      style={{
        background: 'linear-gradient(180deg, #080D1A 0%, #0A0F1E 50%, #080D1A 100%)',
        padding: '100px clamp(24px, 4vw, 48px)',
        overflow: 'visible',
      }}
    >
      <style>{`
        @keyframes reveal-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
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
            color: '#ffffff',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            margin: 0,
          }}
        >
          Three agents.{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #10B981, #06B6D4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            One empty star rating.
          </span>
        </h2>
      </div>

      {/* Sub-headline */}
      <p
        style={{
          textAlign: 'center',
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: '#94A3B8',
          maxWidth: 600,
          margin: '0 auto 16px',
          lineHeight: 1.65,
        }}
      >
        Each has five stars. Each claims local expertise. Only one of them is right
        for the deal you are about to make.
      </p>

      {/* Instruction */}
      <p style={{ textAlign: 'center', fontSize: 15, color: '#4B5563', marginBottom: 40 }}>
        Tap each card to reveal their verified data.
      </p>

      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 0 }}>
        {flipped.map((f, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              border: f ? 'none' : '2px solid #2D3148',
              background: f ? '#10B981' : 'transparent',
              transition: 'background 0.3s, border 0.3s',
            }}
          />
        ))}
      </div>

      {/* Card row — row on desktop, column on mobile via .flip-cards-row class */}
      <div
        className="flip-cards-row"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'stretch',
          gap: 20,
          flexWrap: 'wrap',
          marginTop: 40,
          maxWidth: 1000,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {FLIP_CARDS.map((card, i) => (
          <AgentFlipCard
            key={i}
            frontData={card.frontData}
            backData={card.backData}
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



// ── Section 2: The problem nobody talks about ────────────────────────────────

const IMPACT_STATS = [
  {
    value: 500, prefix: '$', suffix: '',  color: '#E63946',
    label: 'Average cost per lead agents pay Zillow just to call you back',
  },
  {
    value: 0,   prefix: '',  suffix: '',  color: '#F59E0B',
    label: "Zillow's accountability when that agent underperforms for you",
  },
  {
    value: 75,  prefix: '$', suffix: 'K', color: '#10B981',
    label: 'Potential difference between the right agent and the wrong one',
  },
];

const FLOW_ROWS = [
  {
    label: 'OTHER PLATFORMS', labelColor: '#E63946',
    steps: [
      { text: 'You search for an agent',           box: false },
      { text: 'Advertising auction  $',            box: true,  bg: '#1A0D0D', border: 'rgba(230,57,70,0.4)'   },
      { text: 'Highest bidder gets your info',     box: false },
    ],
    outcome: { text: 'Stranger shows up to your showing', bg: '#1A0D0D', border: 'rgba(230,57,70,0.5)', color: '#E63946' },
  },
  {
    label: 'PROVN', labelColor: '#10B981',
    steps: [
      { text: 'You describe your situation',       box: false },
      { text: '✓  Verified data match',            box: true,  bg: '#0A1F12', border: 'rgba(16,185,129,0.4)'  },
      { text: 'Top 3 agents by actual performance', box: false },
    ],
    outcome: { text: 'Agent proven in your market arrives', bg: '#0A1F12', border: 'rgba(16,185,129,0.5)', color: '#10B981' },
  },
];

const INSIGHT_CARDS = [
  {
    emoji: '🎯', borderColor: '#E63946',
    title: 'You are not taught what to ask',
    body: 'Price reduction rate. Fall-through rate. Whether they own any real estate themselves. These questions exist — nobody told you to ask them.',
    accent: 'Agents count on that.',
    accentColor: '#E63946',
  },
  {
    emoji: '📍', borderColor: '#F59E0B',
    title: 'Local knowledge is not universal',
    body: 'A 4.9-star agent in Santa Rosa may have never sold in Healdsburg. Star ratings do not tell you if they are right for your situation.',
    accent: 'Provn filters by your exact situation.',
    accentColor: '#F59E0B',
  },
  {
    emoji: '⚡', borderColor: '#10B981',
    title: "Today's market has no margin for error",
    body: "In today's market overpriced listings sit for months. The right agent prices correctly on day one — and never reduces.",
    accent: 'The difference is tens of thousands of dollars.',
    accentColor: '#10B981',
  },
];

function ImpactStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!triggered) return;
    const rafs: number[] = [];
    IMPACT_STATS.forEach((stat, i) => {
      if (stat.value === 0) return;
      const delay = i * 180;
      const duration = 1400;
      let t0: number | null = null;
      const tick = (now: number) => {
        if (!t0) t0 = now;
        const elapsed = now - t0 - delay;
        if (elapsed < 0) { rafs[i] = requestAnimationFrame(tick); return; }
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setCounts(prev => {
          const next = [...prev];
          next[i] = Math.round(eased * stat.value);
          return next;
        });
        if (t < 1) rafs[i] = requestAnimationFrame(tick);
      };
      rafs[i] = requestAnimationFrame(tick);
    });
    return () => rafs.forEach(r => cancelAnimationFrame(r));
  }, [triggered]);

  return (
    <div ref={ref} className="impact-stats-row" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 48 }}>
      {IMPACT_STATS.map((stat, i) => (
        <div
          key={i}
          className="impact-stat-pill"
          style={{
            background: '#0F1628', border: '1px solid #1E2A3A', borderRadius: 16,
            padding: '20px 32px 24px', textAlign: 'center',
            flex: '1 1 180px', maxWidth: 260,
            minHeight: 120, overflow: 'visible',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 900, color: stat.color, lineHeight: 1, marginBottom: 10 }}>
            {stat.prefix}{counts[i]}{stat.suffix}
          </div>
          <div style={{
            fontSize: 12, color: '#94A3B8', lineHeight: 1.6,
            maxWidth: 200, margin: '0 auto',
            whiteSpace: 'normal', wordWrap: 'break-word',
          }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function FlowDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const OTHER_STEPS = [
    'You search for a property on Zillow, Realtor.com, or another third party platform',
    'Your inquiry enters an advertising auction you never see',
    'The agent who paid for your zip code receives your contact info',
    'A stranger shows up to your showing and asks you to sign a buyer broker agreement',
  ];

  const PROVN_STEPS = [
    'You search for an agent on Provn and describe your situation, budget, and neighborhood',
    'Provn matches your criteria against verified performance data from public records',
    'Your top 3 agents are ranked by actual results in your price range and area',
    'You choose who to contact — no obligation, no pressure, no hidden auctions',
  ];

  const cardBase = (i: number) => ({
    flex: '1 1 300px',
    minHeight: 520,
    borderRadius: 20,
    padding: '36px 32px',
    boxSizing: 'border-box' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    transform: visible
      ? hoveredCard === i ? 'translateY(-4px)' : 'translateY(0)'
      : i === 0 ? 'translateX(-40px)' : 'translateX(40px)',
    opacity: visible ? 1 : 0,
    transition: visible
      ? `transform 0.3s ease, box-shadow 0.3s ease, opacity 0.6s ease-out ${i * 0.1}s`
      : `transform 0.6s ease-out ${i * 0.1}s, opacity 0.6s ease-out ${i * 0.1}s`,
    boxShadow: hoveredCard === i
      ? '0 16px 48px rgba(0,0,0,0.4)'
      : '0 4px 20px rgba(0,0,0,0.2)',
    cursor: 'default',
  });

  return (
    <div style={{ maxWidth: 900, margin: '48px auto 0' }}>
      {/* Header label */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <span style={{ fontSize: 12, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          HOW YOUR INQUIRY ACTUALLY GETS HANDLED
        </span>
      </div>

      {/* Card row */}
      <div
        ref={ref}
        className="flow-cards-row"
        style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'stretch', justifyContent: 'center' }}
      >
        {/* ── Card 1: Other Platforms ───────────────────────────── */}
        <div
          className="flow-card-item"
          onMouseEnter={() => setHoveredCard(0)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            ...cardBase(0),
            background: '#1A0D0D',
            border: '1px solid rgba(239,68,68,0.5)',
          }}
        >
          {/* Label pill */}
          <div style={{ marginBottom: 20 }}>
            <span style={{
              display: 'inline-block',
              background: '#2D0A0A',
              border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: 20, padding: '6px 16px',
              fontSize: 11, fontWeight: 700, color: '#EF4444',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              ✗ OTHER PLATFORMS
            </span>
          </div>

          {/* Icon */}
          <div style={{ textAlign: 'center', fontSize: 48, lineHeight: 1, marginBottom: 12 }}>
            💸
          </div>

          {/* Headline */}
          <h3 style={{
            fontSize: 20, fontWeight: 700, color: '#ffffff',
            textAlign: 'center', margin: '0 0 24px', lineHeight: 1.3,
          }}>
            You get whoever paid the most
          </h3>

          {/* Steps — timeline */}
          <div style={{ position: 'relative', paddingLeft: 24 }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: 7, top: 6, bottom: 6,
              width: 1, background: '#EF4444', opacity: 0.35,
              borderLeft: '1px dotted rgba(239,68,68,0.5)',
            }} />
            {OTHER_STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: i < OTHER_STEPS.length - 1 ? 16 : 0 }}>
                <div style={{
                  flexShrink: 0, width: 14, height: 14,
                  borderRadius: '50%', background: '#2D0A0A',
                  border: '1px solid #EF4444',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, color: '#EF4444', fontWeight: 900,
                  marginTop: 2, position: 'relative', zIndex: 1,
                }}>
                  ✗
                </div>
                <span style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.6 }}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Outcome box */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            background: '#2D0A0A', border: '1px solid #EF4444',
            borderRadius: 12, padding: '14px 16px',
            marginTop: 'auto', minHeight: 80,
          }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>⚠</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#EF4444', lineHeight: 1.5 }}>
                You never chose this agent.
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#EF4444', lineHeight: 1.5, marginTop: 6 }}>
                The platform chose for you to increase their profits — not yours.
              </div>
            </div>
          </div>
        </div>

        {/* ── Card 2: Provn ─────────────────────────────────────── */}
        <div
          className="flow-card-item"
          onMouseEnter={() => setHoveredCard(1)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            ...cardBase(1),
            background: '#0A1F12',
            border: '1px solid rgba(16,185,129,0.5)',
          }}
        >
          {/* Label pill */}
          <div style={{ marginBottom: 20 }}>
            <span style={{
              display: 'inline-block',
              background: '#0A2A1A',
              border: '1px solid rgba(16,185,129,0.4)',
              borderRadius: 20, padding: '6px 16px',
              fontSize: 11, fontWeight: 700, color: '#10B981',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              ✓ PROVN
            </span>
          </div>

          {/* Icon */}
          <div style={{ textAlign: 'center', fontSize: 48, lineHeight: 1, marginBottom: 12 }}>
            🎯
          </div>

          {/* Headline */}
          <h3 style={{
            fontSize: 20, fontWeight: 700, color: '#ffffff',
            textAlign: 'center', margin: '0 0 24px', lineHeight: 1.3,
          }}>
            You get whoever performs best
          </h3>

          {/* Steps — timeline */}
          <div style={{ position: 'relative', paddingLeft: 24 }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: 7, top: 6, bottom: 6,
              width: 1, background: '#10B981', opacity: 0.4,
            }} />
            {PROVN_STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: i < PROVN_STEPS.length - 1 ? 16 : 0 }}>
                <div style={{
                  flexShrink: 0, width: 14, height: 14,
                  borderRadius: '50%', background: '#0A2A1A',
                  border: '1px solid #10B981',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, color: '#10B981', fontWeight: 900,
                  marginTop: 2, position: 'relative', zIndex: 1,
                }}>
                  ✓
                </div>
                <span style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.6 }}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Outcome box */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            background: '#0A2A1A', border: '1px solid #10B981',
            borderRadius: 12, padding: '14px 16px',
            marginTop: 'auto', minHeight: 80,
          }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2, color: '#10B981', fontWeight: 700 }}>✓</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#10B981', lineHeight: 1.5 }}>
                You chose this agent.
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#10B981', lineHeight: 1.5, marginTop: 6 }}>
                The data helped you decide — not someone else&apos;s advertising budget.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightCards() {
  return (
    <div className="insight-cards-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 16,
      maxWidth: 1000,
      margin: '48px auto 0',
    }}>
      {INSIGHT_CARDS.map((card, i) => (
        <FadeIn key={i} delay={i * 80}>
          <div style={{
            borderTop: `3px solid ${card.borderColor}`,
            padding: '32px 20px',
            background: 'transparent',
            height: '100%',
            boxSizing: 'border-box',
          }}>
            <div style={{ fontSize: 28, marginBottom: 14, lineHeight: 1 }}>
              {card.emoji}
            </div>
            <h3 style={{
              fontSize: 15, fontWeight: 700, color: '#ffffff',
              margin: '0 0 10px', lineHeight: 1.35,
            }}>
              {card.title}
            </h3>
            <p style={{
              fontSize: 15, color: '#94A3B8',
              lineHeight: 1.8, margin: '0 0 16px',
            }}>
              {card.body}
            </p>
            <div style={{ fontSize: 14, fontWeight: 700, color: card.accentColor }}>
              {card.accent}
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

function TeaserBar() {
  const scrollToScore = () => {
    document.getElementById('provn-score-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{
      borderTop: '1px solid rgba(16,185,129,0.3)',
      borderBottom: '1px solid rgba(16,185,129,0.3)',
      background: '#0F2A1A',
      padding: '20px 24px',
      marginTop: 64,
    }}>
      <style>{`
        @keyframes arrow-nudge {
          0%, 100% { transform: translateX(0px); }
          50%       { transform: translateX(6px); }
        }
      `}</style>
      <div className="teaser-bar-inner" style={{
        maxWidth: 900, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 24,
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#ffffff', lineHeight: 1.4 }}>
          So how do you actually find the right one?
        </span>
        <button
          onClick={scrollToScore}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 15, fontWeight: 600, color: '#10B981',
            display: 'flex', alignItems: 'center', gap: 6, padding: 0,
          }}
        >
          See how Provn scores every agent
          <span style={{ display: 'inline-block', animation: 'arrow-nudge 1.2s ease-in-out infinite' }}>
            →
          </span>
        </button>
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section
      className="section-wrap"
      style={{
        background: 'linear-gradient(180deg, #080D1A 0%, #0A0F1E 60%, #080D1A 100%)',
        padding: '100px clamp(24px, 4vw, 48px)',
      }}
    >
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <FadeIn>
          <EyebrowPill text="✦ THE HIDDEN COST" />

          {/* Headline */}
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <h2 style={{
              fontSize: 'clamp(36px, 5.5vw, 60px)',
              fontWeight: 900, color: '#ffffff',
              lineHeight: 1.1, letterSpacing: '-0.02em',
              margin: 0, display: 'block',
            }}>
              The industry built a system
            </h2>
            <h2 style={{
              fontSize: 'clamp(36px, 5.5vw, 60px)',
              fontWeight: 900, lineHeight: 1.1,
              letterSpacing: '-0.02em', margin: 0,
              background: 'linear-gradient(135deg, #E63946, #F59E0B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
            }}>
              that works against you.
            </h2>
          </div>

          {/* Subtext */}
          <p style={{
            textAlign: 'center', fontSize: 18, color: '#CBD5E1',
            maxWidth: 580, margin: '20px auto 0', lineHeight: 1.7,
          }}>
            When you click &ldquo;contact agent&rdquo; on Zillow you are not reaching the agent
            who knows that home. You are reaching whoever paid Zillow for your zip code
            that month. That agent did not earn your inquiry. They bought it.
          </p>
        </FadeIn>

        {/* Impact stats */}
        <FadeIn delay={60}>
          <ImpactStats />
        </FadeIn>

        {/* Flow diagram */}
        <FadeIn delay={120}>
          <FlowDiagram />
        </FadeIn>

        {/* Insight cards */}
        <InsightCards />

        {/* Teaser bar */}
        <FadeIn delay={80}>
          <TeaserBar />
        </FadeIn>
      </div>
    </section>
  );
}



// ── Section 4: Provn Score ───────────────────────────────────────────────────

const SCORE_ROWS = [
  {
    icon: '⭐', label: 'Five Star Reviews', pct: 89,
    why: 'Volume and recency of verified reviews across every major platform — not just the ones the agent chose to show you',
    source: 'Google · Zillow · Realtor.com · Homes.com',
  },
  {
    icon: '📍', label: 'Local Market Expertise', pct: 94,
    why: 'How many neighborhoods they have sold in and how deeply — a true local specialist vs someone passing through',
    source: 'MLS transaction history by zip code',
  },
  {
    icon: '💰', label: 'Career Volume', pct: 76,
    why: 'Total sales ranked against every other active agent in the county — top 5% means they outsell 95% of agents',
    source: 'MLS career production data',
  },
  {
    icon: '🏘', label: 'Skin in the Game', pct: 92,
    why: 'Does this agent personally own real estate? An agent with no property of their own is advising you on something they have never personally risked money on',
    source: 'County assessor records · verified LLC docs',
  },
  {
    icon: '✓', label: 'Successful Outcomes', pct: 88,
    why: 'What percentage of every listing they have ever taken eventually sold — including expired listings and relists. Rewards persistence not just easy markets',
    source: 'MLS listing history including expired',
  },
  {
    icon: '🎯', label: 'Expertise Depth', pct: 95,
    why: 'Complex transactions like probate, trust sales, and 1031 exchanges score higher than standard residential — measures real skill not just volume',
    source: 'MLS transaction type designations',
  },
];

function ScoreBarsPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [counts, setCounts] = useState(SCORE_ROWS.map(() => 0));
  const [openIndex, setOpenIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [formulaOpen, setFormulaOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setTriggered(true); obs.disconnect(); }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!triggered) return;
    const rafs: number[] = [];
    SCORE_ROWS.forEach((row, i) => {
      const delay = i * 150;
      const duration = 1200;
      let t0: number | null = null;
      const tick = (now: number) => {
        if (!t0) t0 = now;
        const elapsed = now - t0 - delay;
        if (elapsed < 0) { rafs[i] = requestAnimationFrame(tick); return; }
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setCounts(prev => {
          const next = [...prev];
          next[i] = Math.round(eased * row.pct);
          return next;
        });
        if (t < 1) rafs[i] = requestAnimationFrame(tick);
      };
      rafs[i] = requestAnimationFrame(tick);
    });
    return () => rafs.forEach(r => cancelAnimationFrame(r));
  }, [triggered]);

  return (
    <div ref={ref} className="score-bars-col" style={{ flex: '11 1 340px', minWidth: 0 }}>
      {SCORE_ROWS.map((row, i) => {
        const isOpen = openIndex === i;
        const isHovered = hoveredIndex === i;
        return (
          <div key={row.label}>
            {i > 0 && <div style={{ height: 1, background: '#1E2A3A' }} />}
            <div
              className="accordion-row-inner"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              style={{
                padding: '16px 12px',
                cursor: 'pointer',
                background: isHovered ? '#0F1628' : 'transparent',
                transition: 'background 0.2s ease',
                borderRadius: 8,
                margin: '0 -12px',
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20, lineHeight: 1 }}>{row.icon}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>{row.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#10B981' }}>{counts[i]}%</span>
                  <span style={{
                    display: 'inline-block',
                    fontSize: 11,
                    color: '#4B5563',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    lineHeight: 1,
                  }}>
                    ▼
                  </span>
                </div>
              </div>

              {/* Fill bar — always visible below header */}
              <div style={{ height: 6, borderRadius: 3, background: '#1E2A3A', overflow: 'hidden', marginTop: 12 }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, #10B981, #06B6D4)',
                    width: triggered ? `${row.pct}%` : '0%',
                    transition: `width 1.2s cubic-bezier(0.4,0,0.2,1) ${i * 0.15}s`,
                  }}
                />
              </div>

              {/* Expandable: why + source */}
              <div style={{
                maxHeight: isOpen ? '220px' : '0px',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease',
              }}>
                <p style={{
                  fontSize: 15, color: '#CBD5E1',
                  lineHeight: 1.8, margin: '12px 0 4px',
                  opacity: isOpen ? 1 : 0,
                  transition: 'opacity 0.25s ease 0.05s',
                }}>
                  {row.why}
                </p>
                <div style={{ fontSize: 12, color: '#4B5563', paddingBottom: 8 }}>
                  {row.source}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Expandable formula */}
      <div style={{ marginTop: 12, borderTop: '1px solid #1E2A3A', paddingTop: 16 }}>
        <button
          onClick={() => setFormulaOpen(f => !f)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            fontSize: 13, color: '#10B981', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          How is the overall score calculated?
          <span style={{
            display: 'inline-block',
            transform: formulaOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            fontSize: 12,
          }}>
            ↓
          </span>
        </button>
        <div style={{
          maxHeight: formulaOpen ? '220px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.35s ease',
        }}>
          <p style={{
            fontSize: 13, color: '#94A3B8', maxWidth: 480,
            lineHeight: 1.7, margin: '12px 0 0',
          }}>
            Each category is weighted independently and combined into a single composite
            score from 0 to 100. Transaction performance and client outcomes carry the
            most weight. The exact formula is proprietary — agents cannot
            reverse-engineer it, which means the only way to improve a Provn score is to
            actually serve clients better. Scores update as new data becomes available.
          </p>
        </div>
      </div>

      <p style={{
        fontSize: 13,
        color: '#4B5563',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 32,
        lineHeight: 1.65,
      }}>
        Scores update automatically as new data becomes available.
        Agents are never notified in advance of score changes.
      </p>
    </div>
  );
}


// ── Inline radar chart (self-contained) ──────────────────────────────────────

const _RCX = 280;
const _RCY = 228;
const _RR  = 138;
const _RLR = 190;

const _RADAR_AXES: { label: string[]; angle: number; anchor: 'middle' | 'start' | 'end'; ldy: number }[] = [
  { label: ['Five Star', 'Reviews'],       angle: -90,  anchor: 'middle', ldy: -8 },
  { label: ['Local Market', 'Expertise'],  angle: -30,  anchor: 'start',  ldy: -6 },
  { label: ['Career', 'Volume'],           angle:  30,  anchor: 'start',  ldy:  0 },
  { label: ['Skin in', 'the Game'],        angle:  90,  anchor: 'middle', ldy: 10 },
  { label: ['Successful', 'Outcomes'],     angle: 150,  anchor: 'end',    ldy:  0 },
  { label: ['Expertise', 'Depth'],         angle: 210,  anchor: 'end',    ldy: -6 },
];

const _SARAH   = [89, 94, 76, 92, 88, 95];
const _COUNTY  = [50, 50, 50, 50, 50, 50];
const _TOP10   = [82, 88, 85, 79, 84, 91];
const _RGRID   = [0.25, 0.50, 0.75, 1.0];

function _rxy(angleDeg: number, dist: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: _RCX + dist * Math.cos(a), y: _RCY + dist * Math.sin(a) };
}

function _rpts(vals: number[]): string {
  return _RADAR_AXES.map((ax, i) => {
    const p = _rxy(ax.angle, (vals[i] / 100) * _RR);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(' ');
}

function RadarChartPanel() {
  const [mode, setMode] = useState<'county' | 'top10'>('county');
  const benchRef = useRef<number[]>([..._COUNTY]);
  const [benchDisplay, setBenchDisplay] = useState<number[]>([..._COUNTY]);
  const rafRef = useRef<number>(0);

  const animateTo = useCallback((target: number[]) => {
    cancelAnimationFrame(rafRef.current);
    const from = [...benchRef.current];
    const t0 = performance.now();
    const dur = 600;
    const tick = (now: number) => {
      const t = Math.min((now - t0) / dur, 1);
      const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const vals = from.map((f, i) => f + (target[i] - f) * e);
      benchRef.current = vals;
      setBenchDisplay([...vals]);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    animateTo(mode === 'county' ? _COUNTY : _TOP10);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mode, animateTo]);

  const agentPts = _rpts(_SARAH);
  const benchPts = _rpts(benchDisplay);
  const benchColor = mode === 'county' ? '#4B5563' : '#F59E0B';
  const benchLabel = mode === 'county' ? 'Sonoma County Avg' : 'Top 10%';

  return (
    <div className="radar-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '9 1 280px', minWidth: 0 }}>
      {/* Section label */}
      <div style={{
        fontSize: 13, color: '#4B5563', textTransform: 'uppercase',
        letterSpacing: '0.08em', marginBottom: 24,
      }}>
        SAMPLE PROVN STRENGTH PROFILE
      </div>

      {/* Chart card */}
      <div style={{
        background: '#1A1D2E',
        border: '1px solid #2D3148',
        borderRadius: 16,
        padding: '20px 20px 12px',
        width: '100%',
        boxShadow: '0 0 40px rgba(16,185,129,0.12)',
        boxSizing: 'border-box',
      }}>
        {/* Toggle */}
        <div className="radar-toggle-wrap" style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <div style={{
            display: 'flex', gap: 4, padding: 4,
            background: 'rgba(255,255,255,0.06)', borderRadius: 10,
          }}>
            {(['county', 'top10'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: '6px 14px', borderRadius: 7, border: 'none',
                  cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  background: mode === m ? '#10B981' : 'transparent',
                  color: mode === m ? '#ffffff' : 'rgba(255,255,255,0.38)',
                  transition: 'all 0.15s ease',
                }}
              >
                {m === 'county' ? 'vs County Average' : 'vs Top 10%'}
              </button>
            ))}
          </div>
        </div>

        {/* SVG radar */}
        <svg viewBox="0 0 560 470" style={{ width: '100%', display: 'block' }} aria-label="Strength profile radar chart for Sarah Chen">
          <rect width="560" height="470" fill="#1A1D2E" />

          {/* Grid hexagons */}
          {_RGRID.map(level => (
            <polygon
              key={level}
              points={_rpts(_RADAR_AXES.map(() => level * 100))}
              fill="none"
              stroke={level === 1.0 ? 'rgba(255,255,255,0.11)' : 'rgba(255,255,255,0.05)'}
              strokeWidth={level === 1.0 ? 1.2 : 0.8}
            />
          ))}

          {/* Grid level numbers on top axis */}
          {_RGRID.slice(0, -1).map(level => {
            const p = _rxy(-90, level * _RR);
            return (
              <text key={level} x={p.x + 5} y={p.y + 3.5} fontSize="7.5" fill="rgba(255,255,255,0.16)" fontWeight="700">
                {Math.round(level * 100)}
              </text>
            );
          })}

          {/* Axis spokes */}
          {_RADAR_AXES.map((ax, i) => {
            const tip = _rxy(ax.angle, _RR);
            return (
              <line key={i} x1={_RCX} y1={_RCY}
                x2={tip.x.toFixed(1)} y2={tip.y.toFixed(1)}
                stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            );
          })}

          {/* Benchmark polygon */}
          <polygon
            points={benchPts}
            fill={mode === 'county' ? 'rgba(255,255,255,0.06)' : 'rgba(251,191,36,0.08)'}
            stroke={benchColor}
            strokeWidth="1.5"
            strokeDasharray="4 3"
            strokeLinejoin="round"
          />

          {/* Agent polygon */}
          <polygon
            points={agentPts}
            fill="rgba(16,185,129,0.14)"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Agent score dots */}
          {_RADAR_AXES.map((ax, i) => {
            const score = _SARAH[i];
            const pt = _rxy(ax.angle, (score / 100) * _RR);
            return (
              <g key={i}>
                <circle cx={pt.x.toFixed(1)} cy={pt.y.toFixed(1)} r="19" fill="rgba(16,185,129,0.12)" />
                <circle cx={pt.x.toFixed(1)} cy={pt.y.toFixed(1)} r="14" fill="#0d1117" stroke="#10B981" strokeWidth="2" />
                <text x={pt.x.toFixed(1)} y={(pt.y + 4.5).toFixed(1)}
                  textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#10B981">
                  {score}
                </text>
              </g>
            );
          })}

          {/* Center dot */}
          <circle cx={_RCX} cy={_RCY} r="3" fill="rgba(255,255,255,0.15)" />

          {/* Axis labels */}
          {_RADAR_AXES.map((ax, i) => {
            const lp = _rxy(ax.angle, _RLR);
            const lh = 13.5;
            const by = lp.y + ax.ldy - ((ax.label.length - 1) * lh) / 2;
            return (
              <g key={i}>
                {ax.label.map((line, j) => (
                  <text
                    key={j}
                    x={lp.x.toFixed(1)}
                    y={(by + j * lh).toFixed(1)}
                    textAnchor={ax.anchor}
                    fontSize="10.5"
                    fontWeight="700"
                    fill="rgba(255,255,255,0.72)"
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          {/* Legend */}
          <g transform="translate(14,452)">
            <rect x="0" y="-5.5" width="9" height="9" rx="1.5" fill="#10B981" opacity="0.75" />
            <text x="13" y="3" fontSize="9.5" fill="rgba(255,255,255,0.42)" fontWeight="700">
              Sarah Chen
            </text>
            <rect x="82" y="-5.5" width="9" height="9" rx="1.5" fill={benchColor} opacity="0.75" />
            <text x="95" y="3" fontSize="9.5" fill="rgba(255,255,255,0.42)" fontWeight="700">
              {benchLabel}
            </text>
          </g>
        </svg>
      </div>

      {/* Verified data callout */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 14,
        background: '#0F1628', border: '1px solid #1E2A3A', borderRadius: 10,
        padding: '12px 16px', width: '100%', boxSizing: 'border-box',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
          <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" fill="#10B981" opacity="0.2" />
          <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" stroke="#10B981" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 15, color: '#CBD5E1', lineHeight: 1.65 }}>
          Every axis on this chart is calculated from verified public data. Sarah Chen cannot edit any of it.
        </span>
      </div>

      {/* CTA button */}
      <a
        href="/agents/sarah-chen-001"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block', marginTop: 18,
          background: '#10B981', color: '#ffffff',
          fontSize: 16, fontWeight: 700,
          padding: '14px 28px', borderRadius: 8,
          textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
        }}
      >
        See a full agent profile →
      </a>
    </div>
  );
}

function ScoreSection() {
  return (
    <section
      id="provn-score-section"
      className="section-wrap"
      style={{
        background: '#0D1520',
        padding: '100px clamp(24px, 4vw, 48px)',
        borderTop: '1px solid #1E2A3A',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <FadeIn>
          <EyebrowPill text="✦ THE PROVN SCORE" />
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <h2
              style={{
                fontSize: 'clamp(40px, 6vw, 64px)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                margin: 0,
                background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline',
              }}
            >
              Every agent has a score.
            </h2>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span
              style={{
                fontSize: 'clamp(24px, 3.5vw, 38px)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Most of them would rather you never saw it.
            </span>
          </div>
          <p
            style={{
              textAlign: 'center',
              fontSize: 19,
              color: '#94A3B8',
              maxWidth: 600,
              margin: '0 auto 72px',
              lineHeight: 1.75,
            }}
          >
            The Provn Score is built from six independent verified data sources. No surveys.
            No self-reporting. No advertising influence. The only way to improve it is to
            actually serve clients better.
          </p>
        </FadeIn>

        {/* Two-column layout */}
        <div
          className="score-two-col"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 48,
            alignItems: 'center',
          }}
        >
          {/* LEFT — Score bars */}
          <ScoreBarsPanel />

          {/* RIGHT — Radar chart */}
          <FadeIn delay={120}>
            <RadarChartPanel />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}




// ── Section 5: Consumer personas ─────────────────────────────────────────────

const PERSONAS = [
  {
    emoji: '🔑',
    gradFrom: '#10B981', gradTo: '#06B6D4',
    label: 'FIRST-TIME BUYER',
    priceLoc: '$550K–$700K · Petaluma',
    situation: 'Never bought before. Nervous about offers, inspections, and making a mistake.',
    needs: 'Patient educator with strong lender network and first-time buyer experience',
    match: 'Matched to 8 agents on Provn',
  },
  {
    emoji: '⬆️',
    gradFrom: '#F59E0B', gradTo: '#EF4444',
    label: 'MOVE-UP SELLER',
    priceLoc: 'Selling $900K · Buying $1.4M · Windsor',
    situation: 'Needs to sell before buying. Two transactions to coordinate simultaneously.',
    needs: 'Tactical coordinator with contingent sale experience and calm under pressure',
    match: 'Matched to 5 agents on Provn',
  },
  {
    emoji: '💎',
    gradFrom: '#8B5CF6', gradTo: '#06B6D4',
    label: 'LUXURY BUYER',
    priceLoc: '$2.1M+ · Healdsburg',
    situation: 'Wants vineyard or estate property. Needs off-market access and discretion.',
    needs: 'Off-market specialist with $50M+ luxury volume and vineyard transaction experience',
    match: 'Matched to 3 agents on Provn',
  },
  {
    emoji: '🏘',
    gradFrom: '#10B981', gradTo: '#8B5CF6',
    label: 'INVESTMENT BUYER',
    priceLoc: '$800K–$1.2M · Multifamily',
    situation: 'Looking for rental income property. Needs to analyze cash flow and cap rates.',
    needs: 'Investor-minded agent who owns investment property and understands NOI',
    match: 'Matched to 6 agents on Provn',
  },
  {
    emoji: '📋',
    gradFrom: '#EF4444', gradTo: '#F59E0B',
    label: 'TRUST SALE SELLER',
    priceLoc: 'Estate property · Santa Rosa',
    situation: 'Managing a parent estate. Needs speed, sensitivity, and probate knowledge.',
    needs: 'Probate and trust sale specialist with documented estate transaction experience',
    match: 'Matched to 4 agents on Provn',
  },
  {
    emoji: '🌱',
    gradFrom: '#06B6D4', gradTo: '#10B981',
    label: 'DOWNSIZER',
    priceLoc: 'Selling $1.3M · Buying $750K · Sonoma',
    situation: '30 years in the family home. Emotional transaction that needs patience.',
    needs: 'High-EQ agent with downsizer experience who understands this is not just financial',
    match: 'Matched to 7 agents on Provn',
  },
];

function PersonaCard({ p }: { p: typeof PERSONAS[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#0F1628',
        border: `1px solid ${hovered ? 'rgba(16,185,129,0.5)' : '#1E2A3A'}`,
        borderRadius: 16,
        padding: 24,
        position: 'relative',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      {/* Ping dot top-right */}
      <div style={{ position: 'absolute', top: 16, right: 16 }}>
        <div style={{ position: 'relative', width: 8, height: 8 }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: '#10B981', animation: 'dot-ping 2s ease-out infinite',
          }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
        </div>
      </div>

      {/* Emoji avatar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: `linear-gradient(135deg, ${p.gradFrom}, ${p.gradTo})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26,
        }}>
          {p.emoji}
        </div>
      </div>

      {/* Label pill */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <span style={{
          background: `linear-gradient(135deg, ${p.gradFrom}22, ${p.gradTo}22)`,
          border: `1px solid ${p.gradFrom}55`,
          borderRadius: 20, padding: '4px 12px',
          fontSize: 10, fontWeight: 700, color: p.gradFrom,
          letterSpacing: '0.06em',
        }}>
          {p.label}
        </span>
      </div>

      {/* Price / location */}
      <div style={{ textAlign: 'center', fontSize: 13, color: '#94A3B8', marginBottom: 10 }}>
        {p.priceLoc}
      </div>

      {/* Situation */}
      <p style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.6, margin: '0 0 14px', textAlign: 'center' }}>
        {p.situation}
      </p>

      {/* Divider */}
      <div style={{ height: 1, background: '#1E2A3A', marginBottom: 14 }} />

      {/* Needs label */}
      <div style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
        Needs from agent
      </div>

      {/* Agent requirement */}
      <p style={{ fontSize: 13, color: '#ffffff', fontWeight: 500, lineHeight: 1.5, margin: '0 0 14px' }}>
        {p.needs}
      </p>

      {/* Match stat */}
      <div style={{ marginTop: 'auto', paddingTop: 4, fontSize: 12, color: '#10B981', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>✓</span>
        <span>{p.match}</span>
      </div>
    </div>
  );
}

function EducationSection() {
  return (
    <section
      className="section-wrap"
      style={{
        background: '#080D1A',
        padding: '100px clamp(24px, 4vw, 48px)',
        borderTop: '1px solid #1E2A3A',
        borderBottom: '1px solid #1E2A3A',
      }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Header */}
        <FadeIn>
          <EyebrowPill text="✦ YOUR SITUATION IS UNIQUE" />

          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: 0,
              display: 'block',
            }}>
              Every buyer and seller is different.
            </h2>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: 0,
              background: 'linear-gradient(135deg, #10B981, #06B6D4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
            }}>
              The industry ignores this.
            </h2>
          </div>

          <p style={{
            textAlign: 'center',
            fontSize: 17,
            color: '#94A3B8',
            maxWidth: 560,
            margin: '20px auto 64px',
            lineHeight: 1.75,
          }}>
            A first-time buyer, a move-up seller, and a luxury investor all need completely
            different skills from their agent. Star ratings do not tell you which agent has
            them. Provn does.
          </p>
        </FadeIn>

        {/* Persona grid */}
        <FadeIn delay={80}>
          <div className="persona-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {PERSONAS.map((p) => (
              <PersonaCard key={p.label} p={p} />
            ))}
          </div>
        </FadeIn>

        {/* Closing statement */}
        <FadeIn delay={160}>
          <div style={{ textAlign: 'center', marginTop: 60 }}>
            <p style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 4px',
            }}>
              Provn does not give you the most popular agent.
            </p>
            <p style={{
              fontSize: 20,
              fontWeight: 700,
              margin: '0 0 32px',
              background: 'linear-gradient(135deg, #10B981, #06B6D4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block',
            }}>
              It gives you the right one for your situation.
            </p>
            <div>
              <Link
                href="/match/buyer"
                style={{
                  display: 'inline-block',
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
                Tell us your situation →
              </Link>
            </div>
          </div>
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
      className="section-wrap"
      style={{
        background: '#080D1A',
        padding: '100px clamp(24px, 4vw, 48px)',
        borderTop: '1px solid #1E2A3A',
      }}
    >
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <FadeIn>
          <EyebrowPill text="✦ FIND YOUR AGENT" />
          <h2
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 900,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
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
          className="cta-cards-row"
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
                className="cta-card-item"
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
          className="footer-main-row"
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
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '6px' }}>
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
                }}
              >
                Provn
              </span>
            </Link>
            <div style={{ fontSize: '13px', color: C_SEC }}>Know before you hire.</div>
          </div>

          {/* Nav links */}
          <div
            className="footer-nav-links"
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
      <style>{`
        @media (max-width: 768px) {
          /* Navigation */
          .nav-desktop-links { display: none !important; }
          .nav-inner { height: 56px !important; }

          /* Section padding */
          .section-wrap { padding-top: 48px !important; padding-bottom: 48px !important; padding-left: 20px !important; padding-right: 20px !important; }

          /* Hero stats pills — stack vertically */
          .hero-stats-row { flex-direction: column !important; align-items: stretch !important; }
          .hero-stat-pill { max-width: 100% !important; }

          /* Card flip section — always visible */
          .card-flip-section { overflow: visible !important; height: auto !important; }

          /* Card flip container — column stack on mobile */
          .flip-cards-row { flex-direction: column !important; align-items: center !important; gap: 20px !important; }

          /* Impact stats — stack vertically */
          .impact-stats-row { flex-direction: column !important; align-items: center !important; }
          .impact-stat-pill { flex: none !important; width: 100% !important; max-width: 100% !important; min-height: auto !important; }

          /* Flow comparison cards — stack vertically */
          .flow-cards-row { flex-direction: column !important; }
          .flow-card-item { width: 100% !important; min-height: auto !important; }

          /* Insight cards — single column */
          .insight-cards-grid { grid-template-columns: 1fr !important; }

          /* Teaser bar — stack vertically */
          .teaser-bar-inner { flex-direction: column !important; text-align: center !important; gap: 12px !important; }

          /* Score section — stack vertically */
          .score-two-col { flex-direction: column !important; }
          .score-bars-col { flex: none !important; width: 100% !important; min-width: 0 !important; }
          .radar-col { flex: none !important; width: 100% !important; min-width: 0 !important; max-width: 340px !important; margin: 0 auto !important; }

          /* Accordion rows — larger tap targets */
          .accordion-row-inner { padding-top: 20px !important; padding-bottom: 20px !important; }

          /* Radar chart toggle */
          .radar-toggle-wrap button { min-height: 44px !important; }

          /* Persona grid — 1 column */
          .persona-grid { grid-template-columns: 1fr !important; }

          /* CTA section cards — stack */
          .cta-cards-row { flex-direction: column !important; }
          .cta-card-item { width: 100% !important; }

          /* Decorative PROVN text — hide */
          .cta-deco-text { display: none !important; }

          /* Footer — stack */
          .footer-main-row { flex-direction: column !important; align-items: center !important; text-align: center !important; }
          .footer-nav-links { justify-content: center !important; }
        }

        @media (min-width: 480px) and (max-width: 768px) {
          /* Persona grid — 2 columns on medium mobile */
          .persona-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
      <ReadingProgressBar />
      <Nav />
      <CardFlipSection />
      <ProblemSection />
      <ScoreSection />
      <EducationSection />
      <CTASection />
      <Footer />
    </div>
  );
}
