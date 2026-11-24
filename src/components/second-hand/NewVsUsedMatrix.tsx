"use client";

import React from "react";
import type { NewVsUsedMatrix as NewVsUsedMatrixType } from "@/lib/second-hand/types";

interface NewVsUsedMatrixProps {
  matrix: NewVsUsedMatrixType;
  onOpenUsedRadar?: () => void;
}

export function NewVsUsedMatrix({ matrix, onOpenUsedRadar }: NewVsUsedMatrixProps) {
  const isRefurbishedWinner = matrix.recommendation.verdict === "BUY_REFURBISHED";
  const isUsedWinner = matrix.recommendation.verdict === "BUY_USED";
  const isNewWinner = matrix.recommendation.verdict === "BUY_NEW";

  return (
    <div className="rounded-lg border-2 border-[#1B1A17] bg-[#FBF7EA] p-5 md:p-6 shadow-sm font-serif text-[#1B1A17]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#1B1A17]/20 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#1B1A17] text-white rounded">
            CONDITION ARBITRAGE
          </span>
          <span className="font-mono text-xs text-neutral-600">
            New vs Certified Refurbished vs Pre-Owned
          </span>
        </div>
        {onOpenUsedRadar && (
          <button
            type="button"
            onClick={onOpenUsedRadar}
            className="inline-flex items-center gap-1 rounded border border-[#2540D9] bg-white px-2.5 py-1 font-mono text-xs font-bold text-[#2540D9] hover:bg-blue-50 transition cursor-pointer"
          >
            <span>Inspect Used Market Listings ↗</span>
          </button>
        )}
      </div>

      {/* Flagship Buy Decision Banner (C12) */}
      <div
        className={`mt-4 rounded-md border-2 p-4 font-sans ${
          isRefurbishedWinner
            ? "border-[#1F6B4F] bg-[#1F6B4F]/10"
            : isUsedWinner
            ? "border-[#2540D9] bg-[#2540D9]/10"
            : "border-[#B45309] bg-[#FFFBEA]"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`font-mono text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white ${
              isRefurbishedWinner ? "bg-[#1F6B4F]" : isUsedWinner ? "bg-[#2540D9]" : "bg-[#B45309]"
            }`}
          >
            {matrix.recommendation.verdict.replace(/_/g, " ")}
          </span>
          <span className="font-mono text-xs font-semibold text-neutral-700">
            Net Savings Potential: ₹{matrix.usedSavingsInr.toLocaleString("en-IN")} ({matrix.usedSavingsPct}%)
          </span>
        </div>

        <h3 className="font-serif text-lg font-bold text-[#1B1A17] mt-2">
          {matrix.recommendation.headline}
        </h3>
        <p className="mt-1 text-sm text-neutral-800 leading-relaxed">
          {matrix.recommendation.reasoning}
        </p>

        {/* Required Threshold Conditions */}
        {matrix.recommendation.criticalConditions.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-black/10">
            <span className="font-mono text-[11px] font-bold text-neutral-700 uppercase block mb-1">
              Mandatory Conditions Before Buying Pre-Owned / Refurbished:
            </span>
            <ul className="list-disc list-inside space-y-0.5 font-mono text-xs text-neutral-800">
              {matrix.recommendation.criticalConditions.map((cond, idx) => (
                <li key={idx}>{cond}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Factor Comparison Table (C2) */}
      <div className="mt-5 overflow-x-auto rounded border border-black/15 bg-white font-mono text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black/10 bg-[#F2EBD8]/60 text-[11px] uppercase tracking-wider text-neutral-700">
              <th className="p-3">Evaluation Factor</th>
              <th className={`p-3 border-l border-black/10 ${isNewWinner ? "bg-amber-50/60 font-bold" : ""}`}>
                Brand New
              </th>
              <th
                className={`p-3 border-l border-black/10 ${
                  isRefurbishedWinner ? "bg-emerald-50/80 font-bold text-emerald-900" : ""
                }`}
              >
                Certified Refurbished
              </th>
              <th
                className={`p-3 border-l border-black/10 ${
                  isUsedWinner ? "bg-blue-50/80 font-bold text-blue-900" : ""
                }`}
              >
                Pre-Owned (Used)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 text-[12px]">
            {matrix.factors.map((f, idx) => (
              <tr key={idx} className="hover:bg-neutral-50/50">
                <td className="p-3 font-sans font-semibold text-neutral-900">{f.factor}</td>
                <td className="p-3 border-l border-black/5 text-neutral-800">{f.newProduct}</td>
                <td className="p-3 border-l border-black/5 text-neutral-800">{f.refurbished}</td>
                <td className="p-3 border-l border-black/5 text-neutral-800">{f.used}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tradeoff Summary Badges */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
        <div className="rounded border border-emerald-200 bg-emerald-50/50 p-3">
          <span className="font-bold text-emerald-800 uppercase block">✓ Used / Refurbished Advantage:</span>
          <p className="mt-1 text-emerald-950 font-sans leading-normal">
            Pocket ₹{matrix.refurbishedSavingsInr.toLocaleString("en-IN")} — ₹{matrix.usedSavingsInr.toLocaleString("en-IN")} in cash savings. The steepest 1st-year depreciation curve has already been absorbed by previous owners.
          </p>
        </div>
        <div className="rounded border border-amber-200 bg-amber-50/50 p-3">
          <span className="font-bold text-amber-800 uppercase block">⚠ Used / Refurbished Disadvantage:</span>
          <p className="mt-1 text-amber-950 font-sans leading-normal">
            Reduced warranty (0 to 6 months), shorter remaining battery/mechanical lifespan, and higher probability of out-of-pocket component replacement.
          </p>
        </div>
      </div>
    </div>
  );
}
