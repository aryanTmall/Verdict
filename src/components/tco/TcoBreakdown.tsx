import type { CostLine } from "@/lib/engine";
import { ProvenanceChip } from "../design-system/ProvenanceChip";
import { NumberReel } from "../design-system/NumberReel";
import { Receipt } from "lucide-react";

interface TcoBreakdownProps {
  lines: CostLine[];
  totalInr: number;
  years: number;
  productName?: string;
  className?: string;
}

export function TcoBreakdown({
  lines,
  totalInr,
  years,
  productName: _productName,
  className = "",
}: TcoBreakdownProps) {
  return (
    <div
      className={`bg-[#FBF7EA] border-2 border-[#1B1A17] rounded-[4px] p-6 paper-shadow font-mono text-xs space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#1B1A17]/20">
        <div>
          <span className="text-[10px] uppercase text-[#8A8576]">COST OF OWNERSHIP AUDIT</span>
          <h3 className="text-lg font-bold font-display text-[#1B1A17]">
            {years}-Year Total Cost of Ownership
          </h3>
        </div>
        <Receipt className="w-4 h-4 text-[#8A8576]" />
      </div>

      <div className="space-y-2.5">
        {lines.map((l, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <div className="flex items-center space-x-2">
              <span className="text-[#1B1A17]">{l.label}</span>
              <ProvenanceChip source={l.provenance} />
            </div>
            <span className="tabular-nums font-semibold text-[#1B1A17]">
              <NumberReel value={l.inr} prefix="₹" formatInr durationMs={200} />
            </span>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t-2 border-[#1B1A17] flex items-center justify-between font-bold text-sm">
        <span className="uppercase text-[#1B1A17]">PROJECTED {years}-YEAR TOTAL</span>
        <span className="text-base font-mono text-[#2540D9] tabular-nums">
          <NumberReel value={totalInr} prefix="₹" formatInr durationMs={250} />
        </span>
      </div>

      <div className="text-[10px] text-[#8A8576] pt-1">
        * Includes initial purchase, estimated out-of-warranty repair reserves, and memory expansion if applicable.
      </div>
    </div>
  );
}
