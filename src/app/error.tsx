"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("VERDICT Page Error Captured:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F2EBD8] text-[#1B1A17] flex items-center justify-center p-4 sm:p-8 font-mono">
      <div className="max-w-md w-full bg-[#FBF7EA] border-2 border-[#1B1A17] rounded-[4px] p-6 sm:p-8 paper-shadow space-y-5 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#D8381C]/10 border border-[#D8381C] flex items-center justify-center text-[#D8381C]">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-[#8A8576]">
            COURTROOM EVIDENCE ADMISSIBILITY HALT
          </div>
          <h2 className="text-xl font-bold font-display text-[#1B1A17]">
            Decision File Interrupted
          </h2>
          <p className="text-xs text-[#8A8576] leading-relaxed pt-1">
            An unexpected error occurred while rendering the cross-examination exhibits. Your previous inputs have been preserved.
          </p>
        </div>

        {error.message && (
          <div className="bg-[#1B1A17]/5 p-2.5 rounded border border-[#1B1A17]/20 text-[11px] text-[#D8381C] text-left break-words">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-[#2540D9] hover:bg-[#1a31b0] text-white text-xs font-bold rounded shadow transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Cross-Examination</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-white hover:bg-[#F2EBD8] text-[#1B1A17] border border-[#1B1A17]/30 text-xs font-semibold rounded transition cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Reset to Homepage</span>
          </Link>
        </div>

        <div className="text-[10px] text-[#8A8576] pt-2 border-t border-[#1B1A17]/10">
          VERDICT — See beyond the buy · Autonomous Fault Recovery
        </div>
      </div>
    </div>
  );
}
