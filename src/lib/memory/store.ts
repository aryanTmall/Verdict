import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type {
  MemoryItem,
  MemorySettings,
  OwnedItem,
  DecisionHistoryItem,
  MemoryCategory,
  OwnedItemCategory,
  StyleDna,
  BuyingDna,
} from "./types";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
const supabase = isSupabaseConfigured ? createClient(supabaseUrl!, supabaseKey!) : null;

const MEMORY_DIR = path.join(process.cwd(), "data", "memory");

export const DEFAULT_USER_ID = "user-default";

export const DEFAULT_SETTINGS: MemorySettings = {
  isMemoryEnabled: true,
  categoryToggles: {
    style: true,
    buying: true,
    owned_item: true,
    lifestyle: true,
    decision: true,
    dislike: true,
    compatibility: true,
    feedback: true,
  },
  autoSuggestInferences: true,
  showWhyThisFits: true,
  dontBuyModeEnabled: true,
  lastUpdated: new Date().toISOString(),
};

export const SEED_OWNED_ITEMS: OwnedItem[] = [
  {
    id: "owned-beige-chinos",
    userId: DEFAULT_USER_ID,
    name: "Beige Tailored Chinos",
    brand: "Uniqlo",
    category: "wardrobe",
    subcategory: "trousers",
    color: "beige",
    style: "minimal",
    fit: "relaxed",
    material: "cotton twill",
    occasion: "smart_casual",
    condition: "EXCELLENT",
    priceInr: 2990,
    status: "ACTIVE_IN_USE",
    source: "manual",
    notes: "Neutral cotton bottom; highly versatile with earth tones and black.",
    createdAt: "2026-09-15T10:00:00Z",
    updatedAt: "2026-09-15T10:00:00Z",
  },
  {
    id: "owned-black-trousers",
    userId: DEFAULT_USER_ID,
    name: "Pleated Black Wool-Blend Trousers",
    brand: "Marks & Spencer",
    category: "wardrobe",
    subcategory: "trousers",
    color: "black",
    style: "classic",
    fit: "regular",
    material: "wool blend",
    occasion: "business",
    condition: "LIKE_NEW",
    priceInr: 4490,
    status: "ACTIVE_IN_USE",
    source: "manual",
    notes: "Formal or smart-casual anchor piece.",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "owned-white-sneakers",
    userId: DEFAULT_USER_ID,
    name: "White Minimalist Leather Sneakers",
    brand: "Stan Smith / Veja",
    category: "wardrobe",
    subcategory: "shoes",
    color: "white",
    style: "minimal",
    material: "calfskin leather",
    occasion: "casual",
    condition: "EXCELLENT",
    priceInr: 6999,
    status: "ACTIVE_IN_USE",
    source: "manual",
    notes: "Clean white leather low-tops with zero loud branding.",
    createdAt: "2026-07-10T10:00:00Z",
    updatedAt: "2026-07-10T10:00:00Z",
  },
  {
    id: "owned-silver-watch",
    userId: DEFAULT_USER_ID,
    name: "Seiko 5 Silver Mesh Automatic Watch",
    brand: "Seiko",
    category: "accessories",
    subcategory: "watches",
    color: "silver",
    style: "classic",
    material: "stainless steel",
    occasion: "all",
    condition: "LIKE_NEW",
    priceInr: 21500,
    status: "ACTIVE_IN_USE",
    source: "manual",
    notes: "38mm brushed stainless steel dial on Milanese mesh bracelet.",
    createdAt: "2026-06-01T10:00:00Z",
    updatedAt: "2026-06-01T10:00:00Z",
  },
  {
    id: "owned-dell-monitor",
    userId: DEFAULT_USER_ID,
    name: "Dell UltraSharp 27\" 4K USB-C Monitor (U2723QE)",
    brand: "Dell",
    category: "electronics",
    subcategory: "monitor",
    modelNumber: "U2723QE",
    specs: {
      resolution: "3840x2160 4K",
      panel: "IPS Black 2000:1",
      powerDeliveryWatts: 90,
      ports: ["USB-C 90W PD", "DisplayPort 1.4", "HDMI 2.0", "RJ45 Ethernet", "USB-A Hub"],
    },
    condition: "EXCELLENT",
    priceInr: 54990,
    status: "ACTIVE_IN_USE",
    source: "manual",
    notes: "Supports single-cable USB-C display + 90W laptop charging.",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-15T10:00:00Z",
  },
  {
    id: "owned-wireless-keyboard",
    userId: DEFAULT_USER_ID,
    name: "Keychron K2 Pro Wireless Mechanical Keyboard",
    brand: "Keychron",
    category: "electronics",
    subcategory: "keyboard",
    specs: {
      switches: "Gateron Brown",
      connectivity: ["Bluetooth 5.1", "USB-C Wired"],
      layout: "75% Compact Mac/Win",
    },
    condition: "LIKE_NEW",
    priceInr: 8999,
    status: "ACTIVE_IN_USE",
    source: "manual",
    notes: "Paired with desktop setup. No need to purchase external keyboards.",
    createdAt: "2026-05-20T10:00:00Z",
    updatedAt: "2026-05-20T10:00:00Z",
  },
  {
    id: "owned-gan-charger",
    userId: DEFAULT_USER_ID,
    name: "Anker 65W GaN Dual USB-C Fast Charger",
    brand: "Anker",
    category: "electronics",
    subcategory: "charger",
    specs: {
      wattage: 65,
      ports: "2x USB-C + 1x USB-A",
      protocols: ["USB-PD 3.0", "PPS"],
    },
    condition: "LIKE_NEW",
    priceInr: 3499,
    status: "ACTIVE_IN_USE",
    source: "manual",
    notes: "Sufficient for 65W ultrabooks and phone charging.",
    createdAt: "2026-06-15T10:00:00Z",
    updatedAt: "2026-06-15T10:00:00Z",
  },
];

export const SEED_MEMORIES: MemoryItem[] = [
  {
    id: "mem-style-colors",
    userId: DEFAULT_USER_ID,
    category: "style",
    type: "explicit",
    key: "colours_liked",
    value: ["black", "beige", "navy", "olive", "white", "charcoal"],
    source: "conversation",
    confidence: 1.0,
    importance: 5,
    createdAt: "2026-10-01T12:00:00Z",
    updatedAt: "2026-10-01T12:00:00Z",
    status: "active",
    userConfirmationStatus: "confirmed",
    evidenceQuote: "I usually wear beige, black, navy, and olive tones.",
  },
  {
    id: "mem-style-dislikes",
    userId: DEFAULT_USER_ID,
    category: "dislike",
    type: "explicit",
    key: "colours_disliked",
    value: ["neon", "bright yellow", "hot pink"],
    source: "conversation",
    confidence: 1.0,
    importance: 5,
    createdAt: "2026-10-01T12:05:00Z",
    updatedAt: "2026-10-01T12:05:00Z",
    status: "active",
    userConfirmationStatus: "confirmed",
    evidenceQuote: "I hate neon colours and oversized gaudy logos.",
  },
  {
    id: "mem-style-aesthetic",
    userId: DEFAULT_USER_ID,
    category: "style",
    type: "explicit",
    key: "aesthetic",
    value: "minimal",
    source: "conversation",
    confidence: 0.95,
    importance: 4,
    createdAt: "2026-10-02T14:00:00Z",
    updatedAt: "2026-10-02T14:00:00Z",
    status: "active",
    userConfirmationStatus: "confirmed",
    evidenceQuote: "I prefer minimalist, timeless cuts with subtle branding.",
  },
  {
    id: "mem-buying-longevity",
    userId: DEFAULT_USER_ID,
    category: "buying",
    type: "explicit",
    key: "longevity_priority",
    value: "MAXIMUM_LIFESPAN",
    source: "conversation",
    confidence: 1.0,
    importance: 5,
    createdAt: "2026-10-05T09:30:00Z",
    updatedAt: "2026-10-05T09:30:00Z",
    status: "active",
    userConfirmationStatus: "confirmed",
    evidenceQuote: "I prefer buying products that last 4 to 5 years rather than upgrading every year.",
  },
  {
    id: "mem-lifestyle-dev",
    userId: DEFAULT_USER_ID,
    category: "lifestyle",
    type: "explicit",
    key: "workloads",
    value: ["ide", "browser", "docker", "android_studio"],
    source: "conversation",
    confidence: 0.95,
    importance: 5,
    createdAt: "2026-10-10T16:00:00Z",
    updatedAt: "2026-10-10T16:00:00Z",
    status: "active",
    userConfirmationStatus: "confirmed",
    evidenceQuote: "I use my machine for programming, full-stack web dev, Docker containers, and mobile builds.",
  },
];

export interface UserMemoryProfile {
  userId: string;
  settings: MemorySettings;
  memories: MemoryItem[];
  ownedItems: OwnedItem[];
  decisions: DecisionHistoryItem[];
  updatedAt: string;
}

function ensureMemoryDir() {
  if (!fs.existsSync(MEMORY_DIR)) {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
  }
}

function getMemoryFilePath(userId: string): string {
  ensureMemoryDir();
  const safeId = userId.replace(/[^a-zA-Z0-9_-]/g, "_");
  return path.join(MEMORY_DIR, `${safeId}.json`);
}

/**
 * Loads full user memory profile from file/Supabase, or seeds if first time
 */
export function loadUserProfile(userId = DEFAULT_USER_ID): UserMemoryProfile {
  const filePath = getMemoryFilePath(userId);

  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const profile = JSON.parse(raw) as UserMemoryProfile;
      return profile;
    } catch (e) {
      console.warn("Failed to parse user memory file, regenerating:", e);
    }
  }

  // Create initial seeded profile
  const profile: UserMemoryProfile = {
    userId,
    settings: { ...DEFAULT_SETTINGS },
    memories: [...SEED_MEMORIES],
    ownedItems: [...SEED_OWNED_ITEMS],
    decisions: [],
    updatedAt: new Date().toISOString(),
  };

  try {
    fs.writeFileSync(filePath, JSON.stringify(profile, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write seed profile:", e);
  }

  return profile;
}

/**
 * Saves entire user memory profile
 */
export function saveUserProfile(profile: UserMemoryProfile): void {
  profile.updatedAt = new Date().toISOString();
  const filePath = getMemoryFilePath(profile.userId);
  try {
    ensureMemoryDir();
    fs.writeFileSync(filePath, JSON.stringify(profile, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save user memory profile to disk:", e);
  }

  if (supabase) {
    (supabase.from("user_memories") as any)
      .upsert({
        user_id: profile.userId,
        payload: profile,
        updated_at: profile.updatedAt,
      })
      .then(({ error }: any) => {
        if (error) console.warn("Supabase memory sync failed:", error.message);
      })
      .catch((err: any) => console.warn("Supabase memory network error:", err));
  }
}

// -------------------------------------------------------------
// Granular Memory CRUD Operations
// -------------------------------------------------------------

export function getMemories(userId = DEFAULT_USER_ID, category?: MemoryCategory): MemoryItem[] {
  const prof = loadUserProfile(userId);
  if (!prof.settings.isMemoryEnabled) return [];
  let list = prof.memories.filter((m) => m.status === "active");
  if (category) {
    list = list.filter((m) => m.category === category);
  }
  return list;
}

export function saveMemory(item: Omit<MemoryItem, "id" | "createdAt" | "updatedAt"> & { id?: string }): MemoryItem {
  const userId = item.userId || DEFAULT_USER_ID;
  const prof = loadUserProfile(userId);

  // If memory is globally disabled, do not save new persistent memories
  if (!prof.settings.isMemoryEnabled) {
    return {
      ...item,
      id: item.id || `mem-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as MemoryItem;
  }

  const id = item.id || `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  // Conflict Resolution: If an active memory with same key & category already exists
  const existingIdx = prof.memories.findIndex(
    (m) => m.category === item.category && m.key.toLowerCase() === item.key.toLowerCase() && m.status === "active"
  );

  let fullItem: MemoryItem;

  if (existingIdx >= 0) {
    // Update existing memory in place or replace with newer explicit value
    const existing = prof.memories[existingIdx];
    fullItem = {
      ...existing,
      ...item,
      id: existing.id,
      updatedAt: now,
      lastUsedAt: now,
    };
    prof.memories[existingIdx] = fullItem;
  } else {
    fullItem = {
      ...item,
      id,
      createdAt: now,
      updatedAt: now,
    };
    prof.memories.push(fullItem);
  }

  saveUserProfile(prof);
  return fullItem;
}

export function updateMemory(id: string, patch: Partial<MemoryItem>, userId = DEFAULT_USER_ID): MemoryItem | null {
  const prof = loadUserProfile(userId);
  const idx = prof.memories.findIndex((m) => m.id === id);
  if (idx === -1) return null;

  prof.memories[idx] = {
    ...prof.memories[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  saveUserProfile(prof);
  return prof.memories[idx];
}

export function deleteMemory(id: string, userId = DEFAULT_USER_ID): boolean {
  const prof = loadUserProfile(userId);
  const initialLen = prof.memories.length;
  prof.memories = prof.memories.filter((m) => m.id !== id);
  if (prof.memories.length !== initialLen) {
    saveUserProfile(prof);
    return true;
  }
  return false;
}

export function clearCategory(category: MemoryCategory, userId = DEFAULT_USER_ID): void {
  const prof = loadUserProfile(userId);
  prof.memories = prof.memories.filter((m) => m.category !== category);
  saveUserProfile(prof);
}

export function clearAllMemories(userId = DEFAULT_USER_ID): void {
  const prof = loadUserProfile(userId);
  prof.memories = [];
  prof.ownedItems = [];
  prof.decisions = [];
  saveUserProfile(prof);
}

export function getMemorySettings(userId = DEFAULT_USER_ID): MemorySettings {
  const prof = loadUserProfile(userId);
  return prof.settings;
}

export function updateMemorySettings(patch: Partial<MemorySettings>, userId = DEFAULT_USER_ID): MemorySettings {
  const prof = loadUserProfile(userId);
  prof.settings = {
    ...prof.settings,
    ...patch,
    lastUpdated: new Date().toISOString(),
  };
  saveUserProfile(prof);
  return prof.settings;
}

// -------------------------------------------------------------
// Owned Items (Inventory) CRUD Operations
// -------------------------------------------------------------

export function getOwnedItems(userId = DEFAULT_USER_ID, category?: OwnedItemCategory): OwnedItem[] {
  const prof = loadUserProfile(userId);
  if (!prof.settings.isMemoryEnabled || !prof.settings.categoryToggles.owned_item) {
    return [];
  }
  if (category) {
    return prof.ownedItems.filter((item) => item.category === category);
  }
  return prof.ownedItems;
}

export function saveOwnedItem(item: Omit<OwnedItem, "id" | "createdAt" | "updatedAt"> & { id?: string }): OwnedItem {
  const userId = item.userId || DEFAULT_USER_ID;
  const prof = loadUserProfile(userId);
  const id = item.id || `owned-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const fullItem: OwnedItem = {
    ...item,
    id,
    createdAt: now,
    updatedAt: now,
  };

  prof.ownedItems.push(fullItem);
  saveUserProfile(prof);
  return fullItem;
}

export function updateOwnedItem(id: string, patch: Partial<OwnedItem>, userId = DEFAULT_USER_ID): OwnedItem | null {
  const prof = loadUserProfile(userId);
  const idx = prof.ownedItems.findIndex((item) => item.id === id);
  if (idx === -1) return null;

  prof.ownedItems[idx] = {
    ...prof.ownedItems[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  saveUserProfile(prof);
  return prof.ownedItems[idx];
}

export function deleteOwnedItem(id: string, userId = DEFAULT_USER_ID): boolean {
  const prof = loadUserProfile(userId);
  const initialLen = prof.ownedItems.length;
  prof.ownedItems = prof.ownedItems.filter((item) => item.id !== id);
  if (prof.ownedItems.length !== initialLen) {
    saveUserProfile(prof);
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// Decision History & Feedback CRUD Operations
// -------------------------------------------------------------

export function getDecisions(userId = DEFAULT_USER_ID): DecisionHistoryItem[] {
  const prof = loadUserProfile(userId);
  if (!prof.settings.isMemoryEnabled || !prof.settings.categoryToggles.decision) {
    return [];
  }
  return prof.decisions;
}

export function saveDecision(item: Omit<DecisionHistoryItem, "id"> & { id?: string }): DecisionHistoryItem {
  const userId = item.userId || DEFAULT_USER_ID;
  const prof = loadUserProfile(userId);
  const id = item.id || `dec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  const fullItem: DecisionHistoryItem = {
    ...item,
    id,
  };

  prof.decisions.unshift(fullItem);
  saveUserProfile(prof);
  return fullItem;
}

export function resetToSeedDefaults(userId = DEFAULT_USER_ID): UserMemoryProfile {
  const profile: UserMemoryProfile = {
    userId,
    settings: { ...DEFAULT_SETTINGS },
    memories: [...SEED_MEMORIES],
    ownedItems: [...SEED_OWNED_ITEMS],
    decisions: [],
    updatedAt: new Date().toISOString(),
  };
  saveUserProfile(profile);
  return profile;
}
