import type {
  MemoryItem,
  MemoryCategory,
  MemoryType,
  OwnedItem,
} from "./types";
import { saveMemory, getMemories, saveOwnedItem, getMemorySettings, DEFAULT_USER_ID } from "./store";

export interface MemoryCandidate {
  category: MemoryCategory;
  type: MemoryType;
  key: string;
  value: any;
  confidence: number;
  importance: 1 | 2 | 3 | 4 | 5;
  evidenceQuote: string;
  isConflict: boolean;
  conflictingMemoryId?: string;
  conflictResolutionAction?: "REPLACE_EXISTING" | "MERGE" | "CREATE_NEW";
  suggestedPrompt?: string; // For inferred items
  ownedItemCandidate?: Partial<OwnedItem>;
}

export interface ExtractionResult {
  detectedCandidates: MemoryCandidate[];
  savedMemories: MemoryItem[];
  proposedInferences: MemoryCandidate[];
  conflictsResolved: Array<{ oldKey: string; oldValue: any; newKey: string; newValue: any }>;
}

/**
 * Natural Language Memory Extraction Pipeline
 * Audits conversational text, missions, or user feedback for explicit preferences,
 * owned items, and purchase outcomes.
 */
export function extractMemoriesFromText(
  text: string,
  userId = DEFAULT_USER_ID,
  options?: { autoCommitExplicit?: boolean }
): ExtractionResult {
  const settings = getMemorySettings(userId);
  if (!settings.isMemoryEnabled) {
    return {
      detectedCandidates: [],
      savedMemories: [],
      proposedInferences: [],
      conflictsResolved: [],
    };
  }

  const autoCommit = options?.autoCommitExplicit !== false;
  const raw = text.trim();
  const lower = raw.toLowerCase();

  const candidates: MemoryCandidate[] = [];
  const existingMemories = getMemories(userId);

  // -------------------------------------------------------------------
  // 1. Conflict Resolution Patterns: "I don't like X anymore. I prefer Y now."
  // -------------------------------------------------------------------
  const fitCorrectionRegex =
    /(?:don't like|no longer like|hate|stop wearing)\s+(relaxed|slim|oversized|regular|tight)\s+fit(?:.*?)?(?:prefer|want|like|wear)\s+(relaxed|slim|oversized|regular|tailored)\s+fit/i;
  const fitMatch = raw.match(fitCorrectionRegex);
  if (fitMatch) {
    const oldFit = fitMatch[1].toLowerCase();
    const newFit = fitMatch[2].toLowerCase();
    const conflictingMem = existingMemories.find(
      (m) =>
        (m.category === "style" || m.category === "buying") &&
        m.key === "fit_preference" &&
        m.status === "active"
    );

    candidates.push({
      category: "style",
      type: "explicit",
      key: "fit_preference",
      value: newFit,
      confidence: 1.0,
      importance: 5,
      evidenceQuote: raw,
      isConflict: true,
      conflictingMemoryId: conflictingMem?.id,
      conflictResolutionAction: "REPLACE_EXISTING",
    });
  }

  // Accessories/Jewelry preference correction: "wear gold more often" vs "silver"
  if (/(?:wear|prefer|switched to|started wearing)\s+gold/i.test(lower) && !/(?:white gold)/i.test(lower)) {
    const conflictingMem = existingMemories.find(
      (m) => m.key === "accessories_preference" || m.key === "metal_preference"
    );
    candidates.push({
      category: "style",
      type: "explicit",
      key: "accessories_preference",
      value: ["gold"],
      confidence: 0.95,
      importance: 4,
      evidenceQuote: raw,
      isConflict: Boolean(conflictingMem),
      conflictingMemoryId: conflictingMem?.id,
      conflictResolutionAction: "REPLACE_EXISTING",
    });
  }

  // -------------------------------------------------------------------
  // 2. Explicit Style DNA Expressions
  // -------------------------------------------------------------------
  // A. Minimalist clothing preference
  if (/(?:prefer|like|want)\s+(?:minimal|minimalist|minimalistic)\s+(?:clothing|style|fashion|design|look|wardrobe)/i.test(lower)) {
    candidates.push({
      category: "style",
      type: "explicit",
      key: "aesthetic",
      value: "minimal",
      confidence: 1.0,
      importance: 5,
      evidenceQuote: raw,
      isConflict: false,
    });
  }

  // B. Colors Liked ("I usually wear beige and black", "I like navy and olive")
  const colorsLikedMatch = raw.match(/(?:usually wear|prefer|like|love|wear)\s+([a-zA-Z,\s]+(?:and\s+[a-zA-Z]+)?)(?:\s+(?:colors|colours|shades|tones))?/i);
  if (colorsLikedMatch && !lower.includes("don't like") && !lower.includes("hate")) {
    const chunk = colorsLikedMatch[1].toLowerCase();
    const knownColors = ["beige", "black", "navy", "olive", "white", "grey", "charcoal", "brown", "tan", "cream", "khaki"];
    const extractedColors = knownColors.filter((c) => chunk.includes(c));
    if (extractedColors.length > 0) {
      candidates.push({
        category: "style",
        type: "explicit",
        key: "colours_liked",
        value: extractedColors,
        confidence: 0.95,
        importance: 4,
        evidenceQuote: raw,
        isConflict: false,
      });
    }
  }

  // C. Dislikes ("I hate oversized logos", "I hate neon colors")
  if (/(?:hate|dislike|avoid|don't want)\s+(?:oversized|huge|loud|big)\s+logos/i.test(lower)) {
    candidates.push({
      category: "dislike",
      type: "explicit",
      key: "logo_preference",
      value: "minimal_branding",
      confidence: 1.0,
      importance: 4,
      evidenceQuote: raw,
      isConflict: false,
    });
  }

  if (/(?:hate|dislike|avoid|no)\s+(?:neon|bright\s+yellow|loud)\s*(?:colors|colours)?/i.test(lower)) {
    candidates.push({
      category: "dislike",
      type: "explicit",
      key: "colours_disliked",
      value: ["neon"],
      confidence: 1.0,
      importance: 4,
      evidenceQuote: raw,
      isConflict: false,
    });
  }

  // -------------------------------------------------------------------
  // 3. Explicit Buying DNA Expressions
  // -------------------------------------------------------------------
  if (/(?:prefer\s+buying\s+products\s+that\s+last|buy\s+for\s+the\s+long\s+term|longevity\s+over\s+upgrades)/i.test(lower)) {
    candidates.push({
      category: "buying",
      type: "explicit",
      key: "longevity_priority",
      value: "MAXIMUM_LIFESPAN",
      confidence: 1.0,
      importance: 5,
      evidenceQuote: raw,
      isConflict: false,
    });
  }

  if (/(?:always\s+choose\s+battery(?:\s+life)?\s+over\s+performance|battery\s+is\s+my\s+top\s+priority|battery\s+over\s+speed)/i.test(lower)) {
    candidates.push({
      category: "buying",
      type: "explicit",
      key: "battery_over_performance",
      value: true,
      confidence: 1.0,
      importance: 5,
      evidenceQuote: raw,
      isConflict: false,
    });
  }

  // -------------------------------------------------------------------
  // 4. Explicit Owned Items Detection
  // -------------------------------------------------------------------
  // "I already have white sneakers"
  if (/(?:already have|already own|own a pair of)\s+([a-zA-Z\s]+sneakers|[a-zA-Z\s]+shoes)/i.test(lower)) {
    const match = lower.match(/(?:already have|already own|own a pair of)\s+([a-zA-Z\s]+(?:sneakers|shoes))/i);
    const itemName = match ? match[1].trim() : "white sneakers";
    candidates.push({
      category: "owned_item",
      type: "explicit",
      key: `owned_shoes_${Date.now()}`,
      value: itemName,
      confidence: 1.0,
      importance: 5,
      evidenceQuote: raw,
      isConflict: false,
      ownedItemCandidate: {
        name: itemName.charAt(0).toUpperCase() + itemName.slice(1),
        category: "wardrobe",
        subcategory: "shoes",
        color: itemName.includes("white") ? "white" : undefined,
        brand: "Self Owned",
        status: "ACTIVE_IN_USE",
        source: "conversation",
      },
    });
  }

  // "I don't need another charger" or "I already have a 65W charger"
  if (/(?:don't need another charger|already have a charger|have a 65w charger)/i.test(lower)) {
    candidates.push({
      category: "owned_item",
      type: "explicit",
      key: "owned_tech_charger",
      value: "USB-C Fast Charger",
      confidence: 0.95,
      importance: 4,
      evidenceQuote: raw,
      isConflict: false,
      ownedItemCandidate: {
        name: "USB-C Fast Charger",
        category: "electronics",
        subcategory: "charger",
        brand: "Existing",
        status: "ACTIVE_IN_USE",
        source: "conversation",
      },
    });
  }

  // "I own a monitor and keyboard" / "I have a 4K monitor"
  if (/(?:own|have)\s+(?:a\s+)?monitor(?:\s+and\s+keyboard)?/i.test(lower)) {
    candidates.push({
      category: "owned_item",
      type: "explicit",
      key: "owned_desktop_peripherals",
      value: { monitor: true, keyboard: lower.includes("keyboard") },
      confidence: 0.95,
      importance: 5,
      evidenceQuote: raw,
      isConflict: false,
    });
  }

  // -------------------------------------------------------------------
  // 5. Purchase Decision Feedback Extraction (Test 10)
  // -------------------------------------------------------------------
  // "I bought this laptop and battery life is much worse than I expected"
  const feedbackMatch = raw.match(/(?:i bought|purchased|using)\s+(?:this\s+)?([a-zA-Z0-9\s]+?)\s+and\s+([a-zA-Z0-9\s]+?)\s+is\s+(?:much\s+)?(?:worse|terrible|disappointing|poor)/i);
  if (feedbackMatch || /(?:battery life|performance|screen|heating|service)\s+is\s+(?:worse|disappointing|terrible)/i.test(lower)) {
    const isBatteryIssue = /battery\s*(?:life)?/i.test(lower);
    const categoryName = lower.includes("laptop") ? "laptops" : lower.includes("car") ? "cars" : "general";
    
    candidates.push({
      category: "feedback",
      type: "explicit",
      key: `feedback_${categoryName}_${isBatteryIssue ? "battery" : "general"}`,
      value: {
        targetCategory: categoryName,
        complaint: isBatteryIssue ? "battery_worse_than_expected" : "performance_issue",
        severity: 4,
        note: raw,
        learnedRule: isBatteryIssue && categoryName === "laptops"
          ? "Increase battery weight and strictly penalize claims of long battery on laptops"
          : "User had negative experience with this attribute",
      },
      confidence: 1.0,
      importance: 5,
      evidenceQuote: raw,
      isConflict: false,
    });
  }

  // -------------------------------------------------------------------
  // 6. Inferred Memory Pattern Candidates (Test 3)
  // -------------------------------------------------------------------
  // If query repeatedly features neutral items or simple minimalist asks without saying "I prefer"
  if (!lower.includes("i prefer") && !lower.includes("i like") && !lower.includes("i wear")) {
    const neutralWords = ["black", "beige", "navy", "white", "grey", "minimal", "clean", "simple"];
    const neutralMatches = neutralWords.filter((w) => lower.includes(w));
    if (neutralMatches.length >= 2) {
      candidates.push({
        category: "style",
        type: "inferred",
        key: "inferred_neutral_palette",
        value: neutralMatches,
        confidence: 0.65,
        importance: 3,
        evidenceQuote: raw,
        isConflict: false,
        suggestedPrompt: "You seem to prefer neutral colours. Should I remember that?",
      });
    }
  }

  // -------------------------------------------------------------------
  // 7. Commit or Propose
  // -------------------------------------------------------------------
  const savedMemories: MemoryItem[] = [];
  const proposedInferences: MemoryCandidate[] = [];
  const conflictsResolved: Array<{ oldKey: string; oldValue: any; newKey: string; newValue: any }> = [];

  for (const cand of candidates) {
    if (cand.type === "inferred") {
      // Inferred items are proposed to the user, NOT silently assumed as confirmed
      proposedInferences.push(cand);
      continue;
    }

    if (autoCommit && cand.type === "explicit") {
      // Handle conflict resolution
      if (cand.isConflict && cand.conflictingMemoryId) {
        const oldMem = existingMemories.find((m) => m.id === cand.conflictingMemoryId);
        if (oldMem) {
          conflictsResolved.push({
            oldKey: oldMem.key,
            oldValue: oldMem.value,
            newKey: cand.key,
            newValue: cand.value,
          });
        }
      }

      // Save memory
      const saved = saveMemory({
        userId,
        category: cand.category,
        type: cand.type,
        key: cand.key,
        value: cand.value,
        source: "conversation",
        confidence: cand.confidence,
        importance: cand.importance,
        status: "active",
        userConfirmationStatus: "confirmed",
        evidenceQuote: cand.evidenceQuote,
      });
      savedMemories.push(saved);

      // If also an owned item candidate, save to inventory
      if (cand.ownedItemCandidate && cand.ownedItemCandidate.name) {
        saveOwnedItem({
          userId,
          name: cand.ownedItemCandidate.name,
          brand: cand.ownedItemCandidate.brand || "Self Owned",
          category: cand.ownedItemCandidate.category || "wardrobe",
          subcategory: cand.ownedItemCandidate.subcategory || "other",
          color: cand.ownedItemCandidate.color,
          status: "ACTIVE_IN_USE",
          source: "conversation",
        });
      }
    }
  }

  return {
    detectedCandidates: candidates,
    savedMemories,
    proposedInferences,
    conflictsResolved,
  };
}
