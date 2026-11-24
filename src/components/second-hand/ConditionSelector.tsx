"use client";

import React from "react";
import type { PurchaseCondition } from "@/lib/second-hand/types";

interface ConditionSelectorProps {
  selectedCondition: PurchaseCondition;
  onSelectCondition: (condition: PurchaseCondition) => void;
  compact?: boolean;
}

export function ConditionSelector({
  selectedCondition,
  onSelectCondition,
  compact = false,
}: ConditionSelectorProps) {
  const options: { value: PurchaseCondition; label: string; badge?: string }[] = [
    { value: "ANY", label: "Any Condition (Find Best Deal)", badge: "BEST VALUE" },
    { value: "NEW", label: "Brand New Only" },
    { value: "REFURBISHED", label: "Certified Refurbished" },
    { value: "CERTIFIED_PRE_OWNED", label: "Certified Pre-Owned" },
    { value: "USED", label: "Pre-Owned (Used)" },
  ];

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
        <span className="text-[11px] text-neutral-500 uppercase font-semibold">Condition:</span>
        <div className="inline-flex rounded-md border border-black/20 bg-white p-0.5 shadow-xs">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelectCondition(opt.value)}
              className={`rounded px-2.5 py-1 text-[11px] font-medium transition cursor-pointer ${
                selectedCondition === opt.value
                  ? "bg-[#1B1A17] text-white shadow-xs font-bold"
                  : "text-neutral-700 hover:text-black hover:bg-[#F2EBD8]/50"
              }`}
            >
              {opt.label.split(" (")[0]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-black/15 bg-[#FBF7EA] p-3 font-mono text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-black/10">
        <span className="font-bold uppercase tracking-wider text-neutral-700">
          Purchase Condition Target
        </span>
        <span className="text-[10px] text-neutral-500">
          New vs Used vs Refurbished Arbitrage
        </span>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selectedCondition === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelectCondition(opt.value)}
              className={`relative inline-flex items-center gap-1.5 rounded border px-3 py-1.5 transition cursor-pointer text-xs ${
                isSelected
                  ? "border-[#1B1A17] bg-[#1B1A17] text-white font-bold shadow-xs"
                  : "border-black/20 bg-white text-neutral-800 hover:border-black hover:bg-[#F2EBD8]"
              }`}
            >
              <span>{opt.label}</span>
              {opt.badge && !isSelected && (
                <span className="rounded bg-[#1F6B4F] px-1.5 py-0.2 font-mono text-[9px] font-bold text-white uppercase">
                  {opt.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
