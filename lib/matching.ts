/**
 * lib/matching.ts — Consumer-to-agent matching algorithm.
 *
 * matchAgents(consumerInputs, agentDatabase, flowType) → MatchResult[]
 *
 * Two distinct scoring paths share one function signature:
 *   - Seller path: weighted heavily toward geographic proximity + SP/LP performance
 *   - Buyer  path: weighted toward price-range fit + review score + specialty match
 *
 * Each result carries the composite match score, a plain-English match reason
 * sentence, and the top 3 data points that drove the rank — the "Why this match"
 * transparency layer that separates Provn from every other matching product.
 */

import type { Agent } from '@/types/agent';

// ── Exported types ─────────────────────────────────────────────────────────────

export type FlowType = 'buyer' | 'seller';

export interface BuyerConsumerInputs {
  locations:  string[];   // city names selected by consumer
  budget:     string;     // e.g. '$1M–$1.5M'
  propTypes:  string[];
  timeline:   string;
  financing:  string;
  priorities: string[];   // up to 2 from the flow priority list
  contact:    { name: string; email: string; phone: string };
}

export interface SellerConsumerInputs {
  address:        string;   // full address from Google Places or raw text
  estimatedValue: string;   // e.g. '$900K–$1.1M'
  timeline:       string;
  condition:      string;
  agentStatus:    string;   // silent-weighting signal
  priorities:     string[];
  contact:        { name: string; email: string; phone: string };
}

export interface ScoreBreakdown {
  geographic:          number;   // 0–100 for each dimension (pre-weight)
  priceRange:          number;
  performance:         number;
  successfulOutcomes:  number;
  priorityAlignment:   number;
  reviews?:            number;   // buyer path only
  specialty?:          number;   // buyer path only
  composite:           number;   // final weighted composite 0–100
}

export interface MatchResult {
  agent:          Agent;
  matchScore:     number;     // 0–100 composite
  matchReason:    string;     // AI-generated plain-English sentence for display
  whyDataPoints:  string[];   // top 3 data points that drove this specific rank
  scoreBreakdown: ScoreBreakdown;
}

// ── Geography: Sonoma County + adjacent market coordinates ─────────────────────
// City name → [lat, lng]
const CITY_COORDS: Readonly<Record<string, readonly [number, number]>> = {
  'healdsburg':    [38.6102, -122.8691],
  'santa rosa':    [38.4405, -122.7144],
  'petaluma':      [38.2324, -122.6368],
  'sebastopol':    [38.4024, -122.8233],
  'sonoma':        [38.2919, -122.4580],
  'windsor':       [38.5474, -122.8138],
  'rohnert park':  [38.3396, -122.7011],
  'cotati':        [38.3271, -122.7066],
  'cloverdale':    [38.8021, -122.9594],
  'geyserville':   [38.7079, -122.9008],
  'napa':          [38.2975, -122.2869],
  'novato':        [38.1074, -122.5697],
  'san rafael':    [37.9735, -122.5311],
  'glen ellen':    [38.3635, -122.5188],
  'kenwood':       [38.4163, -122.5483],
  'bodega bay':    [38.3330, -123.0522],
};

// Zip code → approximate centroid [lat, lng]
const ZIP_COORDS: Readonly<Record<string, readonly [number, number]>> = {
  '95448': [38.6102, -122.8691],  // Healdsburg
  '95401': [38.4405, -122.7144],  // Santa Rosa
  '95404': [38.4600, -122.6900],  // Santa Rosa NE
  '95403': [38.4700, -122.7300],  // Santa Rosa NW
  '95405': [38.4200, -122.6800],  // Santa Rosa SE
  '94952': [38.2324, -122.6368],  // Petaluma
  '94954': [38.2500, -122.6100],  // Petaluma E
  '95472': [38.4024, -122.8233],  // Sebastopol
  '95476': [38.2919, -122.4580],  // Sonoma
  '95492': [38.5474, -122.8138],  // Windsor
  '94928': [38.3396, -122.7011],  // Rohnert Park
  '94931': [38.3271, -122.7066],  // Cotati
  '95425': [38.8021, -122.9594],  // Cloverdale
  '95441': [38.7079, -122.9008],  // Geyserville
  '94558': [38.2975, -122.2869],  // Napa
  '94559': [38.3000, -122.2700],  // Napa East
  '94945': [38.1074, -122.5697],  // Novato
};

// ── Pure utility functions ─────────────────────────────────────────────────────

/** Haversine great-circle distance in miles between two lat/lng points. */
function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number,
): number {
  const R    = 3_958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function clamp(n: number, lo = 0, hi = 100): number {
  return Math.min(hi, Math.max(lo, n));
}

/**
 * Parse a price-range string like '$1M–$1.5M' or 'Under $500K' into [low, high].
 * Returns [0, Infinity] when the string is absent or unrecognized (e.g. 'Not sure yet').
 */
export function parsePriceRange(range: string): [number, number] {
  if (!range) return [0, Infinity];
  const up = range.toUpperCase().trim();
  if (up.includes('3M+') || up === '$3M+') return [3_000_000, Infinity];
  if (up === 'NOT SURE YET' || up === 'NOT SURE') return [0, Infinity];

  // Expand shorthand before splitting
  const cleaned = range
    .replace(/\$/g, '')
    .replace(/K/gi, '000')
    .replace(/M/gi, '000000')
    .replace(/,/g, '');

  const nums = cleaned
    .split(/[–—\-–]/)
    .map(s => parseInt(s.replace(/\D/g, ''), 10))
    .filter(n => !isNaN(n) && n > 0);

  if (nums.length >= 2) return [Math.min(...nums), Math.max(...nums)];
  if (nums.length === 1) {
    // 'Under $500K' style — treat as [0, n]
    return up.includes('UNDER') ? [0, nums[0]] : [0, nums[0]];
  }
  return [0, Infinity];
}

/**
 * Midpoint of an estimated-value string, e.g. '$900K–$1.1M' → 1_000_000.
 * Falls back to 800_000 for unparseable input.
 */
function parseEstimatedValue(val: string): number {
  const [lo, hi] = parsePriceRange(val);
  if (lo === 0 && hi === Infinity) return 800_000;
  if (hi === Infinity)             return lo;
  return (lo + hi) / 2;
}

/** Extract the city component from a Google Places formatted address. */
function extractCityFromAddress(address: string): string {
  if (!address) return '';
  const parts = address.split(',');
  if (parts.length >= 2) {
    // Second-to-last segment is typically city (last is "CA XXXXX" or "CA")
    return parts[parts.length - 2].trim().replace(/\s+\d{5}$/, '').trim();
  }
  return address.trim();
}

/** Extract the 5-digit zip code from an address string. */
function extractZipFromAddress(address: string): string {
  const match = address.match(/\b(\d{5})\b/);
  return match ? match[1] : '';
}

function lookupCityCoords(cityName: string): readonly [number, number] | null {
  return CITY_COORDS[cityName.toLowerCase()] ?? null;
}

function lookupZipCoords(zip: string): readonly [number, number] | null {
  return ZIP_COORDS[zip] ?? null;
}

/**
 * Minimum miles from a reference point to any of an agent's active zip codes
 * or their primary city. Returns Infinity if no coordinates can be resolved.
 */
function agentMinDistanceTo(
  agent: Agent,
  refLat: number,
  refLng: number,
): number {
  const distances: number[] = [];

  for (const spec of agent.zipSpecializations) {
    const coords =
      lookupZipCoords(spec.zip) ??
      lookupCityCoords(spec.label.split(' ')[0]);
    if (coords) {
      distances.push(haversineDistance(refLat, refLng, coords[0], coords[1]));
    }
  }

  const primaryCoords = lookupCityCoords(agent.primaryCity);
  if (primaryCoords) {
    distances.push(haversineDistance(refLat, refLng, primaryCoords[0], primaryCoords[1]));
  }

  return distances.length ? Math.min(...distances) : Infinity;
}

/** Dollar amount formatter for display strings. */
function fmtDollars(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000)     return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

// ── Step 1: Eligibility filter ─────────────────────────────────────────────────

/**
 * An agent is eligible for a search if they:
 *  1. Hold an active real-estate license
 *  2. Have a complete Provn profile (provnScore > 0)
 *  3. Have at least 5 verified career transactions
 *  4. Have been active (≥3 closings in 36 months) within 10 miles of the consumer's location
 */
function isEligible(
  agent: Agent,
  inputs: BuyerConsumerInputs | SellerConsumerInputs,
  flowType: FlowType,
): boolean {
  // Rule 1 — active license
  if (agent.licenseStatus !== 'Active') return false;

  // Rule 2 — complete profile
  if (!agent.provnScore || agent.provnScore <= 0) return false;

  // Rule 3 — minimum transaction history
  if (agent.totalCareerTransactions < 5) return false;

  // Rule 4 — recent geographic activity
  // Approximate "≥3 transactions within 10 miles in 36 months" using:
  //   • avgTransactionsLast3Years × 3 ≥ 3  (i.e. avg ≥ 1/yr over 3 years)
  //   • AND the agent has coverage within 10 miles of the requested location
  const annualRecent = agent.marketConsistency?.avgTransactionsLast3Years ?? 0;
  const recentCount  = annualRecent * 3; // approximate 36-month total

  // Relaxed gate: high-volume career agents with ≥50 transactions get a pass
  // on the recency gate even if data is missing — they're likely active.
  const passesRecency = recentCount >= 3 || agent.totalCareerTransactions >= 50;
  if (!passesRecency) return false;

  // Geographic coverage check
  if (flowType === 'seller') {
    const si      = inputs as SellerConsumerInputs;
    const zip     = extractZipFromAddress(si.address);
    const city    = extractCityFromAddress(si.address);
    const refCoords = lookupZipCoords(zip) ?? lookupCityCoords(city);

    if (refCoords) {
      const dist = agentMinDistanceTo(agent, refCoords[0], refCoords[1]);
      if (dist > 10) return false;
    }
    // If we can't resolve coordinates, don't disqualify — let scoring handle it
  } else {
    const bi = inputs as BuyerConsumerInputs;
    if (bi.locations.length > 0 && !bi.locations.includes('Other')) {
      const coversAtLeastOne = bi.locations.some(loc => {
        const coords = lookupCityCoords(loc);
        if (!coords) return true; // Unknown city — be permissive
        return agentMinDistanceTo(agent, coords[0], coords[1]) <= 10;
      });
      if (!coversAtLeastOne) return false;
    }
  }

  return true;
}

// ── Step 2a: Seller scoring dimensions ────────────────────────────────────────

/**
 * Geographic match (30% weight for sellers).
 * Transactions within 2 miles of subject property: heaviest weight.
 * Within 5 miles: moderate. Within 10 miles: qualifying but lower score.
 */
function scoreGeoSeller(agent: Agent, address: string): number {
  const zip    = extractZipFromAddress(address);
  const city   = extractCityFromAddress(address);
  const refCoords = lookupZipCoords(zip) ?? lookupCityCoords(city);

  if (!refCoords) {
    // Coordinate lookup failed — fall back to city-name string matching
    const cityLower = city.toLowerCase();
    const nameMatch =
      agent.zipSpecializations.some(s =>
        s.label.toLowerCase().startsWith(cityLower) ||
        cityLower.includes(s.label.toLowerCase())
      ) || agent.primaryCity.toLowerCase().includes(cityLower);
    return nameMatch ? 72 : 30;
  }

  const minDist = agentMinDistanceTo(agent, refCoords[0], refCoords[1]);

  // Non-linear decay: within 2 miles is dramatically better than 10 miles
  if (minDist <=  2) return 100;
  if (minDist <=  5) return  84;
  if (minDist <= 10) return  62;
  return 20; // Shouldn't reach here post-eligibility filter
}

/**
 * Geographic match (25% weight for buyers).
 * Scored per consumer city; average across all selected cities.
 */
function scoreGeoBuyer(agent: Agent, locations: string[]): number {
  if (locations.length === 0 || locations.includes('Other')) return 55; // neutral

  const scores = locations.map(loc => {
    const coords = lookupCityCoords(loc);
    if (!coords) {
      // Name matching fallback
      const locLower = loc.toLowerCase();
      return agent.zipSpecializations.some(s => s.label.toLowerCase().includes(locLower)) ||
        agent.primaryCity.toLowerCase().includes(locLower)
        ? 88
        : 28;
    }
    const dist = agentMinDistanceTo(agent, coords[0], coords[1]);
    if (dist <=  2) return 100;
    if (dist <=  5) return  88;
    if (dist <= 10) return  65;
    return 18;
  });

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/**
 * Price range match.
 * Measures how well the consumer's price target overlaps with the agent's
 * most active transaction band. Volume within that band adds a bonus.
 */
function scorePriceRange(agent: Agent, priceLow: number, priceHigh: number): number {
  // No budget specified — neutral score
  if (priceLow === 0 && priceHigh === Infinity) return 55;

  const { activePriceBandLow: aLo, activePriceBandHigh: aHi } = agent;
  const effectiveHigh = priceHigh === Infinity ? aHi * 2 : priceHigh;
  const overlap = priceLow <= aHi && effectiveHigh >= aLo;

  if (!overlap) {
    const midConsumer = (priceLow + effectiveHigh) / 2;
    const gap = Math.min(
      Math.abs(effectiveHigh - aLo),
      Math.abs(priceLow     - aHi),
    );
    const pctGap = midConsumer > 0 ? gap / midConsumer : 1;
    if (pctGap <= 0.15) return 58;
    if (pctGap <= 0.25) return 32;
    return 8;
  }

  // Depth of overlap as a fraction of the consumer's range
  const consumerSpan  = effectiveHigh - priceLow;
  const overlapLow    = Math.max(priceLow, aLo);
  const overlapHigh   = Math.min(effectiveHigh, aHi);
  const overlapSpan   = Math.max(0, overlapHigh - overlapLow);
  const depthPct      = consumerSpan > 0 ? overlapSpan / consumerSpan : 1;

  // Volume bonus: saturates at 200 transactions in band
  const volumeBonus = Math.min(agent.activePriceBandCount / 200, 1) * 12;

  return clamp(Math.round(58 + depthPct * 30 + volumeBonus));
}

/**
 * Performance score for sellers.
 * Combines SP/LP ratio, days on market, price reduction rate, and fall-through
 * rate — all measured relative to the same market the agent operates in.
 */
function scorePerformanceSeller(agent: Agent): number {
  // SP/LP: each percentage point above market is worth 10 score points
  const spLpDelta = agent.salePriceToListRatio - agent.salePriceToListRatioMarket;
  const spLpScore = clamp(50 + spLpDelta * 10);

  // DOM: faster relative to market is better; pct improvement mapped ±100%
  const domDelta  = agent.marketMedianDaysOnMarket - agent.avgDaysOnMarket;
  const domPct    = agent.marketMedianDaysOnMarket > 0
    ? domDelta / agent.marketMedianDaysOnMarket
    : 0;
  const domScore  = clamp(50 + domPct * 70);

  // Price reduction rate: lower than market is good
  const prDelta   = agent.marketPriceReductionRate - agent.priceReductionRate;
  const prScore   = clamp(50 + prDelta * 3.5);

  // Fall-through rate: lower than market is good
  const ftDelta   = agent.marketFallThroughRate - agent.fallThroughRate;
  const ftScore   = clamp(50 + ftDelta * 4.5);

  // SP/LP and DOM are the primary consumer-visible metrics
  return Math.round(
    spLpScore * 0.40 +
    domScore  * 0.35 +
    prScore   * 0.15 +
    ftScore   * 0.10,
  );
}

/**
 * Successful outcomes score — drawn from the agent's Provn radar data.
 * Provn's radar `successfulOutcomes` axis tracks the percentage of listings
 * ever taken that eventually closed.
 */
function scoreSuccessfulOutcomes(agent: Agent): number {
  return agent.radarData?.successfulOutcomes.score ?? Math.round(agent.provnScore * 0.94);
}

/**
 * Five-star review score — primary quality signal for buyer matching.
 * Uses the Provn radar `fiveStarReviews` axis when available; falls back to
 * a composite of weighted platform score and review volume.
 */
function scoreReviews(agent: Agent): number {
  if (agent.radarData) return agent.radarData.fiveStarReviews.score;
  const platformScore  = (agent.weightedCompositeScore / 5.0) * 80;
  const volumeBonus    = Math.min(agent.totalVerifiedReviewCount / 150, 1) * 20;
  return clamp(Math.round(platformScore + volumeBonus));
}

/**
 * Specialty match — measures depth of expertise in the consumer's specific
 * property or situation type. Pulls from `autoBadges` (MLS-verified) and
 * `offMarketDealCount`.
 */
const PRIORITY_BADGE_KEYWORDS: Record<string, string[]> = {
  'Experience with first-time buyers': ['first-time', 'first time', 'residential'],
  'Luxury or high-end experience':     ['luxury', '$1m', '1m+', 'high-end', 'estate'],
  'Investment property knowledge':     ['investment', '1031', 'multifamily', 'multi-family'],
  'Off-market deal access':            [],   // handled separately via offMarketDealCount
};

function scoreSpecialtyBuyer(agent: Agent, priorities: string[]): number {
  if (priorities.length === 0) return 50;

  const dimensionScores = priorities.map(priority => {
    if (priority === 'Off-market deal access') {
      return clamp(Math.round((agent.offMarketDealCount / 25) * 100));
    }

    const keywords = PRIORITY_BADGE_KEYWORDS[priority];
    if (!keywords) return 50; // Unknown priority — neutral

    const matchingBadges = agent.autoBadges.filter(b =>
      keywords.some(kw => b.category.toLowerCase().includes(kw)),
    );
    if (matchingBadges.length === 0) return 18;

    const totalTxns  = matchingBadges.reduce((s, b) => s + b.transactionCount, 0);
    return clamp(Math.round((totalTxns / 60) * 100));
  });

  return Math.round(dimensionScores.reduce((a, b) => a + b, 0) / dimensionScores.length);
}

/**
 * Priority alignment — translates the consumer's top priorities into
 * agent-specific scores. This is the "last 10%" weight that personalises
 * the result for the individual, not just the market.
 */
function responseGradeScore(grade: string): number {
  const map: Record<string, number> = {
    'Under 1 hour': 100,
    'Same day':      76,
    'Next day':      42,
    'Inconsistent':  12,
  };
  return map[grade] ?? 50;
}

function scorePriorityAlignmentSeller(agent: Agent, priorities: string[]): number {
  if (priorities.length === 0) return 50;

  const scores = priorities.map(p => {
    switch (p) {
      case 'Highest sale price possible':
        return clamp(50 + (agent.salePriceToListRatio - 95) * 18);
      case 'Fastest sale possible': {
        const pct = agent.marketMedianDaysOnMarket > 0
          ? (agent.marketMedianDaysOnMarket - agent.avgDaysOnMarket) / agent.marketMedianDaysOnMarket
          : 0;
        return clamp(50 + pct * 120);
      }
      case 'Professional photography and marketing':
        return agent.mediaQuality?.overallScore ?? 58;
      case 'Strong negotiation skills':
        return scoreSuccessfulOutcomes(agent);
      case 'Deep knowledge of my neighborhood':
        return agent.radarData?.localMarketExpertise.score ?? 58;
      case 'Experience with my property type':
        return clamp(40 + Math.min(agent.autoBadges.length, 6) * 8);
      case 'Clear and frequent communication':
        return responseGradeScore(agent.responseGrade);
      case 'Honest pricing advice':
        // Lower price-reduction rate than market = honest, accurate pricing
        return clamp(50 + (agent.marketPriceReductionRate - agent.priceReductionRate) * 4);
      default:
        return 50;
    }
  });

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function scorePriorityAlignmentBuyer(agent: Agent, priorities: string[]): number {
  if (priorities.length === 0) return 50;

  const scores = priorities.map(p => {
    switch (p) {
      case 'Deep neighborhood knowledge':
        return agent.radarData?.localMarketExpertise.score ?? 58;
      case 'Strong negotiation track record':
        return scoreSuccessfulOutcomes(agent);
      case 'Experience with first-time buyers': {
        const b = agent.autoBadges.find(badge => badge.category.toLowerCase().includes('first'));
        return b ? clamp(Math.round((b.transactionCount / 40) * 100)) : 20;
      }
      case 'Luxury or high-end experience': {
        const b = agent.autoBadges.find(badge =>
          badge.category.toLowerCase().includes('luxury') || badge.category.includes('$1M')
        );
        return b ? clamp(Math.round((b.transactionCount / 100) * 100)) : 18;
      }
      case 'Investment property knowledge': {
        const b = agent.autoBadges.find(badge =>
          badge.category.toLowerCase().includes('investment') || badge.category.toLowerCase().includes('1031')
        );
        return b ? clamp(Math.round((b.transactionCount / 30) * 100)) : 18;
      }
      case 'Off-market deal access':
        return clamp(Math.round((agent.offMarketDealCount / 25) * 100));
      case 'Fast responsive communication':
        return responseGradeScore(agent.responseGrade);
      case 'Patient and educational style':
        return agent.reviewKeywordThemes.some(t =>
          t.toLowerCase().includes('patient') || t.toLowerCase().includes('educat') || t.toLowerCase().includes('first')
        ) ? 84 : 48;
      default:
        return 50;
    }
  });

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// ── Step 2b: Composite score assembly ──────────────────────────────────────────

/**
 * Seller composite score.
 *
 * Weight   Dimension
 * ──────   ──────────────────────────────────────────────
 *   30%    Geographic match (proximity to subject property)
 *   25%    Price range match (agent's active price band vs estimate)
 *   20%    Performance (SP/LP, DOM, price reductions vs market)
 *   15%    Successful outcomes (Provn radar axis)
 *   10%    Priority alignment (consumer's stated priorities)
 *
 * Silent weighting: 'Yes — unhappy with current agent' input applies a 1.15×
 * multiplier to the successful-outcomes dimension. This surfaces agents with
 * the strongest track record of closing, which is what a consumer burned by
 * a prior agent most needs — without flagging it in the UI.
 */
function computeSellerScore(agent: Agent, inputs: SellerConsumerInputs): ScoreBreakdown {
  const [priceLo, priceHi] = parsePriceRange(inputs.estimatedValue);

  const geographic         = scoreGeoSeller(agent, inputs.address);
  const priceRange         = scorePriceRange(agent, priceLo, priceHi);
  const performance        = scorePerformanceSeller(agent);
  const rawOutcomes        = scoreSuccessfulOutcomes(agent);
  const priorityAlignment  = scorePriorityAlignmentSeller(agent, inputs.priorities);

  // Silent weighting: unhappy-agent case rewards closing track record
  const outcomeMultiplier  = inputs.agentStatus === 'Yes — unhappy with current agent' ? 1.15 : 1.0;
  const successfulOutcomes = Math.min(100, rawOutcomes * outcomeMultiplier);

  const composite = clamp(Math.round(
    geographic        * 0.30 +
    priceRange        * 0.25 +
    performance       * 0.20 +
    successfulOutcomes * 0.15 +
    priorityAlignment * 0.10,
  ));

  return {
    geographic, priceRange, performance,
    successfulOutcomes: rawOutcomes,
    priorityAlignment, composite,
  };
}

/**
 * Buyer composite score.
 *
 * Weight   Dimension
 * ──────   ──────────────────────────────────────────────
 *   25%    Geographic match (agent active in consumer's cities)
 *   25%    Price range match (agent's active band vs buyer budget)
 *   20%    Five-star review score (Provn radar axis)
 *   20%    Specialty match (autoBadge depth for consumer's situation)
 *   10%    Priority alignment (consumer's top 2 stated priorities)
 */
function computeBuyerScore(agent: Agent, inputs: BuyerConsumerInputs): ScoreBreakdown {
  const [priceLo, priceHi] = parsePriceRange(inputs.budget);

  const geographic         = scoreGeoBuyer(agent, inputs.locations);
  const priceRange         = scorePriceRange(agent, priceLo, priceHi);
  const reviews            = scoreReviews(agent);
  const specialty          = scoreSpecialtyBuyer(agent, inputs.priorities);
  const priorityAlignment  = scorePriorityAlignmentBuyer(agent, inputs.priorities);
  // Also compute these for the breakdown even though they aren't weighted
  const performance        = scorePerformanceSeller(agent);
  const successfulOutcomes = scoreSuccessfulOutcomes(agent);

  const composite = clamp(Math.round(
    geographic        * 0.25 +
    priceRange        * 0.25 +
    reviews           * 0.20 +
    specialty         * 0.20 +
    priorityAlignment * 0.10,
  ));

  return {
    geographic, priceRange, performance,
    successfulOutcomes, priorityAlignment,
    reviews, specialty, composite,
  };
}

// ── Step 3a: Why data points ───────────────────────────────────────────────────

/**
 * Generate the top 3 plain-English data points that explain why this agent
 * ranked where they did for this specific consumer.
 *
 * Each candidate point is paired with a weight derived from the relevant
 * scoring dimension. The top 3 by weight are selected and returned.
 * This is the "Why this match" transparency layer.
 */
function generateSellerWhyPoints(
  agent: Agent,
  inputs: SellerConsumerInputs,
  breakdown: ScoreBreakdown,
  city: string,
): string[] {
  type Candidate = { text: string; weight: number };
  const candidates: Candidate[] = [];

  // Geographic
  const areaLabel = city || agent.primaryCity;
  candidates.push({
    text:   `${agent.zipSpecializations.length} active zip code${agent.zipSpecializations.length !== 1 ? 's' : ''} covering ${areaLabel} and surrounding areas`,
    weight: breakdown.geographic,
  });

  // Price range — most specific when there's a direct band match
  const estValue  = parseEstimatedValue(inputs.estimatedValue);
  const bandMatch = estValue >= agent.activePriceBandLow * 0.85 && estValue <= agent.activePriceBandHigh * 1.15;
  candidates.push({
    text: bandMatch
      ? `${agent.activePriceBandCount} verified sales in the ${fmtDollars(agent.activePriceBandLow)}–${fmtDollars(agent.activePriceBandHigh)} price range`
      : `${agent.totalCareerTransactions} verified career transactions in ${agent.primaryCounty}`,
    weight: breakdown.priceRange,
  });

  // SP/LP performance
  const spLpDelta   = (agent.salePriceToListRatio - agent.salePriceToListRatioMarket).toFixed(1);
  const spLpSign    = parseFloat(spLpDelta) >= 0 ? '+' : '';
  candidates.push({
    text:   `${agent.salePriceToListRatio}% sale-to-list ratio (${spLpSign}${spLpDelta}% vs. ${areaLabel} market average)`,
    weight: breakdown.performance * 1.1,
  });

  // DOM
  const daysFaster = agent.marketMedianDaysOnMarket - agent.avgDaysOnMarket;
  candidates.push({
    text: daysFaster > 0
      ? `Sells ${daysFaster} days faster than the ${agent.primaryCounty} County market median`
      : `${agent.avgDaysOnMarket}-day average DOM — consistent with local market conditions`,
    weight: breakdown.performance * 0.9,
  });

  // Successful outcomes
  if (agent.radarData?.successfulOutcomes) {
    const plain = agent.radarData.successfulOutcomes.plainEnglish.split('—')[0].trim();
    candidates.push({ text: plain, weight: breakdown.successfulOutcomes });
  }

  // Media quality (when marketing is a stated priority)
  if (inputs.priorities.includes('Professional photography and marketing') && agent.mediaQuality) {
    candidates.push({
      text:   `${agent.mediaQuality.overallGrade} media quality — avg ${agent.mediaQuality.photosPerListingAgent} photos per listing vs ${agent.mediaQuality.photosPerListingMarket} market average`,
      weight: breakdown.priorityAlignment * 1.2,
    });
  }

  // Reviews
  candidates.push({
    text:   `${agent.weightedCompositeScore.toFixed(2)} composite review score across ${agent.totalVerifiedReviewCount} verified reviews`,
    weight: breakdown.successfulOutcomes * 0.85,
  });

  return candidates
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map(c => c.text);
}

function generateBuyerWhyPoints(
  agent: Agent,
  inputs: BuyerConsumerInputs,
  breakdown: ScoreBreakdown,
): string[] {
  type Candidate = { text: string; weight: number };
  const candidates: Candidate[] = [];

  // Geographic coverage
  const topZips = agent.zipSpecializations.slice(0, 2).map(s => s.label).join(' and ');
  candidates.push({
    text:   `Active transaction history in ${topZips}`,
    weight: breakdown.geographic,
  });

  // Price range depth
  candidates.push({
    text:   `${agent.activePriceBandCount} verified sales in the ${fmtDollars(agent.activePriceBandLow)}–${fmtDollars(agent.activePriceBandHigh)} range`,
    weight: breakdown.priceRange,
  });

  // Reviews
  candidates.push({
    text:   `${agent.weightedCompositeScore.toFixed(1)}-star composite rating across ${agent.totalVerifiedReviewCount} verified reviews`,
    weight: breakdown.reviews ?? 60,
  });

  // Specialty depth — most relevant badge
  const topBadge = agent.autoBadges[0];
  if (topBadge) {
    candidates.push({
      text:   `${topBadge.transactionCount} verified ${topBadge.category} transactions`,
      weight: (breakdown.specialty ?? 50) * 1.1,
    });
  }

  // Off-market access (a distinct buyer advantage)
  if (agent.offMarketDealCount > 0) {
    const offMktWeight = inputs.priorities.includes('Off-market deal access')
      ? breakdown.priorityAlignment * 1.3
      : (breakdown.specialty ?? 50) * 0.8;
    candidates.push({
      text:   `${agent.offMarketDealCount} off-market deals sourced for buyers in the past 3 years`,
      weight: offMktWeight,
    });
  }

  // Total career closings
  candidates.push({
    text:   `${agent.totalCareerTransactions.toLocaleString()} career verified closings`,
    weight: breakdown.priceRange * 0.7,
  });

  // Priority match keyword (when review themes align)
  const topTheme = agent.reviewKeywordThemes[0];
  if (topTheme) {
    candidates.push({
      text:   `Clients most frequently describe: "${topTheme}"`,
      weight: breakdown.priorityAlignment,
    });
  }

  return candidates
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map(c => c.text);
}

// ── Step 3b: Match reason sentences ───────────────────────────────────────────

/**
 * Generates a single plain-English sentence explaining why this agent ranked
 * where they did. Each rank position has a distinct framing — rank 0 leads
 * with the strongest performance signal, rank 1 with speed or volume,
 * rank 2 with the attribute most differentiated from the other two.
 */
function generateSellerMatchReason(
  agent: Agent,
  rank: number,
  city: string,
): string {
  const daysFaster = agent.marketMedianDaysOnMarket - agent.avgDaysOnMarket;
  const spLpDelta  = (agent.salePriceToListRatio - agent.salePriceToListRatioMarket).toFixed(1);
  const sign       = parseFloat(spLpDelta) >= 0 ? '+' : '';
  const areaLabel  = city || agent.primaryCity;

  if (rank === 0) {
    return `Ranked #1 for your listing — achieves ${agent.salePriceToListRatio}% of list price (${sign}${spLpDelta}% above ${areaLabel} average) with a ${agent.weightedCompositeScore.toFixed(1)}-star rating across ${agent.totalVerifiedReviewCount} verified reviews.`;
  }
  if (rank === 1) {
    return daysFaster > 0
      ? `Closes listings ${daysFaster} days faster than the ${agent.primaryCounty} market median — ${agent.totalCareerTransactions} career closings with a ${agent.weightedCompositeScore.toFixed(1)}-star composite review score.`
      : `${agent.totalCareerTransactions} verified listings in ${agent.primaryCounty} — ${agent.salePriceToListRatio}% average sale-to-list ratio with a ${agent.weightedCompositeScore.toFixed(1)}-star composite score.`;
  }
  return `${agent.totalCareerTransactions} verified listings with a transparent, data-backed pricing approach — ${agent.priceReductionRate}% price reduction rate versus the ${agent.marketPriceReductionRate}% market average.`;
}

function generateBuyerMatchReason(
  agent: Agent,
  rank: number,
  inputs: BuyerConsumerInputs,
): string {
  const topLoc   = inputs.locations[0] ?? agent.primaryCity;
  const topBadge = agent.autoBadges[0];

  if (rank === 0) {
    return `Ranked #1 for your search — ${agent.totalCareerTransactions} verified closings, a ${agent.weightedCompositeScore.toFixed(1)}-star rating across ${agent.totalVerifiedReviewCount} reviews, and ${agent.activePriceBandCount} sales in your target price range.`;
  }
  if (rank === 1) {
    return `${agent.totalCareerTransactions} verified transactions in the ${topLoc} area — ${agent.activePriceBandCount} closings in your target price range with a ${agent.weightedCompositeScore.toFixed(1)}-star rating from ${agent.totalVerifiedReviewCount} clients.`;
  }
  return topBadge
    ? `${agent.totalCareerTransactions} verified closings in ${agent.primaryCounty} — including ${topBadge.transactionCount} ${topBadge.category} transactions and a ${agent.weightedCompositeScore.toFixed(1)}-star composite review score.`
    : `${agent.totalCareerTransactions} verified closings in ${agent.primaryCounty} with a ${agent.weightedCompositeScore.toFixed(1)}-star composite review score across ${agent.totalVerifiedReviewCount} verified reviews.`;
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * matchAgents — primary export.
 *
 * @param consumerInputs  Answers from the buyer or seller flow (from localStorage)
 * @param agentDatabase   Full Agent[] from the database (or mock roster)
 * @param flowType        'buyer' | 'seller'
 * @returns               Top 3 MatchResult objects, sorted by composite score descending.
 *                        May return fewer than 3 if fewer agents pass the eligibility filter.
 */
export function matchAgents(
  consumerInputs: BuyerConsumerInputs | SellerConsumerInputs,
  agentDatabase:  Agent[],
  flowType:       FlowType,
): MatchResult[] {
  // ── Step 1: Filter ──────────────────────────────────────────────────────────
  const eligible = agentDatabase.filter(a => isEligible(a, consumerInputs, flowType));

  // ── Step 2: Score ───────────────────────────────────────────────────────────
  const scored = eligible.map(agent => {
    const breakdown = flowType === 'seller'
      ? computeSellerScore(agent, consumerInputs as SellerConsumerInputs)
      : computeBuyerScore(agent,  consumerInputs as BuyerConsumerInputs);
    return { agent, breakdown };
  });

  // ── Step 3: Sort descending by composite score ──────────────────────────────
  scored.sort((a, b) => b.breakdown.composite - a.breakdown.composite);

  // ── Step 4: Build MatchResult for top 3 ────────────────────────────────────
  return scored.slice(0, 3).map(({ agent, breakdown }, rank) => {
    const city = flowType === 'seller'
      ? extractCityFromAddress((consumerInputs as SellerConsumerInputs).address)
      : ((consumerInputs as BuyerConsumerInputs).locations[0] ?? agent.primaryCity);

    const matchReason = flowType === 'seller'
      ? generateSellerMatchReason(agent, rank, city)
      : generateBuyerMatchReason(agent, rank, consumerInputs as BuyerConsumerInputs);

    const whyDataPoints = flowType === 'seller'
      ? generateSellerWhyPoints(agent, consumerInputs as SellerConsumerInputs, breakdown, city)
      : generateBuyerWhyPoints(agent, consumerInputs as BuyerConsumerInputs, breakdown);

    return {
      agent,
      matchScore:     breakdown.composite,
      matchReason,
      whyDataPoints,
      scoreBreakdown: breakdown,
    };
  });
}
