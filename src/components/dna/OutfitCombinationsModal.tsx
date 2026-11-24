"use client";

import { Shirt, CheckCircle2, ShoppingBag, Sparkles, X } from "lucide-react";
import type { OutfitSuggestion } from "@/lib/memory";

interface OutfitCombinationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  outfitSuggestions: OutfitSuggestion[];
}

export function OutfitCombinationsModal({
  isOpen,
  onClose,
  productName,
  outfitSuggestions,
}: OutfitCombinationsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#FBF7EA] border-2 border-[#1B1A17] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-[#1B1A17]">
        {/* Header */}
        <div className="border-b-2 border-[#1B1A17] bg-[#F2EBD8] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shirt className="w-5 h-5 text-[#2540D9]" />
            <div>
              <h3 className="font-display font-extrabold text-lg tracking-tight">
                Wardrobe Intelligence — Outfit Pairings
              </h3>
              <p className="text-xs font-mono text-[#8A8576]">
                Cross-examined against your registered wardrobe inventory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#1B1A17]/10 text-[#1B1A17] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="p-3.5 rounded bg-[#2540D9]/5 border border-[#2540D9]/20 font-mono text-xs">
            <span className="font-bold text-[#2540D9] block text-[11px] uppercase tracking-wider mb-1">
              Target Candidate:
            </span>
            <span className="font-bold text-sm text-[#1B1A17]">{productName}</span>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-bold text-sm text-[#1B1A17] uppercase tracking-wider">
              Verified Matching Outfits ({outfitSuggestions.length}):
            </h4>

            {outfitSuggestions.map((outfit, index) => (
              <div
                key={outfit.id || index}
                className="border-2 border-[#1B1A17] bg-white p-4 rounded-lg shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-[#1B1A17] text-[#FBF7EA] font-mono text-[10px] font-bold">
                      LOOK 0{index + 1}
                    </span>
                    <span className="font-bold text-sm">{outfit.combinationTitle}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#1F6B4F]/10 text-[#1F6B4F] border border-[#1F6B4F]/30 font-mono text-[10px] font-bold uppercase">
                    {outfit.occasion}
                  </span>
                </div>

                {/* Owned items used */}
                <div className="font-mono text-xs space-y-1">
                  <span className="text-[11px] text-[#8A8576] uppercase font-bold block">
                    Pieces Reused from Your Wardrobe:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    {outfit.ownedItemsUsed.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 p-2 rounded bg-[#FBF7EA] border border-[#1B1A17]/20"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#1F6B4F] shrink-0" />
                        <div>
                          <span className="font-bold text-[#1B1A17] block text-xs">{item.name}</span>
                          <span className="text-[10px] text-[#8A8576]">
                            {item.brand} · {item.subcategory}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Styling Advice & Color Harmony */}
                <div className="font-mono text-xs space-y-1.5 pt-2 border-t border-[#1B1A17]/10">
                  <p className="text-[#1B1A17] leading-relaxed">
                    <span className="font-bold text-[#2540D9]">Color Harmony:</span> {outfit.colorHarmonyExplanation}
                  </p>
                  <p className="text-[#8A8576] italic">
                    <span className="font-bold text-[#1B1A17] not-italic">Styling Directive:</span> {outfit.stylingAdvice}
                  </p>
                </div>

                {/* Financial Justification */}
                <div className="p-2.5 rounded bg-[#1F6B4F]/10 border border-[#1F6B4F]/20 font-mono text-xs flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-[#1F6B4F] font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Zero Additional Purchases Needed</span>
                  </div>
                  <span className="text-[11px] text-[#8A8576]">100% Wardrobe Utility</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-[#1B1A17] bg-[#F2EBD8] px-6 py-3 flex items-center justify-between font-mono text-xs">
          <span className="text-[#8A8576]">VERDICT Wardrobe Intelligence Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#1B1A17] text-[#FBF7EA] font-bold hover:bg-[#2540D9] transition cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
