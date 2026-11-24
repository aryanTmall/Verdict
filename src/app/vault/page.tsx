"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RubberStamp } from "@/components/design-system/RubberStamp";
import { inr } from "@/lib/engine";
import type { SavedVerdict } from "@/lib/types";
import { ArrowLeft, ExternalLink, FolderArchive } from "lucide-react";

export default function VaultPage() {
  const [verdicts, setVerdicts] = useState<SavedVerdict[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVerdicts() {
      try {
        const res = await fetch("/api/save");
        const serverData: SavedVerdict[] = await res.json();

        // Also merge local storage index
        const localRaw = localStorage.getItem("verdict_vault");
        const localData: SavedVerdict[] = localRaw ? JSON.parse(localRaw) : [];

        // Combine unique by slug
        const map = new Map<string, SavedVerdict>();
        serverData.forEach((v) => map.set(v.slug, v));
        localData.forEach((v) => map.set(v.slug, v));

        setVerdicts(Array.from(map.values()));
      } catch {
        // Fallback to local
        const localRaw = localStorage.getItem("verdict_vault");
        if (localRaw) setVerdicts(JSON.parse(localRaw));
      } finally {
        setLoading(false);
      }
    }
    fetchVerdicts();
  }, []);

  return (
    <div className="min-h-screen py-10 px-4 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-[#1B1A17]">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#8A8576]">
            AUDIT VAULT ARCHIVE
          </div>
          <h1 className="text-3xl font-extrabold font-display text-[#1B1A17]">
            Saved Purchase Verdicts
          </h1>
        </div>
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#1B1A17] text-white font-mono text-xs rounded hover:bg-[#333]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>New Cross-Examination</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-3 font-mono text-xs text-[#8A8576]">
          <div className="w-6 h-6 border-2 border-[#1B1A17] border-t-transparent rounded-full animate-spin mx-auto" />
          <div>Retrieving case files from evidence vault...</div>
        </div>
      ) : verdicts.length === 0 ? (
        <div className="bg-[#FBF7EA] border-2 border-dashed border-[#1B1A17]/30 rounded p-12 text-center space-y-3 font-mono">
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
                <div className="flex items-center justify-between pb-3 border-b border-[#1B1A17]/20 text-[10px] font-mono text-[#8A8576]">
                  <span>CASE REF: {v.slug.toUpperCase()}</span>
                  <span>{new Date(v.createdAt).toLocaleDateString("en-GB")}</span>
                </div>

                <div className="py-2">
                  <RubberStamp verdict={v.verdictKind} caution={v.caution} size="sm" />
                </div>

                <h3 className="font-bold text-base font-display text-[#1B1A17] mt-1">{v.productName}</h3>

                <div className="mt-2 text-xs font-mono space-y-1 text-[#1B1A17]">
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

                <p className="mt-3 text-xs font-mono text-[#8A8576] line-clamp-2 italic">
                  &ldquo;{v.reason}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-[#1B1A17]/20 flex items-center justify-between">
                <Link
                  href={`/r/${v.slug}`}
                  className="inline-flex items-center space-x-1 text-xs font-mono font-bold text-[#2540D9] hover:underline"
                >
                  <span>Open Full Receipt</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <a
                  href={`/api/ics?slug=${v.slug}`}
                  download
                  className="text-[11px] font-mono text-[#8A8576] hover:text-[#1B1A17]"
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
  );
}
