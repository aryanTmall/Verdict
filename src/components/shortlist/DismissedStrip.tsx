"use client";

import { useState } from "react";
import type { Evaluation } from "@/lib/engine";
import { ChevronDown, ChevronUp, Ban } from "lucide-react";

interface DismissedStripProps {
  ineligibleEvals: Evaluation[];
}

export function DismissedStrip({ ineligibleEvals }: DismissedStripProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (ineligibleEvals.length === 0) return null;

  return (
    <div className="bg-[#FBF7EA] border border-[#1B1A17]/30 rounded-[4px] p-4 text-xs font-mono paper-shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left text-[#1B1A17] font-semibold cursor-pointer"
      >
        <div className="flex items-center space-x-2">
          <Ban className="w-4 h-4 text-[#D8381C]" />
          <span>
            DISMISSED CANDIDATES ({ineligibleEvals.length} PRODUCTS FILTERED BY HARD CONSTRAINTS)
          </span>
        </div>
        <div className="flex items-center space-x-1 text-[#8A8576]">
          <span>{isOpen ? "Hide Filtered" : "Inspect Violations"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-3 divide-y divide-dashed divide-[#1B1A17]/20 pt-2">
          {ineligibleEvals.map((e) => (
            <div key={e.product.slug} className="py-2 flex items-start justify-between gap-4">
              <div>
                <span className="font-bold text-[#1B1A17]">{e.product.name}</span>
                <span className="text-[#8A8576] ml-2">₹{e.product.priceInr.toLocaleString("en-IN")}</span>
              </div>
              <div className="text-right space-y-0.5">
                {e.violations.map((v, i) => (
                  <span
                    key={i}
                    className="inline-block bg-[#D8381C]/10 text-[#D8381C] border border-[#D8381C]/30 px-2 py-0.5 rounded text-[10px] font-bold ml-1 uppercase"
                  >
                    {v.message}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
