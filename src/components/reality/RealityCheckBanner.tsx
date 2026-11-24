"use client";

import React from "react";
import type { RealityCheckResult, RealityAlternative } from "@/lib/reality-check";

interface RealityCheckBannerProps {
  realityCheck: RealityCheckResult;
  onApplyAlternative?: (alt: RealityAlternative) => void;
  onDismiss?: () => void;
}

export function RealityCheckBanner({
  realityCheck,
  onApplyAlternative,
  onDismiss,
}: RealityCheckBannerProps) {
  if (realityCheck.status === "REALISTIC") {
    return null; // Realistic queries don't clutter the view
  }

  const isScamOrUnsafe =
    realityCheck.status === "SCAM_RISK" || realityCheck.status === "UNSAFE_PURCHASE";
  const isContradictory = realityCheck.status === "CONTRADICTORY_REQUIREMENTS";

  return (
    <div
      role="alert"
      className={`relative my-4 rounded-lg border-2 p-5 shadow-sm transition-all ${
        isScamOrUnsafe
          ? "border-[#D8381C] bg-[#FFF5F2] text-[#1B1A17]"
          : isContradictory
          ? "border-[#2540D9] bg-[#F2F5FF] text-[#1B1A17]"
          : "border-[#F3C94B] bg-[#FFFBEA] text-[#1B1A17]"
      }`}
    >
      {/* Top Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-3">
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
              isScamOrUnsafe
                ? "bg-[#D8381C] text-white"
                : isContradictory
                ? "bg-[#2540D9] text-white"
                : "bg-[#B45309] text-white"
            }`}
          >
            {realityCheck.status.replace(/_/g, " ")}
          </span>
          <span className="font-mono text-xs text-neutral-600">
            Defense Counsel Reality Check
          </span>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-xs font-mono text-neutral-500 hover:text-black cursor-pointer underline"
          >
            [ Dismiss Warning ]
          </button>
        )}
      </div>

      {/* Main Advisory Content */}
      <div className="mt-3">
        <h4 className="font-serif text-lg font-bold tracking-tight text-[#1B1A17]">
          {realityCheck.headline}
        </h4>
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-800">
          {realityCheck.explanation}
        </p>
      </div>

      {/* Market Context Ledger (if present) */}
      {realityCheck.marketContext && (
        <div className="mt-4 rounded border border-black/10 bg-white/70 p-3 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 text-neutral-600 border-b border-black/5 pb-1.5">
            <span>MARKET BASELINE BENCHMARK</span>
            <span className="text-[10px] text-neutral-500 uppercase">
              Provenance: {realityCheck.marketContext.provenance.replace(/_/g, " ")}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {realityCheck.marketContext.verifiedMinimumPriceInr && (
              <div>
                <span className="text-xs text-neutral-500 block">Verified Minimum Entry Price:</span>
                <span className="font-bold text-[#1F6B4F]">
                  ₹{realityCheck.marketContext.verifiedMinimumPriceInr.toLocaleString("en-IN")}
                </span>
              </div>
            )}
            {realityCheck.marketContext.typicalRangeInr && (
              <div>
                <span className="text-xs text-neutral-500 block">Typical Contemporary Range:</span>
                <span className="font-bold text-neutral-800">
                  ₹{realityCheck.marketContext.typicalRangeInr.min.toLocaleString("en-IN")} — ₹{realityCheck.marketContext.typicalRangeInr.max.toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>
          <p className="mt-2 text-[11px] text-neutral-500 italic">
            Source: {realityCheck.marketContext.citationNotice}
          </p>
        </div>
      )}

      {/* Contradictory Tradeoff Analysis */}
      {realityCheck.tradeoffAnalysis && (
        <div className="mt-4 rounded border border-blue-200 bg-white/80 p-3.5 text-xs font-mono">
          <div className="font-bold text-[#2540D9] uppercase tracking-wider">
            Engineering Conflict: {realityCheck.tradeoffAnalysis.conflictPoint}
          </div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-blue-100">
            <div className="rounded bg-blue-50/60 p-2.5 border border-blue-100">
              <span className="font-bold text-blue-900 block">Option A: {realityCheck.tradeoffAnalysis.priorityA.name}</span>
              <span className="text-[11px] text-neutral-700 leading-normal block mt-1">
                {realityCheck.tradeoffAnalysis.priorityA.impact}
              </span>
            </div>
            <div className="rounded bg-amber-50/60 p-2.5 border border-amber-100">
              <span className="font-bold text-amber-900 block">Option B: {realityCheck.tradeoffAnalysis.priorityB.name}</span>
              <span className="text-[11px] text-neutral-700 leading-normal block mt-1">
                {realityCheck.tradeoffAnalysis.priorityB.impact}
              </span>
            </div>
          </div>
          <div className="mt-2.5 text-[11px] text-neutral-600">
            <strong className="text-neutral-900">Recommended Resolution:</strong> {realityCheck.tradeoffAnalysis.recommendedResolution}
          </div>
        </div>
      )}

      {/* Scam Indicators (if present) */}
      {realityCheck.scamIndicators && realityCheck.scamIndicators.length > 0 && (
        <div className="mt-3.5 rounded border border-red-200 bg-red-50/60 p-3 text-xs">
          <strong className="font-mono text-red-800 block uppercase">Identified Red Flags:</strong>
          <ul className="mt-1 list-disc list-inside space-y-0.5 text-red-950 font-mono text-[11px]">
            {realityCheck.scamIndicators.map((ind, idx) => (
              <li key={idx}>{ind}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggested Realistic Alternatives */}
      {realityCheck.suggestedAlternatives && realityCheck.suggestedAlternatives.length > 0 && (
        <div className="mt-4 pt-3 border-t border-black/10">
          <span className="font-mono text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-2">
            Realistic Alternatives & Actionable Next Steps:
          </span>
          <div className="flex flex-wrap gap-2">
            {realityCheck.suggestedAlternatives.map((alt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onApplyAlternative?.(alt)}
                className="inline-flex items-center gap-1.5 rounded-md border border-black/20 bg-white px-3 py-1.5 text-xs font-mono font-medium text-neutral-800 hover:border-black hover:bg-[#F2EBD8] hover:shadow-sm transition-all cursor-pointer"
              >
                <span>↳</span>
                <span className="font-bold">{alt.label}</span>
                {alt.suggestedBudgetInr && (
                  <span className="text-neutral-500 font-normal">
                    (₹{alt.suggestedBudgetInr >= 100000 ? `${(alt.suggestedBudgetInr / 100000).toFixed(1)}L` : alt.suggestedBudgetInr >= 1000 ? `${(alt.suggestedBudgetInr / 1000).toFixed(0)}k` : alt.suggestedBudgetInr})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
