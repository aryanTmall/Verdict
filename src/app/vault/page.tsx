"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RubberStamp } from "@/components/design-system/RubberStamp";
import { inr } from "@/lib/engine";
import type { SavedVerdict } from "@/lib/types";
import { type PurchaseRule, getPurchaseRules } from "@/lib/sale-autopilot";
import { type BuyerDnaProfile, getStoredBuyerDna } from "@/lib/buyer-dna";
import { BuyerDnaModal } from "@/components/dna/BuyerDnaModal";
import {
  ArrowLeft,
  ExternalLink,
  FolderArchive,
  Bell,
  ShieldCheck,
  Dna,
  Calendar,
  Clock,
  Zap,
  TrendingDown,
  CheckCircle2,
} from "lucide-react";

export default function VaultPage() {
  const [activeTab, setActiveTab] = useState<"verdicts" | "alerts" | "warranty" | "dna">("verdicts");
  const [verdicts, setVerdicts] = useState<SavedVerdict[]>([]);
  const [rules, setRules] = useState<PurchaseRule[]>([]);
  const [buyerDna, setBuyerDna] = useState<BuyerDnaProfile | null>(null);
  const [showDnaModal, setShowDnaModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVault() {
      try {
        const res = await fetch("/api/save");
        const serverData: SavedVerdict[] = await res.json();

        const localRaw = localStorage.getItem("verdict_vault");
        const localData: SavedVerdict[] = localRaw ? JSON.parse(localRaw) : [];

        const map = new Map<string, SavedVerdict>();
        serverData.forEach((v) => map.set(v.slug, v));
        localData.forEach((v) => map.set(v.slug, v));

        setVerdicts(Array.from(map.values()));
      } catch {
        const localRaw = localStorage.getItem("verdict_vault");
        if (localRaw) setVerdicts(JSON.parse(localRaw));
      }

      // Load purchase rules
      try {
        const rulesRes = await fetch("/api/sale-autopilot/rules");
        const rulesData = await rulesRes.json();
        if (rulesData.rules) setRules(rulesData.rules);
      } catch {
        setRules(getPurchaseRules());
      }

      // Load Buyer DNA
      setBuyerDna(getStoredBuyerDna());
      setLoading(false);
    }

    loadVault();
  }, []);

  return (
    <div className="min-h-screen py-10 px-4 max-w-4xl mx-auto space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b-2 border-[#1B1A17] gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#8A8576]">
            PURCHASE MEMORY & OWNERSHIP COMPANION
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1B1A17]">
            The Verdict Vault
          </h1>
        </div>
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#1B1A17] text-white text-xs rounded hover:bg-[#333] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>New Cross-Examination</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 text-xs border-b border-[#1B1A17]/20 pb-3">
        <button
          onClick={() => setActiveTab("verdicts")}
          className={`px-3 py-1.5 rounded font-bold cursor-pointer transition flex items-center space-x-1.5 ${
            activeTab === "verdicts"
              ? "bg-[#1B1A17] text-white"
              : "bg-[#FBF7EA] border border-[#1B1A17]/30 text-[#1B1A17]"
          }`}
        >
          <FolderArchive className="w-3.5 h-3.5" />
          <span>Saved Case Files ({verdicts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("alerts")}
          className={`px-3 py-1.5 rounded font-bold cursor-pointer transition flex items-center space-x-1.5 ${
            activeTab === "alerts"
              ? "bg-[#1B1A17] text-white"
              : "bg-[#FBF7EA] border border-[#1B1A17]/30 text-[#1B1A17]"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Price Watch & Autopilot ({rules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("warranty")}
          className={`px-3 py-1.5 rounded font-bold cursor-pointer transition flex items-center space-x-1.5 ${
            activeTab === "warranty"
              ? "bg-[#1B1A17] text-white"
              : "bg-[#FBF7EA] border border-[#1B1A17]/30 text-[#1B1A17]"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Warranty & Maintenance</span>
        </button>

        <button
          onClick={() => setActiveTab("dna")}
          className={`px-3 py-1.5 rounded font-bold cursor-pointer transition flex items-center space-x-1.5 ${
            activeTab === "dna"
              ? "bg-[#1B1A17] text-white"
              : "bg-[#FBF7EA] border border-[#1B1A17]/30 text-[#1B1A17]"
          }`}
        >
          <Dna className="w-3.5 h-3.5" />
          <span>Buyer DNA</span>
        </button>
      </div>

      {/* Tab 1: Saved Verdicts */}
      {activeTab === "verdicts" && (
        <div>
          {loading ? (
            <div className="py-16 text-center space-y-3 text-xs text-[#8A8576]">
              <div className="w-6 h-6 border-2 border-[#1B1A17] border-t-transparent rounded-full animate-spin mx-auto" />
              <div>Retrieving case files from evidence vault...</div>
            </div>
          ) : verdicts.length === 0 ? (
            <div className="bg-[#FBF7EA] border-2 border-dashed border-[#1B1A17]/30 rounded p-12 text-center space-y-3">
              <FolderArchive className="w-10 h-10 text-[#8A8576] mx-auto stroke-1" />
              <h3 className="text-base font-bold text-[#1B1A17]">The Vault is Empty</h3>
              <p className="text-xs text-[#8A8576] max-w-sm mx-auto">
                You have not saved any product cross-examinations yet. Check a purchase and click &ldquo;Save Verdict&rdquo; to store it here.
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-block px-4 py-2 bg-[#2540D9] text-white text-xs font-semibold rounded"
                >
                  Start First Audit
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {verdicts.map((v) => (
                <div
                  key={v.slug}
                  className="bg-[#FBF7EA] border-2 border-[#1B1A17] rounded-[4px] p-6 paper-shadow flex flex-col justify-between space-y-4 hover:-translate-y-1 transition duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#1B1A17]/20 text-[10px] text-[#8A8576]">
                      <span>CASE REF: {v.slug.toUpperCase()}</span>
                      <span>{new Date(v.createdAt).toLocaleDateString("en-GB")}</span>
                    </div>

                    <div className="py-2">
                      <RubberStamp verdict={v.verdictKind} caution={v.caution} size="sm" />
                    </div>

                    <h3 className="font-bold text-base font-display text-[#1B1A17] mt-1">{v.productName}</h3>

                    <div className="mt-2 text-xs space-y-1 text-[#1B1A17]">
                      <div className="flex justify-between">
                        <span className="text-[#8A8576]">Purchase Price:</span>
                        <span className="font-bold">{inr(v.priceInr)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8A8576]">Fit Score:</span>
                        <span className="font-bold text-[#2540D9]">{Math.round(v.fitScore)} / 100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8A8576]">Estimated TCO:</span>
                        <span className="font-bold">{inr(v.tcoInr)}</span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-[#8A8576] line-clamp-2 italic">
                      &ldquo;{v.reason}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1B1A17]/20 flex items-center justify-between">
                    <Link
                      href={`/r/${v.slug}`}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-[#2540D9] hover:underline"
                    >
                      <span>Open Full Receipt</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <a
                      href={`/api/ics?slug=${v.slug}`}
                      download
                      className="text-[11px] text-[#8A8576] hover:text-[#1B1A17]"
                      title="Download .ics warranty reminder"
                    >
                      Warranty .ics
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Price Watch & Autopilot */}
      {activeTab === "alerts" && (
        <div className="space-y-4">
          <div className="text-xs text-[#8A8576]">
            Active automated price drop monitors and bounded sale autopilot rules.
          </div>

          {rules.length === 0 ? (
            <div className="bg-[#FBF7EA] border-2 border-dashed border-[#1B1A17]/30 p-8 rounded text-center text-xs text-[#8A8576]">
              No active price watch rules configured yet.
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-[#FBF7EA] border-2 border-[#1B1A17] p-4 rounded paper-shadow flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-sm text-[#1B1A17]">{rule.productName}</div>
                    <div className="text-[11px] text-[#8A8576] mt-0.5">
                      Target Threshold: <strong className="text-[#1F6B4F]">₹{rule.targetPriceInr.toLocaleString("en-IN")}</strong> · Mode: {rule.purchaseMode}
                    </div>
                    <div className="text-[10px] text-[#8A8576]">
                      Monitored Event: {rule.saleEventName}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        rule.status === "AWAITING_APPROVAL"
                          ? "bg-[#D8381C] text-white animate-pulse"
                          : rule.status === "COMPLETED"
                          ? "bg-[#1F6B4F] text-white"
                          : "bg-[#2540D9]/10 text-[#2540D9]"
                      }`}
                    >
                      {rule.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Warranty & Maintenance Reminders */}
      {activeTab === "warranty" && (
        <div className="space-y-4">
          <div className="text-xs text-[#8A8576]">
            Export calendar-synchronized cutoff reminders for all your audited items to prevent expired claims.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verdicts.map((v) => (
              <div
                key={v.slug}
                className="bg-[#FBF7EA] border-2 border-[#1B1A17] p-4 rounded paper-shadow space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1B1A17]">{v.productName}</span>
                  <span className="text-[10px] text-[#1F6B4F] font-bold bg-[#1F6B4F]/10 px-2 py-0.5 rounded">
                    Active Coverage
                  </span>
                </div>

                <div className="text-[11px] text-[#8A8576]">
                  Purchase Horizon: {v.profile?.years || 3} Years · Factory On-Site Protection
                </div>

                <div className="pt-2 border-t border-[#1B1A17]/10 flex items-center justify-between">
                  <span className="text-[10px] text-[#8A8576]">
                    Cutoff: {new Date(new Date(v.createdAt).getTime() + (v.profile?.years || 1) * 365 * 86400000).toLocaleDateString("en-GB")}
                  </span>
                  <a
                    href={`/api/ics?slug=${v.slug}`}
                    download
                    className="inline-flex items-center space-x-1 text-xs text-[#2540D9] font-bold hover:underline"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Sync to Calendar (.ics)</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Buyer DNA */}
      {activeTab === "dna" && (
        <div className="bg-[#FBF7EA] border-2 border-[#1B1A17] p-6 rounded paper-shadow space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-[#1B1A17]/20 pb-3">
            <div>
              <h3 className="text-lg font-bold font-display text-[#1B1A17]">Your Active Buyer Profile</h3>
              <p className="text-[11px] text-[#8A8576]">
                Shapes how VERDICT normalizes fit scores and filters high-risk compromises.
              </p>
            </div>
            <button
              onClick={() => setShowDnaModal(true)}
              className="px-3.5 py-1.5 bg-[#2540D9] text-white font-bold rounded cursor-pointer hover:bg-[#1a31b0] transition"
            >
              Edit DNA Profile
            </button>
          </div>

          {buyerDna && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded border border-[#1B1A17]/20">
                <div className="text-[10px] uppercase text-[#8A8576]">Risk Tolerance</div>
                <div className="font-bold text-[#1B1A17] mt-0.5">{buyerDna.riskTolerance.replace(/_/g, " ")}</div>
              </div>
              <div className="bg-white p-3 rounded border border-[#1B1A17]/20">
                <div className="text-[10px] uppercase text-[#8A8576]">Longevity Priority</div>
                <div className="font-bold text-[#1B1A17] mt-0.5">{buyerDna.longevityPriority.replace(/_/g, " ")}</div>
              </div>
              <div className="bg-white p-3 rounded border border-[#1B1A17]/20">
                <div className="text-[10px] uppercase text-[#8A8576]">Personalization State</div>
                <div className="font-bold text-[#1F6B4F] mt-0.5">
                  {buyerDna.isPersonalizationEnabled ? "Active & Calibrating" : "Disabled"}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Buyer DNA Modal */}
      {showDnaModal && (
        <BuyerDnaModal
          onClose={() => setShowDnaModal(false)}
          onDnaSaved={(updated) => setBuyerDna(updated)}
        />
      )}
    </div>
  );
}
