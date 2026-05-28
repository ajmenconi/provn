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

// ── Section 1: Hero ───────────────────────────────────────────────────────────

// ── Count-up hook ─────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1800): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setCount(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setCount(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return count;
}

// ── Particle canvas ───────────────────────────────────────────────────────────

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const SPEED = 0.3;
    type Dot = { x: number; y: number; vx: number; vy: number };
    const dots: Dot[] = Array.from({ length: 80 }, () => {
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: Math.cos(angle) * SPEED,
        vy: Math.sin(angle) * SPEED,
      };
    });

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(16,185,129,0.15)';
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > W) { d.vx = -d.vx; d.x = Math.max(0, Math.min(W, d.x)); }
        if (d.y < 0 || d.y > H) { d.vy = -d.vy; d.y = Math.max(0, Math.min(H, d.y)); }
        ctx.beginPath();
        ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

// ── Stat pill ─────────────────────────────────────────────────────────────────

function StatPill({
  value,
  displayFn,
  label,
  color,
}: {
  value: number;
  displayFn: (n: number) => string;
  label: string;
  color: string;
}) {
  const count = useCountUp(value);
  return (
    <div
      style={{
        background: '#0F1628',
        border: '1px solid #1E2A3A',
        borderRadius: 12,
        padding: '12px 20px',
        textAlign: 'center',
        minWidth: 160,
        flex: '0 0 auto',
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>
        {displayFn(count)}
      </div>
      <div style={{ fontSize: 11, color: C_SEC, marginTop: 6, lineHeight: 1.4 }}>
        {label}
      </div>
    </div>
  );
}


// ── Section 1: Hero ───────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      style={{
        minHeight: '100vh',
        background: '#080D1A',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 'clamp(80px, 10vh, 120px) clamp(24px, 4vw, 48px) 60px',
      }}
    >
      {/* Particle field */}
      <ParticleCanvas />

      {/* Atmospheric green glow blob */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'rgba(16,185,129,0.06)',
          filter: 'blur(120px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* All content sits above canvas + blob */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 800,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Eyebrow badge */}
        <div style={{ marginBottom: 32 }}>
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
            ✦ Real estate&rsquo;s best kept secret
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(56px, 9vw, 120px)',
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            margin: 0,
          }}
        >
          <span style={{ display: 'block', color: '#ffffff' }}>
            They made the house
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
            transparent.
          </span>
        </h1>

        {/* Sub-headline */}
        <p
          style={{
            fontSize: 'clamp(18px, 2.5vw, 22px)',
            fontWeight: 400,
            color: '#94A3B8',
            marginTop: 24,
            maxWidth: 580,
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6,
          }}
        >
          We made the agent transparent.
        </p>

        {/* Divider */}
        <div
          aria-hidden
          style={{
            width: 120,
            height: 1,
            background: 'linear-gradient(90deg, transparent, #10B981, transparent)',
            margin: '32px auto',
          }}
        />

        {/* Body copy */}
        <p
          style={{
            fontSize: 18,
            color: '#CBD5E1',
            maxWidth: 560,
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.8,
          }}
        >
          Zillow built the most powerful property database in history. Then they
          hid the one thing that actually determines your outcome.
        </p>

        <p style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', marginTop: 20 }}>
          Every data point that exposes a bad agent exists in public records.
        </p>

        <p
          style={{
            fontSize: 20,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #E63946, #F59E0B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'block',
            margin: 0,
          }}
        >
          They chose not to show it.
        </p>

        <p style={{ fontSize: 20, fontWeight: 600, color: '#10B981', marginTop: 4 }}>
          Provn was built on the other side of that wall.
        </p>

        {/* Stat pills */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 16,
            flexWrap: 'wrap',
            marginTop: 40,
          }}
        >
          <StatPill
            value={5000}
            displayFn={(n) => `${n.toLocaleString()}+`}
            label="Licensed agents in Sonoma County"
            color="#ffffff"
          />
          <StatPill
            value={1}
            displayFn={(n) => String(n)}
            label="Agent most buyers interview"
            color="#E63946"
          />
          <StatPill
            value={60}
            displayFn={(n) => `$${n}K`}
            label="Avg cost of the wrong hire"
            color="#F59E0B"
          />
        </div>

        {/* Chevron */}
        <div style={{ marginTop: 48 }}>
          <ChevronDown color="#10B981" />
        </div>
      </div>
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
      <HeroSection />
      <ProblemSection />
      <ProvnDiffSection />
      <ScoreSection />
      <EducationSection />
      <CTASection />
      <Footer />
    </div>
  );
}
