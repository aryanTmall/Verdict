"use client";

import { useState } from "react";
import { NumberReel } from "../design-system/NumberReel";
import { ProductIllustration } from "../design-system/ProductIllustration";
import { getPriceAudit } from "@/lib/price-intelligence";
import type { Evaluation } from "@/lib/engine";
import { CRITERIA } from "@/lib/engine";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  ShoppingBag,
  Radar,
  Zap,
} from "lucide-react";

interface ExhibitSheetProps {
  letter: "A" | "B" | "C";
  evaluation: Evaluation;
  isSelected: boolean;
  onSelect: () => void;
  onOpenRadar?: (p: any) => void;
  onOpenAutopilot?: (p: any) => void;
  className?: string;
}

export function ExhibitSheet({
  letter,
  evaluation,
  isSelected,
  onSelect,
  onOpenRadar,
  onOpenAutopilot,
  className = "",
}: ExhibitSheetProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const p = evaluation.product;
  const priceAudit = getPriceAudit(p);

  // Derive "Best for" and "Biggest compromise" dynamically from scores and risks
  const bestCriterion = (["performance", "battery", "portability", "reliability"] as const).reduce(
    (best, curr) => ((p.scores[curr] ?? 0) > (p.scores[best] ?? 0) ? curr : best)
  );

  const topRisk = evaluation.risks[0];
  const compromise = (p as any).compromise || (topRisk ? topRisk.title : "Higher initial purchase price");
  const bestFor = (p as any).bestFor || `High ${bestCriterion} capability`;
  const imageUrl = (p as any).primaryImageUrl || (p as any).imageUrl || `/products/${p.slug}.svg`;

  const category = (p as any).category || "laptop";
  const isCar =
    category === "car" ||
    category === "cars" ||
    /car|suv|sedan|hatchback|creta|harrier|xuv|venue|ciaz|city|verna|glanza|seltos|nexon|brezza|scorpio|thar|safari|innova/i.test(
      p.name + " " + category
    );
  const isBike =
    category === "bike" ||
    category === "motorcycle" ||
    category === "motorcycles" ||
    /bike|motorcycle|scooter|royalenfield|bullet|classic 350|hunter 350|ktm|duke|yamaha|mt-15|r15|apache|pulsar/i.test(
      p.name + " " + category
    );

  // Domain-aware direct marketplace & official model links
  const directRetailerUrl =
    (p as any).destinationUrl ||
    (p as any).sourceUrl ||
    (p as any).retailerUrl ||
    (isCar
      ? `https://www.carwale.com/search/?q=${encodeURIComponent(p.name)}`
      : isBike
      ? `https://www.bikewale.com/search/?q=${encodeURIComponent(p.name)}`
      : `https://www.amazon.in/s?k=${encodeURIComponent(p.name)}`);

  const retailerLabel =
    (p as any).destinationLabel ||
    (p as any).retailerName ||
    (isCar ? "CarWale / Showroom ↗" : isBike ? "BikeWale / Dealer ↗" : "Live Amazon.in ↗");

  // Domain-aware specs label
  const specsLabel =
    (p as any).specsSummary ||
    (isCar
      ? `${p.brand} · Automotive Class · ${p.specs?.warrantyYears || 3} Yrs Warranty`
      : `${p.brand} · ${p.specs?.ramGb ?? 16}GB RAM ${p.specs?.ramUpgradable ? "(Upgradable)" : ""} · ${p.specs?.weightKg ?? 1.6}kg`);

  // Domain-aware sale prediction
  const salePred = (p as any).salePrediction;
  const nextSaleName = salePred?.nextSaleName || (isCar ? "Year-End Dec Clearance" : "Republic Day (Jan)");
  const nextSaleDrop = salePred?.expectedDropPct || priceAudit.upcomingSales[0].historicalDropPct;

  return (
    <div
      onClick={onSelect}
      className={`group relative bg-[#FBF7EA] border-2 rounded-[4px] p-5 paper-shadow transition-all duration-300 cursor-pointer flex flex-col justify-between ${
        isSelected
          ? "border-[#2540D9] ring-2 ring-[#2540D9]/30"
          : "border-[#1B1A17] hover:border-[#1B1A17]/80"
      } ${className}`}
    >
      {/* Exhibit Badge Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#1B1A17]/20 flex-wrap gap-1">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#1B1A17] text-[#FBF7EA] rounded-sm">
              EXHIBIT {letter}
            </span>
            {letter === "A" && (
              <span className="text-[10px] font-mono text-[#1F6B4F] font-bold tracking-wider uppercase">
                ✦ TOP ENGINE FIT
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-mono text-[#8A8576]">CONFIDENCE:</span>
            <span className="text-xs font-mono font-bold text-[#1B1A17] tabular-nums">
              {Math.round(p.evidenceConfidence * 100)}%
            </span>
          </div>
        </div>

        {/* Product Illustration (Never a broken image) */}
        <div className="relative w-full h-36 my-3 bg-[#F2EBD8] rounded flex items-center justify-center overflow-hidden border border-[#1B1A17]/10">
          <ProductIllustration
            name={p.name}
            brand={p.brand}
            category={(p as any).category || "laptop"}
            imageUrl={imageUrl}
          />
        </div>

        {/* Product Details */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase text-[#8A8576] tracking-wider line-clamp-1">
            {specsLabel}
          </div>
          <h3 className="font-bold text-base md:text-lg font-display text-[#1B1A17] line-clamp-2 leading-tight">
            {p.name}
          </h3>
        </div>

        {/* Price & Fit Score */}
        <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-dashed border-[#1B1A17]/20">
          <div>
            <div className="text-xl font-bold font-mono text-[#1B1A17] tabular-nums">
              <NumberReel value={p.priceInr} prefix="₹" formatInr durationMs={250} />
            </div>
            <div className="text-[10px] font-mono text-[#8A8576]">Recorded as of {p.priceAsOf}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black font-mono text-[#2540D9] tabular-nums">
              <NumberReel value={Math.round(evaluation.fit)} suffix="/100" durationMs={200} />
            </div>
            <div className="text-[10px] font-mono text-[#8A8576] uppercase">FIT SCORE</div>
          </div>
        </div>

        {/* Price Tracker Prediction Pill & Quick Action Tools */}
        <div className="mt-2.5 p-2 bg-[#F2EBD8] rounded border border-[#1B1A17]/15 flex items-center justify-between text-[10px] font-mono">
          <span className="flex items-center space-x-1 text-[#1B1A17] font-semibold truncate mr-1">
            <TrendingDown className="w-3 h-3 text-[#1F6B4F] flex-shrink-0" />
            <span className="truncate">Next Drop: {nextSaleName}</span>
          </span>
          <span className="font-bold text-[#1F6B4F] bg-white px-1.5 py-0.5 rounded border border-[#1F6B4F]/30 flex-shrink-0">
            ~{nextSaleDrop}% off
          </span>
        </div>

        {/* Price Radar & Autopilot Quick Triggers */}
        {(onOpenRadar || onOpenAutopilot) && (
          <div className="mt-2 flex items-center space-x-2 text-[10px] font-mono">
            {onOpenRadar && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenRadar(p);
                }}
                className="flex-1 inline-flex items-center justify-center space-x-1 py-1 px-2 bg-white hover:bg-[#2540D9] hover:text-white text-[#2540D9] border border-[#2540D9]/30 rounded transition font-bold cursor-pointer"
                title="Cross-marketplace price comparison"
              >
                <Radar className="w-3 h-3" />
                <span>Price Radar</span>
              </button>
            )}
            {onOpenAutopilot && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAutopilot(p);
                }}
                className="flex-1 inline-flex items-center justify-center space-x-1 py-1 px-2 bg-white hover:bg-[#D8381C] hover:text-white text-[#D8381C] border border-[#D8381C]/30 rounded transition font-bold cursor-pointer"
                title="Configure target price alert and sale rule"
              >
                <Zap className="w-3 h-3" />
                <span>Sale Autopilot</span>
              </button>
            )}
          </div>
        )}

        {/* Best For / Compromise */}
        <div className="mt-3 bg-[#F2EBD8] p-2.5 rounded text-xs font-mono space-y-1.5 border border-[#1B1A17]/10">
          <div className="flex items-start space-x-1.5 text-[#1F6B4F]">
            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#1B1A17]">Best for:</strong> {bestFor}
            </span>
          </div>
          <div className="flex items-start space-x-1.5 text-[#D8381C]">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#1B1A17]">Compromise:</strong> {compromise}
            </span>
          </div>
        </div>

        {/* Expandable Score Breakdown */}
        <div className="mt-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowBreakdown(!showBreakdown);
            }}
            className="w-full flex items-center justify-between text-xs font-mono text-[#2540D9] hover:underline pt-1 cursor-pointer"
          >
            <span>{showBreakdown ? "Hide Score Breakdown" : "View Deterministic Breakdown"}</span>
            {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showBreakdown && (
            <div className="mt-2 p-2 bg-white rounded border border-[#1B1A17]/20 text-[11px] font-mono space-y-1">
              {CRITERIA.map((c) => {
                const b = evaluation.breakdown[c];
                return (
                  <div key={c} className="flex justify-between items-center text-[#1B1A17]">
                    <span className="capitalize">{c}:</span>
                    <span className="tabular-nums font-semibold">
                      {Math.round(b.score)}/100 (contrib +{b.contribution.toFixed(1)})
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* External Verified Retailer Link (Zero Dead Links) */}
      <div className="mt-4 pt-3 border-t border-[#1B1A17]/20 flex items-center justify-between gap-2">
        <a
          href={directRetailerUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center space-x-1 text-xs font-mono font-semibold text-[#1B1A17] hover:text-[#2540D9] bg-white px-2.5 py-1 rounded border border-[#1B1A17]/30 shadow-xs"
          title={`Open live verified ${retailerLabel} search`}
        >
          <ShoppingBag className="w-3 h-3 text-[#2540D9]" />
          <span>{retailerLabel}</span>
          <ExternalLink className="w-3 h-3 text-[#8A8576]" />
        </a>

        <button
          type="button"
          onClick={onSelect}
          className={`text-xs font-mono px-3 py-1 rounded transition cursor-pointer ${
            isSelected
              ? "bg-[#2540D9] text-white font-bold"
              : "bg-[#F2EBD8] text-[#1B1A17] hover:bg-[#1B1A17] hover:text-white"
          }`}
        >
          {isSelected ? "Active Focus" : "Cross-Examine"}
        </button>
      </div>
    </div>
  );
}
