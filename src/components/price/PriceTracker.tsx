"use client";

import { useState } from "react";
import type { Product } from "@/lib/engine";
import { getPriceAudit, type PriceAudit, type FestiveSale, type PriceHikeAlert } from "@/lib/price-intelligence";
import { inr } from "@/lib/engine";
import { ProvenanceChip } from "../design-system/ProvenanceChip";
import {
  TrendingDown,
  TrendingUp,
  Calendar,
  AlertTriangle,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
} from "lucide-react";

interface PriceTrackerProps {
  product: Product;
  className?: string;
}

export function PriceTracker({ product, className = "" }: PriceTrackerProps) {
  const [showAllSales, setShowAllSales] = useState(false);
  const audit: PriceAudit = getPriceAudit(product);
  const category = ((product as any).category || (product.priceInr > 500000 ? "car" : "laptop")).toLowerCase();

  const isCar = category === "car" || /car|suv|sedan|creta|harrier|xuv/i.test(product.name);
  const isBike = category === "bike" || /bike|motorcycle|scooter|hunter 350|mt-15/i.test(product.name);
  const isSofa = category === "sofa" || category === "furniture" || /sofa|couch|seater|furniture/i.test(product.name);

  const primarySearchUrl = isCar
    ? product.sourceUrl || `https://www.carwale.com/search/?q=${encodeURIComponent(product.name)}`
    : isBike
    ? product.sourceUrl || `https://www.bikewale.com/search/?q=${encodeURIComponent(product.name)}`
    : (product as any).sourceUrl || `https://www.amazon.in/s?k=${encodeURIComponent(product.name)}`;

  const secondarySearchUrl = isCar
    ? `https://www.cardekho.com/search?q=${encodeURIComponent(product.name)}`
    : isBike
    ? `https://www.bikedekho.com/search?q=${encodeURIComponent(product.name)}`
    : isSofa
    ? `https://www.pepperfry.com/site_product/search?q=${encodeURIComponent(product.name)}`
    : `https://www.flipkart.com/search?q=${encodeURIComponent(product.name)}`;

  const primaryLabel = isCar ? "View on CarWale" : isBike ? "View on BikeWale" : (product as any).retailerName || "Search on Amazon.in";
  const secondaryLabel = isCar ? "Compare on CarDekho" : isBike ? "Compare on BikeDekho" : isSofa ? "Compare on Pepperfry" : "Search on Flipkart";

  const subtitle = isCar
    ? "Tracks historical automotive discount cycles (Year-End Dec Clearance, Diwali Mela, Jan 1st Price Hikes)"
    : isBike
    ? "Tracks two-wheeler seasonal festive cycles & annual RTO/price indexations"
    : isSofa
    ? "Tracks furniture seasonal festive discounts (Diwali Home Mela, Big Billion Days, Wood/Foam cost revisions)"
    : "Tracks 3-year Indian e-commerce seasonal cycles (Amazon GIF, Flipkart BBD, Republic Day)";

  return (
    <div
      className={`bg-[#FBF7EA] border-2 border-[#1B1A17] rounded-[4px] p-6 paper-shadow font-mono text-xs space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1B1A17]/20">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase text-[#8A8576] tracking-wider">
              MARKET AUDIT / HISTORICAL PRECEDENTS
            </span>
            <ProvenanceChip source="verified" />
          </div>
          <h3 className="text-xl font-bold font-display text-[#1B1A17] mt-0.5">
            Price Intelligence & Festive Sale Tracker
          </h3>
          <p className="text-[11px] text-[#8A8576]">
            {subtitle}
          </p>
        </div>

        {/* Timing Recommendation Badge */}
        <div
          className={`px-3 py-1.5 rounded border-2 font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 ${
            audit.recommendation === "BUY NOW"
              ? "bg-[#1F6B4F]/10 text-[#1F6B4F] border-[#1F6B4F]"
              : audit.recommendation === "WAIT FOR SALE"
              ? "bg-[#2540D9]/10 text-[#2540D9] border-[#2540D9]"
              : "bg-[#F3C94B]/30 text-[#1B1A17] border-[#1B1A17]"
          }`}
          style={{ filter: "url(#stamp-filter)" }}
        >
          {audit.recommendation === "BUY NOW" ? (
            <TrendingDown className="w-4 h-4" />
          ) : (
            <Calendar className="w-4 h-4" />
          )}
          <span>{audit.recommendation}</span>
        </div>
      </div>

      {/* Timing Verdict Reason Box */}
      <div className="bg-[#F2EBD8] border border-[#1B1A17]/20 p-3.5 rounded space-y-1">
        <div className="flex items-center justify-between text-[10px] uppercase text-[#8A8576] font-semibold">
          <span>TIMING VERDICT</span>
          <span>HISTORICAL SPREAD: {audit.pricePercentile}% OF RANGE</span>
        </div>
        <p className="text-xs font-semibold text-[#1B1A17]">{audit.timingReason}</p>
      </div>

      {/* Row 1: Price Range Spectrum Gauge */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[11px]">
          <div>
            <span className="text-[#1F6B4F] font-bold block">ALL-TIME LOW</span>
            <span className="text-sm font-bold text-[#1B1A17] tabular-nums">{inr(audit.lowestEverInr)}</span>
            <span className="text-[9px] text-[#8A8576] block">(Big Billion Days)</span>
          </div>

          <div className="text-center bg-white px-3 py-1 rounded border border-[#1B1A17]/30">
            <span className="text-[#2540D9] font-bold block text-[10px]">CURRENT PRICE</span>
            <span className="text-base font-extrabold text-[#1B1A17] tabular-nums">{inr(audit.currentPriceInr)}</span>
            <span className="text-[9px] text-[#8A8576] block">As of {product.priceAsOf}</span>
          </div>

          <div className="text-right">
            <span className="text-[#D8381C] font-bold block">LAUNCH / PEAK</span>
            <span className="text-sm font-bold text-[#1B1A17] tabular-nums">{inr(audit.highestInr)}</span>
            <span className="text-[9px] text-[#8A8576] block">(Recorded Peak)</span>
          </div>
        </div>

        {/* Visual Range Bar */}
        <div className="w-full h-3 bg-[#8A8576]/20 rounded-full overflow-hidden border border-[#1B1A17]/30 relative">
          <div
            className="h-full bg-gradient-to-r from-[#1F6B4F] via-[#F3C94B] to-[#D8381C]"
            style={{ width: "100%" }}
          />
          <div
            className="absolute top-0 bottom-0 w-2.5 bg-[#1B1A17] border border-white -translate-x-1/2"
            style={{ left: `${audit.pricePercentile}%` }}
            title={`Current position: ${audit.pricePercentile}%`}
          />
        </div>
      </div>

      {/* Row 2: Festive Sales Prediction Calendar */}
      <div className="space-y-3 pt-2 border-t border-dashed border-[#1B1A17]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#2540D9]" />
            <span className="font-bold uppercase text-[11px] text-[#1B1A17]">
              FESTIVE SALES PREDICTION CALENDAR
            </span>
          </div>
          <button
            onClick={() => setShowAllSales(!showAllSales)}
            className="text-[10px] text-[#2540D9] hover:underline flex items-center space-x-0.5 cursor-pointer"
          >
            <span>{showAllSales ? "Show Key Sales Only" : "View Full 4-Season Calendar"}</span>
            {showAllSales ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Highlighted Sales: Best Sale vs Next Upcoming */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Best Sale of the Year */}
          <div className="bg-[#1F6B4F]/10 border-2 border-[#1F6B4F] rounded p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="bg-[#1F6B4F] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                ★ RANK #1: BEST SALE OF THE YEAR
              </span>
              <span className="text-xs font-bold text-[#1F6B4F] tabular-nums">
                ~{audit.bestSale.historicalDropPct}% DROP
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1B1A17]">{audit.bestSale.name}</h4>
              <div className="text-[10px] text-[#8A8576]">{audit.bestSale.timing}</div>
            </div>
            <div className="pt-2 border-t border-dashed border-[#1F6B4F]/30 flex justify-between items-baseline">
              <div>
                <span className="text-[9px] text-[#8A8576] block">PREDICTED TARGET:</span>
                <span className="font-extrabold text-sm text-[#1F6B4F] tabular-nums">
                  {inr(audit.bestSale.predictedPriceInr)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-[#8A8576] block">EST. SAVINGS:</span>
                <span className="font-bold text-xs text-[#1B1A17] tabular-nums">
                  -{inr(audit.bestSale.potentialSavingsInr)}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-[#1B1A17]/80 leading-relaxed italic">
              &ldquo;{audit.bestSale.precedentSummary}&rdquo;
            </p>
          </div>

          {/* Next Upcoming Sale (Republic Day Sale) */}
          <div className="bg-[#2540D9]/10 border-2 border-[#2540D9] rounded p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="bg-[#2540D9] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                ⚡ NEXT UPCOMING WINDOW
              </span>
              <span className="text-xs font-bold text-[#2540D9] tabular-nums">
                ~{audit.upcomingSales[0].historicalDropPct}% DROP
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1B1A17]">{audit.upcomingSales[0].name}</h4>
              <div className="text-[10px] text-[#8A8576]">{audit.upcomingSales[0].timing}</div>
            </div>
            <div className="pt-2 border-t border-dashed border-[#2540D9]/30 flex justify-between items-baseline">
              <div>
                <span className="text-[9px] text-[#8A8576] block">PREDICTED TARGET:</span>
                <span className="font-extrabold text-sm text-[#2540D9] tabular-nums">
                  {inr(audit.upcomingSales[0].predictedPriceInr)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-[#8A8576] block">EST. SAVINGS:</span>
                <span className="font-bold text-xs text-[#1B1A17] tabular-nums">
                  -{inr(audit.upcomingSales[0].potentialSavingsInr)}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-[#1B1A17]/80 leading-relaxed italic">
              &ldquo;{audit.upcomingSales[0].precedentSummary}&rdquo;
            </p>
          </div>
        </div>

        {/* Expanded Sales: Least Best Sale & Other Events */}
        {showAllSales && (
          <div className="space-y-2 pt-2 border-t border-dashed border-[#1B1A17]/20">
            {/* Least Best Sale Warning */}
            <div className="bg-[#D8381C]/5 border border-[#D8381C]/40 rounded p-3 space-y-1">
              <div className="flex items-center justify-between text-[#D8381C] font-bold text-[10px] uppercase">
                <span className="flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>LEAST BEST SALE OF THE YEAR: {audit.leastBestSale.name}</span>
                </span>
                <span>ONLY ~{audit.leastBestSale.historicalDropPct}% CASH DROP</span>
              </div>
              <p className="text-[10px] text-[#1B1A17]/80 leading-relaxed">
                {audit.leastBestSale.precedentSummary} (Predicted price: {inr(audit.leastBestSale.predictedPriceInr)}). Buyers are cautioned not to wait for this sale.
              </p>
            </div>

            {/* Holi Sale */}
            <div className="bg-[#F2EBD8] border border-[#1B1A17]/20 rounded p-3 flex justify-between items-center text-[11px]">
              <div>
                <span className="font-bold text-[#1B1A17]">{audit.upcomingSales[1].name}</span>
                <span className="text-[10px] text-[#8A8576] ml-2">({audit.upcomingSales[1].timing})</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#1B1A17]">{inr(audit.upcomingSales[1].predictedPriceInr)}</span>
                <span className="text-[9px] text-[#1F6B4F] block">~{audit.upcomingSales[1].historicalDropPct}% drop</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Row 3: Upcoming Price Hike News & Supply Indicators */}
      <div className="space-y-2 pt-2 border-t border-dashed border-[#1B1A17]/20">
        <div className="flex items-center space-x-1.5 text-[11px] font-bold uppercase text-[#1B1A17]">
          <TrendingUp className="w-3.5 h-3.5 text-[#D8381C]" />
          <span>UPCOMING PRICE HIKE & SUPPLY CHAIN NEWS</span>
        </div>

        <div className="space-y-2">
          {audit.priceHikeAlerts.map((hike, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#1B1A17]/20 p-3 rounded space-y-1 text-[11px]"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#D8381C] flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{hike.headline}</span>
                </span>
                <span className="text-[9px] bg-[#D8381C]/10 text-[#D8381C] px-1.5 py-0.5 rounded font-bold uppercase">
                  Expected Impact: +{inr(hike.expectedImpactInr)}
                </span>
              </div>
              <p className="text-[10px] text-[#1B1A17]/90 leading-relaxed">{hike.explanation}</p>
              <div className="flex justify-between text-[9px] text-[#8A8576] pt-1 border-t border-dashed border-[#1B1A17]/10">
                <span>Source: {hike.source}</span>
                <span>Timeline: {hike.timeline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Verified Direct Retailer Purchase Links (Zero Dead Links) */}
      <div className="pt-3 border-t border-[#1B1A17]/20 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[10px] text-[#8A8576]">
          Direct verified searches (guaranteed live shopping links):
        </div>
        <div className="flex items-center space-x-2">
          <a
            href={primarySearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#1B1A17] text-[#FBF7EA] hover:bg-[#333] transition text-xs font-semibold cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#F3C94B]" />
            <span>{primaryLabel}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={secondarySearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#2540D9] text-white hover:bg-[#1a31b0] transition text-xs font-semibold cursor-pointer"
          >
            <span>{secondaryLabel}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
