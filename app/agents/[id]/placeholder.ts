import { Agent } from '@/types/agent';

export const placeholderAgent: Agent = {
  id: 'sarah-chen-001',
  name: 'Sarah Chen',
  headshotUrl: null,
  brokerageName: 'Compass Real Estate',
  brokerageLogoUrl: null,
  licenseNumber: '01923847',
  licenseType: 'Broker',
  licenseStatus: 'Active',
  licenseIssueDate: '2007-03-14',
  primaryCounty: 'Sonoma',
  primaryCity: 'Healdsburg',
  languages: ['English', 'Mandarin', 'Cantonese'],

  provnScore: 92,
  provnLetterGrade: 'A+',

  salePriceToListRatio: 103.2,
  salePriceToListRatioMarket: 99.4,
  avgDaysOnMarket: 11,
  marketMedianDaysOnMarket: 28,
  priceReductionRate: 6.1,
  marketPriceReductionRate: 14.3,
  fallThroughRate: 3.2,
  marketFallThroughRate: 7.8,
  totalCareerTransactions: 312,
  volumeLast12Months: 47_200_000,
  volumePrior12Months: 38_600_000,

  propertyOwnershipVerified: true,
  propertiesOwnedCount: 4,
  portfolioValueMin: 3_200_000,
  portfolioValueMax: 4_100_000,
  yearsOfContinuousOwnership: 14,
  battleScar:
    `"In 2019, I represented a buyer on a $2.1M vineyard property. Three days before close, the seller's trust dispute surfaced and the deal collapsed. We lost our rate lock and the client was devastated. I spent the next six months helping them secure a replacement property at a better price. The lesson: always run a preliminary title search on trust-held properties before offer, no exceptions."`,

  autoBadges: [
    { category: 'Luxury ($1M+)', transactionCount: 187 },
    { category: 'Investment / 1031', transactionCount: 43 },
    { category: 'Vineyard / Land', transactionCount: 28 },
    { category: 'New Construction', transactionCount: 19 },
    { category: 'Relocation', transactionCount: 14 },
    { category: 'Multifamily', transactionCount: 9 },
  ],
  manualBadges: [
    { label: 'Finance Background', verificationSource: 'Verified by Provn', detail: 'Former VP at Wells Fargo Home Mortgage' },
    { label: 'Tax Strategy', verificationSource: 'Verified by Provn', detail: 'Certified 1031 Exchange Specialist' },
    { label: 'Fluent: Mandarin', verificationSource: 'Verified by Provn', detail: 'Native speaker' },
  ],

  zipSpecializations: [
    { zip: '95448', label: 'Healdsburg', percentage: 51 },
    { zip: '95472', label: 'Sebastopol', percentage: 18 },
    { zip: '95476', label: 'Sonoma', percentage: 14 },
    { zip: '95404', label: 'Santa Rosa NE', percentage: 10 },
    { zip: '94558', label: 'Napa', percentage: 7 },
  ],
  offMarketDealCount: 38,
  activeInCountySince: 2007,

  writingStyleSummary:
    'Marketing copy emphasizes scarcity and urgency over lifestyle — language patterns consistent with high-pressure negotiation posture.',
  responseGrade: 'Under 1 hour',
  consistencyRating: 'Highly consistent',
  clientTypeMatch:
    'Best matched for move-up and luxury buyers in the $1.2M–$3.5M range in Healdsburg and Sebastopol.',

  reviewPlatforms: [
    { platform: 'Google', score: 4.9, reviewCount: 84, maxScore: 5 },
    { platform: 'Zillow', score: 4.8, reviewCount: 61, maxScore: 5 },
    { platform: 'Realtor.com', score: 4.7, reviewCount: 39, maxScore: 5 },
    { platform: 'Homes.com', score: 4.8, reviewCount: 22, maxScore: 5 },
  ],
  weightedCompositeScore: 4.83,
  totalVerifiedReviewCount: 206,
  mostRecentReviewDate: '2026-05-02',
  reviewKeywordThemes: ['Responsiveness', 'Negotiation', 'Local Market Knowledge'],
  postCloseSurveyScore: 4.9,

  isPremium: true,
  introVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  winStories: [
    {
      dealType: 'Competitive Offer / Luxury',
      challenge: 'Buyer was competing against 7 other offers on a $2.8M Healdsburg estate.',
      outcome: 'Won at $2.85M — $50K above list — with no inspection contingency waiver, preserving full buyer protection.',
      dollarImpact: '$2,850,000',
      clientVerified: true,
    },
    {
      dealType: '1031 Exchange / Vineyard',
      challenge: 'Client had a 45-day exchange window and couldn\'t identify a replacement vineyard property.',
      outcome: 'Identified and closed an off-market 12-acre vineyard in Dry Creek Valley within 38 days.',
      dollarImpact: '$1,650,000',
      clientVerified: true,
    },
    {
      dealType: 'Seller Representation / Probate',
      challenge: 'Inherited property with three beneficiaries and a disputed valuation.',
      outcome: 'Managed all three parties, listed at $1.1M, and closed at $1.34M — $240K above estate appraisal.',
      dollarImpact: '$1,340,000',
      clientVerified: true,
    },
  ],
  featuredNeighborhood: 'Healdsburg',
};
