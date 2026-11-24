"use client";

import React from "react";
import { MONETIZATION_DISCLOSURE, AFFILIATE_PARTNERS } from "@/lib/monetization/affiliate";

interface MonetizationTransparencyModalProps {
  onClose: () => void;
}

export function MonetizationTransparencyModal({ onClose }: MonetizationTransparencyModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border-2 border-[#1B1A17] bg-[#FBF7EA] p-6 shadow-2xl font-serif text-[#1B1A17]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1B1A17] pb-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#2540D9]">
              LEGAL CHARTER · ARTICLE 4
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[#1B1A17] mt-0.5">
              Monetization & Commercial Ethics
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded border border-black/20 bg-white px-2.5 py-1 font-mono text-xs hover:border-black hover:bg-[#F2EBD8] cursor-pointer"
          >
            ✕ ESC
          </button>
        </div>

        {/* The Trust-First Principle */}
        <div className="mt-5 rounded-md border-l-4 border-[#1F6B4F] bg-[#1F6B4F]/5 p-4">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1F6B4F]">
            The Trust-First Rule
          </h3>
          <p className="mt-1 text-sm font-sans leading-relaxed text-neutral-800">
            {MONETIZATION_DISCLOSURE}
          </p>
        </div>

        {/* Four Core Pillars */}
        <div className="mt-6 space-y-4 text-xs font-sans">
          {/* Pillar 1: Affiliate Revenue */}
          <div className="rounded border border-black/10 bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-[#2540D9]">01.</span>
              <h4 className="font-serif text-sm font-bold text-[#1B1A17]">
                Affiliate Commerce Links
              </h4>
            </div>
            <p className="mt-1.5 text-neutral-700 leading-relaxed">
              When buyers click out to purchase eligible products on verified retail marketplaces (Amazon, Flipkart, Croma, etc.), VERDICT may earn a small referral commission. Our recommendation algorithms are completely decoupled from whether a product generates a commission or not. If a non-affiliate product is better for the buyer, it wins.
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5 pt-2 border-t border-black/5 font-mono text-[11px] text-neutral-600">
              <span className="font-bold">Active Networks:</span>
              {Object.values(AFFILIATE_PARTNERS).map((p) => (
                <span key={p.partnerId} className="rounded bg-neutral-100 px-1.5 py-0.5 border border-black/10">
                  {p.name}
                </span>
              ))}
            </div>
          </div>

          {/* Pillar 2: Premium VERDICT PLUS */}
          <div className="rounded border border-black/10 bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-[#2540D9]">02.</span>
              <h4 className="font-serif text-sm font-bold text-[#1B1A17]">
                Subscription Revenue (VERDICT PLUS)
              </h4>
            </div>
            <p className="mt-1.5 text-neutral-700 leading-relaxed">
              We offer power buyers an optional premium membership (₹499/mo) granting access to extended 5-year ownership forecasts, unlimited saved buying files, autonomous snipe buying modes, and exportable thermal PDF receipts.
            </p>
          </div>

          {/* Pillar 3: Sponsored Placement Rules */}
          <div className="rounded border border-black/10 bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-[#D8381C]">03.</span>
              <h4 className="font-serif text-sm font-bold text-[#1B1A17]">
                Zero-Corruption Sponsored Placement Rules
              </h4>
            </div>
            <p className="mt-1.5 text-neutral-700 leading-relaxed">
              Merchants and brands can never buy or manipulate VERDICT scores. Any future sponsored placements must be explicitly labelled <strong>[SPONSORED PROMOTION]</strong>, separated from organic exhibits, and can never replace Exhibit A (Best Overall).
            </p>
          </div>

          {/* Pillar 4: Zero Data Selling */}
          <div className="rounded border border-black/10 bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-[#1F6B4F]">04.</span>
              <h4 className="font-serif text-sm font-bold text-[#1B1A17]">
                Privacy Guarantee (Zero Data Selling)
              </h4>
            </div>
            <p className="mt-1.5 text-neutral-700 leading-relaxed">
              We never sell your search history, financial budgets, or personal buyer profiles to ad brokers, data brokers, or high-frequency marketing networks.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-black/10 pt-4">
          <button
            onClick={onClose}
            className="rounded border border-[#1B1A17] bg-[#1B1A17] px-4 py-2 font-mono text-xs text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            Affirm & Close
          </button>
        </div>
      </div>
    </div>
  );
}
