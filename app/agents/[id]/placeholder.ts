import { Agent } from '@/types/agent';

export const placeholderAgent: Agent = {
  id: 'sarah-chen-001',
  name: 'Sarah Chen',
  headshotUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
  headshotSource: 'zillow',
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
  totalCareerVolume: 468_000_000,
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
  highlightQuote:
    "Sarah turned what felt like an impossible situation into the best financial decision of our lives. We were competing against cash buyers — she structured an offer so clean and compelling that the sellers chose us even at the same price. We closed in 21 days. I've never felt so guided and protected in a major transaction.",
  reviewKeywordThemes: ['Responsiveness', 'Negotiation', 'Local Market Knowledge'],
  postCloseSurveyScore: 4.9,

  marketCycleTransactions: [
    {
      cycleName:        'Housing Crisis',
      years:            '2007–2012',
      startYear:        2007,
      endYear:          2012,
      transactionCount: 38,
      nationalContext:  'Home prices fell 33% nationally · Transaction volume down ~50% · Record foreclosure wave',
      notes:            'Licensed at the market peak — persisted through 5 years of collapse when most new agents quit',
      severity:         'severe',
    },
    {
      cycleName:        'Rate Headwinds',
      years:            '2018–2019',
      startYear:        2018,
      endYear:          2019,
      transactionCount: 28,
      nationalContext:  'Transaction volume down 11% nationally · Affordability squeeze in coastal markets',
      notes:            'Luxury segment resilient; leveraged off-market network to maintain deal flow',
      severity:         'moderate',
    },
    {
      cycleName:        'Rate Spike',
      years:            '2022–2023',
      startYear:        2022,
      endYear:          2023,
      transactionCount: 35,
      nationalContext:  'Rates hit 7.79% — highest since 2000 · Transaction volume down 36% nationally',
      notes:            'Off-market sourcing and investor network drove volume above career average',
      severity:         'moderate',
    },
  ],

  radarData: {
    fiveStarReviews: {
      score:          92,
      percentile:     92,
      countyMedian:   43,
      top10Threshold: 85,
      rawValue:       '161 five-star reviews · 78% five-star rate across 4 platforms',
      plainEnglish:   '161 five-star reviews across Google, Zillow, Realtor.com, and Homes.com',
    },
    localMarketExpertise: {
      score:          78,
      percentile:     76,
      countyMedian:   36,
      top10Threshold: 84,
      rawValue:       '5 active zip codes · avg 62 verified deals per zone',
      plainEnglish:   'Deep local expertise in 5 Sonoma County neighborhoods',
    },
    careerVolume: {
      score:          96,
      percentile:     96,
      countyMedian:   40,
      top10Threshold: 88,
      rawValue:       '$468M career sales volume',
      plainEnglish:   '$468M in career sales — top 4% of all active Sonoma County agents',
    },
    skinInTheGame: {
      score:          87,
      percentile:     90,
      countyMedian:   31,
      top10Threshold: 80,
      rawValue:       '4 verified properties · $3.2–$4.1M portfolio · 14 years continuous ownership',
      plainEnglish:   '4 personally owned Sonoma County properties verified through assessor records',
    },
    successfulOutcomes: {
      score:          91,
      percentile:     88,
      countyMedian:   55,
      top10Threshold: 87,
      rawValue:       '94% of all listings ever taken eventually sold',
      plainEnglish:   'Sold 94% of every listing ever taken — county average is 73%',
    },
    expertiseDepth: {
      score:          94,
      percentile:     94,
      countyMedian:   38,
      top10Threshold: 86,
      rawValue:       '494 weighted transaction points · 6 specialty categories',
      plainEnglish:   '6 specialty types including 1031 exchanges, vineyard, and multifamily sales',
    },
  },

  marketConsistency: {
    monthlyActivity: [
      // ── 2023 ──────────────────────────────────────────────
      { year: 2023, month:  6, status: 'closed'  },
      { year: 2023, month:  7, status: 'closed'  },
      { year: 2023, month:  8, status: 'closed'  },
      { year: 2023, month:  9, status: 'closed'  },
      { year: 2023, month: 10, status: 'closed'  },
      { year: 2023, month: 11, status: 'active'  }, // slower Q4
      { year: 2023, month: 12, status: 'active'  }, // holiday slowdown
      // ── 2024 ──────────────────────────────────────────────
      { year: 2024, month:  1, status: 'active'  }, // January lull
      { year: 2024, month:  2, status: 'none'    }, // rate-spike headwinds
      { year: 2024, month:  3, status: 'closed'  },
      { year: 2024, month:  4, status: 'closed'  },
      { year: 2024, month:  5, status: 'closed'  },
      { year: 2024, month:  6, status: 'closed'  },
      { year: 2024, month:  7, status: 'closed'  },
      { year: 2024, month:  8, status: 'closed'  },
      { year: 2024, month:  9, status: 'closed'  },
      { year: 2024, month: 10, status: 'closed'  },
      { year: 2024, month: 11, status: 'closed'  },
      { year: 2024, month: 12, status: 'active'  }, // holiday
      // ── 2025 ──────────────────────────────────────────────
      { year: 2025, month:  1, status: 'active'  }, // January
      { year: 2025, month:  2, status: 'closed'  },
      { year: 2025, month:  3, status: 'closed'  },
      { year: 2025, month:  4, status: 'closed'  },
      { year: 2025, month:  5, status: 'closed'  },
      { year: 2025, month:  6, status: 'closed'  },
      { year: 2025, month:  7, status: 'closed'  },
      { year: 2025, month:  8, status: 'closed'  },
      { year: 2025, month:  9, status: 'closed'  },
      { year: 2025, month: 10, status: 'closed'  },
      { year: 2025, month: 11, status: 'closed'  },
      { year: 2025, month: 12, status: 'active'  }, // holiday
      // ── 2026 ──────────────────────────────────────────────
      { year: 2026, month:  1, status: 'closed'  },
      { year: 2026, month:  2, status: 'closed'  },
      { year: 2026, month:  3, status: 'closed'  },
      { year: 2026, month:  4, status: 'closed'  },
      { year: 2026, month:  5, status: 'closed'  },
    ],
    longestGapMonths:          4,   // Nov 2023 – Feb 2024 (rate headwinds)
    avgTransactionsLast3Years: 18,  // per year
    listingsTakenLast12:       23,
    listingsClosedLast12:      21,
    expiredToCompetitorPct:    8,
    lastClosingDate:           '2026-05-03',
    marketContextNote:
      'Market conditions in late 2023 and early 2024 reflected a national rate-spike slowdown that impacted transaction volume across the industry.',
  },

  activePriceBandLow:    1_000_000,
  activePriceBandHigh:   2_000_000,
  activePriceBandCount:  147,
  mostRecentSaleDate:    '2026-05-03',
  mostRecentSalePrice:   1_340_000,
  mostRecentSaleCity:    'Healdsburg',
  disciplinaryRecord:    'clean' as const,
  soloOrTeam:            'solo' as const,
  activeListingsCount:   4,
  highestSalePrice:      4_800_000,
  yearsInLocalMarket:    42,
  brokerageTenureYears:  8,

  mediaQuality: {
    overallGrade:           'A+',
    overallScore:           94,

    photographyGrade:       'Excellent',
    photosPerListingAgent:  38,
    photosPerListingMarket: 22,
    hasTwilightShots:       true,

    videoTourRate:          78,
    marketVideoTourRate:    34,
    videoOnlyRate:          52,
    marketVideoOnlyRate:    18,
    threeDTourRate:         74,
    marketThreeDTourRate:   22,

    droneFootageRate:       91,
    marketDroneRate:        48,

    descriptionGrade:       'A+',
    avgDescriptionWords:    347,
    marketAvgWords:         156,
    descriptionSummary:     'Detailed, emotionally compelling',

    mediaFasterDays:        9,
  },

  personalCards: [
    { emoji: '🌲', label: 'Local Native',   value: 'Sonoma County · Born & raised',         verifiedVia: 'instagram' },
    { emoji: '👩‍👧‍👧', label: 'Family',        value: 'Mom to two teenage daughters',           verifiedVia: 'instagram' },
    { emoji: '🍷', label: 'Passion',        value: 'Wine collector',                          verifiedVia: 'instagram' },
    { emoji: '🚴', label: 'Hobby',          value: 'Weekend cyclist',                         verifiedVia: 'instagram' },
    { emoji: '⚾', label: 'Community',      value: 'Little League coach · Healdsburg Youth', verifiedVia: 'linkedin'  },
    { emoji: '🎓', label: 'Education',      value: 'UC Berkeley · Economics',                verifiedVia: 'linkedin'  },
    { emoji: '🏦', label: 'Prior Career',   value: 'VP · Wells Fargo Home Mortgage',         verifiedVia: 'linkedin'  },
    { emoji: '🗣️', label: 'Languages',      value: 'English · Mandarin · Cantonese'                                  },
    { emoji: '🏡', label: 'Neighborhood',   value: 'Lives in Healdsburg'                                              },
  ],
  socialVerifications: [
    { platform: 'instagram', handle: '@sarahchensono',    connected: true },
    { platform: 'linkedin',  handle: 'sarah-chen-sonoma', connected: true },
  ],

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
