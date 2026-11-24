"use client";

import React, { useState, useEffect } from "react";
import {
  getCurrentSubscriptionTier,
  setSubscriptionTier,
  VERDICT_PRICING,
  SubscriptionTier,
} from "@/lib/monetization/entitlements";
import { trackEvent } from "@/lib/monetization/analytics";

interface VerdictPlusModalProps {
  onClose: () => void;
  onTierChanged?: (newTier: SubscriptionTier) => void;
}

export function VerdictPlusModal({ onClose, onTierChanged }: VerdictPlusModalProps) {
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>("FREE");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [justActivated, setJustActivated] = useState(false);

  useEffect(() => {
    setCurrentTier(getCurrentSubscriptionTier());
    trackEvent("PLUS_MODAL_VIEWED");
  }, []);

  const handleToggleTier = () => {
    const nextTier: SubscriptionTier = currentTier === "FREE" ? "PLUS" : "FREE";
    setSubscriptionTier(nextTier);
    setCurrentTier(nextTier);
    setJustActivated(nextTier === "PLUS");
    trackEvent("PLUS_TIER_TOGGLED", { newTier: nextTier });
    onTierChanged?.(nextTier);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border-2 border-[#1B1A17] bg-[#FBF7EA] p-6 shadow-2xl font-serif text-[#1B1A17]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1B1A17] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#2540D9]">
                MEMBERSHIP ENTITLEMENTS
              </span>
              <span className="rounded bg-[#2540D9] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                VERDICT PLUS
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#1B1A17] mt-1">
              Elevate Your Buying Power
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded border border-black/20 bg-white px-2.5 py-1 font-mono text-xs hover:border-black hover:bg-[#F2EBD8] cursor-pointer"
          >
            ✕ ESC
          </button>
        </div>

        {/* Activation Banner if Just Activated */}
        {justActivated && (
          <div className="mt-4 rounded-md border border-[#1F6B4F] bg-[#1F6B4F]/10 p-3 font-mono text-xs text-[#1F6B4F] flex items-center justify-between">
            <span>✓ VERDICT PLUS entitlements successfully activated in demo/judge sandbox!</span>
            <button onClick={() => setJustActivated(false)} className="text-neutral-500 hover:text-black">✕</button>
          </div>
        )}

        {/* Pricing Selector */}
        <div className="mt-5 flex items-center justify-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`rounded-l border px-3 py-1.5 transition ${
              billingCycle === "monthly"
                ? "border-black bg-[#1B1A17] text-white"
                : "border-black/20 bg-white text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            Monthly (₹{VERDICT_PRICING.monthlyInr}/mo)
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("annual")}
            className={`rounded-r border px-3 py-1.5 transition ${
              billingCycle === "annual"
                ? "border-black bg-[#1B1A17] text-white"
                : "border-black/20 bg-white text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            Annual (₹{VERDICT_PRICING.annualInr}/yr · Save 33%)
          </button>
        </div>

        {/* Free vs PLUS Matrix Table */}
        <div className="mt-5 overflow-hidden rounded border border-black/15 bg-white font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/10 bg-[#F2EBD8]/60 text-[11px] uppercase tracking-wider text-neutral-700">
                <th className="p-3">Capability / Intelligence Tier</th>
                <th className="p-3 w-28 text-center border-l border-black/10">FREE</th>
                <th className="p-3 w-32 text-center border-l border-black/10 bg-blue-50/50 text-[#2540D9] font-bold">
                  VERDICT PLUS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-[12px]">
              <tr>
                <td className="p-3 font-sans font-medium text-neutral-900">
                  Universal Cross-Examination & Deterministic Scoring
                </td>
                <td className="p-3 text-center border-l border-black/5 text-emerald-700 font-bold">✓ Included</td>
                <td className="p-3 text-center border-l border-black/5 bg-blue-50/30 text-emerald-700 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-medium text-neutral-900">
                  Ownership Horizon Projections
                </td>
                <td className="p-3 text-center border-l border-black/5 text-neutral-600">2-Year Horizon</td>
                <td className="p-3 text-center border-l border-black/5 bg-blue-50/30 font-bold text-[#2540D9]">Full 5-Year Horizon</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-medium text-neutral-900">
                  Saved Case Files & Evidence Vault
                </td>
                <td className="p-3 text-center border-l border-black/5 text-neutral-600">Up to 3 Files</td>
                <td className="p-3 text-center border-l border-black/5 bg-blue-50/30 font-bold text-[#2540D9]">Unlimited (999+)</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-medium text-neutral-900">
                  Price Radar & Active Sale Watchlists
                </td>
                <td className="p-3 text-center border-l border-black/5 text-neutral-600">2 Active Monitors</td>
                <td className="p-3 text-center border-l border-black/5 bg-blue-50/30 font-bold text-[#2540D9]">Unlimited Watches</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-medium text-neutral-900">
                  Sale Autopilot Mode 3 (Pre-Authorized Snipe)
                </td>
                <td className="p-3 text-center border-l border-black/5 text-neutral-400">✕ Mode 1 & 2 only</td>
                <td className="p-3 text-center border-l border-black/5 bg-blue-50/30 text-emerald-700 font-bold">✓ Bounded Snipe</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-medium text-neutral-900">
                  Exportable Thermal Receipts & Audit Transcripts
                </td>
                <td className="p-3 text-center border-l border-black/5 text-neutral-400">✕</td>
                <td className="p-3 text-center border-l border-black/5 bg-blue-50/30 text-emerald-700 font-bold">✓ 1-Click Export</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-medium text-neutral-900">
                  Personal Buyer DNA (Custom Brand Blacklists)
                </td>
                <td className="p-3 text-center border-l border-black/5 text-neutral-600">Basic DNA</td>
                <td className="p-3 text-center border-l border-black/5 bg-blue-50/30 font-bold text-[#2540D9]">Advanced Shifting</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Active Status & Demo/Judge Sandbox Action */}
        <div className="mt-6 rounded-lg border border-black/15 bg-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-neutral-500 block uppercase">
              Current Session Membership Status
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`font-mono text-sm font-bold px-2 py-0.5 rounded ${
                  currentTier === "PLUS"
                    ? "bg-[#2540D9] text-white"
                    : "bg-neutral-200 text-neutral-800"
                }`}
              >
                {currentTier === "PLUS" ? "VERDICT PLUS (ACTIVE)" : "FREE TIER"}
              </span>
              <span className="text-xs font-sans text-neutral-600">
                {currentTier === "PLUS"
                  ? "All pro features, 5-year horizons, and autopilot modes unlocked."
                  : "Standard consumer features active."}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleTier}
            className={`w-full sm:w-auto px-4 py-2 rounded font-mono text-xs font-bold transition cursor-pointer ${
              currentTier === "PLUS"
                ? "border border-neutral-300 bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                : "border border-[#2540D9] bg-[#2540D9] text-white hover:bg-blue-800 shadow"
            }`}
          >
            {currentTier === "PLUS" ? "Revert to Free Tier" : "⚡ Activate 14-Day Free Pass"}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-4 text-xs font-mono text-neutral-500">
          <span>Cancel anytime · Zero credit card required during hackathon preview.</span>
          <button
            onClick={onClose}
            className="text-neutral-800 hover:text-black font-bold cursor-pointer underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
