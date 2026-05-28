'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ── Design tokens ─────────────────────────────────────────────────────────────

const ACCENT    = '#3b82f6';
const C_SEC     = '#94A3B8';
const C_TER     = '#4B5563';
const C_INTERP  = '#CBD5E1';
const CARD_BG   = '#1A1D2E';
const CARD_BD   = '#2D3148';

const TOTAL_STEPS = 7;

// ── Data ──────────────────────────────────────────────────────────────────────

const CITIES = [
  'Santa Rosa', 'Petaluma', 'Healdsburg', 'Windsor',
  'Sebastopol', 'Sonoma', 'Rohnert Park', 'Cotati',
  'Cloverdale', 'Geyserville', 'Other',
];

const BUDGETS = [
  'Under $500K', '$500K–$750K', '$750K–$1M',
  '$1M–$1.5M', '$1.5M–$2M', '$2M–$3M', '$3M+',
];

const PROPERTY_TYPES = [
  { label: 'Single family home',      icon: 'house'    },
  { label: 'Condo or townhome',       icon: 'building' },
  { label: 'Multifamily investment',  icon: 'multi'    },
  { label: 'Land or lot',             icon: 'pin'      },
  { label: 'Vineyard or ranch',       icon: 'leaf'     },
  { label: 'New construction',        icon: 'wrench'   },
] as const;

const TIMELINES = [
  { label: 'Ready now',         sub: 'Actively looking'  },
  { label: 'Within 3 months',   sub: 'Getting serious'   },
  { label: 'Within 6 months',   sub: 'Early research'    },
  { label: 'Just exploring',    sub: 'No rush'           },
];

const FINANCING_OPTIONS = [
  { label: 'Yes — pre-approved', sub: 'Ready to make offers' },
  { label: 'In process',         sub: 'Talking to lenders'  },
  { label: 'Not yet',            sub: 'Need guidance'        },
];

const PRIORITIES = [
  'Deep neighborhood knowledge',
  'Strong negotiation track record',
  'Experience with first-time buyers',
  'Luxury or high-end experience',
  'Investment property knowledge',
  'Off-market deal access',
  'Fast responsive communication',
  'Patient and educational style',
];

// ── Icon helpers ──────────────────────────────────────────────────────────────

function PropIcon({ type, color }: { type: string; color: string }) {
  const s = { width: 20, height: 20, fill: 'none' as const, stroke: color, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (type) {
    case 'house':
      return <svg viewBox="0 0 24 24" {...s}><path d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>;
    case 'building':
      return <svg viewBox="0 0 24 24" {...s}><path d="M2.25 21h19.5M2.25 21V7.5A2.25 2.25 0 0 1 4.5 5.25h15A2.25 2.25 0 0 1 21.75 7.5V21M6.75 9.75h.008v.008H6.75V9.75Zm0 3.75h.008v.008H6.75v-.008Zm0 3.75h.008v.008H6.75v-.008Zm4.5-7.5h.008v.008h-.008V9.75Zm0 3.75h.008v.008h-.008v-.008Zm0 3.75h.008v.008h-.008v-.008Zm4.5-7.5h.008v.008h-.008V9.75Zm0 3.75h.008v.008h-.008v-.008Z" /></svg>;
    case 'multi':
      return <svg viewBox="0 0 24 24" {...s}><path d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>;
    case 'pin':
      return <svg viewBox="0 0 24 24" {...s}><path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>;
    case 'leaf':
      return <svg viewBox="0 0 24 24" {...s}><path d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.249 2.249 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" /></svg>;
    case 'wrench':
      return <svg viewBox="0 0 24 24" {...s}><path d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l5.653-4.655m5.832-5.832a3 3 0 0 0-4.243-4.243M3 3l3 3" /></svg>;
    default:
      return null;
  }
}

// ── Card styles ───────────────────────────────────────────────────────────────

function cardStyle(selected: boolean, disabled = false): React.CSSProperties {
  if (disabled) return {
    background: CARD_BG, border: `1px solid ${CARD_BD}`,
    opacity: 0.35, cursor: 'not-allowed',
  };
  if (selected) return {
    background: `rgba(59,130,246,0.12)`,
    border: `2px solid ${ACCENT}`,
    cursor: 'pointer',
  };
  return { background: CARD_BG, border: `1px solid ${CARD_BD}`, cursor: 'pointer' };
}

function labelColor(selected: boolean, disabled = false): string {
  if (disabled) return C_TER;
  return selected ? '#ffffff' : C_SEC;
}

// ── Step header ───────────────────────────────────────────────────────────────

function StepHeader({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">{label}</h2>
      {sub && <p className="mt-2 text-sm" style={{ color: C_SEC }}>{sub}</p>}
    </div>
  );
}

// ── Checkmark ─────────────────────────────────────────────────────────────────

function Check({ visible }: { visible: boolean }) {
  return (
    <span
      className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all"
      style={{
        background: visible ? ACCENT : 'transparent',
        border: `2px solid ${visible ? ACCENT : CARD_BD}`,
      }}
    >
      {visible && (
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

// ── Input field ───────────────────────────────────────────────────────────────

function Field({
  label, type = 'text', value, onChange, placeholder, required = true,
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold" style={{ color: C_SEC }}>
        {label}{!required && <span style={{ color: C_TER }}> (optional)</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder:text-[#4B5563] outline-none transition-colors"
        style={{ background: CARD_BG, border: `1px solid ${CARD_BD}` }}
        onFocus={e => { e.currentTarget.style.borderColor = `rgba(59,130,246,0.55)`; }}
        onBlur={e => { e.currentTarget.style.borderColor = CARD_BD; }}
      />
    </div>
  );
}

// ── Matching screen ───────────────────────────────────────────────────────────

function MatchingScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: '#0F1117' }}
    >
      {/* Spinner */}
      <div
        className="w-16 h-16 rounded-full mb-8"
        style={{
          border: `3px solid ${CARD_BD}`,
          borderTopColor: ACCENT,
          borderRightColor: ACCENT,
          animation: 'spin-ring 0.9s linear infinite',
        }}
      />
      <p className="text-xl font-black text-white mb-2">Finding your top matches…</p>
      <p className="text-sm" style={{ color: C_SEC, lineHeight: 1.6 }}>
        Analyzing verified MLS data · Comparing agent track records
      </p>
      <div className="flex items-center gap-2 mt-6">
        {['Checking listings closed', 'Ranking by area', 'Filtering by specialty'].map((s, i) => (
          <span
            key={s}
            className="text-xs px-2.5 py-1 rounded-full"
            style={{
              background: `rgba(59,130,246,0.10)`,
              color: ACCENT,
              border: `1px solid rgba(59,130,246,0.20)`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main flow ─────────────────────────────────────────────────────────────────

export default function BuyerFlow() {
  const router = useRouter();

  const [step,       setStep]       = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Step answers
  const [locations,     setLocations]     = useState<string[]>([]);
  const [budget,        setBudget]        = useState<string | null>(null);
  const [propTypes,     setPropTypes]     = useState<string[]>([]);
  const [timeline,      setTimeline]      = useState<string | null>(null);
  const [financing,     setFinancing]     = useState<string | null>(null);
  const [priorities,    setPriorities]    = useState<string[]>([]);
  const [contact,       setContact]       = useState({ firstName: '', lastName: '', email: '', phone: '' });

  // Scroll to top whenever step changes
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  // ── Validation ───────────────────────────────────────────────────────────

  function canContinue(): boolean {
    switch (step) {
      case 1: return locations.length > 0;
      case 2: return budget !== null;
      case 3: return propTypes.length > 0;
      case 4: return timeline !== null;
      case 5: return financing !== null;
      case 6: return priorities.length > 0;
      case 7: return (
        contact.firstName.trim().length > 0 &&
        contact.lastName.trim().length > 0 &&
        contact.email.includes('@') && contact.email.includes('.')
      );
      default: return false;
    }
  }

  // ── Navigation ───────────────────────────────────────────────────────────

  function goBack() {
    if (step > 1) setStep(s => s - 1);
    else router.push('/');
  }

  async function goNext() {
    if (step < TOTAL_STEPS) {
      setStep(s => s + 1);
      return;
    }
    // Final step — submit
    setSubmitting(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('buyerAnswers', JSON.stringify({
        locations, budget, propTypes, timeline, financing, priorities, contact,
      }));
    }
    await new Promise(r => setTimeout(r, 2000));
    router.push('/match/results?type=buyer');
  }

  // ── Toggle helpers ────────────────────────────────────────────────────────

  function toggleArr(arr: string[], val: string): string[] {
    return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
  }

  // ── Step renders ──────────────────────────────────────────────────────────

  function renderStep1() {
    return (
      <>
        <StepHeader label="Which areas are you open to?" sub="Select all that apply." />
        <div className="flex flex-wrap gap-2.5">
          {CITIES.map(city => {
            const sel = locations.includes(city);
            return (
              <button
                key={city}
                onClick={() => setLocations(prev => toggleArr(prev, city))}
                className="px-4 py-2.5 rounded-full text-sm font-semibold transition-colors"
                style={sel
                  ? { background: `rgba(59,130,246,0.15)`, border: `2px solid ${ACCENT}`, color: '#ffffff' }
                  : { background: CARD_BG, border: `1px solid ${CARD_BD}`, color: C_SEC }}
              >
                {city}
              </button>
            );
          })}
        </div>
      </>
    );
  }

  function renderStep2() {
    return (
      <>
        <StepHeader label="What's your price range?" />
        <div className="grid grid-cols-2 gap-3">
          {BUDGETS.map((b, i) => {
            const sel = budget === b;
            const isLast = i === BUDGETS.length - 1;
            return (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`rounded-2xl px-4 py-4 text-left transition-colors ${isLast ? 'col-span-2' : ''}`}
                style={cardStyle(sel)}
              >
                <span
                  className="text-base font-bold"
                  style={{ color: sel ? '#ffffff' : C_INTERP }}
                >
                  {b}
                </span>
              </button>
            );
          })}
        </div>
      </>
    );
  }

  function renderStep3() {
    return (
      <>
        <StepHeader label="What type of property are you looking for?" sub="Select all that apply." />
        <div className="grid grid-cols-2 gap-3">
          {PROPERTY_TYPES.map(pt => {
            const sel = propTypes.includes(pt.label);
            return (
              <button
                key={pt.label}
                onClick={() => setPropTypes(prev => toggleArr(prev, pt.label))}
                className="flex flex-col items-start gap-3 rounded-2xl p-4 text-left transition-colors"
                style={cardStyle(sel)}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: sel ? `rgba(59,130,246,0.20)` : 'rgba(255,255,255,0.06)' }}
                >
                  <PropIcon type={pt.icon} color={sel ? ACCENT : C_SEC} />
                </div>
                <span className="text-sm font-semibold leading-snug" style={{ color: labelColor(sel) }}>
                  {pt.label}
                </span>
              </button>
            );
          })}
        </div>
      </>
    );
  }

  function renderStep4() {
    return (
      <>
        <StepHeader label="How soon are you looking to buy?" />
        <div className="flex flex-col gap-3">
          {TIMELINES.map(t => {
            const sel = timeline === t.label;
            return (
              <button
                key={t.label}
                onClick={() => setTimeline(t.label)}
                className="flex items-center justify-between rounded-2xl px-5 py-4 text-left transition-colors"
                style={cardStyle(sel)}
              >
                <div>
                  <p className="text-sm font-bold" style={{ color: sel ? '#ffffff' : C_INTERP }}>
                    {t.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: sel ? 'rgba(255,255,255,0.65)' : C_TER }}>
                    {t.sub}
                  </p>
                </div>
                <Check visible={sel} />
              </button>
            );
          })}
        </div>
      </>
    );
  }

  function renderStep5() {
    return (
      <>
        <StepHeader
          label="Where are you with financing?"
          sub="This helps us match you with the right agent for your stage."
        />
        <div className="flex flex-col gap-3">
          {FINANCING_OPTIONS.map(f => {
            const sel = financing === f.label;
            return (
              <button
                key={f.label}
                onClick={() => setFinancing(f.label)}
                className="flex items-center justify-between rounded-2xl px-5 py-4 text-left transition-colors"
                style={cardStyle(sel)}
              >
                <div>
                  <p className="text-sm font-bold" style={{ color: sel ? '#ffffff' : C_INTERP }}>
                    {f.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: sel ? 'rgba(255,255,255,0.65)' : C_TER }}>
                    {f.sub}
                  </p>
                </div>
                <Check visible={sel} />
              </button>
            );
          })}
        </div>

        {/* Contextual note about how this feeds matching */}
        <div
          className="mt-4 rounded-xl px-4 py-3 flex items-start gap-2.5"
          style={{ background: 'rgba(59,130,246,0.06)', border: `1px solid rgba(59,130,246,0.15)` }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
            <path d="M12 16.5v-5m0-3.75h.008M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <p className="text-xs leading-relaxed" style={{ color: C_SEC, lineHeight: 1.6 }}>
            Pre-approved buyers get matched with agents who specialize in competitive offer situations.
            Unfinanced buyers are matched with agents who have strong lender referral networks.
          </p>
        </div>
      </>
    );
  }

  function renderStep6() {
    const maxReached = priorities.length >= 2;
    return (
      <>
        <StepHeader
          label="What's most important to you in an agent?"
          sub="Pick up to 2."
        />

        {/* Selection counter */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{
              background: maxReached ? `rgba(59,130,246,0.12)` : 'rgba(255,255,255,0.05)',
              border: `1px solid ${maxReached ? `rgba(59,130,246,0.30)` : CARD_BD}`,
            }}
          >
            <span className="text-xs font-bold" style={{ color: maxReached ? ACCENT : C_TER }}>
              {priorities.length} / 2 selected
            </span>
          </div>
          {maxReached && (
            <p className="text-xs" style={{ color: C_TER }}>Deselect one to change your picks</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRIORITIES.map(p => {
            const sel = priorities.includes(p);
            const disabled = maxReached && !sel;
            return (
              <button
                key={p}
                onClick={() => {
                  if (disabled) return;
                  setPriorities(prev => toggleArr(prev, p));
                }}
                className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-colors"
                style={cardStyle(sel, disabled)}
              >
                <Check visible={sel} />
                <span className="text-sm font-medium leading-snug" style={{ color: labelColor(sel, disabled) }}>
                  {p}
                </span>
              </button>
            );
          })}
        </div>
      </>
    );
  }

  function renderStep7() {
    return (
      <>
        <StepHeader
          label="Almost there — where should we send your matches?"
          sub="Your top 3 agent matches will appear instantly. We'll also send them to your email."
        />
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="First name"
              value={contact.firstName}
              onChange={v => setContact(c => ({ ...c, firstName: v }))}
              placeholder="Sarah"
            />
            <Field
              label="Last name"
              value={contact.lastName}
              onChange={v => setContact(c => ({ ...c, lastName: v }))}
              placeholder="Chen"
            />
          </div>
          <Field
            label="Email address"
            type="email"
            value={contact.email}
            onChange={v => setContact(c => ({ ...c, email: v }))}
            placeholder="sarah@example.com"
          />
          <Field
            label="Phone number"
            type="tel"
            value={contact.phone}
            onChange={v => setContact(c => ({ ...c, phone: v }))}
            placeholder="(707) 555-0100"
            required={false}
          />

          {/* Trust statement */}
          <div className="flex items-start gap-2 pt-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C_TER} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
              <path d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            <p className="text-xs leading-relaxed" style={{ color: C_TER, lineHeight: 1.6 }}>
              Your information is only shared with agents you choose to connect with.
            </p>
          </div>
        </div>
      </>
    );
  }

  // ── Matching overlay ──────────────────────────────────────────────────────

  if (submitting) return <MatchingScreen />;

  // ── Step labels for CTA button ────────────────────────────────────────────

  const ctaLabel = step === TOTAL_STEPS ? 'Find my matches' : 'Continue';

  // ── Render ────────────────────────────────────────────────────────────────

  const progressPct = Math.round((step / TOTAL_STEPS) * 100);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0F1117' }}>

      {/* ── Progress bar ─────────────────────────────────────────────────── */}
      <div className="w-full h-1" style={{ background: CARD_BD }}>
        <div
          className="h-full"
          style={{
            width: `${progressPct}%`,
            background: ACCENT,
            transition: 'width 0.35s ease',
          }}
        />
      </div>

      {/* ── Nav row ──────────────────────────────────────────────────────── */}
      <nav className="max-w-xl mx-auto w-full px-5 py-4 flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-sm font-medium transition-colors"
          style={{ color: C_SEC }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ffffff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C_SEC; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19.5 12h-15m0 0 5.625 5.625M4.5 12l5.625-5.625" />
          </svg>
          Back
        </button>

        <span className="text-lg font-black text-white tracking-tight">provn</span>

        <span className="text-xs font-semibold tabular-nums" style={{ color: C_TER }}>
          {step} of {TOTAL_STEPS}
        </span>
      </nav>

      {/* ── Step content ─────────────────────────────────────────────────── */}
      <main className="flex-1 pb-32">
        {/* key forces remount + animation on each step change */}
        <div
          key={step}
          className="max-w-xl mx-auto px-5 pt-6 pb-4"
          style={{ animation: 'step-in 0.22s ease-out' }}
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
          {step === 6 && renderStep6()}
          {step === 7 && renderStep7()}
        </div>
      </main>

      {/* ── Continue button — fixed at bottom ────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 px-5 py-4"
        style={{
          background: 'linear-gradient(to top, #0F1117 60%, transparent)',
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        }}
      >
        <div className="max-w-xl mx-auto">
          <button
            onClick={goNext}
            disabled={!canContinue()}
            className="w-full py-4 rounded-2xl text-sm font-bold transition-all"
            style={canContinue()
              ? { background: ACCENT, color: '#ffffff', cursor: 'pointer' }
              : { background: CARD_BG, border: `1px solid ${CARD_BD}`, color: C_TER, cursor: 'not-allowed' }
            }
          >
            {ctaLabel} {canContinue() ? '→' : ''}
          </button>
        </div>
      </div>

    </div>
  );
}
