export type SourceType =
  | 'retailer'
  | 'review_publication'
  | 'forum_community'
  | 'official_manufacturer'
  | 'news'
  | 'benchmark'
  | 'classifieds'
  | 'general';

export type SourceTier = 1 | 2 | 3 | 4;

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  domain: string;
  datePublished?: string;
  retrievedAt: string;
  sourceType: SourceType;
  relevanceScore: number;
  tier: SourceTier;
  queryId?: string;
}

export interface SearchOptions {
  category?: string;
  market?: string; // e.g. 'in' for India
  numResults?: number;
  maxAgeDays?: number;
  timeoutMs?: number;
}

export interface SearchProvider {
  name: string;
  isAvailable(): boolean;
  search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
}

export type QueryPurposeId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';

export interface PlannedQuery {
  id: QueryPurposeId;
  label: string;
  query: string;
  purpose: string;
  priority: number;
}

export interface SearchPlan {
  originalQuery: string;
  category: string;
  industry: string;
  budgetInr?: number;
  hardConstraints: string[];
  softConstraints: string[];
  queries: PlannedQuery[];
}

export type EvidenceCategory =
  | 'spec'
  | 'price'
  | 'review'
  | 'issue'
  | 'regret'
  | 'release_cycle'
  | 'used_market';

export interface EvidenceLedgerEntry {
  id: string;
  category: EvidenceCategory;
  claim: string;
  confidence: 'high' | 'medium' | 'low';
  sources: {
    title: string;
    url: string;
    domain: string;
    tier: SourceTier;
    snippetSnippet?: string;
  }[];
  conflict: boolean;
  conflictDetails?: string;
  verified: boolean;
  productSlug?: string;
}

export interface ResearchReport {
  query: string;
  isLive: boolean;
  providerUsed: string;
  completedAt: string;
  durationMs: number;
  totalSources: number;
  domainsConsulted: string[];
  evidenceLedger: EvidenceLedgerEntry[];
  plan: SearchPlan;
  rawResultsCount: number;
  sources: SearchResult[];
  statusMessage: string;
  verdictConfidence: 'high' | 'medium' | 'low' | 'unverified';
}
