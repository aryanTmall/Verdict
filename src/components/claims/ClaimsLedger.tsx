"use client";

import { WindowChrome } from "../design-system/WindowChrome";
import { ProvenanceChip } from "../design-system/ProvenanceChip";
import type { ClaimVerification } from "@/lib/types";
import { MessageSquareQuote, CheckCircle2, XCircle, HelpCircle } from "lucide-react";

interface ClaimsLedgerProps {
  productName: string;
  claims: ClaimVerification[];
  isLoading?: boolean;
  className?: string;
}

export function ClaimsLedger({
  productName,
  claims,
  isLoading = false,
  className = "",
}: ClaimsLedgerProps) {
  return (
    <WindowChrome
      title={`claims_cross_examination_${productName.toLowerCase().replace(/\W+/g, "_")}.audit`}
      badge="EVIDENCE AUDIT"
      className={className}
    >
      <div className="space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#1B1A17]/20 text-[10px] uppercase text-[#8A8576]">
          <span>SELLER MARKETING CLAIM</span>
          <span>AUDIT VERDICT & RECEIPTS</span>
        </div>

        {isLoading ? (
          <div className="py-8 text-center space-y-2">
            <div className="inline-block w-5 h-5 border-2 border-[#1B1A17] border-t-transparent rounded-full animate-spin" />
            <div className="text-xs text-[#8A8576]">Cross-examining seller claims against owner reviews...</div>
          </div>
        ) : claims.length === 0 ? (
          <div className="py-6 text-center text-[#8A8576]">
            No listing claims extracted for this product.
          </div>
        ) : (
          <div className="divide-y divide-dashed divide-[#1B1A17]/20">
            {claims.map((item, idx) => {
              const statusStyles = {
                supported: {
                  stamp: "SUPPORTED",
                  color: "text-[#1F6B4F] border-[#1F6B4F] bg-[#1F6B4F]/10",
                  icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#1F6B4F]" />,
                  rotation: "rotate-1",
                },
                contradicted: {
                  stamp: "CONTRADICTED",
                  color: "text-[#D8381C] border-[#D8381C] bg-[#D8381C]/10",
                  icon: <XCircle className="w-3.5 h-3.5 text-[#D8381C]" />,
                  rotation: "-rotate-2",
                },
                unverifiable: {
                  stamp: "CAN'T VERIFY",
                  color: "text-[#8A8576] border-[#8A8576] bg-[#8A8576]/10",
                  icon: <HelpCircle className="w-3.5 h-3.5 text-[#8A8576]" />,
                  rotation: "rotate-0",
                },
              }[item.status];

              return (
                <div key={idx} className="py-4 space-y-3">
                  {/* Claim Header & Stamp */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <ProvenanceChip source="source_claim" />
                        <span className="text-[10px] text-[#8A8576] uppercase">LISTING PROMISE</span>
                      </div>
                      <div className="text-sm font-semibold text-[#1B1A17] italic">
                        &ldquo;{item.claim}&rdquo;
                      </div>
                    </div>

                    {/* Stamp */}
                    <div
                      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded border-2 font-bold text-xs uppercase tracking-wider select-none ${statusStyles.color} ${statusStyles.rotation}`}
                      style={{ filter: "url(#stamp-filter)" }}
                    >
                      {statusStyles.icon}
                      <span>{statusStyles.stamp}</span>
                    </div>
                  </div>

                  {/* Review Evidence Snippets */}
                  {item.receipts.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] uppercase text-[#8A8576] flex items-center space-x-1">
                        <MessageSquareQuote className="w-3 h-3" />
                        <span>Verbatim Review Receipts (&lt; 25 words):</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.receipts.map((rcpt, rIdx) => (
                          <div
                            key={rIdx}
                            className="bg-[#F2EBD8] border border-[#1B1A17]/20 p-2.5 rounded text-[11px] space-y-1"
                          >
                            <div className="text-[#1B1A17] italic">&ldquo;{rcpt.quote}&rdquo;</div>
                            <div className="flex justify-between items-center text-[9px] text-[#8A8576] pt-1 border-t border-dashed border-[#1B1A17]/10">
                              <span>{rcpt.monthsUsed ? `Month ${rcpt.monthsUsed} of use` : "Owner review"}</span>
                              <ProvenanceChip source="verified" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.status === "unverifiable" && (
                    <div className="text-[11px] text-[#8A8576] italic bg-[#F2EBD8] p-2 rounded border border-dashed border-[#1B1A17]/20">
                      Evidence-gated note: Insufficient long-term owner sample size to independently substantiate or dispute this claim.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </WindowChrome>
  );
}
