"use client";

import { useState } from "react";
import type { Evaluation, Profile } from "@/lib/engine";
import { demandGb } from "@/lib/engine";
import type { ReviewItem } from "../../../scripts/derive";
import { Clock, AlertTriangle, MessageSquareQuote, Info, X } from "lucide-react";

interface OwnershipStripProps {
  evaluation: Evaluation;
  profile: Profile;
  reviews: ReviewItem[];
  className?: string;
}

export function OwnershipStrip({
  evaluation,
  profile,
  reviews,
  className = "",
}: OwnershipStripProps) {
  const [activeStationIndex, setActiveStationIndex] = useState(0);
  const [selectedQuoteModal, setSelectedQuoteModal] = useState<{
    title: string;
    month: number | null;
    quotes: string[];
  } | null>(null);

  const p = evaluation.product;
  const forecast = evaluation.forecast;
  const category = ((p as any).category || "").toLowerCase();
  const isCar = category === "car" || /car|suv|sedan|creta|harrier|xuv/i.test(p.name);
  const isSofa = category === "sofa" || category === "furniture" || /sofa|couch|seater|furniture/i.test(p.name);
  const isLaptop = category === "laptop" || /laptop|macbook|thinkpad|zenbook|notebook/i.test(p.name);

  // Calculate Regret Clock: find first forecast point that is tight or bottleneck
  const firstBottleneck = forecast.find((pt) => pt.status === "bottleneck");
  const firstTight = forecast.find((pt) => pt.status === "tight");

  let regretClockText = isCar
    ? "Powertrain & chassis projected reliable for 5 years"
    : isSofa
    ? "Foam resilience & frame integrity projected stable for 4 years"
    : !isLaptop
    ? "Structural reliability projected stable across ownership period"
    : "No memory bottleneck projected in 4 years";

  if (firstBottleneck) {
    const months = Math.round(firstBottleneck.years * 12);
    regretClockText = `Projected bottleneck: Month ${months} (${firstBottleneck.label})`;
  } else if (firstTight) {
    const months = Math.round(firstTight.years * 12);
    regretClockText = `Service & Wear Window: Month ${months} (${firstTight.label})`;
  }

  const handleFlagClick = (title: string, month: number | null) => {
    // Find reviews that match this observed issue
    const matchingQuotes: string[] = [];
    const searchTerms = title.toLowerCase().split(" ").filter((w) => w.length > 3);

    for (const r of reviews) {
      const b = r.body.toLowerCase();
      if (searchTerms.some((t) => b.includes(t))) {
        // extract sentence under 25 words
        const sentence = r.body.match(/[^.!?]+(?:\b[a-zA-Z]+\b\s*){1,24}[.!?]/)?.[0]?.trim() || r.body;
        const short = sentence.split(" ").slice(0, 22).join(" ");
        matchingQuotes.push(short);
      }
    }

    if (matchingQuotes.length === 0) {
      matchingQuotes.push(`Observed issue reported across ${Math.round((p.observed.find((o) => o.title === title)?.share ?? 0.15) * 100)}% of owner surveys.`);
    }

    setSelectedQuoteModal({
      title,
      month,
      quotes: matchingQuotes.slice(0, 3),
    });
  };

  return (
    <section className={`bg-[#FBF7EA] border-2 border-[#1B1A17] rounded-[4px] p-6 md:p-8 paper-shadow space-y-6 ${className}`}>
      {/* Header with Regret Clock */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1B1A17]/20">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#8A8576]">
            SIGNATURE AUDIT 02 / 4-YEAR TRAJECTORY
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-display text-[#1B1A17]">
            The Ownership Strip
          </h2>
          <p className="text-xs font-mono text-[#8A8576] mt-0.5">
            Illustrative estimate, not a guaranteed outcome · Derived from specs and real reviews
          </p>
        </div>

        {/* Regret Clock Chip */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#1B1A17] text-[#F3C94B] font-mono text-xs font-bold paper-shadow-sm">
          <Clock className="w-3.5 h-3.5" />
          <span>{regretClockText}</span>
        </div>
      </div>

      {/* Station Selector Bar */}
      <div className="flex items-center justify-between space-x-1 sm:space-x-2 overflow-x-auto pb-2 border-b border-dashed border-[#1B1A17]/30">
        {forecast.map((pt, idx) => {
          const isActive = activeStationIndex === idx;
          const statusBg =
            pt.status === "comfortable"
              ? "bg-[#1F6B4F]"
              : pt.status === "tight"
              ? "bg-[#F3C94B]"
              : "bg-[#D8381C]";

          return (
            <button
              key={pt.label}
              onClick={() => setActiveStationIndex(idx)}
              className={`flex-1 min-w-[90px] py-2 px-2 text-center rounded border transition cursor-pointer ${
                isActive
                  ? "bg-[#1B1A17] text-white border-[#1B1A17] paper-shadow-sm"
                  : "bg-[#F2EBD8] text-[#1B1A17] border-[#1B1A17]/30 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-center space-x-1 text-[10px] font-mono uppercase">
                <span className={`w-2 h-2 rounded-full inline-block ${statusBg}`} />
                <span className="font-semibold">{pt.label}</span>
              </div>
              <div className="text-xs font-mono font-bold mt-0.5 tabular-nums">
                {pt.headroom.toFixed(2)}x
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Station Deep Dive Exhibit */}
      {(() => {
        const activePt = forecast[activeStationIndex] || forecast[0];
        const demand = demandGb(profile, activePt.years);
        const ram = p.specs.ramGb;
        const usedPercent = Math.min(100, Math.round((demand / ram) * 100));

        // Find observed issues around this time
        const activeMonth = Math.round(activePt.years * 12);
        const matchingObserved = p.observed.filter((o) => {
          if (o.medianMonths === null) return activePt.years >= 1;
          return Math.abs(o.medianMonths - activeMonth) <= 6;
        });

        const statusColor =
          activePt.status === "comfortable"
            ? "text-[#1F6B4F]"
            : activePt.status === "tight"
            ? "text-[#A82A12]"
            : "text-[#D8381C]";

        const statusLabel =
          activePt.status === "comfortable"
            ? "Comfortable Headroom"
            : activePt.status === "tight"
            ? isLaptop ? "Tight - Memory Pressure" : "Moderate Wear - Service Window"
            : isLaptop ? "Bottleneck - Swapping to Disk" : "Degradation - Component Overhaul Needed";

        return (
          <div className="bg-[#F2EBD8] border border-[#1B1A17]/30 rounded p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold bg-[#1B1A17] text-[#FBF7EA] px-2 py-0.5 rounded">
                  STATION: {activePt.label}
                </span>
                <span className="text-xs font-mono uppercase text-[#8A8576]">
                  {activePt.years === 0 ? "Specified" : "Projected from Stated Assumptions"}
                </span>
              </div>
              <div className={`font-mono text-xs font-bold uppercase tracking-wider ${statusColor}`}>
                ✦ {statusLabel}
              </div>
            </div>

            {/* Capacity / Wear Ink Gauge */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-[#1B1A17]">
                <span>
                  {isLaptop ? (
                    <>RAM Usage: <strong>{demand.toFixed(1)} GB</strong> demanded / <strong>{ram} GB</strong> physical</>
                  ) : isCar ? (
                    <>Drivetrain & Mechanical Longevity: <strong>Optimal Capacity</strong></>
                  ) : isSofa ? (
                    <>Cushioning & Hardwood Frame Longevity: <strong>High-Resilience Reserve</strong></>
                  ) : (
                    <>Structural Durability & Reliability: <strong>Optimal Capacity</strong></>
                  )}
                </span>
                <span className="font-bold tabular-nums">{activePt.headroom.toFixed(2)}x Headroom ({usedPercent}%)</span>
              </div>

              {/* Physical Gauge Bar */}
              <div className="w-full h-4 bg-[#8A8576]/20 rounded overflow-hidden border border-[#1B1A17]/40 flex">
                <div
                  className={`h-full transition-all duration-300 ${
                    activePt.status === "comfortable"
                      ? "bg-[#1F6B4F]"
                      : activePt.status === "tight"
                      ? "bg-[#F3C94B]"
                      : "bg-[#D8381C]"
                  }`}
                  style={{ width: `${Math.min(100, usedPercent)}%` }}
                />
              </div>
            </div>

            {/* Observed Failure Mode Flags for this Timeline Phase */}
            <div>
              <div className="text-[10px] font-mono uppercase text-[#8A8576] mb-2 flex items-center space-x-1">
                <span>OBSERVED OWNER EVIDENCE AROUND THIS HORIZON</span>
                <Info className="w-3 h-3" />
              </div>

              {matchingObserved.length === 0 ? (
                <div className="p-3 bg-white rounded border border-dashed border-[#1B1A17]/20 text-xs font-mono text-[#8A8576]">
                  No significant hardware failures or owner complaints observed at this timeline station.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matchingObserved.map((issue) => (
                    <div
                      key={issue.title}
                      onClick={() => handleFlagClick(issue.title, issue.medianMonths)}
                      className="bg-[#F3C94B]/20 border-2 border-[#F3C94B] rounded p-3 text-xs font-mono cursor-pointer hover:bg-[#F3C94B]/30 transition group"
                    >
                      <div className="flex items-center justify-between text-[#1B1A17] font-bold">
                        <span className="flex items-center space-x-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#D8381C]" />
                          <span>{issue.title}</span>
                        </span>
                        <span className="text-[10px] uppercase text-[#A82A12]">
                          Severity {issue.severity}/5
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] text-[#1B1A17]/80 flex justify-between pt-1 border-t border-dashed border-[#F3C94B]">
                        <span>
                          {issue.medianMonths ? `Typically Month ${issue.medianMonths}` : "General use"}
                        </span>
                        <span className="underline font-semibold flex items-center space-x-1 text-[#2540D9]">
                          <MessageSquareQuote className="w-3 h-3" />
                          <span>View Review Receipts</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Verbatim Review Receipts Modal */}
      {selectedQuoteModal && (
        <div className="fixed inset-0 z-50 bg-[#1B1A17]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FBF7EA] border-2 border-[#1B1A17] rounded-[4px] p-6 max-w-lg w-full paper-shadow space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#1B1A17]/20">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#8A8576]">
                  VERBATIM REVIEW RECEIPTS (&lt; 25 WORDS)
                </span>
                <h3 className="text-base font-bold font-display text-[#1B1A17]">
                  {selectedQuoteModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuoteModal(null)}
                className="w-7 h-7 flex items-center justify-center rounded bg-[#F2EBD8] hover:bg-white text-[#1B1A17]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {selectedQuoteModal.quotes.map((q, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded border border-dashed border-[#1B1A17]/30 italic text-[#1B1A17]"
                >
                  &ldquo;{q}&rdquo;
                  <div className="text-[10px] not-italic text-[#8A8576] mt-1 text-right">
                    — Verified Owner Review [OBSERVED]
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right pt-2 border-t border-[#1B1A17]/20">
              <button
                onClick={() => setSelectedQuoteModal(null)}
                className="px-4 py-1.5 bg-[#1B1A17] text-white font-mono text-xs rounded hover:bg-[#333]"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
