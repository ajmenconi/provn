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
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={className} style={{ opacity: 1, transform: 'none' }}>
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

function CardFlipSection() {
  return (
    <div style={{ paddingTop: 0, marginTop: 0 }} dangerouslySetInnerHTML={{ __html: `
<style>
.fc-wrap{background:#080D1A;padding:60px 20px 40px 20px;text-align:center}
.fc-pill{display:inline-block;background:#0F1628;border:1px solid #10B981;border-radius:20px;padding:6px 16px;font-size:11px;color:#94A3B8;letter-spacing:0.1em;margin-top:0;margin-bottom:32px}
.fc-h1{font-size:clamp(28px,6vw,56px);font-weight:900;color:#fff;line-height:1.1;margin:0 0 8px;letter-spacing:-0.02em}
.fc-h2{font-size:clamp(24px,5vw,48px);font-weight:900;background:linear-gradient(135deg,#10B981,#06B6D4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin:0 0 20px}
.fc-sub{font-size:16px;color:#94A3B8;max-width:560px;margin:0 auto 12px;line-height:1.7}
.fc-tap{font-size:14px;color:#10B981;margin-bottom:16px}
.fc-dots{display:flex;gap:8px;justify-content:center;margin-bottom:24px}
.fc-dot{width:10px;height:10px;border-radius:50%;border:2px solid #4B5563;transition:all 0.3s}
.fc-dot.on{background:#10B981;border-color:#10B981}
.fc-col{display:flex;flex-direction:column;align-items:center;gap:20px}
.fc-card{width:calc(100vw - 48px);max-width:300px;min-height:400px;position:relative;border-radius:16px;overflow:hidden;-webkit-tap-highlight-color:transparent}
.fc-face{position:absolute;inset:0;padding:24px 18px;display:flex;flex-direction:column;align-items:center;transition:opacity 0.3s ease;border-radius:16px;overflow:hidden}
.fc-front{opacity:1}
.fc-back{opacity:0;pointer-events:none}
.fc-card.on .fc-front{opacity:0;pointer-events:none}
.fc-card.on .fc-back{opacity:1;pointer-events:auto}
.fc-img{width:76px;height:76px;border-radius:50%;object-fit:cover;object-position:center top;display:block;margin:0 auto 10px;background:#1E2A3A}
.fc-name{font-size:16px;font-weight:700;color:#fff;text-align:center;margin-bottom:2px}
.fc-role{font-size:11px;font-weight:700;letter-spacing:0.08em;text-align:center;margin-bottom:3px}
.fc-brok{font-size:12px;color:#94A3B8;text-align:center;margin-bottom:12px}
.fc-div{width:100%;height:1px;background:#2D3148;margin-bottom:12px}
.fc-stars{font-size:18px;color:#F59E0B;letter-spacing:2px;margin-bottom:4px}
.fc-rev{font-size:12px;color:#94A3B8;margin-bottom:14px}
.fc-blur{width:100%;height:26px;background:#1E2330;border-radius:6px;margin-bottom:7px;filter:blur(3px);opacity:0.6}
.fc-hint{font-size:11px;color:#4B5563;font-style:italic;margin-top:8px}
.fc-ring{width:70px;height:70px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 12px;border-width:3px;border-style:solid;flex-shrink:0}
.fc-grade{font-size:22px;font-weight:900;line-height:1}
.fc-score{font-size:10px;color:#94A3B8}
.fc-stat{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #1E2A3A;width:100%}
.fc-slabel{font-size:11px;color:#94A3B8}
.fc-sval{font-size:11px;font-weight:600;text-align:right;max-width:55%}
.fc-out{width:100%;border-radius:8px;padding:9px 12px;margin-top:10px;text-align:center;border-width:1px;border-style:solid}
.fc-otext{font-size:11px;font-weight:600;line-height:1.4}
.fc-reveal{display:none;padding:32px 20px;text-align:center}
.fc-reveal.on{display:block}
.fc-rtitle{font-size:24px;font-weight:900;color:#fff;margin-bottom:8px}
.fc-rsub{font-size:15px;color:#94A3B8;line-height:1.7;max-width:500px;margin:0 auto 24px}
.fc-rgreen{color:#10B981;font-weight:700}
.fc-btn{display:inline-block;background:#10B981;color:#fff;font-size:16px;font-weight:700;padding:14px 36px;border-radius:10px;text-decoration:none;border:none;cursor:pointer}
@media(min-width:768px){
  .fc-col{flex-direction:row;justify-content:center;align-items:stretch}
  .fc-card{width:280px;max-width:280px}
}
</style>

<div class="fc-wrap">
  <div class="fc-pill">&#10022; CAN YOU TELL THEM APART?</div>
  <h2 class="fc-h1">One of these agents will make you $75,000.</h2>
  <p class="fc-h2">Two will cost you $75,000.</p>
  <p class="fc-sub">They all have five stars. They all call themselves specialists. Without Provn you have no way to know if that is true.</p>
  <p class="fc-tap">Tap each card to see what Provn reveals. &#x1F447;</p>
  <div class="fc-dots">
    <div class="fc-dot" id="d0"></div>
    <div class="fc-dot" id="d1"></div>
    <div class="fc-dot" id="d2"></div>
  </div>

  <div class="fc-col">

    <div class="fc-card" id="fc0" style="border:2px solid #F59E0B;background:#1A1200" ontouchstart="" onclick="fcFlip(0)">
      <div class="fc-face fc-front">
        <div style="border:3px solid #F59E0B;border-radius:50%;width:76px;height:76px;overflow:hidden;flex-shrink:0;margin:0 auto 10px">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&amp;h=160&amp;fit=crop&amp;crop=face" width="76" height="76" style="display:block;border-radius:50%;object-fit:cover" alt="Tara Reynolds">
        </div>
        <div class="fc-name">Tara Reynolds</div>
        <div class="fc-role" style="color:#F59E0B">REALTOR · 11 YEARS</div>
        <div class="fc-brok">Keller Williams · Petaluma</div>
        <div class="fc-div"></div>
        <div class="fc-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <div class="fc-rev">4.9 stars · 34 reviews</div>
        <div class="fc-blur"></div><div class="fc-blur"></div><div class="fc-blur"></div>
        <div class="fc-hint">Tap to reveal · tap again to compare</div>
      </div>
      <div class="fc-face fc-back">
        <div class="fc-name" style="margin-bottom:2px">Tara Reynolds</div>
        <div class="fc-brok" style="margin-bottom:12px">Keller Williams · Petaluma</div>
        <div class="fc-ring" style="border-color:#F59E0B">
          <div class="fc-grade" style="color:#F59E0B">C+</div>
          <div class="fc-score">58/100</div>
        </div>
        <div class="fc-stat"><span class="fc-slabel">Licensed</span><span class="fc-sval" style="color:#CBD5E1">11 years</span></div>
        <div class="fc-stat"><span class="fc-slabel">Career transactions</span><span class="fc-sval" style="color:#CBD5E1">94 total</span></div>
        <div class="fc-stat"><span class="fc-slabel">Last sale</span><span class="fc-sval" style="color:#F59E0B">4 months ago</span></div>
        <div class="fc-stat"><span class="fc-slabel">Price reductions</span><span class="fc-sval" style="color:#F59E0B">4 of last 10</span></div>
        <div class="fc-stat"><span class="fc-slabel">Property owned</span><span class="fc-sval" style="color:#F59E0B">1 — primary only</span></div>
        <div class="fc-out" style="background:#1A1200;border-color:#F59E0B">
          <div class="fc-otext" style="color:#F59E0B">&#9888; Inconsistent activity — not aligned with your price range</div>
        </div>
      </div>
    </div>

    <div class="fc-card" id="fc1" style="border:2px solid #EF4444;background:#1A0D0D" ontouchstart="" onclick="fcFlip(1)">
      <div class="fc-face fc-front">
        <div style="border:3px solid #EF4444;border-radius:50%;width:76px;height:76px;overflow:hidden;flex-shrink:0;margin:0 auto 10px">
          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&amp;h=160&amp;fit=crop&amp;crop=face" width="76" height="76" style="display:block;border-radius:50%;object-fit:cover" alt="James Miller">
        </div>
        <div class="fc-name">James Miller</div>
        <div class="fc-role" style="color:#EF4444">REALTOR · 2 YEARS</div>
        <div class="fc-brok">Century 21 · Santa Rosa</div>
        <div class="fc-div"></div>
        <div class="fc-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <div class="fc-rev">4.8 stars · 11 reviews</div>
        <div class="fc-blur"></div><div class="fc-blur"></div><div class="fc-blur"></div>
        <div class="fc-hint">Tap to reveal · tap again to compare</div>
      </div>
      <div class="fc-face fc-back">
        <div class="fc-name" style="margin-bottom:2px">James Miller</div>
        <div class="fc-brok" style="margin-bottom:12px">Century 21 · Santa Rosa</div>
        <div class="fc-ring" style="border-color:#EF4444">
          <div class="fc-grade" style="color:#EF4444">C</div>
          <div class="fc-score">41/100</div>
        </div>
        <div class="fc-stat"><span class="fc-slabel">Licensed</span><span class="fc-sval" style="color:#EF4444">2 years</span></div>
        <div class="fc-stat"><span class="fc-slabel">Career transactions</span><span class="fc-sval" style="color:#EF4444">8 total</span></div>
        <div class="fc-stat"><span class="fc-slabel">Last sale</span><span class="fc-sval" style="color:#EF4444">9 months ago</span></div>
        <div class="fc-stat"><span class="fc-slabel">Price reductions</span><span class="fc-sval" style="color:#EF4444">6 of last 8</span></div>
        <div class="fc-stat"><span class="fc-slabel">Property owned</span><span class="fc-sval" style="color:#EF4444">None verified</span></div>
        <div class="fc-out" style="background:#1A0D0D;border-color:#EF4444">
          <div class="fc-otext" style="color:#EF4444">&#9888; High risk — limited experience in current market</div>
        </div>
      </div>
    </div>

    <div class="fc-card" id="fc2" style="border:2px solid #10B981;background:#0A1F12" ontouchstart="" onclick="fcFlip(2)">
      <div class="fc-face fc-front">
        <div style="border:3px solid #10B981;border-radius:50%;width:76px;height:76px;overflow:hidden;flex-shrink:0;margin:0 auto 10px">
          <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&amp;h=160&amp;fit=crop&amp;crop=face" width="76" height="76" style="display:block;border-radius:50%;object-fit:cover" alt="Sarah Chen">
        </div>
        <div class="fc-name">Sarah Chen</div>
        <div class="fc-role" style="color:#10B981">BROKER · 19 YEARS</div>
        <div class="fc-brok">Compass · Healdsburg</div>
        <div class="fc-div"></div>
        <div class="fc-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <div class="fc-rev">4.9 stars · 147 reviews</div>
        <div class="fc-blur"></div><div class="fc-blur"></div><div class="fc-blur"></div>
        <div class="fc-hint">Tap to reveal · tap again to compare</div>
      </div>
      <div class="fc-face fc-back">
        <div class="fc-name" style="margin-bottom:2px">Sarah Chen</div>
        <div class="fc-brok" style="margin-bottom:12px">Compass · Healdsburg</div>
        <div class="fc-ring" style="border-color:#10B981">
          <div class="fc-grade" style="color:#10B981">A+</div>
          <div class="fc-score">94/100</div>
        </div>
        <div class="fc-stat"><span class="fc-slabel">Licensed</span><span class="fc-sval" style="color:#10B981">19 years</span></div>
        <div class="fc-stat"><span class="fc-slabel">Career transactions</span><span class="fc-sval" style="color:#10B981">312 total</span></div>
        <div class="fc-stat"><span class="fc-slabel">Last sale</span><span class="fc-sval" style="color:#10B981">3 weeks ago</span></div>
        <div class="fc-stat"><span class="fc-slabel">Price reductions</span><span class="fc-sval" style="color:#10B981">1 of last 10</span></div>
        <div class="fc-stat"><span class="fc-slabel">Property owned</span><span class="fc-sval" style="color:#10B981">4 · $2.1M portfolio</span></div>
        <div class="fc-out" style="background:#0A1F12;border-color:#10B981">
          <div class="fc-otext" style="color:#10B981">&#10003; Top 5% Sonoma County · Active · Verified owner</div>
        </div>
      </div>
    </div>

  </div>

  <div class="fc-reveal" id="fcReveal">
    <div class="fc-rtitle">The reviews told you almost nothing.</div>
    <div class="fc-rsub">The data tells you <span class="fc-rgreen">everything.</span><br><br>James and Tara have good reviews. So does Sarah. The difference is $125,000 in potential outcome — and it was invisible until now. Every market has the same three agents. Provn shows you which is which.</div>
    <button class="fc-btn" onclick="window.location.href='/match/buyer'">Find your Provn agent</button>
  </div>
</div>

<script>
var fcF=[false,false,false];
var fcDone=false;
function fcFlip(i){
  fcF[i]=!fcF[i];
  var c=document.getElementById('fc'+i);
  var d=document.getElementById('d'+i);
  if(fcF[i]){c.classList.add('on');d.classList.add('on');}
  else{c.classList.remove('on');d.classList.remove('on');}
  if(!fcDone&&fcF[0]&&fcF[1]&&fcF[2]){
    fcDone=true;
    document.getElementById('fcReveal').classList.add('on');
  }
}
</script>
` }} />
  );
}



// ── Section 2: The problem nobody talks about ────────────────────────────────

const IMPACT_STATS = [
  { display: '$500', color: '#E63946', label: 'Average cost per lead agents pay Zillow just to call you back' },
  { display: '0',    color: '#F59E0B', label: "Zillow's accountability when that agent underperforms for you" },
  { display: '$75K', color: '#10B981', label: 'Potential difference between the right agent and the wrong one' },
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
  return (
    <div className="impact-stats-row" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 48 }}>
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
            {stat.display}
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
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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
    opacity: 1,
    transform: hoveredCard === i ? 'translateY(-4px)' : 'none',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
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


function ScoreSection() {
const radarHTML = `
<style>
.rc-wrap{display:flex;flex-direction:column;gap:16px}
.rc-label{font-size:12px;color:#4B5563;text-transform:uppercase;letter-spacing:0.08em;text-align:center;margin-bottom:4px}
.rc-card{background:#0F1628;border:1px solid #1E2A3A;border-radius:16px;padding:20px}
.rc-toggle{display:flex;gap:4px;background:#0A0A0A;border-radius:10px;padding:4px;margin-bottom:16px}
.rc-tbtn{flex:1;padding:10px 8px;border-radius:7px;border:none;cursor:pointer;font-size:12px;font-weight:700;color:rgba(255,255,255,0.4);background:transparent;-webkit-tap-highlight-color:transparent;min-height:44px;transition:all 0.2s}
.rc-tbtn.active{background:#10B981;color:#fff}
.rc-svg{width:100%;height:auto;display:block;overflow:visible}
.rc-legend{display:flex;gap:16px;justify-content:center;margin-top:12px}
.rc-li{display:flex;align-items:center;gap:6px;font-size:11px;color:#94A3B8}
.rc-lmark{width:16px;height:2px;display:inline-block}
.rc-verify{background:#0F1628;border:1px solid #1E2A3A;border-radius:12px;padding:14px 16px;display:flex;gap:12px;align-items:flex-start;margin-top:4px}
.rc-vtext{font-size:13px;color:#CBD5E1;line-height:1.6}
.rc-btn{display:block;width:100%;background:#10B981;color:#fff;border:none;border-radius:10px;padding:14px;font-size:15px;font-weight:700;cursor:pointer;-webkit-tap-highlight-color:transparent;text-align:center;margin-top:4px}
</style>
<div class='rc-wrap'>
  <div class='rc-label'>SAMPLE PROVN STRENGTH PROFILE</div>
  <div class='rc-card'>
    <div class='rc-toggle'>
      <button class='rc-tbtn active' id='rcbtn0' onclick='rcSwitch(0)' ontouchstart=''>vs County Average</button>
      <button class='rc-tbtn' id='rcbtn1' onclick='rcSwitch(1)' ontouchstart=''>vs Top 10%</button>
    </div>
    <svg class='rc-svg' viewBox='0 0 340 340' xmlns='http://www.w3.org/2000/svg'>
      <polygon id='rcGrid100' fill='none' stroke='#1E2A3A' stroke-width='1'/>
      <polygon id='rcGrid75' fill='none' stroke='#1E2A3A' stroke-width='0.5'/>
      <polygon id='rcGrid50' fill='none' stroke='#1E2A3A' stroke-width='0.5'/>
      <polygon id='rcGrid25' fill='none' stroke='#1E2A3A' stroke-width='0.5'/>
      <g id='rcAxes' stroke='#1E2A3A' stroke-width='0.5'></g>
      <polygon id='rcBench' fill='rgba(75,85,99,0.15)' stroke='#4B5563' stroke-width='1.5' stroke-dasharray='4,3'/>
      <polygon id='rcAgent' fill='rgba(16,185,129,0.15)' stroke='#10B981' stroke-width='2'/>
      <g id='rcDots'></g>
      <g id='rcLabels' font-size='10' fill='#94A3B8' text-anchor='middle' font-family='system-ui,sans-serif'></g>
    </svg>
    <div class='rc-legend'>
      <div class='rc-li'><div class='rc-lmark' style='background:#10B981'></div>Sarah Chen</div>
      <div class='rc-li'><div class='rc-lmark' style='background:#4B5563'></div><span id='rcLegendLabel'>Sonoma County Avg</span></div>
    </div>
  </div>
  <div class='rc-verify'>
    <span style='font-size:16px;flex-shrink:0'>&#128737;</span>
    <div class='rc-vtext'>Every axis on this chart is calculated from verified public data. Sarah Chen cannot edit any of it.</div>
  </div>
  <button class='rc-btn' onclick="window.location.href='/agents/sarah-chen-001'" ontouchstart=''>See a full agent profile &#8594;</button>
</div>
<script>
var CX=170,CY=170,R=110;
var LABELS=[['Five Star','Reviews'],['Local Market','Expertise'],['Career','Volume'],['Skin in','the Game'],['Successful','Outcomes'],['Expertise','Depth']];
var SARAH=[89,94,76,92,88,95];
var COUNTY=[50,50,50,50,50,50];
var TOP10=[82,88,85,79,84,91];
var rcMode=0;
var rcCurrent=[50,50,50,50,50,50];
var rcRaf=null;
function pts(vals){
  var p=[];
  for(var i=0;i<6;i++){
    var a=(Math.PI/180)*(60*i-90);
    var r=(vals[i]/100)*R;
    p.push((CX+r*Math.cos(a)).toFixed(1)+','+(CY+r*Math.sin(a)).toFixed(1));
  }
  return p.join(' ');
}
function gridPts(pct){
  var p=[];
  for(var i=0;i<6;i++){
    var a=(Math.PI/180)*(60*i-90);
    var r=(pct/100)*R;
    p.push((CX+r*Math.cos(a)).toFixed(1)+','+(CY+r*Math.sin(a)).toFixed(1));
  }
  return p.join(' ');
}
function rcInit(){
  document.getElementById('rcGrid100').setAttribute('points',gridPts(100));
  document.getElementById('rcGrid75').setAttribute('points',gridPts(75));
  document.getElementById('rcGrid50').setAttribute('points',gridPts(50));
  document.getElementById('rcGrid25').setAttribute('points',gridPts(25));
  var ax=document.getElementById('rcAxes');
  ax.innerHTML='';
  for(var i=0;i<6;i++){
    var a=(Math.PI/180)*(60*i-90);
    var x=(CX+R*Math.cos(a)).toFixed(1);
    var y=(CY+R*Math.sin(a)).toFixed(1);
    var ln=document.createElementNS('http://www.w3.org/2000/svg','line');
    ln.setAttribute('x1',CX);ln.setAttribute('y1',CY);
    ln.setAttribute('x2',x);ln.setAttribute('y2',y);
    ax.appendChild(ln);
  }
  document.getElementById('rcAgent').setAttribute('points',pts(SARAH));
  var dotsEl=document.getElementById('rcDots');
  dotsEl.innerHTML='';
  for(var i=0;i<6;i++){
    var a=(Math.PI/180)*(60*i-90);
    var r=(SARAH[i]/100)*R;
    var cx=(CX+r*Math.cos(a)).toFixed(1);
    var cy=(CY+r*Math.sin(a)).toFixed(1);
    var circle=document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('cx',cx);circle.setAttribute('cy',cy);
    circle.setAttribute('r','11');circle.setAttribute('fill','#10B981');
    var txt=document.createElementNS('http://www.w3.org/2000/svg','text');
    txt.setAttribute('x',cx);txt.setAttribute('y',cy);
    txt.setAttribute('text-anchor','middle');
    txt.setAttribute('dominant-baseline','central');
    txt.setAttribute('font-size','9');
    txt.setAttribute('font-weight','700');
    txt.setAttribute('fill','#fff');
    txt.textContent=SARAH[i];
    dotsEl.appendChild(circle);
    dotsEl.appendChild(txt);
  }
  var labelsEl=document.getElementById('rcLabels');
  labelsEl.innerHTML='';
  var lo=R+28;
  for(var i=0;i<6;i++){
    var a=(Math.PI/180)*(60*i-90);
    var lx=(CX+lo*Math.cos(a)).toFixed(1);
    var ly=(CY+lo*Math.sin(a)).toFixed(1);
    var t=document.createElementNS('http://www.w3.org/2000/svg','text');
    t.setAttribute('x',lx);t.setAttribute('y',ly);
    t.setAttribute('text-anchor','middle');
    t.setAttribute('fill','#94A3B8');
    t.setAttribute('font-size','10');
    t.setAttribute('font-family','system-ui,sans-serif');
    var ts1=document.createElementNS('http://www.w3.org/2000/svg','tspan');
    ts1.setAttribute('x',lx);ts1.setAttribute('dy','-5');
    ts1.textContent=LABELS[i][0];
    var ts2=document.createElementNS('http://www.w3.org/2000/svg','tspan');
    ts2.setAttribute('x',lx);ts2.setAttribute('dy','14');
    ts2.textContent=LABELS[i][1];
    t.appendChild(ts1);t.appendChild(ts2);
    labelsEl.appendChild(t);
  }
  rcAnimateTo(COUNTY);
}
function rcAnimateTo(target){
  if(rcRaf) cancelAnimationFrame(rcRaf);
  var from=rcCurrent.slice();
  var t0=performance.now();
  var dur=600;
  function tick(now){
    var t=Math.min((now-t0)/dur,1);
    var e=t<0.5?2*t*t:-1+(4-2*t)*t;
    rcCurrent=from.map(function(f,idx){return f+(target[idx]-f)*e;});
    document.getElementById('rcBench').setAttribute('points',pts(rcCurrent));
    if(t<1) rcRaf=requestAnimationFrame(tick);
  }
  rcRaf=requestAnimationFrame(tick);
}
function rcSwitch(m){
  rcMode=m;
  document.getElementById('rcbtn0').classList.toggle('active',m===0);
  document.getElementById('rcbtn1').classList.toggle('active',m===1);
  document.getElementById('rcLegendLabel').textContent=m===0?'Sonoma County Avg':'Top 10%';
  var bench=document.getElementById('rcBench');
  bench.setAttribute('stroke',m===0?'#4B5563':'#F59E0B');
  bench.setAttribute('fill',m===0?'rgba(75,85,99,0.15)':'rgba(245,158,11,0.1)');
  rcAnimateTo(m===0?COUNTY:TOP10);
}
rcInit();
</script>
`;

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
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: '48px',
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0 40px',
          }}
        >
          {/* LEFT — Score bars */}
          <div style={{ flex: '0 0 440px', maxWidth: '440px' }} dangerouslySetInnerHTML={{ __html: `
<style>
.sb-wrap{flex:1;min-width:0}
.sb-row{border-bottom:1px solid #1E2A3A}
.sb-row:last-child{border-bottom:none}
.sb-btn{width:100%;background:transparent;border:none;padding:16px 0;cursor:pointer;text-align:left;font:inherit;-webkit-tap-highlight-color:transparent;min-height:56px;display:flex;flex-direction:column;gap:8px}
.sb-header{display:flex;align-items:center;justify-content:space-between;width:100%}
.sb-left{display:flex;align-items:center;gap:10px}
.sb-emoji{font-size:18px;width:24px;text-align:center}
.sb-label{font-size:14px;font-weight:600;color:#FFFFFF}
.sb-right{display:flex;align-items:center;gap:6px}
.sb-pct{font-size:14px;font-weight:700;color:#10B981}
.sb-chev{font-size:10px;color:#4B5563;transition:transform 0.3s;display:inline-block}
.sb-chev.open{transform:rotate(180deg)}
.sb-track{width:100%;height:6px;background:#1E2A3A;border-radius:3px;overflow:hidden}
.sb-fill{height:100%;background:#10B981;border-radius:3px}
.sb-body{overflow:hidden;transition:max-height 0.3s ease;max-height:0px}
.sb-why{font-size:13px;color:#CBD5E1;line-height:1.7;padding:8px 0 4px;font-style:italic}
.sb-source{font-size:11px;color:#4B5563;padding-bottom:12px}
.sb-formula-btn{background:transparent;border:none;color:#10B981;font-size:13px;cursor:pointer;padding:16px 0;text-align:left;width:100%;-webkit-tap-highlight-color:transparent;min-height:44px}
.sb-formula-body{overflow:hidden;transition:max-height 0.3s ease;max-height:0px}
.sb-formula-text{font-size:13px;color:#94A3B8;line-height:1.7;padding-bottom:16px}
.sb-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}
.sb-pill{background:#0F1628;border:1px solid #1E2A3A;border-radius:20px;padding:8px 16px;font-size:12px;color:#94A3B8}
.sb-closing{font-size:12px;color:#4B5563;font-style:italic;margin-top:16px;line-height:1.6}
</style>
<div class="sb-wrap" id="sbWrap">
  <div class="sb-row">
    <button class="sb-btn" onclick="sbToggle(0)" ontouchstart="">
      <div class="sb-header">
        <div class="sb-left"><span class="sb-emoji">&#11088;</span><span class="sb-label">Five Star Reviews</span></div>
        <div class="sb-right"><span class="sb-pct">89%</span><span class="sb-chev open" id="sbchev0">&#9660;</span></div>
      </div>
      <div class="sb-track"><div class="sb-fill" style="width:89%"></div></div>
    </button>
    <div class="sb-body" id="sbbody0" style="max-height:220px">
      <div class="sb-why">Volume and recency of verified reviews across every major platform &mdash; not just the ones the agent chose to show you</div>
      <div class="sb-source">Google &middot; Zillow &middot; Realtor.com &middot; Homes.com</div>
    </div>
  </div>
  <div class="sb-row">
    <button class="sb-btn" onclick="sbToggle(1)" ontouchstart="">
      <div class="sb-header">
        <div class="sb-left"><span class="sb-emoji">&#128205;</span><span class="sb-label">Local Market Expertise</span></div>
        <div class="sb-right"><span class="sb-pct">94%</span><span class="sb-chev" id="sbchev1">&#9660;</span></div>
      </div>
      <div class="sb-track"><div class="sb-fill" style="width:94%"></div></div>
    </button>
    <div class="sb-body" id="sbbody1">
      <div class="sb-why">How many neighborhoods they have sold in and how deeply &mdash; a true local specialist vs someone passing through</div>
      <div class="sb-source">MLS transaction history by zip code</div>
    </div>
  </div>
  <div class="sb-row">
    <button class="sb-btn" onclick="sbToggle(2)" ontouchstart="">
      <div class="sb-header">
        <div class="sb-left"><span class="sb-emoji">&#128176;</span><span class="sb-label">Career Volume</span></div>
        <div class="sb-right"><span class="sb-pct">76%</span><span class="sb-chev" id="sbchev2">&#9660;</span></div>
      </div>
      <div class="sb-track"><div class="sb-fill" style="width:76%"></div></div>
    </button>
    <div class="sb-body" id="sbbody2">
      <div class="sb-why">Total sales ranked against every other active agent in the county &mdash; top 5% means they outsell 95% of agents</div>
      <div class="sb-source">MLS career production data</div>
    </div>
  </div>
  <div class="sb-row">
    <button class="sb-btn" onclick="sbToggle(3)" ontouchstart="">
      <div class="sb-header">
        <div class="sb-left"><span class="sb-emoji">&#127968;</span><span class="sb-label">Skin in the Game</span></div>
        <div class="sb-right"><span class="sb-pct">92%</span><span class="sb-chev" id="sbchev3">&#9660;</span></div>
      </div>
      <div class="sb-track"><div class="sb-fill" style="width:92%"></div></div>
    </button>
    <div class="sb-body" id="sbbody3">
      <div class="sb-why">Does this agent personally own real estate? An agent with no property of their own is advising you on something they have never personally risked money on</div>
      <div class="sb-source">County assessor records &middot; verified LLC docs</div>
    </div>
  </div>
  <div class="sb-row">
    <button class="sb-btn" onclick="sbToggle(4)" ontouchstart="">
      <div class="sb-header">
        <div class="sb-left"><span class="sb-emoji">&#10003;</span><span class="sb-label">Successful Outcomes</span></div>
        <div class="sb-right"><span class="sb-pct">88%</span><span class="sb-chev" id="sbchev4">&#9660;</span></div>
      </div>
      <div class="sb-track"><div class="sb-fill" style="width:88%"></div></div>
    </button>
    <div class="sb-body" id="sbbody4">
      <div class="sb-why">What percentage of every listing they have ever taken eventually sold &mdash; including expired listings and relists. Rewards persistence not just easy markets</div>
      <div class="sb-source">MLS listing history including expired</div>
    </div>
  </div>
  <div class="sb-row">
    <button class="sb-btn" onclick="sbToggle(5)" ontouchstart="">
      <div class="sb-header">
        <div class="sb-left"><span class="sb-emoji">&#127919;</span><span class="sb-label">Expertise Depth</span></div>
        <div class="sb-right"><span class="sb-pct">95%</span><span class="sb-chev" id="sbchev5">&#9660;</span></div>
      </div>
      <div class="sb-track"><div class="sb-fill" style="width:95%"></div></div>
    </button>
    <div class="sb-body" id="sbbody5">
      <div class="sb-why">Complex transactions like probate, trust sales, and 1031 exchanges score higher than standard residential &mdash; measures real skill not just volume</div>
      <div class="sb-source">MLS transaction type designations</div>
    </div>
  </div>
  <button class="sb-formula-btn" onclick="sbFormula()" ontouchstart="">How is the overall score calculated? &#8595;</button>
  <div class="sb-formula-body" id="sbformula">
    <div class="sb-formula-text">Each category is weighted independently and combined into a single composite score from 0 to 100. Transaction performance and client outcomes carry the most weight. The exact formula is proprietary &mdash; agents cannot reverse-engineer it, which means the only way to improve a Provn score is to actually serve clients better. Scores update as new data becomes available.</div>
  </div>
  <div class="sb-pills">
    <div class="sb-pill">&#128274; Agents cannot edit their score</div>
    <div class="sb-pill">&#128202; Updated from live data sources</div>
    <div class="sb-pill">&#10003; Verified not self-reported</div>
  </div>
  <p class="sb-closing">Scores update automatically as new data becomes available. Agents are never notified in advance of score changes.</p>
</div>
<script>
var sbOpen=0;
function sbToggle(i){
  for(var j=0;j<6;j++){
    var b=document.getElementById('sbbody'+j);
    var c=document.getElementById('sbchev'+j);
    if(j===i&&sbOpen!==i){b.style.maxHeight='220px';c.classList.add('open');}
    else{b.style.maxHeight='0px';c.classList.remove('open');}
  }
  sbOpen=(sbOpen===i)?-1:i;
}
function sbFormula(){
  var f=document.getElementById('sbformula');
  f.style.maxHeight=f.style.maxHeight==='220px'?'0px':'220px';
}
</script>
` }} />

          {/* RIGHT — Radar chart */}
          <div
            style={{ flex: 1, minWidth: 0 }}
            dangerouslySetInnerHTML={{ __html: radarHTML }}
          />
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

        {/* Mobile persona selector — hidden on desktop via CSS */}
        <div
          className="persona-mobile"
          dangerouslySetInnerHTML={{ __html: `
<style>
.ps-wrap{padding:0}
.ps-pills{display:flex;gap:8px;overflow-x:auto;padding-bottom:12px;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.ps-pills::-webkit-scrollbar{display:none}
.ps-pill{flex-shrink:0;padding:10px 16px;border-radius:24px;border:1.5px solid #1E2A3A;background:#0F1628;color:#94A3B8;font-size:13px;font-weight:600;cursor:pointer;-webkit-tap-highlight-color:transparent;white-space:nowrap;min-height:44px;display:flex;align-items:center;gap:6px;transition:all 0.2s}
.ps-pill.active{background:#0F2A1A;border-color:#10B981;color:#FFFFFF}
.ps-pill-emoji{font-size:15px}
.ps-detail{background:#0F1628;border:1px solid #1E2A3A;border-radius:16px;padding:24px;margin-top:4px;min-height:200px}
.ps-detail-top{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.ps-detail-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0}
.ps-detail-label{font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:3px}
.ps-detail-price{font-size:13px;color:#94A3B8}
.ps-detail-divider{height:1px;background:#1E2A3A;margin-bottom:14px}
.ps-detail-situation{font-size:14px;color:#CBD5E1;line-height:1.7;margin-bottom:14px}
.ps-detail-needs-label{font-size:10px;color:#94A3B8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px}
.ps-detail-needs{font-size:14px;color:#FFFFFF;font-weight:500;line-height:1.6;margin-bottom:14px}
.ps-detail-match{font-size:12px;font-weight:600;color:#10B981;display:flex;align-items:center;gap:6px}
.ps-nav{display:flex;justify-content:space-between;align-items:center;margin-top:16px}
.ps-nav-btn{background:#0A0A0A;border:1px solid #1E2A3A;border-radius:8px;padding:8px 16px;color:#94A3B8;font-size:13px;cursor:pointer;-webkit-tap-highlight-color:transparent;min-height:44px;display:flex;align-items:center;gap:6px}
.ps-nav-btn:disabled{opacity:0.3;cursor:default}
.ps-counter{font-size:12px;color:#4B5563}
</style>
<div class='ps-wrap'>
  <div class='ps-pills' id='psPills'>
    <button class='ps-pill active' onclick='psSelect(0)' ontouchstart='' id='pspill0'><span class='ps-pill-emoji'>&#128273;</span>First-Time Buyer</button>
    <button class='ps-pill' onclick='psSelect(1)' ontouchstart='' id='pspill1'><span class='ps-pill-emoji'>&#11014;&#65039;</span>Move-Up Seller</button>
    <button class='ps-pill' onclick='psSelect(2)' ontouchstart='' id='pspill2'><span class='ps-pill-emoji'>&#128142;</span>Luxury Buyer</button>
    <button class='ps-pill' onclick='psSelect(3)' ontouchstart='' id='pspill3'><span class='ps-pill-emoji'>&#127960;</span>Investment Buyer</button>
    <button class='ps-pill' onclick='psSelect(4)' ontouchstart='' id='pspill4'><span class='ps-pill-emoji'>&#128203;</span>Trust Sale</button>
    <button class='ps-pill' onclick='psSelect(5)' ontouchstart='' id='pspill5'><span class='ps-pill-emoji'>&#127807;</span>Downsizer</button>
  </div>
  <div class='ps-detail' id='psDetail'></div>
  <div id='psSwipeHint' style='text-align:center;font-size:11px;color:#4B5563;padding:8px 0;font-style:italic'>&#8592; swipe to browse &#8594;</div>
  <div class='ps-nav'>
    <button class='ps-nav-btn' onclick='psNav(-1)' ontouchstart='' id='psPrev'>&#8592; Prev</button>
    <span class='ps-counter' id='psCounter'>1 of 6</span>
    <button class='ps-nav-btn' onclick='psNav(1)' ontouchstart='' id='psNext'>Next &#8594;</button>
  </div>
</div>
<script>
var psData=[
  {emoji:'&#128273;',label:'FIRST-TIME BUYER',labelColor:'#10B981',iconBg:'#0A1F12',price:'$550K-$700K \xb7 Petaluma',situation:'Never bought before. Nervous about offers, inspections, and making a mistake on the largest purchase of their life.',needs:'Patient educator with strong lender network and first-time buyer transaction experience.',match:'Matched to 8 agents on Provn'},
  {emoji:'&#11014;',label:'MOVE-UP SELLER',labelColor:'#F59E0B',iconBg:'#1A1200',price:'Selling $900K \xb7 Buying $1.4M \xb7 Windsor',situation:'Needs to sell before buying. Two transactions to coordinate simultaneously without losing either one.',needs:'Tactical coordinator with contingent sale experience and calm under pressure.',match:'Matched to 5 agents on Provn'},
  {emoji:'&#128142;',label:'LUXURY BUYER',labelColor:'#8B5CF6',iconBg:'#0D0A1A',price:'$2.1M+ \xb7 Healdsburg',situation:'Wants vineyard or estate property. Needs off-market access and complete discretion.',needs:'Off-market specialist with $50M+ luxury volume and vineyard transaction experience.',match:'Matched to 3 agents on Provn'},
  {emoji:'&#127960;',label:'INVESTMENT BUYER',labelColor:'#06B6D4',iconBg:'#0A1520',price:'$800K-$1.2M \xb7 Multifamily',situation:'Looking for rental income property. Needs to analyze cash flow, cap rates, and long-term appreciation.',needs:'Investor-minded agent who personally owns investment property and understands NOI.',match:'Matched to 6 agents on Provn'},
  {emoji:'&#128203;',label:'TRUST SALE SELLER',labelColor:'#EF4444',iconBg:'#1A0D0D',price:'Estate property \xb7 Santa Rosa',situation:'Managing a parent estate. Needs speed, sensitivity, and deep probate knowledge.',needs:'Probate and trust sale specialist with documented estate transaction experience.',match:'Matched to 4 agents on Provn'},
  {emoji:'&#127807;',label:'DOWNSIZER',labelColor:'#10B981',iconBg:'#0A1F12',price:'Selling $1.3M \xb7 Buying $750K \xb7 Sonoma',situation:'30 years in the family home. An emotional transaction that needs patience as much as skill.',needs:'High-EQ agent with downsizer experience who understands this is not just a financial decision.',match:'Matched to 7 agents on Provn'}
];
var psCurrent=0;
function psRender(i){
  var d=psData[i];
  document.getElementById('psDetail').innerHTML='<div class="ps-detail-top"><div class="ps-detail-icon" style="background:'+d.iconBg+'">'+d.emoji+'</div><div><div class="ps-detail-label" style="color:'+d.labelColor+'">'+d.label+'</div><div class="ps-detail-price">'+d.price+'</div></div></div><div class="ps-detail-divider"></div><div class="ps-detail-situation">'+d.situation+'</div><div class="ps-detail-needs-label">What they need from an agent</div><div class="ps-detail-needs">'+d.needs+'</div><div class="ps-detail-match">&#10003; '+d.match+'</div>';
  document.getElementById('psCounter').textContent=(i+1)+' of 6';
  document.getElementById('psPrev').disabled=(i===0);
  document.getElementById('psNext').disabled=(i===5);
  for(var j=0;j<6;j++){var pill=document.getElementById('pspill'+j);if(j===i){pill.classList.add('active');}else{pill.classList.remove('active');}}
}
function psSelect(i){psCurrent=i;psRender(i);var pill=document.getElementById('pspill'+i);if(pill){pill.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});}}
function psNav(dir){var next=psCurrent+dir;if(next>=0&&next<=5)psSelect(next);}
var psSwipeStartX=0;
var psSwipeStartY=0;
var psSwipeThreshold=40;
document.getElementById('psDetail').addEventListener('touchstart',function(e){psSwipeStartX=e.touches[0].clientX;psSwipeStartY=e.touches[0].clientY;},{passive:true});
document.getElementById('psDetail').addEventListener('touchend',function(e){
  var dx=e.changedTouches[0].clientX-psSwipeStartX;
  var dy=e.changedTouches[0].clientY-psSwipeStartY;
  if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>psSwipeThreshold){
    if(dx<0&&psCurrent<5){psSelect(psCurrent+1);}
    else if(dx>0&&psCurrent>0){psSelect(psCurrent-1);}
    var hint=document.getElementById('psSwipeHint');
    if(hint) hint.style.display='none';
  }
},{passive:true});
psRender(0);
</script>
` }}
        />

        {/* Persona grid — desktop only */}
        <FadeIn delay={80}>
          <div className="persona-grid persona-desktop" style={{
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
