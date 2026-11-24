"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/engine";
import {
  type PurchaseRule,
  type PurchaseMode,
  getPurchaseRules,
  createPurchaseRule,
  approvePurchaseRule,
} from "@/lib/sale-autopilot";
import {
  Zap,
  X,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Bell,
  Lock,
  ChevronRight,
  TrendingDown,
} from "lucide-react";

interface SaleAutopilotModalProps {
  product?: Product | any;
  onClose: () => void;
}

export function SaleAutopilotModal({ product, onClose }: SaleAutopilotModalProps) {
  const currentPrice = product?.priceInr || 75000;
  const productName = product?.name || "Target Specimen";
  const slug = product?.slug || "product";

  const [targetPrice, setTargetPrice] = useState<number>(Math.round(currentPrice * 0.92));
  const [maxPayable, setMaxPayable] = useState<number>(Math.round(currentPrice * 0.95));
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>("APPROVAL_REQUIRED");
  const [sellerPref, setSellerPref] = useState<"authorized_only" | "any_verified">("authorized_only");
  const [consentGranted, setConsentGranted] = useState(false);
  const [rules, setRules] = useState<PurchaseRule[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load rules on mount
  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await fetch("/api/sale-autopilot/rules");
      const data = await res.json();
      if (data.rules) setRules(data.rules);
    } catch {
      setRules(getPurchaseRules());
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/sale-autopilot/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: slug,
          productName,
          targetPriceInr: targetPrice,
          maxEffectivePayableInr: maxPayable,
          currentObservedPriceInr: currentPrice,
          purchaseMode,
          sellerPreference: sellerPref,
          saleEventName: "Year-End December Clearance & Flash Days",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Autopilot Rule armed for ${productName} at ₹${targetPrice.toLocaleString("en-IN")}.`);
        fetchRules();
      }
    } catch {
      // Fallback in-memory
      createPurchaseRule({
        productId: slug,
        productName,
        targetPriceInr: targetPrice,
        maxEffectivePayableInr: maxPayable,
        currentObservedPriceInr: currentPrice,
        purchaseMode,
        sellerPreference: sellerPref,
      });
      fetchRules();
      setSuccessMessage("Rule configured and stored locally.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveRule = async (ruleId: string) => {
    try {
      const res = await fetch(`/api/sale-autopilot/rules/${ruleId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userSignature: "AUTHORIZED_BUYER_PASSPHRASE" }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(data.message);
        fetchRules();
      }
    } catch {
      approvePurchaseRule(ruleId, { userSignature: "AUTHORIZED_BUYER_PASSPHRASE" });
      fetchRules();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1B1A17]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-mono">
      <div className="bg-[#FBF7EA] border-2 border-[#1B1A17] rounded-[4px] max-w-3xl w-full p-6 paper-shadow-lg space-y-6 relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#1B1A17]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#D8381C] text-white rounded">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#8A8576]">
                AUTONOMOUS SALE AGENT & PRICE WATCH
              </div>
              <h2 className="text-xl md:text-2xl font-bold font-display text-[#1B1A17]">
                VERDICT Sale Autopilot
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

        {/* Countdown Banner */}
        <div className="bg-[#1B1A17] text-[#FBF7EA] p-4 rounded flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-[#F3C94B] flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Next Major Scheduled Sale Window</span>
            </div>
            <div className="text-sm font-bold">Year-End December Clearance (All Major Marketplaces)</div>
          </div>

          <div className="flex items-center space-x-2 text-center text-xs">
            <div className="bg-[#FBF7EA] text-[#1B1A17] px-2.5 py-1.5 rounded font-bold">
              <div className="text-base font-display">14</div>
              <div className="text-[9px] uppercase">Days</div>
            </div>
            <div className="bg-[#FBF7EA] text-[#1B1A17] px-2.5 py-1.5 rounded font-bold">
              <div className="text-base font-display">08</div>
              <div className="text-[9px] uppercase">Hours</div>
            </div>
            <div className="bg-[#FBF7EA] text-[#1B1A17] px-2.5 py-1.5 rounded font-bold">
              <div className="text-base font-display">32</div>
              <div className="text-[9px] uppercase">Mins</div>
            </div>
          </div>
        </div>

        {/* New Rule Configuration Form */}
        <form onSubmit={handleCreateRule} className="bg-white border-2 border-[#1B1A17] p-5 rounded space-y-4">
          <div className="flex items-center justify-between border-b border-[#1B1A17]/10 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1B1A17]">
              Configure Purchase Rule: {productName}
            </span>
            <span className="text-xs text-[#8A8576]">Current: ₹{currentPrice.toLocaleString("en-IN")}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#8A8576] uppercase mb-1">
                Target Trigger Price (INR)
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                className="w-full bg-[#FBF7EA] border border-[#1B1A17] p-2 rounded font-bold text-[#1B1A17]"
                required
              />
              <span className="text-[10px] text-[#1F6B4F]">
                ~{Math.round(((currentPrice - targetPrice) / currentPrice) * 100)}% expected discount
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#8A8576] uppercase mb-1">
                Maximum Effective Payable Cap
              </label>
              <input
                type="number"
                value={maxPayable}
                onChange={(e) => setMaxPayable(Number(e.target.value))}
                className="w-full bg-[#FBF7EA] border border-[#1B1A17] p-2 rounded font-bold text-[#1B1A17]"
                required
              />
              <span className="text-[10px] text-[#8A8576]">Hard ceiling including shipping & taxes</span>
            </div>
          </div>

          {/* Mode Selector */}
          <div>
            <label className="block text-[11px] font-bold text-[#8A8576] uppercase mb-1.5">
              Autopilot Execution Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <label
                className={`p-3 rounded border-2 cursor-pointer transition ${
                  purchaseMode === "NOTIFY_ONLY"
                    ? "border-[#2540D9] bg-[#2540D9]/10 font-bold"
                    : "border-[#1B1A17]/20 bg-[#FBF7EA]"
                }`}
              >
                <input
                  type="radio"
                  name="purchaseMode"
                  value="NOTIFY_ONLY"
                  checked={purchaseMode === "NOTIFY_ONLY"}
                  onChange={() => setPurchaseMode("NOTIFY_ONLY")}
                  className="sr-only"
                />
                <div className="flex items-center space-x-1.5 text-[#2540D9] mb-1">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Mode 1: Notify Only</span>
                </div>
                <p className="text-[10px] text-[#8A8576] font-normal">
                  Alert me via in-app banner & push when target price hits.
                </p>
              </label>

              <label
                className={`p-3 rounded border-2 cursor-pointer transition ${
                  purchaseMode === "APPROVAL_REQUIRED"
                    ? "border-[#1F6B4F] bg-[#1F6B4F]/10 font-bold"
                    : "border-[#1B1A17]/20 bg-[#FBF7EA]"
                }`}
              >
                <input
                  type="radio"
                  name="purchaseMode"
                  value="APPROVAL_REQUIRED"
                  checked={purchaseMode === "APPROVAL_REQUIRED"}
                  onChange={() => setPurchaseMode("APPROVAL_REQUIRED")}
                  className="sr-only"
                />
                <div className="flex items-center space-x-1.5 text-[#1F6B4F] mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Mode 2: Approval Req.</span>
                </div>
                <p className="text-[10px] text-[#8A8576] font-normal">
                  Prepare cart and await 1-click buyer confirmation.
                </p>
              </label>

              <label
                className={`p-3 rounded border-2 cursor-pointer transition ${
                  purchaseMode === "PRE_AUTHORIZED"
                    ? "border-[#D8381C] bg-[#D8381C]/10 font-bold"
                    : "border-[#1B1A17]/20 bg-[#FBF7EA]"
                }`}
              >
                <input
                  type="radio"
                  name="purchaseMode"
                  value="PRE_AUTHORIZED"
                  checked={purchaseMode === "PRE_AUTHORIZED"}
                  onChange={() => setPurchaseMode("PRE_AUTHORIZED")}
                  className="sr-only"
                />
                <div className="flex items-center space-x-1.5 text-[#D8381C] mb-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Mode 3: Pre-Authorized</span>
                </div>
                <p className="text-[10px] text-[#8A8576] font-normal">
                  Execute bounded checkout with zero raw card storage.
                </p>
              </label>
            </div>
          </div>

          {/* Safety Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start space-x-2 text-xs text-[#1B1A17] cursor-pointer">
              <input
                type="checkbox"
                checked={consentGranted}
                onChange={(e) => setConsentGranted(e.target.checked)}
                className="mt-0.5 rounded border-[#1B1A17]"
                required
              />
              <span>
                I authorize VERDICT to monitor real-time marketplace prices and strictly enforce my ceiling of ₹
                {maxPayable.toLocaleString("en-IN")}. No raw financial credentials stored.
              </span>
            </label>
          </div>

          {successMessage && (
            <div className="p-3 bg-[#1F6B4F]/10 border border-[#1F6B4F] text-[#1F6B4F] text-xs font-bold rounded flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!consentGranted || submitting}
            className="w-full py-2.5 bg-[#1B1A17] hover:bg-[#333] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded transition cursor-pointer"
          >
            {submitting ? "Arming Autopilot Agent..." : "Arm Sale Autopilot Rule"}
          </button>
        </form>

        {/* Existing Active Rules Dossier */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#1B1A17]">
            Active Monitored Purchase Rules ({rules.length})
          </div>

          <div className="space-y-2">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="bg-white border border-[#1B1A17]/20 p-3.5 rounded flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-[#1B1A17]">{rule.productName}</div>
                  <div className="text-[11px] text-[#8A8576]">
                    Target: <strong className="text-[#1F6B4F]">₹{rule.targetPriceInr.toLocaleString("en-IN")}</strong> · Mode: {rule.purchaseMode}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      rule.status === "AWAITING_APPROVAL"
                        ? "bg-[#D8381C] text-white animate-pulse"
                        : rule.status === "COMPLETED"
                        ? "bg-[#1F6B4F] text-white"
                        : "bg-[#2540D9]/10 text-[#2540D9]"
                    }`}
                  >
                    {rule.status.replace(/_/g, " ")}
                  </span>

                  {rule.status === "AWAITING_APPROVAL" && (
                    <button
                      onClick={() => handleApproveRule(rule.id)}
                      className="px-3 py-1 bg-[#1F6B4F] hover:bg-[#16523c] text-white font-bold rounded cursor-pointer transition text-[11px]"
                    >
                      Authorize Buy Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
