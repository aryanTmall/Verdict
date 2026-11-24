import type {
  MemoryItem,
  OwnedItem,
  MemoryCategory,
  PersonalFitResult,
} from "./types";
import { getMemories, getOwnedItems, getMemorySettings, DEFAULT_USER_ID, loadUserProfile } from "./store";

export interface RelevantMemoryContext {
  userId: string;
  isMemoryEnabled: boolean;
  targetCategory: string;
  targetIndustry: string;
  relevantMemories: MemoryItem[];
  relevantOwnedItems: OwnedItem[];
  promptContextBlock: string;
  activePreferencesSummary: string[];
}

/**
 * Maps product industry/category to eligible memory categories
 */
function getEligibleMemoryCategories(category: string, industry: string): MemoryCategory[] {
  const cat = category.toLowerCase();
  const ind = industry.toLowerCase();

  // Fashion & Style
  if (
    ind === "fashion" ||
    cat === "fashion" ||
    /shirt|pant|trousers|jeans|shoes|sneakers|watch|suit|jacket|clothing|wardrobe|hoodie|tee/i.test(cat)
  ) {
    return ["style", "dislike", "owned_item", "buying"];
  }

  // Computing & Laptops
  if (
    ind === "electronics" ||
    cat === "laptops" ||
    cat === "laptop" ||
    /laptop|macbook|computer|notebook|pc|ultrabook/i.test(cat)
  ) {
    return ["buying", "lifestyle", "owned_item", "feedback", "compatibility"];
  }

  // Automotive
  if (ind === "automotive" || /car|suv|sedan|vehicle|auto/i.test(cat)) {
    return ["buying", "lifestyle", "owned_item", "feedback"];
  }

  // Home & Appliances (e.g. Refrigerator, Washing Machine, Sofa)
  if (
    ind === "appliances" ||
    ind === "real_estate" ||
    /refrigerator|fridge|washing_machine|sofa|furniture|appliance/i.test(cat)
  ) {
    // CRITICAL (Test 9): Fashion/Style preferences MUST NOT influence refrigerators or home appliances!
    return ["buying", "lifestyle", "owned_item", "feedback"];
  }

  // Default universal fallback
  return ["buying", "lifestyle", "feedback"];
}

/**
 * Filter owned items by relevance to the query category
 */
function filterRelevantOwnedItems(items: OwnedItem[], category: string, industry: string): OwnedItem[] {
  const cat = category.toLowerCase();
  const ind = industry.toLowerCase();

  if (ind === "fashion" || /shirt|pant|trousers|jeans|shoes|watch|clothing|wardrobe/i.test(cat)) {
    return items.filter((item) => item.category === "wardrobe" || item.category === "accessories");
  }

  if (ind === "electronics" || /laptop|pc|monitor|headphones|phone|tablet|charger|computer/i.test(cat)) {
    return items.filter((item) => item.category === "electronics" || item.category === "accessories");
  }

  if (ind === "appliances" || /refrigerator|washing_machine|ac|oven/i.test(cat)) {
    return items.filter((item) => item.category === "appliances" || item.category === "home");
  }

  return items;
}

/**
 * Retrieve the most relevant memories for an incoming query
 */
export function retrieveRelevantMemory(
  query: string,
  category = "laptop",
  industry = "electronics",
  userId = DEFAULT_USER_ID
): RelevantMemoryContext {
  const profile = loadUserProfile(userId);
  const settings = profile.settings;

  // Test 7: Memory Disabled Guard
  if (!settings.isMemoryEnabled) {
    return {
      userId,
      isMemoryEnabled: false,
      targetCategory: category,
      targetIndustry: industry,
      relevantMemories: [],
      relevantOwnedItems: [],
      promptContextBlock: "",
      activePreferencesSummary: [],
    };
  }

  const eligibleCategories = getEligibleMemoryCategories(category, industry);
  const allActiveMemories = profile.memories.filter(
    (m) => m.status === "active" && m.userConfirmationStatus !== "rejected"
  );

  // 1. Filter by eligible categories
  let relevantMemories = allActiveMemories.filter((m) => {
    // Respect category toggles
    if (settings.categoryToggles[m.category] === false) return false;
    return eligibleCategories.includes(m.category);
  });

  // 2. Specific domain filters (e.g. Test 9: No style DNA in refrigerators)
  if (category.toLowerCase().includes("refrigerator") || category.toLowerCase().includes("fridge")) {
    relevantMemories = relevantMemories.filter((m) => m.category !== "style" && m.key !== "colours_liked");
  }

  // 3. Filter and isolate category-specific feedback (e.g. Test 10: laptop battery feedback only touches laptops)
  relevantMemories = relevantMemories.filter((m) => {
    if (m.category === "feedback" && m.value?.targetCategory) {
      const target = m.value.targetCategory.toLowerCase();
      const current = category.toLowerCase();
      // Only keep if current category matches feedback category
      return current.includes(target) || target.includes(current);
    }
    return true;
  });

  // 4. Filter owned items
  const allOwnedItems = profile.ownedItems.filter((i) => i.status === "ACTIVE_IN_USE");
  const relevantOwnedItems = settings.categoryToggles.owned_item
    ? filterRelevantOwnedItems(allOwnedItems, category, industry)
    : [];

  // 5. Construct concise Prompt Context Block for AI (Section 16)
  const activePreferencesSummary: string[] = [];
  const preferenceLines: string[] = [];

  for (const m of relevantMemories) {
    let desc = "";
    if (Array.isArray(m.value)) {
      desc = `${m.key.replace(/_/g, " ")}: ${m.value.join(", ")}`;
    } else if (typeof m.value === "object" && m.value !== null) {
      desc = `${m.key.replace(/_/g, " ")}: ${JSON.stringify(m.value)}`;
    } else {
      desc = `${m.key.replace(/_/g, " ")}: ${m.value}`;
    }
    preferenceLines.push(`- ${desc}`);
    activePreferencesSummary.push(desc);
  }

  const ownedLines: string[] = relevantOwnedItems.map(
    (item) => `- ${item.name} (${item.brand}, ${item.subcategory}${item.color ? `, color: ${item.color}` : ""})`
  );

  let promptContextBlock = "";
  if (preferenceLines.length > 0 || ownedLines.length > 0) {
    promptContextBlock = `
[VERDICT PERSONAL BUYING MEMORY & DNA (User Scoped)]
CONFIRMED USER PREFERENCES:
${preferenceLines.length > 0 ? preferenceLines.join("\n") : "- None applicable to this category"}

RELEVANT OWNED POSSESSIONS:
${ownedLines.length > 0 ? ownedLines.join("\n") : "- No existing possessions recorded for this category"}

INSTRUCTIONS TO AI:
- Tailor personal fit and compatibility strictly against the confirmed memories above.
- Never invent owned items not listed here.
- Do NOT push unnecessary accessories the user already owns.
- If user already owns a suitable equivalent, respectfully trigger "Don't Buy It" evaluation.
`.trim();
  }

  return {
    userId,
    isMemoryEnabled: true,
    targetCategory: category,
    targetIndustry: industry,
    relevantMemories,
    relevantOwnedItems,
    promptContextBlock,
    activePreferencesSummary,
  };
}
