"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Dna,
  Shirt,
  Laptop,
  Compass,
  History,
  Shield,
  Settings2,
  Activity,
  Sparkles,
  Check,
  X,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Plus,
  Sliders,
  DollarSign,
  Heart,
  Ban,
  CheckCircle2,
} from "lucide-react";
import { WardrobeManager } from "./WardrobeManager";
import { OwnedItemsManager } from "./OwnedItemsManager";
import type {
  MemoryItem,
  MemorySettings,
  OwnedItem,
  StyleDna,
  BuyingDna,
  LifestyleMemory,
  DecisionHistoryItem,
  MemoryCategory,
} from "@/lib/memory/types";

interface MyDnaDashboardProps {
  initialMemories?: MemoryItem[];
  initialSettings?: MemorySettings;
  initialItems?: OwnedItem[];
  initialDecisions?: DecisionHistoryItem[];
  initialStyle?: StyleDna;
  initialBuying?: BuyingDna;
  initialLifestyle?: LifestyleMemory;
}

export function MyDnaDashboard({
  initialMemories = [],
  initialSettings,
  initialItems = [],
  initialDecisions = [],
  initialStyle,
  initialBuying,
  initialLifestyle,
}: MyDnaDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "style" | "buying" | "wardrobe" | "gear" | "lifestyle" | "decisions" | "activity" | "controls"
  >("overview");

  const [memories, setMemories] = useState<MemoryItem[]>(initialMemories);
  const [items, setItems] = useState<OwnedItem[]>(initialItems);
  const [decisions, setDecisions] = useState<DecisionHistoryItem[]>(initialDecisions);
  const [settings, setSettings] = useState<MemorySettings>(
    initialSettings || {
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
    }
  );

  const [styleDna, setStyleDna] = useState<StyleDna>(
    initialStyle || {
      coloursLiked: ["black", "beige", "navy", "olive"],
      coloursDisliked: ["neon", "hot pink"],
      fitPreference: "relaxed",
      aesthetic: "minimal",
      materialsLiked: ["cotton", "linen", "wool"],
      materialsDisliked: ["polyester", "synthetic shine"],
      patterns: "subtle",
      logoPreference: "minimal_branding",
      preferredBrands: ["Uniqlo", "COS", "Arket"],
      brandsToAvoid: ["FastFashion Ultra"],
      shoesPreference: ["minimal leather sneakers", "loafers"],
      accessoriesPreference: ["silver watches", "clean leather bags"],
      watchPreference: "silver / steel mechanical",
      formalityPreference: "smart_casual",
    }
  );

  const [buyingDna, setBuyingDna] = useState<BuyingDna>(
    initialBuying || {
      valueVsPremium: "balanced_quality",
      budgetSensitivity: "VALUE_FIRST",
      longevityPriority: "MAXIMUM_LIFESPAN",
      riskTolerance: "CONSERVATIVE_ZERO_DEFECT",
      repairabilityImportance: "CRITICAL",
      refurbishedComfort: "CERTIFIED_ONLY",
      salePatience: "WILL_WAIT_FOR_SALES",
      dealTendency: "TOTAL_COST_OF_OWNERSHIP",
      preferredBrands: ["Apple", "Dell", "Sony", "Toyota"],
      avoidedBrands: [],
    }
  );

  const [lifestyle, setLifestyle] = useState<LifestyleMemory>(
    initialLifestyle || {
      workStyle: "remote_dev",
      commuteMode: "walking",
      primaryWorkloads: ["programming", "docker", "writing"],
      livingSpace: "small_apartment",
      maintenancePreference: "minimal_hassle",
    }
  );

  const [notification, setNotification] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch live state on mount
  useEffect(() => {
    const fetchLive = async () => {
      try {
        const [memRes, itemRes] = await Promise.all([
          fetch("/api/memory"),
          fetch("/api/memory/items"),
        ]);
        if (memRes.ok) {
          const memData = await memRes.json();
          if (memData.memories) setMemories(memData.memories);
          if (memData.settings) setSettings(memData.settings);
          if (memData.styleDna) setStyleDna(memData.styleDna);
          if (memData.buyingDna) setBuyingDna(memData.buyingDna);
          if (memData.lifestyle) setLifestyle(memData.lifestyle);
          if (memData.decisionHistory) setDecisions(memData.decisionHistory);
        }
        if (itemRes.ok) {
          const itemData = await itemRes.json();
          if (itemData.items) setItems(itemData.items);
        }
      } catch (err) {
        console.error("Failed to fetch memory store:", err);
      }
    };
    fetchLive();
  }, []);

  // Handlers for Items
  const handleAddItem = async (itemData: Partial<OwnedItem>) => {
    try {
      const res = await fetch("/api/memory/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });
      if (res.ok) {
        const data = await res.json();
        setItems((prev) => [data.item, ...prev]);
        triggerToast(`Added "${data.item.name}" to inventory`);
      }
    } catch {
      triggerToast("Error adding item");
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/memory/items?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        triggerToast("Item removed from inventory");
      }
    } catch {
      triggerToast("Error removing item");
    }
  };

  // Handlers for Settings & Memories
  const handleToggleMemory = async () => {
    const updated = { ...settings, isMemoryEnabled: !settings.isMemoryEnabled };
    setSettings(updated);
    await fetch("/api/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: updated }),
    });
    triggerToast(
      updated.isMemoryEnabled ? "Personal Memory System Enabled" : "Memory Paused (Recommendations Neutral)"
    );
  };

  const handleToggleCategory = async (cat: MemoryCategory) => {
    const updated = {
      ...settings,
      categoryToggles: {
        ...settings.categoryToggles,
        [cat]: !settings.categoryToggles[cat],
      },
    };
    setSettings(updated);
    await fetch("/api/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: updated }),
    });
    triggerToast(`Toggled ${cat} memory`);
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      const res = await fetch(`/api/memory?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMemories((prev) => prev.filter((m) => m.id !== id));
        triggerToast("Memory preference erased");
      }
    } catch {
      triggerToast("Failed to erase memory");
    }
  };

  const handleClearCategory = async (cat: MemoryCategory) => {
    try {
      const res = await fetch(`/api/memory?category=${cat}`, { method: "DELETE" });
      if (res.ok) {
        setMemories((prev) => prev.filter((m) => m.category !== cat));
        triggerToast(`Cleared all ${cat} memories`);
      }
    } catch {
      triggerToast("Failed to clear category");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure? This will permanently wipe all learned preferences, style DNA, and decision logs.")) {
      return;
    }
    try {
      const res = await fetch("/api/memory?all=true", { method: "DELETE" });
      if (res.ok) {
        setMemories([]);
        triggerToast("All personal buying memories permanently cleared");
      }
    } catch {
      triggerToast("Failed to wipe memories");
    }
  };

  // Quick Stats
  const activeMemCount = memories.filter((m) => m.status === "active").length;
  const wardrobeCount = items.filter((i) => i.category === "wardrobe" || i.category === "accessories").length;
  const techGearCount = items.filter((i) => i.category !== "wardrobe" && i.category !== "accessories").length;
  const inferredCount = memories.filter((m) => m.type === "inferred").length;

  return (
    <div className="min-h-screen bg-[#F2EBD8] text-[#1B1A17] pb-24">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B1A17] text-[#FBF7EA] px-4 py-2.5 rounded shadow-xl font-mono text-xs flex items-center gap-2 border-2 border-[#2540D9] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-[#1F6B4F]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Editorial Nav Header */}
      <header className="border-b-2 border-[#1B1A17] bg-[#FBF7EA] py-4 px-4 sm:px-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-[#8A8576] hover:text-[#1B1A17] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Mission</span>
            </Link>
            <span className="text-[#8A8576]">|</span>
            <div className="flex items-center space-x-2">
              <Dna className="w-5 h-5 text-[#2540D9]" />
              <h1 className="font-display font-black text-xl tracking-tight text-[#1B1A17]">
                MY DNA &amp; BUYING INTELLIGENCE
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Master Toggle Status */}
            <button
              onClick={handleToggleMemory}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded font-mono text-xs font-bold border-2 transition-all cursor-pointer ${
                settings.isMemoryEnabled
                  ? "bg-[#1F6B4F]/10 border-[#1F6B4F] text-[#1F6B4F]"
                  : "bg-[#D8381C]/10 border-[#D8381C] text-[#D8381C]"
              }`}
              title="Click to toggle persistent memory"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  settings.isMemoryEnabled ? "bg-[#1F6B4F] animate-pulse" : "bg-[#D8381C]"
                }`}
              />
              <span>{settings.isMemoryEnabled ? "MEMORY ACTIVE" : "MEMORY PAUSED"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Sub-header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-6">
        <div className="border-2 border-[#1B1A17] bg-[#FBF7EA] p-6 rounded shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2540D9]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#2540D9]/10 text-[#2540D9] font-mono text-[11px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Persistent Decision Architecture
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1B1A17] leading-tight">
                &ldquo;VERDICT knows what fits you, what you own, and what you actually need.&rdquo;
              </h2>
              <p className="font-mono text-xs sm:text-sm text-[#8A8576] mt-2 max-w-2xl leading-relaxed">
                Your personal buying intelligence profile. Stored locally and private to you. Directly powers
                cross-category compatibility, wardrobe pairings, tech reuse, and Don&apos;t-Buy recommendations.
              </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs w-full lg:w-auto shrink-0">
              <div className="p-3 bg-[#F2EBD8] border border-[#1B1A17]/20 rounded">
                <span className="text-[10px] text-[#8A8576] uppercase block">Learned Truths</span>
                <span className="text-xl font-extrabold text-[#1B1A17]">{activeMemCount}</span>
                <span className="text-[10px] text-[#2540D9] block">{inferredCount} inferred</span>
              </div>

              <div className="p-3 bg-[#F2EBD8] border border-[#1B1A17]/20 rounded">
                <span className="text-[10px] text-[#8A8576] uppercase block">Wardrobe Items</span>
                <span className="text-xl font-extrabold text-[#1B1A17]">{wardrobeCount}</span>
                <span className="text-[10px] text-[#1F6B4F] block">Pairing ready</span>
              </div>

              <div className="p-3 bg-[#F2EBD8] border border-[#1B1A17]/20 rounded">
                <span className="text-[10px] text-[#8A8576] uppercase block">Tech &amp; Home Assets</span>
                <span className="text-xl font-extrabold text-[#1B1A17]">{techGearCount}</span>
                <span className="text-[10px] text-[#1F6B4F] block">Guarded</span>
              </div>

              <div className="p-3 bg-[#F2EBD8] border border-[#1B1A17]/20 rounded">
                <span className="text-[10px] text-[#8A8576] uppercase block">Decision Records</span>
                <span className="text-xl font-extrabold text-[#1B1A17]">{decisions.length}</span>
                <span className="text-[10px] text-[#8A8576] block">Feedback logged</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="mt-8 flex items-center space-x-1 border-b-2 border-[#1B1A17] overflow-x-auto pb-px scrollbar-none font-mono text-xs">
          {[
            { id: "overview", label: "DNA Overview", icon: Dna },
            { id: "style", label: "Style DNA", icon: Shirt },
            { id: "buying", label: "Buying DNA", icon: Sliders },
            { id: "wardrobe", label: `Wardrobe (${wardrobeCount})`, icon: Shirt },
            { id: "gear", label: `Tech & Gear (${techGearCount})`, icon: Laptop },
            { id: "lifestyle", label: "Lifestyle & Usage", icon: Compass },
            { id: "decisions", label: `Decisions (${decisions.length})`, icon: History },
            { id: "activity", label: "Memory Activity", icon: Activity },
            { id: "controls", label: "Privacy & Controls", icon: Settings2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-4 py-3 border-t-2 border-l-2 border-r-2 -mb-[2px] rounded-t transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#FBF7EA] border-[#1B1A17] font-bold text-[#1B1A17] shadow-sm"
                    : "border-transparent text-[#8A8576] hover:text-[#1B1A17] hover:bg-[#FBF7EA]/50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#2540D9]" : ""}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Style Card */}
              <div className="border-2 border-[#1B1A17] bg-[#FBF7EA] p-5 rounded font-mono text-xs shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#1B1A17]/10">
                    <span className="font-bold text-[#2540D9] uppercase tracking-wider flex items-center gap-1.5">
                      <Shirt className="w-4 h-4" /> Style Profile
                    </span>
                    <button
                      onClick={() => setActiveTab("style")}
                      className="text-[10px] text-[#2540D9] hover:underline font-bold cursor-pointer"
                    >
                      EDIT
                    </button>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    <div>
                      <span className="text-[#8A8576] block text-[10px]">Aesthetic &amp; Silhouette:</span>
                      <span className="font-bold text-[#1B1A17] text-sm capitalize">
                        {styleDna.aesthetic} • {styleDna.fitPreference} fit
                      </span>
                    </div>

                    <div>
                      <span className="text-[#8A8576] block text-[10px]">Preferred Palette:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {styleDna.coloursLiked.map((c) => (
                          <span key={c} className="px-2 py-0.5 rounded bg-[#F2EBD8] border border-[#1B1A17]/15">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[#8A8576] block text-[10px]">Excluded Tones &amp; Cuts:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {styleDna.coloursDisliked.map((c) => (
                          <span key={c} className="px-2 py-0.5 rounded bg-[#D8381C]/10 text-[#D8381C] border border-[#D8381C]/20">
                            ✕ {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[#8A8576] block text-[10px]">Signature Accessories:</span>
                      <span className="text-[#1B1A17] font-medium">{styleDna.watchPreference}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1B1A17]/10 flex items-center justify-between text-[10px] text-[#8A8576]">
                  <span>Active in 11 domains</span>
                  <span className="text-[#1F6B4F] font-bold">100% Calibrated</span>
                </div>
              </div>

              {/* Buying DNA Card */}
              <div className="border-2 border-[#1B1A17] bg-[#FBF7EA] p-5 rounded font-mono text-xs shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#1B1A17]/10">
                    <span className="font-bold text-[#1F6B4F] uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-4 h-4" /> Buying Strategy
                    </span>
                    <button
                      onClick={() => setActiveTab("buying")}
                      className="text-[10px] text-[#1F6B4F] hover:underline font-bold cursor-pointer"
                    >
                      EDIT
                    </button>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    <div>
                      <span className="text-[#8A8576] block text-[10px]">Value Philosophy:</span>
                      <span className="font-bold text-[#1B1A17] text-sm">
                        {buyingDna.valueVsPremium.replace("_", " ").toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#8A8576] block text-[10px]">Lifespan Mandate:</span>
                      <span className="font-semibold text-[#1B1A17]">
                        {buyingDna.longevityPriority.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#8A8576] block text-[10px]">Repairability Requirement:</span>
                      <span className="px-2 py-0.5 rounded bg-[#1F6B4F]/10 text-[#1F6B4F] border border-[#1F6B4F]/20 font-bold inline-block">
                        {buyingDna.repairabilityImportance}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#8A8576] block text-[10px]">Refurbished Acceptance:</span>
                      <span className="text-[#1B1A17]">{buyingDna.refurbishedComfort.replace(/_/g, " ")}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1B1A17]/10 flex items-center justify-between text-[10px] text-[#8A8576]">
                  <span>Applied to Scoring Engine</span>
                  <span className="text-[#1F6B4F] font-bold">Guards Active</span>
                </div>
              </div>

              {/* Wardrobe & Tech Inventory Card */}
              <div className="border-2 border-[#1B1A17] bg-[#FBF7EA] p-5 rounded font-mono text-xs shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#1B1A17]/10">
                    <span className="font-bold text-[#D8381C] uppercase tracking-wider flex items-center gap-1.5">
                      <Laptop className="w-4 h-4" /> Registered Assets
                    </span>
                    <button
                      onClick={() => setActiveTab("wardrobe")}
                      className="text-[10px] text-[#D8381C] hover:underline font-bold cursor-pointer"
                    >
                      VIEW ALL
                    </button>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    <div className="p-2.5 rounded bg-[#F2EBD8] border border-[#1B1A17]/15">
                      <span className="font-bold text-[#1B1A17] block">Signature Wardrobe Capsule:</span>
                      <span className="text-[11px] text-[#8A8576]">
                        {items.filter((i) => i.category === "wardrobe").map((i) => i.name).slice(0, 3).join(", ") || "No items"}
                      </span>
                    </div>

                    <div className="p-2.5 rounded bg-[#F2EBD8] border border-[#1B1A17]/15">
                      <span className="font-bold text-[#1B1A17] block">Reusable Workstation Hardware:</span>
                      <span className="text-[11px] text-[#8A8576]">
                        {items.filter((i) => i.category === "electronics").map((i) => i.name).slice(0, 3).join(", ") || "No items"}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-[#1F6B4F]/10 border border-[#1F6B4F]/20 text-[11px] text-[#1F6B4F]">
                      <span className="font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Don&apos;t-Buy Guard:
                      </span>
                      Preventing duplicate purchases automatically.
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1B1A17]/10 flex items-center justify-between text-[10px] text-[#8A8576]">
                  <span>Total registered: {items.length} items</span>
                  <span className="text-[#2540D9] font-bold">100% Verified</span>
                </div>
              </div>
            </div>

            {/* Recent Learned Memories Feed */}
            <div className="border-2 border-[#1B1A17] bg-[#FBF7EA] p-6 rounded shadow-sm font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#1B1A17]/10 mb-4">
                <span className="font-bold text-[#1B1A17] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2540D9]" />
                  Recently Learned Preferences &amp; Truths
                </span>
                <span className="text-[11px] text-[#8A8576]">Transparent audit log</span>
              </div>

              {memories.length === 0 ? (
                <p className="text-center py-6 text-[#8A8576]">No memories extracted yet. Start a mission or add items.</p>
              ) : (
                <div className="space-y-2.5">
                  {memories.slice(0, 6).map((mem) => (
                    <div
                      key={mem.id}
                      className="p-3 rounded bg-[#F2EBD8] border border-[#1B1A17]/15 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            mem.type === "explicit" ? "bg-[#1F6B4F]" : "bg-[#2540D9]"
                          }`}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold uppercase text-[10px] text-[#1B1A17]">
                              {mem.category.replace("_", " ")}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/5 text-[#8A8576]">
                              {mem.type} ({Math.round(mem.confidence * 100)}%)
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-[#1B1A17] truncate mt-0.5">
                            {typeof mem.value === "string" ? mem.value : JSON.stringify(mem.value)}
                          </p>
                          {mem.evidenceQuote && (
                            <p className="text-[10px] text-[#8A8576] italic truncate">
                              &ldquo;{mem.evidenceQuote}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-[#8A8576]">
                          {new Date(mem.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => handleDeleteMemory(mem.id)}
                          className="p-1 text-[#8A8576] hover:text-[#D8381C] cursor-pointer"
                          title="Forget this memory"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: STYLE DNA */}
        {activeTab === "style" && (
          <div className="border-2 border-[#1B1A17] bg-[#FBF7EA] p-6 rounded shadow-sm font-mono text-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B1A17]/10">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1B1A17] flex items-center gap-2">
                  <Shirt className="w-5 h-5 text-[#2540D9]" /> Style DNA &amp; Aesthetic Boundaries
                </h3>
                <p className="text-xs text-[#8A8576] mt-1">
                  Controls fashion and lifestyle recommendations, fit criteria, and palette harmony.
                </p>
              </div>
              <button
                onClick={() => handleClearCategory("style")}
                className="px-3 py-1.5 border border-[#D8381C]/30 text-[#D8381C] rounded hover:bg-[#D8381C]/10 text-xs font-bold cursor-pointer"
              >
                Clear Style Memories
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Colours Liked */}
              <div className="p-4 bg-[#F2EBD8] border border-[#1B1A17]/20 rounded space-y-2">
                <span className="font-bold text-[#1F6B4F] flex items-center gap-1.5 uppercase text-[11px]">
                  <Heart className="w-3.5 h-3.5" /> Approved Colors &amp; Tones
                </span>
                <p className="text-[11px] text-[#8A8576]">Colors prioritized in clothing and accessories.</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {styleDna.coloursLiked.map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 rounded bg-white border border-[#1B1A17]/20 text-[#1B1A17] font-semibold flex items-center gap-1"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Colours Disliked */}
              <div className="p-4 bg-[#F2EBD8] border border-[#1B1A17]/20 rounded space-y-2">
                <span className="font-bold text-[#D8381C] flex items-center gap-1.5 uppercase text-[11px]">
                  <Ban className="w-3.5 h-3.5" /> Disliked Colors &amp; Neon
                </span>
                <p className="text-[11px] text-[#8A8576]">Never recommended unless explicitly commanded.</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {styleDna.coloursDisliked.map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 rounded bg-[#D8381C]/10 text-[#D8381C] border border-[#D8381C]/20 font-semibold"
                    >
                      ✕ {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Silhouette & Fit */}
              <div className="p-4 bg-[#F2EBD8] border border-[#1B1A17]/20 rounded space-y-2">
                <span className="font-bold text-[#1B1A17] uppercase text-[11px]">Silhouette &amp; Fit</span>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div>
                    <span className="text-[#8A8576] block text-[10px]">Fit Preference:</span>
                    <span className="font-bold text-[#1B1A17] capitalize">{styleDna.fitPreference}</span>
                  </div>
                  <div>
                    <span className="text-[#8A8576] block text-[10px]">Aesthetic:</span>
                    <span className="font-bold text-[#1B1A17] capitalize">{styleDna.aesthetic}</span>
                  </div>
                  <div>
                    <span className="text-[#8A8576] block text-[10px]">Pattern Density:</span>
                    <span className="font-bold text-[#1B1A17] capitalize">{styleDna.patterns}</span>
                  </div>
                  <div>
                    <span className="text-[#8A8576] block text-[10px]">Branding / Logos:</span>
                    <span className="font-bold text-[#1B1A17] capitalize">
                      {styleDna.logoPreference.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Materials & Watches */}
              <div className="p-4 bg-[#F2EBD8] border border-[#1B1A17]/20 rounded space-y-2">
                <span className="font-bold text-[#1B1A17] uppercase text-[11px]">Materials &amp; Accents</span>
                <div className="space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-[#8A8576] block text-[10px]">Preferred Materials:</span>
                    <span className="text-[#1B1A17] font-semibold">{styleDna.materialsLiked.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-[#8A8576] block text-[10px]">Avoided Fabrics:</span>
                    <span className="text-[#D8381C] font-semibold">{styleDna.materialsDisliked.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-[#8A8576] block text-[10px]">Watch Preference:</span>
                    <span className="text-[#2540D9] font-bold">{styleDna.watchPreference}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BUYING DNA */}
        {activeTab === "buying" && (
          <div className="border-2 border-[#1B1A17] bg-[#FBF7EA] p-6 rounded shadow-sm font-mono text-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B1A17]/10">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1B1A17] flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#1F6B4F]" /> Buying DNA &amp; Value Philosophy
                </h3>
                <p className="text-xs text-[#8A8576] mt-1">
                  How VERDICT balances price vs longevity, repairability, refurbishment, and deals.
                </p>
              </div>
              <button
                onClick={() => handleClearCategory("buying")}
                className="px-3 py-1.5 border border-[#D8381C]/30 text-[#D8381C] rounded hover:bg-[#D8381C]/10 text-xs font-bold cursor-pointer"
              >
                Clear Buying Memories
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  label: "Value vs. Premium",
                  val: buyingDna.valueVsPremium.replace(/_/g, " "),
                  desc: "Prioritizes cost-per-wear and build quality over initial cost.",
                },
                {
                  label: "Budget Sensitivity",
                  val: buyingDna.budgetSensitivity.replace(/_/g, " "),
                  desc: "Strict adherence to hard price caps with value checks.",
                },
                {
                  label: "Longevity Priority",
                  val: buyingDna.longevityPriority.replace(/_/g, " "),
                  desc: "Weights products engineered for 5+ years of active duty.",
                },
                {
                  label: "Repairability Mandate",
                  val: buyingDna.repairabilityImportance,
                  desc: "Favors iFixit modular designs and user-serviceable parts.",
                },
                {
                  label: "Refurbished Comfort",
                  val: buyingDna.refurbishedComfort.replace(/_/g, " "),
                  desc: "Comfortable with certified refurbished when warranties match new.",
                },
                {
                  label: "Deal Patience",
                  val: buyingDna.salePatience.replace(/_/g, " "),
                  desc: "Willing to hold off until price trackers indicate optimal lows.",
                },
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-[#F2EBD8] border border-[#1B1A17]/20 rounded space-y-2">
                  <span className="text-[10px] text-[#8A8576] uppercase block font-semibold">{item.label}</span>
                  <span className="text-sm font-extrabold text-[#1B1A17] block uppercase">{item.val}</span>
                  <p className="text-[11px] text-[#8A8576] leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: WARDROBE ASSETS */}
        {activeTab === "wardrobe" && (
          <div className="border-2 border-[#1B1A17] bg-[#FBF7EA] p-6 rounded shadow-sm">
            <WardrobeManager items={items} onAddItem={handleAddItem} onDeleteItem={handleDeleteItem} />
          </div>
        )}

        {/* TAB 5: TECH & HOME GEAR */}
        {activeTab === "gear" && (
          <div className="border-2 border-[#1B1A17] bg-[#FBF7EA] p-6 rounded shadow-sm">
            <OwnedItemsManager items={items} onAddItem={handleAddItem} onDeleteItem={handleDeleteItem} />
          </div>
        )}

        {/* TAB 6: LIFESTYLE & USAGE */}
        {activeTab === "lifestyle" && (
          <div className="border-2 border-[#1B1A17] bg-[#FBF7EA] p-6 rounded shadow-sm font-mono text-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B1A17]/10">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1B1A17] flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#2540D9]" /> Lifestyle &amp; Environmental Context
                </h3>
                <p className="text-xs text-[#8A8576] mt-1">
                  Contextual usage habits that filter out unsuitable form factors and dimensions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#F2EBD8] border border-[#1B1A17]/20 rounded space-y-2">
                <span className="text-[10px] text-[#8A8576] uppercase block">Daily Work Profile</span>
                <span className="font-bold text-sm text-[#1B1A17] block capitalize">
                  {lifestyle.workStyle?.replace(/_/g, " ")} • {lifestyle.commuteMode} commute
                </span>
                <p className="text-[11px] text-[#8A8576]">
                  Laptops and portable gear require high battery endurance and lightweight portability.
                </p>
              </div>

              <div className="p-4 bg-[#F2EBD8] border border-[#1B1A17]/20 rounded space-y-2">
                <span className="text-[10px] text-[#8A8576] uppercase block">Primary Computational Workloads</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {lifestyle.primaryWorkloads?.map((w) => (
                    <span key={w} className="px-2 py-0.5 rounded bg-white border border-[#1B1A17]/20 text-[#1B1A17]">
                      {w}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-[#8A8576]">Requires minimum 16GB RAM and high thermal headroom.</p>
              </div>

              <div className="p-4 bg-[#F2EBD8] border border-[#1B1A17]/20 rounded space-y-2">
                <span className="text-[10px] text-[#8A8576] uppercase block">Living Environment</span>
                <span className="font-bold text-sm text-[#1B1A17] block capitalize">
                  {lifestyle.livingSpace?.replace(/_/g, " ")}
                </span>
                <p className="text-[11px] text-[#8A8576]">
                  Appliance choices prioritize compact footprint and whisper-quiet decibel levels.
                </p>
              </div>

              <div className="p-4 bg-[#F2EBD8] border border-[#1B1A17]/20 rounded space-y-2">
                <span className="text-[10px] text-[#8A8576] uppercase block">Maintenance Preference</span>
                <span className="font-bold text-sm text-[#1F6B4F] block capitalize">
                  {lifestyle.maintenancePreference?.replace(/_/g, " ")}
                </span>
                <p className="text-[11px] text-[#8A8576]">
                  Disqualifies high-maintenance espresso machines or fragile silk garments.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: DECISIONS & LESSONS */}
        {activeTab === "decisions" && (
          <div className="border-2 border-[#1B1A17] bg-[#FBF7EA] p-6 rounded shadow-sm font-mono text-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B1A17]/10">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1B1A17] flex items-center gap-2">
                  <History className="w-5 h-5 text-[#2540D9]" /> Purchase Decisions &amp; Lessons Learned
                </h3>
                <p className="text-xs text-[#8A8576] mt-1">
                  Historical outcomes and post-purchase evaluations that refine future recommendations.
                </p>
              </div>
            </div>

            {decisions.length === 0 ? (
              <p className="text-center py-8 text-[#8A8576]">No purchases finalized yet.</p>
            ) : (
              <div className="space-y-4">
                {decisions.map((dec) => (
                  <div key={dec.id} className="p-4 bg-[#F2EBD8] border border-[#1B1A17]/20 rounded space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-sm text-[#1B1A17] block">{dec.productName}</span>
                        <span className="text-[11px] text-[#8A8576]">
                          Decided {dec.decisionDate} • ₹{dec.priceInr.toLocaleString()} • {dec.category}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#1F6B4F]/10 text-[#1F6B4F] border border-[#1F6B4F]/20 font-bold text-[10px]">
                        BOUGHT &amp; CONFIRMED
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#1B1A17]/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[#8A8576] block text-[10px]">Why Selected:</span>
                        <p className="text-[#1B1A17]">{dec.selectionReason}</p>
                      </div>
                      <div>
                        <span className="text-[#8A8576] block text-[10px]">Options Rejected:</span>
                        <p className="text-[#8A8576]">{dec.rejectedOptions.join(", ")}</p>
                      </div>
                    </div>

                    {dec.lessonsLearned && (
                      <div className="mt-2 p-2 rounded bg-white border border-[#1B1A17]/15 text-[11px] text-[#2540D9]">
                        <span className="font-bold">Permanent Lesson: </span>
                        {dec.lessonsLearned}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: MEMORY ACTIVITY LOG */}
        {activeTab === "activity" && (
          <div className="border-2 border-[#1B1A17] bg-[#FBF7EA] p-6 rounded shadow-sm font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B1A17]/10">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1B1A17] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#2540D9]" /> Forensic Memory Audit Stream
                </h3>
                <p className="text-xs text-[#8A8576] mt-1">
                  Complete provenance of all explicit statements, inferred habits, and AI justifications.
                </p>
              </div>
              <span className="text-xs text-[#8A8576]">{memories.length} entries stored</span>
            </div>

            <div className="space-y-2">
              {memories.map((mem) => (
                <div
                  key={mem.id}
                  className="p-3 bg-[#F2EBD8] border border-[#1B1A17]/15 rounded flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#1B1A17] uppercase text-[10px]">
                        [{mem.category}]
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          mem.type === "explicit"
                            ? "bg-[#1F6B4F]/10 text-[#1F6B4F]"
                            : "bg-[#2540D9]/10 text-[#2540D9]"
                        }`}
                      >
                        {mem.type}
                      </span>
                      <span className="text-[9px] text-[#8A8576]">
                        confidence: {Math.round(mem.confidence * 100)}% • src: {mem.source}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-[#1B1A17] mt-1">
                      {typeof mem.value === "string" ? mem.value : JSON.stringify(mem.value)}
                    </p>

                    {mem.evidenceQuote && (
                      <p className="text-[10px] text-[#8A8576] italic mt-0.5">
                        Extracted from: &ldquo;{mem.evidenceQuote}&rdquo;
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteMemory(mem.id)}
                    className="p-1 text-[#8A8576] hover:text-[#D8381C] cursor-pointer shrink-0"
                    title="Delete memory"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: PRIVACY & CONTROLS */}
        {activeTab === "controls" && (
          <div className="border-2 border-[#1B1A17] bg-[#FBF7EA] p-6 rounded shadow-sm font-mono text-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B1A17]/10">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1B1A17] flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#1F6B4F]" /> Privacy &amp; Memory Controls
                </h3>
                <p className="text-xs text-[#8A8576] mt-1">
                  100% user-sovereign. Disable any category, prevent inferences, or purge all data.
                </p>
              </div>
            </div>

            {/* Master Toggles */}
            <div className="space-y-4">
              <div className="p-4 bg-[#F2EBD8] border border-[#1B1A17]/20 rounded flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-[#1B1A17] block">Master Memory System</span>
                  <p className="text-[11px] text-[#8A8576]">
                    When paused, VERDICT will not extract memories or personalize recommendations.
                  </p>
                </div>
                <button
                  onClick={handleToggleMemory}
                  className={`px-4 py-2 rounded font-bold cursor-pointer transition-colors ${
                    settings.isMemoryEnabled
                      ? "bg-[#1F6B4F] text-white hover:bg-[#18533E]"
                      : "bg-[#D8381C] text-white hover:bg-[#B32B14]"
                  }`}
                >
                  {settings.isMemoryEnabled ? "ENABLED" : "PAUSED"}
                </button>
              </div>

              {/* Category Toggles */}
              <div className="p-4 bg-[#F2EBD8] border border-[#1B1A17]/20 rounded space-y-3">
                <span className="font-bold text-xs uppercase text-[#1B1A17] block">Category Permissions</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  {(
                    [
                      "style",
                      "buying",
                      "owned_item",
                      "lifestyle",
                      "decision",
                      "dislike",
                      "compatibility",
                      "feedback",
                    ] as MemoryCategory[]
                  ).map((cat) => {
                    const isEnabled = settings.categoryToggles[cat] ?? true;
                    return (
                      <button
                        key={cat}
                        onClick={() => handleToggleCategory(cat)}
                        className={`p-2.5 rounded border text-left flex items-center justify-between cursor-pointer transition-colors ${
                          isEnabled
                            ? "bg-white border-[#1B1A17]/30 text-[#1B1A17]"
                            : "bg-black/5 border-dashed border-[#1B1A17]/20 text-[#8A8576]"
                        }`}
                      >
                        <span className="capitalize font-semibold">{cat.replace("_", " ")}</span>
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                            isEnabled ? "bg-[#1F6B4F]/10 text-[#1F6B4F]" : "bg-[#D8381C]/10 text-[#D8381C]"
                          }`}
                        >
                          {isEnabled ? "ON" : "OFF"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-5 border-2 border-[#D8381C] bg-[#D8381C]/5 rounded space-y-3">
                <span className="font-bold text-[#D8381C] uppercase flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-4 h-4" /> Danger Zone: Permanent Data Wipe
                </span>
                <p className="text-xs text-[#1B1A17]">
                  Wipes your style DNA, registered possessions, feedback logs, and inferred habits from disk. This cannot be undone.
                </p>
                <div className="pt-1">
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 bg-[#D8381C] text-white rounded font-bold hover:bg-[#B32B14] cursor-pointer transition-colors"
                  >
                    Purge All Personal Buying Memory
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
