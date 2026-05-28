'use client';

/**
 * /match/seller/results — Seller match results page.
 * Reads sellerAnswers from localStorage, scores mock agents, renders top-3 cards.
 * Silent weighting: 'Yes — unhappy with current agent' boosts successfulOutcomes weight.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ── Design tokens ──────────────────────────────────────────────────────────────
const C_SEC   = '#94A3B8';
const C_TER   = '#4B5563';
const CARD_BG = '#1A1D2E';
const CARD_BD = '#2D3148';
const ACCENT  = '#10b981';   // seller green

// ── Types ──────────────────────────────────────────────────────────────────────
interface SellerAnswers {
  address:        string;
  estimatedValue: string;
  timeline:       string;
  condition:      string;
  agentStatus:    string;
  priorities:     string[];
  contact:        { name: string; email: string; phone: string };
}

interface MockAgent {
  id:                   string;
  name:                 string;
  photo:                string;
  brokerage:            string;
  city:                 string;
  provnScore:           number;
  provnGrade:           string;
  totalListings:        number;
  avgDaysOnMarket:      number;
  marketMedianDays:     number;
  salePriceToListRatio: number;
  listingSuccessRate:   number;  // % of listings that sold (vs expired/pulled)
  avgSalePrice:         number;
  reviewScore:          number;
  reviewCount:          number;
  priceReductionRate:   number;  // % of listings that required price reduction
  marketPriceRedRate:   number;
  specialties:          string[]; // maps to seller priorities
  highlights:           string[]; // 3 bullets shown on card
  locations:            string[]; // cities served
  phone:                string;
}

// ── Mock agent roster ──────────────────────────────────────────────────────────
const AGENTS: MockAgent[] = [
  {
    id:                   'sarah-chen-001',
    name:                 'Sarah Chen',
    photo:                'https://randomuser.me/api/portraits/women/44.jpg',
    brokerage:            'Compass Real Estate',
    city:                 'Healdsburg',
    provnScore:           92,
    provnGrade:           'A+',
    totalListings:        312,
    avgDaysOnMarket:      11,
    marketMedianDays:     28,
    salePriceToListRatio: 103.2,
    listingSuccessRate:   94,
    avgSalePrice:         1_820_000,
    reviewScore:          4.9,
    reviewCount:          206,
    priceReductionRate:   6.1,
    marketPriceRedRate:   14.3,
    specialties:          ['Highest sale price possible', 'Professional photography and marketing', 'Strong negotiation skills', 'Experience with my property type'],
    highlights:           ['Achieves 103.2% of list price — 3.8 points above market', 'Only 6.1% of listings need price reductions vs 14.3% market avg', '94% listing success rate — closes nearly every deal she takes'],
    locations:            ['Healdsburg', 'Sebastopol', 'Sonoma', 'Santa Rosa', 'Geyserville'],
    phone:                '(707) 555-0192',
  },
  {
    id:                   'jennifer-park-003',
    name:                 'Jennifer Park',
    photo:                'https://randomuser.me/api/portraits/women/68.jpg',
    brokerage:            "Sotheby's International Realty",
    city:                 'Sonoma',
    provnScore:           87,
    provnGrade:           'A',
    totalListings:        241,
    avgDaysOnMarket:      15,
    marketMedianDays:     28,
    salePriceToListRatio: 102.1,
    listingSuccessRate:   91,
    avgSalePrice:         1_340_000,
    reviewScore:          4.85,
    reviewCount:          159,
    priceReductionRate:   8.4,
    marketPriceRedRate:   14.3,
    specialties:          ['Deep knowledge of my neighborhood', 'Fastest sale possible', 'Strong negotiation skills', 'Clear and frequent communication'],
    highlights:           ['Sells 13 days faster than market median on average', '241 verified listings closed across Sonoma and Napa', 'Sellers report feeling fully informed at every step'],
    locations:            ['Sonoma', 'Petaluma', 'Sebastopol', 'Napa', 'Other'],
    phone:                '(707) 555-0478',
  },
  {
    id:                   'david-okafor-004',
    name:                 'David Okafor',
    photo:                'https://randomuser.me/api/portraits/men/75.jpg',
    brokerage:            'RE/MAX Gold',
    city:                 'Santa Rosa',
    provnScore:           79,
    provnGrade:           'B+',
    totalListings:        178,
    avgDaysOnMarket:      21,
    marketMedianDays:     28,
    salePriceToListRatio: 100.8,
    listingSuccessRate:   88,
    avgSalePrice:         680_000,
    reviewScore:          4.75,
    reviewCount:          94,
    priceReductionRate:   10.2,
    marketPriceRedRate:   14.3,
    specialties:          ['Honest pricing advice', 'Clear and frequent communication', 'Fastest sale possible', 'Experience with my property type'],
    highlights:           ['Known for frank, data-backed pricing advice with no fluff', '178 verified closings with 88% success rate on listings taken', 'Mid-market specialist: avg sale $680K across Santa Rosa'],
    locations:            ['Santa Rosa', 'Rohnert Park', 'Windsor', 'Cotati', 'Petaluma'],
    phone:                '(707) 555-0629',
  },
];

// ── Value parsing ──────────────────────────────────────────────────────────────
function parseEstimatedValue(val: string): number {
  if (!val) return 800_000;
  const m = val.match(/[\d,]+/);
  if (!m) return 800_000;
  return parseInt(m[0].replace(/,/g, ''), 10);
}

// ── Matching algorithm ─────────────────────────────────────────────────────────
function scoreAgent(agent: MockAgent, answers: SellerAnswers): number {
  let score = 0;

  // 1. Location match (30 pts) — based on address keywords
  const addressLower = (answers.address || '').toLowerCase();
  const locMatch = agent.locations.some(loc => addressLower.includes(loc.toLowerCase()));
  if (locMatch) score += 30;
  else if (agent.locations.includes('Other')) score += 10;

  // 2. Price band match (20 pts)
  const estValue = parseEstimatedValue(answers.estimatedValue);
  const within30pct = estValue * 0.7 <= agent.avgSalePrice * 1.3 && estValue * 1.3 >= agent.avgSalePrice * 0.7;
  if (within30pct) score += 20;
  else score += 5;

  // 3. Priority match (25 pts)
  const matched = answers.priorities.filter(p => agent.specialties.includes(p)).length;
  score += Math.min(matched * 12, 25);

  // 4. Silent weighting — unhappy with current agent (extra 10 pts for high success rate)
  if (answers.agentStatus === 'Yes — unhappy with current agent') {
    // Weight heavily toward agents with high listing success rates
    score += Math.round((agent.listingSuccessRate / 100) * 10);
  }

  // 5. Condition adjustment — distressed properties get David Okafor bump
  if ((answers.condition === 'Needs some work' || answers.condition === 'Major renovation') && agent.id === 'david-okafor-004') {
    score += 8;
  }

  // 6. Timeline urgency — fast sellers move up
  if (answers.timeline === 'Need to sell within 60 days') {
    score += Math.round((28 - agent.avgDaysOnMarket) / 28 * 8);
  }

  // 7. Baseline provn score (15 pts)
  score += Math.round((agent.provnScore / 100) * 15);

  return score;
}

// ── Score ring ─────────────────────────────────────────────────────────────────
function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const gradeColor = grade.startsWith('A') ? '#10b981' : grade.startsWith('B') ? '#3b82f6' : '#f59e0b';
  const r = 28, cx = 36, cy = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={72} height={72} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2D3148" strokeWidth={5} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={gradeColor} strokeWidth={5}
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
        <text x={cx} y={cy + 1} fill="white" fontSize={14} fontWeight={700}
          textAnchor="middle" dominantBaseline="middle"
          style={{ transform: 'rotate(90deg)', transformOrigin: `${cx}px ${cy}px` }}>
          {grade}
        </text>
      </svg>
      <span className="text-xs font-medium" style={{ color: C_SEC }}>Provn Score</span>
    </div>
  );
}

// ── Stat pill ──────────────────────────────────────────────────────────────────
function StatPill({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 px-3 py-3 rounded-xl"
      style={{ background: highlight ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${highlight ? 'rgba(16,185,129,0.25)' : CARD_BD}` }}>
      <span className="text-base font-black text-white">{value}</span>
      <span className="text-[10px] font-medium text-center leading-tight" style={{ color: C_SEC }}>{label}</span>
    </div>
  );
}

// ── Match bullet ───────────────────────────────────────────────────────────────
function MatchBullet({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2.5}
        strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-[2px]">
        <path d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      <span className="text-xs leading-relaxed" style={{ color: C_SEC }}>{text}</span>
    </div>
  );
}

// ── Rank config ────────────────────────────────────────────────────────────────
const RANK_CONFIG = [
  { label: '#1 Best match',   bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)', color: '#10b981', ring: 'rgba(16,185,129,0.20)' },
  { label: '#2 Strong match', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.30)', color: '#3b82f6', ring: 'rgba(59,130,246,0.15)' },
  { label: '#3 Good match',   bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', color: '#f59e0b', ring: 'rgba(245,158,11,0.12)' },
];

// ── Agent card ─────────────────────────────────────────────────────────────────
function AgentCard({ agent, rank, answers }: { agent: MockAgent; rank: number; answers: SellerAnswers }) {
  const cfg = RANK_CONFIG[rank];
  const priorityHits = answers.priorities.filter(p => agent.specialties.includes(p));

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: CARD_BG,
        border: `1px solid ${rank === 0 ? cfg.border : CARD_BD}`,
        boxShadow: rank === 0 ? `0 0 0 1px ${cfg.ring}, 0 4px 24px ${cfg.ring}` : undefined,
      }}>

      {/* Rank banner */}
      <div className="px-5 py-2 flex items-center justify-between"
        style={{ background: cfg.bg, borderBottom: `1px solid ${cfg.border}` }}>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: cfg.color, letterSpacing: '0.1em' }}>
          {cfg.label}
        </span>
        {priorityHits.length > 0 && (
          <div className="flex items-center gap-1.5">
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="text-[10px] font-semibold" style={{ color: cfg.color }}>
              Matches {priorityHits.length} of your {answers.priorities.length} priorities
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5">
        {/* Identity */}
        <div className="flex items-start gap-4 mb-5">
          <div className="shrink-0 relative">
            <Image src={agent.photo} alt={agent.name} width={64} height={64}
              className="rounded-xl object-cover" style={{ border: '2px solid #2D3148' }} />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2"
              style={{ background: '#10b981', borderColor: CARD_BG }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-black text-white leading-tight">{agent.name}</h3>
            <p className="text-sm mb-0.5" style={{ color: C_SEC }}>{agent.brokerage}</p>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
                Active
              </span>
              <span className="text-xs" style={{ color: C_TER }}>·</span>
              <span className="text-xs" style={{ color: C_TER }}>{agent.city}, CA</span>
            </div>
          </div>
          <div className="shrink-0">
            <ScoreRing score={agent.provnScore} grade={agent.provnGrade} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <StatPill value={`${agent.salePriceToListRatio}%`} label="Sale-to-list ratio" highlight />
          <StatPill value={`${agent.avgDaysOnMarket}d`} label="Avg days on market" />
          <StatPill value={`${agent.listingSuccessRate}%`} label="Listing success rate" />
        </div>

        {/* Why they match */}
        <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${CARD_BD}` }}>
          <p className="text-xs font-semibold mb-2.5 uppercase tracking-widest" style={{ color: C_SEC, letterSpacing: '0.08em' }}>
            Why they match
          </p>
          <div className="flex flex-col gap-2">
            {agent.highlights.map((h, i) => <MatchBullet key={i} text={h} />)}
          </div>
        </div>

        {/* Reviews */}
        <div className="flex items-center gap-1.5 mb-5 px-1">
          {[1,2,3,4,5].map(i => (
            <svg key={i} width={12} height={12} viewBox="0 0 24 24"
              fill={agent.reviewScore >= i ? '#f59e0b' : 'none'}
              stroke="#f59e0b" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
          ))}
          <span className="text-xs font-semibold text-white ml-0.5">{agent.reviewScore.toFixed(2)}</span>
          <span className="text-xs" style={{ color: C_TER }}>({agent.reviewCount} verified reviews)</span>
        </div>

        {/* CTAs */}
        <div className="flex gap-3">
          <Link
            href={`/agents/${agent.id}`}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${CARD_BD}`, color: '#CBD5E1' }}
          >
            View full profile
          </Link>
          <button
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-opacity hover:opacity-90"
            style={{ background: ACCENT, color: '#ffffff' }}
            onClick={() => window.open(`tel:${agent.phone.replace(/\D/g, '')}`, '_self')}
          >
            Connect
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Comparison table ───────────────────────────────────────────────────────────
function ComparisonTable({ agents }: { agents: MockAgent[] }) {
  const rows: { label: string; getValue: (a: MockAgent) => string; better: 'higher' | 'lower' }[] = [
    { label: 'Provn Score',          getValue: a => `${a.provnScore}/100`,                    better: 'higher' },
    { label: 'Sale-to-List Ratio',   getValue: a => `${a.salePriceToListRatio}%`,             better: 'higher' },
    { label: 'Avg Days on Market',   getValue: a => `${a.avgDaysOnMarket} days`,              better: 'lower'  },
    { label: 'Listing Success Rate', getValue: a => `${a.listingSuccessRate}%`,               better: 'higher' },
    { label: 'Price Reduction Rate', getValue: a => `${a.priceReductionRate}%`,               better: 'lower'  },
    { label: 'Review Score',         getValue: a => `${a.reviewScore.toFixed(2)} / 5.0`,      better: 'higher' },
  ];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${CARD_BD}` }}>
      <div className="px-5 py-4" style={{ borderBottom: `1px solid ${CARD_BD}` }}>
        <h2 className="text-base font-bold text-white">Head-to-head comparison</h2>
        <p className="text-xs mt-0.5" style={{ color: C_TER }}>All stats sourced from MLS and verified public records</p>
      </div>
      <div className="grid px-5 py-3" style={{ gridTemplateColumns: '1fr repeat(3, 1fr)', borderBottom: `1px solid ${CARD_BD}`, background: 'rgba(255,255,255,0.02)' }}>
        <span className="text-xs font-semibold" style={{ color: C_TER }}>Metric</span>
        {agents.map((a, i) => (
          <span key={a.id} className="text-xs font-bold text-center truncate" style={{ color: RANK_CONFIG[i].color }}>
            {a.name.split(' ')[0]}
          </span>
        ))}
      </div>
      {rows.map((row, ri) => {
        const numerics = agents.map(a =>
          row.label === 'Provn Score' ? a.provnScore :
          row.label === 'Sale-to-List Ratio' ? a.salePriceToListRatio :
          row.label === 'Avg Days on Market' ? a.avgDaysOnMarket :
          row.label === 'Listing Success Rate' ? a.listingSuccessRate :
          row.label === 'Price Reduction Rate' ? a.priceReductionRate :
          a.reviewScore
        );
        const best = row.better === 'higher' ? Math.max(...numerics) : Math.min(...numerics);
        return (
          <div key={ri} className="grid px-5 py-3"
            style={{ gridTemplateColumns: '1fr repeat(3, 1fr)', borderBottom: ri < rows.length - 1 ? `1px solid ${CARD_BD}` : undefined }}>
            <span className="text-xs" style={{ color: C_SEC }}>{row.label}</span>
            {agents.map((a, i) => {
              const isBest = numerics[i] === best;
              return (
                <div key={a.id} className="flex items-center justify-center gap-1">
                  <span className="text-xs font-semibold text-center" style={{ color: isBest ? '#ffffff' : C_TER }}>
                    {row.getValue(a)}
                  </span>
                  {isBest && (
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── Loading skeleton ───────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-24">
      <div className="relative w-14 h-14 mb-6">
        <svg width={56} height={56} viewBox="0 0 56 56" className="absolute inset-0">
          <circle cx={28} cy={28} r={24} fill="none" stroke="#2D3148" strokeWidth={4} />
          <circle cx={28} cy={28} r={24} fill="none" stroke={ACCENT} strokeWidth={4}
            strokeDasharray="50 101" strokeLinecap="round"
            style={{ animation: 'spin-ring 1s linear infinite', transformOrigin: '28px 28px' }} />
        </svg>
      </div>
      <p className="text-white font-bold text-lg">Analyzing your matches…</p>
      <p className="text-sm mt-1" style={{ color: C_SEC }}>Scoring agents against your listing criteria</p>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function SellerResultsPage() {
  const [answers, setAnswers] = useState<SellerAnswers | null>(null);
  const [ranked,  setRanked]  = useState<MockAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('sellerAnswers') : null;
    const parsed: SellerAnswers | null = raw ? JSON.parse(raw) : null;
    setAnswers(parsed);

    const blank: SellerAnswers = { address: '', estimatedValue: '', timeline: '', condition: '', agentStatus: '', priorities: [], contact: { name: '', email: '', phone: '' } };
    const scored = AGENTS.map(a => ({ agent: a, score: scoreAgent(a, parsed ?? blank) }));
    scored.sort((a, b) => b.score - a.score);
    setRanked(scored.map(s => s.agent));

    setTimeout(() => setLoading(false), 600);
  }, []);

  const blank: SellerAnswers = { address: '', estimatedValue: '', timeline: '', condition: '', agentStatus: '', priorities: [], contact: { name: '', email: '', phone: '' } };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0F1117' }}>

      {/* Nav */}
      <nav className="max-w-7xl mx-auto w-full px-5 md:px-8 py-5 flex items-center gap-4">
        <Link href="/match/seller" className="flex items-center gap-2 text-sm font-medium" style={{ color: C_SEC }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19.5 12h-15m0 0 5.625 5.625M4.5 12l5.625-5.625" />
          </svg>
          Back
        </Link>
        <span style={{ color: '#2D3148' }}>/</span>
        <span className="text-2xl font-black text-white tracking-tight">provn</span>
      </nav>

      {/* Body */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-5 py-10">
        {loading ? <LoadingState /> : (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.745 3.745 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT, letterSpacing: '0.12em' }}>
                  Matches ready
                </p>
              </div>
              <h1 className="text-3xl font-black text-white leading-tight mb-2">
                Your top 3 listing agents
              </h1>
              {answers && (
                <p className="text-sm leading-relaxed" style={{ color: C_SEC }}>
                  {answers.address ? `Matched for ${answers.address}` : 'Matched for your property'}
                  {answers.estimatedValue ? ` · Est. ${answers.estimatedValue}` : ''}
                  {answers.priorities.length > 0 ? ` · prioritizing ${answers.priorities[0].toLowerCase()}` : ''}
                </p>
              )}
            </div>

            {/* Agent cards */}
            <div className="flex flex-col gap-5 mb-8">
              {ranked.map((agent, i) => (
                <AgentCard key={agent.id} agent={agent} rank={i} answers={answers ?? blank} />
              ))}
            </div>

            {/* Comparison table */}
            <div className="mb-8">
              <ComparisonTable agents={ranked} />
            </div>

            {/* Trust note */}
            <div className="rounded-2xl p-5 mb-6" style={{ background: CARD_BG, border: `1px solid ${CARD_BD}` }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center mt-0.5"
                  style={{ background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.20)' }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12.75 11.25 15 15 9.75m-3-8.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">All data is independently verified</p>
                  <p className="text-xs leading-relaxed" style={{ color: C_SEC }}>
                    Provn scores are calculated from MLS transaction records, county assessor data, DRE license history, and verified review platforms. No agent pays to appear — rankings are purely data-driven.
                  </p>
                </div>
              </div>
            </div>

            {/* Back */}
            <div className="text-center">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: C_TER }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19.5 12h-15m0 0 5.625 5.625M4.5 12l5.625-5.625" />
                </svg>
                Back to home
              </Link>
            </div>
          </>
        )}
      </main>

      <footer className="max-w-7xl mx-auto w-full px-5 md:px-8 py-6 border-t" style={{ borderColor: CARD_BD }}>
        <span className="text-xs" style={{ color: C_TER }}>© 2026 Provn · All data sourced from MLS and public records</span>
      </footer>
    </div>
  );
}
