export type IndustryId =
  | "automotive"
  | "real_estate"
  | "electronics"
  | "appliances"
  | "fashion"
  | "health"
  | "sports"
  | "agriculture"
  | "travel"
  | "services"
  | "education"
  | "universal";

export type DomainAttribute = {
  key: string;
  label: string;
  type: "string" | "number" | "boolean" | "enum";
  unit?: string;
  options?: string[];
  description: string;
  isKeySpec?: boolean;
};

export type DomainStationMilestone = {
  station: string; // e.g. "Day 1", "Month 6", "Year 1", "Year 3", "Year 5"
  month: number;
  metricLabel: string;
  metricValue: string | number;
  status: "comfortable" | "tight" | "bottleneck";
  projectedCostInr: number;
  evidenceHeadline: string;
  evidenceSeverity: 1 | 2 | 3 | 4 | 5;
  ownerReceipt?: string;
};

export type DomainOwnershipProfile = {
  horizonYears: number;
  metricName: string; // e.g. "Fuel & Service Burn", "EMI & HOA Dues", "RAM Headroom", "Cost Per Wear"
  metricUnit: string;
  stations: DomainStationMilestone[];
  tcoBreakdown: {
    label: string;
    inr: number;
    recurrence: "one_time" | "annual" | "monthly";
    provenance: "verified" | "estimated" | "statutory_tax";
  }[];
  regretClockNotice: string;
};

export type DomainProduct = {
  slug: string;
  name: string;
  brand: string;
  industry: IndustryId;
  category: string;
  subcategory?: string;
  variant?: string;
  modelYear?: number;
  priceInr: number;
  priceType: "ex_showroom" | "on_road" | "total_outright" | "monthly_sub" | "base_rate";
  priceAsOf: string;
  sourceUrl: string;
  destinationUrl: string;
  destinationLabel: "View exact listing ↗" | "View official model ↗" | "View verified portal ↗";
  seller: string;
  sellerIdentity: string;
  primaryImageUrl: string;
  galleryImageUrls?: string[];
  specsSummary: string;
  specs?: {
    ramGb: number;
    ramUpgradable: boolean;
    storageGb: number;
    weightKg: number;
    warrantyYears: number;
  };
  domainSpecs: Record<string, string | number | boolean>;
  scores: {
    performance: number;
    reliability: number;
    longevity: number;
    value: number;
    comfort?: number;
    efficiency?: number;
    safety?: number;
  };
  evidenceConfidence: number;
  provenance: Record<string, "VERIFIED" | "MANUFACTURER CLAIM" | "OWNER EVIDENCE" | "ESTIMATED">;
  bestFor: string;
  compromise: string;
  listingClaims: string[];
  observed: {
    title: string;
    share: number;
    medianMonths: number | null;
    severity: 1 | 2 | 3 | 4 | 5;
    reviewCount: number;
    receipts?: string[];
  }[];
  ownership: DomainOwnershipProfile;
  salePrediction?: {
    nextSaleName: string;
    nextSaleTiming: string;
    expectedDropPct: number;
    expectedSavingsInr: number;
    bestSaleOfYear: string;
    leastBestSale: string;
    priceHikeAlert: string;
  };
};

export type DomainClassification = {
  intent: "purchase" | "rental" | "booking" | "service_subscription" | "inquiry";
  industry: IndustryId;
  category: string;
  subcategory: string;
  market: string;
  currency: "INR" | "USD" | "EUR" | "GBP";
  budget: number;
  budgetType: "ex_showroom" | "on_road" | "total_budget" | "monthly" | "unspecified";
  userWorkloadsOrUsage: string[];
  ownershipYears: number;
  requiredAttributes: Record<string, any>;
  preferences: string[];
  city?: string;
  requiresClarification: boolean;
  missingInformation: string[];
  clarifyingQuestions: {
    id: string;
    question: string;
    options: string[];
    importance: "critical" | "high" | "nice_to_have";
  }[];
  assumptions: string[];
};

export type DomainPack = {
  id: IndustryId;
  name: string;
  description: string;
  categories: string[];
  budgetRange: { min: number; max: number; step: number; default: number };
  attributes: DomainAttribute[];
  evaluateProducts: (products: DomainProduct[], classification: DomainClassification) => DomainProduct[];
  sampleProducts: DomainProduct[];
  generateOwnership: (product: DomainProduct, classification: DomainClassification) => DomainOwnershipProfile;
};
