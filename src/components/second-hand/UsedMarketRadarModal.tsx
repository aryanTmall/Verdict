"use client";

import React, { useState } from "react";
import type { UsedListing, PurchaseCondition } from "@/lib/second-hand/types";
import {
  estimateFairUsedPrice,
  calculateUsedDealScore,
  getCategoryInspectionChecklist,
  generateNegotiationStrategy,
  generateUsedPurchaseRegretTimeline,
} from "@/lib/second-hand/estimator";
import { getUsedListingsForProduct } from "@/lib/second-hand/marketplaces";
import { trackEvent } from "@/lib/monetization/analytics";

interface UsedMarketRadarModalProps {
  productName: string;
  category: string;
  newPriceInr: number;
  onClose: () => void;
}

export function UsedMarketRadarModal({
  productName,
  category,
  newPriceInr,
  onClose,
}: UsedMarketRadarModalProps) {
  const [activeTab, setActiveTab] = useState<"listings" | "checklist" | "negotiate" | "regret">("listings");
  const [conditionFilter, setConditionFilter] = useState<PurchaseCondition>("ANY");
  const [sortBy, setSortBy] = useState<"lowest_price" | "best_deal" | "lowest_risk">("best_deal");
  const [selectedListingIndex, setSelectedListingIndex] = useState(0);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Generate verified/grounded listings for this product
  const rawListings = getUsedListingsForProduct({
    productName,
    category,
    currentNewPriceInr: newPriceInr,
  });

  // Filter listings
  const filteredListings = rawListings.filter((l) => {
    if (conditionFilter === "ANY") return true;
    return l.conditionType === conditionFilter;
  });

  // Active listing analysis
  const activeListing = filteredListings[selectedListingIndex] || filteredListings[0] || rawListings[0];

  const valuation = estimateFairUsedPrice({
    productName: activeListing.model,
    category,
    currentNewPriceInr: newPriceInr,
    askingPriceInr: activeListing.askingPriceInr,
    ageMonths: activeListing.ageMonths,
    condition: activeListing.condition,
    hasOriginalInvoice: activeListing.hasOriginalInvoice,
    hasBoxAndAccessories: activeListing.hasOriginalBoxAndAccessories,
  });

  const dealScore = calculateUsedDealScore({
    valuation,
    condition: activeListing.condition,
    sellerRating: activeListing.sellerRating,
    isVerifiedSeller: activeListing.isVerifiedListing,
    warrantyRemainingMonths: activeListing.warrantyRemainingMonths,
    hasOriginalInvoice: activeListing.hasOriginalInvoice,
  });

  const inspectionChecklist = getCategoryInspectionChecklist(category);
  const negotiation = generateNegotiationStrategy({
    productName: activeListing.model,
    askingPriceInr: activeListing.askingPriceInr,
    valuation,
    category,
  });
  const regretTimeline = generateUsedPurchaseRegretTimeline(category);

  const handleCopyNegotiation = () => {
    navigator.clipboard.writeText(negotiation.copyableSellerMessage);
    setCopiedMessage(true);
    trackEvent("EXHIBIT_CLICKED", { action: "COPIED_NEGOTIATION_SCRIPT", product: productName });
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-lg border-2 border-[#1B1A17] bg-[#FBF7EA] p-6 shadow-2xl font-serif text-[#1B1A17]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-[#1B1A17] pb-4 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1F6B4F]">
                SECOND-HAND MARKET RADAR
              </span>
              <span className="rounded bg-black px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                NEW MSRP: ₹{newPriceInr.toLocaleString("en-IN")}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1B1A17] mt-1">
              Pre-Owned & Refurbished Intelligence: {productName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded border border-black/20 bg-white px-2.5 py-1 font-mono text-xs hover:border-black hover:bg-[#F2EBD8] cursor-pointer"
          >
            ✕ ESC
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-4 flex flex-wrap gap-2 border-b border-black/15 pb-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("listings")}
            className={`rounded px-3 py-1.5 font-bold transition cursor-pointer ${
              activeTab === "listings"
                ? "bg-[#1B1A17] text-white"
                : "bg-white border border-black/20 text-neutral-700 hover:bg-[#F2EBD8]"
            }`}
          >
            Listings & Fair Value ({filteredListings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("checklist")}
            className={`rounded px-3 py-1.5 font-bold transition cursor-pointer ${
              activeTab === "checklist"
                ? "bg-[#1B1A17] text-white"
                : "bg-white border border-black/20 text-neutral-700 hover:bg-[#F2EBD8]"
            }`}
          >
            Inspection Checklist ({inspectionChecklist.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("negotiate")}
            className={`rounded px-3 py-1.5 font-bold transition cursor-pointer ${
              activeTab === "negotiate"
                ? "bg-[#1B1A17] text-white"
                : "bg-white border border-black/20 text-neutral-700 hover:bg-[#F2EBD8]"
            }`}
          >
            Negotiation Assistant
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("regret")}
            className={`rounded px-3 py-1.5 font-bold transition cursor-pointer ${
              activeTab === "regret"
                ? "bg-[#1B1A17] text-white"
                : "bg-white border border-black/20 text-neutral-700 hover:bg-[#F2EBD8]"
            }`}
          >
            Used Regret Horizon
          </button>
        </div>

        {/* TAB 1: LISTINGS & FAIR VALUE ESTIMATOR */}
        {activeTab === "listings" && (
          <div className="mt-5 space-y-6">
            {/* Active Listing Deal Score Card */}
            <div className="rounded-lg border-2 border-[#1B1A17] bg-white p-4 font-mono shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-3">
                <div>
                  <span className="text-[11px] text-neutral-500 uppercase block">Selected Specimen Analysis</span>
                  <span className="font-bold text-base text-[#1B1A17]">{activeListing.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-500 block uppercase">Used Deal Score</span>
                    <span className="text-xl font-bold text-[#2540D9]">{dealScore.overallScore}/100</span>
                  </div>
                  <span
                    className={`rounded px-2.5 py-1 text-xs font-bold text-white uppercase ${
                      dealScore.recommendedAction === "BUY"
                        ? "bg-[#1F6B4F]"
                        : dealScore.recommendedAction === "BUY_IF_NEGOTIATED"
                        ? "bg-[#2540D9]"
                        : dealScore.recommendedAction === "INSPECT_FIRST"
                        ? "bg-[#B45309]"
                        : "bg-[#D8381C]"
                    }`}
                  >
                    {dealScore.recommendedAction.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Price Comparison Gauge */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded border border-black/10 bg-neutral-50 p-2.5">
                  <span className="text-neutral-500 block">Asking Price:</span>
                  <span className="text-lg font-bold text-[#1B1A17]">
                    ₹{activeListing.askingPriceInr.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[11px] text-[#1F6B4F] block">
                    Save ₹{(newPriceInr - activeListing.askingPriceInr).toLocaleString("en-IN")} vs New
                  </span>
                </div>
                <div className="rounded border border-black/10 bg-neutral-50 p-2.5">
                  <span className="text-neutral-500 block">Estimated Fair Value:</span>
                  <span className="text-lg font-bold text-neutral-900">
                    ₹{valuation.fairPriceMinInr.toLocaleString("en-IN")} — ₹{valuation.fairPriceMaxInr.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-neutral-500 block">
                    Confidence: {valuation.confidence.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="rounded border border-black/10 bg-neutral-50 p-2.5">
                  <span className="text-neutral-500 block">Market Evaluation:</span>
                  <span className="font-bold text-neutral-900 block text-sm">
                    {valuation.dealQuality.replace(/_/g, " ")}
                  </span>
                  <span className="text-[11px] text-neutral-600 block">
                    {valuation.priceDeltaPct >= 0
                      ? `+${valuation.priceDeltaPct}% above median`
                      : `${valuation.priceDeltaPct}% below median`}
                  </span>
                </div>
              </div>

              {/* Action Reasoning */}
              <div className="mt-4 text-xs font-sans text-neutral-800 space-y-1">
                {dealScore.actionReasoning.map((reason, idx) => (
                  <p key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#2540D9] font-bold">↳</span>
                    <span>{reason}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* Listings Grid */}
            <div>
              <span className="font-mono text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-3">
                Available Second-Hand & Refurbished Inventory
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                {filteredListings.map((listing, idx) => {
                  const isSelected = selectedListingIndex === idx;
                  const discountPct = Math.round(((newPriceInr - listing.askingPriceInr) / newPriceInr) * 100);
                  return (
                    <div
                      key={listing.id}
                      onClick={() => setSelectedListingIndex(idx)}
                      className={`rounded-lg border-2 p-4 transition cursor-pointer ${
                        isSelected
                          ? "border-[#1B1A17] bg-white shadow-md ring-2 ring-[#1B1A17]/20"
                          : "border-black/15 bg-white/70 hover:border-black hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-neutral-500 pb-1.5 border-b border-black/5">
                        <span className="font-bold text-[#2540D9]">{listing.marketplaceSource}</span>
                        <span className="rounded bg-neutral-100 px-1.5 py-0.2 border border-black/10 uppercase">
                          {listing.conditionType.replace(/_/g, " ")}
                        </span>
                      </div>

                      <h4 className="font-serif text-sm font-bold text-[#1B1A17] mt-2 line-clamp-1">
                        {listing.title}
                      </h4>

                      <div className="mt-2">
                        <div className="text-base font-bold text-[#1B1A17]">
                          ₹{listing.askingPriceInr.toLocaleString("en-IN")}
                        </div>
                        <span className="text-[11px] text-[#1F6B4F] font-semibold">
                          {discountPct}% off new price
                        </span>
                      </div>

                      <div className="mt-3 space-y-1 text-[11px] text-neutral-600 border-t border-black/5 pt-2">
                        <div>Age: {listing.ageMonths} months</div>
                        <div>Warranty: {listing.warrantyRemainingMonths} mo remaining</div>
                        <div>Location: {listing.locationCity}</div>
                      </div>

                      <div className="mt-3.5 pt-2 border-t border-black/10 flex items-center justify-between">
                        <span className="text-[10px] text-neutral-400">
                          {listing.isVerifiedListing ? "✓ Assured" : "Peer Listing"}
                        </span>
                        <a
                          href={listing.destinationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#2540D9] hover:underline font-bold text-[11px]"
                        >
                          View Listing ↗
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORY-SPECIFIC INSPECTION CHECKLIST (C7) */}
        {activeTab === "checklist" && (
          <div className="mt-5 space-y-4 font-mono text-xs">
            <div className="rounded border border-amber-300 bg-amber-50 p-3 text-amber-950 font-sans text-xs">
              <strong>Mandatory Pre-Purchase Checklist:</strong> Never transfer payment before verifying these physical points hands-on. Check off each item as you inspect the unit.
            </div>

            <div className="space-y-3">
              {inspectionChecklist.map((item) => {
                const isChecked = checkedItems[item.id] || false;
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`rounded-lg border p-3.5 transition cursor-pointer ${
                      isChecked
                        ? "border-[#1F6B4F] bg-emerald-50/40"
                        : "border-black/15 bg-white hover:border-black/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent onClick
                          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1F6B4F] focus:ring-[#1F6B4F]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#1B1A17]">{item.label}</span>
                            <span
                              className={`rounded px-1.5 py-0.2 text-[10px] font-bold text-white uppercase ${
                                item.severity === "CRITICAL" ? "bg-[#D8381C]" : "bg-[#B45309]"
                              }`}
                            >
                              {item.severity}
                            </span>
                          </div>
                          <span className="text-[11px] text-neutral-500 block mt-0.5">{item.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 pl-6 font-sans text-xs text-neutral-800 space-y-1">
                      <p>
                        <strong className="font-mono text-neutral-700">How to Inspect:</strong> {item.howToInspect}
                      </p>
                      <p className="text-[#D8381C]">
                        <strong className="font-mono">Defect Red Flag:</strong> {item.redFlagDescription}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: NEGOTIATION ASSISTANT (C9 & C10) */}
        {activeTab === "negotiate" && (
          <div className="mt-5 space-y-5 font-mono text-xs">
            {/* Price Targets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded border border-black/15 bg-white p-3">
                <span className="text-neutral-500 uppercase block text-[10px]">Suggested Opening Offer</span>
                <span className="text-lg font-bold text-[#1F6B4F]">
                  ₹{negotiation.suggestedOpeningOfferInr.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-neutral-500 block">Positions offer at lower fair bound</span>
              </div>
              <div className="rounded border border-black/15 bg-white p-3">
                <span className="text-neutral-500 uppercase block text-[10px]">Realistic Target Close</span>
                <span className="text-lg font-bold text-[#2540D9]">
                  ₹{negotiation.reasonableTargetPriceInr.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-neutral-500 block">Fair market median</span>
              </div>
              <div className="rounded border border-black/15 bg-white p-3">
                <span className="text-neutral-500 uppercase block text-[10px]">Hard Walk-Away Price</span>
                <span className="text-lg font-bold text-[#D8381C]">
                  ₹{negotiation.walkAwayPriceInr.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-neutral-500 block">Above this, buy certified or new</span>
              </div>
            </div>

            {/* Negotiation Arguments */}
            <div className="rounded border border-black/15 bg-white p-4 font-sans">
              <span className="font-mono text-xs font-bold uppercase text-neutral-700 block mb-2">
                Factual Negotiation Arguments:
              </span>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-800">
                {negotiation.negotiationPoints.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>

            {/* 1-Click Copyable Message */}
            <div className="rounded border-2 border-black/20 bg-neutral-50 p-4">
              <div className="flex items-center justify-between pb-2 border-b border-black/10">
                <span className="font-bold uppercase text-neutral-700 text-xs">
                  Copyable Negotiation Message (WhatsApp / Chat):
                </span>
                <button
                  type="button"
                  onClick={handleCopyNegotiation}
                  className="rounded bg-[#1B1A17] text-white px-3 py-1 font-bold text-xs hover:bg-neutral-800 transition cursor-pointer"
                >
                  {copiedMessage ? "✓ Copied to Clipboard!" : "Copy Message"}
                </button>
              </div>
              <p className="mt-3 font-sans text-xs text-neutral-800 leading-relaxed bg-white p-3 rounded border border-black/10 select-all">
                {negotiation.copyableSellerMessage}
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: USED REGRET HORIZON (C8) */}
        {activeTab === "regret" && (
          <div className="mt-5 space-y-4 font-mono text-xs">
            <span className="text-neutral-700 uppercase font-bold block">
              Multi-Horizon Component Failure & Regret Timeline:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {regretTimeline.map((item, idx) => (
                <div key={idx} className="rounded-lg border border-black/15 bg-white p-4 font-sans">
                  <div className="flex items-center justify-between font-mono text-[11px] text-neutral-500 pb-1.5 border-b border-black/5">
                    <span className="font-bold text-[#D8381C] uppercase">{item.horizon.replace(/_/g, " ")}</span>
                    <span className="font-bold text-neutral-800">Est. ₹{item.estimatedExpenseInr.toLocaleString("en-IN")}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#1B1A17] mt-2">{item.riskTitle}</h4>
                  <p className="mt-1 text-xs text-neutral-700 leading-relaxed">{item.riskDescription}</p>
                  <div className="mt-2.5 pt-2 border-t border-black/5 text-[11px] font-mono text-emerald-800">
                    <strong>Preventive Check:</strong> {item.preventiveInspectionCheck}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Safety Notice (C13) */}
        <div className="mt-6 border-t border-black/10 pt-4 flex flex-wrap items-center justify-between text-xs font-mono text-neutral-600 gap-2">
          <span>🛡️ Safety Rule: Always meet in public daytime locations. Never transfer advance token UPI deposits.</span>
          <button onClick={onClose} className="font-bold text-black hover:underline cursor-pointer">
            Close Radar
          </button>
        </div>
      </div>
    </div>
  );
}
