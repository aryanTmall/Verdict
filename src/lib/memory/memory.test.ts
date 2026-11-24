import { describe, it, expect, beforeEach } from "vitest";
import {
  saveMemory,
  getMemories,
  updateMemory,
  deleteMemory,
  clearAllMemories,
  updateMemorySettings,
  getMemorySettings,
  saveOwnedItem,
  getOwnedItems,
  resetToSeedDefaults,
  extractMemoriesFromText,
  retrieveRelevantMemory,
  evaluateWardrobeCompatibility,
  evaluateTechCompatibility,
  evaluateDontBuyMode,
  computePersonalFit,
  DEFAULT_USER_ID,
} from "./index";

describe("VERDICT — Personal Buying Memory & My DNA Verification Suite", () => {
  beforeEach(() => {
    // Reset to verified seed state before each test
    resetToSeedDefaults(DEFAULT_USER_ID);
    updateMemorySettings({ isMemoryEnabled: true }, DEFAULT_USER_ID);
  });

  // Test 1 — Fashion Wardrobe Compatibility
  it("Test 1: Fashion — Evaluates outfit compatibility against owned beige chinos, black trousers, white sneakers and silver watch for an olive shirt", () => {
    const userId = "test-user-fashion-1";
    resetToSeedDefaults(userId);

    // Verify user owns the 4 anchor items
    const owned = getOwnedItems(userId);
    expect(owned.some((i) => i.subcategory === "trousers" && i.color === "beige")).toBe(true);
    expect(owned.some((i) => i.subcategory === "trousers" && i.color === "black")).toBe(true);
    expect(owned.some((i) => i.subcategory === "shoes" && i.color === "white")).toBe(true);
    expect(owned.some((i) => i.subcategory === "watches")).toBe(true);

    const result = evaluateWardrobeCompatibility("Olive Button-Down Oxford Shirt", "shirt", "olive", userId);

    expect(result.wardrobeCompatibilityScore).toBeGreaterThanOrEqual(85);
    expect(result.outfitSuggestions.length).toBeGreaterThanOrEqual(2);

    // Combination 1: Casual with beige chinos & white sneakers
    const casual = result.outfitSuggestions.find((o) => o.formality === "casual");
    expect(casual).toBeDefined();
    expect(casual!.ownedItemsUsed.some((i) => i.color === "beige")).toBe(true);
    expect(casual!.ownedItemsUsed.some((i) => i.color === "white")).toBe(true);
    expect(casual!.additionalPurchasesRequired).toBe(false);

    // Combination 2: Smart casual with black trousers & silver watch
    const smart = result.outfitSuggestions.find((o) => o.formality === "smart_casual");
    expect(smart).toBeDefined();
    expect(smart!.ownedItemsUsed.some((i) => i.color === "black")).toBe(true);
    expect(smart!.ownedItemsUsed.some((i) => i.subcategory === "watches")).toBe(true);
    expect(smart!.additionalPurchasesRequired).toBe(false);

    // Zero fabricated items
    for (const outfit of result.outfitSuggestions) {
      for (const used of outfit.ownedItemsUsed) {
        expect(owned.some((o) => o.id === used.id)).toBe(true);
      }
    }

    // No duplication warning for olive shirt
    expect(result.isDuplication).toBe(false);
  });

  // Test 2 — Explicit Preference
  it("Test 2: Explicit preference — 'I prefer minimalist clothing' is stored and retrieved for fashion recommendations", () => {
    const userId = "test-user-explicit-2";
    resetToSeedDefaults(userId);

    const extraction = extractMemoriesFromText("I prefer minimalist clothing with simple lines.", userId);
    expect(extraction.detectedCandidates.length).toBeGreaterThan(0);
    expect(extraction.savedMemories.length).toBeGreaterThan(0);

    const aestheticMem = extraction.savedMemories.find((m) => m.key === "aesthetic");
    expect(aestheticMem).toBeDefined();
    expect(aestheticMem!.value).toBe("minimal");
    expect(aestheticMem!.type).toBe("explicit");
    expect(aestheticMem!.userConfirmationStatus).toBe("confirmed");

    // Can be retrieved for future fashion query
    const retrieved = retrieveRelevantMemory("Linen summer shirt", "shirt", "fashion", userId);
    expect(retrieved.relevantMemories.some((m) => m.key === "aesthetic" && m.value === "minimal")).toBe(true);

    // Can edit and delete
    const updated = updateMemory(aestheticMem!.id, { value: "classic" }, userId);
    expect(updated?.value).toBe("classic");

    const deleted = deleteMemory(aestheticMem!.id, userId);
    expect(deleted).toBe(true);
  });

  // Test 3 — Inferred Preference Proposal
  it("Test 3: Inferred preference — System proposes inferred pattern rather than silently assuming confirmed status", () => {
    const userId = "test-user-inferred-3";
    resetToSeedDefaults(userId);

    // User mentions colors without explicit declaration "I prefer"
    const extraction = extractMemoriesFromText("Show me black jacket with beige trim and clean simple buttons.", userId);
    
    // Inferred candidate should be proposed with suggested prompt, NOT saved as confirmed
    expect(extraction.proposedInferences.length).toBeGreaterThan(0);
    const inferred = extraction.proposedInferences.find((c) => c.type === "inferred");
    expect(inferred).toBeDefined();
    expect(inferred!.suggestedPrompt).toContain("You seem to prefer neutral colours");

    // Confirmed memories should NOT have automatically adopted this without confirmation
    const activeMemories = getMemories(userId);
    expect(activeMemories.some((m) => m.key === "inferred_neutral_palette" && m.userConfirmationStatus === "confirmed")).toBe(false);
  });

  // Test 4 — Preference Correction & Conflict Resolution
  it("Test 4: Preference correction — 'I don't like relaxed fit anymore. I prefer slim fit now' updates cleanly with no conflicts", () => {
    const userId = "test-user-conflict-4";
    resetToSeedDefaults(userId);

    // Initial state: User had relaxed fit
    saveMemory({
      userId,
      category: "style",
      type: "explicit",
      key: "fit_preference",
      value: "relaxed",
      source: "manual",
      confidence: 1.0,
      importance: 5,
      status: "active",
      userConfirmationStatus: "confirmed",
    });

    const initialMems = getMemories(userId).filter((m) => m.key === "fit_preference");
    expect(initialMems.length).toBe(1);
    expect(initialMems[0].value).toBe("relaxed");

    // Correction statement
    const extraction = extractMemoriesFromText("I don't like relaxed fit anymore. I prefer slim fit now.", userId);
    expect(extraction.conflictsResolved.length).toBeGreaterThan(0);

    // Active memory must now be slim fit with zero conflicting active relaxed entries
    const afterMems = getMemories(userId).filter((m) => m.key === "fit_preference" && m.status === "active");
    expect(afterMems.length).toBe(1);
    expect(afterMems[0].value).toBe("slim");
  });

  // Test 5 — Electronics Compatibility
  it("Test 5: Electronics compatibility — Evaluates laptop against owned 4K USB-C monitor, wireless keyboard and charger", () => {
    const userId = "test-user-electronics-5";
    resetToSeedDefaults(userId);

    const techEval = evaluateTechCompatibility("Acer Swift Go 14 OLED", { ramGb: 16 }, userId);
    expect(techEval.compatibilityScore).toBeGreaterThanOrEqual(90);
    expect(techEval.reusedOwnedAccessories.length).toBeGreaterThanOrEqual(3);

    // Confirms monitor, keyboard, and charger are acknowledged as reusable
    const monitorReuse = techEval.reusedOwnedAccessories.find((a) => a.name.includes("Monitor"));
    expect(monitorReuse).toBeDefined();
    expect(monitorReuse!.savesMoneyInr).toBeGreaterThanOrEqual(30000);

    const keyboardReuse = techEval.reusedOwnedAccessories.find((a) => a.name.includes("Keyboard"));
    expect(keyboardReuse).toBeDefined();

    // Overall fit computation integrates reuse benefits
    const fitResult = computePersonalFit({
      productName: "Acer Swift Go 14 OLED",
      category: "laptop",
      industry: "electronics",
      priceInr: 69990,
      objectiveScore: 88,
      userId,
    });

    expect(fitResult.compatibilityScore).toBeGreaterThanOrEqual(90);
    expect(fitResult.fitReasons.some((r) => r.includes("owned accessories"))).toBe(true);
  });

  // Test 6 — Don't Buy Mode
  it("Test 6: Don't Buy — Proactively flags redundant purchases when user already owns suitable equivalent", () => {
    const userId = "test-user-dont-buy-6";
    resetToSeedDefaults(userId);

    // Add an owned high-end laptop
    saveOwnedItem({
      userId,
      name: "Apple MacBook Pro 14 M3 Pro",
      brand: "Apple",
      category: "electronics",
      subcategory: "laptop",
      condition: "LIKE_NEW",
      status: "ACTIVE_IN_USE",
      source: "manual",
    });

    // User looks at an incremental mid-range laptop
    const dontBuyEval = evaluateDontBuyMode("Lenovo IdeaPad Slim 5", "laptop", 68990, { ramGb: 16 }, userId);
    expect(dontBuyEval.isTriggered).toBe(true);
    expect(dontBuyEval.severity).toBe("SUGGEST_KEEPING_EXISTING");
    expect(dontBuyEval.respectfulRecommendation).toContain("You may not need to buy this");
    expect(dontBuyEval.existingItemMatched?.name).toContain("MacBook Pro");

    // Also tests duplicate wardrobe warning (white sneakers)
    const sneakerEval = evaluateDontBuyMode("Adidas White Leather Low Top Sneakers", "shoes", 5999, undefined, userId);
    expect(sneakerEval.isTriggered).toBe(true);
    expect(sneakerEval.severity).toBe("STRONG_DUPLICATION_WARNING");
    expect(sneakerEval.reason).toContain("White Minimalist Leather Sneakers");
  });

  // Test 7 — Memory Disabled
  it("Test 7: Memory disabled — Stored memory not used for personalization and no new persistent memories saved", () => {
    const userId = "test-user-disabled-7";
    resetToSeedDefaults(userId);

    // Disable memory globally
    updateMemorySettings({ isMemoryEnabled: false }, userId);
    const settings = getMemorySettings(userId);
    expect(settings.isMemoryEnabled).toBe(false);

    // Retrieval returns empty context
    const retrieval = retrieveRelevantMemory("Running shoes", "shoes", "sports", userId);
    expect(retrieval.isMemoryEnabled).toBe(false);
    expect(retrieval.relevantMemories.length).toBe(0);
    expect(retrieval.promptContextBlock).toBe("");

    // Extraction does NOT save new persistent memories
    const extraction = extractMemoriesFromText("I prefer minimalist clothing and hate logos.", userId);
    expect(extraction.savedMemories.length).toBe(0);

    // Recommendations function objectively without crashing
    const fit = computePersonalFit({
      productName: "Sony WH-1000XM5",
      category: "headphones",
      industry: "electronics",
      priceInr: 29990,
      objectiveScore: 92,
      userId,
    });
    expect(fit.personalFitScore).toBe(92);
    expect(fit.relevantMemoriesCount).toBe(0);
  });

  // Test 8 — Privacy & User Scoping
  it("Test 8: Privacy & User Scoping — Memories are strictly scoped to the requesting user", () => {
    const userA = "user-alpha-privacy";
    const userB = "user-beta-privacy";

    resetToSeedDefaults(userA);
    resetToSeedDefaults(userB);

    // User A adds a secret private preference
    saveMemory({
      userId: userA,
      category: "style",
      type: "explicit",
      key: "secret_color",
      value: "cobalt_blue",
      source: "manual",
      confidence: 1.0,
      importance: 5,
      status: "active",
      userConfirmationStatus: "confirmed",
    });

    const userAMems = getMemories(userA);
    const userBMems = getMemories(userB);

    expect(userAMems.some((m) => m.key === "secret_color")).toBe(true);
    expect(userBMems.some((m) => m.key === "secret_color")).toBe(false);
  });

  // Test 9 — Unrelated Memory Isolation
  it("Test 9: Unrelated memory isolation — Fashion preferences do NOT influence a refrigerator search", () => {
    const userId = "test-user-refrigerator-9";
    resetToSeedDefaults(userId);

    // User has strong fashion memories (beige, black, minimal aesthetic)
    const fashionMemories = getMemories(userId, "style");
    expect(fashionMemories.length).toBeGreaterThan(0);

    // User searches for a refrigerator
    const retrieval = retrieveRelevantMemory("Bosch 559L Frost-Free Double Door Refrigerator", "refrigerator", "appliances", userId);

    // Fashion/style preferences MUST NOT be present in refrigerator context
    const hasStyle = retrieval.relevantMemories.some((m) => m.category === "style" || m.key === "colours_liked" || m.key === "aesthetic");
    expect(hasStyle).toBe(false);

    // Prompt context block must not mention fashion clothing
    expect(retrieval.promptContextBlock.toLowerCase()).not.toContain("beige");
    expect(retrieval.promptContextBlock.toLowerCase()).not.toContain("chinos");
    expect(retrieval.promptContextBlock.toLowerCase()).not.toContain("trousers");
  });

  // Test 10 — Purchase Decision Feedback Learning
  it("Test 10: Purchase feedback — Records laptop battery complaint and prioritizes battery endurance on future laptop searches", () => {
    const userId = "test-user-feedback-10";
    resetToSeedDefaults(userId);

    // User shares disappointing purchase experience
    const feedbackText = "I bought this laptop and battery life is much worse than I expected.";
    const extraction = extractMemoriesFromText(feedbackText, userId);

    expect(extraction.savedMemories.length).toBeGreaterThan(0);
    const feedbackMem = extraction.savedMemories.find((m) => m.category === "feedback");
    expect(feedbackMem).toBeDefined();
    expect(feedbackMem!.value.complaint).toBe("battery_worse_than_expected");
    expect(feedbackMem!.value.targetCategory).toBe("laptops");

    // Future laptop retrieval includes this feedback
    const laptopRetrieval = retrieveRelevantMemory("High performance laptop for development", "laptop", "electronics", userId);
    expect(laptopRetrieval.relevantMemories.some((m) => m.category === "feedback")).toBe(true);

    // Fit scoring flags battery risk warning for future laptop evaluations
    const fitResult = computePersonalFit({
      productName: "Gaming Performance Laptop",
      category: "laptop",
      industry: "electronics",
      priceInr: 85000,
      objectiveScore: 84,
      userId,
    });

    expect(fitResult.riskWarnings.some((w) => w.toLowerCase().includes("battery"))).toBe(true);

    // Feedback is NOT applied to unrelated products (e.g. watches or coffee machines)
    const watchRetrieval = retrieveRelevantMemory("Seiko 5 Sports Watch", "watch", "fashion", userId);
    expect(watchRetrieval.relevantMemories.some((m) => m.category === "feedback")).toBe(false);
  });
});
