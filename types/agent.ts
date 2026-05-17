export type LicenseType = 'Salesperson' | 'Broker';
export type LicenseStatus = 'Active' | 'Inactive';
export type ResponseGrade = 'Under 1 hour' | 'Same day' | 'Next day' | 'Inconsistent';
export type ConsistencyRating = 'Highly consistent' | 'Moderate variance' | 'Inconsistent performer';
export type LetterGrade = 'A+' | 'A' | 'B+' | 'B' | 'C';

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

export interface Agent {
  id: string;
  name: string;
  headshotUrl: string | null;
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
  reviewKeywordThemes: string[];
  postCloseSurveyScore: number; // out of 5

  // Premium
  isPremium: boolean;
  introVideoUrl: string | null;
  winStories: WinStory[];
  featuredNeighborhood: string | null;
}
