"use client";

import { useState } from "react";
import type { Profile, Concurrency } from "@/lib/engine";
import { NumberReel } from "../design-system/NumberReel";
import { Sliders, AlertCircle } from "lucide-react";

interface WhatIfPanelProps {
  profile: Profile;
  onProfileChange: (patch: Partial<Profile>) => void;
  diffMessage?: string | null;
  className?: string;
}

export function WhatIfPanel({
  profile,
  onProfileChange,
  diffMessage,
  className = "",
}: WhatIfPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Dynamic budget bounds scaled to user's domain & mission
  const budget = profile.budgetInr;
  const isHighBudget = budget >= 1000000;
  const isLowBudget = budget <= 25000;

  const minBudget = isHighBudget
    ? Math.max(100000, Math.round(budget * 0.5))
    : isLowBudget
    ? Math.max(1000, Math.round(budget * 0.3))
    : Math.max(10000, Math.round(budget * 0.5));

  const maxBudget = isHighBudget
    ? Math.round(budget * 1.6)
    : isLowBudget
    ? Math.round(budget * 2.2)
    : Math.round(budget * 1.8);

  const budgetStep = isHighBudget ? 25000 : isLowBudget ? 500 : 2500;

  return (
    <aside
      className={`bg-[#FBF7EA] border-2 border-[#1B1A17] rounded-[4px] p-5 paper-shadow font-mono text-xs space-y-4 ${className}`}
      data-lenis-prevent
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#1B1A17]/20">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-[#2540D9]" />
          <span className="font-bold uppercase tracking-wider text-[#1B1A17]">
            INSTANT WHAT-IF SIMULATOR
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] text-[#2540D9] hover:underline"
        >
          {isExpanded ? "[Collapse]" : "[Expand]"}
        </button>
      </div>

      {/* Yellow Diff Tape Chip when changes occur */}
      {diffMessage && (
        <div
          className="p-2.5 bg-[#F3C94B] text-[#1B1A17] font-mono text-xs font-bold rounded shadow-sm border border-[#1B1A17]/30 flex items-center space-x-2"
          role="status"
          aria-live="polite"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{diffMessage}</span>
        </div>
      )}

      {isExpanded && (
        <div className="space-y-4">
          {/* Budget Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[#1B1A17]">
              <span className="font-semibold uppercase text-[10px] text-[#8A8576]">BUDGET LIMIT:</span>
              <span className="font-bold text-sm text-[#2540D9]">
                <NumberReel value={profile.budgetInr} prefix="₹" formatInr durationMs={150} />
              </span>
            </div>
            <input
              type="range"
              min={minBudget}
              max={maxBudget}
              step={budgetStep}
              value={profile.budgetInr}
              onChange={(e) => onProfileChange({ budgetInr: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-[#8A8576]/30 rounded-lg appearance-none cursor-pointer accent-[#2540D9]"
              title="Change budget slider"
            />
            <div className="flex justify-between text-[9px] text-[#8A8576]">
              <span>₹{minBudget.toLocaleString("en-IN")}</span>
              <span>₹{budget.toLocaleString("en-IN")}</span>
              <span>₹{maxBudget.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Years Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[#1B1A17]">
              <span className="font-semibold uppercase text-[10px] text-[#8A8576]">OWNERSHIP HORIZON:</span>
              <span className="font-bold text-sm text-[#1B1A17]">
                <NumberReel value={profile.years} suffix=" Years" durationMs={150} />
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              step="1"
              value={profile.years}
              onChange={(e) => onProfileChange({ years: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-[#8A8576]/30 rounded-lg appearance-none cursor-pointer accent-[#2540D9]"
              title="Change ownership duration"
            />
          </div>

          {/* Concurrency Selector */}
          <div className="space-y-1">
            <span className="font-semibold uppercase text-[10px] text-[#8A8576] block">
              CONCURRENCY MULTIPLIER:
            </span>
            <div className="grid grid-cols-3 gap-1">
              {(["light", "moderate", "heavy"] as Concurrency[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onProfileChange({ concurrency: c })}
                  className={`py-1 text-center rounded border transition text-[10px] font-bold uppercase cursor-pointer ${
                    profile.concurrency === c
                      ? "bg-[#1B1A17] text-white border-[#1B1A17]"
                      : "bg-[#F2EBD8] text-[#1B1A17] border-[#1B1A17]/20 hover:bg-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Priority Presets */}
          <div className="space-y-1 pt-2 border-t border-dashed border-[#1B1A17]/20">
            <span className="font-semibold uppercase text-[10px] text-[#8A8576] block">
              QUICK PRIORITY PRESETS:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  onProfileChange({
                    weights: {
                      performance: 0.35,
                      battery: 0.1,
                      portability: 0.1,
                      reliability: 0.15,
                      longevity: 0.2,
                      value: 0.1,
                    },
                  })
                }
                className="px-2 py-0.5 bg-[#F2EBD8] rounded border border-[#1B1A17]/30 text-[10px] hover:bg-white"
              >
                Max Performance
              </button>
              <button
                type="button"
                onClick={() =>
                  onProfileChange({
                    weights: {
                      performance: 0.15,
                      battery: 0.35,
                      portability: 0.25,
                      reliability: 0.15,
                      longevity: 0.1,
                      value: 0.1,
                    },
                  })
                }
                className="px-2 py-0.5 bg-[#F2EBD8] rounded border border-[#1B1A17]/30 text-[10px] hover:bg-white"
              >
                Max Battery/Travel
              </button>
              <button
                type="button"
                onClick={() =>
                  onProfileChange({
                    weights: {
                      performance: 0.15,
                      battery: 0.15,
                      portability: 0.15,
                      reliability: 0.2,
                      longevity: 0.15,
                      value: 0.35,
                    },
                  })
                }
                className="px-2 py-0.5 bg-[#F2EBD8] rounded border border-[#1B1A17]/30 text-[10px] hover:bg-white"
              >
                Maximum Value
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
