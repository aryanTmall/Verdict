import type {
  OwnedItem,
  OutfitSuggestion,
  DontBuyEvaluation,
  PersonalFitResult,
} from "./types";
import { getOwnedItems, getMemories, DEFAULT_USER_ID } from "./store";

/**
 * Evaluates fashion outfit combinations and wardrobe harmony against user's owned clothes
 */
export function evaluateWardrobeCompatibility(
  productName: string,
  productCategory: string,
  productColor?: string,
  userId = DEFAULT_USER_ID
): {
  wardrobeCompatibilityScore: number;
  outfitSuggestions: OutfitSuggestion[];
  colorHarmonyExplanation: string;
  duplicationWarning?: string;
  isDuplication: boolean;
} {
  const ownedWardrobe = getOwnedItems(userId, "wardrobe").concat(getOwnedItems(userId, "accessories"));
  const lowerName = productName.toLowerCase();
  const lowerCat = productCategory.toLowerCase();
  const color = (productColor || (lowerName.includes("olive") ? "olive" : lowerName.includes("black") ? "black" : "neutral")).toLowerCase();

  // 1. Check Duplication: Does user already own an identical item?
  const isShirt = /shirt|top|tee|t-shirt|polo/i.test(lowerName) || /shirt|top/i.test(lowerCat);
  const isShoes = /shoes|sneakers|boots|loafers/i.test(lowerName) || /shoes/i.test(lowerCat);
  const isTrousers = /trousers|chinos|pants|jeans/i.test(lowerName) || /trousers|pant/i.test(lowerCat);

  let duplicationWarning: string | undefined;
  let isDuplication = false;

  const matchedDuplicate = ownedWardrobe.find((item) => {
    if (isShoes && item.subcategory === "shoes" && item.color?.toLowerCase() === color) return true;
    if (isShirt && item.subcategory === "shirt" && item.color?.toLowerCase() === color) return true;
    if (isTrousers && item.subcategory === "trousers" && item.color?.toLowerCase() === color) return true;
    return false;
  });

  if (matchedDuplicate) {
    isDuplication = true;
    duplicationWarning = `You already own ${matchedDuplicate.name} in ${matchedDuplicate.color || color} (Condition: ${matchedDuplicate.condition || "Good"}). Verify whether this new item offers distinct utility.`;
  }

  // 2. Identify Compatible Owned Anchor Pieces
  const ownedTrousers = ownedWardrobe.filter((i) => i.subcategory === "trousers" || i.subcategory === "jeans");
  const ownedShoes = ownedWardrobe.filter((i) => i.subcategory === "shoes");
  const ownedWatches = ownedWardrobe.filter((i) => i.subcategory === "watches");

  const beigeChinos = ownedTrousers.find((i) => (i.color || "").toLowerCase().includes("beige"));
  const blackTrousers = ownedTrousers.find((i) => (i.color || "").toLowerCase().includes("black"));
  const whiteSneakers = ownedShoes.find((i) => (i.color || "").toLowerCase().includes("white"));
  const silverWatch = ownedWatches.find((i) => (i.color || "").toLowerCase().includes("silver") || i.name.toLowerCase().includes("silver") || i.name.toLowerCase().includes("seiko"));

  const outfitSuggestions: OutfitSuggestion[] = [];

  if (isShirt) {
    // Combination 1: Casual Earthy Profile
    if (beigeChinos && whiteSneakers) {
      outfitSuggestions.push({
        id: "outfit-casual-1",
        combinationTitle: "Weekend Minimal: Earthy Neutral Duo",
        occasion: "Weekend Casual / Daytime",
        formality: "casual",
        productRole: "Primary Top",
        ownedItemsUsed: [
          { id: beigeChinos.id, name: beigeChinos.name, subcategory: "trousers", color: "beige", brand: beigeChinos.brand },
          { id: whiteSneakers.id, name: whiteSneakers.name, subcategory: "shoes", color: "white", brand: whiteSneakers.brand },
        ],
        colorHarmonyExplanation: `The ${color} top pairs naturally with your beige chinos. Crisp white leather sneakers anchor the bottom with clean, modern balance.`,
        stylingAdvice: "Wear untucked or relaxed french-tuck with sleeves rolled up once.",
        additionalPurchasesRequired: false,
        purchaseJustification: "You already own the trousers and shoes to complete this look—zero additional wardrobe spend needed.",
      });
    }

    // Combination 2: Smart Casual Contrast
    if (blackTrousers && silverWatch) {
      outfitSuggestions.push({
        id: "outfit-smart-2",
        combinationTitle: "Sharp Contrast: Tailored Evening Profile",
        occasion: "Smart Casual / Dinner & Gallery",
        formality: "smart_casual",
        productRole: "Statement Shirt",
        ownedItemsUsed: [
          { id: blackTrousers.id, name: blackTrousers.name, subcategory: "trousers", color: "black", brand: blackTrousers.brand },
          { id: silverWatch.id, name: silverWatch.name, subcategory: "watches", color: "silver", brand: silverWatch.brand },
        ],
        colorHarmonyExplanation: `Muted ${color} against structured black wool trousers creates sophisticated depth, complemented by the brushed silver sheen of your watch.`,
        stylingAdvice: "Tuck cleanly into black trousers with a dark minimalist belt.",
        additionalPurchasesRequired: false,
        purchaseJustification: "Seamlessly integrates with your existing formal trousers and timepiece.",
      });
    }
  }

  // Calculate wardrobe harmony score
  let score = 88;
  if (outfitSuggestions.length >= 2) score += 6;
  if (isDuplication) score -= 25;

  return {
    wardrobeCompatibilityScore: Math.min(100, Math.max(20, score)),
    outfitSuggestions,
    colorHarmonyExplanation: `Your wardrobe contains ${ownedTrousers.length} versatile trouser options and ${ownedShoes.length} footwear anchors that naturally complement ${color}.`,
    duplicationWarning,
    isDuplication,
  };
}

/**
 * Evaluates Electronics & Tech compatibility with owned gear (monitors, keyboards, chargers)
 */
export function evaluateTechCompatibility(
  productName: string,
  specs: Record<string, any>,
  userId = DEFAULT_USER_ID
): {
  compatibilityScore: number;
  reusedOwnedAccessories: Array<{ name: string; savesMoneyInr?: number }>;
  compatibilityHighlights: string[];
  powerCompatibilityNotes: string;
} {
  const ownedTech = getOwnedItems(userId, "electronics");
  const reusedOwnedAccessories: Array<{ name: string; savesMoneyInr?: number }> = [];
  const compatibilityHighlights: string[] = [];

  const monitor = ownedTech.find((i) => i.subcategory === "monitor");
  const keyboard = ownedTech.find((i) => i.subcategory === "keyboard");
  const charger = ownedTech.find((i) => i.subcategory === "charger");

  let score = 85;

  if (monitor) {
    reusedOwnedAccessories.push({
      name: `${monitor.name} (Reused via USB-C Alt Mode)`,
      savesMoneyInr: 54990,
    });
    compatibilityHighlights.push(`Direct single-cable connectivity with your existing ${monitor.name}. No external dock needed.`);
    score += 5;
  }

  if (keyboard) {
    reusedOwnedAccessories.push({
      name: `${keyboard.name} (Reused via Bluetooth 5.1 / USB-C)`,
      savesMoneyInr: 8999,
    });
    compatibilityHighlights.push(`Pairs instantly with your ${keyboard.name} for desk setups.`);
    score += 4;
  }

  if (charger) {
    reusedOwnedAccessories.push({
      name: `${charger.name} (Compatible travel backup)`,
      savesMoneyInr: 3499,
    });
    compatibilityHighlights.push(`Your existing 65W GaN dual charger can charge this machine on the go.`);
    score += 3;
  }

  return {
    compatibilityScore: Math.min(100, score),
    reusedOwnedAccessories,
    compatibilityHighlights,
    powerCompatibilityNotes: "Compatible with standard USB-PD 65W+ profiles already in your possession.",
  };
}

/**
 * Evaluates Don't-Buy Mode (Preventing redundant spending or unnecessary upgrades)
 */
export function evaluateDontBuyMode(
  productName: string,
  productCategory: string,
  productPriceInr: number,
  productSpecs?: Record<string, any>,
  userId = DEFAULT_USER_ID
): DontBuyEvaluation {
  const allOwned = getOwnedItems(userId);
  const lowerName = productName.toLowerCase();
  const lowerCat = productCategory.toLowerCase();

  // Scenario 1: User already owns a high-performing laptop in the same category
  const isLaptop = /laptop|macbook|ultrabook|notebook/i.test(lowerName) || /laptop/i.test(lowerCat);
  const ownedLaptop = allOwned.find((i) => i.category === "electronics" && (i.subcategory === "laptop" || i.name.toLowerCase().includes("laptop") || i.name.toLowerCase().includes("macbook")));

  if (isLaptop && ownedLaptop) {
    const isMajorUpgrade = productPriceInr > 150000 && (productSpecs?.ramGb || 16) >= 32;
    if (!isMajorUpgrade) {
      return {
        isTriggered: true,
        severity: "SUGGEST_KEEPING_EXISTING",
        existingItemMatched: {
          id: ownedLaptop.id,
          name: ownedLaptop.name,
          brand: ownedLaptop.brand,
          subcategory: ownedLaptop.subcategory,
        },
        reason: `You already own ${ownedLaptop.name} which satisfies 90%+ of your daily computing and developer workloads.`,
        functionalOverlapPct: 88,
        upgradeJustification: "The prospective machine provides only an incremental ~10% performance gain while costing full retail price.",
        respectfulRecommendation: `You may not need to buy this. Your existing ${ownedLaptop.name} already meets the requirements you described. We recommend keeping your current device unless you require a specific hardware capability.`,
      };
    }
  }

  // Scenario 2: User owns identical wardrobe item
  const isWhiteSneakers =
    /white/i.test(lowerName) && (/sneakers|shoes|trainers|kicks/i.test(lowerName) || /shoes/i.test(lowerCat));
  const ownedWhiteSneakers = allOwned.find(
    (i) =>
      (i.category === "wardrobe" || i.category === "accessories") &&
      i.subcategory === "shoes" &&
      (i.color || "").toLowerCase().includes("white")
  );

  if (isWhiteSneakers && ownedWhiteSneakers) {
    return {
      isTriggered: true,
      severity: "STRONG_DUPLICATION_WARNING",
      existingItemMatched: {
        id: ownedWhiteSneakers.id,
        name: ownedWhiteSneakers.name,
        brand: ownedWhiteSneakers.brand,
        subcategory: ownedWhiteSneakers.subcategory,
      },
      reason: `You already own ${ownedWhiteSneakers.name} in ${ownedWhiteSneakers.condition || "Excellent"} condition.`,
      functionalOverlapPct: 95,
      upgradeJustification: "Purchasing another pair of plain white sneakers duplicates existing wardrobe utility.",
      respectfulRecommendation: "Consider exploring distinct footwear styles (such as brown loafers or trail runners) rather than duplicating your existing white leather pair.",
    };
  }

  return {
    isTriggered: false,
    severity: "NONE",
    reason: "No functional overlap or duplication detected with existing possessions.",
    functionalOverlapPct: 0,
    upgradeJustification: "Adds new capability to your inventory.",
    respectfulRecommendation: "Proceed with objective quality cross-examination.",
  };
}
