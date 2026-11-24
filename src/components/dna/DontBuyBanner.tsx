"use client";

import { ShieldAlert, ArrowRight, Check } from "lucide-react";
import type { DontBuyEvaluation } from "@/lib/memory";

interface DontBuyBannerProps {
  evaluation: DontBuyEvaluation;
  onKeepExisting?: () => void;
  className?: string;
}

export function DontBuyBanner({ evaluation, onKeepExisting, className = "" }: DontBuyBannerProps) {
  if (!evaluation.isTriggered) return null;

  const isStrongDuplication = evaluation.severity === "STRONG_DUPLICATION_WARNING";

  return (
    <div
      className={`border-2 ${
        isStrongDuplication ? "border-[#D8381C] bg-[#D8381C]/10" : "border-[#F59E0B] bg-[#F59E0B]/10"
      } p-4 rounded-lg shadow-sm font-mono text-xs text-[#1B1A17] space-y-2.5 ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div
            className={`p-1.5 rounded text-white ${
              isStrongDuplication ? "bg-[#D8381C]" : "bg-[#F59E0B]"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span
              className={`font-extrabold uppercase tracking-wider text-xs block ${
                isStrongDuplication ? "text-[#D8381C]" : "text-[#B45309]"
              }`}
            >
              {isStrongDuplication ? "Don't Buy Mode: Duplication Warning" : "Don't Buy Mode: Existing Possession Match"}
            </span>
            <span className="text-[11px] text-[#8A8576]">
              {evaluation.functionalOverlapPct}% functional overlap with your current possessions
            </span>
          </div>
        </div>

        {evaluation.existingItemMatched && (
          <span className="px-2 py-0.5 rounded bg-white/80 border border-[#1B1A17]/20 font-bold text-[10px] uppercase">
            Owns: {evaluation.existingItemMatched.name}
          </span>
        )}
      </div>

      <p className="text-xs leading-relaxed font-sans text-[#1B1A17] pl-8">
        {evaluation.respectfulRecommendation}
      </p>

      <div className="pl-8 flex flex-wrap items-center gap-3 pt-1">
        {onKeepExisting && (
          <button
            onClick={onKeepExisting}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-[#1B1A17] text-[#FBF7EA] hover:bg-[#1F6B4F] text-[11px] font-bold transition cursor-pointer"
          >
            <Check className="w-3 h-3" />
            <span>Keep My Current Device / Skip Purchase</span>
          </button>
        )}
        <span className="text-[11px] text-[#8A8576] italic">
          Zero affiliate bias · Fiduciary buyer-side advice
        </span>
      </div>
    </div>
  );
}
