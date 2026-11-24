import { notFound } from "next/navigation";
import Link from "next/link";
import { getVerdictFromStorage } from "@/lib/storage";
import { ThermalReceipt } from "@/components/design-system/ThermalReceipt";
import { RubberStamp } from "@/components/design-system/RubberStamp";
import { inr } from "@/lib/engine";
import { ArrowLeft, CalendarPlus, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const verdict = await getVerdictFromStorage(slug);

  if (!verdict) {
    return {
      title: "Verdict Not Found — VERDICT",
      description: "No verdict record found for this case file.",
    };
  }

  return {
    title: `VERDICT: ${verdict.verdictKind.toUpperCase()} — ${verdict.productName}`,
    description: `Independent purchase audit for ${verdict.productName}. Fit Score: ${Math.round(verdict.fitScore)}/100 · Price: ₹${verdict.priceInr.toLocaleString("en-IN")}. Tested against owner review evidence.`,
    openGraph: {
      title: `VERDICT: ${verdict.verdictKind.toUpperCase()} — ${verdict.productName}`,
      description: `${verdict.reason} Fit score: ${Math.round(verdict.fitScore)}/100.`,
      url: `https://verdict.app/r/${slug}`,
      siteName: "VERDICT — See beyond the buy",
      type: "article",
    },
  };
}

export default async function SharedReceiptPage({ params }: Props) {
  const { slug } = await params;
  const verdict = await getVerdictFromStorage(slug);

  if (!verdict) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12 px-4 max-w-xl mx-auto space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between text-xs font-mono">
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-[#1B1A17] hover:text-[#2540D9]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cross-examine another purchase</span>
        </Link>
        <span className="text-[#8A8576]">VERIFIED CASE FILE</span>
      </div>

      {/* Stamp Header */}
      <div className="text-center py-2">
        <RubberStamp verdict={verdict.verdictKind} caution={verdict.caution} size="lg" />
        <div className="mt-2 text-xs font-mono text-[#8A8576]">
          CONFIDENCE: {Math.round(verdict.confidence * 100)}% · CITATION AUDITED
        </div>
      </div>

      {/* Thermal Receipt */}
      <ThermalReceipt
        caseRef={verdict.slug.toUpperCase()}
        date={new Date(verdict.createdAt).toLocaleDateString("en-GB")}
        title={verdict.productName}
        lines={[
          {
            label: "Purchase Price",
            value: inr(verdict.priceInr),
            provenance: "verified",
          },
          {
            label: "Engine Fit Score",
            value: `${Math.round(verdict.fitScore)} / 100`,
            provenance: "ai_inference",
          },
          {
            label: "Primary Regret Risk",
            value: verdict.topRiskTitle,
            provenance: "assumption",
          },
          {
            label: `Estimated ${verdict.profile.years}-Yr TCO`,
            value: inr(verdict.tcoInr),
            provenance: "assumption",
            isTotal: true,
          },
        ]}
      >
        <div className="space-y-3 font-mono text-xs text-[#1B1A17] pt-2">
          <div>
            <span className="font-bold text-[#8A8576] uppercase text-[10px] block">AUDIT REASON:</span>
            <p className="mt-0.5">{verdict.reason}</p>
          </div>
          <div className="pt-3 border-t border-dashed border-[#1B1A17]/30 flex items-center justify-between">
            <a
              href={`/api/ics?slug=${verdict.slug}`}
              download
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#1B1A17] text-white rounded text-xs hover:bg-[#333]"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Add Warranty Reminder (.ics)</span>
            </a>
            <span className="text-[10px] text-[#1F6B4F] font-bold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Tamper-Sealed</span>
            </span>
          </div>
        </div>
      </ThermalReceipt>
    </div>
  );
}
