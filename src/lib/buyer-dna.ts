export interface BuyerDnaProfile {
  id: string;
  budgetSensitivity: "STRICT_HARD_CAP" | "MODERATE_FLEXIBLE" | "VALUE_FIRST";
  riskTolerance: "CONSERVATIVE_ZERO_DEFECT" | "BALANCED" | "EARLY_ADOPTER";
  longevityPriority: "MAXIMUM_LIFESPAN" | "BALANCED_4YEAR" | "FREQUENT_UPGRADE";
  preferredBrands: string[];
  avoidedBrands: string[];
  repairabilityImportance: "CRITICAL" | "MODERATE" | "LOW";
  isPersonalizationEnabled: boolean;
  updatedAt: string;
}

export const DEFAULT_BUYER_DNA: BuyerDnaProfile = {
  id: "buyer-dna-primary",
  budgetSensitivity: "MODERATE_FLEXIBLE",
  riskTolerance: "CONSERVATIVE_ZERO_DEFECT",
  longevityPriority: "MAXIMUM_LIFESPAN",
  preferredBrands: ["Tata", "Hyundai", "Sony", "Bosch", "Apple", "Acer"],
  avoidedBrands: ["Generic Unbranded", "No Name"],
  repairabilityImportance: "CRITICAL",
  isPersonalizationEnabled: true,
  updatedAt: new Date().toISOString(),
};

export function getStoredBuyerDna(): BuyerDnaProfile {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("verdict_buyer_dna");
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
  }
  return { ...DEFAULT_BUYER_DNA };
}

export function saveBuyerDna(profile: Partial<BuyerDnaProfile>): BuyerDnaProfile {
  const current = getStoredBuyerDna();
  const updated: BuyerDnaProfile = {
    ...current,
    ...profile,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("verdict_buyer_dna", JSON.stringify(updated));
    } catch {
      // fallback
    }
  }
  return updated;
}

export function resetBuyerDna(): BuyerDnaProfile {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("verdict_buyer_dna");
    } catch {
      // fallback
    }
  }
  return { ...DEFAULT_BUYER_DNA, updatedAt: new Date().toISOString() };
}

/**
 * Dynamically adjusts scoring criteria weights according to buyer's DNA profile
 */
export function applyDnaToWeights<T extends Record<string, number>>(
  baseWeights: T,
  dna: Partial<BuyerDnaProfile>
): T {
  if (dna.isPersonalizationEnabled === false) return baseWeights;

  const adjusted: Record<string, number> = { ...baseWeights };

  // If buyer has strict hard cap or value first, boost priceToValue or price/value key if present
  const budgetSens = dna.budgetSensitivity || "MODERATE_FLEXIBLE";
  if (budgetSens === "STRICT_HARD_CAP" || budgetSens === "VALUE_FIRST" || (budgetSens as string) === "strict_budget") {
    for (const key of Object.keys(adjusted)) {
      if (key.toLowerCase().includes("price") || key.toLowerCase().includes("value")) {
        adjusted[key] = adjusted[key] + 0.10;
      }
    }
  }

  // If buyer demands conservative zero-defect longevity, boost reliability/build weight
  const riskTol = dna.riskTolerance || "CONSERVATIVE_ZERO_DEFECT";
  if (riskTol === "CONSERVATIVE_ZERO_DEFECT" || (riskTol as string) === "conservative") {
    for (const key of Object.keys(adjusted)) {
      if (
        key.toLowerCase().includes("reliab") ||
        key.toLowerCase().includes("build") ||
        key.toLowerCase().includes("quality")
      ) {
        adjusted[key] = adjusted[key] + 0.10;
      }
    }
  }

  // If buyer demands maximum lifespan
  const longev = dna.longevityPriority || "MAXIMUM_LIFESPAN";
  if (longev === "MAXIMUM_LIFESPAN" || (longev as string) === "5_years") {
    for (const key of Object.keys(adjusted)) {
      if (
        key.toLowerCase().includes("battery") ||
        key.toLowerCase().includes("longev") ||
        key.toLowerCase().includes("durab")
      ) {
        adjusted[key] = adjusted[key] + 0.05;
      }
    }
  }

  // Renormalize so weights sum to 1.0
  const total = Object.values(adjusted).reduce((a, b) => a + b, 0);
  if (total <= 0) return baseWeights;

  const result: Record<string, number> = {};
  for (const [k, v] of Object.entries(adjusted)) {
    result[k] = Number((v / total).toFixed(4));
  }
  return result as T;
}
