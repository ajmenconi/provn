'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// ── Global Window augmentation for Google Places ──────────────────────────────

declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            opts?: object,
          ) => GoogleAutocomplete;
        };
      };
    };
    __sellerPlacesReady?: () => void;
  }
}

interface GoogleAutocomplete {
  addListener(event: string, cb: () => void): void;
  getPlace(): {
    formatted_address?: string;
    geometry?: { location: { lat(): number; lng(): number } };
    address_components?: Array<{ long_name: string; types: string[] }>;
  };
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface AddressData {
  formatted:    string;
  lat:          number | null;
  lng:          number | null;
  zip:          string;
  neighborhood: string;
  city:         string;
}

// ── Design tokens ─────────────────────────────────────────────────────────────

const ACCENT   = '#10b981';   // green — seller flow
const C_SEC    = '#94A3B8';
const C_TER    = '#4B5563';
const C_INTERP = '#CBD5E1';
const CARD_BG  = '#1A1D2E';
const CARD_BD  = '#2D3148';

const TOTAL_STEPS = 7;

// ── Data ──────────────────────────────────────────────────────────────────────

const BUDGETS = [
  'Under $500K', '$500K–$750K', '$750K–$1M',
  '$1M–$1.5M', '$1.5M–$2M', '$2M–$3M', '$3M+',
];

const SELLER_TIMELINES = [
  { label: 'Need to sell within 60 days', sub: 'Urgent'            },
  { label: 'Within 3–6 months',           sub: 'Planning ahead'    },
  { label: 'Within the year',             sub: 'No rush'           },
  { label: 'Just exploring my options',   sub: 'No commitment yet' },
];

const CONDITIONS = [
  { label: 'Move-in ready',         sub: 'Updated and well maintained'        },
  { label: 'Good condition',        sub: 'Minor updates needed'               },
  { label: 'Needs some work',       sub: 'Cosmetic or functional repairs'     },
  { label: 'Major renovation',      sub: 'Or as-is sale'                      },
];

const AGENT_STATUS = [
  { label: 'No — starting fresh',               sub: 'Haven\'t spoken with anyone yet' },
  { label: 'Yes — looking for a second opinion', sub: 'Want to compare options'         },
  { label: 'Yes — unhappy with current agent',   sub: 'Looking for a change'            },
];

const SELLER_PRIORITIES = [
  'Highest sale price possible',
  'Fastest sale possible',
  'Professional photography and marketing',
  'Strong negotiation skills',
  'Deep knowledge of my neighborhood',
  'Experience with my property type',
  'Clear and frequent communication',
  'Honest pricing advice',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function cardStyle(selected: boolean, disabled = false): React.CSSProperties {
  if (disabled) return {
    background: CARD_BG, border: `1px solid ${CARD_BD}`,
    opacity: 0.35, cursor: 'not-allowed',
  };
  if (selected) return {
    background: 'rgba(16,185,129,0.10)',
    border: `2px solid ${ACCENT}`,
    cursor: 'pointer',
  };
  return { background: CARD_BG, border: `1px solid ${CARD_BD}`, cursor: 'pointer' };
}

function labelColor(selected: boolean, disabled = false): string {
  if (disabled) return C_TER;
  return selected ? '#ffffff' : C_SEC;
}

function toggleArr(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StepHeader({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">{label}</h2>
      {sub && <p className="mt-2 text-sm" style={{ color: C_SEC }}>{sub}</p>}
    </div>
  );
}

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
        className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder:text-[#4B5563] outline-none"
        style={{ background: CARD_BG, border: `1px solid ${CARD_BD}` }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.50)'; }}
        onBlur={e => { e.currentTarget.style.borderColor = CARD_BD; }}
      />
    </div>
  );
}

// ── Address autocomplete (Google Places) ──────────────────────────────────────

function AddressInput({
  addressText,
  onTextChange,
  onPlaceSelect,
}: {
  addressText:    string;
  onTextChange:   (v: string) => void;
  onPlaceSelect:  (data: AddressData) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const apiKey   = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Use refs so the effect closure never goes stale
  const onTextChangeRef  = useRef(onTextChange);
  const onPlaceSelectRef = useRef(onPlaceSelect);
  onTextChangeRef.current  = onTextChange;
  onPlaceSelectRef.current = onPlaceSelect;

  useEffect(() => {
    if (!apiKey || !inputRef.current) return;

    function initAutocomplete() {
      if (!window.google?.maps?.places || !inputRef.current) return;

      const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' },
        fields: ['formatted_address', 'geometry', 'address_components'],
      });

      ac.addListener('place_changed', () => {
        const place = ac.getPlace();
        const get = (type: string) =>
          place.address_components?.find(c => c.types.includes(type))?.long_name ?? '';

        const formatted = place.formatted_address ?? inputRef.current!.value;
        onTextChangeRef.current(formatted);
        onPlaceSelectRef.current({
          formatted,
          lat:          place.geometry?.location.lat() ?? null,
          lng:          place.geometry?.location.lng() ?? null,
          zip:          get('postal_code'),
          neighborhood: get('neighborhood') || get('sublocality_level_1') || get('sublocality'),
          city:         get('locality'),
        });
      });
    }

    // Script already fully loaded
    if (window.google?.maps?.places) {
      initAutocomplete();
      return;
    }

    // Script already injected but still loading — poll
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const poll = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(poll);
          initAutocomplete();
        }
      }, 100);
      return () => clearInterval(poll);
    }

    // First load — inject script with callback
    window.__sellerPlacesReady = initAutocomplete;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=__sellerPlacesReady`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, [apiKey]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        {/* Map pin icon */}
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C_TER} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={addressText}
          onChange={e => onTextChange(e.target.value)}
          placeholder="123 Main St, Healdsburg, CA 95448…"
          className="w-full pl-11 pr-4 py-4 rounded-xl text-sm text-white placeholder:text-[#4B5563] outline-none"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BD}` }}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.50)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = CARD_BD; }}
        />
      </div>

      {!apiKey && (
        <p className="text-xs px-1" style={{ color: C_TER }}>
          ℹ️ Set{' '}
          <code className="font-mono" style={{ color: C_SEC }}>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>
          {' '}to enable address autocomplete.
        </p>
      )}
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
      <div
        className="w-16 h-16 rounded-full mb-8"
        style={{
          border: `3px solid ${CARD_BD}`,
          borderTopColor: ACCENT,
          borderRightColor: ACCENT,
          animation: 'spin-ring 0.9s linear infinite',
        }}
      />
      <p className="text-xl font-black text-white mb-2">Finding your top listing agents…</p>
      <p className="text-sm" style={{ color: C_SEC, lineHeight: 1.6 }}>
        Analyzing sale-price-to-list ratios · Comparing marketing quality
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
        {['Checking your zip', 'Ranking by SP/LP ratio', 'Filtering by specialty'].map((s, i) => (
          <span
            key={s}
            className="text-xs px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(16,185,129,0.10)',
              color: ACCENT,
              border: '1px solid rgba(16,185,129,0.20)',
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

export default function SellerFlow() {
  const router = useRouter();

  const [step,       setStep]       = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1 — address
  const [addressText,   setAddressText]   = useState('');
  const [addressData,   setAddressData]   = useState<AddressData>({
    formatted: '', lat: null, lng: null, zip: '', neighborhood: '', city: '',
  });

  // Steps 2–6
  const [estimatedValue, setEstimatedValue] = useState<string | null>(null);
  const [timeline,       setTimeline]       = useState<string | null>(null);
  const [condition,      setCondition]      = useState<string | null>(null);
  const [agentStatus,    setAgentStatus]    = useState<string | null>(null);
  const [priorities,     setPriorities]     = useState<string[]>([]);

  // Step 7 — contact
  const [contact, setContact] = useState({ firstName: '', lastName: '', email: '', phone: '' });

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  // ── Validation ──────────────────────────────────────────────────────────────

  function canContinue(): boolean {
    switch (step) {
      case 1: return addressText.trim().length > 0;
      case 2: return estimatedValue !== null;
      case 3: return timeline !== null;
      case 4: return condition !== null;
      case 5: return agentStatus !== null;
      case 6: return priorities.length > 0;
      case 7: return (
        contact.firstName.trim().length > 0 &&
        contact.lastName.trim().length > 0 &&
        contact.email.includes('@') && contact.email.includes('.')
      );
      default: return false;
    }
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  function goBack() {
    if (step > 1) setStep(s => s - 1);
    else router.push('/');
  }

  async function goNext() {
    if (step < TOTAL_STEPS) { setStep(s => s + 1); return; }

    setSubmitting(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sellerAnswers', JSON.stringify({
        address:       { ...addressData, formatted: addressText },
        estimatedValue,
        timeline,
        condition,
        agentStatus,   // silent weighting handled by results page
        priorities,
        contact,
      }));
    }
    await new Promise(r => setTimeout(r, 2000));
    router.push('/match/results?type=seller');
  }

  // ── Step renders ────────────────────────────────────────────────────────────

  function renderStep1() {
    return (
      <>
        <StepHeader
          label="What's the address of the home you want to sell?"
          sub="We use this to find agents with the strongest track record in your specific neighborhood."
        />
        <AddressInput
          addressText={addressText}
          onTextChange={setAddressText}
          onPlaceSelect={setAddressData}
        />

        {/* Show extracted data confirmation when a place is fully resolved */}
        {addressData.zip && (
          <div
            className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.20)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <div>
              <p className="text-xs font-semibold" style={{ color: ACCENT }}>Address confirmed</p>
              <p className="text-xs mt-0.5" style={{ color: C_SEC }}>
                {[addressData.neighborhood, addressData.city, addressData.zip].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>
        )}
      </>
    );
  }

  function renderStep2() {
    return (
      <>
        <StepHeader
          label="What's your estimated home value?"
          sub="Don't worry about being exact — we use this to match you with agents who specialize in your price range."
        />
        <div className="grid grid-cols-2 gap-3">
          {BUDGETS.map((b, i) => {
            const sel    = estimatedValue === b;
            const isLast = i === BUDGETS.length - 1;
            return (
              <button
                key={b}
                onClick={() => setEstimatedValue(b)}
                className={`rounded-2xl px-4 py-4 text-left transition-colors ${isLast ? 'col-span-2' : ''}`}
                style={cardStyle(sel)}
              >
                <span className="text-base font-bold" style={{ color: sel ? '#ffffff' : C_INTERP }}>
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
        <StepHeader label="When are you hoping to sell?" />
        <div className="flex flex-col gap-3">
          {SELLER_TIMELINES.map(t => {
            const sel = timeline === t.label;
            return (
              <button
                key={t.label}
                onClick={() => setTimeline(t.label)}
                className="flex items-center justify-between rounded-2xl px-5 py-4 text-left transition-colors"
                style={cardStyle(sel)}
              >
                <div>
                  <p className="text-sm font-bold" style={{ color: sel ? '#ffffff' : C_INTERP }}>{t.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: sel ? 'rgba(255,255,255,0.65)' : C_TER }}>{t.sub}</p>
                </div>
                <Check visible={sel} />
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
        <StepHeader
          label="How would you describe the property condition?"
          sub="This helps match you with agents experienced with your property type."
        />
        <div className="flex flex-col gap-3">
          {CONDITIONS.map(c => {
            const sel = condition === c.label;
            return (
              <button
                key={c.label}
                onClick={() => setCondition(c.label)}
                className="flex items-center justify-between rounded-2xl px-5 py-4 text-left transition-colors"
                style={cardStyle(sel)}
              >
                <div>
                  <p className="text-sm font-bold" style={{ color: sel ? '#ffffff' : C_INTERP }}>{c.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: sel ? 'rgba(255,255,255,0.65)' : C_TER }}>{c.sub}</p>
                </div>
                <Check visible={sel} />
              </button>
            );
          })}
        </div>

        {/* Contextual note — shown only for distressed conditions */}
        {(condition === 'Needs some work' || condition === 'Major renovation') && (
          <div
            className="mt-4 flex items-start gap-2.5 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
              <path d="M12 16.5v-5m0-3.75h.008M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <p className="text-xs leading-relaxed" style={{ color: C_SEC, lineHeight: 1.6 }}>
              We'll prioritize agents with verified experience in as-is sales, probate, and distressed property listings.
            </p>
          </div>
        )}
      </>
    );
  }

  function renderStep5() {
    return (
      <>
        <StepHeader label="Where are you in the process?" />
        <div className="flex flex-col gap-3">
          {AGENT_STATUS.map(a => {
            const sel = agentStatus === a.label;
            return (
              <button
                key={a.label}
                onClick={() => setAgentStatus(a.label)}
                className="flex items-center justify-between rounded-2xl px-5 py-4 text-left transition-colors"
                style={cardStyle(sel)}
              >
                <div>
                  <p className="text-sm font-bold" style={{ color: sel ? '#ffffff' : C_INTERP }}>{a.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: sel ? 'rgba(255,255,255,0.65)' : C_TER }}>{a.sub}</p>
                </div>
                <Check visible={sel} />
              </button>
            );
          })}
        </div>
      </>
    );
  }

  function renderStep6() {
    const maxReached = priorities.length >= 2;
    return (
      <>
        <StepHeader label="What's your top priority?" sub="Pick up to 2." />

        <div className="flex items-center gap-2 mb-4">
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{
              background:   maxReached ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)',
              border:       `1px solid ${maxReached ? 'rgba(16,185,129,0.30)' : CARD_BD}`,
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
          {SELLER_PRIORITIES.map(p => {
            const sel      = priorities.includes(p);
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
          label="Where should we send your matches?"
          sub="Your top 3 listing agents will appear instantly. We'll also send them to your email."
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

  // ── Matching overlay ────────────────────────────────────────────────────────

  if (submitting) return <MatchingScreen />;

  // ── Render ──────────────────────────────────────────────────────────────────

  const progressPct = Math.round((step / TOTAL_STEPS) * 100);
  const ctaLabel    = step === TOTAL_STEPS ? 'Find my listing agent' : 'Continue';

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0F1117' }}>

      {/* ── Progress bar ──────────────────────────────────────────────────── */}
      <div className="w-full h-1" style={{ background: CARD_BD }}>
        <div
          className="h-full"
          style={{ width: `${progressPct}%`, background: ACCENT, transition: 'width 0.35s ease' }}
        />
      </div>

      {/* ── Nav row ───────────────────────────────────────────────────────── */}
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

      {/* ── Step content ──────────────────────────────────────────────────── */}
      <main className="flex-1 pb-32">
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

      {/* ── Continue button — fixed bottom ────────────────────────────────── */}
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
            {ctaLabel}{canContinue() ? ' →' : ''}
          </button>
        </div>
      </div>

    </div>
  );
}
