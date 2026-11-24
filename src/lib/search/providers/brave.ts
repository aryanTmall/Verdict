import { SearchOptions, SearchProvider, SearchResult } from '../types';
import { classifyDomainTier, extractCanonicalDomain } from '../domain-tiers';

export class BraveSearchProvider implements SearchProvider {
  name = 'brave';

  isAvailable(): boolean {
    return Boolean(process.env.BRAVE_SEARCH_API_KEY && process.env.BRAVE_SEARCH_API_KEY.trim().length > 0);
  }

  async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    const apiKey = process.env.BRAVE_SEARCH_API_KEY;
    if (!apiKey) return [];

    const numResults = options?.numResults || 6;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options?.timeoutMs || 5000);

    try {
      const url = new URL('https://api.search.brave.com/res/v1/web/search');
      url.searchParams.set('q', query);
      url.searchParams.set('count', String(numResults));
      if (options?.market === 'in') {
        url.searchParams.set('country', 'IN');
      }

      const response = await fetch(url.toString(), {
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': apiKey,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      const webResults = Array.isArray(data.web?.results) ? data.web.results : [];

      return webResults.map((item: any, index: number): SearchResult => {
        const itemUrl = item.url || '';
        const domain = extractCanonicalDomain(itemUrl);
        const { tier, sourceType } = classifyDomainTier(domain);

        return {
          id: `brave-${Date.now()}-${index}`,
          title: item.title || '',
          url: itemUrl,
          snippet: item.description || '',
          domain,
          datePublished: item.page_age,
          retrievedAt: new Date().toISOString(),
          sourceType,
          relevanceScore: 0.85,
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
