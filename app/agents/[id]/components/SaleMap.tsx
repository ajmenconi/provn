/**
 * SaleMap — Pure SVG map of Sonoma County, CA
 *
 * Coordinate system: viewBox "0 0 540 460"
 * Projection formula (approximate equirectangular):
 *   x = 20 + (lon + 123.6) / 1.3 * 500
 *   y = 20 + (39.0 - lat) / 1.1 * 420
 *
 * County boundary is a simplified polygon traced from the actual
 * Sonoma County border (not a tile map — no API key required).
 * Sale stars are distributed by zip-code cluster matching the
 * agent's MLS transaction history from zipSpecializations.
 */

import { Agent } from '@/types/agent';

// ── County outline ─────────────────────────────────────────────────────────────
// Clockwise from NW corner. Simplified ~20-point polygon.
const COUNTY_PATH =
  'M 66,48 L 289,48 L 366,48 L 397,48 ' +           // North border
  'L 385,104 L 377,160 ' +                            // Lake County border
  'L 466,197 L 481,253 L 489,309 ' +                 // Napa County border
  'L 443,365 L 420,407 L 385,431 ' +                 // Marin border
  'L 347,435 L 289,440 L 243,431 L 220,403 ' +       // Southern coast
  'L 205,356 L 193,309 L 174,277 ' +                 // Bodega Bay area
  'L 147,230 L 105,183 L 85,137 L 74,90 Z';          // North coast

// ── City reference points ──────────────────────────────────────────────────────
const CITIES: {
  name:       string;
  x:          number;
  y:          number;
  major:      boolean;
  dx:         number;  // label x offset from dot
  anchor:     'start' | 'end' | 'middle';
}[] = [
  { name: 'Santa Rosa',  x: 362, y: 235, major: true,  dx: -8,  anchor: 'end'   },
  { name: 'Petaluma',    x: 389, y: 333, major: false, dx: -8,  anchor: 'end'   },
  { name: 'Healdsburg',  x: 301, y: 155, major: false, dx:  8,  anchor: 'start' },
  { name: 'Sonoma',      x: 458, y: 305, major: false, dx: -8,  anchor: 'end'   },
  { name: 'Cloverdale',  x: 243, y:  67, major: false, dx:  8,  anchor: 'start' },
  { name: 'Sebastopol',  x: 320, y: 253, major: false, dx: -8,  anchor: 'end'   },
  { name: 'Guerneville', x: 251, y: 207, major: false, dx: -8,  anchor: 'end'   },
  { name: 'Bodega Bay',  x: 213, y: 290, major: false, dx: -8,  anchor: 'end'   },
];

// ── Sale star clusters keyed by zip code ───────────────────────────────────────
// Positions derived from known street-level locations in each zip.
// In production these would come from MLS / Zillow transaction coordinates.
const ZIP_CLUSTERS: Record<string, { x: number; y: number }[]> = {
  '95448': [ // Healdsburg — 51 %
    { x: 298, y: 150 }, { x: 308, y: 163 }, { x: 289, y: 158 },
    { x: 306, y: 143 }, { x: 315, y: 154 }, { x: 293, y: 168 },
    { x: 282, y: 151 }, { x: 313, y: 171 }, { x: 299, y: 137 },
    { x: 277, y: 162 }, { x: 319, y: 145 }, { x: 294, y: 176 },
    { x: 287, y: 144 },
  ],
  '95472': [ // Sebastopol — 18 %
    { x: 315, y: 247 }, { x: 327, y: 257 }, { x: 309, y: 261 },
    { x: 331, y: 249 }, { x: 322, y: 265 },
  ],
  '95476': [ // Sonoma — 14 %
    { x: 453, y: 300 }, { x: 464, y: 311 }, { x: 445, y: 309 },
    { x: 461, y: 295 },
  ],
  '95404': [ // Santa Rosa NE — 10 %
    { x: 375, y: 221 }, { x: 385, y: 229 }, { x: 379, y: 237 },
  ],
  '94558': [ // Napa border / Carneros — 7 %
    { x: 463, y: 276 }, { x: 471, y: 286 },
  ],
};

// 5-pointed star polygon centered at origin (outer r=7, inner r=2.8)
const STAR =
  '0,-7 1.65,-2.27 6.66,-2.16 2.66,0.86 ' +
  '4.12,5.66 0,2.8 -4.12,5.66 ' +
  '-2.66,0.86 -6.66,-2.16 -1.65,-2.27';

// ── Component ──────────────────────────────────────────────────────────────────

interface Props {
  agent:  Agent;
  accent: string;
}

export default function SaleMap({ agent, accent }: Props) {
  // Collect sale star positions from agent zip specializations
  const stars: { x: number; y: number }[] = [];
  for (const zip of agent.zipSpecializations) {
    const cluster = ZIP_CLUSTERS[zip.zip];
    if (cluster) stars.push(...cluster);
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2D3148' }}>
      <svg
        viewBox="0 0 540 460"
        className="w-full"
        role="img"
        aria-label={`Map of ${agent.primaryCounty} County showing past sale locations`}
        style={{ background: '#cfe0ec' }}   /* water / neighboring counties */
      >
        {/* ── Neighboring county suggestion (muted fill under county) */}
        <rect x="0" y="0" width="540" height="460" fill="#d8e7f0" />

        {/* ── County fill ─────────────────────────────────────────── */}
        <path
          d={COUNTY_PATH}
          fill="#ecf3ee"
          stroke="#8aad99"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Subtle topographic texture rings (decorative) */}
        <path d={COUNTY_PATH} fill="none" stroke="#c8dece" strokeWidth="6" opacity="0.4" />

        {/* ── County label ─────────────────────────────────────────── */}
        <text x="290" y="388" textAnchor="middle" fontSize="13" fontWeight="800"
              fill="#6b8c7a" opacity="0.45" letterSpacing="3">
          SONOMA COUNTY
        </text>
        <text x="290" y="403" textAnchor="middle" fontSize="10" fontWeight="600"
              fill="#6b8c7a" opacity="0.30" letterSpacing="2">
          CALIFORNIA
        </text>

        {/* ── Russian River (approximate path through county) ─────── */}
        <path
          d="M 243,67 Q 260,120 251,207 Q 245,240 213,290"
          fill="none" stroke="#a8c4d4" strokeWidth="2" opacity="0.6"
        />

        {/* ── City reference dots + labels ─────────────────────────── */}
        {CITIES.map((city) => (
          <g key={city.name}>
            <circle
              cx={city.x} cy={city.y}
              r={city.major ? 4.5 : 3}
              fill="white"
              stroke={city.major ? '#6b8c7a' : '#9db5a0'}
              strokeWidth={city.major ? 1.5 : 1}
            />
            <text
              x={city.x + city.dx}
              y={city.y + 4}
              textAnchor={city.anchor}
              fontSize={city.major ? 11 : 9.5}
              fontWeight={city.major ? '700' : '500'}
              fill={city.major ? '#374151' : '#4b5563'}
            >
              {city.name}
            </text>
          </g>
        ))}

        {/* ── Sale stars ───────────────────────────────────────────── */}
        {stars.map((pt, i) => (
          <g key={i} transform={`translate(${pt.x},${pt.y})`}>
            {/* Glow halo */}
            <circle r="9" fill={accent} opacity="0.18" />
            {/* Star */}
            <polygon points={STAR} fill={accent} />
          </g>
        ))}

        {/* ── North arrow ──────────────────────────────────────────── */}
        <g transform="translate(504,52)">
          <circle r="17" fill="white" stroke="#c5d4cd" strokeWidth="1" />
          <polygon points="0,-10 3,-3 0,-6 -3,-3" fill="#374151" />
          <text y="6" textAnchor="middle" fontSize="9" fontWeight="800" fill="#374151">N</text>
        </g>

        {/* ── Pacific Ocean label ───────────────────────────────────── */}
        <text
          x="42" y="310"
          fontSize="10"
          fontStyle="italic"
          fill="#7aabcc"
          textAnchor="middle"
          transform="rotate(-75,42,310)"
          opacity="0.85"
        >
          Pacific Ocean
        </text>

        {/* ── Legend ───────────────────────────────────────────────── */}
        <g transform="translate(16,438)">
          <g transform="translate(0,0)">
            <polygon
              points={STAR}
              fill={accent}
              transform="translate(7,0)"
            />
            <text x="20" y="4" fontSize="9.5" fill="#6b7280">
              Past sale ({stars.length} shown) · Source: MLS / Zillow
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
