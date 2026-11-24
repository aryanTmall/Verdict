"use client";

import { useEffect, useState } from "react";
import { RubberStamp } from "../design-system/RubberStamp";
import { ThermalReceipt } from "../design-system/ThermalReceipt";
import type { Evaluation, Verdict, Profile } from "@/lib/engine";
import { inr } from "@/lib/engine";
import { Bookmark, Share2, CalendarPlus, X, Volume2, VolumeX, Check } from "lucide-react";

interface VerdictModalProps {
  evaluation: Evaluation;
  verdict: Verdict;
  profile: Profile;
  narration?: {
    headline: string;
    regretParagraph: string;
    whatWouldChangeMyMind: string;
  } | null;
  onClose: () => void;
  onSave: () => Promise<string | null>; // returns saved slug
}

export function VerdictModal({
  evaluation,
  verdict,
  profile,
  narration,
  onClose,
  onSave,
}: VerdictModalProps) {
  const [stampLanded, setStampLanded] = useState(false);
  const [receiptPrinted, setReceiptPrinted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Synthesized Web Audio "Thud"
  const playThud = () => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // AudioContext not allowed before user gesture or muted
    }
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setStampLanded(true);
      setReceiptPrinted(true);
      return;
    }

    // Step 1: Stamp slam in 140ms
    const stampTimer = setTimeout(() => {
      setStampLanded(true);
      playThud();
    }, 140);

    // Step 2: Stepped receipt reveal ~900ms
    const receiptTimer = setTimeout(() => {
      setReceiptPrinted(true);
    }, 400);

    return () => {
      clearTimeout(stampTimer);
      clearTimeout(receiptTimer);
    };
  }, [isMuted]);

  const p = evaluation.product;
  const topRisk = evaluation.risks[0];

  const handleSave = async () => {
    if (savedSlug || isSaving) return;
    setIsSaving(true);
    const slug = await onSave();
    setIsSaving(false);
    if (slug) setSavedSlug(slug);
  };

  const handleShare = () => {
    const url = savedSlug
      ? `${window.location.origin}/r/${savedSlug}`
      : window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1B1A17]/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      data-lenis-prevent
    >
      <div className="relative max-w-xl w-full my-8 space-y-4">
        {/* Controls Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-[#F2EBD8]">
          <div className="flex items-center space-x-2">
            <span className="font-bold uppercase tracking-wider">OFFICIAL VERDICT FILE</span>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20"
              title="Toggle synthesized stamp sound"
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              <span>{isMuted ? "Sound Off" : "Sound On"}</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
            aria-label="Close verdict"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Paper Slip Envelope Container */}
        <div className="bg-[#FBF7EA] border-4 border-[#1B1A17] rounded-[4px] p-6 md:p-8 paper-shadow-lg relative overflow-hidden">
          {/* Slamming Rubber Stamp */}
          <div className="text-center py-3">
            <div
              className={`transition-all duration-150 ${
                stampLanded
                  ? "scale-100 opacity-100 translate-y-0"
                  : "scale-160 opacity-0 -translate-y-4"
              }`}
            >
              <RubberStamp verdict={verdict.kind} caution={verdict.caution} size="lg" />
            </div>
            <div className="mt-2 font-mono text-xs text-[#8A8576]">
              CONFIDENCE: {Math.round(verdict.confidence * 100)}% · EVIDENCE AUDITED
            </div>
          </div>

          {/* Stepped Thermal Receipt Reveal */}
          <div
            className={`transition-all duration-700 ${
              receiptPrinted
                ? "opacity-100 max-h-[1200px]"
                : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            <ThermalReceipt
              caseRef={`VDT-${p.slug.slice(0, 8).toUpperCase()}`}
              date={new Date().toLocaleDateString("en-GB")}
              title={p.name}
              lines={[
                {
                  label: "Initial Purchase Price",
                  value: inr(p.priceInr),
                  provenance: p.provenance["priceInr"] ?? "source_claim",
                  detail: `Recorded as of ${p.priceAsOf}`,
                },
                {
                  label: "Engine Fit Score",
                  value: `${Math.round(evaluation.fit)} / 100`,
                  provenance: "ai_inference",
                },
                {
                  label: "Primary Regret Risk",
                  value: topRisk ? `${Math.round(topRisk.score * 100)}% Risk` : "Low",
                  provenance: topRisk?.provenance ?? "assumption",
                  detail: topRisk ? topRisk.title : "No major bottleneck found",
                },
                {
                  label: `Projected ${profile.years}-Year TCO`,
                  value: inr(evaluation.tco.totalInr),
                  provenance: "assumption",
                  isTotal: true,
                },
              ]}
            >
              {/* Narration & What Would Change My Mind */}
              <div className="space-y-3 font-mono text-xs text-[#1B1A17] pt-2">
                <div>
                  <span className="font-bold text-[#8A8576] uppercase text-[10px] block">
                    DECISION REASONING:
                  </span>
                  <p className="mt-0.5 leading-relaxed">{verdict.reason}</p>
                </div>

                {narration && (
                  <div className="bg-[#F2EBD8] p-3 rounded border border-dashed border-[#1B1A17]/30 space-y-1.5">
                    <div className="font-bold text-[11px] text-[#1B1A17]">
                      {narration.headline}
                    </div>
                    <p className="text-[11px] text-[#1B1A17]/90 leading-relaxed">
                      {narration.regretParagraph}
                    </p>
                    <div className="text-[10px] text-[#8A8576] pt-1 border-t border-dashed border-[#1B1A17]/20">
                      <strong>What would change my mind: </strong>
                      <span>{narration.whatWouldChangeMyMind}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || Boolean(savedSlug)}
                  className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-[#1B1A17] hover:bg-[#333] text-white font-mono text-xs font-semibold rounded disabled:opacity-50 cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{savedSlug ? "Saved to Vault" : isSaving ? "Saving..." : "Save Verdict"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-[#2540D9] hover:bg-[#1a31b0] text-white font-mono text-xs font-semibold rounded cursor-pointer"
                >
                  {copiedShare ? <Check className="w-3.5 h-3.5 text-white" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedShare ? "Link Copied!" : "Share Receipt"}</span>
                </button>

                <a
                  href={`/api/ics?slug=${savedSlug || "demo"}`}
                  download
                  className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-[#F2EBD8] hover:bg-white text-[#1B1A17] border border-[#1B1A17]/40 font-mono text-xs font-semibold rounded cursor-pointer"
                  title="Download .ics calendar warranty reminder"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>Warranty .ics</span>
                </a>
              </div>
            </ThermalReceipt>
          </div>
        </div>
      </div>
    </div>
  );
}
