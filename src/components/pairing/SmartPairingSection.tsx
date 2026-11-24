"use client";

import { useState } from "react";
import type { Product } from "@/lib/engine";
import { getSmartPairings, type SmartBundleReport, type CompanionItem } from "@/lib/smart-pairing";
import {
  Layers,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

interface SmartPairingSectionProps {
  product: Product | any;
  className?: string;
}

export function SmartPairingSection({ product, className = "" }: SmartPairingSectionProps) {
  const bundleReport: SmartBundleReport = getSmartPairings(product);
  const [selectedItems, setSelectedItems] = useState<string[]>(
    bundleReport.companions.filter((c) => c.selectedByDefault).map((c) => c.id)
  );

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Recalculate bundle price based on checked items
  const activeCompanions = bundleReport.companions.filter((c) => selectedItems.includes(c.id));
  const activeTotal = activeCompanions.reduce((acc, c) => acc + c.priceInr, 0);
  const verifiedBundleDiscount = activeCompanions.length >= 2 ? Math.round(activeTotal * 0.08) : 0;
  const grandTotal = bundleReport.mainProductPriceInr + activeTotal - verifiedBundleDiscount;

  return (
    <div
      className={`bg-[#FBF7EA] border-2 border-[#1B1A17] rounded-[4px] p-6 paper-shadow font-mono text-xs space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1B1A17]/20">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase text-[#8A8576] tracking-wider">
              COMPATIBILITY INTELLIGENCE & ANTI-UPSELL AUDIT
            </span>
            <span className="px-2 py-0.5 bg-[#1F6B4F] text-white text-[9px] font-bold rounded">
              VERIFIED COMPATIBLE
            </span>
          </div>
          <h3 className="text-xl font-bold font-display text-[#1B1A17] mt-0.5">
            Smart Companion Recommendations
          </h3>
          <p className="text-[11px] text-[#8A8576]">
            Every recommended add-on is cross-examined for physical port fit, electrical voltage, and necessity. We actively warn against dealer/seller up-sells.
          </p>
        </div>

        {/* Anti-Upsell Savings Badge */}
        {bundleReport.bundleSummary.antiUpsellSavingsInr > 0 && (
          <div className="bg-[#1F6B4F]/10 border border-[#1F6B4F] text-[#1F6B4F] px-3.5 py-1.5 rounded flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4" />
            <div>
              <div className="text-[9px] uppercase font-bold">Anti-Upsell Protection</div>
              <div className="text-xs font-bold">
                Saved ₹{bundleReport.bundleSummary.antiUpsellSavingsInr.toLocaleString("en-IN")} on redundant add-ons
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Companions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bundleReport.companions.map((companion) => {
          const isSelected = selectedItems.includes(companion.id);
          const isRedundant = companion.necessity === "NOT_NEEDED";

          return (
            <div
              key={companion.id}
              className={`p-4 rounded border-2 transition relative flex flex-col justify-between ${
                isRedundant
                  ? "bg-[#D8381C]/5 border-dashed border-[#D8381C]/40"
                  : isSelected
                  ? "bg-white border-[#2540D9]"
                  : "bg-[#FBF7EA] border-[#1B1A17]/20"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-2">
                  <div className="flex items-center space-x-2">
                    {!isRedundant && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleItem(companion.id)}
                        className="rounded border-[#1B1A17] cursor-pointer"
                      />
                    )}
                    <div>
                      <div className="font-bold text-[#1B1A17] text-xs leading-snug">
                        {companion.name}
                      </div>
                      <div className="text-[10px] text-[#8A8576]">{companion.category} · {companion.brand}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                      companion.necessity === "ESSENTIAL"
                        ? "bg-[#1F6B4F] text-white"
                        : companion.necessity === "RECOMMENDED"
                        ? "bg-[#2540D9] text-white"
                        : companion.necessity === "NOT_NEEDED"
                        ? "bg-[#D8381C] text-white"
                        : "bg-[#F3C94B] text-[#1B1A17]"
                    }`}
                  >
                    {companion.necessity.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="text-[11px] text-[#1B1A17]/80 bg-[#FBF7EA] p-2.5 rounded border border-[#1B1A17]/10 my-2">
                  <span className="font-bold text-[#1B1A17]">Forensic Verdict: </span>
                  {companion.antiUpsellReason}
                </div>

                <div className="text-[10px] text-[#8A8576] font-mono">
                  {companion.specsSummary}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#1B1A17]/10 flex items-center justify-between text-xs">
                <span className="font-bold text-[#1B1A17]">
                  ₹{companion.priceInr.toLocaleString("en-IN")}
                </span>

                <a
                  href={companion.destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2540D9] hover:underline flex items-center space-x-1 font-bold text-[11px]"
                >
                  <span>View listing</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bundle Summary Bar */}
      <div className="bg-white border-2 border-[#1B1A17] p-4 rounded flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase text-[#8A8576]">Curated Setup Bundle</div>
          <div className="text-sm font-bold text-[#1B1A17]">
            {bundleReport.mainProductName} + {activeCompanions.length} verified accessories
          </div>
        </div>

        <div className="flex items-center space-x-6 text-xs">
          {verifiedBundleDiscount > 0 && (
            <div>
              <div className="text-[10px] text-[#8A8576]">Combo Discount (8%)</div>
              <div className="font-bold text-[#1F6B4F]">-₹{verifiedBundleDiscount.toLocaleString("en-IN")}</div>
            </div>
          )}

          <div>
            <div className="text-[10px] text-[#8A8576]">Combined Total</div>
            <div className="text-lg font-bold font-display text-[#2540D9]">
              ₹{grandTotal.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
