"use client";

import { useState } from "react";
import type { Profile, WorkloadId, Concurrency, Criterion } from "@/lib/engine";
import { CRITERIA } from "@/lib/engine";
import { NumberReel } from "../design-system/NumberReel";
import { Plus, X, SlidersHorizontal, HelpCircle } from "lucide-react";

interface MissionBuilderProps {
  profile: Profile;
  assumptions: string[];
  clarifyingQuestion: string | null;
  onChange: (updated: Profile) => void;
  className?: string;
}

const ALL_WORKLOADS: Array<{ id: WorkloadId; label: string }> = [
  { id: "ide", label: "IDE / Code Editor" },
  { id: "browser", label: "Heavy Browsing (30+ Tabs)" },
  { id: "android_studio", label: "Android Studio / Emulator" },
  { id: "docker", label: "Docker Containers" },
  { id: "gaming", label: "3D Gaming" },
  { id: "office", label: "Office & Documents" },
];

export function MissionBuilder({
  profile,
  assumptions,
  clarifyingQuestion,
  onChange,
  className = "",
}: MissionBuilderProps) {
  const [showAssumptions, setShowAssumptions] = useState(false);

  const toggleWorkload = (id: WorkloadId) => {
    const exists = profile.workloads.includes(id);
    let next: WorkloadId[];
    if (exists) {
      next = profile.workloads.filter((w) => w !== id);
    } else {
      next = [...profile.workloads, id];
    }
    onChange({ ...profile, workloads: next });
  };

  const handleBudgetStep = (delta: number) => {
    const next = Math.max(25000, profile.budgetInr + delta);
    onChange({ ...profile, budgetInr: next });
  };

  const handleYearStep = (delta: number) => {
    const next = Math.min(6, Math.max(1, profile.years + delta));
    onChange({ ...profile, years: next });
  };

  const handleWeightChange = (crit: Criterion, val: number) => {
    onChange({
      ...profile,
      weights: {
        ...profile.weights,
        [crit]: val,
      },
    });
  };

  return (
    <div
      className={`bg-[#FBF7EA] border-2 border-[#1B1A17] rounded-[4px] p-6 paper-shadow space-y-6 ${className}`}
    >
      {/* Title & Clarifying Question */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#1B1A17]/20">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#8A8576]">
            STAGE 02 / PROFILE MATRIX
          </div>
          <h2 className="text-xl font-bold font-display text-[#1B1A17]">Extracted Buyer Needs</h2>
        </div>
        <button
          onClick={() => setShowAssumptions(!showAssumptions)}
          className="inline-flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-mono bg-[#F2EBD8] border border-[#1B1A17]/30 hover:bg-white transition cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{showAssumptions ? "Hide Assumptions" : `Assumptions (${assumptions.length})`}</span>
        </button>
      </div>

      {clarifyingQuestion && (
        <div className="bg-[#F3C94B]/20 border border-[#F3C94B] rounded p-3 text-xs font-mono text-[#1B1A17] flex items-start space-x-2">
          <HelpCircle className="w-4 h-4 text-[#D8381C] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Clarifying Query: </span>
            <span>{clarifyingQuestion}</span>
          </div>
        </div>
      )}

      {showAssumptions && (
        <div className="bg-[#F2EBD8] border border-dashed border-[#1B1A17]/40 rounded p-3 text-xs font-mono space-y-1">
          <div className="font-semibold text-[#8A8576] uppercase text-[10px]">
            DOCUMENTED REASONING & ASSUMPTIONS:
          </div>
          <ul className="list-disc pl-4 space-y-1 text-[#1B1A17]/90">
            {assumptions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Row 1: Budget Stepper & Ownership Duration Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Budget Stepper */}
        <div className="bg-[#F2EBD8] p-3 rounded border border-[#1B1A17]/20">
          <div className="text-[10px] font-mono uppercase text-[#8A8576]">MAX BUDGET (INR)</div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-lg md:text-xl font-bold font-mono tabular-nums text-[#1B1A17]">
              <NumberReel value={profile.budgetInr} prefix="₹" formatInr durationMs={200} />
            </span>
            <div className="flex items-center space-x-1 font-mono text-xs">
              <button
                onClick={() => handleBudgetStep(-5000)}
                className="w-7 h-7 bg-white border border-[#1B1A17]/30 rounded hover:bg-[#FBF7EA] font-bold"
                title="Decrease budget by ₹5,000"
              >
                -
              </button>
              <button
                onClick={() => handleBudgetStep(5000)}
                className="w-7 h-7 bg-white border border-[#1B1A17]/30 rounded hover:bg-[#FBF7EA] font-bold"
                title="Increase budget by ₹5,000"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Ownership Duration Stepper */}
        <div className="bg-[#F2EBD8] p-3 rounded border border-[#1B1A17]/20">
          <div className="text-[10px] font-mono uppercase text-[#8A8576]">OWNERSHIP HORIZON</div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-lg md:text-xl font-bold font-mono tabular-nums text-[#1B1A17]">
              <NumberReel value={profile.years} suffix=" Years" durationMs={150} />
            </span>
            <div className="flex items-center space-x-1 font-mono text-xs">
              <button
                onClick={() => handleYearStep(-1)}
                className="w-7 h-7 bg-white border border-[#1B1A17]/30 rounded hover:bg-[#FBF7EA] font-bold"
                title="Decrease years"
              >
                -
              </button>
              <button
                onClick={() => handleYearStep(1)}
                className="w-7 h-7 bg-white border border-[#1B1A17]/30 rounded hover:bg-[#FBF7EA] font-bold"
                title="Increase years"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Concurrency Selector */}
        <div className="bg-[#F2EBD8] p-3 rounded border border-[#1B1A17]/20">
          <div className="text-[10px] font-mono uppercase text-[#8A8576]">CONCURRENCY MULTIPLIER</div>
          <div className="flex items-center space-x-1.5 mt-2">
            {(["light", "moderate", "heavy"] as Concurrency[]).map((c) => (
              <button
                key={c}
                onClick={() => onChange({ ...profile, concurrency: c })}
                className={`flex-1 py-1 text-xs font-mono uppercase rounded border transition ${
                  profile.concurrency === c
                    ? "bg-[#1B1A17] text-white border-[#1B1A17]"
                    : "bg-white text-[#1B1A17] border-[#1B1A17]/30 hover:bg-[#FBF7EA]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workload Chips */}
      <div>
        <div className="text-[10px] font-mono uppercase text-[#8A8576] mb-2">
          PLANNED WORKLOADS (SELECT ALL THAT APPLY)
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_WORKLOADS.map((w) => {
            const active = profile.workloads.includes(w.id);
            return (
              <button
                key={w.id}
                onClick={() => toggleWorkload(w.id)}
                className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-mono border transition cursor-pointer ${
                  active
                    ? "bg-[#2540D9] text-white border-[#2540D9] shadow-sm"
                    : "bg-white text-[#1B1A17] border-[#1B1A17]/30 hover:bg-[#F2EBD8]"
                }`}
              >
                <span>{w.label}</span>
                {active ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Priority Weights (Tactile Ink Dials / Sliders) */}
      <div>
        <div className="text-[10px] font-mono uppercase text-[#8A8576] mb-3">
          DECISION PRIORITY WEIGHTS (NORMALIZED DETERMINISTICALLY BY ENGINE)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {CRITERIA.map((c) => {
            const weightVal = Math.round((profile.weights[c] ?? 0.15) * 100);
            return (
              <div
                key={c}
                className="bg-[#F2EBD8] p-2.5 rounded border border-[#1B1A17]/20 text-center space-y-1.5"
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#1B1A17] font-semibold truncate">
                  {c}
                </div>
                <div className="text-sm font-mono font-bold text-[#2540D9] tabular-nums">
                  {weightVal}%
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={weightVal}
                  onChange={(e) => handleWeightChange(c, parseInt(e.target.value, 10) / 100)}
                  className="w-full h-1.5 bg-[#8A8576]/40 rounded-lg appearance-none cursor-pointer accent-[#2540D9]"
                  title={`${c} weight`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
