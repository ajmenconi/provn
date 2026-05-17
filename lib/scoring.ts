import { Agent, LetterGrade, ResponseGrade } from '@/types/agent';

export interface ScoreBreakdown {
  transactionPerformance: number; // 0–100, weight 25%
  skinInTheGame: number;          // 0–100, weight 20%
  clientOutcomes: number;         // 0–100, weight 20%
  expertise: number;              // 0–100, weight 15%
  responsiveness: number;         // 0–100, weight 10%
  marketIntelligence: number;     // 0–100, weight 10%
}

export interface ScoringResult {
  composite: number;
  letterGrade: LetterGrade;
  breakdown: ScoreBreakdown;
}

export const SCORE_WEIGHTS: Record<keyof ScoreBreakdown, number> = {
  transactionPerformance: 0.25,
  skinInTheGame:          0.20,
  clientOutcomes:         0.20,
  expertise:              0.15,
  responsiveness:         0.10,
  marketIntelligence:     0.10,
};

// ─── helpers ────────────────────────────────────────────────────────────────

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function yearsElapsed(fromDateStr: string): number {
  return new Date().getFullYear() - new Date(fromDateStr).getFullYear();
}

function letterGradeFromScore(score: number): LetterGrade {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  return 'C';
}

// ─── sub-scorers ─────────────────────────────────────────────────────────────

/**
 * Transaction Performance (25%)
 *
 * SP/LP ratio vs market:  center at 0 delta, ±5pp → 0 or 100
 * Days on market:         lower is better, scored relative to market median
 * Price reduction rate:   lower is better, scored relative to market rate
 * Volume trajectory:      YoY growth rate mapped to 0–100
 */
function scoreTransactionPerformance(agent: Agent): number {
  const spLpDelta = agent.salePriceToListRatio - agent.salePriceToListRatioMarket;
  const spLpScore = clamp(50 + spLpDelta * 10);

  const domDelta = agent.marketMedianDaysOnMarket - agent.avgDaysOnMarket;
  const domScore = clamp(50 + (domDelta / Math.max(agent.marketMedianDaysOnMarket, 1)) * 100);

  const prDelta = agent.marketPriceReductionRate - agent.priceReductionRate;
  const prScore = clamp(50 + (prDelta / Math.max(agent.marketPriceReductionRate, 1)) * 50);

  const volGrowth =
    agent.volumePrior12Months > 0
      ? (agent.volumeLast12Months - agent.volumePrior12Months) / agent.volumePrior12Months
      : 0;
  const volScore = clamp(50 + volGrowth * 100);

  return Math.round((spLpScore + domScore + prScore + volScore) / 4);
}

/**
 * Skin in the Game (20%)
 *
 * Ownership verified:       40 pts (binary — unverified forfeits the block)
 * Properties owned:         up to 30 pts (saturates at 5+)
 * Years continuous ownership: up to 30 pts (saturates at 15+ years)
 */
function scoreSkinInTheGame(agent: Agent): number {
  const verifiedScore = agent.propertyOwnershipVerified ? 40 : 0;
  const propertiesScore = clamp(Math.min(agent.propertiesOwnedCount / 5, 1) * 30, 0, 30);
  const yearsScore = clamp(Math.min(agent.yearsOfContinuousOwnership / 15, 1) * 30, 0, 30);

  return Math.round(verifiedScore + propertiesScore + yearsScore);
}

/**
 * Client Outcomes (20%)
 *
 * Fall-through rate vs market:  40% weight, lower is better
 * Post-close survey score:      35% weight, 0–5 → 0–100
 * Weighted composite review:    25% weight, 0–5 → 0–100
 */
function scoreClientOutcomes(agent: Agent): number {
  const ftDelta = agent.marketFallThroughRate - agent.fallThroughRate;
  const ftScore = clamp(50 + (ftDelta / Math.max(agent.marketFallThroughRate, 1)) * 50);

  const surveyScore = (agent.postCloseSurveyScore / 5) * 100;
  const reviewScore = (agent.weightedCompositeScore / 5) * 100;

  return Math.round(ftScore * 0.40 + surveyScore * 0.35 + reviewScore * 0.25);
}

/**
 * Expertise (15%)
 *
 * Auto badges (MLS-verified):     up to 40 pts (saturates at 6 categories)
 * Manual badges (Provn-verified): up to 30 pts (saturates at 3 badges)
 * Years licensed:                 up to 30 pts (saturates at 20 years)
 */
function scoreExpertise(agent: Agent): number {
  const autoBadgeScore = clamp(Math.min(agent.autoBadges.length / 6, 1) * 40, 0, 40);
  const manualBadgeScore = clamp(Math.min(agent.manualBadges.length / 3, 1) * 30, 0, 30);
  const yearsScore = clamp(Math.min(yearsElapsed(agent.licenseIssueDate) / 20, 1) * 30, 0, 30);

  return Math.round(autoBadgeScore + manualBadgeScore + yearsScore);
}

/**
 * Responsiveness (10%)
 *
 * Response grade maps directly to a fixed score.
 * Measured via mystery shopper cadence — agent is unaware of test timing.
 */
function scoreResponsiveness(agent: Agent): number {
  const gradeMap: Record<ResponseGrade, number> = {
    'Under 1 hour': 100,
    'Same day':      75,
    'Next day':      40,
    'Inconsistent':  10,
  };
  return gradeMap[agent.responseGrade];
}

/**
 * Market Intelligence (10%)
 *
 * Hyperlocal concentration: up to 40 pts (top zip ≥ 50% = full score)
 * Off-market deal count:    up to 30 pts (saturates at 30 deals)
 * Years active in county:   up to 30 pts (saturates at 15 years)
 */
function scoreMarketIntelligence(agent: Agent): number {
  const topZipPct = agent.zipSpecializations[0]?.percentage ?? 0;
  const hyperlocalScore = clamp(Math.min(topZipPct / 50, 1) * 40, 0, 40);

  const offMarketScore = clamp(Math.min(agent.offMarketDealCount / 30, 1) * 30, 0, 30);

  const yearsActive = new Date().getFullYear() - agent.activeInCountySince;
  const tenureScore = clamp(Math.min(yearsActive / 15, 1) * 30, 0, 30);

  return Math.round(hyperlocalScore + offMarketScore + tenureScore);
}

// ─── public API ──────────────────────────────────────────────────────────────

export function scoreAgent(agent: Agent): ScoringResult {
  const breakdown: ScoreBreakdown = {
    transactionPerformance: scoreTransactionPerformance(agent),
    skinInTheGame:          scoreSkinInTheGame(agent),
    clientOutcomes:         scoreClientOutcomes(agent),
    expertise:              scoreExpertise(agent),
    responsiveness:         scoreResponsiveness(agent),
    marketIntelligence:     scoreMarketIntelligence(agent),
  };

  const composite = clamp(
    Math.round(
      (Object.keys(breakdown) as Array<keyof ScoreBreakdown>).reduce(
        (sum, key) => sum + breakdown[key] * SCORE_WEIGHTS[key],
        0,
      ),
    ),
  );

  return {
    composite,
    letterGrade: letterGradeFromScore(composite),
    breakdown,
  };
}
