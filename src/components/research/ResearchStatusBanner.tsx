"use client";

import React, { useState } from "react";
import { Search, ShieldCheck, ExternalLink, AlertTriangle, Layers, ChevronDown, ChevronUp, Database } from "lucide-react";
import type { ResearchReport } from "@/lib/search/types";

interface Props {
  report?: ResearchReport;
}

export function ResearchStatusBanner({ report }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!report) return null;

  const isLive = report.isLive && report.totalSources > 0;

  return (
    <div className="mb-6 rounded-xl border border-stone-800 bg-stone-900/80 p-4 shadow-lg backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              isLive
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
            }`}
          >
            {isLive ? <Search className="h-5 w-5" /> : <Database className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-stone-200">
                {isLive ? "Live Web Research Completed" : "Audited Evidence Vault"}
              </span>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  report.verdictConfidence === "high"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    : report.verdictConfidence === "medium"
                    ? "bg-sky-950 text-sky-300 border border-sky-800"
                    : "bg-stone-800 text-stone-400"
                }`}
              >
                {report.verdictConfidence} Confidence
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">{report.statusMessage}</p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-800/80 px-3 py-1.5 text-xs font-medium text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
        >
          <Layers className="h-3.5 w-3.5 text-stone-400" />
          <span>{expanded ? "Hide Search Trace" : `Inspect Evidence (${report.totalSources} Sources)`}</span>
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-stone-800 pt-4 space-y-4 text-xs">
          {/* Query Execution Plan */}
          {report.plan?.queries && report.plan.queries.length > 0 && (
            <div>
              <h4 className="font-semibold text-stone-300 uppercase tracking-wider text-[11px] mb-2">
                Multi-Query Category Search Plan (A–H)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {report.plan.queries.map((q) => (
                  <div key={q.id} className="rounded-lg border border-stone-800/90 bg-stone-950/60 p-2.5">
                    <div className="flex items-center justify-between text-stone-400 mb-1">
                      <span className="font-semibold text-emerald-400">Query {q.id}: {q.label}</span>
                      <span className="text-[10px] text-stone-500">P{q.priority}</span>
                    </div>
                    <code className="block text-[11px] text-stone-300 truncate font-mono bg-stone-900/60 px-1 py-0.5 rounded">
                      {q.query}
                    </code>
                    <p className="text-[10px] text-stone-500 mt-1">{q.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Ledger */}
          {report.evidenceLedger && report.evidenceLedger.length > 0 && (
            <div>
              <h4 className="font-semibold text-stone-300 uppercase tracking-wider text-[11px] mb-2">
                Synthesized Evidence Ledger
              </h4>
              <div className="space-y-2">
                {report.evidenceLedger.map((ev) => (
                  <div
                    key={ev.id}
                    className={`rounded-lg border p-3 ${
                      ev.conflict
                        ? "border-amber-700/60 bg-amber-950/20"
                        : "border-stone-800 bg-stone-950/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-medium text-stone-200 capitalize">
                        [{ev.category}] {ev.claim}
                      </span>
                      {ev.conflict && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">
                          <AlertTriangle className="h-3 w-3" /> Discrepancy Flagged
                        </span>
                      )}
                    </div>
                    {ev.conflictDetails && (
                      <p className="text-[11px] text-amber-300/90 mb-2 font-mono">
                        {ev.conflictDetails}
                      </p>
                    )}
                    {ev.sources && ev.sources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {ev.sources.map((s, idx) => (
                          <a
                            key={idx}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded bg-stone-900 px-2 py-1 text-[10px] text-stone-400 hover:text-white border border-stone-800 hover:border-stone-600 transition"
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                s.tier === 1 ? "bg-emerald-400" : s.tier === 2 ? "bg-sky-400" : "bg-amber-400"
                              }`}
                            />
                            <span>Tier {s.tier}: {s.domain}</span>
                            <ExternalLink className="h-2.5 w-2.5 text-stone-500" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sourced Domains Consulted */}
          {report.domainsConsulted && report.domainsConsulted.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-800/60 text-stone-400 text-[11px]">
              <span className="font-medium text-stone-500">Verified Domains:</span>
              {report.domainsConsulted.map((d) => (
                <span key={d} className="rounded bg-stone-800/60 px-1.5 py-0.5 text-stone-300">
                  {d}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
