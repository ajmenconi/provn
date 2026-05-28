export type LicenseType = 'Salesperson' | 'Broker';
export type LicenseStatus = 'Active' | 'Inactive';
export type ResponseGrade = 'Under 1 hour' | 'Same day' | 'Next day' | 'Inconsistent';
export type ConsistencyRating = 'Highly consistent' | 'Moderate variance' | 'Inconsistent performer';
export type LetterGrade = 'A+' | 'A' | 'B+' | 'B' | 'C';
export type SocialPlatform = 'instagram' | 'linkedin';
export type PhotographyGrade = 'Excellent' | 'Professional' | 'Standard' | 'Basic';
export type MediaGrade = 'A+' | 'A' | 'B+' | 'B' | 'C';

export interface MediaQuality {
  overallGrade:            MediaGrade;
  overallScore:            number;   // 0–100

  // Photography
  photographyGrade:        PhotographyGrade;
  photosPerListingAgent:   number;   // avg photos per listing
  photosPerListingMarket:  number;   // market avg
  hasTwilightShots:        boolean;  // twilight / golden-hour shots present

  // Video / virtual tour (combined used by MediaQuality card)
  videoTourRate:           number;   // % of listings with video or 3D tour (combined)
  marketVideoTourRate:     number;   // market average %

  // Separated video vs 3D (used by ConsumerQuickFacts)
  videoOnlyRate:           number;   // % of listings with video walkthrough only
  marketVideoOnlyRate:     number;   // market average %
  threeDTourRate:          number;   // % of listings with Matterport / 3D tour
  marketThreeDTourRate:    number;   // market average %

  // Drone / aerial
  droneFootageRate:        number;   // % of qualifying listings with aerial
  marketDroneRate:         number;   // market average %

  // Listing description
  descriptionGrade:        string;   // e.g. 'A+', 'A', 'B+'
  avgDescriptionWords:     number;   // agent's average word count
  marketAvgWords:          number;   // market average word count
  descriptionSummary:      string;   // plain-English label

  // DOM correlation
  mediaFasterDays:         number;   // days faster for high-media listings vs low-media
}

export interface MarketCycleTransaction {
  cycleName:       string;
  years:           string;
  startYear:       number;
  endYear:         number;
  transactionCount: number;
  nationalContext: string;  // e.g. "Home prices fell 33% nationally"
  notes:           string;
  severity:        'severe' | 'moderate';
}

export interface PersonalCard {
  emoji: string;
  label: string;
  value: string;
  verifiedVia?: SocialPlatform;
}

export interface SocialVerification {
  platform: SocialPlatform;
  handle: string;
  connected: boolean;
}

export interface ZipSpecialization {
  zip: string;
  label: string;
  percentage: number;
}

export interface ReviewPlatform {
  platform: string;
  score: number;
  reviewCount: number;
  maxScore: number;
}

export interface WinStory {
  dealType: string;
  challenge: string;
  outcome: string;
  dollarImpact: string;
  clientVerified: boolean;
}

export interface AutoBadge {
  category: string;
  transactionCount: number;
}

export interface ManualBadge {
  label: string;
  verificationSource: string;
  detail?: string;
}

export type HeadshotSource = 'custom' | 'zillow' | 'realtor.com' | 'auto';

// ── Radar chart ───────────────────────────────────────────────────────────────

export interface RadarAxisData {
  score:          number;  // 0-100  agent's normalized score (drives the polygon)
  percentile:     number;  // 0-100  percentile rank among platform agents
  countyMedian:   number;  // 0-100  county median score (county benchmark polygon)
  top10Threshold: number;  // 0-100  score needed to reach top 10% (top-10 polygon)
  rawValue:       string;  // e.g. "$468M" or "161 five-star reviews"
  plainEnglish:   string;  // one-line plain-English statement for stat card
}

export interface AgentRadarData {
  fiveStarReviews:      RadarAxisData;
  localMarketExpertise: RadarAxisData;
  careerVolume:         RadarAxisData;
  skinInTheGame:        RadarAxisData;
  successfulOutcomes:   RadarAxisData;
  expertiseDepth:       RadarAxisData;
}
export type MonthActivityStatus = 'closed' | 'active' | 'none';

export interface MonthlyActivityRecord {
  year:   number;
  month:  number; // 1-12
  status: MonthActivityStatus;
}

export interface MarketConsistency {
  monthlyActivity:           MonthlyActivityRecord[];  // 36 months, oldest first
  longestGapMonths:          number;                   // longest stretch without a closing
  avgTransactionsLast3Years: number;                   // per year avg
  listingsTakenLast12:       number;
  listingsClosedLast12:      number;                   // closed with same agent
  expiredToCompetitorPct:    number;                   // % of expired → different agent (low = good)
  lastClosingDate:           string;                   // ISO date
  marketContextNote?:        string;                   // explains gaps in tough market context
}

export interface Agent {
  id: string;
  name: string;
  headshotUrl: string | null;
  headshotSource?: HeadshotSource;
  brokerageName: string;
  brokerageLogoUrl: string | null;
  licenseNumber: string;
  licenseType: LicenseType;
  licenseStatus: LicenseStatus;
  licenseIssueDate: string; // ISO date string
  primaryCounty: string;
  primaryCity: string;
  languages: string[];

  provnScore: number; // 0–100
  provnLetterGrade: LetterGrade;

  // Performance
  salePriceToListRatio: number; // agent %
  salePriceToListRatioMarket: number; // market avg %
  avgDaysOnMarket: number;
  marketMedianDaysOnMarket: number;
  priceReductionRate: number; // %
  marketPriceReductionRate: number; // %
  fallThroughRate: number; // %
  marketFallThroughRate: number; // %
  totalCareerTransactions: number;
  totalCareerVolume: number; // dollars — career lifetime
  volumeLast12Months: number; // dollars
  volumePrior12Months: number; // dollars

  // Skin in the game
  propertyOwnershipVerified: boolean;
  propertiesOwnedCount: number;
  portfolioValueMin: number;
  portfolioValueMax: number;
  yearsOfContinuousOwnership: number;
  battleScar: string | null;

  // Expertise
  autoBadges: AutoBadge[];
  manualBadges: ManualBadge[];

  // Market intelligence
  zipSpecializations: ZipSpecialization[];
  offMarketDealCount: number;
  activeInCountySince: number; // year

  // AI insights
  writingStyleSummary: string;
  responseGrade: ResponseGrade;
  consistencyRating: ConsistencyRating;
  clientTypeMatch: string;

  // Social proof
  reviewPlatforms: ReviewPlatform[];
  weightedCompositeScore: number;
  totalVerifiedReviewCount: number;
  mostRecentReviewDate: string; // ISO date
  highlightQuote?: string; // pull quote from most recent 5-star review
  reviewKeywordThemes: string[];
  postCloseSurveyScore: number; // out of 5

  // Market cycles
  marketCycleTransactions?: MarketCycleTransaction[];

  // Radar chart scores (pre-computed, platform-ranked)
  radarData?: AgentRadarData;

  // Media quality
  mediaQuality?: MediaQuality;

  // Market consistency
  marketConsistency?: MarketConsistency;

  // Consumer quick facts
  activePriceBandLow:    number;     // most active price band — low end ($)
  activePriceBandHigh:   number;     // most active price band — high end ($)
  activePriceBandCount:  number;     // verified sales in that band
  mostRecentSaleDate:    string;     // ISO date
  mostRecentSalePrice:   number;     // dollars
  mostRecentSaleCity:    string;
  disciplinaryRecord:    'clean' | 'flagged';
  disciplinaryDetails?:  string;     // required if flagged
  soloOrTeam:            'solo' | 'team';
  teamSize?:             number;     // if team
  activeListingsCount:   number;     // current MLS active listings
  highestSalePrice:      number;     // career high (dollars)
  yearsInLocalMarket:    number;     // community tenure, agent-submitted
  brokerageTenureYears:  number;     // years with current brokerage

  // Beyond Real Estate
  personalCards?: PersonalCard[];
  socialVerifications?: SocialVerification[];

  // Premium
  isPremium: boolean;
  introVideoUrl: string | null;
  winStories: WinStory[];
  featuredNeighborhood: string | null;
}
