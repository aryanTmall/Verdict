import React from "react";
import { ProvenanceChip } from "./ProvenanceChip";
import { inr } from "@/lib/engine";

interface ReceiptLine {
  label: string;
  value: string | number;
  provenance?: import("@/lib/engine").Provenance;
  detail?: string;
  isTotal?: boolean;
}

interface ThermalReceiptProps {
  caseRef: string;
  date: string;
  title: string;
  lines: ReceiptLine[];
  footerNote?: string;
  children?: React.ReactNode;
  className?: string;
}

export function ThermalReceipt({
  caseRef,
  date,
  title,
  lines,
  footerNote = "Illustrative estimate, not a guaranteed outcome.",
  children,
  className = "",
}: ThermalReceiptProps) {
  return (
    <div
      className={`receipt-perforated p-6 md:p-8 font-mono text-xs md:text-sm text-[#1B1A17] paper-shadow border-x border-[#1B1A17]/30 max-w-lg mx-auto ${className}`}
    >
      {/* Receipt Header */}
      <div className="text-center pb-4 border-b border-dashed border-[#1B1A17]/40 space-y-1">
        <div className="font-bold tracking-widest text-sm uppercase">VERDICT AUDIT RECEIPT</div>
        <div className="text-[11px] text-[#8A8576] flex justify-between pt-1">
          <span>REF: {caseRef}</span>
          <span>DATE: {date}</span>
        </div>
      </div>

      {/* Target Subject */}
      <div className="py-3 border-b border-dashed border-[#1B1A17]/40">
        <div className="text-[10px] uppercase tracking-wider text-[#8A8576]">SUBJECT</div>
        <div className="font-bold text-sm text-[#1B1A17] pt-0.5">{title}</div>
      </div>

      {/* Itemized Lines */}
      <div className="py-4 space-y-2.5">
        {lines.map((line, idx) => (
          <div
            key={idx}
            className={`flex items-start justify-between gap-2 ${
              line.isTotal ? "pt-2 border-t border-dashed border-[#1B1A17] font-bold text-sm" : ""
            }`}
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={line.isTotal ? "font-bold text-[#1B1A17]" : "text-[#1B1A17]/80"}>
                  {line.label}
                </span>
                {line.provenance && <ProvenanceChip source={line.provenance} />}
              </div>
              {line.detail && <div className="text-[10px] text-[#8A8576]">{line.detail}</div>}
            </div>
            <div className="tabular-nums font-semibold whitespace-nowrap text-right">
              {typeof line.value === "number" ? inr(line.value) : line.value}
            </div>
          </div>
        ))}
      </div>

      {/* Children Actions */}
      {children && (
        <div className="pt-4 pb-2 border-t border-dashed border-[#1B1A17]/40">{children}</div>
      )}

      {/* Receipt Footer */}
      <div className="pt-4 border-t border-dashed border-[#1B1A17]/40 text-center text-[10px] text-[#8A8576] space-y-1">
        <p>*** VERDICT INDEPENDENT AUDIT ***</p>
        <p>{footerNote}</p>
      </div>
    </div>
  );
}
