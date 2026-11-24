import type {
  PersonalFitResult,
  MemoryItem,
  OwnedItem,
} from "./types";
import { retrieveRelevantMemory } from "./retrieval";
import { evaluateWardrobeCompatibility, evaluateTechCompatibility, evaluateDontBuyMode } from "./compatibility";
import { DEFAULT_USER_ID, getMemorySettings } from "./store";
import { registerPersonalFitComputer } from "../engine";

export interface ComputeFitParams {
  productName: string;
  category: string;
  industry: string;
  priceInr: number;
  specs?: Record<string, any>;
  objectiveScore: number;
  userId?: string;
}

/**
 * Calculates a dedicated Personal Fit Score (0-100) and Compatibility Score (0-100)
 * entirely separate from the objective product quality score.
 */
export function computePersonalFit(params: ComputeFitParams): PersonalFitResult {
  const userId = params.userId || DEFAULT_USER_ID;
  const settings = getMemorySettings(userId);

  // If memory is disabled, return clean unpersonalized metrics (Test 7)
  if (!settings.isMemoryEnabled) {
    return {
      personalFitScore: params.objectiveScore,
      compatibilityScore: 75,
      objectiveQualityScore: params.objectiveScore,
      fitReasons: ["Objective evaluation (Personal memory disabled by user)"],
      riskWarnings: [],
      relevantMemoriesCount: 0,
    };
  }

  const memoryContext = retrieveRelevantMemory(
    params.productName,
    params.category,
    params.industry,
    userId
  );

  const fitReasons: string[] = [];
  const riskWarnings: string[] = [];

  let personalScore = params.objectiveScore;
  let compatibilityScore = 80;

  const lowerName = params.productName.toLowerCase();
  const lowerCat = params.category.toLowerCase();
  const isFashion = params.industry === "fashion" || /shirt|trousers|jeans|shoes|watch|clothing/i.test(lowerCat);
  const isElectronics = params.industry === "electronics" || /laptop|pc|macbook|monitor|phone|audio/i.test(lowerCat);

  // 1. Evaluate Fashion Wardrobe Intelligence
  let outfitSuggestions: any[] | undefined;
  if (isFashion) {
    const wardrobeEval = evaluateWardrobeCompatibility(params.productName, params.category, undefined, userId);
    compatibilityScore = wardrobeEval.wardrobeCompatibilityScore;
    outfitSuggestions = wardrobeEval.outfitSuggestions;

    if (wardrobeEval.outfitSuggestions.length > 0) {
      fitReasons.push(`Pairs with ${wardrobeEval.outfitSuggestions.length} verified outfits in your existing wardrobe.`);
      personalScore += 5;
    }
    if (wardrobeEval.duplicationWarning) {
      riskWarnings.push(wardrobeEval.duplicationWarning);
      personalScore -= 12;
    }

    // Check style DNA preferences
    for (const m of memoryContext.relevantMemories) {
      if (m.key === "colours_liked" && Array.isArray(m.value)) {
        const matchesLiked = m.value.some((c: string) => lowerName.includes(c));
        if (matchesLiked) {
          fitReasons.push(`Matches your preferred ${m.value.join(", ")} palette.`);
          personalScore += 4;
        }
      }
      if (m.key === "colours_disliked" && Array.isArray(m.value)) {
        const matchesDisliked = m.value.some((c: string) => lowerName.includes(c));
        if (matchesDisliked) {
          riskWarnings.push(`Contains tones (${m.value.join(", ")}) you previously chose to avoid.`);
          personalScore -= 15;
        }
      }
      if (m.key === "aesthetic" && m.value === "minimal") {
        fitReasons.push("Aligns with your preference for clean, minimalist aesthetics.");
        personalScore += 3;
      }
    }
  }

  // 2. Evaluate Electronics & Tech Compatibility
  let reusedAccessories: any[] | undefined;
  if (isElectronics) {
    const techEval = evaluateTechCompatibility(params.productName, params.specs || {}, userId);
    compatibilityScore = techEval.compatibilityScore;
    reusedAccessories = techEval.reusedOwnedAccessories;

    if (techEval.reusedOwnedAccessories.length > 0) {
      fitReasons.push(`Reuses ${techEval.reusedOwnedAccessories.length} owned accessories (${techEval.reusedOwnedAccessories.map(a => a.name.split(' ')[0]).join(', ')}), saving substantial setup costs.`);
      personalScore += 6;
    }

    // Check battery & longevity feedback (Test 10)
    for (const m of memoryContext.relevantMemories) {
      if (m.category === "feedback" && m.value?.complaint === "battery_worse_than_expected") {
        riskWarnings.push("Audited against your past negative battery experience: battery endurance scrutinized under stress benchmarks.");
        personalScore -= 4; // Prioritizes high endurance
      }
      if (m.key === "longevity_priority" && m.value === "MAXIMUM_LIFESPAN") {
        fitReasons.push("Screened for your 5-year maximum lifespan priority.");
        personalScore += 3;
      }
    }
  }

  // 3. Evaluate Don't-Buy Mode (Section 14 & Test 6)
  const dontBuyEval = evaluateDontBuyMode(
    params.productName,
    params.category,
    params.priceInr,
    params.specs,
    userId
  );

  if (dontBuyEval.isTriggered) {
    riskWarnings.push(dontBuyEval.respectfulRecommendation);
    if (dontBuyEval.severity === "STRONG_DUPLICATION_WARNING") {
      personalScore -= 20;
    }
  }

  // Clamp scores between 0 and 100
  const finalPersonalFit = Math.min(100, Math.max(10, Math.round(personalScore)));
  const finalCompatibility = Math.min(100, Math.max(10, Math.round(compatibilityScore)));

  if (fitReasons.length === 0) {
    fitReasons.push("Consistent with your general purchasing DNA and budget profile.");
  }

  return {
    personalFitScore: finalPersonalFit,
    compatibilityScore: finalCompatibility,
    objectiveQualityScore: Math.round(params.objectiveScore),
    fitReasons,
    riskWarnings,
    dontBuyEvaluation: dontBuyEval,
    outfitSuggestions,
    reusedOwnedAccessories: reusedAccessories,
    relevantMemoriesCount: memoryContext.relevantMemories.length + memoryContext.relevantOwnedItems.length,
  };
}

// Automatically register with evaluation engine in server environments
registerPersonalFitComputer(computePersonalFit);
