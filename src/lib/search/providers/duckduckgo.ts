import { SearchOptions, SearchProvider, SearchResult } from '../types';
import { classifyDomainTier, extractCanonicalDomain } from '../domain-tiers';

export class DuckDuckGoSearchProvider implements SearchProvider {
  name = 'duckduckgo_lite';

  isAvailable(): boolean {
    return true; // Zero-key default available
  }

  async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options?.timeoutMs || 4000);

    try {
      // First try DuckDuckGo HTML endpoint
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const res = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'text/html,application/xhtml+xml',
        },
        body: `q=${encodeURIComponent(query)}&b=`,
        signal: controller.signal,
      });

      if (!res.ok) {
        return this.searchInstantAnswer(query, options);
      }

      const html = await res.text();
      const results: SearchResult[] = [];

      // Extract result blocks
      const linkRegex = /<a class="result__url" href="([^"]+)">([^<]+)<\/a>/g;
      const titleSnippetRegex = /<h2 class="result__title">[\s\S]*?<a class="result__snippet" href="([^"]+)">([\s\S]*?)<\/a>[\s\S]*?<a class="result__snippet"[\s\S]*?>([\s\S]*?)<\/a>/g;

      // Alternative simpler regex for DuckDuckGo HTML
      const blockRegex = /<div class="result__body">[\s\S]*?<a class="result__url" href="([^"]+)">[\s\S]*?<\/a>[\s\S]*?<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;

      let match: RegExpExecArray | null;
      let count = 0;
      const limit = options?.numResults || 5;

      // Parse standard DDG result items
      const resultItemRegex = /<div class="result results_links results_links_deep[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;
      const items = html.match(resultItemRegex) || [];

      for (const item of items) {
        if (count >= limit) break;

        // Title and link
        const urlMatch = item.match(/<a class="result__url" href="([^"]+)"/);
        const titleMatch = item.match(/<a class="result__snippet"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/) ||
          item.match(/<a class="result__url"[^>]*>([\s\S]*?)<\/a>/);
        const snippetMatch = item.match(/<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);

        let rawUrl = urlMatch ? urlMatch[1] : '';
        // DDG redirects like //duckduckgo.com/l/?uddg=https%3A%2F%2F...
        if (rawUrl.includes('uddg=')) {
          const actualUrl = new URL(rawUrl.startsWith('http') ? rawUrl : `https:${rawUrl}`).searchParams.get('uddg');
          if (actualUrl) rawUrl = actualUrl;
        }

        if (rawUrl && !rawUrl.includes('duckduckgo.com')) {
          const domain = extractCanonicalDomain(rawUrl);
          const { tier, sourceType } = classifyDomainTier(domain);
          const cleanSnippet = (snippetMatch ? snippetMatch[1] : '')
            .replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .trim();

          const cleanTitle = (titleMatch ? titleMatch[2] || titleMatch[1] : domain)
            .replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .trim();

          results.push({
            id: `ddg-${Date.now()}-${count}`,
            title: cleanTitle || domain,
            url: rawUrl,
            snippet: cleanSnippet || `${cleanTitle} on ${domain}`,
            domain,
            retrievedAt: new Date().toISOString(),
            sourceType,
            relevanceScore: 0.8,
            tier,
          });
          count++;
        }
      }

      if (results.length > 0) {
        return results;
      }

      return this.searchInstantAnswer(query, options);
    } catch {
      return this.searchInstantAnswer(query, options);
    } finally {
      clearTimeout(timeout);
    }
  }

  private async searchInstantAnswer(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    try {
      const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      const res = await fetch(url);
      if (!res.ok) return [];

      const data = await res.json();
      const results: SearchResult[] = [];

      if (data.AbstractURL && data.AbstractText) {
        const domain = extractCanonicalDomain(data.AbstractURL);
        const { tier, sourceType } = classifyDomainTier(domain);
        results.push({
          id: `ddg-ia-${Date.now()}-0`,
          title: data.Heading || data.AbstractSource || query,
          url: data.AbstractURL,
          snippet: data.AbstractText,
          domain,
          retrievedAt: new Date().toISOString(),
          sourceType,
          relevanceScore: 0.85,
          tier,
        });
      }

      if (Array.isArray(data.RelatedTopics)) {
        for (let i = 0; i < Math.min(data.RelatedTopics.length, 3); i++) {
          const item = data.RelatedTopics[i];
          if (item.FirstURL && item.Text) {
            const domain = extractCanonicalDomain(item.FirstURL);
            const { tier, sourceType } = classifyDomainTier(domain);
            results.push({
              id: `ddg-ia-${Date.now()}-${i + 1}`,
              title: item.Text.split(' - ')[0] || query,
              url: item.FirstURL,
              snippet: item.Text,
              domain,
              retrievedAt: new Date().toISOString(),
              sourceType,
              relevanceScore: 0.75,
              tier,
            });
          }
        }
      }

      return results;
    } catch {
      return [];
    }
  }
}
