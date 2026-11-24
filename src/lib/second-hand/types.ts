/**
 * VERDICT — Second-Hand, Pre-Owned & Refurbished Market Intelligence Types
 */

export type PurchaseCondition =
  | "NEW"
  | "CERTIFIED_PRE_OWNED"
  | "REFURBISHED"
  | "OPEN_BOX"
  | "USED"
  | "ANY";

export type UsedDealAction =
  | "BUY"
  | "BUY_IF_NEGOTIATED"
  | "INSPECT_FIRST"
  | "WAIT"
  | "AVOID";

export type ValuationConfidence =
  | "STRONGLY_SUPPORTED"
  | "MODERATELY_SUPPORTED"
  | "WEAK_ESTIMATE";

export interface ConditionComparisonRow {
  factor: string;
  newProduct: string;
  refurbished: string;
  used: string;
  notes?: string;
}

export interface NewVsUsedMatrix {
  productName: string;
  category: string;
  newPriceInr: number;
  refurbishedPriceInr: number;
  usedMarketPriceInr: number;
  certifiedPreOwnedPriceInr: number;
  refurbishedSavingsInr: number;
  refurbishedSavingsPct: number;
  usedSavingsInr: number;
  usedSavingsPct: number;
  warrantyComparison: {
    newMonths: number;
    refurbishedMonths: number;
    usedMonths: number;
  };
  lifespanComparison: {
    newYears: number;
    refurbishedYears: number;
    usedYears: number;
  };
  factors: ConditionComparisonRow[];
  recommendation: {
    verdict: "BUY_NEW" | "BUY_REFURBISHED" | "BUY_USED";
    headline: string;
    reasoning: string;
    criticalConditions: string[];
    maxRecommendedUsedPriceInr: number;
  };
}

export interface UsedListing {
  id: string;
  title: string;
  model: string;
  variant?: string;
  askingPriceInr: number;
  condition: "LIKE_NEW" | "EXCELLENT" | "GOOD" | "FAIR";
  conditionType: PurchaseCondition;
  ageMonths: number;
  usageDescription: string;
  warrantyRemainingMonths: number;
  hasOriginalInvoice: boolean;
  hasOriginalBoxAndAccessories: boolean;
  locationCity: string;
  sellerType: "CERTIFIED_DEALER" | "PLATFORM_ASSURED" | "INDIVIDUAL_VERIFIED" | "INDIVIDUAL_UNVERIFIED";
  sellerRating: number;
  marketplaceSource: string;
  destinationUrl: string;
  imageUrl?: string;
  isVerifiedListing: boolean;
  listingDate: string;
}

export interface FairPriceValuation {
  askingPriceInr: number;
  fairPriceMinInr: number;
  fairPriceMaxInr: number;
  fairPriceMedianInr: number;
  priceDeltaInr: number; // positive = overpriced, negative = good deal
  priceDeltaPct: number;
  dealQuality: "OUTSTANDING_DEAL" | "FAIR_MARKET_PRICE" | "SLIGHTLY_OVERPRICED" | "OVERPRICED" | "SUSPICIOUSLY_CHEAP";
  confidence: ValuationConfidence;
  comparableListingsCount: number;
  marketContextExplanation: string;
}

export interface UsedDealScore {
  overallScore: number; // 0 - 100
  fairPriceScore: number;
  conditionScore: number;
  riskScore: number; // higher = higher risk
  recommendedAction: UsedDealAction;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  summaryHeadline: string;
  actionReasoning: string[];
  mandatoryPrePurchaseSteps: string[];
}

export interface InspectionCheckItem {
  id: string;
  label: string;
  category: string;
  severity: "CRITICAL" | "HIGH" | "RECOMMENDED";
  howToInspect: string;
  redFlagDescription: string;
}

export interface NegotiationStrategy {
  askingPriceInr: number;
  suggestedOpeningOfferInr: number;
  reasonableTargetPriceInr: number;
  walkAwayPriceInr: number;
  negotiationPoints: string[];
  copyableSellerMessage: string;
}

export interface UsedRegretHorizonItem {
  horizon: "IMMEDIATE_DELIVERY" | "3_MONTHS" | "1_YEAR" | "2_YEARS";
  riskTitle: string;
  riskDescription: string;
  estimatedExpenseInr: number;
  preventiveInspectionCheck: string;
}
