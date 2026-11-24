"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LetterReelHeadline } from "@/components/home/LetterReelHeadline";
import { IntakeIndexCard } from "@/components/home/IntakeIndexCard";
import { TickerMarquee } from "@/components/design-system/TickerMarquee";
import { HonestAgentLog, type LogEntry } from "@/components/log/HonestAgentLog";
import { MissionBuilder } from "@/components/mission/MissionBuilder";
import { ExhibitSheet } from "@/components/shortlist/ExhibitSheet";
import { DismissedStrip } from "@/components/shortlist/DismissedStrip";
import { TradeoffRadar } from "@/components/shortlist/TradeoffRadar";
import { OwnershipStrip } from "@/components/strip/OwnershipStrip";
import { ClaimsLedger } from "@/components/claims/ClaimsLedger";
import { PriceTracker } from "@/components/price/PriceTracker";
import { PriceRadarModal } from "@/components/price/PriceRadarModal";
import { SaleAutopilotModal } from "@/components/autopilot/SaleAutopilotModal";
import { SmartPairingSection } from "@/components/pairing/SmartPairingSection";
import { ScanModal } from "@/components/scan/ScanModal";
import { MultilingualVoiceDrawer } from "@/components/voice/MultilingualVoiceDrawer";
import { NotificationDrawer } from "@/components/notifications/NotificationDrawer";
import { BuyerDnaModal } from "@/components/dna/BuyerDnaModal";
import { applyDnaToWeights } from "@/lib/buyer-dna";
import { RiskAccordionTable } from "@/components/risk/RiskAccordionTable";
import { TcoBreakdown } from "@/components/tco/TcoBreakdown";
import { WhatIfPanel } from "@/components/whatif/WhatIfPanel";
import { VerdictModal } from "@/components/verdict/VerdictModal";
import { AskDrawer } from "@/components/ask/AskDrawer";

import type { Profile, Evaluation, Product } from "@/lib/engine";
import { evaluate, decide, whatIf } from "@/lib/engine";
import type { ClaimVerification, NarrationResult } from "@/lib/types";
import type { ReviewItem, CatalogItem } from "../../scripts/derive";
import {
  MessageSquareCode,
  ShieldAlert,
  Sparkles,
  FolderArchive,
  Palette,
  Radar,
  Zap,
  Bell,
  Camera,
  Languages,
  Dna,
} from "lucide-react";

export default function HomePage() {
  const [catalog, setCatalog] = useState<any[]>([]);
  const [reviewsMap, setReviewsMap] = useState<Record<string, ReviewItem[]>>({});
  const [profile, setProfile] = useState<Profile | null>(null);
  const [assumptions, setAssumptions] = useState<string[]>([]);
  const [clarifyingQuestion, setClarifyingQuestion] = useState<string | null>(null);
  const [clarifyingQuestions, setClarifyingQuestions] = useState<any[]>([]);

  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [claimsAudit, setClaimsAudit] = useState<ClaimVerification[]>([]);
  const [claimsLoading, setClaimsLoading] = useState(false);

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [diffMessage, setDiffMessage] = useState<string | null>(null);
  const [aiIntakeAnswer, setAiIntakeAnswer] = useState<string | null>(null);
  const [recommendedSlugs, setRecommendedSlugs] = useState<string[]>([]);

  // Advanced Master Modals & Drawer states
  const [showRadarModal, setShowRadarModal] = useState(false);
  const [radarProduct, setRadarProduct] = useState<any>(null);

  const [showAutopilotModal, setShowAutopilotModal] = useState(false);
  const [autopilotProduct, setAutopilotProduct] = useState<any>(null);

  const [showScanModal, setShowScanModal] = useState(false);
  const [showVoiceDrawer, setShowVoiceDrawer] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showDnaModal, setShowDnaModal] = useState(false);
  const [missionOverride, setMissionOverride] = useState<string | undefined>(undefined);

  // Verdict Modal state
  const [showVerdictModal, setShowVerdictModal] = useState(false);
  const [narration, setNarration] = useState<NarrationResult | null>(null);

  // Ask Drawer state
  const [isAskOpen, setIsAskOpen] = useState(false);

  // Load catalog on mount
  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch("/api/catalog");
        const data: CatalogItem[] = await res.json();
        setCatalog(data);
      } catch (err) {
        console.error("Failed to load catalog:", err);
      }
    }
    loadCatalog();
  }, []);

  // Helper to add honest log entry
  const addLog = (step: string, status: "pending" | "done" | "skipped", detail?: string) => {
    const time = new Date().toLocaleTimeString("en-IN", { hour12: false });
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setLogs((prev) => [...prev, { id, timestamp: time, step, status, detail }]);
  };

  // Run audit mission
  const handleAnalyzeMission = async (text: string, isDemo = false) => {
    setIsLoading(true);
    setLogs([]);
    setDiffMessage(null);
    setSelectedProductSlug(null);
    setClaimsAudit([]);
    setReviewsMap({});
    setAiIntakeAnswer(null);
    setEvaluations([]);

    addLog("Intake Mission Received", "pending", `Parsing ${text.length} chars`);

    try {
      // Step 1: Parse mission
      const parseRes = await fetch("/api/mission/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, demo: isDemo }),
      });
      const parseData = await parseRes.json();
      const extractedProfile: Profile = parseData.profile;

      addLog(
        "Mission Profile Extracted",
        "done",
        `Budget: ₹${extractedProfile.budgetInr.toLocaleString("en-IN")} · ${extractedProfile.years} Yrs · ${extractedProfile.workloads.length} workloads`
      );

      setProfile(extractedProfile);
      setAssumptions(parseData.assumptionsMade || []);
      setClarifyingQuestion(parseData.clarifyingQuestion || null);
      setClarifyingQuestions(parseData.clarifyingQuestions || []);

      if (parseData.aiAnswer) {
        setAiIntakeAnswer(parseData.aiAnswer);
        addLog(
          "AI Search Intelligence Generated",
          "done",
          `Grounded via Local Ollama (llama3.1:latest)`
        );
      }
      if (parseData.recommendedProductSlugs) {
        setRecommendedSlugs(parseData.recommendedProductSlugs);
      }

      // Step 2: Determine catalog to evaluate (dynamic domain generation or registry)
      let currentCatalog: any[] = [];
      if (parseData.catalogProducts && parseData.catalogProducts.length > 0) {
        currentCatalog = parseData.catalogProducts;
        setCatalog(currentCatalog);
        addLog(
          "Dynamic Domain Audit Loaded",
          "done",
          `${currentCatalog.length} ${parseData.category?.toUpperCase() || "DOMAIN"} specimens initialized with industry intelligence`
        );
      } else {
        const catRes = await fetch("/api/catalog");
        currentCatalog = await catRes.json();
        setCatalog(currentCatalog);
        addLog("Catalog Loaded", "done", `${currentCatalog.length} products in evidence registry`);
      }

      // Step 3: Run Deterministic Engine Evaluation in Browser
      const evals = evaluate(currentCatalog, extractedProfile);
      const eligibleCount = evals.filter((e) => e.eligible).length;
      addLog(
        "Deterministic Engine Evaluated",
        "done",
        `${evals.length} ranked · ${eligibleCount} eligible · ${evals.length - eligibleCount} dismissed by constraints`
      );
      setEvaluations(evals);

      // Set default selected product to best eligible match or Exhibit A
      const bestCandidate = evals.find((e) => e.eligible) || evals[0];
      let topSlug = bestCandidate?.product.slug;
      if (parseData.recommendedProductSlugs && parseData.recommendedProductSlugs.length > 0) {
        const matchedEval = evals.find((e) =>
          parseData.recommendedProductSlugs.some((s: string) =>
            e.product.slug.toLowerCase().includes(s.toLowerCase()) ||
            e.product.name.toLowerCase().includes(s.toLowerCase()) ||
            s.toLowerCase().includes(e.product.brand.toLowerCase())
          )
        );
        if (matchedEval && matchedEval.eligible) {
          topSlug = matchedEval.product.slug;
        }
      }
      setSelectedProductSlug(topSlug || null);

      // Step 4: Audit Claims for top product
      if (topSlug) {
        setClaimsLoading(true);
        addLog("Claims Cross-Examination Started", "pending", `Checking marketing claims for ${topSlug}`);
        const claimsRes = await fetch("/api/claims", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: topSlug,
            demo: isDemo,
            product: currentCatalog.find((p) => p.slug === topSlug),
          }),
        });
        const claimsData = await claimsRes.json();
        setClaimsAudit(claimsData.results || []);
        if (claimsData.reviews) {
          setReviewsMap((prev) => ({ ...prev, [topSlug]: claimsData.reviews }));
        }
        addLog(
          "Claims Cross-Examination Completed",
          "done",
          `${claimsData.results?.length ?? 0} claims tested against review receipts`
        );
        setClaimsLoading(false);
      }
    } catch (err: any) {
      addLog("Analysis Error", "skipped", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Instant in-browser What-If recompute
  const handleProfilePatch = (patch: Partial<Profile>) => {
    if (!profile || catalog.length === 0) return;

    const previousTop = evaluations.find((e) => e.eligible)?.product.name;
    const diff = whatIf(catalog, profile, patch);

    const updatedProfile = {
      ...profile,
      ...patch,
      weights: { ...profile.weights, ...(patch.weights ?? {}) },
    };

    setProfile(updatedProfile);
    setEvaluations(diff.after.evals);

    const newEligibleTop = diff.after.evals.find((e) => e.eligible);
    const newTop = newEligibleTop?.product.name;

    // Detect changes and generate diff message
    if (diff.changed.topPick && previousTop && newTop && previousTop !== newTop) {
      setDiffMessage(`Top pick changed: ${newTop} now leads based on adjusted parameters.`);
    } else if (patch.budgetInr) {
      const topRisk = newEligibleTop?.risks[0];
      setDiffMessage(
        `Budget adjusted to ₹${patch.budgetInr.toLocaleString("en-IN")}. Memory risk is now ${
          topRisk ? Math.round(topRisk.score * 100) : 0
        }%.`
      );
    } else {
      setDiffMessage("Recommendation matrix recomputed live in-browser.");
    }

    // Keep active selection valid
    if (newEligibleTop && (!selectedProductSlug || !diff.after.evals.some((e) => e.product.slug === selectedProductSlug))) {
      setSelectedProductSlug(newEligibleTop.product.slug);
    }
  };

  // Switch selected product to cross-examine
  const handleSelectProduct = async (slug: string) => {
    setSelectedProductSlug(slug);
    setClaimsLoading(true);
    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          product: catalog.find((p) => p.slug === slug),
        }),
      });
      const data = await res.json();
      setClaimsAudit(data.results || []);
      if (data.reviews) {
        setReviewsMap((prev) => ({ ...prev, [slug]: data.reviews }));
      }
    } catch (err) {
      console.error("Failed to load claims for product:", err);
    } finally {
      setClaimsLoading(false);
    }
  };

  // Trigger Official Verdict
  const handleGetVerdict = async () => {
    if (!profile || evaluations.length === 0) return;
    const activeEval = evaluations.find((e) => e.product.slug === selectedProductSlug) || evaluations[0];
    const verdict = decide(evaluations, profile);

    try {
      const res = await fetch("/api/narrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evaluation: activeEval, verdict }),
      });
      const narData = await res.json();
      setNarration(narData);
    } catch {
      // narration fallback is handled in backend
    }

    setShowVerdictModal(true);
  };

  // Save verdict to Vault
  const handleSaveVerdict = async (): Promise<string | null> => {
    if (!profile) return null;
    const activeEval = evaluations.find((e) => e.product.slug === selectedProductSlug) || evaluations[0];
    const verdict = decide(evaluations, profile);
    const p = activeEval.product;

    try {
      const payload = {
        mission: "Engineering purchase cross-examination",
        productSlug: p.slug,
        productName: p.name,
        brand: p.brand,
        priceInr: p.priceInr,
        verdictKind: verdict.kind,
        caution: verdict.caution,
        reason: verdict.reason,
        confidence: verdict.confidence,
        fitScore: activeEval.fit,
        tcoInr: activeEval.tco.totalInr,
        topRiskTitle: activeEval.risks[0]?.title ?? "Standard operational degradation",
        profile,
        evaluation: activeEval,
      };

      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.slug) {
        // Also save to localStorage
        const localRaw = localStorage.getItem("verdict_vault");
        const vault = localRaw ? JSON.parse(localRaw) : [];
        vault.push({ ...payload, id: data.id, slug: data.slug, createdAt: new Date().toISOString() });
        localStorage.setItem("verdict_vault", JSON.stringify(vault));
        return data.slug;
      }
    } catch (err) {
      console.error("Save error:", err);
    }
    return null;
  };

  const eligibleEvals = evaluations.filter((e) => e.eligible);
  const ineligibleEvals = evaluations.filter((e) => !e.eligible);
  const activeEvaluation = evaluations.find((e) => e.product.slug === selectedProductSlug) || eligibleEvals[0] || evaluations[0];

  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Top Dossier Bar */}
      <header className="border-b-2 border-[#1B1A17] bg-[#FBF7EA] py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-display font-extrabold text-xl tracking-tight text-[#1B1A17]">
              VERDICT
            </span>
            <span className="hidden sm:inline-block text-xs font-mono text-[#8A8576] pl-2 border-l border-[#1B1A17]/30">
              &ldquo;See beyond the buy.&rdquo;
            </span>
          </div>

          <div className="flex flex-wrap items-center space-x-2 sm:space-x-4 text-xs font-mono">
            {/* Price Radar Quick Trigger */}
            <button
              onClick={() => {
                setRadarProduct(activeEvaluation?.product || catalog[0]);
                setShowRadarModal(true);
              }}
              className="inline-flex items-center space-x-1 text-[#2540D9] hover:underline font-bold cursor-pointer"
              title="Open Price Radar"
            >
              <Radar className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Price Radar</span>
            </button>

            {/* Sale Autopilot Quick Trigger */}
            <button
              onClick={() => {
                setAutopilotProduct(activeEvaluation?.product || catalog[0]);
                setShowAutopilotModal(true);
              }}
              className="inline-flex items-center space-x-1 text-[#D8381C] hover:underline font-bold cursor-pointer"
              title="Open Sale Autopilot"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sale Autopilot</span>
            </button>

            {/* Scan Anything Button */}
            <button
              onClick={() => setShowScanModal(true)}
              className="inline-flex items-center space-x-1 text-[#1B1A17] hover:text-[#2540D9] font-medium cursor-pointer"
              title="Scan physical product, barcode or photo"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Scan Anything</span>
            </button>

            {/* Voice Multilingual Button */}
            <button
              onClick={() => setShowVoiceDrawer(true)}
              className="inline-flex items-center space-x-1 text-[#1B1A17] hover:text-[#2540D9] font-medium cursor-pointer"
              title="Multilingual Indian Voice"
            >
              <Languages className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Voice</span>
            </button>

            {/* In-App Notifications Hub */}
            <button
              onClick={() => setShowNotifDrawer(true)}
              className="relative p-1 text-[#1B1A17] hover:text-[#2540D9] cursor-pointer"
              title="Notifications Hub"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#D8381C]" />
            </button>

            {/* Buyer DNA Quick Button */}
            <button
              onClick={() => setShowDnaModal(true)}
              className="inline-flex items-center space-x-1 text-[#1B1A17] hover:text-[#2540D9] font-medium cursor-pointer"
              title="Personal Buyer DNA Profile"
            >
              <Dna className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buyer DNA</span>
            </button>

            <span className="text-[#8A8576]">·</span>

            <Link
              href="/vault"
              className="inline-flex items-center space-x-1 text-[#1B1A17] hover:text-[#2540D9] font-medium"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>Vault</span>
            </Link>
            <span className="text-[#8A8576]">·</span>
            <Link
              href="/design"
              className="inline-flex items-center space-x-1 text-[#1B1A17] hover:text-[#2540D9]"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Spec</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-12">
        {/* Section 1: Hero & Intake Card */}
        <section className="space-y-4 pt-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#8A8576]">
            EXHIBIT FILE REF: VDT-2026-INTAKE
          </div>
          <LetterReelHeadline />
          <p className="text-sm md:text-base font-mono text-[#1B1A17]/80 max-w-2xl leading-relaxed">
            A buyer-side AI cross-examination system. We audit seller marketing claims against real owner review evidence, forecast multi-year memory and thermal regret, and simulate what-if adjustments in real time.
          </p>

          <IntakeIndexCard
            onAnalyze={handleAnalyzeMission}
            isLoading={isLoading}
            onOpenScan={() => setShowScanModal(true)}
            onOpenVoice={() => setShowVoiceDrawer(true)}
            missionTextOverride={missionOverride}
          />
        </section>

        {/* Ticker Marquee with real factual claims */}
        <TickerMarquee />

        {/* Section 2: Honest Agent Log */}
        {logs.length > 0 && <HonestAgentLog logs={logs} />}

        {/* Section 3: Post-Analysis Workflows */}
        {profile && activeEvaluation && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* AI Intake Search & Decision Intel Card */}
            {aiIntakeAnswer && (
              <div className="bg-[#FBF7EA] border-2 border-[#1B1A17] rounded-[4px] p-5 md:p-6 paper-shadow relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#1B1A17]/20 gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 bg-[#2540D9] text-white rounded-sm">
                      AI INTAKE SEARCH INTEL
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-[#1F6B4F] flex items-center space-x-1.5 bg-white px-2 py-0.5 rounded border border-[#1F6B4F]/30">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#1F6B4F] animate-pulse" />
                      <span>LOCAL OLLAMA (LLAMA 3.1)</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8A8576] uppercase tracking-wider">
                    {activeEvaluation && (activeEvaluation.product as any).category && (activeEvaluation.product as any).category !== "laptop"
                      ? `GROUNDED IN ${(activeEvaluation.product as any).category.toUpperCase()} INDUSTRY AUDIT`
                      : "GROUNDED IN 30 AUDITED CATALOG PRODUCTS"}
                  </span>
                </div>

                <div className="pt-4">
                  <p className="font-display text-base md:text-lg text-[#1B1A17] leading-relaxed font-medium">
                    {aiIntakeAnswer}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-dashed border-[#1B1A17]/20 flex flex-wrap items-center justify-between text-xs font-mono text-[#8A8576] gap-2">
                  <div>
                    Extracted Target: ₹{profile.budgetInr.toLocaleString("en-IN")} · {profile.years} Yrs
                    {(!activeEvaluation || (activeEvaluation.product as any).category === "laptop") && ` · ${profile.workloads.join(", ")}`}
                    {recommendedSlugs.length > 0 && ` · Recommended: ${recommendedSlugs.join(", ")}`}
                  </div>
                  <button
                    onClick={() => setIsAskOpen(true)}
                    className="text-[#2540D9] hover:underline font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Ask follow-up questions in Case File Chat →</span>
                  </button>
                </div>
              </div>
            )}

            {/* Mission Matrix Builder */}
            <MissionBuilder
              profile={profile}
              assumptions={assumptions}
              clarifyingQuestion={clarifyingQuestion}
              clarifyingQuestions={clarifyingQuestions}
              onSelectOption={(qId, option) => {
                setDiffMessage(`Constraint calibrated: ${option}. Matrix re-evaluated.`);
                if (option.toLowerCase().includes("on-road")) {
                  // Scale target to on-road equivalent
                  handleProfilePatch({ budgetInr: Math.round(profile.budgetInr * 0.88) });
                } else if (option.toLowerCase().includes("ex-showroom")) {
                  handleProfilePatch({ budgetInr: profile.budgetInr });
                }
              }}
              onChange={(updated) => handleProfilePatch(updated)}
            />

            {/* Shortlist of Exhibits (Top 3 Eligible) */}
            <section className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#1B1A17]">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#8A8576]">
                    STAGE 03 / SHORTLIST
                  </span>
                  <h2 className="text-2xl font-bold font-display text-[#1B1A17]">
                    Top Shortlisted Candidates
                  </h2>
                </div>
                <div className="text-xs font-mono text-[#8A8576]">
                  Click candidate card to focus audit
                </div>
              </div>

              {eligibleEvals.length === 0 ? (
                <div className="bg-[#FBF7EA] border-2 border-dashed border-[#D8381C] p-8 rounded text-center space-y-2 font-mono">
                  <ShieldAlert className="w-8 h-8 text-[#D8381C] mx-auto" />
                  <h3 className="font-bold text-base text-[#1B1A17]">No Products Meet Your Hard Constraints</h3>
                  <p className="text-xs text-[#8A8576] max-w-md mx-auto">
                    Try raising your budget or reducing minimum RAM in the What-If Simulator below.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {eligibleEvals.slice(0, 3).map((ev, idx) => (
                    <ExhibitSheet
                      key={ev.product.slug}
                      letter={idx === 0 ? "A" : idx === 1 ? "B" : "C"}
                      evaluation={ev}
                      isSelected={selectedProductSlug === ev.product.slug}
                      onSelect={() => handleSelectProduct(ev.product.slug)}
                      onOpenRadar={(p) => {
                        setRadarProduct(p);
                        setShowRadarModal(true);
                      }}
                      onOpenAutopilot={(p) => {
                        setAutopilotProduct(p);
                        setShowAutopilotModal(true);
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Trade-Off Radar Comparison */}
              {eligibleEvals.length >= 2 && <TradeoffRadar evals={eligibleEvals} />}

              {/* Dismissed Candidates Strip */}
              <DismissedStrip ineligibleEvals={ineligibleEvals} />
            </section>

            {/* Section 4: Signature Moment 2 - The Ownership Strip */}
            <OwnershipStrip
              evaluation={activeEvaluation}
              profile={profile}
              reviews={reviewsMap[activeEvaluation.product.slug] || []}
            />

            {/* Section 5: Price Intelligence & Festive Sale Tracker */}
            <PriceTracker product={activeEvaluation.product} />

            {/* Section 5B: Smart Companion Pairing & Bundle Optimization */}
            <SmartPairingSection product={activeEvaluation.product} />

            {/* Section 6: Claims Ledger & Risk Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Claims Ledger */}
              <ClaimsLedger
                productName={activeEvaluation.product.name}
                claims={claimsAudit}
                isLoading={claimsLoading}
              />

              {/* Risk Accordion Table */}
              <RiskAccordionTable risks={activeEvaluation.risks} />
            </div>

            {/* Section 6: TCO Breakdown & What-If Simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* TCO Breakdown */}
              <TcoBreakdown
                lines={activeEvaluation.tco.lines}
                totalInr={activeEvaluation.tco.totalInr}
                years={profile.years}
                productName={activeEvaluation.product.name}
              />

              {/* Persistent What-If Simulator */}
              <WhatIfPanel
                profile={profile}
                onProfileChange={handleProfilePatch}
                diffMessage={diffMessage}
              />
            </div>

            {/* Final Decision Call to Action */}
            <div className="bg-[#1B1A17] text-[#FBF7EA] rounded-[4px] p-8 text-center space-y-4 paper-shadow-lg">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#F3C94B]">
                FINAL DETERMINISTIC ARBITRATION
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
                Ready to review the official purchase verdict?
              </h2>
              <p className="text-xs sm:text-sm font-mono text-[#F2EBD8]/80 max-w-xl mx-auto">
                Slams the official BUY / WAIT / AVOID stamp with full citation receipts, regret narration, and an exportable warranty .ics reminder.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGetVerdict}
                  className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#2540D9] hover:bg-[#1a31b0] text-white font-mono text-sm font-bold uppercase tracking-wider rounded-full shadow-lg transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Official Verdict & Receipt</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Ask Assistant Pill */}
      {profile && activeEvaluation && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsAskOpen(!isAskOpen)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-[#1B1A17] text-[#FBF7EA] border-2 border-[#F3C94B] shadow-xl hover:bg-[#333] transition font-mono text-xs font-bold cursor-pointer"
          >
            <MessageSquareCode className="w-4 h-4 text-[#F3C94B]" />
            <span>Cross-Examine Q&A</span>
          </button>
        </div>
      )}

      {/* Persistent Ask Drawer */}
      {profile && activeEvaluation && (
        <AskDrawer
          isOpen={isAskOpen}
          onClose={() => setIsAskOpen(false)}
          evaluation={activeEvaluation}
          profile={profile}
          claims={claimsAudit}
        />
      )}

      {/* Verdict Slam & Thermal Receipt Modal */}
      {showVerdictModal && profile && activeEvaluation && (
        <VerdictModal
          evaluation={activeEvaluation}
          verdict={decide(evaluations, profile)}
          profile={profile}
          narration={narration}
          onClose={() => setShowVerdictModal(false)}
          onSave={handleSaveVerdict}
        />
      )}

      {/* VERDICT Price Radar Modal */}
      {showRadarModal && (
        <PriceRadarModal
          product={radarProduct || activeEvaluation?.product || catalog[0]}
          onClose={() => setShowRadarModal(false)}
          onSetAlert={(p) => {
            setAutopilotProduct(p);
            setShowAutopilotModal(true);
          }}
        />
      )}

      {/* Sale Autopilot Rule & Countdown Modal */}
      {showAutopilotModal && (
        <SaleAutopilotModal
          product={autopilotProduct || activeEvaluation?.product || catalog[0]}
          onClose={() => setShowAutopilotModal(false)}
        />
      )}

      {/* Universal Visual & Barcode Scan Modal */}
      {showScanModal && (
        <ScanModal
          onClose={() => setShowScanModal(false)}
          onSelectScannedProduct={(productName) => {
            const query = `Cross-examine the ${productName}. What is its real owner track record and best available price?`;
            setMissionOverride(query);
            handleAnalyzeMission(query);
          }}
        />
      )}

      {/* Multilingual Voice & Speech Drawer */}
      <MultilingualVoiceDrawer
        isOpen={showVoiceDrawer}
        onClose={() => setShowVoiceDrawer(false)}
        currentProductName={activeEvaluation?.product?.name || "Selected Product"}
        onSubmitVoiceMission={(text) => {
          setMissionOverride(text);
          handleAnalyzeMission(text);
        }}
      />

      {/* In-App Notifications Hub Drawer */}
      <NotificationDrawer
        isOpen={showNotifDrawer}
        onClose={() => setShowNotifDrawer(false)}
        onOpenAutopilot={() => setShowAutopilotModal(true)}
      />

      {/* Personal Buyer DNA Modal */}
      {showDnaModal && (
        <BuyerDnaModal
          onClose={() => setShowDnaModal(false)}
          onDnaSaved={(dna) => {
            if (profile) {
              const updatedWeights = applyDnaToWeights(profile.weights, dna);
              handleProfilePatch({ weights: updatedWeights });
              setDiffMessage("Buyer DNA profile applied: scoring weights recalibrated.");
            }
          }}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-[#1B1A17]/20 py-8 px-4 text-center font-mono text-xs text-[#8A8576] space-y-2">
        <p>VERDICT — &ldquo;See beyond the buy.&rdquo; · Built for Hackathon · Zero sponsored rankings</p>
        <p className="text-[10px]">
          All fit scores, RAM headroom projections, and TCO figures are calculated by the deterministic engine in pure TypeScript.
        </p>
      </footer>
    </div>
  );
}
