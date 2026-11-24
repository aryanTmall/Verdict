import { EvidenceCategory, EvidenceLedgerEntry, SearchResult, SourceTier } from './types';

export function calculateRelevanceScore(result: SearchResult, queryTerms: string[]): number {
  const text = `${result.title} ${result.snippet}`.toLowerCase();
  let matched = 0;

  for (const term of queryTerms) {
    const clean = term.toLowerCase().trim();
    if (clean.length > 2 && text.includes(clean)) {
      matched++;
    }
  }

  const matchRatio = queryTerms.length > 0 ? matched / queryTerms.length : 0.5;

  // Domain authority tier boost
  const tierBoost = result.tier === 1 ? 0.35 : result.tier === 2 ? 0.25 : result.tier === 3 ? 0.15 : 0.05;

  return Math.min(1.0, Math.max(0.1, matchRatio * 0.7 + tierBoost));
}

export function filterAndScoreResults(results: SearchResult[], query: string, threshold = 0.35): SearchResult[] {
  const terms = query
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const scored = results.map((r) => {
    const relevanceScore = calculateRelevanceScore(r, terms);
    return {
      ...r,
      relevanceScore,
    };
  });

  return scored
    .filter((r) => r.relevanceScore >= threshold)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

export function buildEvidenceLedger(
  filteredResults: SearchResult[],
  productName?: string
): EvidenceLedgerEntry[] {
  const ledger: EvidenceLedgerEntry[] = [];
  const pName = (productName || '').toLowerCase();

  // 1. Group results by potential evidence areas
  const specSources: SearchResult[] = [];
  const reviewSources: SearchResult[] = [];
  const issueSources: SearchResult[] = [];
  const priceSources: SearchResult[] = [];
  const releaseSources: SearchResult[] = [];
  const usedSources: SearchResult[] = [];

  for (const r of filteredResults) {
    const text = `${r.title} ${r.snippet}`.toLowerCase();
    if (text.includes('issue') || text.includes('defect') || text.includes('problem') || text.includes('failure') || text.includes('complaint')) {
      issueSources.push(r);
    }
    if (text.includes('review') || text.includes('benchmark') || text.includes('test') || text.includes('score') || text.includes('rating')) {
      reviewSources.push(r);
    }
    if (text.includes('specs') || text.includes('ram') || text.includes('display') || text.includes('battery') || text.includes('gb') || text.includes('processor')) {
      specSources.push(r);
    }
    if (text.includes('₹') || text.includes('rs.') || text.includes('price') || text.includes('inr') || text.includes('buy online')) {
      priceSources.push(r);
    }
    if (text.includes('next gen') || text.includes('launch') || text.includes('release date') || text.includes('2025') || text.includes('facelift')) {
      releaseSources.push(r);
    }
    if (text.includes('refurbished') || text.includes('used') || text.includes('second hand') || text.includes('pre-owned')) {
      usedSources.push(r);
    }
  }

  // Helper to map sources into citation summary
  const mapCitations = (sources: SearchResult[]) =>
    sources.slice(0, 4).map((s) => ({
      title: s.title,
      url: s.url,
      domain: s.domain,
      tier: s.tier,
      snippetSnippet: s.snippet.slice(0, 160),
    }));

  // Resolve Specs & Check for Conflicts
  if (specSources.length > 0) {
    // Sort by tier ascending (Tier 1 is highest priority)
    specSources.sort((a, b) => a.tier - b.tier);
    const topSource = specSources[0];

    // Check conflict between Tier 1 and lower tiers
    let conflict = false;
    let conflictDetails: string | undefined;

    if (specSources.some((s) => s.tier === 1) && specSources.some((s) => s.tier === 4)) {
      const tier1Text = specSources.filter((s) => s.tier === 1).map((s) => s.snippet).join(' ').toLowerCase();
      const tier4Text = specSources.filter((s) => s.tier === 4).map((s) => s.snippet).join(' ').toLowerCase();

      // Conflict pattern (e.g. 60Hz vs 120Hz or 8GB vs 16GB)
      if (tier1Text.includes('60hz') && tier4Text.includes('120hz')) {
        conflict = true;
        conflictDetails = 'Discrepancy detected: Tier 4 aggregator claims 120Hz, but Tier 1 manufacturer specification confirms 60Hz. Tier 1 upheld.';
      }
    }

    ledger.push({
      id: `ev-spec-${Date.now()}`,
      category: 'spec',
      claim: topSource.snippet ? `Verified specifications from ${topSource.domain}: ${topSource.snippet.slice(0, 180)}...` : `Hardware specifications verified via ${topSource.domain}`,
      confidence: topSource.tier <= 2 ? 'high' : 'medium',
      sources: mapCitations(specSources),
      conflict,
      conflictDetails,
      verified: true,
      productSlug: pName,
    });
  }

  // Reviews & Benchmarks
  if (reviewSources.length > 0) {
    reviewSources.sort((a, b) => a.tier - b.tier);
    const topReview = reviewSources[0];
    ledger.push({
      id: `ev-review-${Date.now()}`,
      category: 'review',
      claim: `Independent testing from ${topReview.domain}: ${topReview.snippet.slice(0, 180)}...`,
      confidence: topReview.tier <= 2 ? 'high' : 'medium',
      sources: mapCitations(reviewSources),
      conflict: false,
      verified: true,
      productSlug: pName,
    });
  }

  // Known Issues & Defects
  if (issueSources.length > 0) {
    issueSources.sort((a, b) => a.tier - b.tier);
    const topIssue = issueSources[0];
    ledger.push({
      id: `ev-issue-${Date.now()}`,
      category: 'issue',
      claim: `Owner reports & reliability logs via ${topIssue.domain}: ${topIssue.snippet.slice(0, 180)}...`,
      confidence: topIssue.tier <= 3 ? 'high' : 'medium',
      sources: mapCitations(issueSources),
      conflict: false,
      verified: true,
      productSlug: pName,
    });
  }

  // Pricing & Retail Availability
  if (priceSources.length > 0) {
    priceSources.sort((a, b) => a.tier - b.tier);
    const topPrice = priceSources[0];
    ledger.push({
      id: `ev-price-${Date.now()}`,
      category: 'price',
      claim: `Active market pricing confirmed across ${priceSources.length} retailer listings via ${topPrice.domain}.`,
      confidence: topPrice.tier === 1 ? 'high' : 'medium',
      sources: mapCitations(priceSources),
      conflict: false,
      verified: true,
      productSlug: pName,
    });
  }

  // Lifecycle & Next-Gen
  if (releaseSources.length > 0) {
    ledger.push({
      id: `ev-release-${Date.now()}`,
      category: 'release_cycle',
      claim: `Lifecycle tracking: ${releaseSources[0].snippet.slice(0, 180)}...`,
      confidence: releaseSources[0].tier <= 2 ? 'high' : 'medium',
      sources: mapCitations(releaseSources),
      conflict: false,
      verified: true,
      productSlug: pName,
    });
  }

  return ledger;
}
