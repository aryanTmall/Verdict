import { SearchOptions, SearchProvider, SearchResult } from '../types';
import { classifyDomainTier, extractCanonicalDomain } from '../domain-tiers';

export class TavilySearchProvider implements SearchProvider {
  name = 'tavily';

  isAvailable(): boolean {
    return Boolean(process.env.TAVILY_API_KEY && process.env.TAVILY_API_KEY.trim().length > 0);
  }

  async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) return [];

    const numResults = options?.numResults || 6;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options?.timeoutMs || 5000);

    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: apiKey,
          query,
          search_depth: 'advanced',
          include_answer: false,
          include_raw_content: false,
          max_results: numResults,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      const results = Array.isArray(data.results) ? data.results : [];

      return results.map((item: any, index: number): SearchResult => {
        const url = item.url || '';
        const domain = extractCanonicalDomain(url);
        const { tier, sourceType } = classifyDomainTier(domain);

        return {
          id: `tavily-${Date.now()}-${index}`,
          title: item.title || '',
          url,
          snippet: item.content || item.snippet || '',
          domain,
          datePublished: item.published_date,
          retrievedAt: new Date().toISOString(),
          sourceType,
          relevanceScore: typeof item.score === 'number' ? Math.min(1, Math.max(0, item.score)) : 0.85,
          tier,
        };
      });
    } catch {
      return [];
    } finally {
      clearTimeout(timeout);
    }
  }
}
