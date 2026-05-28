/**
 * /match/seller — Seller matching flow.
 * Stub page. Full flow to be built in next prompt.
 */
import Link from 'next/link';

const C_SEC = '#94A3B8';
const C_TER = '#4B5563';

export default function SellerMatchPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0F1117' }}>

      {/* Nav */}
      <nav className="max-w-7xl mx-auto w-full px-5 md:px-8 py-5 flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium transition-colors"
          style={{ color: C_SEC }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19.5 12h-15m0 0 5.625 5.625M4.5 12l5.625-5.625" />
          </svg>
          Back
        </Link>
        <span className="text-[#2D3148] select-none">/</span>
        <span className="text-2xl font-black text-white tracking-tight">provn</span>
      </nav>

      {/* Body */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 md:px-8 py-16">
        <div className="w-full max-w-lg text-center">

          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              <path d="M15 12.75h.75a1.5 1.5 0 0 1 1.5 1.5v1.5" />
              <path d="M14.25 16.5h2.25" />
            </svg>
          </div>

          <p
            className="uppercase tracking-widest font-semibold mb-3"
            style={{ fontSize: '11px', color: '#10b981', letterSpacing: '0.12em' }}
          >
            Seller matching
          </p>

          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
            Find your listing agent
          </h1>

          <p className="text-sm leading-relaxed mb-8" style={{ color: C_SEC, lineHeight: 1.7 }}>
            This flow will ask about your home — location, price range, timeline —
            and match you with the 3 listing agents in Sonoma County who have the
            strongest verified sale-price-to-list ratio, days-on-market, and
            local specialization for your property type.
          </p>

          <div
            className="rounded-2xl px-6 py-5 text-sm text-left"
            style={{ background: '#1A1D2E', border: '1px solid #2D3148' }}
          >
            <p className="font-semibold text-white mb-1">Coming in the next build</p>
            <p style={{ color: C_SEC, lineHeight: 1.6 }}>
              Step-by-step intake: address · price estimate · timeline ·
              seller priority (speed, price, certainty) → ranked listing agent
              matches with verified performance head-to-head.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-8 text-sm font-semibold px-5 py-3 rounded-xl transition-colors"
            style={{ background: '#1A1D2E', border: '1px solid #2D3148', color: C_SEC }}
          >
            ← Back to home
          </Link>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-5 md:px-8 py-6 border-t" style={{ borderColor: '#2D3148' }}>
        <span className="text-xs" style={{ color: C_TER }}>© 2026 Provn · All data sourced from MLS and public records</span>
      </footer>

    </div>
  );
}
