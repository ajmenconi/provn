'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const slug = query.trim();
    if (!slug) return;
    // In production: hit a search API and route to the matching agent profile.
    // For now, route directly to /agents/[slug] — works for known agent IDs.
    router.push(`/agents/${encodeURIComponent(slug)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-md mx-auto">
      <div className="relative flex-1">
        {/* Search icon */}
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#94A3B8"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Agent name or license number…"
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-[#4B5563] outline-none transition-colors focus:ring-1"
          style={{
            background: '#1A1D2E',
            border: '1px solid #2D3148',
            // ring on focus handled via focus:ring-[#3b82f6] — see inline below
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.50)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = '#2D3148'; }}
        />
      </div>

      <button
        type="submit"
        className="shrink-0 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-colors"
        style={{ background: '#2D3148' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#3b4166'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#2D3148'; }}
      >
        Look up
      </button>
    </form>
  );
}
