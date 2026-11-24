"use client";

import Link from "next/link";
import { RubberStamp } from "@/components/design-system/RubberStamp";
import { ThermalReceipt } from "@/components/design-system/ThermalReceipt";
import { ProvenanceChip } from "@/components/design-system/ProvenanceChip";
import { WindowChrome } from "@/components/design-system/WindowChrome";
import { TickerMarquee } from "@/components/design-system/TickerMarquee";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function DesignSystemPage() {
  const tokens = [
    { name: "Paper (Background)", hex: "#F2EBD8", textHex: "#1B1A17", contrast: "14.2:1 (AAA)" },
    { name: "Sheet (Cards/Raised)", hex: "#FBF7EA", textHex: "#1B1A17", contrast: "15.8:1 (AAA)" },
    { name: "Ink (Text & Lines)", hex: "#1B1A17", textHex: "#FBF7EA", contrast: "15.8:1 (AAA)" },
    { name: "Carbon Blue (Action/Live)", hex: "#2540D9", textHex: "#FFFFFF", contrast: "7.1:1 (AAA)" },
    { name: "Stamp Vermilion (Stamps)", hex: "#D8381C", textHex: "#FFFFFF", contrast: "4.8:1 (AA)" },
    { name: "Evidence Green (Supported)", hex: "#1F6B4F", textHex: "#FFFFFF", contrast: "5.5:1 (AA)" },
    { name: "Tape Yellow (Diffs/Highlights)", hex: "#F3C94B", textHex: "#1B1A17", contrast: "11.9:1 (AAA)" },
    { name: "Graphite (Unverifiable/Hatched)", hex: "#8A8576", textHex: "#1B1A17", contrast: "4.6:1 (AA)" },
  ];

  return (
    <div className="min-h-screen py-10 px-4 max-w-5xl mx-auto space-y-12">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-[#1B1A17]">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#8A8576]">
            VERDICT DESIGN AUDIT
          </div>
          <h1 className="text-3xl font-extrabold font-display text-[#1B1A17]">
            The Case File Design System
          </h1>
        </div>
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#1B1A17] text-white font-mono text-xs rounded hover:bg-[#333]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product</span>
        </Link>
      </div>

      {/* 1. Palette & WCAG AA tokens */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-display text-[#1B1A17] pb-1 border-b border-[#1B1A17]/20">
          1. Color Tokens & Contrast Ratios
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {tokens.map((t) => (
            <div
              key={t.name}
              className="p-4 rounded border-2 border-[#1B1A17] paper-shadow-sm font-mono text-xs flex flex-col justify-between"
              style={{ backgroundColor: t.hex, color: t.textHex }}
            >
              <div>
                <div className="font-bold text-sm">{t.name}</div>
                <div className="opacity-80 text-[11px] mt-0.5">{t.hex}</div>
              </div>
              <div className="mt-4 pt-2 border-t border-current/20 flex items-center justify-between text-[10px]">
                <span>WCAG:</span>
                <span className="font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 inline" />
                  <span>{t.contrast}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Rubber Stamps */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-display text-[#1B1A17] pb-1 border-b border-[#1B1A17]/20">
          2. Rubber Stamp Elements (Displacement + Rough Ink)
        </h2>
        <div className="bg-[#FBF7EA] border-2 border-[#1B1A17] p-8 rounded paper-shadow flex flex-wrap items-center justify-around gap-6">
          <RubberStamp verdict="buy" caution={false} size="md" />
          <RubberStamp verdict="buy" caution={true} size="md" />
          <RubberStamp verdict="wait" size="md" />
          <RubberStamp verdict="avoid" size="md" />
          <RubberStamp verdict="alternative" size="md" />
        </div>
      </section>

      {/* 3. Provenance Chips */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-display text-[#1B1A17] pb-1 border-b border-[#1B1A17]/20">
          3. Provenance Tracking Chips
        </h2>
        <div className="bg-[#FBF7EA] border-2 border-[#1B1A17] p-6 rounded paper-shadow flex flex-wrap gap-3 items-center">
          <ProvenanceChip source="verified" />
          <ProvenanceChip source="source_claim" />
          <ProvenanceChip source="user_input" />
          <ProvenanceChip source="ai_inference" />
          <ProvenanceChip source="assumption" />
          <ProvenanceChip source="unknown" />
        </div>
      </section>

      {/* 4. Thermal Receipt Component */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-display text-[#1B1A17] pb-1 border-b border-[#1B1A17]/20">
          4. Perforated Thermal Receipt (Radial Gradient Mask)
        </h2>
        <ThermalReceipt
          caseRef="VDT-DESIGN-SPEC"
          date="21-NOV-2026"
          title="Sample Hardware Cross-Examination Receipt"
          lines={[
            { label: "Purchase Price", value: 68990, provenance: "verified", detail: "As of 18-Nov-2026" },
            { label: "Uncovered Warranty Reserve", value: 4500, provenance: "assumption" },
            { label: "Projected 4-Yr Total Cost", value: 73490, provenance: "assumption", isTotal: true },
          ]}
        />
      </section>

      {/* 5. Window Chrome & Ticker */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-display text-[#1B1A17] pb-1 border-b border-[#1B1A17]/20">
          5. Window Chrome & Ticker Marquee
        </h2>
        <TickerMarquee />
        <div className="mt-4">
          <WindowChrome title="exhibit_inspection.log" badge="AUDIT LOG">
            <div className="space-y-2 font-mono text-xs">
              <div>✓ Mission parsed with deterministic fallback safeguards.</div>
              <div>✓ Quote substrings verified server-side against raw review text.</div>
              <div>✓ Digit-guard confirmed zero hallucinated numbers in narration.</div>
            </div>
          </WindowChrome>
        </div>
      </section>
    </div>
  );
}
