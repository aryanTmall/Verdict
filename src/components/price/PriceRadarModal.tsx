"use client";

import { useState } from "react";
import type { Product } from "@/lib/engine";
import { getPriceRadarReport, type PriceRadarReport, type MarketplaceListing } from "@/lib/price-radar";
import { inr } from "@/lib/engine";
import {
  Radar,
  X,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  Clock,
  Sparkles,
  ShoppingBag,
  Percent,
  CheckCircle2,
} from "lucide-react";

interface PriceRadarModalProps {
  product: Product | any;
  onClose: () => void;
  onSetAlert?: (product: Product | any) => void;
}

export function PriceRadarModal({ product, onClose, onSetAlert }: PriceRadarModalProps) {
  const report: PriceRadarReport = getPriceRadarReport(product);
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing>(report.listings[0]);

  return (
    <div className="fixed inset-0 z-50 bg-[#1B1A17]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-mono">
      <div className="bg-[#FBF7EA] border-2 border-[#1B1A17] rounded-[4px] max-w-4xl w-full p-6 paper-shadow-lg space-y-6 relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#1B1A17]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#2540D9] text-white rounded">
              <Radar className="w-5 h-5 animate-spin" style={{ animationDuration: "12s" }} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#8A8576]">
                CROSS-MARKETPLACE ARBITRAGE
              </div>
              <h2 className="text-xl md:text-2xl font-bold font-display text-[#1B1A17]">
                VERDICT Price Radar
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#1B1A17]/10 rounded border border-[#1B1A17]/30 text-[#1B1A17] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Specimen Context */}
        <div className="bg-white border border-[#1B1A17]/20 p-4 rounded flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-[#1B1A17]">{report.productName}</div>
            <div className="text-[11px] text-[#8A8576]">
              Exact Target Variant: <span className="text-[#2540D9] font-bold">{report.exactTargetVariant}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded border text-xs font-bold uppercase tracking-wider ${
                report.priceRecommendation === "BUY NOW"
                  ? "bg-[#1F6B4F]/10 text-[#1F6B4F] border-[#1F6B4F]"
                  : report.priceRecommendation === "WAIT FOR SALE"
                  ? "bg-[#2540D9]/10 text-[#2540D9] border-[#2540D9]"
                  : "bg-[#F3C94B]/30 text-[#1B1A17] border-[#1B1A17]"
              }`}
            >
              {report.priceRecommendation}
            </span>
            {onSetAlert && (
              <button
                onClick={() => {
                  onClose();
                  onSetAlert(product);
                }}
                className="px-3 py-1 bg-[#1B1A17] hover:bg-[#333] text-white text-xs font-bold rounded cursor-pointer transition"
              >
                Set Sale Rule
              </button>
            )}
          </div>
        </div>

        {/* Recommendation Narrative */}
        <div className="text-xs text-[#1B1A17]/90 bg-[#F3C94B]/15 border-l-4 border-[#F3C94B] p-3 rounded">
          <span className="font-bold">Intelligence Finding: </span>
          {report.recommendationReason}
        </div>

        {/* Marketplace Comparison Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#1B1A17] uppercase tracking-wider">
              Live Audited Retailer Feeds ({report.listings.length} Marketplaces)
            </span>
            <span className="text-[#8A8576] text-[11px]">
              Effective Price = Listed + Shipping - Verified Discounts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {report.listings.map((l, idx) => {
              const isCheapest = l.marketplace === report.cheapestMarketplace;
              return (
                <div
                  key={l.id}
                  onClick={() => setSelectedListing(l)}
                  className={`p-3.5 rounded border-2 cursor-pointer transition relative flex flex-col justify-between ${
                    selectedListing.id === l.id
                      ? "border-[#2540D9] bg-white shadow-md"
                      : "border-[#1B1A17]/20 bg-[#FBF7EA] hover:border-[#1B1A17]"
                  }`}
                >
                  {isCheapest && (
                    <span className="absolute -top-2.5 right-2 px-2 py-0.5 bg-[#1F6B4F] text-white text-[9px] font-bold rounded uppercase tracking-wider">
                      Lowest Effective
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#1B1A17] pb-1">
                      <span>{l.marketplace}</span>
                      <span className="text-[11px] text-[#1F6B4F] flex items-center space-x-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        <span>★ {l.sellerRating}</span>
                      </span>
                    </div>

                    <div className="text-[11px] text-[#8A8576] line-clamp-1">{l.seller}</div>

                    <div className="mt-2 pt-2 border-t border-[#1B1A17]/10">
                      <div className="text-lg font-bold font-display text-[#1B1A17]">
                        ₹{l.effectivePriceInr.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-[#8A8576] flex items-center space-x-1">
                        <span>Listed: ₹{l.listedPriceInr.toLocaleString("en-IN")}</span>
                        {l.verifiedDiscountInr > 0 && (
                          <span className="text-[#1F6B4F] font-bold">
                            (-₹{l.verifiedDiscountInr.toLocaleString("en-IN")})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#1B1A17]/10 flex items-center justify-between text-[11px]">
                    <span className="text-[#8A8576] text-[10px]">{l.deliveryEstimate}</span>
                    <a
                      href={l.destinationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#2540D9] font-bold hover:underline flex items-center space-x-0.5"
                    >
                      <span>Buy</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Listing Forensic Audit Card */}
        {selectedListing && (
          <div className="bg-white border-2 border-[#1B1A17] p-4 rounded space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1B1A17]/20 pb-2">
              <div className="font-bold text-xs text-[#1B1A17]">
                DETAILED AUDIT RECEIPT: {selectedListing.marketplace.toUpperCase()}
              </div>
              <span className="text-[10px] text-[#8A8576]">Verified feed updated: {selectedListing.lastChecked}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-[#FBF7EA] p-2.5 rounded border border-[#1B1A17]/15">
                <div className="text-[10px] text-[#8A8576] uppercase">Listed Base Price</div>
                <div className="font-bold text-[#1B1A17]">₹{selectedListing.listedPriceInr.toLocaleString("en-IN")}</div>
              </div>
              <div className="bg-[#FBF7EA] p-2.5 rounded border border-[#1B1A17]/15">
                <div className="text-[10px] text-[#8A8576] uppercase">Delivery / Shipping</div>
                <div className="font-bold text-[#1B1A17]">
                  {selectedListing.shippingInr === 0 ? "FREE" : `+₹${selectedListing.shippingInr}`}
                </div>
              </div>
              <div className="bg-[#FBF7EA] p-2.5 rounded border border-[#1B1A17]/15">
                <div className="text-[10px] text-[#8A8576] uppercase">Verified Coupon</div>
                <div className="font-bold text-[#1F6B4F]">
                  {selectedListing.verifiedDiscountInr > 0
                    ? `-₹${selectedListing.verifiedDiscountInr.toLocaleString("en-IN")}`
                    : "None"}
                </div>
              </div>
              <div className="bg-[#2540D9]/10 p-2.5 rounded border border-[#2540D9]/40">
                <div className="text-[10px] text-[#2540D9] uppercase font-bold">Guaranteed Payable</div>
                <div className="font-bold text-[#2540D9] text-sm">
                  ₹{selectedListing.effectivePriceInr.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {selectedListing.conditionalBankOffers.length > 0 && (
              <div className="text-[11px] text-[#8A8576] bg-[#FBF7EA] p-2.5 rounded border border-dashed border-[#1B1A17]/20">
                <span className="font-bold text-[#1B1A17]">Separately Audited Bank Cashbacks (Conditional): </span>
                {selectedListing.conditionalBankOffers.map((b, i) => (
                  <span key={i} className="inline-block mr-3">
                    • {b.bank}: ₹{b.discountInr.toLocaleString("en-IN")} ({b.terms})
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 12-Month Historical Price Points Chart */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#1B1A17] uppercase tracking-wider">
              12-Month Historical Price Trajectory (Recorded vs Predicted)
            </span>
            <span className="text-[11px] text-[#8A8576]">
              All-Time Low: <strong className="text-[#1F6B4F]">₹{report.lowestEverPriceInr.toLocaleString("en-IN")}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
            {report.priceHistory.map((p, i) => (
              <div
                key={i}
                className={`p-2 rounded border ${
                  p.isSalePeriod
                    ? "bg-[#1F6B4F]/10 border-[#1F6B4F]"
                    : "bg-white border-[#1B1A17]/20"
                }`}
              >
                <div className="text-[10px] text-[#8A8576] font-semibold">{p.date}</div>
                <div className="font-bold text-[#1B1A17] text-xs mt-0.5">₹{p.priceInr.toLocaleString("en-IN")}</div>
                {p.event && (
                  <div className="text-[9px] text-[#2540D9] font-medium truncate mt-0.5" title={p.event}>
                    {p.event}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
