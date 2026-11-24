"use client";

import { useState } from "react";
import type { Risk } from "@/lib/engine";
import { ProvenanceChip } from "../design-system/ProvenanceChip";
import { ChevronDown, ChevronUp, ShieldAlert } from "lucide-react";

interface RiskAccordionTableProps {
  risks: Risk[];
  className?: string;
}

export function RiskAccordionTable({ risks, className = "" }: RiskAccordionTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(risks[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div
      className={`bg-[#FBF7EA] border-2 border-[#1B1A17] rounded-[4px] p-6 paper-shadow font-mono text-xs space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#1B1A17]/20">
        <div>
          <span className="text-[10px] uppercase text-[#8A8576]">EVIDENCE MATRIX</span>
          <h3 className="text-lg font-bold font-display text-[#1B1A17]">
            Forecasted Regret Risks ({risks.length})
          </h3>
        </div>
        <span className="text-[10px] text-[#8A8576] uppercase">SORTED BY ENGINE RISK SCORE</span>
      </div>

      <div className="divide-y divide-dashed divide-[#1B1A17]/20">
        {risks.map((risk) => {
          const isExpanded = expandedId === risk.id;
          const scorePercent = Math.round(risk.score * 100);

          return (
            <div key={risk.id} className="py-3">
              <button
                type="button"
                onClick={() => toggleExpand(risk.id)}
                className="w-full flex items-center justify-between text-left hover:text-[#2540D9] transition cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <ShieldAlert
                    className={`w-4 h-4 ${
                      risk.score >= 0.4 ? "text-[#D8381C]" : "text-[#F3C94B]"
                    }`}
                  />
                  <span className="font-bold text-[#1B1A17] text-sm">{risk.title}</span>
                  <ProvenanceChip source={risk.provenance} />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#1B1A17] tabular-nums">
                      Risk: {scorePercent}%
                    </span>
                    <span className="text-[9px] text-[#8A8576] block">
                      (Imp: {risk.impact}/5 · Lik: {Math.round(risk.likelihood * 100)}%)
                    </span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="mt-3 bg-[#F2EBD8] p-3.5 rounded border border-[#1B1A17]/20 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[#8A8576] uppercase text-[9px] block">OPERATIONAL TRIGGER:</span>
                      <span className="text-[#1B1A17] font-medium">{risk.trigger}</span>
                    </div>
                    <div>
                      <span className="text-[#8A8576] uppercase text-[9px] block">CITABLE EVIDENCE:</span>
                      <span className="text-[#1B1A17] font-medium">{risk.evidence}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-dashed border-[#1B1A17]/20">
                    <span className="text-[#1F6B4F] uppercase text-[9px] block font-bold">
                      ENGINE MITIGATION STRATEGY:
                    </span>
                    <span className="text-[#1B1A17]">{risk.mitigation}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
