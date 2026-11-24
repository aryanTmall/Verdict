"use client";

import { useState } from "react";
import { Plus, Trash2, Tag, Shirt, Watch, Sparkles, Filter, Check, X } from "lucide-react";
import type { OwnedItem } from "@/lib/memory/types";

interface WardrobeManagerProps {
  items: OwnedItem[];
  onAddItem: (item: Partial<OwnedItem>) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
}

export function WardrobeManager({ items, onAddItem, onDeleteItem }: WardrobeManagerProps) {
  const [filterSubcategory, setFilterSubcategory] = useState<string>("all");
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [subcategory, setSubcategory] = useState("shirt");
  const [color, setColor] = useState("black");
  const [fit, setFit] = useState("relaxed");
  const [condition, setCondition] = useState<"NEW" | "LIKE_NEW" | "EXCELLENT" | "GOOD">("EXCELLENT");
  const [priceInr, setPriceInr] = useState("");
  const [notes, setNotes] = useState("");

  const wardrobeItems = items.filter((item) => item.category === "wardrobe" || item.category === "accessories");

  const filteredItems = wardrobeItems.filter((item) => {
    if (filterSubcategory === "all") return true;
    if (filterSubcategory === "top") return ["shirt", "tshirt", "jacket", "sweater"].includes(item.subcategory.toLowerCase());
    if (filterSubcategory === "bottom") return ["trousers", "pants", "chinos", "jeans", "shorts"].includes(item.subcategory.toLowerCase());
    if (filterSubcategory === "shoes") return ["shoes", "sneakers", "boots", "loafers"].includes(item.subcategory.toLowerCase());
    if (filterSubcategory === "accessories") return ["watch", "bag", "belt", "sunglasses", "hat"].includes(item.subcategory.toLowerCase());
    return item.subcategory.toLowerCase() === filterSubcategory.toLowerCase();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddItem({
        name,
        brand: brand || "Generic",
        category: subcategory === "watch" || subcategory === "bag" ? "accessories" : "wardrobe",
        subcategory,
        color,
        fit,
        condition,
        priceInr: priceInr ? Number(priceInr) : undefined,
        notes: notes || undefined,
        status: "ACTIVE_IN_USE",
        source: "manual",
      });

      // Reset
      setName("");
      setBrand("");
      setNotes("");
      setPriceInr("");
      setIsAdding(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getColorChip = (c?: string) => {
    if (!c) return "bg-[#8A8576]";
    const lower = c.toLowerCase();
    if (lower.includes("white")) return "bg-white border border-[#1B1A17]/30";
    if (lower.includes("black")) return "bg-[#1B1A17]";
    if (lower.includes("beige") || lower.includes("khaki") || lower.includes("cream")) return "bg-[#E6DBBE]";
    if (lower.includes("navy") || lower.includes("blue")) return "bg-[#1E3A8A]";
    if (lower.includes("olive") || lower.includes("green")) return "bg-[#3D5A2B]";
    if (lower.includes("silver") || lower.includes("grey") || lower.includes("gray")) return "bg-[#9CA3AF]";
    if (lower.includes("gold")) return "bg-[#D97706]";
    if (lower.includes("brown")) return "bg-[#78350F]";
    return "bg-[#8A8576]";
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1B1A17]/10">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#1B1A17] flex items-center gap-2">
            <Shirt className="w-6 h-6 text-[#2540D9]" />
            Wardrobe & Style Inventory
          </h2>
          <p className="text-sm font-mono text-[#8A8576] mt-1">
            Personal clothing, shoes & accessories used for real-time outfit pairing & duplication protection.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#2540D9] text-white rounded font-mono text-xs font-semibold hover:bg-[#1E34AF] transition-colors cursor-pointer w-full sm:w-auto shadow-sm"
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? "Cancel" : "Add Garment / Accessory"}
          </button>
        </div>
      </div>

      {/* Add Item Modal / Inline Drawer */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="p-5 border-2 border-[#2540D9] bg-[#FBF7EA] rounded shadow-md space-y-4 font-mono text-xs animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#1B1A17]/10">
            <span className="font-bold uppercase tracking-wider text-[#2540D9] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Register Owned Wardrobe Piece
            </span>
            <span className="text-[11px] text-[#8A8576]">Never fabricated • Strictly user-verified</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[#8A8576] mb-1 font-semibold">Garment / Item Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Olive Linen Overshirt"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#1B1A17]/30 rounded focus:border-[#2540D9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#8A8576] mb-1 font-semibold">Brand / Maker</label>
              <input
                type="text"
                placeholder="e.g. Uniqlo, Nike, Seiko"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#1B1A17]/30 rounded focus:border-[#2540D9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#8A8576] mb-1 font-semibold">Classification</label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#1B1A17]/30 rounded focus:border-[#2540D9] focus:outline-none"
              >
                <option value="shirt">Top: Shirt / Overshirt</option>
                <option value="tshirt">Top: T-Shirt</option>
                <option value="jacket">Top: Jacket / Outerwear</option>
                <option value="trousers">Bottom: Trousers / Chinos</option>
                <option value="jeans">Bottom: Jeans</option>
                <option value="shoes">Footwear: Sneakers / Shoes</option>
                <option value="watch">Accessory: Wristwatch</option>
                <option value="bag">Accessory: Bag / Backpack</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8A8576] mb-1 font-semibold">Color Dominance</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#1B1A17]/30 rounded focus:border-[#2540D9] focus:outline-none"
              >
                <option value="black">Black</option>
                <option value="beige">Beige / Sand</option>
                <option value="white">White / Off-White</option>
                <option value="navy">Navy Blue</option>
                <option value="olive">Olive / Forest Green</option>
                <option value="grey">Grey / Charcoal</option>
                <option value="silver">Silver Steel</option>
                <option value="brown">Brown / Tan</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8A8576] mb-1 font-semibold">Silhouette / Fit</label>
              <select
                value={fit}
                onChange={(e) => setFit(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#1B1A17]/30 rounded focus:border-[#2540D9] focus:outline-none"
              >
                <option value="relaxed">Relaxed / Casual</option>
                <option value="slim">Slim / Structured</option>
                <option value="regular">Regular Classic</option>
                <option value="oversized">Oversized</option>
                <option value="tailored">Tailored</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8A8576] mb-1 font-semibold">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-[#1B1A17]/30 rounded focus:border-[#2540D9] focus:outline-none"
              >
                <option value="LIKE_NEW">Like New</option>
                <option value="EXCELLENT">Excellent</option>
                <option value="GOOD">Good (Daily Wear)</option>
                <option value="NEW">Brand New</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8A8576] mb-1 font-semibold">Approx. Price (₹)</label>
              <input
                type="number"
                placeholder="e.g. 3500"
                value={priceInr}
                onChange={(e) => setPriceInr(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#1B1A17]/30 rounded focus:border-[#2540D9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#8A8576] mb-1 font-semibold">Styling Notes</label>
              <input
                type="text"
                placeholder="e.g. Pairs well with neutral bottoms"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#1B1A17]/30 rounded focus:border-[#2540D9] focus:outline-none"
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
              className="px-4 py-1.5 bg-[#2540D9] text-white rounded font-bold hover:bg-[#1E34AF] flex items-center gap-1 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save to Wardrobe"}
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-[#8A8576] flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {[
          { id: "all", label: "All Items", count: wardrobeItems.length },
          { id: "top", label: "Tops & Outerwear", count: wardrobeItems.filter((i) => ["shirt", "tshirt", "jacket", "sweater"].includes(i.subcategory.toLowerCase())).length },
          { id: "bottom", label: "Trousers & Bottoms", count: wardrobeItems.filter((i) => ["trousers", "pants", "chinos", "jeans"].includes(i.subcategory.toLowerCase())).length },
          { id: "shoes", label: "Footwear", count: wardrobeItems.filter((i) => ["shoes", "sneakers", "boots", "loafers"].includes(i.subcategory.toLowerCase())).length },
          { id: "accessories", label: "Accessories & Watches", count: wardrobeItems.filter((i) => ["watch", "bag", "belt"].includes(i.subcategory.toLowerCase())).length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterSubcategory(tab.id)}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
              filterSubcategory === tab.id
                ? "bg-[#1B1A17] text-[#FBF7EA] font-bold shadow-sm"
                : "bg-[#F2EBD8] text-[#1B1A17] border border-[#1B1A17]/20 hover:border-[#1B1A17]"
            }`}
          >
            {tab.label} <span className="opacity-60 ml-1">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Wardrobe Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-[#1B1A17]/20 rounded bg-[#FBF7EA]/50">
          <Shirt className="w-8 h-8 text-[#8A8576] mx-auto mb-2 opacity-50" />
          <p className="font-mono text-sm text-[#1B1A17] font-semibold">No wardrobe pieces registered in this category</p>
          <p className="font-mono text-xs text-[#8A8576] mt-1">
            Add items manually or tell VERDICT what you own during a mission (e.g. &quot;I already own white sneakers and beige chinos&quot;).
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
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded-full shrink-0 shadow-inner ${getColorChip(item.color)}`}
                    title={`Color: ${item.color || "Neutral"}`}
                  />
                  <div>
                    <h3 className="font-bold text-sm text-[#1B1A17] leading-snug">{item.name}</h3>
                    <span className="text-[11px] text-[#8A8576]">
                      {item.brand} • {item.subcategory.toUpperCase()}
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

              {/* Attributes badges */}
              <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                {item.color && (
                  <span className="px-2 py-0.5 rounded bg-[#F2EBD8] border border-[#1B1A17]/10 text-[#1B1A17]">
                    {item.color}
                  </span>
                )}
                {item.fit && (
                  <span className="px-2 py-0.5 rounded bg-[#F2EBD8] border border-[#1B1A17]/10 text-[#1B1A17]">
                    fit: {item.fit}
                  </span>
                )}
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
                <p className="mt-2.5 pt-2 border-t border-[#1B1A17]/10 text-[11px] text-[#8A8576] italic leading-relaxed">
                  &ldquo;{item.notes}&rdquo;
                </p>
              )}

              <div className="mt-3 flex items-center justify-between text-[10px] text-[#8A8576]">
                <span className="flex items-center gap-1 text-[#1F6B4F] font-semibold">
                  <Check className="w-3 h-3" /> Ready for Pairing
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
