export * from "./engine";

export type MissionParseResult = {
  profile: import("./engine").Profile;
  assumptionsMade: string[];
  clarifyingQuestion: string | null;
  aiAnswer?: string;
  recommendedProductSlugs?: string[];
  category?: string;
  catalogProducts?: any[];
  cached?: boolean;
};

export type ClaimReceipt = {
  quote: string;
  monthsUsed: number | null;
};

export type ClaimVerification = {
  claim: string;
  status: "supported" | "contradicted" | "unverifiable";
  supportCount: number;
  contradictCount: number;
  receipts: ClaimReceipt[];
};

export type ClaimsAuditResponse = {
  productSlug: string;
  results: ClaimVerification[];
  cached?: boolean;
};

export type NarrationResult = {
  headline: string;
  regretParagraph: string;
  whatWouldChangeMyMind: string;
  cached?: boolean;
};

export type AskResponse = {
  answer: string;
  citations: string[];
  cached?: boolean;
};

export type IdentifyResponse = {
  matchSlug: string | null;
  confidence: number;
  productName?: string;
  message: string;
  cached?: boolean;
};

export type SavedVerdict = {
  id: string;
  slug: string;
  createdAt: string;
  mission: string;
  productSlug: string;
  productName: string;
  brand: string;
  priceInr: number;
  verdictKind: "buy" | "wait" | "avoid" | "alternative";
  caution: boolean;
  reason: string;
  confidence: number;
  fitScore: number;
  tcoInr: number;
  topRiskTitle: string;
  profile: import("./engine").Profile;
  evaluation: import("./engine").Evaluation;
};

export type ReviewItem = {
  id: string;
  rating: number;
  body: string;
  date: string;
  verified: boolean;
  monthsUsed?: number | null;
  failureModes?: string[];
  flags?: string[];
};

export type CatalogProduct = import("./engine").Product & {
  category?: string;
  specsSummary?: string;
  retailerName?: string;
  retailerUrl?: string;
  bestFor?: string;
  compromise?: string;
  listingClaims?: string[];
  salePrediction?: any;
};
