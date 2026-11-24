import { ResearchReport, SearchPlan, SearchResult } from './types';
import { generateSearchPlan } from './planner';
import { searchService } from './search-service';
import { buildEvidenceLedger, filterAndScoreResults } from './evidence-ledger';
import { extractHardwareSpecs, extractInrPrice, validateRetailUrl } from './normalizer';
import { evaluateRealityCheck } from '../reality-check';

export interface ResearchEngineOptions {
  category?: string;
  industry?: string;
  budgetInr?: number;
  knownCandidates?: string[];
  timeoutMs?: number;
}

export async function conductLiveResearch(
  rawQuery: string,
  options?: ResearchEngineOptions
): Promise<ResearchReport> {
  const startTime = Date.now();

  // 1. Reality Check pre-validation
  const realityCheck = evaluateRealityCheck({
    rawQuery,
    category: options?.category,
    industry: options?.industry,
    budgetInr: options?.budgetInr,
  });

  // If request is impossible/unrealistic budget, return immediately without fake research
  if (!realityCheck.isRealistic || realityCheck.status === 'UNREALISTIC_BUDGET' || realityCheck.status === 'IMPOSSIBLE_REQUIREMENTS') {
    const reason = realityCheck.explanation || realityCheck.headline || 'Budget or requirements are unrealistic for this category.';
    return {
      query: rawQuery,
      isLive: false,
      providerUsed: 'reality_check_guard',
      completedAt: new Date().toISOString(),
      durationMs: Date.now() - startTime,
      totalSources: 0,
      domainsConsulted: [],
      evidenceLedger: [
        {
          id: `ev-reality-${Date.now()}`,
          category: 'price',
          claim: reason,
          confidence: 'high',
          sources: [],
          conflict: false,
          verified: false,
        },
      ],
      plan: {
        originalQuery: rawQuery,
        category: options?.category || 'unknown',
        industry: options?.industry || 'unknown',
        budgetInr: options?.budgetInr,
        hardConstraints: [reason],
        softConstraints: [],
        queries: [],
      },
      rawResultsCount: 0,
      sources: [],
      statusMessage: `Reality Check: ${reason}`,
      verdictConfidence: 'high',
    };
  }

  // 2. Generate multi-query category-aware search plan
  const plan: SearchPlan = generateSearchPlan({
    rawQuery,
    category: options?.category,
    industry: options?.industry,
    budgetInr: options?.budgetInr,
    knownCandidates: options?.knownCandidates,
  });

  // 3. Execute search plan via unified SearchService
  const { results: rawResults, providerUsed, isLive, totalSources } = await searchService.executeSearchPlan(
    plan.queries,
    {
      category: plan.category,
      market: 'in',
      timeoutMs: options?.timeoutMs || 8000,
    }
  );

  // 4. Filter and score results
  const filtered = filterAndScoreResults(rawResults, rawQuery, 0.25);

  // 5. Build structured evidence ledger
  const evidenceLedger = buildEvidenceLedger(filtered);

  // 6. Calculate domains consulted
  const domainSet = new Set<string>();
  for (const r of filtered) {
    if (r.domain) domainSet.add(r.domain);
  }
  const domainsConsulted = Array.from(domainSet);

  // 7. Determine overall confidence
  let verdictConfidence: ResearchReport['verdictConfidence'] = 'unverified';
  if (!isLive || filtered.length === 0) {
    verdictConfidence = 'unverified';
  } else if (filtered.some((r) => r.tier <= 2)) {
    verdictConfidence = 'high';
  } else if (filtered.some((r) => r.tier === 3)) {
    verdictConfidence = 'medium';
  } else {
    verdictConfidence = 'low';
  }

  const durationMs = Date.now() - startTime;
  const statusMessage = isLive
    ? `Live Web Research completed across ${filtered.length} verified sources from ${domainsConsulted.length} domains via ${providerUsed}.`
    : `Live search returned 0 verified results. Falling back to verified catalog knowledge base without fabricating live listings.`;

  return {
    query: rawQuery,
    isLive,
    providerUsed,
    completedAt: new Date().toISOString(),
    durationMs,
    totalSources: filtered.length,
    domainsConsulted,
    evidenceLedger,
    plan,
    rawResultsCount: rawResults.length,
    sources: filtered,
    statusMessage,
    verdictConfidence,
  };
}
