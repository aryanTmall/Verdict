"use client";

import { useState } from "react";
import { Sparkles, ShieldCheck, AlertCircle, Shirt, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import type { Evaluation } from "@/lib/engine";

interface PersonalFitBadgeProps {
  evaluation: Evaluation;
  onOpenOutfits?: () => void;
  className?: string;
}

export function PersonalFitBadge({ evaluation, onOpenOutfits, className = "" }: PersonalFitBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const personalFit = evaluation.personalFitScore ?? Math.round(evaluation.fit);
  const compatibility = evaluation.compatibilityScore ?? 80;
  const objectiveScore = Math.round(evaluation.fit);
  const reasons = evaluation.personalFitReasons || [];
  const dontBuy = evaluation.dontBuyWarning;
  const hasOutfits = evaluation.outfitSuggestions && evaluation.outfitSuggestions.length > 0;
  const reusedAccessories = evaluation.reusedOwnedAccessories || [];

  return (
    <div className={`border-2 border-[#1B1A17] bg-[#FBF7EA] p-3 rounded shadow-sm text-xs font-mono ${className}`}>
      {/* Top Header Row with dual scores */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded bg-[#2540D9]/10 text-[#2540D9]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold uppercase tracking-wider text-[#1B1A17]">Personal Fit</span>
            <span className="text-[10px] text-[#8A8576] block">DNA & Possession Match</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Objective Quality Score */}
          <div className="text-right px-2 py-1 rounded bg-[#F2EBD8] border border-[#1B1A17]/20">
            <span className="text-[9px] text-[#8A8576] block uppercase">Quality</span>
            <span className="font-bold text-[#1B1A17]">{objectiveScore}</span>
            <span className="text-[10px] text-[#8A8576]">/100</span>
          </div>

          {/* Dedicated Personal Fit Score */}
          <div
            className={`text-right px-2.5 py-1 rounded border-2 ${
              personalFit >= 90
                ? "bg-[#1F6B4F]/10 border-[#1F6B4F] text-[#1F6B4F]"
                : personalFit >= 75
                ? "bg-[#2540D9]/10 border-[#2540D9] text-[#2540D9]"
                : "bg-[#D8381C]/10 border-[#D8381C] text-[#D8381C]"
            }`}
          >
            <span className="text-[9px] block uppercase font-extrabold">Personal</span>
            <span className="font-extrabold text-sm">{personalFit}</span>
            <span className="text-[10px] opacity-70">/100</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-[#8A8576] hover:text-[#1B1A17] cursor-pointer"
            title="Inspect Personal Fit breakdown"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Don't-Buy Flag if triggered */}
      {dontBuy?.isTriggered && (
        <div className="mt-2.5 p-2 rounded bg-[#D8381C]/10 border border-[#D8381C] text-[#1B1A17]">
          <div className="flex items-start space-x-1.5">
            <AlertCircle className="w-4 h-4 text-[#D8381C] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#D8381C] block text-[11px] uppercase tracking-wide">
                Possession Notice: Similar Item Owned
              </span>
              <p className="text-[11px] leading-snug mt-0.5">{dontBuy.respectfulRecommendation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Forensic Disclosure */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-[#1B1A17]/20 space-y-2">
          {/* Key Compatibility Score */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#8A8576]">Possession Compatibility:</span>
            <span className="font-bold text-[#1B1A17]">{compatibility}/100</span>
          </div>

          {/* Reused accessories highlight */}
          {reusedAccessories.length > 0 && (
            <div className="p-2 rounded bg-[#1F6B4F]/10 border border-[#1F6B4F]/30 text-[11px]">
              <span className="font-bold text-[#1F6B4F] flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Reusable Gear Detected:
              </span>
              <ul className="mt-1 space-y-0.5 text-[#1B1A17]">
                {reusedAccessories.map((acc, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>• {acc.name}</span>
                    {acc.savesMoneyInr && (
                      <span className="font-bold text-[#1F6B4F]">Saves ₹{acc.savesMoneyInr.toLocaleString("en-IN")}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specific Personal Fit Reasons */}
          {reasons.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] text-[#8A8576] uppercase tracking-wider block font-bold">
                Why This Fits You:
              </span>
              {reasons.map((r, i) => (
                <div key={i} className="flex items-start space-x-1.5 text-[11px] text-[#1B1A17]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1F6B4F] shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          )}

          {/* Outfit Compatibility Trigger for Fashion */}
          {hasOutfits && onOpenOutfits && (
            <button
              onClick={onOpenOutfits}
              className="w-full mt-2 py-1.5 px-2 rounded bg-[#1B1A17] text-[#FBF7EA] hover:bg-[#2540D9] text-[11px] font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>View {evaluation.outfitSuggestions!.length} Wardrobe Outfit Combinations ↗</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
