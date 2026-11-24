/**
 * VERDICT — Personal Buying Memory & My DNA Types
 * Universal, user-controlled memory architecture across all 11 industries.
 */

export type MemoryCategory =
  | "style"
  | "buying"
  | "owned_item"
  | "lifestyle"
  | "decision"
  | "dislike"
  | "compatibility"
  | "feedback";

export type MemoryType = "explicit" | "inferred";

export type MemorySource =
  | "conversation"
  | "manual"
  | "scan"
  | "purchase"
  | "inference"
  | "feedback";

export type MemoryStatus = "active" | "archived" | "rejected";

export type UserConfirmationStatus = "confirmed" | "pending" | "rejected";

export interface MemoryItem {
  id: string;
  userId: string;
  category: MemoryCategory;
  type: MemoryType;
  key: string;
  value: any; // String, array of strings, or structured record
  metadata?: Record<string, any>;
  source: MemorySource;
  confidence: number; // 0..1
  importance: 1 | 2 | 3 | 4 | 5;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  lastUsedAt?: string;
  status: MemoryStatus;
  userConfirmationStatus: UserConfirmationStatus;
  expiresAt?: string | null;
  evidenceQuote?: string; // Verbatim quote from conversation
}

export interface MemorySettings {
  isMemoryEnabled: boolean;
  categoryToggles: Record<MemoryCategory, boolean>;
  autoSuggestInferences: boolean;
  showWhyThisFits: boolean;
  dontBuyModeEnabled: boolean;
  lastUpdated: string;
}

export interface StyleDna {
  coloursLiked: string[];
  coloursDisliked: string[];
  fitPreference: "slim" | "relaxed" | "regular" | "tailored" | "oversized" | "any";
  aesthetic: "minimal" | "streetwear" | "classic" | "formal" | "athleisure" | "rugged" | "boho" | "any";
  materialsLiked: string[];
  materialsDisliked: string[];
  patterns: "subtle" | "plain" | "bold" | "stripes" | "checked" | "any";
  logoPreference: "minimal_branding" | "subtle" | "no_preference" | "bold";
  preferredBrands: string[];
  brandsToAvoid: string[];
  shoesPreference: string[];
  accessoriesPreference: string[];
  watchPreference?: string;
  formalityPreference?: "casual" | "smart_casual" | "business" | "formal";
  priceTier?: "budget" | "mid" | "premium" | "luxury";
}

export interface BuyingDna {
  valueVsPremium: "strict_value" | "balanced_quality" | "premium_first";
  budgetSensitivity: "STRICT_HARD_CAP" | "MODERATE_FLEXIBLE" | "VALUE_FIRST";
  longevityPriority: "MAXIMUM_LIFESPAN" | "BALANCED_4YEAR" | "FREQUENT_UPGRADE";
  riskTolerance: "CONSERVATIVE_ZERO_DEFECT" | "BALANCED" | "EARLY_ADOPTER";
  repairabilityImportance: "CRITICAL" | "MODERATE" | "LOW";
  refurbishedComfort: "COMFORTABLE_SAVINGS" | "CERTIFIED_ONLY" | "PREFERS_NEW";
  salePatience: "WILL_WAIT_FOR_SALES" | "NEEDS_IMMEDIATELY" | "OPPORTUNISTIC";
  dealTendency: "DISCOUNT_SEEKER" | "TOTAL_COST_OF_OWNERSHIP" | "SPECS_MAXIMALIST";
  preferredBrands: string[];
  avoidedBrands: string[];
}

export type OwnedItemCategory =
  | "wardrobe"
  | "electronics"
  | "home"
  | "automotive"
  | "appliances"
  | "accessories"
  | "sports"
  | "other";

export interface OwnedItem {
  id: string;
  userId: string;
  name: string;
  brand: string;
  category: OwnedItemCategory;
  subcategory: string; // e.g. "shirt", "trousers", "shoes", "laptop", "monitor", "charger"
  modelNumber?: string;
  color?: string;
  style?: string;
  fit?: string;
  size?: string;
  material?: string;
  occasion?: string;
  specs?: Record<string, any>; // e.g. ports, RAM, resolution, dimensions
  purchaseDate?: string;
  condition?: "NEW" | "LIKE_NEW" | "EXCELLENT" | "GOOD" | "FAIR";
  priceInr?: number;
  warrantyUntil?: string;
  imageUrl?: string;
  notes?: string;
  status: "ACTIVE_IN_USE" | "STORED" | "DISPOSED" | "PLANNING_REPLACE";
  source: "manual" | "purchase" | "scan" | "conversation";
  createdAt: string;
  updatedAt: string;
}

export interface LifestyleMemory {
  workStyle?: "remote_dev" | "office_hybrid" | "frequent_traveler" | "student" | "creator";
  commuteMode?: "public_metro" | "personal_car" | "motorcycle" | "walking" | "none";
  primaryWorkloads?: string[]; // e.g. ["programming", "docker", "light_gaming"]
  livingSpace?: "small_apartment" | "family_home" | "studio" | "campus_hostel";
  exerciseHabits?: string;
  maintenancePreference?: "minimal_hassle" | "enthusiast_diy";
}

export interface DecisionHistoryItem {
  id: string;
  userId: string;
  productName: string;
  productSlug: string;
  category: string;
  industry: string;
  priceInr: number;
  decisionDate: string;
  selectedOption: string;
  rejectedOptions: string[];
  selectionReason: string;
  satisfactionRating?: 1 | 2 | 3 | 4 | 5;
  feedbackNotes?: string;
  issuesEncountered?: string[];
  lessonsLearned?: string;
  confirmedBought: boolean;
}

export interface OutfitSuggestion {
  id: string;
  combinationTitle: string;
  occasion: string;
  formality: "casual" | "smart_casual" | "business";
  productRole: string; // e.g. "Primary Statement Top"
  ownedItemsUsed: Array<{
    id: string;
    name: string;
    subcategory: string;
    color?: string;
    brand?: string;
  }>;
  colorHarmonyExplanation: string;
  stylingAdvice: string;
  additionalPurchasesRequired: boolean;
  purchaseJustification: string;
}

export interface DontBuyEvaluation {
  isTriggered: boolean;
  severity: "SUGGEST_KEEPING_EXISTING" | "STRONG_DUPLICATION_WARNING" | "NONE";
  existingItemMatched?: {
    id: string;
    name: string;
    brand: string;
    subcategory: string;
  };
  reason: string;
  functionalOverlapPct: number; // 0..100
  upgradeJustification: string;
  respectfulRecommendation: string;
}

export interface PersonalFitResult {
  personalFitScore: number; // 0..100
  compatibilityScore: number; // 0..100
  objectiveQualityScore: number; // 0..100
  fitReasons: string[];
  riskWarnings: string[];
  dontBuyEvaluation?: DontBuyEvaluation;
  outfitSuggestions?: OutfitSuggestion[];
  reusedOwnedAccessories?: Array<{ name: string; savesMoneyInr?: number }>;
  relevantMemoriesCount: number;
}
