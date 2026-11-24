"use client";

import { useState } from "react";
import { Plus, Trash2, Laptop, Home, Car, Wrench, Shield, Check, X, Sparkles } from "lucide-react";
import type { OwnedItem, OwnedItemCategory } from "@/lib/memory/types";

interface OwnedItemsManagerProps {
  items: OwnedItem[];
  onAddItem: (item: Partial<OwnedItem>) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
}

export function OwnedItemsManager({ items, onAddItem, onDeleteItem }: OwnedItemsManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<OwnedItemCategory | "all">("all");
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState<OwnedItemCategory>("electronics");
  const [subcategory, setSubcategory] = useState("monitor");
  const [modelNumber, setModelNumber] = useState("");
  const [condition, setCondition] = useState<"NEW" | "LIKE_NEW" | "EXCELLENT" | "GOOD">("EXCELLENT");
  const [notes, setNotes] = useState("");
  const [priceInr, setPriceInr] = useState("");

  const techAndHomeItems = items.filter(
    (item) => item.category !== "wardrobe" && item.category !== "accessories"
  );

  const filteredItems = techAndHomeItems.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddItem({
        name,
        brand: brand || "Generic",
        category,
        subcategory,
        modelNumber: modelNumber || undefined,
        condition,
        priceInr: priceInr ? Number(priceInr) : undefined,
        notes: notes || undefined,
        status: "ACTIVE_IN_USE",
        source: "manual",
      });

      setName("");
      setBrand("");
      setModelNumber("");
      setNotes("");
      setPriceInr("");
      setIsAdding(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (cat: OwnedItemCategory) => {
    switch (cat) {
      case "electronics":
        return <Laptop className="w-4 h-4 text-[#2540D9]" />;
      case "home":
      case "appliances":
        return <Home className="w-4 h-4 text-[#1F6B4F]" />;
      case "automotive":
        return <Car className="w-4 h-4 text-[#D8381C]" />;
      default:
        return <Wrench className="w-4 h-4 text-[#8A8576]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1B1A17]/10">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#1B1A17] flex items-center gap-2">
            <Laptop className="w-6 h-6 text-[#1F6B4F]" />
            Electronics, Gear & Possessions
          </h2>
          <p className="text-sm font-mono text-[#8A8576] mt-1">
            Registered devices, appliances, and tools. Powers accessory reuse &amp; Don&apos;t-Buy recommendations.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#1F6B4F] text-white rounded font-mono text-xs font-semibold hover:bg-[#18533E] transition-colors cursor-pointer shadow-sm w-full sm:w-auto"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? "Cancel" : "Add Device or Asset"}
        </button>
      </div>

      {/* Add Device Drawer */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="p-5 border-2 border-[#1F6B4F] bg-[#FBF7EA] rounded shadow-md space-y-4 font-mono text-xs animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#1B1A17]/10">
            <span className="font-bold uppercase tracking-wider text-[#1F6B4F] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Register Owned Device or Asset
            </span>
            <span className="text-[11px] text-[#8A8576]">Used for compatibility and avoiding duplicate purchases</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[#8A8576] mb-1 font-semibold">Device / Asset Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dell UltraSharp 27'' 4K"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#1B1A17]/30 rounded focus:border-[#1F6B4F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#8A8576] mb-1 font-semibold">Brand / Manufacturer</label>
              <input
                type="text"
                placeholder="e.g. Dell, Apple, Sony"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#1B1A17]/30 rounded focus:border-[#1F6B4F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#8A8576] mb-1 font-semibold">Domain Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OwnedItemCategory)}
                className="w-full px-3 py-2 bg-white border border-[#1B1A17]/30 rounded focus:border-[#1F6B4F] focus:outline-none"
              >
                <option value="electronics">Electronics & Computing</option>
                <option value="appliances">Appliances & Kitchen</option>
                <option value="home">Home & Living</option>
                <option value="automotive">Automotive & Mobility</option>
                <option value="other">Other Equipment</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8A8576] mb-1 font-semibold">Subcategory / Type</label>
              <input
                type="text"
                placeholder="e.g. monitor, charger, keyboard"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#1B1A17]/30 rounded focus:border-[#1F6B4F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#8A8576] mb-1 font-semibold">Model / Specs</label>
              <input
                type="text"
                placeholder="e.g. U2723QE, 90W USB-C"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#1B1A17]/30 rounded focus:border-[#1F6B4F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#8A8576] mb-1 font-semibold">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-[#1B1A17]/30 rounded focus:border-[#1F6B4F] focus:outline-none"
              >
                <option value="LIKE_NEW">Like New</option>
                <option value="EXCELLENT">Excellent</option>
                <option value="GOOD">Good (Functional)</option>
                <option value="NEW">Brand New</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8A8576] mb-1 font-semibold">Approx. Cost (₹)</label>
              <input
                type="number"
                placeholder="e.g. 45000"
                value={priceInr}
                onChange={(e) => setPriceInr(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#1B1A17]/30 rounded focus:border-[#1F6B4F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#8A8576] mb-1 font-semibold">Specs & Compatibility Notes</label>
              <input
                type="text"
                placeholder="e.g. 90W Power Delivery, USB hub"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#1B1A17]/30 rounded focus:border-[#1F6B4F] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#1B1A17]/10">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 border border-[#1B1A17]/30 rounded hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-[#1F6B4F] text-white rounded font-bold hover:bg-[#18533E] flex items-center gap-1 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Asset"}
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: "all", label: "All Gear", count: techAndHomeItems.length },
          { id: "electronics", label: "Electronics & Tech", count: techAndHomeItems.filter((i) => i.category === "electronics").length },
          { id: "appliances", label: "Appliances", count: techAndHomeItems.filter((i) => i.category === "appliances").length },
          { id: "home", label: "Home", count: techAndHomeItems.filter((i) => i.category === "home").length },
          { id: "automotive", label: "Automotive", count: techAndHomeItems.filter((i) => i.category === "automotive").length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id as any)}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
              selectedCategory === tab.id
                ? "bg-[#1B1A17] text-[#FBF7EA] font-bold shadow-sm"
                : "bg-[#F2EBD8] text-[#1B1A17] border border-[#1B1A17]/20 hover:border-[#1B1A17]"
            }`}
          >
            {tab.label} <span className="opacity-60 ml-1">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-[#1B1A17]/20 rounded bg-[#FBF7EA]/50">
          <Laptop className="w-8 h-8 text-[#8A8576] mx-auto mb-2 opacity-50" />
          <p className="font-mono text-sm text-[#1B1A17] font-semibold">No assets registered in this category</p>
          <p className="font-mono text-xs text-[#8A8576] mt-1">
            Add your monitors, keyboards, chargers, or appliances to allow VERDICT to leverage them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="border-2 border-[#1B1A17] bg-[#FBF7EA] p-4 rounded shadow-sm hover:shadow-md transition-shadow relative group font-mono"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded bg-[#F2EBD8] border border-[#1B1A17]/20 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1B1A17] leading-snug">{item.name}</h3>
                    <span className="text-[11px] text-[#8A8576]">
                      {item.brand} {item.modelNumber ? `• ${item.modelNumber}` : ""}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#8A8576] hover:text-[#D8381C] cursor-pointer"
                  title="Remove from inventory"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Badges */}
              <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-[#F2EBD8] border border-[#1B1A17]/10 text-[#1B1A17] uppercase">
                  {item.subcategory}
                </span>
                {item.condition && (
                  <span className="px-2 py-0.5 rounded bg-[#1F6B4F]/10 border border-[#1F6B4F]/30 text-[#1F6B4F] font-bold">
                    {item.condition}
                  </span>
                )}
                {item.priceInr && (
                  <span className="px-2 py-0.5 rounded bg-[#2540D9]/10 border border-[#2540D9]/20 text-[#2540D9]">
                    ₹{item.priceInr.toLocaleString()}
                  </span>
                )}
              </div>

              {item.notes && (
                <p className="mt-2.5 pt-2 border-t border-[#1B1A17]/10 text-[11px] text-[#8A8576] leading-relaxed">
                  {item.notes}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between text-[10px] text-[#8A8576]">
                <span className="flex items-center gap-1 text-[#1F6B4F] font-semibold">
                  <Shield className="w-3 h-3" /> Don&apos;t-Buy Guard Active
                </span>
                <span>Active</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
