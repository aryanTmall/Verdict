import { SearchOptions, SearchProvider, SearchResult } from './types';
import { TavilySearchProvider } from './providers/tavily';
import { BraveSearchProvider } from './providers/brave';
import { DuckDuckGoSearchProvider } from './providers/duckduckgo';

interface CacheEntry {
  results: SearchResult[];
  cachedAt: number;
  ttlMs: number;
}

class SearchService {
  private providers: SearchProvider[];
  private cache = new Map<string, CacheEntry>();

  constructor() {
    this.providers = [
      new TavilySearchProvider(),
      new BraveSearchProvider(),
      new DuckDuckGoSearchProvider(),
    ];
  }

  // Get appropriate TTL depending on query characteristics
  private getTtlForQuery(query: string): number {
    const q = query.toLowerCase();
    if (q.includes('price') || q.includes('deal') || q.includes('discount') || q.includes('buy')) {
      return 30 * 60 * 1000; // 30 minutes for pricing
    }
    if (q.includes('specs') || q.includes('specification') || q.includes('dimensions')) {
      return 24 * 60 * 60 * 1000; // 24 hours for specs
    }
    if (q.includes('release') || q.includes('launch') || q.includes('successor')) {
      return 30 * 24 * 60 * 60 * 1000; // 30 days for release cycles
    }
    return 7 * 24 * 60 * 60 * 1000; // 7 days for reviews and community
  }

  // Normalize URLs to remove tracking queries for deduplication
  public normalizeUrl(rawUrl: string): string {
    try {
      const parsed = new URL(rawUrl);
      const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'tag', 'gclid', 'fbclid'];
      for (const p of trackingParams) {
        parsed.searchParams.delete(p);
      }
      return parsed.toString();
    } catch {
      return rawUrl;
    }
  }

  // Deduplicate and filter results
  public deduplicateResults(results: SearchResult[]): SearchResult[] {
    const seenUrls = new Set<string>();
    const seenDomainTitles = new Set<string>();
    const deduplicated: SearchResult[] = [];

    for (const res of results) {
      const norm = this.normalizeUrl(res.url);
      const domainKey = `${res.domain}::${res.title.slice(0, 30).toLowerCase()}`;

      if (!seenUrls.has(norm) && !seenDomainTitles.has(domainKey)) {
        seenUrls.add(norm);
        seenDomainTitles.add(domainKey);
        deduplicated.push({
          ...res,
          url: norm,
        });
      }
    }

    return deduplicated;
  }

  async searchSingle(query: string, options?: SearchOptions): Promise<{ results: SearchResult[]; provider: string; cached: boolean }> {
    const cacheKey = `${query.trim().toLowerCase()}::${options?.market || 'in'}`;
    const now = Date.now();
    const cached = this.cache.get(cacheKey);

    if (cached && now - cached.cachedAt < cached.ttlMs) {
      return { results: cached.results, provider: 'cache', cached: true };
    }

    // Attempt available providers in order
    for (const provider of this.providers) {
      if (provider.isAvailable()) {
        try {
          const raw = await provider.search(query, options);
          if (raw && raw.length > 0) {
            const clean = this.deduplicateResults(raw);
            this.cache.set(cacheKey, {
              results: clean,
              cachedAt: now,
              ttlMs: this.getTtlForQuery(query),
            });
            return { results: clean, provider: provider.name, cached: false };
          }
        } catch {
          // Fall through to next provider
        }
      }
    }

    return { results: [], provider: 'none', cached: false };
  }

  // Execute multiple planned queries with concurrency control and overall timeout
  async executeSearchPlan(
    queries: { id: string; query: string; purpose: string }[],
    options?: SearchOptions
  ): Promise<{ results: SearchResult[]; providerUsed: string; isLive: boolean; totalSources: number }> {
    if (!queries || queries.length === 0) {
      return { results: [], providerUsed: 'none', isLive: false, totalSources: 0 };
    }

    const allResults: SearchResult[] = [];
    let detectedProvider = 'none';

    // Limit concurrency to 3 simultaneous fetches
    const batchSize = 3;
    const overallTimeoutMs = options?.timeoutMs || 10000;
    const startTime = Date.now();

    for (let i = 0; i < queries.length; i += batchSize) {
      if (Date.now() - startTime > overallTimeoutMs) {
        break; // Guard against exceeding timeout
      }

      const batch = queries.slice(i, i + batchSize);
      const batchPromises = batch.map(async (q) => {
        const res = await this.searchSingle(q.query, { ...options, timeoutMs: 3500 });
        if (res.provider !== 'none' && res.provider !== 'cache') {
          detectedProvider = res.provider;
        } else if (res.provider === 'cache' && detectedProvider === 'none') {
          detectedProvider = 'cache';
        }
        return res.results.map((r) => ({ ...r, queryId: q.id }));
      });

      const batchOut = await Promise.all(batchPromises);
      for (const list of batchOut) {
        allResults.push(...list);
      }
    }

    const unique = this.deduplicateResults(allResults);
    return {
      results: unique,
      providerUsed: detectedProvider,
      isLive: unique.length > 0,
      totalSources: unique.length,
    };
  }
}

export const searchService = new SearchService();
