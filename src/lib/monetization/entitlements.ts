/**
 * VERDICT — Subscription Architecture & Entitlements Engine
 * 
 * Manages Free Tier vs VERDICT PLUS entitlements.
 * Subscription prices and capabilities are configurable through this module.
 */

export type SubscriptionTier = "FREE" | "PLUS";

export interface PlanPricing {
  monthlyInr: number;
  annualInr: number;
  savingsPercentage: number;
}

export const VERDICT_PRICING: PlanPricing = {
  monthlyInr: 499,
  annualInr: 3999, // ~₹333/month (33% discount)
  savingsPercentage: 33,
};

export interface FeatureEntitlement {
  maxSavedCaseFiles: number;
  maxActivePriceWatches: number;
  maxOwnershipHorizonYears: number;
  canExportThermalReceipts: boolean;
  canExportCalendarIcs: boolean;
  unlimitedWhatIfSimulator: boolean;
  canUseAutonomousSnipeMode: boolean; // Autopilot Mode 3
  priorityRadarRefresh: boolean;
  advancedBuyerDnaShifting: boolean;
  detailedClaimsLedger: boolean;
  sponsoredAdFree: boolean;
}

export const TIER_ENTITLEMENTS: Record<SubscriptionTier, FeatureEntitlement> = {
  FREE: {
    maxSavedCaseFiles: 3,
    maxActivePriceWatches: 2,
    maxOwnershipHorizonYears: 2,
    canExportThermalReceipts: false,
    canExportCalendarIcs: true, // Kept accessible for free utility
    unlimitedWhatIfSimulator: false,
    canUseAutonomousSnipeMode: false, // Restricted to Notify + Approval
    priorityRadarRefresh: false,
    advancedBuyerDnaShifting: false,
    detailedClaimsLedger: true,
    sponsoredAdFree: false,
  },
  PLUS: {
    maxSavedCaseFiles: 999,
    maxActivePriceWatches: 999,
    maxOwnershipHorizonYears: 5,
    canExportThermalReceipts: true,
    canExportCalendarIcs: true,
    unlimitedWhatIfSimulator: true,
    canUseAutonomousSnipeMode: true,
    priorityRadarRefresh: true,
    advancedBuyerDnaShifting: true,
    detailedClaimsLedger: true,
    sponsoredAdFree: true,
  },
};

const STORAGE_KEY = "verdict_user_subscription_tier";

/**
 * Returns current user subscription tier from local storage with FREE fallback.
 */
export function getCurrentSubscriptionTier(): SubscriptionTier {
  if (typeof window !== "undefined") {
    try {
      const tier = localStorage.getItem(STORAGE_KEY);
      if (tier === "PLUS") return "PLUS";
    } catch {
      // fallback
    }
  }
  return "FREE";
}

/**
 * Updates current user subscription tier.
 */
export function setSubscriptionTier(tier: SubscriptionTier): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, tier);
    } catch {
      // fallback
    }
  }
}

/**
 * Checks if a specific feature is permitted under the active tier.
 */
export function isFeatureAllowed(feature: keyof FeatureEntitlement): boolean {
  const currentTier = getCurrentSubscriptionTier();
  const entitlements = TIER_ENTITLEMENTS[currentTier];
  const value = entitlements[feature];

  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  return true;
}

/**
 * Returns the complete active entitlement profile.
 */
export function getActiveEntitlements(): FeatureEntitlement {
  const currentTier = getCurrentSubscriptionTier();
  return TIER_ENTITLEMENTS[currentTier];
}
